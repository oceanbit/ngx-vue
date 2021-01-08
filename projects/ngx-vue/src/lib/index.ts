export {Setup, SetupComp} from './setup';
export {watch, watchEffect} from './watch';
export {computed} from './computed';
export {getCurrentInstance} from './component';
export {nextTick} from './nextTick';
export {
  onMounted,
  onBeforeMount,
  onUnmounted,
  onUpdated,
  onBeforeUnmount,
  onBeforeUpdate,
} from './lifecycle';

// redirect all APIs from @vue/reactivity
export {
  ComputedGetter,
  ComputedRef,
  ComputedSetter,
  customRef,
  DebuggerEvent,
  DeepReadonly,
  effect,
  enableTracking,
  isProxy,
  isReactive,
  isReadonly,
  isRef,
  ITERATE_KEY,
  markRaw,
  pauseTracking,
  reactive,
  ReactiveEffect,
  ReactiveEffectOptions,
  ReactiveFlags,
  readonly,
  ref,
  Ref,
  RefUnwrapBailTypes,
  resetTracking,
  shallowReactive,
  shallowReadonly,
  shallowRef,
  stop,
  toRaw,
  toRef,
  toRefs,
  ToRefs,
  track,
  TrackOpTypes,
  trigger,
  TriggerOpTypes,
  triggerRef,
  unref,
  UnwrapRef,
  WritableComputedOptions,
  WritableComputedRef,
} from '@vue/reactivity';
