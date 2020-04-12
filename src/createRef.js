/* eslint-env browser */
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
