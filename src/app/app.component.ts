import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {computed, ref} from '@vue/reactivity';
import {Setup} from '../../projects/ngx-vue/src/lib/setup';

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
  selector: 'app-child',
  template: `<h1>{{newNum}}</h1> `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildComponent implements OnChanges {
  @Input() number = 0;
  newNum: any;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private cd: ChangeDetectorRef) {
  }

  // This MUST be here, otherwise it won't call on parent directive
  ngOnChanges(changes: SimpleChanges): void {
  }
}
