import { ReplaySubject, SchedulerLike } from 'rxjs';
import { first } from 'rxjs/operators';

class EnhancedReplaySubject<T> extends ReplaySubject<T> {
    constructor(bufferSize?: number, windowTime?: number, scheduler?: SchedulerLike) {
        super(bufferSize, windowTime, scheduler);
    }

    public getValue(): T {        
        let value: any;
        this.pipe(first()).subscribe((n: T) => {
            value = n;
        });
        return value;
    }
}

const rs = new EnhancedReplaySubject<number>(1);
rs.next(69);
const value: number = rs.getValue();
console.log(value); // 69

// https://medium.com/@CKGrafico/learning-typescript-07-augmenting-types-2d89f98b6c77
// https://www.typescriptlang.org/docs/handbook/declaration-merging.html
// https://medium.com/iqoqo-engineering/two-advanced-techniques-to-make-you-a-typescript-wizard-df42e00b1cf8
// https://kimsereyblog.blogspot.com/2017/09/create-type-extensions-in-typescript.html

// function getValue<T>(replaySubject: ReplaySubject<T>): T {
//     let value: any;
//     replaySubject.subscribe((n: T) => {
//         value = n;
//     }).unsubscribe();
//     return value;
// }

// const value = getValue(rs)
// console.log(value)
// const value: number = rs.getValue()
// console.log(value) // 69



