import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Comment, CommentService } from '@entities/comment';
import { SessionStore } from '@shared/auth';

@Component({
  selector: 'app-material-comments',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './material-comments.component.html',
  styleUrls: ['./material-comments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialCommentsComponent {
  private readonly commentService = inject(CommentService);
  private readonly sessionStore = inject(SessionStore);

  materialId = input.required<string>();
  countChanged = output<number>();

  comments = signal<Comment[]>([]);
  isLoading = signal(true);
  newText = signal('');
  isSubmitting = signal(false);

  isAuthenticated = this.sessionStore.isAuthenticated;
  currentUserId = computed(() => this.sessionStore.currentUser()?._id);
  isAdmin = this.sessionStore.isAdmin;

  constructor() {
    this.load();
  }

  private load(): void {
    this.isLoading.set(true);
    this.commentService.listForMaterial(this.materialId(), 1, 50).subscribe({
      next: (response) => {
        this.comments.set(response.items);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  canDelete(comment: Comment): boolean {
    return this.isAdmin() || comment.author._id === this.currentUserId();
  }

  submit(): void {
    const text = this.newText().trim();
    if (!text || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.commentService.create(this.materialId(), text).subscribe({
      next: (comment) => {
        this.comments.update((list) => [comment, ...list]);
        this.newText.set('');
        this.isSubmitting.set(false);
        this.countChanged.emit(1);
      },
      error: () => this.isSubmitting.set(false),
    });
  }

  remove(comment: Comment): void {
    this.commentService.remove(comment._id).subscribe(() => {
      this.comments.update((list) => list.filter((c) => c._id !== comment._id));
      this.countChanged.emit(-1);
    });
  }
}
