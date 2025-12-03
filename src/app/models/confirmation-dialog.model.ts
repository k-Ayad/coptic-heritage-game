export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  type?: 'warning' | 'info' | 'success' | 'error';
}

export const DEFAULT_CONFIRMATION_DATA: ConfirmationDialogData = {
  title: 'Confirm',
  message: 'Are you sure?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  showCancel: true,
  type: 'warning'
};
