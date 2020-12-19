import {ComponentFactoryResolver, SimpleChanges} from '@angular/core';
import {reactive, readonly, ref} from '@vue/reactivity';

type CompClass = new (...args: any[]) => any;
type CompClassInst<T extends CompClass> = InstanceType<T>;
type CompProp<T extends CompClass> = keyof CompClassInst<T>;
type CompProps<T extends CompClass> = Record<CompProp<T>, CompClassInst<T>[CompProp<T>]>;

// tslint:disable-next-line:typedef
export function Setup<SetupReturn, T extends CompClass>(setupFn: (props: any, tick: () => void) => SetupReturn) {
  return (constructor: T) => {
    return class extends constructor {

      constructor(...args: any[]) {
        super(...args);

        this.__setVariables = (data: any) => {
          Object.keys(data).forEach(key => {
            this[key] = data[key];
          });
        };

        this.__detectChanges = () => {
          this.__setVariables(this.__data.value);
        };

        const componentFactoryResolver: ComponentFactoryResolver = args.find(arg => arg instanceof ComponentFactoryResolver);

        this.__cd = args.find(arg => !!arg.detectChanges);

        const properties = componentFactoryResolver?.resolveComponentFactory(this.constructor as any) || {inputs: []};

        const inputProps = properties.inputs
          .map(input => input.propName)
          .reduce((curr, propName) => {
            curr[propName as CompProp<T>] = this[propName];
            return curr;
          }, {} as CompProps<T>);

        this.__inputPropsReactive = reactive(inputProps);

        // tslint:disable-next-line:variable-name
        this.__data = ref({});

        this.__data.value = setupFn(readonly(this.__inputPropsReactive), this.__detectChanges);

        this.__detectChanges();
      }

      // tslint:disable-next-line:typedef
      ngOnChanges(...args: any[]) {
        if (super.ngOnChanges) {
          super.ngOnChanges(...args);
        }
        const changes: SimpleChanges = args[0];
        Object.keys(changes).forEach(changeKey => {
          this.__inputPropsReactive[changeKey] = changes[changeKey].currentValue;
        });

        this.__detectChanges();
        if (!this.__cd) { return; }
        this.__cd.detectChanges();
      }
    };
  };
}
