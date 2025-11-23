import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  @Output() startGame = new EventEmitter<void>();
  @Output() resetGame = new EventEmitter<void>();

  constructor(
    private gameService: GameService,
    public gameStateService: GameStateService
  ) {}

  onStartGame(): void {
    this.startGame.emit();
  }

  onResetProgress(): void {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      // Reset game state (score, completed places)
      this.gameStateService.resetProgress();
      
      // Reset mini-game state (completion badges, results)
      this.gameService.resetMiniGames();
      
      // Reset character position to start
      this.gameService.resetCharacterPosition();
      
      // Emit reset event
      this.resetGame.emit();
    }
  }

  // Check if any progress exists (score OR icon puzzles solved)
  hasAnyProgress(): boolean {
    // Check score
    if (this.gameStateService.gameState().score > 0) {
      return true;
    }

    // Check if any icon puzzle has been solved
    try {
      const iconPuzzleProgress = localStorage.getItem('icon_puzzle_completed');
      if (iconPuzzleProgress) {
        const completed = JSON.parse(iconPuzzleProgress);
        return Array.isArray(completed) && completed.length > 0;
      }
    } catch (error) {
      console.error('Error checking icon puzzle progress:', error);
    }

    return false;
  }
}
