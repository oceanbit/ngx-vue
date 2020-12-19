/**
 * This shows us that you can access `this.` items from the tempate inside
 * that are exposed via a decorator
 */

import {ChangeDetectorRef, Component, OnInit} from '@angular/core';

function classDecorator<T extends new (...args: any[]) => {}>(
  constructor: T
): { new(): ({ newProperty: string; hello: string } & any); prototype: { newProperty: string; hello: string } } {
  return class extends constructor {
    newProperty = 'new property';
    hello = 'override';
  };
}

@classDecorator
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  newProperty: never;
  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    console.log(this);
  }
}
