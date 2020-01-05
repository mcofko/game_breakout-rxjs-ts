// export interface Point2D {
//   x: number;
//   y: number;
// }

export interface GameObject {
  x: number;
  y: number;
}
export interface Player extends GameObject {
  score: number;
  lives: number;
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