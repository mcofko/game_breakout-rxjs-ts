import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { animationFrame } from 'rxjs/scheduler/animationFrame';

import { interval } from 'rxjs/observable/interval';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';

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
  first
} from 'rxjs/operators';

