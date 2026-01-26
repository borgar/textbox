/* globals document SVGElement */

// eslint-disable-next-line @typescript-eslint/unbound-method
const hasOwnProp = Object.prototype.hasOwnProperty;

const _mem = {};
function unCamel (name: string): string {
  if (!_mem[name]) {
    _mem[name] = name.replace(/([a-z])([A-Z])/g, (_, a, b) => {
      return a + '-' + b.toLowerCase();
    });
  }
  return _mem[name];
}

function append (parent: SVGElement, child: string | SVGElement | SVGElement[]): void {
  if (Array.isArray(child)) {
    child.forEach(c => append(parent, c));
  }
  else if (typeof child === 'string') {
    const ch = document.createTextNode(child);
    parent.appendChild(ch);
  }
  else {
    parent.appendChild(child);
  }
}

export function createElement (
  name: string,
  props?: Record<string, string | number | null | boolean> | null,
  ...children: (SVGElement | string | undefined | null)[]
): SVGElement {
  if (typeof document === 'undefined') {
    throw new Error('No document found, cannot create elements');
  }
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
          String(props[key])
        );
      }
    }
  }
  if (children != null && children.length) {
    children.forEach(child => {
      if (child) {
        append(elm, child);
      }
    });
  }
  return elm;
}
