import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Comment, CommentService } from '@entities/comment';
import { TranslatePipe } from '@shared/pipes';
import { TranslationService } from '@shared/services';
import { IconButtonComponent, PaginationComponent, SearchInputComponent } from '@shared/ui';
import { ListFilterSidebarComponent } from '@widgets/admin';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-comments-moderation-page',
  standalone: true,
  imports: [CommonModule, DatePipe, PaginationComponent, SearchInputComponent, ListFilterSidebarComponent, IconButtonComponent, TranslatePipe],
  templateUrl: './comments-moderation.component.html',
  styleUrls: ['./comments-moderation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsModerationComponent {
  private readonly commentService = inject(CommentService);
  private readonly i18n = inject(TranslationService);

  isLoading = signal(true);
  comments = signal<Comment[]>([]);
  total = signal(0);
  page = signal(1);
  limit = PAGE_SIZE;
  searchTerm = signal('');

  constructor() {
    this.load();
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.page.set(1);
    this.load();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.load();
  }

  private load(): void {
    this.isLoading.set(true);
    this.commentService.adminList(this.page(), this.limit, this.searchTerm()).subscribe({
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
    if (!confirm(this.i18n.translate('admin.commentsModeration.confirmDelete'))) {
      return;
    }
    this.commentService.remove(comment._id).subscribe(() => {
      this.comments.update((list) => list.filter((c) => c._id !== comment._id));
      this.total.update((t) => t - 1);
    });
  }
}
