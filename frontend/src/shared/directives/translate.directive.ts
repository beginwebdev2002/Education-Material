import { Directive, ElementRef, effect, inject, input } from '@angular/core';
import { TranslationService } from '@shared/services';

@Directive({
    selector: '[translate]',
    standalone: true,
})
export class TranslateDirective {
    private el = inject(ElementRef<HTMLElement>);
    private i18n = inject(TranslationService);

    key = input.required<string>({ alias: 'translate' });
    params = input<Record<string, string | number> | undefined>(undefined, { alias: 'translateParams' });

    constructor() {
        effect(() => {
            this.el.nativeElement.textContent = this.i18n.translate(this.key(), this.params());
        });
    }
}
