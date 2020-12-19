import {ChangeDetectorRef, Component} from '@angular/core';
import {computed, Ref, ref} from '@vue/reactivity';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private cd: ChangeDetectorRef) {
    this.data = ref((() => {
      const test = ref(12);

      const addToPlus = (): void => {
        test.value += 1;
        this.setTick();
      };

      return {
        test,
        addToPlus
      };
    })());

    this.setTick();
  }
  title = 'CompositionApiDemo';

  mainNumber = 0;
  secondNumber = 0;

  data: Ref<any> = ref('');

  changeMainNumber: () => void = () => {};

  setTick(): void {
    const reff = this.data.value;

    this.mainNumber = reff.test;
    this.changeMainNumber = reff.addToPlus;
  }

  testValues(): void {
    console.log('secondNumber', this.secondNumber);
    console.log('testing', this.data);
  }
}
