/* globals document window */

function docReady (fn) {
  (document.readyState === 'complete' || document.readyState === 'interactive')
    ? setTimeout(fn, 1) : document.addEventListener("DOMContentLoaded", fn);
}

function addNav () {
  const nav = document.body.insertBefore(
    document.createElement('nav'),
    document.body.firstChild
  );

  const hd = document.createElement('h1');
  hd.innerHTML = 'An example use of the <a href="#">@borgar/textbox</a> library:';
  nav.appendChild(hd);

  function page (text, url) {
    const curr = url.replace(/^\.\/$/, '') === document.location.pathname.split('/').pop();
    const a = document.createElement(curr ? 'b' : 'a');
    if (!curr) {
      a.href = url;
    }
    a.innerHTML = text;
    nav.appendChild(a);
  }

  page('Layout tester', './');
  page('Doughnut', 'test-doughnut.html');
  page('LaTeX examples', 'test-latex.html');
  page('HTML examples', 'test-html.html');
  page('Long text', 'test-longtext.html');
  page('Canvas plot', 'test-canvas.html');
  page('Animation', 'test-animation.html');
  page('Shrink to fit', 'test-shrink.html');
}

docReady(addNav);
