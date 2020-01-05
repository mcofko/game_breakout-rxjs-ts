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
import { GAME_SIZE, BALL_SPEED } from './constants';
import { Player, Ball, GameObject, GameState } from './types';
import { noop, render } from './canvas';

const createGameObject = (x, y) => ({x, y});

const player$ = combineLatest(
  of({ ...createGameObject(GAME_SIZE - 2, (GAME_SIZE / 2) - 1), score: 0, lives: 3 }),
  fromEvent(document, 'keyup').pipe(startWith({code: ''}), pluck('code'))
).pipe(
  map(([player, key]: [Player, string]) => {
    key === 'ArrowLeft' ? player.y -= 1 : key === 'ArrowRight' ? player.y += 1 : noop;

    return player;
  })
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

// const processGameCollisions = (_, [player, ball, bricks]: [Player, Ball, GameObject[]])
//   : GameState => (
//     (collidingBrickIndex => collidingBrickIndex > -1
//       ? (bricks.splice(collidingBrickIndex, 1), ball.dirX *= -1, player.score++)
//       : noop
//     )(bricks.findIndex(e => e.x === ball.x && e.y === ball.y)),
//     ball.dirX *= player.x === ball.x && player.y === ball.y ? -1 : 1,
//     ball.x > player.x ? (player.lives-- , ball.x = (GAME_SIZE / 2) - 3) : noop,
//     {player: player, ball: ball, bricks: bricks}
//   );

const processGameCollisions = (_, {player, ball, bricks})
  : GameState => {
    (collidingBrickIndex => collidingBrickIndex > -1
      ? (bricks.splice(collidingBrickIndex, 1), ball.dirX *= -1, player.score++) : noop)

    (bricks.findIndex(e => e.x === ball.x && e.y === ball.y));
    ball.dirX *= player.x === ball.x && player.y === ball.y ? -1 : 1;
    ball.x > player.x ? (player.lives-- , ball.x = (GAME_SIZE / 2) - 3) : noop;

    return {player: player, ball: ball, bricks: bricks};
  };

combineLatest(player$, ball$, brick$, (v1, v2, v3) => ({player: v1, ball: v2, bricks: v3}))
  .pipe(
    scan<GameState, GameState>( (prevState, newState ) => {
      return processGameCollisions(prevState, newState);
    }),
    tap(render),
    takeWhile( state => state.player.lives > 0)
  )
  .subscribe((value: GameState) => { }, (e) => { console.log('Error: ' + e); }, () => { console.log('completed'); });