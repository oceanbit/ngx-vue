import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Input,
  OnChanges,
  SimpleChanges, ViewRef
} from '@angular/core';
import {computed, reactive, readonly, ref} from '@vue/reactivity';

type CompClass = new (...args: any[]) => any;
type CompClassInst<T extends CompClass> = InstanceType<T>;
type CompProp<T extends CompClass> = keyof CompClassInst<T>;
type CompProps<T extends CompClass> = Record<CompProp<T>, CompClassInst<T>[CompProp<T>]>;

// tslint:disable-next-line:typedef max-line-length
function Setup<SetupReturn, T extends CompClass>(setupFn: (props: any, tick: () => void) => SetupReturn) {
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

        const properties = componentFactoryResolver.resolveComponentFactory(this.constructor as any);

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
        super.ngOnChanges(...args);
        const changes: SimpleChanges = args[0];
        Object.keys(changes).forEach(changeKey => {
          this.__inputPropsReactive[changeKey] = changes[changeKey].currentValue;
        });

        this.__detectChanges();
        this.__cd.detectChanges();
      }
    };
  };
}

@Setup((_, detectChanges) => {
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

  // MUST have these two items in your constructor, sadly :(
  constructor(private componentFactoryResolver: ComponentFactoryResolver, private cd: ChangeDetectorRef) {
  }
}

@Setup((props: { number: number }) => {
  const newNum = computed(() => {
    return props.number * 10;
  });

  return {
    newNum
  };
})
@Component({
  selector: 'child-root',
  template: `<h1>{{newNum}}</h1> `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildComponent implements OnChanges {
  @Input() number = 0;
  newNum: any;

  // TODO: Migrate to use service to DI into this:
  // https://stackoverflow.com/a/52667101/4148154
  constructor(private componentFactoryResolver: ComponentFactoryResolver, private cd: ChangeDetectorRef) {
  }

  // This MUST be here, otherwise it won't call on parent directive
  ngOnChanges(changes: SimpleChanges): void {
  }
}
