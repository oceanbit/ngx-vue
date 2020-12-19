import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ref} from '@vue/reactivity';

// tslint:disable-next-line:typedef
function Setup<SetupReturn, T extends new (...args: any[]) => any>(setupFn: (tick: () => void) => SetupReturn) {
  return (constructor: T) => {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);

        // tslint:disable-next-line:variable-name
        const __data = ref({});

        const setVariables = (data: any) => {
          Object.keys(data).forEach(key => {
            this[key] = data[key];
          });
        };

        const detectChanges = () => {
          setVariables(__data.value);
          // cd.detectChanges();
        };

        __data.value = setupFn(detectChanges);

        detectChanges();
      }
    };
  };
}

@Setup((detectChanges) => {
  const test = ref(12);

  const addToPlus = (): void => {
    test.value += 1;
    detectChanges();
  };

  return {
    test,
    addToPlus
  };
})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  test: any;
  addToPlus: any;

  constructor() {}
}
