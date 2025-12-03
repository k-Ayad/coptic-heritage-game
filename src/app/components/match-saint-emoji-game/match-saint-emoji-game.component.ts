import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { GameStateService } from '../../services/game-state.service';
import { SAINT_QUESTIONS, SaintQuestion } from '../../models/saint-questions';

interface QuestionWithShuffledChoices extends SaintQuestion {
  shuffledChoices: string[];
}

@Component({
  selector: 'app-match-saint-emoji-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './match-saint-emoji-game.component.html',
  styleUrls: ['./match-saint-emoji-game.component.scss']
})
export class MatchSaintEmojiGameComponent implements OnInit, OnDestroy {
  canPlay = signal(false);
  currentQuestionIndex = signal(0);
  correctAnswers = signal(0);
  wrongAnswers = signal(0);
  selectedAnswer = signal<string | null>(null);
  showDescription = signal(false);
  isCorrect = signal(false);
  shuffledQuestions = signal<QuestionWithShuffledChoices[]>([]);
  showFailPopup = signal(false);
  
  private readonly PLACE_ID = 'hanging-church';
  private readonly PASSING_SCORE = 6; // Need 6 out of 8 correct

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
    // Shuffle questions and pre-shuffle choices for each question
    const shuffled = this.shuffleArray([...SAINT_QUESTIONS]).map(question => ({
      ...question,
      shuffledChoices: this.shuffleArray([...question.choices])
    }));
    
    this.shuffledQuestions.set(shuffled);
    this.currentQuestionIndex.set(0);
    this.correctAnswers.set(0);
    this.wrongAnswers.set(0);
    this.selectedAnswer.set(null);
    this.showDescription.set(false);
    this.showFailPopup.set(false);
  }

  getCurrentQuestion(): QuestionWithShuffledChoices {
    return this.shuffledQuestions()[this.currentQuestionIndex()];
  }

  onAnswerSelect(answer: string): void {
    if (this.selectedAnswer()) return; // Already answered

    this.selectedAnswer.set(answer);
    const question = this.getCurrentQuestion();
    
    if (answer === question.correct) {
      this.isCorrect.set(true);
      this.correctAnswers.set(this.correctAnswers() + 1);
      this.showDescription.set(true);
    } else {
      this.isCorrect.set(false);
      this.wrongAnswers.set(this.wrongAnswers() + 1);
      // Show correct answer and description
      this.showDescription.set(true);
    }
  }

  onContinue(): void {
    const nextIndex = this.currentQuestionIndex() + 1;
    
    if (nextIndex >= this.shuffledQuestions().length) {
      // Game completed
      this.completeGame();
    } else {
      // Move to next question
      this.currentQuestionIndex.set(nextIndex);
      this.selectedAnswer.set(null);
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
      maxScore: this.shuffledQuestions().length,
      passed: passed
    };
    
    this.gameService.saveMiniGameResult(result);
    
    // Mark place as completed in GameStateService if passed
    if (passed) {
      this.gameStateService.completePlace(this.PLACE_ID);
    }
    
    if (passed) {
      this.gameService.showMiniGameCompletionPopup(true);
    } else {
      // Show fail popup with retry option
      this.showFailPopup.set(true);
    }
  }

  onFailTryAgain(): void {
    this.showFailPopup.set(false);
    this.initializeGame();
  }

  onFailExit(): void {
    this.showFailPopup.set(false);
    this.gameService.exitMiniGame();
  }

  exitGame(): void {
    if (confirm('Are you sure you want to exit? Your current progress will be lost.')) {
      this.gameService.exitMiniGame();
    }
  }

  getProgressPercentage(): number {
    const total = this.shuffledQuestions().length;
    if (total === 0) return 0;
    return (this.currentQuestionIndex() / total) * 100;
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
