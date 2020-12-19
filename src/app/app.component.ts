/**
 * This shows us that you can access `this.` items from the tempate inside
 * that are exposed via a decorator
 */

import {ChangeDetectorRef, Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {computed, ref, Ref} from '@vue/reactivity';

@Pipe({
  name: 'some',
  pure: false
})
export class SomePipe implements PipeTransform {
  transform(value: Ref): any {
    return value.value;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  vm = getTest();

  change(): void {
    this.vm.test.value += 1;
  }
}

function getTest() {
  const test = ref(0);
  const plusHundred = computed(() => test.value + 100);

  return {test, plusHundred};
}
