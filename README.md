<p align="center"><h1>NgxVue</h1></p>

<p align="center">Use Vue Composition API in Angular components</p>

<p align="center">
<a href="https://www.npmjs.com/package/ngx-vue"><img src="https://img.shields.io/npm/v/ngx-vue?color=C3002F&label"/></a>
<a href="https://bundlephobia.com/result?p=ngx-vue@latest"><img src="https://img.shields.io/bundlephobia/minzip/ngx-vue?color=40b983&label"/></a>
</p>


<pre align="center">
npm i <b>ngx-vue</b>
</pre>

<br/>

<p align="center"><em>The <a href="https://v3.vuejs.org/guide/composition-api-introduction.html" target="_blank">Vue Composition API</a> is awesome! <br>Angular's pretty rad too. <br>Let's combine them and utilize them both!</em></p>

<br/>

## Usage

```typescript
import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Input,
  OnChanges
} from '@angular/core';
import {computed, ref, SetupComp, OnSetup} from 'ngx-vue';

@Component({
  selector: 'test-setup',
  template: `
    <p>{{other}}</p>
    <p>{{comp}}</p>
  `
})
class TestComponent implements OnSetup extends SetupComp {
    // In order to get typechecking working, defaults like these are required
    // Don't worry - they'll be overwritten by the `@Setup` return
    helloMsg: string = '';
    mainNumber: number = 0;
    addToPlus: Function = () => {};
    @Input() hello = 'Hello';

    // These two items in your constructor are required, currently
    // https://github.com/oceanbit-dev/ngx-vue/issues/1
    constructor(cd: ChangeDetectorRef, componentFactoryResolver: ComponentFactoryResolver) {
        super(cd, componentFactoryResolver)
    }

    ngOnSetup(props) {
      const helloProp = toRef(props, 'hello');
  
      const helloMsg = computed(() => `${helloProp?.value?.substr(0, 5) || ''}, World`);
  
      const mainNumber = ref(12);
  
      const addToPlus = (): void => {
        mainNumber.value += 1;
        // This manual change detection is required currently, but soon will not be
        detectChanges();
      };
  
      return {
        helloMsg,
        mainNumber,
        addToPlus
      };
    }
}
```

## Using Vue's Libraries

*Yes, you can!* Before you start, you need set alias in your build tool in order to redirect some apis from `vue` to `ngx-vue` to avoid memory leaks.

#### Aliasing

<details>
<summary>Angular CLI</summary><br>
Unfortunately, there is no way to alias a library from within `node_modules` using Angular CLI itself. 

Currently, you have to utilize an [Angular Custom Webpack Builder](https://github.com/just-jeb/angular-builders/tree/10.x.x/packages/custom-webpack) and follow
the webpack instructions
</details>

<details>
<summary>Webpack</summary><br>

Add following code to your webpack config

```js
const config = { 
  /* ... */
  resolve: { 
    alias: { 
      'vue': 'ngx-vue',
      '@vue/runtime-dom': 'ngx-vue',
    },
  }
}
```

</details>
