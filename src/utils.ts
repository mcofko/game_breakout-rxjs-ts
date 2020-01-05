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

export const processGameCollisions = (_, {player, ball, bricks}: GameState): GameState => {
    checkBallvsBrickCollision(ball, bricks) ? player.score++ : noop;

    ball.dirX *= (player.paddle[0].x === ball.x && player.paddle.some((paddleBlock: Point2D) => paddleBlock.y === ball.y)) ? -1 : 1;

    ball.x > player.paddle[0].x ? (player.lives-- , ball.x = (GAME_SIZE / 2) - 3) : noop;

    return {player: player, ball: ball, bricks: bricks};
};

export const checkBallvsBrickCollision = (ball, bricks): boolean => {
  let ret: boolean = false;
  let colliderBrickIdx: number = bricks.findIndex(e => e.x === ball.x && e.y === ball.y);

  colliderBrickIdx > -1 ? (bricks.splice(colliderBrickIdx, 1), ball.dirX *= -1, ret = !ret) : noop;

  return ret;
};