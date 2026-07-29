import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AutocompleteList, AutocompleteListService } from '@entities/autocomplete';
import { InstitutionFormModalComponent } from '@pages/admin/ui/institution-form-modal/institution-form-modal.component';
import { SubjectFormModalComponent } from '@pages/admin/ui/subject-form-modal/subject-form-modal.component';

const INSTITUTIONS_LIST_KEY = 'educational-institutions';

/**
 * School/University items and School-Subject/University-Specialty items are both `AutocompleteItem`
 * rows, distinguished only by which list they belong to. Angular route config can't branch
 * `loadComponent` on that runtime value, so this thin dispatcher resolves the list by `listId`
 * and renders the matching form modal.
 */
@Component({
  selector: 'app-autocomplete-item-form-dispatcher',
  imports: [InstitutionFormModalComponent, SubjectFormModalComponent],
  template: `
    @if (isInstitutionsList() === true) {
    <app-institution-form-modal />
    } @else if (isInstitutionsList() === false) {
    <app-subject-form-modal />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteItemFormDispatcherComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly autocompleteListService = inject(AutocompleteListService);

  list = signal<AutocompleteList | null>(null);
  isInstitutionsList = computed<boolean | null>(() => {
    const list = this.list();
    return list ? list.key === INSTITUTIONS_LIST_KEY : null;
  });

  ngOnInit(): void {
    const listId = this.route.snapshot.paramMap.get('listId') ?? '';
    this.autocompleteListService.getById(listId).subscribe((list) => this.list.set(list));
  }
}
