import { Observable, Subscriber } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const o1$ = new Observable((subscriber: Subscriber<number>) => {
    console.log('o1$ executing');
    
    let i = 1;
    
    console.log(`emitting o1$ ${i}`);
    subscriber.next(i);

    // const interval = setInterval(() => {
    //     console.log(`emitting o1$ ${++i}`);
    //     subscriber.next(i);
    // }, 2000);

    const timeout = setTimeout(()=> {
        console.log(`completing outer by timeout`);
        subscriber.complete();
    }, 2000);

    return () => {
        console.log('o1$ clean up');
        // clearInterval(interval);
        clearTimeout(timeout);
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
    }, 400);

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

//
// high-order observable vs first order observable
// source/outer observable
// inner observable
//
// switchMap recibe un valor y devuelve un nuevo observable
//  en el caso de que el source/outer observable vuelva a emitir, cancela la suscripción, si está viva, al inner observable
//  si el source/outer completa, no se completa automáticamente el inner
//
// casos de uso
//  me suscribo a un observable que emite un número y quiero devolver el resultado de una llamada a una API /get/<número>
//  autocompletar lanza llamada a la API /get/<texto>, y si el usuario vuelve a escribir, se cancela la llamada a la API actual porque ya no aplica según lo escrito por el usuario
//  pendiente de ver en el servidor con cancellationToken si se entera cuando la cancela la request en en cliente...
//

const obs1 = o1$.pipe(
    switchMap(() => o2$)
);

obs1.subscribe(val => {
    console.log('[value] ', val);
});