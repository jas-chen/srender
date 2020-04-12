/* eslint-env browser */
import { renderToString } from "./renderToString";

export const renderToNode = (fn, callback) =>
  renderToString(fn, (html) =>
    callback(document.createRange().createContextualFragment(html))
  );
