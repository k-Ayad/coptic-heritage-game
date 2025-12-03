import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { GameStateService } from '../../services/game-state.service';
import { HymnQuestion, HYMN_QUESTIONS } from '../../models/hymn-question.model';
import { MiniGameResult } from '../../models/minigame-state.model';
import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-hymns-game',
  standalone: true,
  imports: [CommonModule , ConfirmationDialogComponent],
  templateUrl: './hymns-game.component.html',
  styleUrls: ['./hymns-game.component.scss']
})
export class HymnsGameComponent implements OnInit, OnDestroy {
  questions: HymnQuestion[] = [...HYMN_QUESTIONS];
  currentQuestionIndex = signal<number>(0);
  selectedAnswer = signal<string | null>(null);
  correctAnswers = signal<number>(0);
  wrongAnswers = signal<number>(0);
  gameState = signal<'playing' | 'result'>('playing');
  audio: HTMLAudioElement | null = null;
  isPlaying = signal<boolean>(false);
  hasAnswered = signal<boolean>(false);

  // Check if mini-game has actually started (after entry popup)
  canPlay = computed(() => this.gameService.miniGameStarted());

  constructor(
    private gameService: GameService,
    private gameStateService: GameStateService,
    private confirmDialog: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    // Only load question if game has started
    if (this.canPlay()) {
      this.loadCurrentQuestion();
    }
  }

  ngOnDestroy(): void {
    this.stopAudio();
  }

  getCurrentQuestion(): HymnQuestion {
    return this.questions[this.currentQuestionIndex()];
  }

  loadCurrentQuestion(): void {
    this.selectedAnswer.set(null);
    this.hasAnswered.set(false);
    this.stopAudio();
  }

  playHymn(): void {
    const question = this.getCurrentQuestion();
    const audioPath = `assets/audio/${question.audioFile}`;

    if (this.audio) {
      this.stopAudio();
    }

    this.audio = new Audio(audioPath);
    this.isPlaying.set(true);

    this.audio.addEventListener('ended', () => {
      this.isPlaying.set(false);
    });

    this.audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      this.isPlaying.set(false);
      alert('Failed to load audio. Make sure the audio file exists in assets/audio/');
    });

    this.audio.play().catch(error => {
      console.error('Play error:', error);
      this.isPlaying.set(false);
    });
  }

  stopAudio(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
    this.isPlaying.set(false);
  }

  selectAnswer(answer: string): void {
    if (this.hasAnswered()) return;
    
    this.selectedAnswer.set(answer);
    this.hasAnswered.set(true);

    const question = this.getCurrentQuestion();
    const isCorrect = answer === question.correctAnswer;

    if (isCorrect) {
      this.correctAnswers.set(this.correctAnswers() + 1);
    } else {
      this.wrongAnswers.set(this.wrongAnswers() + 1);
    }

    setTimeout(() => {
      this.nextQuestion();
    }, 1500);
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex() < this.questions.length - 1) {
      this.currentQuestionIndex.set(this.currentQuestionIndex() + 1);
      this.loadCurrentQuestion();
    } else {
      this.finishGame();
    }
  }

  finishGame(): void {
    this.stopAudio();
    this.gameState.set('result');

    const passed = this.correctAnswers() >= 3;
    const place = this.gameService.activePlace();

    if (place) {
      const result: MiniGameResult = {
        placeId: place.id,
        placeName: place.name,
        passed: passed,
        score: this.correctAnswers(),
        totalQuestions: this.questions.length,
        completedAt: new Date().toISOString()
      };

      this.gameService.saveMiniGameResult(result);

      if (passed) {
        this.gameStateService.completePlace(place.id);
      }

      // Show completion popup
      this.gameService.showMiniGameCompletionPopup(passed);
    }
  }

  backToMap(): void {
    this.stopAudio();
    this.gameService.exitMiniGame();
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

  isCorrectAnswer(answer: string): boolean {
    const question = this.getCurrentQuestion();
    return answer === question.correctAnswer;
  }

  isPassed(): boolean {
    return this.correctAnswers() >= 3;
  }
}
