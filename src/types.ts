export interface Point2D {
  x: number;
  y: number;
}

export interface GameObject {
  x: number;
  y: number;
}
export interface Player {
  score: number;
  lives: number;
  paddle: Point2D[];
}
export interface Ball extends GameObject {
  dirX: number;
  dirY: number;
}

export interface GameState {
  player: Player;
  ball: Ball;
  bricks: GameObject[];
}