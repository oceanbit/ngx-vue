import {ChangeDetectorRef, Component, ComponentFactoryResolver, Input, OnDestroy} from '@angular/core';
import {fireEvent, render} from '@testing-library/angular';
import {screen, waitFor} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {
  OnSetup,
  SetupComp,
  computed,
  ref,
  toRef,
  watch,
  watchEffect,
  onMounted,
  onBeforeMount,
  onUnmounted,
  onUpdated, onBeforeUnmount, onBeforeUpdate
} from '../public-api';

@Component({
  selector: 'test-setup',
  template: `
    <p>{{test}}</p>
    <p>{{other}}</p>
  `
})
class TestComponent extends SetupComp implements OnSetup {
  test!: string;
  other!: string;

  ngOnSetup(props: this): any {
    const other = ref('I am other');
    return {
      test: 'Hello, world!',
      other
    };
  }

  constructor(cd: ChangeDetectorRef, componentFactoryResolver: ComponentFactoryResolver) {
    super(cd, componentFactoryResolver);
  }
}

it('should render absolute basic setup function return', async () => {
  render(TestComponent);

  await waitFor(() => {
    const el = screen.getByText('Hello, world!');
    expect(el).toBeInTheDocument();
  });
});

it('should render absolute basic ref function return', async () => {
  render(TestComponent);

  await waitFor(() => {
    const el = screen.getByText('I am other');
    expect(el).toBeInTheDocument();
  });
});

const watchJestFn = jest.fn();
const watchEffectJestFn = jest.fn();
const onMountedJestFn = jest.fn();
const onBeforeMountJestFn = jest.fn();
const onUnmountedJestFn = jest.fn();
const onUpdatedJestFn = jest.fn();
const onBeforeUnmountJestFn = jest.fn();
const onBeforeUpdateJestFn = jest.fn();

beforeEach(() => {
  watchJestFn.mockClear();
  watchEffectJestFn.mockClear();
  onMountedJestFn.mockClear();
  onBeforeMountJestFn.mockClear();
  onUnmountedJestFn.mockClear();
  onUpdatedJestFn.mockClear();
  onBeforeUnmountJestFn.mockClear();
  onBeforeUpdateJestFn.mockClear();
});

@Component({
  selector: 'test-setup',
  template: `
    <p>{{other}}</p>
    <p>{{comp}}</p>
  `
})
class PropsTestComponent extends SetupComp implements OnSetup {
  other!: string;
  comp!: string;

  @Input() hello = '';

  ngOnSetup(props: this) {
    const other = toRef(props, 'hello');

    const comp = computed(() => `${other?.value?.substr(0, 5) || ''}, Corbin`);

    watch(comp, () => watchJestFn());

    watchEffect(() => {
      watchEffectJestFn(comp);
    });

    return {
      other,
      comp
    };
  }

  constructor(cd: ChangeDetectorRef, componentFactoryResolver: ComponentFactoryResolver) {
    super(cd, componentFactoryResolver);
  }
}

it('should render prop ref return', async () => {
  render(PropsTestComponent, {
    componentProperties: {
      hello: 'Hello, world!'
    }
  });

  await waitFor(() => {
    const el = screen.getByText('Hello, world!');
    expect(el).toBeInTheDocument();
  });
});

it('should render computed prop return', async () => {
  render(PropsTestComponent, {
    componentProperties: {
      hello: 'Hello, world!'
    }
  });

  await waitFor(() => {
    const el = screen.getByText('Hello, Corbin');
    expect(el).toBeInTheDocument();
  });
});


it('should render computed after re-render', async () => {
  const comp = await render(PropsTestComponent, {
    componentProperties: {
      hello: 'Hello, world!'
    }
  });

  comp.rerender({
    hello: 'Bye~~, world!'
  });

  await waitFor(() => {
    const el = screen.getByText('Bye~~, Corbin');
    expect(el).toBeInTheDocument();
  });
});

it('watch should work as-expected', async () => {
  const comp = await render(PropsTestComponent, {
    componentProperties: {
      hello: 'Hello, world!'
    }
  });

  comp.rerender({
    hello: 'Bye~~, world!'
  });

  await waitFor(() => {
    expect(watchJestFn).toBeCalled();
  });
});

// TODO: Fix this test
it.skip('watcheffect should work as-expected', async () => {
  const comp = await render(PropsTestComponent, {
    componentProperties: {
      hello: 'Hello, world!'
    }
  });

  comp.rerender({
    hello: 'Bye~~, world!'
  });

  await waitFor(() => {
    expect(watchEffectJestFn).toBeCalled();
  });
});


@Component({
  selector: 'lifecycle-setup',
  template: `
  `
})
class LifecycleTestComponent extends SetupComp implements OnSetup {
  @Input() hello = '';

  ngOnSetup(props: this) {
    const other = toRef(props, 'hello');

    const comp = computed(() => `${other?.value?.substr(0, 5) || ''}, Corbin`);

    watch(comp, () => watchJestFn());

    onBeforeMount(() => onBeforeMountJestFn());
    onMounted(() => onMountedJestFn());
    onBeforeUpdate(() => onBeforeUpdateJestFn());
    onUpdated(() => onUpdatedJestFn());
    // onBeforeUnmount(() => onBeforeUnmountJestFn());
    onUnmounted(() => onUnmountedJestFn());

    return {
      other,
      comp
    };
  }

  constructor(cd: ChangeDetectorRef, componentFactoryResolver: ComponentFactoryResolver) {
    super(cd, componentFactoryResolver);
  }
}


it('should run the mounted lifecycles', async () => {
  render(LifecycleTestComponent);

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

// TODO: Get this working
it.skip('should run the unmounted lifecycles', async () => {
  render(DestroyTestComponent, {
    declarations: [LifecycleTestComponent]
  });

  fireEvent.click(screen.getByText('Hide'));

  await waitFor(() => {
    expect(onBeforeUnmountJestFn).toBeCalled();
    expect(onUnmountedJestFn).toBeCalled();
  });
});
