export default function argmap (args) {
  const s = {/* text, ctx, d3, fn */};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    // canvas?
    if (typeof arg === 'number' || arg == null) {
      continue;
    }
    else if (typeof arg === 'string') {
      s.text = arg;
    }
    else if (typeof arg === 'function') {
      s.fn = arg;
    }
    else if (typeof arg === 'object' && arg._groups) {
      // d3 selection { _groups: [...], _parents: [...] }
      s.d3 = arg;
    }
    else if (arg && arg.nodeType && arg.getContext) {
      // its a canvas element?
      s.ctx = arg.getContext('2d');
    }
    else if (arg && arg.fillText && arg.beginPath) {
      // its a canvas context?
      s.ctx = arg;
    }
    else if (arg) {
      // presumed to be an element
      s.text = arg;
    }
  }
  return s;
}
