import { Component, OnInit, OnDestroy, ViewChild, ElementRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GameService } from '../../services/game.service';
import { GameStateService } from '../../services/game-state.service';
import { MiniGameResult } from '../../models/minigame-state.model';
import { COPTIC_WORDS, CopticWord, CopticLetter } from '../../models/coptic-words.model';

interface DrawPoint {
  x: number;
  y: number;
}

@Component({
  selector: 'app-write-it-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './write-it-game.component.html',
  styleUrls: ['./write-it-game.component.scss']
})
export class WriteItGameComponent implements OnInit, OnDestroy {
  @ViewChild('drawingCanvas', { static: false }) canvasRef?: ElementRef<HTMLCanvasElement>;

  // Game state
  currentWordIndex = signal<number>(0);
  currentLetterIndex = signal<number>(0);
  failedAttempts = signal<number>(0);
  gameState = signal<'playing' | 'word-completed' | 'all-completed' | 'failed'>('playing');
  
  // Drawing state
  isDrawing = signal<boolean>(false);
  showLetterOutline = signal<boolean>(false);
  currentOutlineSvg = signal<SafeHtml>('');
  hasDrawn = signal<boolean>(false);
  
  // UI state
  showWordCompletionPopup = signal<boolean>(false);
  completedWordData = signal<CopticWord | null>(null);
  
  // Constants
  readonly MAX_FAILED_ATTEMPTS = 3;
  readonly OUTLINE_DISPLAY_TIME = 5000; // 5 seconds
  readonly COPTIC_WORDS = COPTIC_WORDS;
  
  // Canvas drawing
  private ctx: CanvasRenderingContext2D | null = null;
  private drawPoints: DrawPoint[] = [];
  private isPointerDown = false;
  private outlineTimer: any = null;
  
  canPlay = computed(() => this.gameService.miniGameStarted());
  
  currentWord = computed(() => this.COPTIC_WORDS[this.currentWordIndex()]);
  currentLetter = computed(() => {
    const word = this.currentWord();
    return word.letters[this.currentLetterIndex()];
  });
  
  progressText = computed(() => {
    const wordIdx = this.currentWordIndex();
    const letterIdx = this.currentLetterIndex();
    const word = this.currentWord();
    return `Word ${wordIdx + 1}/${this.COPTIC_WORDS.length} - Letter ${letterIdx + 1}/${word.letters.length}`;
  });

