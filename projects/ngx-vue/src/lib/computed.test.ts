import {ChangeDetectorRef, Component, ComponentFactoryResolver, Input} from '@angular/core';
import {render} from '@testing-library/angular';
import {screen, waitFor} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {
  OnSetup,
  SetupComp,
  computed,
  toRef,
} from '../public-api';

@Component({
  selector: 'test-setup',
  template: `
    <p>{{other}}</p>
    <p>{{comp}}</p>
  `
})
class ComputedTestComponent extends SetupComp implements OnSetup {
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

it('should render computed prop return', async () => {
  render(ComputedTestComponent, {
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
  const comp = await render(ComputedTestComponent, {
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
