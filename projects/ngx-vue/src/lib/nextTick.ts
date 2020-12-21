// tslint:disable-next-line:ban-types
export function nextTick(fn?: Function): Promise<never> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (fn) { fn(); }
      resolve();
    }, 0);
  });
}
