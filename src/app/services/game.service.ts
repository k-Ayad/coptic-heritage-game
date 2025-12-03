import { Injectable, signal } from '@angular/core';
import { Place } from '../models/place.model';
import { Character } from '../models/character.model';
import { MiniGameState, MiniGameResult, DEFAULT_MINIGAME_STATE } from '../models/minigame-state.model';
import { GamePopupData, DEFAULT_POPUP_DATA } from '../models/game-popup.model';
import { MINIGAME_INFO } from '../models/minigame-info.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly MAP_WIDTH = 2000;
  private readonly MAP_HEIGHT = 1500;
  private readonly MINIGAME_STORAGE_KEY = 'coptic_game_minigames';
  private readonly ICON_PUZZLE_STORAGE_KEY = 'icon_puzzle_completed';

  character = signal<Character>({
    x: 200,
    y: 150,
    size: 40
  });

  activePlace = signal<Place | null>(null);
  showPopup = signal<boolean>(false);
  miniGameState = signal<MiniGameState>(this.loadMiniGameState());
  gamePopupData = signal<GamePopupData>({ ...DEFAULT_POPUP_DATA });
  showGamePopup = signal<boolean>(false);
  miniGameStarted = signal<boolean>(false);

  places: Place[] = [
    {
      id: 'gate',
      name: 'Entrance Gate',
      description: 'Starting point of your Coptic heritage journey',
      x: 150,
      y: 100,
      width: 100,
      height: 100,
      type: 'gate'
    },
    {
      id: 'church1',
      name: 'St. Mark\'s Church',
      description: 'Learn about the life of St. Mark, founder of the Coptic Church',
      x: 500,
      y: 300,
      width: 120,
      height: 120,
      type: 'church'
    },
    {
      id: 'monastery1',
      name: 'St. Anthony\'s Monastery',
      description: 'Discover the history of the first Christian monastery',
      x: 900,
      y: 200,
      width: 140,
      height: 140,
      type: 'monastery'
    },
    {
      id: 'school1',
      name: 'Catechetical School',
      description: 'Explore the ancient school of Alexandria',
      x: 700,
      y: 600,
      width: 110,
      height: 110,
      type: 'school'
    },
    {
      id: 'church2',
      name: 'Hanging Church',
      description: 'Experience the beauty of one of Cairo\'s oldest churches',
      x: 1300,
      y: 500,
      width: 120,
      height: 120,
      type: 'church'
    },
    {
      id: 'monastery2',
      name: 'St. Bishoy Monastery',
      description: 'Learn about monastic life in the Egyptian desert',
      x: 1500,
      y: 900,
      width: 140,
      height: 140,
      type: 'monastery'
    }
  ];

  constructor() {
    this.handleRefresh();
  }

  private handleRefresh(): void {
    const state = this.miniGameState();
    
    if (state.currentGame) {
      const place = this.places.find(p => p.id === state.currentGame);
      
      if (place) {
        this.activePlace.set(place);
        
        setTimeout(() => {
          this.showMiniGameEntryPopup(state.currentGame!);
        }, 100);
      }
    }
  }

  moveCharacter(dx: number, dy: number): void {
    const char = this.character();
    const newX = Math.max(0, Math.min(this.MAP_WIDTH - char.size, char.x + dx));
    const newY = Math.max(0, Math.min(this.MAP_HEIGHT - char.size, char.y + dy));

    this.character.set({
      ...char,
      x: newX,
      y: newY
    });

    this.checkPlaceCollision();
  }

  private checkPlaceCollision(): void {
    const char = this.character();
    const charCenterX = char.x + char.size / 2;
    const charCenterY = char.y + char.size / 2;

    for (const place of this.places) {
      if (place.type === 'gate') {
        continue;
      }

      const placeCenterX = place.x + place.width / 2;
      const placeCenterY = place.y + place.height / 2;
      const distance = Math.sqrt(
        Math.pow(charCenterX - placeCenterX, 2) + 
        Math.pow(charCenterY - placeCenterY, 2)
      );

      if (distance < (char.size + Math.min(place.width, place.height)) / 2) {
        if (this.activePlace()?.id !== place.id) {
          this.activePlace.set(place);
          this.showPopup.set(true);
        }
        return;
      }
    }
  }

  closePopup(): void {
    this.showPopup.set(false);
  }

  startMiniGame(place: Place): void {
    this.showPopup.set(false);
    
    const char = this.character();
    const state = this.miniGameState();
    this.miniGameState.set({
      ...state,
      currentGame: place.id,
      resumePosition: { x: char.x, y: char.y }
    });
    this.saveMiniGameState();

    this.showMiniGameEntryPopup(place.id);
  }

  showMiniGameEntryPopup(placeId: string): void {
    const info = MINIGAME_INFO[placeId];
    if (!info) return;

    this.gamePopupData.set({
      type: 'entry',
      title: info.name,
      message: info.description,
      details: `${info.instructions}\n\nScoring: ${info.scoringSystem}`,
      showStartButton: true,
      showCloseButton: false
    });
    this.showGamePopup.set(true);
    this.miniGameStarted.set(false);
  }

  showMiniGameCompletionPopup(passed: boolean): void {
    this.gamePopupData.set({
      type: 'completion',
      title: passed ? 'Congratulations!' : 'Hard Luck!',
      message: passed 
        ? '🎉 Congratulations! You have successfully completed the game.'
        : '😢 Hard luck! You can try again later.',
      passed: passed,
      showStartButton: false,
      showCloseButton: true
    });
    this.showGamePopup.set(true);
  }

  startMiniGamePlay(): void {
    this.showGamePopup.set(false);
    this.miniGameStarted.set(true);
  }

  closeGamePopup(): void {
    this.showGamePopup.set(false);
    this.gamePopupData.set({ ...DEFAULT_POPUP_DATA });
  }

  hasMiniGame(placeId: string): boolean {
    // Added monastery1 to the list of places with mini-games
    return placeId === 'church1' || placeId === 'school1' || placeId === 'monastery1';
  }

  getMiniGameResult(placeId: string): MiniGameResult | undefined {
    return this.miniGameState().results.find(r => r.placeId === placeId);
  }

  hasPassedMiniGame(placeId: string): boolean {
    const result = this.getMiniGameResult(placeId);
    return result ? result.passed : false;
  }

  saveMiniGameResult(result: MiniGameResult): void {
    const state = this.miniGameState();
    const existingIndex = state.results.findIndex(r => r.placeId === result.placeId);
    
    let newResults: MiniGameResult[];
    if (existingIndex >= 0) {
      newResults = [...state.results];
      newResults[existingIndex] = result;
    } else {
      newResults = [...state.results, result];
    }

    this.miniGameState.set({
      ...state,
      currentGame: null,
      results: newResults
    });
    this.saveMiniGameState();
  }

  exitMiniGame(): void {
    const state = this.miniGameState();
    
    if (state.resumePosition) {
      const char = this.character();
      this.character.set({
        ...char,
        x: state.resumePosition.x,
        y: state.resumePosition.y
      });
    }

    this.miniGameState.set({
      ...state,
      currentGame: null,
      resumePosition: null
    });
    this.saveMiniGameState();
    this.miniGameStarted.set(false);
    this.showGamePopup.set(false);
    this.gamePopupData.set({ ...DEFAULT_POPUP_DATA });
  }

  resetMiniGames(): void {
    const freshState = { ...DEFAULT_MINIGAME_STATE };
    this.miniGameState.set(freshState);
    this.saveMiniGameState();
    
    this.resetIconPuzzleProgress();
  }

  private resetIconPuzzleProgress(): void {
    try {
      localStorage.removeItem(this.ICON_PUZZLE_STORAGE_KEY);
      console.log('Icon Puzzle progress completely reset');
    } catch (error) {
      console.error('Failed to reset icon puzzle progress:', error);
    }
  }

  resetCharacterPosition(): void {
    const char = this.character();
    this.character.set({
      ...char,
      x: 200,
      y: 150
    });
  }

  private loadMiniGameState(): MiniGameState {
    try {
      const saved = localStorage.getItem(this.MINIGAME_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load mini-game state:', error);
    }
    return { ...DEFAULT_MINIGAME_STATE };
  }

  private saveMiniGameState(): void {
    try {
      localStorage.setItem(this.MINIGAME_STORAGE_KEY, JSON.stringify(this.miniGameState()));
    } catch (error) {
      console.error('Failed to save mini-game state:', error);
    }
  }

  getMapWidth(): number {
    return this.MAP_WIDTH;
  }

  getMapHeight(): number {
    return this.MAP_HEIGHT;
  }
}
