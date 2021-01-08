import {
  ChangeDetectorRef, Component,
  ComponentFactoryResolver,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {reactive, readonly, ref} from '@vue/reactivity';
import {LifecycleHooks} from './types';
import {invokeLifeCycle} from './lifecycle';
import {createNewInstanceWithId, getNewInstanceId, unmountInstance, useInstanceScope} from './component';
import {watch} from './watch';

type CompClass = new (...args: any[]) => any;
type CompClassInst<T extends CompClass> = InstanceType<T>;
type CompProp<T extends CompClass> = keyof CompClassInst<T>;
type CompProps<T extends CompClass> = Record<CompProp<T>, CompClassInst<T>[CompProp<T>]>;

// tslint:disable-next-line:typedef
export function Setup<SetupReturn, T extends CompClass>(setupFn: (props: any) => SetupReturn) {
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

        this.__id = getNewInstanceId();
        const instance = createNewInstanceWithId(this.__id);

        useInstanceScope(this.__id, () => {
          this.__data = ref(
            setupFn(readonly(this.__inputPropsReactive))
          );

          invokeLifeCycle(LifecycleHooks.BEFORE_MOUNT);

          instance.data = this.__data;
        });

        this.__detectChanges();
      }
    };
  };
}

@Component({
  template: ''
})
// tslint:disable-next-line:component-class-suffix
export class SetupComp implements OnInit, OnChanges, OnDestroy {
  __cd: ChangeDetectorRef = 0 as any;
  __id = 0;
  __inputPropsReactive: Record<string, any> = {};
  __setVariables: Function = () => {
  };
  __detectChanges: Function = () => {
  };

  ngOnInit(...args: any[]) {
    // trigger Angular re-render on data changes
    useInstanceScope(this.__id, (instance) => {
      if (!instance) {
        return;
      }

      invokeLifeCycle(LifecycleHooks.MOUNTED);

      const {data} = instance;
      watch(
        data,
        () => {
          useInstanceScope(this.__id, () => {
            invokeLifeCycle(LifecycleHooks.BEFORE_UPDATE);
            // trigger React update
            this.__detectChanges();
            invokeLifeCycle(LifecycleHooks.UPDATED);
          });
        },
        {deep: true, flush: 'post'},
      );
    });
  }

  // tslint:disable-next-line:typedef
  ngOnChanges(...args: any[]) {
    const changes: SimpleChanges = args[0];
    Object.keys(changes).forEach(changeKey => {
      this.__inputPropsReactive[changeKey] = changes[changeKey].currentValue;
    });

    this.__detectChanges();
    if (!this.__cd) {
      return;
    }
    this.__cd.detectChanges();
  }

  ngOnDestroy(...args: any[]) {
    unmountInstance(this.__id);
  }
}
