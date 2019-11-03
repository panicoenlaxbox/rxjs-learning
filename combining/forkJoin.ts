import { Observable, Subscriber, forkJoin } from 'rxjs';

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
        // subscriber.error('DivideByZeroException');
        subscriber.complete();
    }, 3000);
    return () => {
        console.log('teardown o3$');
        clearTimeout(timeout);
    }
});

// Invocar varios observables y esperar a que todos se completen todos para emitir un único valor que es un array con el último valor emitido de cada uno de ellos.
//  Si un observable falla, se cancelaran el resto de observables y forkJoin no emitirá.
// La ejecución de los observables es en paralelo, aunque la invocación sea en el orden suministrado en los parámetros.
// Caso de uso
//  Task.WhenAll C#

forkJoin([o1$, o5$, o3$]).subscribe((n) => {
    console.log(n);
}, (err) => {
    console.log('err ' + err);
});

// o1$ executing
// o5$ executing
// o3$ executing
// emitting 0
// emitting 1
// emitting 3
// emitting 5
// [ 1, 5, 3 ]