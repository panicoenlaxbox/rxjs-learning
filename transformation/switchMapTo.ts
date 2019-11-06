import { of, interval } from 'rxjs';
import { switchMapTo } from 'rxjs/operators';

// caso de uso
//  como los de switchMap pero no me importa la entrada, por ejemplo, me suscribo a un evento de click y quiero hacer una llamada a la API con valor constante
//      o cogiendo el valor de otro sitio que no es observable source/outer
const obs1 = interval(500).pipe(
    switchMapTo(of(1))
);

obs1.subscribe(val => {
    console.log(val);
});