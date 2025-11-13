import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-joystick',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './joystick.component.html',
  styleUrls: ['./joystick.component.scss']
})
export class JoystickComponent {
  @Output() move = new EventEmitter<{ x: number; y: number }>();

  isDragging = signal<boolean>(false);
  stickX = signal<number>(0);
  stickY = signal<number>(0);

  private baseX = 0;
  private baseY = 0;
  private maxDistance = 40;
  private animationFrame: number | null = null;

  onTouchStart(event: TouchEvent): void {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    
    this.baseX = rect.left + rect.width / 2;
    this.baseY = rect.top + rect.height / 2;
    this.isDragging.set(true);
    
    this.updateStickPosition(touch.clientX, touch.clientY);
    this.startEmitting();
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging()) return;
    event.preventDefault();
    
    const touch = event.touches[0];
    this.updateStickPosition(touch.clientX, touch.clientY);
  }

  onTouchEnd(event: TouchEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    this.stickX.set(0);
    this.stickY.set(0);
    this.stopEmitting();
  }

  onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    
    this.baseX = rect.left + rect.width / 2;
    this.baseY = rect.top + rect.height / 2;
    this.isDragging.set(true);
    
    this.updateStickPosition(event.clientX, event.clientY);
    this.startEmitting();
    
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  private onMouseMove = (event: MouseEvent): void => {
    if (!this.isDragging()) return;
    this.updateStickPosition(event.clientX, event.clientY);
  };

  private onMouseUp = (): void => {
    this.isDragging.set(false);
    this.stickX.set(0);
    this.stickY.set(0);
    this.stopEmitting();
    
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };

  private updateStickPosition(clientX: number, clientY: number): void {
    let dx = clientX - this.baseX;
    let dy = clientY - this.baseY;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > this.maxDistance) {
      const angle = Math.atan2(dy, dx);
      dx = Math.cos(angle) * this.maxDistance;
      dy = Math.sin(angle) * this.maxDistance;
    }
    
    this.stickX.set(dx);
    this.stickY.set(dy);
  }

  private startEmitting(): void {
    const emit = () => {
      if (!this.isDragging()) return;
      
      const normalizedX = this.stickX() / this.maxDistance;
      const normalizedY = this.stickY() / this.maxDistance;
      
      this.move.emit({ x: normalizedX, y: normalizedY });
      this.animationFrame = requestAnimationFrame(emit);
    };
    emit();
  }

  private stopEmitting(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.move.emit({ x: 0, y: 0 });
  }
}
