export type GamePopupType = 'entry' | 'completion' | 'none';

export interface GamePopupData {
  type: GamePopupType;
  title: string;
  message: string;
  details?: string;
  passed?: boolean;
  showStartButton?: boolean;
  showCloseButton?: boolean;
}

export const DEFAULT_POPUP_DATA: GamePopupData = {
  type: 'none',
  title: '',
  message: '',
  showStartButton: false,
  showCloseButton: false
};
