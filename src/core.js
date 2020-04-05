const { hasOwnProperty } = Object.prototype;
const RAW_HTML = Symbol();
const ESCAPE = {
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;"
};

let onData;
let onCallback;
let writing;

export const rawHtml = html => {
  const o = Object.create(null);
  o[RAW_HTML] = html;
  return o;
};

export const render = (fn, options) => {
  const prevOnData = onData;
  const prevOnCallback = onCallback;
  ({ onData, onCallback } = options);
  writing = true;
  fn();
  writing = false;
  onData = prevOnData;
  onCallback = prevOnCallback;
};

export const createHtml = context => {
  function html(nodeName, ...variables) {
    if (!writing) throw new Error("Please use write methods to start writing.");

    if (typeof nodeName === "function") {
      const callback = nodeName(html, variables[0], context);
      onCallback && typeof callback === "function" && onCallback(callback);
    } else if (Array.isArray(nodeName)) {
      onData && onData(nodeName[0]);

      variables.forEach((variable, i) => {
        if (typeof variable === "function") {
          variable();
        } else if (variable != null) {
          onData &&
            onData(
              hasOwnProperty.call(variable, RAW_HTML)
                ? variable[RAW_HTML]
                : variable.toString().replace(/(<|>|"|')/g, c => ESCAPE[c])
            );
        }

        onData && onData(nodeName[i + 1]);
      });
    }
  }

  return html;
};
