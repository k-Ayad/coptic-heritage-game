import { Injectable, signal } from '@angular/core';
import { GameState, DEFAULT_GAME_STATE } from '../models/game-state.model';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private readonly STORAGE_KEY = 'coptic_game_state';
  
  gameState = signal<GameState>(this.loadGameState());

  private loadGameState(): GameState {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
    }
    return { ...DEFAULT_GAME_STATE };
  }

  private saveGameState(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.gameState()));
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  }

  completePlace(placeId: string): void {
    const state = this.gameState();
    // Don't track the gate as a completed place
    if (placeId === 'gate') {
      return;
    }
    
    if (!state.completedPlaces.includes(placeId)) {
      this.gameState.set({
        ...state,
        completedPlaces: [...state.completedPlaces, placeId],
        score: state.score + 100,
        lastPlayedDate: new Date().toISOString()
      });
      this.saveGameState();
    }
  }

  isPlaceCompleted(placeId: string): boolean {
    // Gate is never considered "completed" since it's just a starting point
    if (placeId === 'gate') {
      return false;
    }
    return this.gameState().completedPlaces.includes(placeId);
  }

  resetProgress(): void {
    this.gameState.set({ ...DEFAULT_GAME_STATE });
    this.saveGameState();
  }

  getProgress(): { completed: number; total: number; percentage: number } {
    const state = this.gameState();
    const total = 5; // Total number of interactive places (excluding gate)
    const completed = state.completedPlaces.length;
    const percentage = Math.round((completed / total) * 100);
    
    return { completed, total, percentage };
  }
}
