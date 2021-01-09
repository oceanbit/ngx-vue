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

@Component({
  selector: 'test-setup',
  template: `
    <p>{{test}}</p>
    <p>{{other}}</p>
    <p>{{helloProp}}</p>
  `
})
class TestComponent extends SetupComp implements OnSetup {
  test!: string;
  other!: string;
  helloProp!: string;

  @Input() hello = '';

  ngOnSetup(props: this): any {
    const other = ref('I am other');

    const helloProp = toRef(props, 'hello');

    return {
      test: 'Hello, world!',
      other,
      helloProp
    };
  }

  constructor(cd: ChangeDetectorRef, componentFactoryResolver: ComponentFactoryResolver) {
    super(cd, componentFactoryResolver);
  }
}

it('should render basic setup function return', async () => {
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

it('should render prop ref return', async () => {
  render(TestComponent, {
    componentProperties: {
      hello: 'Hi from OceanBit'
    }
  });

  await waitFor(() => {
    const el = screen.getByText('Hi from OceanBit');
    expect(el).toBeInTheDocument();
  });
});
