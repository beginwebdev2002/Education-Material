import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, input, output, viewChild } from '@angular/core';
import { Modal } from 'flowbite';
import { TranslatePipe } from '@shared/pipes';

@Component({
  selector: 'app-modal',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements AfterViewInit, OnDestroy {
  title = input<string>('');
  closed = output<void>();

  private readonly modalRootRef = viewChild.required<ElementRef<HTMLDivElement>>('modalRoot');
  private modal?: Modal;

  ngAfterViewInit(): void {
    this.modal = new Modal(this.modalRootRef().nativeElement, {
      onHide: () => this.closed.emit(),
    });
    this.modal.show();
  }

  ngOnDestroy(): void {
    this.modal?.destroy();
  }

  close(): void {
    this.modal?.hide();
  }
}
