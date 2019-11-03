import { interval, Observable, Subscriber } from 'rxjs';
import { debounceTime, first } from 'rxjs/operators';

const o = new Observable((subscriber: Subscriber<number>) => {
    // subscriber.next(1);
    // subscriber.next(2);
    let i = 1;
    // const interval = setInterval(()=> {
    //     let value = i++;
    //     console.log(`emitting ${value}`)
    //     subscriber.next(value);
    // }, 1000);
    setTimeout(()=> {
        console.log(`emitting 1`);
        subscriber.next(1);
    }, 1000);
    const s1 = setTimeout(()=> {
        console.log(`emitting 2`);
        subscriber.next(2);
    }, 2500);
    const s2 = setTimeout(()=> {
        subscriber.next(3);
        console.log(`emitting 3`);
        subscriber.complete();
    }, 3000);
    return ()=> {
        console.log('clean up');
        clearTimeout(s1);
        clearTimeout(s2);
    }
});

o.pipe(
    debounceTime(1000),
    first()
).subscribe((n)=> console.log(n));