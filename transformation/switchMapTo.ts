import { of, interval } from 'rxjs';
import { switchMapTo } from 'rxjs/operators';

const obs1 = interval(500).pipe(
    switchMapTo(of(1))
);

obs1.subscribe(val => {
    console.log(val);
});