import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Input, OnDestroy,
} from '@angular/core';
import {Setup, SetupComp, computed, ref} from '../../projects/ngx-vue/src/public-api';

@Setup((_) => {
  const test = ref(12);

  const addToPlus = (): void => {
    test.value += 1;
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
export class AppComponent extends SetupComp {
  test: any;
  addToPlus: any;

  // MUST have these two items in your constructor, sadly :(
  constructor(private componentFactoryResolver: ComponentFactoryResolver, private cd: ChangeDetectorRef) {
    super();
  }

  get showComp(): boolean {
    return !!(this.test % 2);
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
  selector: 'app-child',
  template: `<h1>{{newNum}}</h1> `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildComponent extends SetupComp implements OnDestroy {
  @Input() number = 0;
  newNum: any;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private cd: ChangeDetectorRef) {
    super();
  }
}
