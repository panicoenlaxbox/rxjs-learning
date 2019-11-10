import { Observable, Subscriber } from 'rxjs';
import { switchMap, mergeMap } from 'rxjs/operators';

const o1$ = new Observable((subscriber: Subscriber<number>) => {
    console.log('o1$ executing');

    let i = 1;

    console.log(`emitting o1$ ${i}`);
    subscriber.next(i);

    const interval = setInterval(() => {
        console.log(`emitting o1$ ${++i}`);
        subscriber.next(i);
    }, 1000);

    // const timeout = setTimeout(()=> {
    //     console.log(`completing outer by timeout`);
    //     subscriber.complete();
    // }, 2000);

    return () => {
        console.log('o1$ clean up');
        clearInterval(interval);
        // clearTimeout(timeout);
    }
});

const o2$ = new Observable((subscriber: Subscriber<number>) => {
    console.log('-- o2$ executing');

    let i = 1;

    console.log(`-- emitting o2$ ${i}`);
    subscriber.next(i);

    const interval = setInterval(() => {
        console.log(`-- emitting o2$ ${++i}`);
        subscriber.next(i);
        // avoid memory leak, uncomment with two eggs :)
        if (i == 5) {
            subscriber.complete();
        }
    }, 300);

    return () => {
        console.log('-- o2$ clean up');
        clearInterval(interval);
    }

    // const timeout = setTimeout(() => {
    //     console.log(`-- emitting o2$ ${++i}`);
    //     subscriber.next(i);
    //     subscriber.complete();
    // }, 500);

    // return () => {
    //     console.log('-- o2$ clean up');
    //     clearTimeout(timeout);
    // }
});

// igual que switchMap, pero mergeMap no cancela la suscripción del inner observable cuando el outer vuelve a emitir
const obs1 = o1$.pipe(
    mergeMap(() => o2$)
);

obs1.subscribe(val => {
    console.log('[value] ', val);
});