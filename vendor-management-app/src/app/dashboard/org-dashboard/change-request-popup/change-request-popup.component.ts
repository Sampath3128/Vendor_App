import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-change-request-popup',
  templateUrl: './change-request-popup.component.html',
  styleUrls: ['./change-request-popup.component.css']
})
export class ChangeRequestPopupComponent {
  @Input() showModal: boolean = false;
  @Input() requestComparisonData: any;
  @Output() closeModal = new EventEmitter<void>();

  // Close the modal
  close(): void {
    this.closeModal.emit();
  }
}
