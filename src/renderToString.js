import { render } from "./core";

export const renderToString = (fn, callback) => {
  const callbacks = [];
  const html = [];

  render(fn, {
    onData: token => html.push(token),
    onCallback: callback => callbacks.push(callback)
  });
  callback(html.join(""));

  for (const callback of callbacks) callback();
};
