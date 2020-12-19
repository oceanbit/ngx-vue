import {ChangeDetectionStrategy, Component, ComponentFactoryResolver, Input} from '@angular/core';
import {reactive, Ref, ref, UnwrapRef} from '@vue/reactivity';

type CompClass = new (...args: any[]) => any;
type CompClassInst<T extends CompClass> = keyof InstanceType<T>;
type CompProp<T extends CompClass> = keyof CompClassInst<T>;
type CompProps<T extends CompClass> = Record<CompClassInst<T>, CompClassInst<T>[CompProp<T>]>;

// From `@vue/reactivity`
type UnwrapNestedRefs<T> = T extends Ref ? T : UnwrapRef<T>;

// tslint:disable-next-line:typedef max-line-length
function Setup<T extends CompClass, SetupReturn = any>(setupFn: (props: UnwrapNestedRefs<CompProps<T>>, tick: () => void) => SetupReturn) {
  return (constructor: T) => {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);

        const componentFactoryResolver: ComponentFactoryResolver = args[0];

        const properties = componentFactoryResolver.resolveComponentFactory(this.constructor as any);

        const inputProps = properties.inputs
          .map(input => input.propName)
          .reduce((curr, propName) => {
            curr[propName as CompProp<T>] = this[propName];
            return curr;
          }, {} as CompProps<T>);

        const inputPropsReactive = reactive(inputProps);

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

        __data.value = setupFn(inputPropsReactive, detectChanges);

        detectChanges();
      }
    };
  };
}

@Setup<typeof AppComponent>((props, detectChanges) => {
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
