import {Component} from '@angular/core';
import {ref} from '@vue/reactivity';

// tslint:disable-next-line:typedef
function Setup<SetupReturn, T extends new (...args: any[]) => any>(setupFn: (tick: () => void) => SetupReturn) {
  const tick = () => {
  };

  const data = ref(setupFn(tick));

  return (constructor: T) => {
    return class extends constructor {
      data = data.value;
    };
  };
}

@Setup(() => {
  const test = ref(12);

  const addToPlus = (): void => {
    test.value += 1;
    // setTick();
  };

  return {
    test,
    addToPlus
  };
})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  data: any;
}