  constructor(
    private gameService: GameService,
    private gameStateService: GameStateService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.initCanvas();
    }, 100);
  }

  ngOnDestroy(): void {
    this.clearOutlineTimer();
  }

  initCanvas(): void {
    if (!this.canvasRef) return;
    
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    
    if (!this.ctx) return;
    
    // Set canvas size
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
    
    // Configure drawing style
    this.ctx.strokeStyle = '#2c3e50';
    this.ctx.lineWidth = 4;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  onLetterCardClick(letter: CopticLetter): void {
    if (letter.letter !== this.currentLetter().letter) {
      return; // Only allow clicking the current letter
    }
    
    // Clear previous drawing
    this.clearCanvas();
    this.hasDrawn.set(false);
    
    // Load and show letter outline
    this.loadLetterOutline(letter);
    
    // Show outline for 5 seconds
    this.showLetterOutline.set(true);
    this.clearOutlineTimer();
    this.outlineTimer = setTimeout(() => {
      this.showLetterOutline.set(false);
    }, this.OUTLINE_DISPLAY_TIME);
  }

  loadLetterOutline(letter: CopticLetter): void {
    // Create a simple SVG outline for demonstration
    // In production, load actual SVG files from assets/coptic-letters/
    const svgContent = this.generateSimpleSvg(letter.letter);
    this.currentOutlineSvg.set(this.sanitizer.bypassSecurityTrustHtml(svgContent));
  }

  generateSimpleSvg(letter: string): string {
    // Simple SVG generation for demonstration
    return `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="50%" 
              font-size="120" 
              font-family="'Times New Roman', serif" 
              text-anchor="middle" 
              dominant-baseline="middle"
              fill="none"
              stroke="#d4af37"
              stroke-width="2"
              opacity="0.3">
          ${letter}
        </text>
      </svg>
    `;
  }

  // ========== CANVAS DRAWING ==========

  onPointerDown(event: PointerEvent): void {
    if (!this.ctx || !this.canvasRef) return;
    
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    this.isPointerDown = true;
    this.isDrawing.set(true);
    this.hasDrawn.set(true);
    
    this.drawPoints = [{ x, y }];
    
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.isPointerDown || !this.ctx || !this.canvasRef) return;
    
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    this.drawPoints.push({ x, y });
    
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }

  onPointerUp(): void {
    this.isPointerDown = false;
    this.isDrawing.set(false);
  }

  clearCanvas(): void {
    if (!this.ctx || !this.canvasRef) return;
    
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawPoints = [];
    this.hasDrawn.set(false);
  }

  // ========== VALIDATION ==========

  onComplete(): void {
    if (!this.hasDrawn()) {
      alert('Please draw the letter first!');
      return;
    }
    
    // Simple validation based on drawing coverage
    const isCorrect = this.validateDrawing();
    
    if (isCorrect) {
      this.onCorrectLetter();
    } else {
      this.onIncorrectLetter();
    }
  }

  validateDrawing(): boolean {
    // Simple validation: check if user drew something substantial
    if (this.drawPoints.length < 10) {
      return false; // Too few points
    }
    
    // Calculate bounding box of drawing
    const minX = Math.min(...this.drawPoints.map(p => p.x));
    const maxX = Math.max(...this.drawPoints.map(p => p.x));
    const minY = Math.min(...this.drawPoints.map(p => p.y));
    const maxY = Math.max(...this.drawPoints.map(p => p.y));
    
    const width = maxX - minX;
    const height = maxY - minY;
    
    // Check if drawing covers reasonable area
    if (!this.canvasRef) return false;
    const canvas = this.canvasRef.nativeElement;
    const coverageRatio = (width * height) / (canvas.width * canvas.height);
    
    // Accept if coverage is reasonable
    return coverageRatio > 0.1 && coverageRatio < 0.9;
  }

  onCorrectLetter(): void {
    const letter = this.currentLetter();
    
    // Play pronunciation audio
    this.playPronunciation(letter.audioFile);
    
    // Show success animation
    this.showSuccessAnimation();
    
    // Move to next letter after delay
    setTimeout(() => {
      this.moveToNextLetter();
    }, 1500);
  }

  onIncorrectLetter(): void {
    const attempts = this.failedAttempts() + 1;
    this.failedAttempts.set(attempts);
    
    if (attempts >= this.MAX_FAILED_ATTEMPTS) {
      this.failGame();
    } else {
      alert(`Not quite right. Try again! (${attempts}/${this.MAX_FAILED_ATTEMPTS} attempts)`);
      this.clearCanvas();
    }
  }

  moveToNextLetter(): void {
    const word = this.currentWord();
    const nextLetterIdx = this.currentLetterIndex() + 1;
    
    if (nextLetterIdx >= word.letters.length) {
      // Word completed
      this.completeWord();
    } else {
      // Move to next letter
      this.currentLetterIndex.set(nextLetterIdx);
      this.clearCanvas();
      this.showLetterOutline.set(false);
    }
  }

  completeWord(): void {
    const word = this.currentWord();
    this.completedWordData.set(word);
    this.showWordCompletionPopup.set(true);
  }

  closeWordCompletionPopup(): void {
    this.showWordCompletionPopup.set(false);
    
    const nextWordIdx = this.currentWordIndex() + 1;
    
    if (nextWordIdx >= this.COPTIC_WORDS.length) {
      // All words completed
      this.completeAllWords();
    } else {
      // Move to next word
      this.currentWordIndex.set(nextWordIdx);
      this.currentLetterIndex.set(0);
      this.clearCanvas();
      this.showLetterOutline.set(false);
    }
  }

  completeAllWords(): void {
    this.gameState.set('all-completed');
    
    const place = this.gameService.activePlace();
    if (place) {
      const result: MiniGameResult = {
        placeId: place.id,
        placeName: place.name,
        passed: true,
        score: this.COPTIC_WORDS.length,
        totalQuestions: this.COPTIC_WORDS.length,
        completedAt: new Date().toISOString()
      };

      this.gameService.saveMiniGameResult(result);
      this.gameStateService.completePlace(place.id);
      
      // Show completion popup
      this.gameService.showMiniGameCompletionPopup(true);
    }
  }

  failGame(): void {
    this.gameState.set('failed');
    this.gameService.showMiniGameCompletionPopup(false);
  }

  // ========== AUDIO ==========

  playPronunciation(audioFile: string): void {
    try {
      const audio = new Audio(`assets/audio/pronunciation/${audioFile}`);
      audio.play().catch(err => console.error('Audio playback failed:', err));
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  // ========== ANIMATIONS ==========

  showSuccessAnimation(): void {
    if (!this.ctx || !this.canvasRef) return;
    
    // Flash green
    const canvas = this.canvasRef.nativeElement;
    this.ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    setTimeout(() => {
      this.clearCanvas();
    }, 500);
  }

  // ========== UTILITY ==========

  clearOutlineTimer(): void {
    if (this.outlineTimer) {
      clearTimeout(this.outlineTimer);
      this.outlineTimer = null;
    }
  }

  exitGame(): void {
    if (confirm('Are you sure you want to exit? Your current progress will be lost.')) {
      this.gameService.exitMiniGame();
    }
  }

  backToMap(): void {
    this.gameService.exitMiniGame();
  }

  getLetterCards(): CopticLetter[] {
    return this.currentWord().letters;
  }

  isCurrentLetter(letter: CopticLetter, index: number): boolean {
    return index === this.currentLetterIndex();
  }

  isCompletedLetter(index: number): boolean {
    return index < this.currentLetterIndex();
  }
}
