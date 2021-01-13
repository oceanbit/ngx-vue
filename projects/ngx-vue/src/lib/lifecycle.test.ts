import {ChangeDetectorRef, Component, ComponentFactoryResolver, Input} from '@angular/core';
import {fireEvent, render} from '@testing-library/angular';
import {screen, waitFor} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {
  OnSetup,
  SetupComp,
  toRef,
  onMounted,
  onBeforeMount,
  onUnmounted,
  onUpdated, onBeforeUnmount, onBeforeUpdate
} from '../public-api';

const onMountedJestFn = jest.fn();
const onBeforeMountJestFn = jest.fn();
const onUnmountedJestFn = jest.fn();
const onUpdatedJestFn = jest.fn();
const onBeforeUnmountJestFn = jest.fn();
const onBeforeUpdateJestFn = jest.fn();

beforeEach(() => {
  onMountedJestFn.mockClear();
  onBeforeMountJestFn.mockClear();
  onUnmountedJestFn.mockClear();
  onUpdatedJestFn.mockClear();
  onBeforeUnmountJestFn.mockClear();
  onBeforeUpdateJestFn.mockClear();
});

@Component({
  selector: 'lifecycle-setup',
  template: `
    <p>{{other}}</p>
  `
})
class LifecycleTestComponent extends SetupComp implements OnSetup {
  @Input() hello = '';

  other!: string;

  ngOnSetup(props: this) {
    const other = toRef(props, 'hello');

    onBeforeMount(() => onBeforeMountJestFn());
    onMounted(() => onMountedJestFn());
    onBeforeUpdate(() => onBeforeUpdateJestFn());
    onUpdated(() => onUpdatedJestFn());
    onBeforeUnmount(() => onBeforeUnmountJestFn());
    onUnmounted(() => onUnmountedJestFn());

    return {
      other
    };
  }

  constructor(cd: ChangeDetectorRef, componentFactoryResolver: ComponentFactoryResolver) {
    super(cd, componentFactoryResolver);
  }
}


it('should run the mounted lifecycles', async () => {
  await render(LifecycleTestComponent);

  await waitFor(() => {
    expect(onMountedJestFn).toBeCalled();
    expect(onBeforeMountJestFn).toBeCalled();
  });
});


it('should run the updated lifecycles', async () => {
  const comp = await render(LifecycleTestComponent, {
    componentProperties: {
      hello: 'Hello, world!'
    }
  });

  comp.rerender({
    hello: 'Bye~~, world!'
  });

  await waitFor(() => {
    expect(onBeforeUpdateJestFn).toBeCalled();
    expect(onUpdatedJestFn).toBeCalled();
  });
});


@Component({
  selector: 'destroy-comp',
  template: `
    <lifecycle-setup *ngIf="show"></lifecycle-setup>
    <button (click)="show = false">Hide</button>
  `
})
class DestroyTestComponent {
  show = true;
}

it('should run the unmounted lifecycles', async () => {
  await render(DestroyTestComponent, {
    declarations: [LifecycleTestComponent]
  });

  fireEvent.click(screen.getByText('Hide'));

  await waitFor(() => {
    expect(onBeforeUnmountJestFn).toBeCalled();
    expect(onUnmountedJestFn).toBeCalled();
  });
});
