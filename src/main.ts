import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { animationFrame } from 'rxjs/scheduler/animationFrame';

import { interval } from 'rxjs/observable/interval';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { generate } from 'rxjs/observable/generate';

import {
  map,
  filter,
  scan,
  startWith,
  distinctUntilChanged,
  share,
  withLatestFrom,
  tap,
  skip,
  takeWhile,
  take,
  switchMap,
  first,
  pluck,
  mergeMap,
  toArray
} from 'rxjs/operators';
import { GAME_SIZE, BALL_SPEED, BRICK_SIZE } from './constants';
import { Player, Ball, GameObject, GameState, Point2D } from './types';
import { noop, render, renderGameOverLite } from './canvas';
import { isGameOver, move, processGameCollisions } from './utils';

const createGameObject = (x, y) => ({x, y});
const createBrickObject: (x: number, y: number) => Point2D[] = function (x, y) {
  let start = Math.floor(y - BRICK_SIZE * 0.5);
  let paddle = Array(BRICK_SIZE).fill({ x: x, y: start }).map((pos: Point2D, index: number) => ({ x: pos.x, y: pos.y + index}));
  return paddle;
};

const createGame = () => {
const player$ = combineLatest(
  of({ paddle: createBrickObject(GAME_SIZE - 2, (GAME_SIZE / 2) - 1), score: 0, lives: 3 }),
  fromEvent(document, 'keydown').pipe(
    startWith({code: 'ArrowLeft'}),
    pluck('code'),
    filter(key => key === 'ArrowLeft' || key === 'ArrowRight')
  )
).pipe(
  tap(console.log),
  map(move)
);

const ball$ = combineLatest(
  of ({ ...createGameObject(GAME_SIZE / 2, (GAME_SIZE - 3)), dirX: 1, dirY: 1 }),
  interval(BALL_SPEED)
).pipe(
  map( ([ball, _]: [Ball, number]) => {
    ball.dirX *= ball.x > 0 ? 1 : -1;
    ball.dirY *= (ball.y > 0 && ball.y < GAME_SIZE - 1) ? 1 : -1;
    ball.x += 1 * ball.dirX;
    ball.y -= 1 * ball.dirY;

    return ball;
  })
);

const brick$ = generate(1, x => x < 8, x => x + 1)
  .pipe(
    mergeMap(r => generate(r % 2 === 0 ? 1 : 0, x => x < GAME_SIZE, x => x + 2)
      .pipe(
        map(c => createGameObject(r, c))
      )
    ),
    toArray()
  );

combineLatest(player$, ball$, brick$, (v1, v2, v3) => ({player: v1, ball: v2, bricks: v3}))
  .pipe(
    scan<GameState, GameState>( (prevState, newState ) => {
      return processGameCollisions(prevState, newState);
    }),
    tap(render),
    takeWhile( state => !isGameOver(state))
  )
  .subscribe((value: GameState) => { }, (e) => { console.log('Error: ' + e); }, () => {
    console.log('completed'); renderGameOverLite();

    click$.subscribe();
  });
};

let click$ = fromEvent(document, 'click').pipe(
  first(),
  tap(() => { createGame(); })
);

createGame();