import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Comment, CommentService } from '@entities/comment';

@Component({
  selector: 'app-comments-moderation-page',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './comments-moderation.component.html',
  styleUrls: ['./comments-moderation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsModerationComponent {
  private readonly commentService = inject(CommentService);

  isLoading = signal(true);
  comments = signal<Comment[]>([]);
  total = signal(0);

  constructor() {
    this.load();
  }

  private load(): void {
    this.isLoading.set(true);
    this.commentService.adminList(1, 50).subscribe({
      next: (response) => {
        this.comments.set(response.items);
        this.total.set(response.total);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  materialTitle(comment: Comment): string {
    return typeof comment.material === 'string' ? comment.material : comment.material.title;
  }

  remove(comment: Comment): void {
    if (!confirm($localize`Delete this comment?`)) {
      return;
    }
    this.commentService.remove(comment._id).subscribe(() => {
      this.comments.update((list) => list.filter((c) => c._id !== comment._id));
      this.total.update((t) => t - 1);
    });
  }
}
