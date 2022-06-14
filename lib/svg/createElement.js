/* globals document */
const hasOwnProp = Object.prototype.hasOwnProperty;

const _mem = {};
function unCamel (name) {
  if (!_mem[name]) {
    _mem[name] = name.replace(/([a-z])([A-Z])/g, (m, a, b) => {
      return a + '-' + b.toLowerCase();
    });
  }
  return _mem[name];
}

function append (parent, child) {
  if (Array.isArray(child)) {
    return child.forEach(c => append(parent, c));
  }
  if (typeof child === 'string') {
    child = document.createTextNode(child);
  }
  parent.appendChild(child);
}

export default function createElement (name, props, ...children) {
  if (typeof document !== 'undefined') {
    const elm = (typeof name === 'string')
      ? document.createElementNS('http://www.w3.org/2000/svg', name)
      : name;
    if (props && elm.setAttribute) {
      for (const key in props) {
        if (hasOwnProp.call(props, key) && props[key] != null) {
          // "style" is handled specially
          // "key" is handled specially
          // segmentElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', segment.href);
          elm.setAttribute(
            key === 'className' ? 'class' : unCamel(key),
            props[key]
          );
        }
      }
    }
    if (children != null && children.length) {
      children.forEach(child => {
        append(elm, child);
      });
    }
    return elm;
  }
}
