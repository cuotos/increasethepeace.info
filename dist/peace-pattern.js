(function () {
  var container = document.getElementById('peacePattern');
  var ns = 'http://www.w3.org/2000/svg';

  // Fixed coordinate space. The SVG is rendered at a fixed pixel width and
  // centred, so symbols never scale or shift on resize - excess clips equally.
  // VH is measured from the actual header height after layout.
  var VW = 1440;
  var VH = container.parentElement.offsetHeight || 340;
  var count = 35;
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
    height: VH,
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

    // Drift offsets: 6 directions in viewBox units
    var drifts = [[45,28],[-38,42],[32,-40],[-44,-26],[40,-34],[-30,38]];
    var d = drifts[i % 6];
    var dur = (18 + Math.random() * 16).toFixed(1) + 's';
    var begin = (-Math.random() * 20).toFixed(1) + 's'; // start mid-cycle on load

    var anim = document.createElementNS(ns, 'animateTransform');
    anim.setAttribute('attributeName', 'transform');
    anim.setAttribute('attributeType', 'XML');
    anim.setAttribute('type', 'translate');
    anim.setAttribute('values', '0 0;' + d[0] + ' ' + d[1] + ';0 0');
    anim.setAttribute('keyTimes', '0;0.5;1');
    anim.setAttribute('dur', dur);
    anim.setAttribute('begin', begin);
    anim.setAttribute('repeatCount', 'indefinite');
    anim.setAttribute('calcMode', 'spline');
    anim.setAttribute('keySplines', '0.45 0 0.55 1;0.45 0 0.55 1');
    anim.setAttribute('additive', 'sum');

    // Wrap in <g> so the animation adds to the symbol's own transform
    var g = el('g', {});
    g.appendChild(use);
    g.appendChild(anim);
    svg.appendChild(g);
  }

  container.appendChild(svg);

  // Randomise the horizontal start position of each wave so they all look different
  document.querySelectorAll('.waveImg').forEach(function(svg) {
    var offset = (Math.random() * 200).toFixed(1);
    svg.style.transform = 'translateX(-' + offset + '%)';
  });
})();
