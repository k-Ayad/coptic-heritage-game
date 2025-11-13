import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-hud',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hud.component.html',
  styleUrls: ['./hud.component.scss']
})
export class HudComponent {
  progress = computed(() => this.gameStateService.getProgress());
  score = computed(() => this.gameStateService.gameState().score);

  constructor(private gameStateService: GameStateService) {}
}
