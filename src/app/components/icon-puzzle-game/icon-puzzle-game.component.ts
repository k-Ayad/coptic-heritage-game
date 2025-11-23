import { Component, OnInit, OnDestroy, signal, computed, effect, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { GameStateService } from '../../services/game-state.service';
import { MiniGameResult } from '../../models/minigame-state.model';
import { IconConfig, ICON_CONFIGS } from '../../models/icon-config.model';

interface PuzzleTile {
  id: number;
  correctPosition: number;
  imageUrl: string;
  correctRow: number;
  correctCol: number;
  currentLeft: number;
  currentTop: number;
  isDragging: boolean;
  dragTransform: string;
}

interface GridCell {
  row: number;
  col: number;
  x: number;
  y: number;
  occupiedByTileId: number | null;
}

@Component({
  selector: 'app-icon-puzzle-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-puzzle-game.component.html',
  styleUrls: ['./icon-puzzle-game.component.scss']
})
export class IconPuzzleGameComponent implements OnInit, OnDestroy {
  @ViewChild('puzzleBoard', { static: false }) puzzleBoardRef?: ElementRef<HTMLDivElement>;

  tiles = signal<PuzzleTile[]>([]);
  gameState = signal<'playing' | 'icon-completed' | 'all-completed'>('playing');
  moves = signal<number>(0);
  currentIconConfig = signal<IconConfig | null>(null);
  currentIconIndex = signal<number>(0);
  completedIconIds = signal<number[]>([]);
  showIconDescriptionPopup = signal<boolean>(false);
  
  // Minimum required puzzles
  readonly REQUIRED_PUZZLES = 3;
  
  // Drag state
  private draggedTile: PuzzleTile | null = null;
  private dragStartX = 0;
  private dragStartY = 0;
  private tileStartLeft = 0;
  private tileStartTop = 0;
  private isDragging = false;
  
  // Grid configuration
  private readonly CONTAINER_SIZE = 300;
  private gridCells: GridCell[] = [];
  private tileSize = 0;
  private gridSize = 3;
  
  canPlay = computed(() => this.gameService.miniGameStarted());

  constructor(
    private gameService: GameService,
    private gameStateService: GameStateService
  ) {
    effect(() => {
      if (this.canPlay() && this.tiles().length === 0) {
        this.initializeGame();
      }
    });
  }

  ngOnInit(): void {
    this.loadCompletedIcons();
    
    if (this.canPlay()) {
      this.initializeGame();
    }
  }

  ngOnDestroy(): void {
    this.removeGlobalListeners();
  }

  initializeGame(): void {
    const nextIconIndex = this.getNextIconIndex();
    this.currentIconIndex.set(nextIconIndex);
    
    if (nextIconIndex < ICON_CONFIGS.length) {
      const iconConfig = ICON_CONFIGS[nextIconIndex];
      this.currentIconConfig.set(iconConfig);
      this.initializePuzzle(iconConfig);
    } else {
      // All icons completed, restart from beginning
      const firstIcon = ICON_CONFIGS[0];
      this.currentIconConfig.set(firstIcon);
      this.currentIconIndex.set(0);
      this.initializePuzzle(firstIcon);
    }
  }

  getNextIconIndex(): number {
    const completed = this.completedIconIds();
    for (let i = 0; i < ICON_CONFIGS.length; i++) {
      if (!completed.includes(ICON_CONFIGS[i].id)) {
        return i;
      }
    }
    return 0;
  }

  initializePuzzle(iconConfig: IconConfig): void {
    this.gridSize = iconConfig.gridSize;
    this.tileSize = this.CONTAINER_SIZE / this.gridSize;
    
    this.initializeGrid();
    
    const tiles: PuzzleTile[] = [];
    const totalTiles = this.gridSize * this.gridSize;
    
    for (let i = 0; i < totalTiles; i++) {
      const correctRow = Math.floor(i / this.gridSize);
      const correctCol = i % this.gridSize;
      
      tiles.push({
        id: i,
        correctPosition: i,
        imageUrl: `assets/icon/${iconConfig.filename}`,
        correctRow: correctRow,
        correctCol: correctCol,
        currentLeft: 0,
        currentTop: 0,
        isDragging: false,
        dragTransform: ''
      });
    }
    
    this.shuffleAndPositionTiles(tiles);
    
    this.tiles.set(tiles);
    this.gameState.set('playing');
    this.moves.set(0);
  }

  initializeGrid(): void {
    this.gridCells = [];
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        this.gridCells.push({
          row,
          col,
          x: col * this.tileSize,
          y: row * this.tileSize,
          occupiedByTileId: null
        });
      }
    }
  }

  shuffleAndPositionTiles(tiles: PuzzleTile[]): void {
    const positions = [...Array(tiles.length).keys()];
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    tiles.forEach((tile, index) => {
      const cellIndex = positions[index];
      const cell = this.gridCells[cellIndex];
      tile.currentLeft = cell.x;
      tile.currentTop = cell.y;
      cell.occupiedByTileId = tile.id;
    });
    
    this.ensureSolvable(tiles);
  }

  ensureSolvable(tiles: PuzzleTile[]): void {
    let inversions = 0;
    for (let i = 0; i < tiles.length - 1; i++) {
      for (let j = i + 1; j < tiles.length; j++) {
        if (tiles[i].correctPosition > tiles[j].correctPosition) {
          inversions++;
        }
      }
    }
    
    if (this.gridSize % 2 === 1 && inversions % 2 !== 0) {
      const temp1 = { left: tiles[0].currentLeft, top: tiles[0].currentTop };
      const temp2 = { left: tiles[1].currentLeft, top: tiles[1].currentTop };
      tiles[0].currentLeft = temp2.left;
      tiles[0].currentTop = temp2.top;
      tiles[1].currentLeft = temp1.left;
      tiles[1].currentTop = temp1.top;
    }
  }

  getTileGridPosition(tile: PuzzleTile): number {
    const col = Math.round(tile.currentLeft / this.tileSize);
    const row = Math.round(tile.currentTop / this.tileSize);
    return row * this.gridSize + col;
  }

  // ========== MANUAL POINTER DRAG SYSTEM ==========

  onPointerDown(event: PointerEvent, tile: PuzzleTile): void {
    event.preventDefault();
    event.stopPropagation();
    
    const target = event.currentTarget as HTMLElement;
    target.setPointerCapture(event.pointerId);
    
    this.isDragging = true;
    this.draggedTile = tile;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.tileStartLeft = tile.currentLeft;
    this.tileStartTop = tile.currentTop;
    
    tile.isDragging = true;
    this.updateTiles();
    
    this.addGlobalListeners();
  }

  private onPointerMoveGlobal = (event: PointerEvent): void => {
    if (!this.isDragging || !this.draggedTile) return;
    
    event.preventDefault();
    
    const deltaX = event.clientX - this.dragStartX;
    const deltaY = event.clientY - this.dragStartY;
    
    this.draggedTile.dragTransform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
    this.updateTiles();
  };

  private onPointerUpGlobal = (event: PointerEvent): void => {
    if (!this.isDragging || !this.draggedTile) return;
    
    event.preventDefault();
    
    const deltaX = event.clientX - this.dragStartX;
    const deltaY = event.clientY - this.dragStartY;
    
    const finalLeft = this.tileStartLeft + deltaX;
    const finalTop = this.tileStartTop + deltaY;
    
    const targetCell = this.findNearestCell(finalLeft, finalTop);
    
    const occupyingTile = this.tiles().find(t => 
      Math.abs(t.currentLeft - targetCell.x) < 1 && 
      Math.abs(t.currentTop - targetCell.y) < 1 &&
      t.id !== this.draggedTile!.id
    );
    
    if (occupyingTile) {
      this.swapTiles(this.draggedTile, occupyingTile);
    } else {
      this.moveTileToCell(this.draggedTile, targetCell);
    }
    
    this.draggedTile.isDragging = false;
    this.draggedTile.dragTransform = '';
    this.draggedTile = null;
    this.isDragging = false;
    
    this.updateTiles();
    this.moves.set(this.moves() + 1);
    
    setTimeout(() => {
      this.checkPuzzleCompletion();
    }, 250);
    
    this.removeGlobalListeners();
  };

  private addGlobalListeners(): void {
    document.addEventListener('pointermove', this.onPointerMoveGlobal);
    document.addEventListener('pointerup', this.onPointerUpGlobal);
    document.addEventListener('pointercancel', this.onPointerUpGlobal);
  }

  private removeGlobalListeners(): void {
    document.removeEventListener('pointermove', this.onPointerMoveGlobal);
    document.removeEventListener('pointerup', this.onPointerUpGlobal);
    document.removeEventListener('pointercancel', this.onPointerUpGlobal);
  }

  findNearestCell(x: number, y: number): GridCell {
    x = Math.max(0, Math.min(x, this.CONTAINER_SIZE - this.tileSize));
    y = Math.max(0, Math.min(y, this.CONTAINER_SIZE - this.tileSize));
    
    const col = Math.round(x / this.tileSize);
    const row = Math.round(y / this.tileSize);
    
    const clampedCol = Math.max(0, Math.min(col, this.gridSize - 1));
    const clampedRow = Math.max(0, Math.min(row, this.gridSize - 1));
    
    return {
      row: clampedRow,
      col: clampedCol,
      x: clampedCol * this.tileSize,
      y: clampedRow * this.tileSize,
      occupiedByTileId: null
    };
  }

  moveTileToCell(tile: PuzzleTile, cell: GridCell): void {
    tile.currentLeft = cell.x;
    tile.currentTop = cell.y;
  }

  swapTiles(tile1: PuzzleTile, tile2: PuzzleTile): void {
    const temp = { left: tile1.currentLeft, top: tile1.currentTop };
    tile1.currentLeft = tile2.currentLeft;
    tile1.currentTop = tile2.currentTop;
    tile2.currentLeft = temp.left;
    tile2.currentTop = temp.top;
  }

  checkPuzzleCompletion(): void {
    const tiles = this.tiles();
    const allCorrect = tiles.every(tile => {
      const expectedLeft = tile.correctCol * this.tileSize;
      const expectedTop = tile.correctRow * this.tileSize;
      return Math.abs(tile.currentLeft - expectedLeft) < 1 &&
             Math.abs(tile.currentTop - expectedTop) < 1;
    });
    
    if (allCorrect) {
      this.completeCurrentPuzzle();
    }
  }

  completeCurrentPuzzle(): void {
    const iconConfig = this.currentIconConfig();
    if (!iconConfig) return;
    
    // Mark icon as completed
    const completed = [...this.completedIconIds()];
    if (!completed.includes(iconConfig.id)) {
      completed.push(iconConfig.id);
      this.completedIconIds.set(completed);
      this.saveCompletedIcons(completed);
    }
    
    // Show icon description popup
    this.gameState.set('icon-completed');
    this.showIconDescriptionPopup.set(true);
  }

  closeIconDescriptionPopup(): void {
    this.showIconDescriptionPopup.set(false);
    
    const completedCount = this.completedIconIds().length;
    
    // Check if minimum requirement met
    if (completedCount >= this.REQUIRED_PUZZLES) {
      // Check if all available icons are completed
      if (completedCount >= ICON_CONFIGS.length) {
        this.gameState.set('all-completed');
      } else {
        // Can continue to more puzzles
        this.gameState.set('playing');
      }
    } else {
      // Must continue to reach minimum
      this.gameState.set('playing');
    }
  }

  nextPuzzle(): void {
    this.closeIconDescriptionPopup();
    
    const nextIndex = (this.currentIconIndex() + 1) % ICON_CONFIGS.length;
    this.currentIconIndex.set(nextIndex);
    const iconConfig = ICON_CONFIGS[nextIndex];
    this.currentIconConfig.set(iconConfig);
    this.initializePuzzle(iconConfig);
  }

  finishMiniGame(): void {
    const place = this.gameService.activePlace();
    if (place) {
      const result: MiniGameResult = {
        placeId: place.id,
        placeName: place.name,
        passed: true,
        score: this.completedIconIds().length,
        totalQuestions: ICON_CONFIGS.length,
        completedAt: new Date().toISOString()
      };

      this.gameService.saveMiniGameResult(result);
      this.gameStateService.completePlace(place.id);
      
      // Show completion popup from game service
      this.gameService.showMiniGameCompletionPopup(true);
    }
  }

  loadCompletedIcons(): void {
    try {
      const saved = localStorage.getItem('icon_puzzle_completed');
      if (saved) {
        this.completedIconIds.set(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load completed icons:', error);
    }
  }

  saveCompletedIcons(completed: number[]): void {
    try {
      localStorage.setItem('icon_puzzle_completed', JSON.stringify(completed));
    } catch (error) {
      console.error('Failed to save completed icons:', error);
    }
  }

  private updateTiles(): void {
    this.tiles.set([...this.tiles()]);
  }

  getTileStyle(tile: PuzzleTile): any {
    const iconConfig = this.currentIconConfig();
    if (!iconConfig) return {};
    
    return {
      position: 'absolute',
      left: `${tile.currentLeft}px`,
      top: `${tile.currentTop}px`,
      width: `${this.tileSize}px`,
      height: `${this.tileSize}px`,
      'background-image': `url(${tile.imageUrl})`,
      'background-position': `-${tile.correctCol * this.tileSize}px -${tile.correctRow * this.tileSize}px`,
      'background-size': `${this.CONTAINER_SIZE}px ${this.CONTAINER_SIZE}px`,
      transform: tile.dragTransform,
      transition: tile.isDragging ? 'none' : 'left 0.2s ease-out, top 0.2s ease-out',
      'will-change': 'left, top, transform',
      'z-index': tile.isDragging ? 1000 : 1
    };
  }

  exitGame(): void {
    if (confirm('Are you sure you want to exit? Your current progress will be lost.')) {
      this.removeGlobalListeners();
      this.gameService.exitMiniGame();
    }
  }

  backToMap(): void {
    this.removeGlobalListeners();
    this.gameService.exitMiniGame();
  }

  resetPuzzle(): void {
    this.moves.set(0);
    this.gameState.set('playing');
    const iconConfig = this.currentIconConfig();
    if (iconConfig) {
      this.initializePuzzle(iconConfig);
    }
  }

  getProgressText(): string {
    return `${this.completedIconIds().length} / ${ICON_CONFIGS.length} Icons Completed`;
  }

  getRequirementText(): string {
    const completed = this.completedIconIds().length;
    if (completed < this.REQUIRED_PUZZLES) {
      return `${completed} / ${this.REQUIRED_PUZZLES} Required (Minimum)`;
    }
    return `${completed} / ${ICON_CONFIGS.length} Total`;
  }

  hasMetRequirement(): boolean {
    return this.completedIconIds().length >= this.REQUIRED_PUZZLES;
  }

  hasMorePuzzles(): boolean {
    return this.completedIconIds().length < ICON_CONFIGS.length;
  }

  getCurrentIconImageUrl(): string {
    const iconConfig = this.currentIconConfig();
    return iconConfig ? `assets/icon/${iconConfig.filename}` : '';
  }
}
