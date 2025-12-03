import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { GameStateService } from '../../services/game-state.service';
import { COPTIC_LETTERS, CopticLetter } from '../../models/coptic-letters';
import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

interface Card {
  id: string;
  type: 'letter' | 'name';
  letterId: string;
  content: string;
  svgPath?: string;
  pronunciation?: string;
  isFlipped: boolean;
  isMatched: boolean;
}

@Component({
  selector: 'app-match-letter-game',
  standalone: true,
  imports: [CommonModule , ConfirmationDialogComponent],
  templateUrl: './match-letter-game.component.html',
  styleUrls: ['./match-letter-game.component.scss']
})
export class MatchLetterGameComponent implements OnInit, OnDestroy {
  cards = signal<Card[]>([]);
  flippedCards = signal<Card[]>([]);
  isChecking = signal(false);
  matchedPairs = signal(0);
  totalPairs = signal(0);
  canPlay = signal(false);
  
  timeRemaining = signal(180);
  showTimeoutPopup = signal(false);
  private timerInterval: any = null;
  
  private selectedLetters: CopticLetter[] = [];
  private readonly PLACE_ID = 'monastery1';

  constructor(
    public gameService: GameService,
    private gameStateService: GameStateService,
    private confirmDialog: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    const miniGameStarted = this.gameService.miniGameStarted();
    if (!miniGameStarted) {
      this.gameService.showMiniGameEntryPopup(this.PLACE_ID);
    } else {
      this.canPlay.set(true);
      this.initializeGame();
      this.startTimer();
    }

    const checkStarted = setInterval(() => {
      if (this.gameService.miniGameStarted()) {
        this.canPlay.set(true);
        this.initializeGame();
        this.startTimer();
        clearInterval(checkStarted);
      }
    }, 100);
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private startTimer(): void {
    this.stopTimer();
    
    this.timerInterval = setInterval(() => {
      const currentTime = this.timeRemaining();
      
      if (currentTime <= 0) {
        this.stopTimer();
        this.handleTimeout();
      } else {
        this.timeRemaining.set(currentTime - 1);
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private handleTimeout(): void {
    this.showTimeoutPopup.set(true);
  }

  onTimeoutTryAgain(): void {
    this.showTimeoutPopup.set(false);
    this.timeRemaining.set(180);
    this.matchedPairs.set(0);
    this.flippedCards.set([]);
    this.isChecking.set(false);
    this.initializeGame();
    this.startTimer();
  }

  onTimeoutExit(): void {
    this.stopTimer();
    this.gameService.exitMiniGame();
  }

  getFormattedTime(): string {
    const time = this.timeRemaining();
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  initializeGame(): void {
    this.selectedLetters = this.shuffleArray([...COPTIC_LETTERS]).slice(0, 8);
    this.totalPairs.set(this.selectedLetters.length);
    
    const cardArray: Card[] = [];
    
    this.selectedLetters.forEach(letter => {
      cardArray.push({
        id: `letter-${letter.id}`,
        type: 'letter',
        letterId: letter.id,
        content: letter.name,
        svgPath: letter.svgPath,
        isFlipped: false,
        isMatched: false
      });
      
      cardArray.push({
        id: `name-${letter.id}`,
        type: 'name',
        letterId: letter.id,
        content: letter.name,
        pronunciation: letter.pronunciation,
        isFlipped: false,
        isMatched: false
      });
    });
    
    this.cards.set(this.shuffleArray(cardArray));
  }

  onCardClick(card: Card): void {
    if (this.isChecking() || card.isFlipped || card.isMatched) {
      return;
    }
    
    if (this.flippedCards().length >= 2) {
      return;
    }
    
    const updatedCards = this.cards().map(c => 
      c.id === card.id ? { ...c, isFlipped: true } : c
    );
    this.cards.set(updatedCards);
    
    const newFlipped = [...this.flippedCards(), card];
    this.flippedCards.set(newFlipped);
    
    if (newFlipped.length === 2) {
      this.checkMatch();
    }
  }

  private checkMatch(): void {
    this.isChecking.set(true);
    const [card1, card2] = this.flippedCards();
    
    if (card1.letterId === card2.letterId) {
      setTimeout(() => {
        const updatedCards = this.cards().map(c => 
          c.id === card1.id || c.id === card2.id 
            ? { ...c, isFlipped: true, isMatched: true } 
            : c
        );
        this.cards.set(updatedCards);
        this.matchedPairs.set(this.matchedPairs() + 1);
        this.flippedCards.set([]);
        this.isChecking.set(false);
        
        if (this.matchedPairs() === this.totalPairs()) {
          this.stopTimer();
          setTimeout(() => this.completeGame(), 500);
        }
      }, 600);
    } else {
      setTimeout(() => {
        const updatedCards = this.cards().map(c => 
          c.id === card1.id || c.id === card2.id 
            ? { ...c, isFlipped: false } 
            : c
        );
        this.cards.set(updatedCards);
        this.flippedCards.set([]);
        this.isChecking.set(false);
      }, 1000);
    }
  }

  private completeGame(): void {
    const result:any = {
      placeId: this.PLACE_ID,
      timestamp: new Date(),
      score: this.totalPairs(),
      maxScore: this.totalPairs(),
      passed: true
    };
    
    this.gameService.saveMiniGameResult(result);
    this.gameStateService.completePlace(this.PLACE_ID);
    this.gameService.showMiniGameCompletionPopup(true);
  }

  async exitGame(): Promise<void> {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Exit Game?',
      message: 'Are you sure you want to exit? Your current progress will be lost.',
      confirmText: 'Exit',
      cancelText: 'Stay',
      type: 'warning'
    });

    if (confirmed) {
      this.gameService.exitMiniGame();
    }
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
