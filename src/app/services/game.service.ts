import { Injectable, signal } from '@angular/core';
import { Place } from '../models/place.model';
import { Character } from '../models/character.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly MAP_WIDTH = 2000;
  private readonly MAP_HEIGHT = 1500;

  character = signal<Character>({
    x: 200,
    y: 150,
    size: 40
  });

  activePlace = signal<Place | null>(null);
  showPopup = signal<boolean>(false);

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
    alert(`Mini-game coming soon: ${place.name} - ${place.description}`);
  }

  getMapWidth(): number {
    return this.MAP_WIDTH;
  }

  getMapHeight(): number {
    return this.MAP_HEIGHT;
  }
}
