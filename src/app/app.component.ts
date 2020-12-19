import {ChangeDetectionStrategy, Component, ComponentFactoryResolver, Input} from '@angular/core';
import {ref} from '@vue/reactivity';

import 'reflect-metadata';
import {getFilteredProperties, isFilter} from './isFilter';

const metadataKey = Symbol('Input');

// tslint:disable-next-line:typedef
function Setup<SetupReturn, PropsT, T extends new (...args: any[]) => any>(setupFn: (props: PropsT, tick: () => void) => SetupReturn) {
  return (constructor: T) => {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);

        const componentFactoryResolver: ComponentFactoryResolver = args[0];

        const properties = componentFactoryResolver.resolveComponentFactory(this.constructor as any);

        type CompClass = keyof InstanceType<T>;
        type CompProp = keyof CompClass;

        const inputProps = properties.inputs
          .map(input => input.propName)
          .reduce((curr, propName) => {
            curr[propName as CompProp] = this[propName];
            return curr;
          }, {} as Record<CompClass, CompClass[CompProp]>);

        console.log('properties', inputProps);

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

        __data.value = setupFn(this, detectChanges);

        detectChanges();
      }
    };
  };
}

@Setup((props: { testing: string }, detectChanges) => {
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

  @Input() testing = '';

  // TODO: Migrate to use service to DI into this:
  // https://stackoverflow.com/a/52667101/4148154
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

}
