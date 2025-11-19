import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-popup.component.html',
  styleUrls: ['./game-popup.component.scss']
})
export class GamePopupComponent {
  constructor(public gameService: GameService) {}

  onStart(): void {
    this.gameService.startMiniGamePlay();
  }

  onClose(): void {
    this.gameService.closeGamePopup();
  }
}
