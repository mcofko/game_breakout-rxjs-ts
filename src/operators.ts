import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import {Observable} from 'rxjs';

const debuggerOn = true;

export const debug = (message: string) => (source: Observable<any>) =>
    new Observable((observer) => {
        return source.subscribe({
            next(x) {
                if (debuggerOn) {
                    console.log(message, x);
                }
                observer.next(x);
            },
            error(err) { observer.error(err); },
            complete() { observer.complete(); }
        });
    });