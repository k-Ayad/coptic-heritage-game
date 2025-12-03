import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { GameStateService } from '../../services/game-state.service';
import { LITURGICAL_ITEMS, LiturgicalItem } from '../../models/liturgical-items';

@Component({
  selector: 'app-find-liturgical-item-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './find-liturgical-item-game.component.html',
  styleUrls: ['./find-liturgical-item-game.component.scss']
})
export class FindLiturgicalItemGameComponent implements OnInit, OnDestroy {
  canPlay = signal(false);
  currentItemIndex = signal(0);
  correctAnswers = signal(0);
  selectedItem = signal<string | null>(null);
  showDescription = signal(false);
  isCorrect = signal(false);
  shuffledItems = signal<LiturgicalItem[]>([]);
  
  private readonly PLACE_ID = 'monastery2';
  private readonly PASSING_SCORE = 4; // Need 4 out of 5 correct

  allItems = LITURGICAL_ITEMS;

  constructor(
    public gameService: GameService,
    private gameStateService: GameStateService
  ) {}

  ngOnInit(): void {
    const miniGameStarted = this.gameService.miniGameStarted();
    if (!miniGameStarted) {
      this.gameService.showMiniGameEntryPopup(this.PLACE_ID);
    } else {
      this.canPlay.set(true);
      this.initializeGame();
    }

    const checkStarted = setInterval(() => {
      if (this.gameService.miniGameStarted()) {
        this.canPlay.set(true);
        this.initializeGame();
        clearInterval(checkStarted);
      }
    }, 100);
  }

  ngOnDestroy(): void {}

  initializeGame(): void {
    // Shuffle the order of items to find
    this.shuffledItems.set(this.shuffleArray([...LITURGICAL_ITEMS]));
    this.currentItemIndex.set(0);
    this.correctAnswers.set(0);
    this.selectedItem.set(null);
    this.showDescription.set(false);
  }

  getCurrentTargetItem(): LiturgicalItem {
    return this.shuffledItems()[this.currentItemIndex()];
  }

  onItemClick(itemId: string): void {
    if (this.selectedItem()) return; // Already answered

    this.selectedItem.set(itemId);
    const targetItem = this.getCurrentTargetItem();
    
    if (itemId === targetItem.id) {
      this.isCorrect.set(true);
      this.correctAnswers.set(this.correctAnswers() + 1);
      setTimeout(() => {
        this.showDescription.set(true);
      }, 600);
    } else {
      this.isCorrect.set(false);
      // Show hint and allow retry after 1 second
      setTimeout(() => {
        this.selectedItem.set(null);
      }, 1000);
    }
  }

  onContinue(): void {
    const nextIndex = this.currentItemIndex() + 1;
    
    if (nextIndex >= this.shuffledItems().length) {
      // Game completed
      this.completeGame();
    } else {
      // Move to next item
      this.currentItemIndex.set(nextIndex);
      this.selectedItem.set(null);
      this.showDescription.set(false);
      this.isCorrect.set(false);
    }
  }

  private completeGame(): void {
    const passed = this.correctAnswers() >= this.PASSING_SCORE;
    
    const result:any = {
      placeId: this.PLACE_ID,
      timestamp: new Date(),
      score: this.correctAnswers(),
      maxScore: this.shuffledItems().length,
      passed: passed
    };
    
    this.gameService.saveMiniGameResult(result);
    
    if (passed) {
      this.gameStateService.completePlace(this.PLACE_ID);
    }
    
    this.gameService.showMiniGameCompletionPopup(passed);
  }

  exitGame(): void {
    if (confirm('Are you sure you want to exit? Your current progress will be lost.')) {
      this.gameService.exitMiniGame();
    }
  }

  getProgressPercentage(): number {
    const total = this.shuffledItems().length;
    if (total === 0) return 0;
    return (this.currentItemIndex() / total) * 100;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
