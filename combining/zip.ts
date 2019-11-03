import { Observable, Subscriber, zip } from 'rxjs';

const o1 = new Observable((subscriber: Subscriber<number>) => {
    console.log('o1$ executing');
    const timeout = setTimeout(() => {
        console.log('emitting 1');
        subscriber.next(1);
        console.log('emitting 11');
        subscriber.next(11);
        subscriber.complete();
    }, 1000);
    return () => {
        console.log('teardown o1$');
        clearTimeout(timeout);
    }
});

const o5 = new Observable((subscriber: Subscriber<number>) => {
    console.log('o5$ executing');
    console.log('emitting 5');
    subscriber.next(5);
    console.log('emitting 55');
    subscriber.next(55);
    const timeout = setTimeout(() => {
        // no llegará nunca a ejecutarse, porque zip canceló la suscripción
        // 555 no tendría valores con quien combinar, o1$ y o$3 sólo emitieron 2 valores
        console.log('emitting 555');
        subscriber.next(555);
        subscriber.complete();
    }, 5000);
    return () => {
        console.log('teardown o5$');
        clearTimeout(timeout);
    }
});

const o3 = new Observable((subscriber: Subscriber<number>) => {
    console.log('o3$ executing');
    const timeout = setTimeout(() => {
        console.log('emitting 3');
        subscriber.next(3);
        console.log('emitting 33');
        subscriber.next(33);
        subscriber.complete();
    }, 3000);
    return () => {
        console.log('teardown o3$');
        clearTimeout(timeout);
    }
});

// Invoca los observables y cuando tenga un valor emitido de todos ellos, zip emitirá un array con esos valores.
// Cuando vuelva a ver una nueva combinación de valores (todos los observables hayan vuelto a emitir un nuevo valor), zip volverá a emitir.
// Si zip detecta que no va a poder crear más “nuevas combinaciones”, podría cancelar las suscripciones.

zip(o1, o5, o3).subscribe((n) => {
    console.log(n);
});

// o1$ executing
// o5$ executing
// emitting 5
// emitting 55
// o3$ executing
// emitting 1
// emitting 11
// teardown o1$
// emitting 3
// [ 1, 5, 3 ]
// emitting 33
// [ 11, 55, 33 ]
// teardown o5$
// teardown o3$