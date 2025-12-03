import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  constructor(public dialogService: ConfirmationDialogService) {}

  onConfirm(): void {
    this.dialogService.onConfirm();
  }

  onCancel(): void {
    this.dialogService.onCancel();
  }

  getIconEmoji(): string {
    const type = this.dialogService.dialogData().type;
    switch (type) {
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  }
}
