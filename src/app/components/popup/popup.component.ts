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
      // Check if this place has a mini-game
      if (this.gameService.hasMiniGame(this.place.id)) {
        this.gameService.startMiniGame(this.place);
      } else {
        // No mini-game, just mark as completed and show alert
        this.gameStateService.completePlace(this.place.id);
        this.gameService.closePopup();
        alert(`Mini-game coming soon: ${this.place.name} - ${this.place.description}`);
      }
    }
  }

  onNo(): void {
    this.gameService.closePopup();
  }

  isCompleted(): boolean {
    return this.place ? this.gameStateService.isPlaceCompleted(this.place.id) : false;
  }

  hasMiniGame(): boolean {
    return this.place ? this.gameService.hasMiniGame(this.place.id) : false;
  }

  hasPassedMiniGame(): boolean {
    return this.place ? this.gameService.hasPassedMiniGame(this.place.id) : false;
  }

  getPopupMessage(): string {
    if (!this.place) return '';
    
    if (this.hasMiniGame()) {
      if (this.hasPassedMiniGame()) {
        return `Would you like to revisit the ${this.place.name} Mini-Game?`;
      } else {
        return `Would you like to start the ${this.place.name} Mini-Game?`;
      }
    } else {
      if (this.isCompleted()) {
        return 'Would you like to revisit this experience?';
      } else {
        return 'Would you like to start this Coptic heritage experience?';
      }
    }
  }

  getButtonText(): string {
    if (!this.place) return 'Yes, Let\'s Begin!';
    
    if (this.hasMiniGame()) {
      return this.hasPassedMiniGame() ? 'Play Again' : 'Yes, Let\'s Begin!';
    } else {
      return this.isCompleted() ? 'Revisit' : 'Yes, Let\'s Begin!';
    }
  }
}
