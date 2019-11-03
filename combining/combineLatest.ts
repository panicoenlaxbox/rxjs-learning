import { Observable, Subscriber, combineLatest } from 'rxjs';

const o1$ = new Observable((subscriber: Subscriber<number>) => {
    console.log('o1$ executing');
    const timeout = setTimeout(() => {
        console.log('emitting 1');
        subscriber.next(1);
        console.log('emitting 11');
        subscriber.next(11);
        subscriber.complete();
    }, 100);
    return () => {
        clearTimeout(timeout);
    }
});

const o5$ = new Observable((subscriber: Subscriber<string>) => {
    console.log('o5$ executing');
    const timeout1 = setTimeout(() => {
        console.log('emitting 5');
        subscriber.next('5');
    }, 500);
    const timeout2 = setTimeout(() => {
        console.log('emitting 55');
        subscriber.next('55');
        subscriber.complete();
    }, 1500);
    return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
    }
});

const o3$ = new Observable((subscriber: Subscriber<number>) => {
    console.log('o3$ executing');
    const timeout1 = setTimeout(() => {
        console.log('emitting 3');
        subscriber.next(3);
    }, 1000);
    const timeout2 = setTimeout(() => {
        console.log('emitting 33');
        subscriber.next(33);
        subscriber.complete();
    }, 1000);
    return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
    }
});

// Cuando todos los observables hayan emitido un valor, combineLatest emite un array con el último valor emitido por cada observable.
// Respetando el orden en lo que se hayan pasado los observables a combineLatest.
// Si alguno de los observables vuelve a emitir un valor, combineLatest vuelve a emitir un array donde sólo cambia (respecto a su anterior emisión) el nuevo valor emitido por el observable.

combineLatest(o1$, o5$, o3$).subscribe((n) => {
    console.log(n);
});

// o1$ executing
// o5$ executing
// o3$ executing
// emitting 1
// emitting 11
// emitting 5
// emitting 3
// [ 11, '5', 3 ]
// emitting 33
// [ 11, '5', 33 ]
// emitting 55
// [ 11, '55', 33 ]