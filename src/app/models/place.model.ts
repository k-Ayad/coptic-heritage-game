export interface Place {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'church' | 'monastery' | 'school' | 'gate';
}
