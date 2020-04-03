const { hasOwnProperty } = Object.prototype;
const RAW_HTML = Symbol();
const ESCAPE = {
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;"
};

let _onData;
let callbacks;
let writing;

export function createRef() {
  if (!this.instanceId) {
    this.instanceId = 0;
  }

  const prefix = this.prefix || "";
  const id = prefix + (this.instanceId++).toString(36);
  const o = Object.create(null);
  o.toString = () => id;
  o.get = () => document.getElementById(id);

  return o;
}

export const rawHtml = html => {
  const o = Object.create(null);
  o[RAW_HTML] = html;
  return o;
};

export const write = (fn, onData) => {
  _onData = onData;
  writing = true;
  fn();
  writing = false;
  _onData = null;
};

export const writeToNode = (fn, mount) => {
  if (writing) {
    throw new Error("Should not use `writeToNode` during writing.");
  }

  callbacks = [];
  const html = [];

  write(fn, token => html.push(token));
  mount(document.createRange().createContextualFragment(html.join("")));

  for (const callback of callbacks) callback();

  callbacks = null;
};

export const createHtml = context => {
  function html(nodeName, ...variables) {
    if (!writing) throw new Error("Please use write methods to start writing.");

    if (typeof nodeName === "function") {
      const callback = nodeName(html, variables[0], context);
      callbacks && typeof callback === "function" && callbacks.push(callback);
    } else if (Array.isArray(nodeName)) {
      _onData && _onData(nodeName[0]);

      variables.forEach((variable, i) => {
        if (typeof variable === "function") {
          variable();
        } else if (variable != null) {
          _onData &&
            _onData(
              hasOwnProperty.call(variable, RAW_HTML)
                ? variable[RAW_HTML]
                : variable.toString().replace(/(<|>|"|')/g, c => ESCAPE[c])
            );
        }

        _onData && _onData(nodeName[i + 1]);
      });
    }
  }

  return html;
};
