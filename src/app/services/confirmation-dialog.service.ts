import { Injectable, signal } from '@angular/core';
import { ConfirmationDialogData, DEFAULT_CONFIRMATION_DATA } from '../models/confirmation-dialog.model';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {
  showDialog = signal<boolean>(false);
  dialogData = signal<ConfirmationDialogData>({ ...DEFAULT_CONFIRMATION_DATA });
  
  private resolveCallback: ((result: boolean) => void) | null = null;

  confirm(data: Partial<ConfirmationDialogData>): Promise<boolean> {
    return new Promise((resolve) => {
      this.dialogData.set({
        ...DEFAULT_CONFIRMATION_DATA,
        ...data
      });
      this.showDialog.set(true);
      this.resolveCallback = resolve;
    });
  }

  alert(title: string, message: string, type: 'info' | 'success' | 'error' = 'info'): Promise<boolean> {
    return this.confirm({
      title,
      message,
      confirmText: 'OK',
      showCancel: false,
      type
    });
  }

  onConfirm(): void {
    this.showDialog.set(false);
    if (this.resolveCallback) {
      this.resolveCallback(true);
      this.resolveCallback = null;
    }
  }

  onCancel(): void {
    this.showDialog.set(false);
    if (this.resolveCallback) {
      this.resolveCallback(false);
      this.resolveCallback = null;
    }
  }
}
