import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Place } from '../../models/place.model';
import { GameService } from '../../services/game.service';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {
  @Input() place: Place | null = null;

  constructor(
    private gameService: GameService,
    private gameStateService: GameStateService
  ) {}

  onYes(): void {
    if (this.place) {
      this.gameStateService.completePlace(this.place.id);
      this.gameService.startMiniGame(this.place);
    }
  }

  onNo(): void {
    this.gameService.closePopup();
  }

  isCompleted(): boolean {
    return this.place ? this.gameStateService.isPlaceCompleted(this.place.id) : false;
  }
}
