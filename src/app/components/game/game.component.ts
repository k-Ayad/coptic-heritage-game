import { Component, HostListener, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoystickComponent } from '../joystick/joystick.component';
import { PopupComponent } from '../popup/popup.component';
import { HudComponent } from '../hud/hud.component';
import { MenuComponent } from '../menu/menu.component';
import { HymnsGameComponent } from '../hymns-game/hymns-game.component';
import { GamePopupComponent } from '../game-popup/game-popup.component';
import { GameService } from '../../services/game.service';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule, 
    JoystickComponent, 
    PopupComponent, 
    HudComponent, 
    MenuComponent, 
    HymnsGameComponent,
    GamePopupComponent
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  private keys: { [key: string]: boolean } = {};
  private animationFrame: number | null = null;
  private readonly SPEED = 3;

  isMobile = signal<boolean>(false);
  cameraX = signal<number>(0);
  cameraY = signal<number>(0);
  showMenu = signal<boolean>(true);
  
  isInMiniGame = computed(() => {
    const miniGameState = this.gameService.miniGameState();
    return miniGameState.currentGame !== null;
  });

  constructor(
    public gameService: GameService,
    public gameStateService: GameStateService
  ) {}

  ngOnInit(): void {
    this.checkMobile();
    this.startGameLoop();
    window.addEventListener('resize', this.checkMobile.bind(this));
  }

  ngOnDestroy(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    window.removeEventListener('resize', this.checkMobile.bind(this));
  }

  private checkMobile(): void {
    this.isMobile.set(window.innerWidth <= 768);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.showMenu() || this.isInMiniGame()) return;
    
    const key = event.key.toLowerCase();
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
      event.preventDefault();
      this.keys[key] = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    this.keys[key] = false;
  }

  private startGameLoop(): void {
    const gameLoop = () => {
      if (!this.showMenu() && !this.isInMiniGame()) {
        this.updateMovement();
        this.updateCamera();
      }
      this.animationFrame = requestAnimationFrame(gameLoop);
    };
    gameLoop();
  }

  private updateMovement(): void {
    let dx = 0;
    let dy = 0;

    if (this.keys['w'] || this.keys['arrowup']) dy -= this.SPEED;
    if (this.keys['s'] || this.keys['arrowdown']) dy += this.SPEED;
    if (this.keys['a'] || this.keys['arrowleft']) dx -= this.SPEED;
    if (this.keys['d'] || this.keys['arrowright']) dx += this.SPEED;

    if (dx !== 0 || dy !== 0) {
      this.gameService.moveCharacter(dx, dy);
    }
  }

  onJoystickMove(direction: { x: number; y: number }): void {
    if (this.showMenu() || this.isInMiniGame()) return;
    const dx = direction.x * this.SPEED;
    const dy = direction.y * this.SPEED;
    this.gameService.moveCharacter(dx, dy);
  }

  private updateCamera(): void {
    const char = this.gameService.character();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let targetX = char.x + char.size / 2 - viewportWidth / 2;
    let targetY = char.y + char.size / 2 - viewportHeight / 2;

    const mapWidth = this.gameService.getMapWidth();
    const mapHeight = this.gameService.getMapHeight();

    targetX = Math.max(0, Math.min(targetX, mapWidth - viewportWidth));
    targetY = Math.max(0, Math.min(targetY, mapHeight - viewportHeight));

    this.cameraX.set(targetX);
    this.cameraY.set(targetY);
  }

  onStartGame(): void {
    this.showMenu.set(false);
  }

  onResetGame(): void {
    this.showMenu.set(false);
    const char = this.gameService.character();
    this.gameService.character.set({
      ...char,
      x: 200,
      y: 150
    });
  }

  isPlaceCompleted(placeId: string): boolean {
    return this.gameStateService.isPlaceCompleted(placeId);
  }

  hasPassedMiniGame(placeId: string): boolean {
    return this.gameService.hasPassedMiniGame(placeId);
  }
}
