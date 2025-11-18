import { Injectable, signal } from '@angular/core';
import { Place } from '../models/place.model';
import { Character } from '../models/character.model';
import { MiniGameState, MiniGameResult, DEFAULT_MINIGAME_STATE } from '../models/minigame-state.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly MAP_WIDTH = 2000;
  private readonly MAP_HEIGHT = 1500;
  private readonly MINIGAME_STORAGE_KEY = 'coptic_game_minigames';

  character = signal<Character>({
    x: 200,
    y: 150,
    size: 40
  });

  activePlace = signal<Place | null>(null);
  showPopup = signal<boolean>(false);
  miniGameState = signal<MiniGameState>(this.loadMiniGameState());

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
    
    // Save current position for resume
    const char = this.character();
    const state = this.miniGameState();
    this.miniGameState.set({
      ...state,
      currentGame: place.id,
      resumePosition: { x: char.x, y: char.y }
    });
    this.saveMiniGameState();
  }

  hasMiniGame(placeId: string): boolean {
    // Currently only St. Mark's Church has a mini-game
    return placeId === 'church1';
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
      // Update existing result
      newResults = [...state.results];
      newResults[existingIndex] = result;
    } else {
      // Add new result
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
    
    // Restore character position if saved
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
  }

  resetMiniGames(): void {
    // Create a fresh mini-game state
    const freshState = { ...DEFAULT_MINIGAME_STATE };
    
    // Update the signal
    this.miniGameState.set(freshState);
    
    // Save to localStorage
    this.saveMiniGameState();
  }

  resetCharacterPosition(): void {
    // Reset character to starting position
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
