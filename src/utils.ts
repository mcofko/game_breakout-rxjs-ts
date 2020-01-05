import { GameState, Player, Point2D } from './types';
import { noop } from './canvas';
import { GAME_SIZE } from './constants';

export function isGameOver(state: GameState): boolean {
  return state.player.lives <= 0;
}

export function move([player, key]: [Player, string]): Player {
  let {paddle: brick} = {...player};

  let leftEdgeY: number = player.paddle[0].y;
  let rightEdgeY: number = player.paddle[player.paddle.length - 1].y;

  key === 'ArrowLeft' && leftEdgeY > 0 ? player.paddle.forEach((pos: Point2D) => pos.y -= 1) : noop;
  key === 'ArrowRight' && rightEdgeY < GAME_SIZE ? player.paddle.forEach((pos: Point2D) => pos.y += 1) : noop;

  return player;
}