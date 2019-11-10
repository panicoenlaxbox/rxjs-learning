import { of, interval } from 'rxjs';
import { mergeMapTo } from 'rxjs/operators';

// mergeMapTo en este caso es igual que switchMapTo porque of complet automáticamente, pero si no lo hiciera
//  sería distinto a switchMap porque cuando emitiera interval otra vez, no se cancelaría automáticamente el inner observable
const obs1 = interval(500).pipe(
    mergeMapTo(of(1))
);

obs1.subscribe(val => {
    console.log(val);
});