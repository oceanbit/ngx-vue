import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Input, OnDestroy,
} from '@angular/core';
import {OnSetup, SetupComp, computed, ref} from '../../projects/ngx-vue/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends SetupComp implements OnSetup {
  test!: number;
  addToPlus!: Function;

  // MUST have these two items in your constructor, sadly :(
  constructor(cd: ChangeDetectorRef, componentFactoryResolver: ComponentFactoryResolver) {
    super(cd, componentFactoryResolver);
  }

  ngOnSetup(props: this): any {
    const test = ref(12);

    const addToPlus = (): void => {
      test.value += 1;
    };

    return {
      test,
      addToPlus
    };
  }

  get showComp(): boolean {
    return !!(this.test % 2);
  }
}

@Component({
  selector: 'app-child',
  template: `<h1>{{newNum}}</h1> `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildComponent extends SetupComp implements OnSetup, OnDestroy {
  @Input() number = 0;
  newNum!: number;

  ngOnSetup(props: this): any {
    const newNum = computed(() => {
      return props.number * 10;
    });

    return {
      newNum
    };
  }

  constructor(componentFactoryResolver: ComponentFactoryResolver, cd: ChangeDetectorRef) {
    super(cd, componentFactoryResolver);
  }
}
