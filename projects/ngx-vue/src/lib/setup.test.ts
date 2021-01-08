import {ChangeDetectorRef, Component, ComponentFactoryResolver, Input} from '@angular/core';
import {render} from '@testing-library/angular';
import {screen, waitFor} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {OnSetup, SetupComp} from './setup';
import {computed, ref, toRef} from '@vue/reactivity';

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

