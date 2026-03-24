(function () {
  var container = document.getElementById('peacePattern');
  var ns = 'http://www.w3.org/2000/svg';

  // Fixed coordinate space. The SVG is rendered at a fixed pixel width and
  // centred, so symbols never scale or shift on resize - excess clips equally.
  var VW = 1440, VH = 340;
  var count = 30;
  var padding = 6;
  var placed = [];

  function overlaps(cx, cy, r) {
    for (var j = 0; j < placed.length; j++) {
      var p = placed[j];
      var dist = Math.sqrt(Math.pow(cx - p.cx, 2) + Math.pow(cy - p.cy, 2));
      if (dist < r + p.r + padding) return true;
    }
    return false;
  }

  function el(tag, attrs) {
    var e = document.createElementNS(ns, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  var svg = el('svg', {
    width: VW,
    height: '100%',
    viewBox: '0 0 ' + VW + ' ' + VH,
    preserveAspectRatio: 'none'
  });
  // Fixed width, centred horizontally - clips equally on both sides when the
  // window is narrower than VW, and never scales the symbols.
  svg.style.cssText = 'position:absolute;top:0;left:50%;transform:translateX(-50%);';

  // Define the peace symbol once as a <symbol> centered at origin, radius 1.
  // Each <use> applies translate + rotate + scale to position it.
  var defs = el('defs', {});
  var sym = el('symbol', {id: 'peace', overflow: 'visible'});

  var R = 1, SW = 0.13;
  var sin60 = (Math.sin(Math.PI / 3)).toFixed(4);
  var cos60 = (Math.cos(Math.PI / 3)).toFixed(4);

  sym.appendChild(el('circle', {cx:0, cy:0, r:R, fill:'none', stroke:'currentColor', 'stroke-width':SW, 'stroke-linecap':'round'}));
  // vertical: center → bottom
  sym.appendChild(el('line', {x1:0, y1:0, x2:0, y2:R, stroke:'currentColor', 'stroke-width':SW, 'stroke-linecap':'round'}));
  // lower-left (240° from top)
  sym.appendChild(el('line', {x1:0, y1:0, x2: -sin60, y2: cos60, stroke:'currentColor', 'stroke-width':SW, 'stroke-linecap':'round'}));
  // lower-right (300° from top)
  sym.appendChild(el('line', {x1:0, y1:0, x2: sin60,  y2: cos60, stroke:'currentColor', 'stroke-width':SW, 'stroke-linecap':'round'}));

  defs.appendChild(sym);
  svg.appendChild(defs);

  // Randomly place symbols in viewBox coordinate space
  var attempts = 200;
  for (var i = 0; i < count; i++) {
    var size = 15 + Math.random() * 52; // diameter in viewBox units
    var r    = size / 2;
    var cx, cy, ok = false;

    for (var a = 0; a < attempts; a++) {
      cx = r + Math.random() * (VW - size);
      cy = r + Math.random() * (VH - size);
      if (!overlaps(cx, cy, r)) { ok = true; break; }
    }
    if (!ok) continue;
    placed.push({cx: cx, cy: cy, r: r});

    var use = el('use', {
      href:    '#peace',
      color:   '#8a1f78',
      opacity: (0.25 + Math.random() * 0.55).toFixed(2),
      transform:
        'translate(' + cx.toFixed(1) + ',' + cy.toFixed(1) + ')' +
        'rotate('    + (Math.random() * 360).toFixed(1) + ')' +
        'scale('     + r.toFixed(1) + ')'
    });
    svg.appendChild(use);
  }

  container.appendChild(svg);
})();
