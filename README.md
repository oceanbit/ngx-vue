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
import {computed, ref, Setup} from 'ngx-vue';

@Setup((props, detectChanges) => {
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
})
@Component({
  selector: 'test-setup',
  template: `
    <p>{{other}}</p>
    <p>{{comp}}</p>
  `
})
class TestComponent implements OnChanges {
    // In order to get typechecking working, defaults like these are required
    // Don't worry - they'll be overwritten by the `@Setup` return
    helloMsg: string = '';
    mainNumber: number = 0;
    addToPlus: Function = () => {};
    @Input() hello = 'Hello';

    // These two items in your constructor are required, currently
    // https://github.com/oceanbit-dev/ngx-vue/issues/1
    constructor(private componentFactoryResolver: ComponentFactoryResolver, private cd: ChangeDetectorRef) {
    }

    // This is required, even if empty
    ngOnChanges() {}
}
```

## Using Vue's Libraries

Currently, *no, you cannot.* We're actively working on this feature, however and expect to have this functionality ready soon. Here's some insight into our current progress:

### Missing features:

- [ ] Automatic refresh after data is changed
- [ ] Computed\* (\*this currently works, but has potential memory leaks)
- [ ] Watch
- [ ] WatchEffect
- [ ] Lifecycle Methods
  - [ ] onMounted
  - [ ] onBeforeMount
  - [ ] onUnmounted
  - [ ] onUpdated
  - [ ] onBeforeUnmount
  - [ ] onBeforeUpdate
