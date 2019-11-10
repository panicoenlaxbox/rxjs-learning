import { withLatestFrom } from 'rxjs/operators';
import { Observable, Subscriber } from 'rxjs';

const o1$ = new Observable((subscriber: Subscriber<number>) => {
    console.log('o1$ executing');
    let i = 0;
    const interval = setInterval(() => {
        console.log(`emitting o1$ ${++i}`);
        subscriber.next(i);
        // if (i == 5) {
        //     console.log('o1$ completing');
        //     subscriber.complete();
        // }
    }, 2000);
    return () => {
        console.log('o1$ clean up');
        clearInterval(interval);
    }
});

const o2$ = new Observable((subscriber: Subscriber<string>) => {
    console.log('o2$ executing');
    let i = 0;
    const interval = setInterval(() => {
        console.log(`emitting o2$ '${++i}'`);
        subscriber.next(i.toString());
        // if (i == 5) {
        //     console.log('o2$ completing');
        //     subscriber.complete();
        // }
    }, 1000);
    return () => {
        console.log('o2$ clean up');
        clearInterval(interval);
    }
});

// Combina el source observable con un inner observable para crear un nuevo observable
// cuyos valores son calculados desde el útimo valor emitido por cada uno de los anteriores (source e inner)
// y el nuevo observable emite sólo cuando el source observable emite
// Si se completa el source observable, se completa automáticamente el inner observable
// Si se completa el inner observable, el source seguirá emitiendo y como último valor del inner siempre cojerá el último emitido por inner

// Caso de uso... pues ahora mismo no caigo... sólo sé que cuando emita el source (outer) recibiré un valor 
// con la suma de el valor emitido por source (el último, esto es lógico, es quien provocó que withLatestFrom emita) 
// y con el último valor del inner (que me da igual que esté o no completado)
o1$.pipe(
    withLatestFrom(o2$)
).subscribe(value => {
    console.log('[value]', value);
});

// o2$ executing
// o1$ executing
// emitting o2$ '1'
// emitting o1$ 1
// [value] [ 1, '1' ]
// emitting o2$ '2'
// emitting o2$ '3'
// emitting o1$ 2
// [value] [ 2, '3' ]
// emitting o2$ '4'
// emitting o2$ '5'
// emitting o1$ 3
// [value] [ 3, '5' ]
// emitting o2$ '6'
// emitting o2$ '7'
// emitting o1$ 4
// [value] [ 4, '7' ]
// emitting o2$ '8'
// emitting o2$ '9'
// emitting o1$ 5
// [value] [ 5, '9' ]
// o1$ completing
// o2$ clean up
// o1$ clean up


// o2$ executing
// o1$ executing
// emitting o2$ '1'
// emitting o1$ 1
// [value] [ 1, '1' ]
// emitting o2$ '2'
// emitting o2$ '3'
// emitting o1$ 2
// [value] [ 2, '3' ]
// emitting o2$ '4'
// emitting o2$ '5'
// o2$ completing
// o2$ clean up
// emitting o1$ 3
// [value] [ 3, '5' ]
// emitting o1$ 4
// [value] [ 4, '5' ]
// emitting o1$ 5
// [value] [ 5, '5' ]
// ...