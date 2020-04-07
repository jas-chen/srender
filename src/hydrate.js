import { render } from "./core";

export const hydrate = (fn) => {
  const callbacks = [];

  render(fn, {
    onCallback: callback => callbacks.push(callback)
  });

  for (const callback of callbacks) callback();
};
