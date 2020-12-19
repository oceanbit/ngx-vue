import {ChangeDetectorRef, Component, ComponentFactoryResolver} from '@angular/core';
import {render} from '@testing-library/angular';
import {screen, waitFor} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {Setup} from './setup';
import {ref} from '@vue/reactivity';

@Setup(() => {
  const other = ref("I am other");
  return {
    test: "Hello, world!",
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
