import { Observable, Subscriber, Subject, Subscription } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

const o1$ = new Observable((subscriber: Subscriber<number>) => {
  console.log('o1$ executing');
  let i = 0;
  const interval = setInterval(() => {
    i++;
    if (i === 3) {
      console.log('o1$ completing');
      subscriber.complete();
    } else {
      console.log(`o1$ emitting ${i}`);
      subscriber.next(i);
    }
  }, 500);
  return () => {
    console.log('o1$ clean up');
    clearInterval(interval);
  }
});

const o2$ = new Observable((subscriber: Subscriber<number>) => {
  console.log('\to2$ executing');
  let i = 0;
  const interval = setInterval(() => {
    i++;
    console.log(`\to2$ emitting ${i}`);
    subscriber.next(i);
  }, 100);
  return () => {
    console.log('\to2$ clean up');
    clearInterval(interval);
  }
});

const $destroy = new Subject();

o1$.pipe(
  switchMap<number, number>((n: number) => o2$.pipe(
    // takeUntil($destroy) // comment/uncomment this line
  )),
).subscribe((n: number) => {
    console.log(`\t\t${n}`);
});

setTimeout(()=> {
  console.log('$destroy emitting');
  $destroy.next();
}, 5000);