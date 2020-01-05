import { Player, Ball, GameObject, GameState } from './types';
import { GAME_SIZE } from './constants';

export const COLS = 30;
export const ROWS = 30;
export const GAP_SIZE = 1;
export const CELL_SIZE = 10;
export const CANVAS_WIDTH = COLS * (CELL_SIZE + GAP_SIZE);
export const CANVAS_HEIGHT = ROWS * (CELL_SIZE + GAP_SIZE);

const EMPTY = 0;
const PLAYER = 1;
const BALL = 2;
const BRICK = 3;


// *******************************************************

export const renderGame = () => {};
export const renderGameOverLite = () => (document.body.innerHTML += '<br/>GAME OVER!');
export const noop = () => {};

// *******************************************************

export function createCanvasElement() {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  return canvas;
}

const createElm = (col) => {
  const elem = document.createElement('div');
  elem.classList.add('board');
  elem.style.display = 'inline-block';
  elem.style.margin = '10px';
  elem.style.height = '6px';
  elem.style.width = '6px';
  elem.style['background-color'] =
    col === EMPTY
      ? 'white'
      : col === PLAYER
      ? 'cornflowerblue'
      : col === BALL
      ? 'gray'
      : 'silver';
  elem.style['border-radius'] = col === BALL ? '100%' : '0%';
  return elem;
};

export const render = (gameState: GameState) => {
  const {player, ball, bricks} = {...gameState};

  const game = Array(GAME_SIZE)
    .fill(0)
    .map((e) => Array(GAME_SIZE).fill(0));

  game[player.x][player.y] = PLAYER;
  game[ball.x][ball.y] = BALL;

  bricks.forEach((brick: GameObject) => { game[brick.x][brick.y] = BRICK; });

  document.body.innerHTML = `Score: ${player.score} | Lives: ${player.lives} <br/>`;

  game.forEach((row) => {
    const rowContainer = document.createElement('div');
    row.forEach((cell) => {
      rowContainer.appendChild(createElm(cell));
    });
    document.body.appendChild(rowContainer);
  });
};