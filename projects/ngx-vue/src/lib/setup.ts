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

export type SetupReturn<T extends new (...args: any) => any> = Partial<Record<keyof InstanceType<T>, any>>;

export declare interface OnSetup {
  ngOnSetup(props: this): any;
}

@Component({
  template: ''
})
// tslint:disable-next-line:component-class-suffix
export class SetupComp implements OnInit, OnChanges, OnDestroy {

  constructor(private cd: ChangeDetectorRef, private componentFactoryResolver: ComponentFactoryResolver) {
    const properties = componentFactoryResolver?.resolveComponentFactory(this.constructor as any) || {inputs: []};

    const inputProps = properties.inputs
      .map(input => input.propName)
      .reduce((curr, propName) => {
        // @ts-ignore
        curr[propName] = this[propName];
        return curr;
      }, {});

    this.__inputPropsReactive = reactive(inputProps);

    this.__id = getNewInstanceId();
    const instance = createNewInstanceWithId(this.__id);

    useInstanceScope(this.__id, () => {
      this.__data = ref(
        // @ts-ignore
        this.ngOnSetup(readonly(this.__inputPropsReactive))
      );

      invokeLifeCycle(LifecycleHooks.BEFORE_MOUNT);

      instance.data = this.__data;
    });

    this.__detectChanges();
    this.afterConstructor = true;
  }
  __id = 0;
  __inputPropsReactive: Record<string, any> = {};
  __data: any;

  afterConstructor = false;

  __setVariables = (data: any) => {
    Object.keys(data).forEach(key => {
      // @ts-ignore
      this[key] = data[key];
    });
  };

  __detectChanges = () => {
    this.__setVariables(this.__data.value);
    if (this.afterConstructor) {
      this.cd.detectChanges();
    }
  }

  ngOnInit(...args: any[]) {
    /**
     * The `SetupComp` constructor is ran _before_ the constructor for the Angular component. Because of this,
     * the default values of the component will overwrite the Setup fn return values.
     *
     * Because of this, we recommend consumers _not_ add default values to their properties (and instead instantiate props like "test!: number"
     * in order to have the initial render of the Angular app populate the data rather than waiting for the initial render to populate it
     * (flash of "text" style)
     *
     * However, we acknowledge that incorrect data rendering to the screen is never wanted, so we have this as an edgecase in case the consumer
     * forgets and assigns a default value anyway.
     */
    this.__detectChanges();

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

  ngOnChanges(...args: any[]) {
    const changes: SimpleChanges = args[0];
    Object.keys(changes).forEach(changeKey => {
      this.__inputPropsReactive[changeKey] = changes[changeKey].currentValue;
    });

    this.__detectChanges();
    this.cd.detectChanges();
  }

  ngOnDestroy(...args: any[]) {
    unmountInstance(this.__id);
  }
}
