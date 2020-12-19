import {Component} from '@angular/core';
import {render} from '@testing-library/angular';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';

@Component({
  selector: 'test-setup',
  template: `
    <p>Hello</p>
  `
})
class TestComponent {}

it('should do a thing', () => {
  render(TestComponent);

  const el = screen.getByText('Hello');
  expect(el).toBeInTheDocument();
});
