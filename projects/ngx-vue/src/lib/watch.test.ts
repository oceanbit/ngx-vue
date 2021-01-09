import {ChangeDetectorRef, Component, ComponentFactoryResolver, Input} from '@angular/core';
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

const watchJestFn = jest.fn();
const watchEffectJestFn = jest.fn();

beforeEach(() => {
  watchJestFn.mockClear();
  watchEffectJestFn.mockClear();
});

@Component({
  selector: 'test-setup',
  template: `
    <p>{{other}}</p>
  `
})
class PropsTestComponent extends SetupComp implements OnSetup {
  other!: string;

  @Input() hello = '';

  ngOnSetup(props: this) {
    const other = toRef(props, 'hello');

    watch(other, () => watchJestFn());

    watchEffect(() => {
      watchEffectJestFn(other);
    });

    return {
      other
    };
  }

  constructor(cd: ChangeDetectorRef, componentFactoryResolver: ComponentFactoryResolver) {
    super(cd, componentFactoryResolver);
  }
}

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
