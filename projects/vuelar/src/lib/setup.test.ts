import {ChangeDetectorRef, Component, ComponentFactoryResolver, Input} from '@angular/core';
import {render} from '@testing-library/angular';
import {screen, waitFor} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {Setup} from './setup';
import {ref, toRef} from '@vue/reactivity';

@Setup(() => {
  const other = ref('I am other');
  return {
    test: 'Hello, world!',
    other
  };
})
@Component({
  selector: 'test-setup',
  template: `
    <p>{{test}}</p>
    <p>{{other}}</p>
  `
})
class TestComponent {
  test: any;
  other: any;

  constructor() {
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


@Setup((props) => {
  const other = toRef(props, 'hello');

  return {
    other
  };
})
@Component({
  selector: 'test-setup',
  template: `
    <p>{{other}}</p>
  `
})
class PropsTestComponent {
  other: any;

  @Input() hello = '';

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private cd: ChangeDetectorRef) {
  }
}

it('should render absolute basic prop ref return', async () => {
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

