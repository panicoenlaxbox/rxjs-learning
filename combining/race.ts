import { Observable, Subscriber, race } from 'rxjs';

const o1$ = new Observable((subscriber: Subscriber<number>) => {
    console.log('o1$ executing');

    // si o1$ emite de forma síncrona, no se llamará a o5$ ni o3$
    // console.log('emitting 0');
    // subscriber.next(0);

    const timeout = setTimeout(() => {
        console.log('emitting 1');
        subscriber.next(1);
        subscriber.complete();
    }, 6000);
    return () => {
        console.log('teardown o1$');
        clearTimeout(timeout);
    }
});

const o5$ = new Observable((subscriber: Subscriber<number>) => {
    console.log('o5$ executing');
    const timeout = setTimeout(() => {
        console.log('emitting 5');
        subscriber.next(5);
        subscriber.complete();
    }, 5000);
    return () => {
        console.log('teardown o5$');
        clearTimeout(timeout);
    }
});

const o3$ = new Observable((subscriber: Subscriber<number>) => {
    console.log('o3$ executing');
    const timeout = setTimeout(() => {
        console.log('emitting 3');
        subscriber.next(3);
        subscriber.complete();
    }, 3000);
    return () => {
        console.log('teardown o3$');
        clearTimeout(timeout);
    }
});

// Invoka los observables pero sólo devuelve datos emitidos del observable que primero emita.
// Si uno de observables emite de forma síncrona, ni llamará/invocará al resto de observables suministrados.
//  Es obvio que ganó la carrera.
// Cuando haya un observable ganador, se cancelará la suscripción al resto de observables.

race(o1$, o5$, o3$).subscribe((n) => {
    console.log(n);
});

// o1$ executing
// o5$ executing
// o3$ executing
// emitting 3
// teardown o1$
// teardown o5$
// 3
// teardown o3$