import { Observable, Subscriber, concat } from 'rxjs';

const o1$ = new Observable((subscriber: Subscriber<number>) => {
    console.log('o1$ executing');
    const timeout = setTimeout(() => {
        console.log('emitting 0');
        subscriber.next(0);
        console.log('emitting 1');
        subscriber.next(1);
        subscriber.complete();
    }, 1000);
    return () => {
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
        clearTimeout(timeout);
    }
});

// Ejecuta en orden secuencial los observables suministrados
// Para ejecutar el segundo observable, el primer observable debe completar, y así sucesivamente.
// En cuanto a la emisión, concat emite tan pronto recibe valores, no espera a que el observable que se esté ejecutando esté completado.
// Caso de uso
//  Secuencia de acciones con acoplamiento temporal y que requieren ordenación. 
//      Por ejemplo, llamar a endpoint1, después a endpoint2 y después a endpoint3.

concat(o1$, o5$, o3$).subscribe((n) => {
    console.log(n);
});

// o1$ executing
// emitting 0
// 0
// emitting 1
// 1
// o5$ executing
// emitting 5
// 5
// o3$ executing
// emitting 3
// 3