(function () {
  var container = document.getElementById('peacePattern');
  var count = 30;
  var padding = 6; // minimum gap between symbols (px)
  var placed = []; // [{cx, cy, r}] in px

  function overlaps(cx, cy, r) {
    for (var j = 0; j < placed.length; j++) {
      var p = placed[j];
      var dist = Math.sqrt(Math.pow(cx - p.cx, 2) + Math.pow(cy - p.cy, 2));
      if (dist < r + p.r + padding) return true;
    }
    return false;
  }

  var w = container.offsetWidth  || window.innerWidth;
  var h = container.offsetHeight || 340;
  var attempts = 200;

  for (var i = 0; i < count; i++) {
    var size = 28 + Math.random() * 52;
    var r = size / 2;
    var cx, cy, ok = false;

    for (var a = 0; a < attempts; a++) {
      cx = r + Math.random() * (w - size);
      cy = r + Math.random() * (h - size);
      if (!overlaps(cx, cy, r)) { ok = true; break; }
    }
    if (!ok) continue; // skip if no room found

    placed.push({cx: cx, cy: cy, r: r});

    var img = document.createElement('img');
    img.src = 'images/peace-symbol.png';
    img.alt = '';
    var rot = Math.random() * 360;
    var op  = 0.25 + Math.random() * 0.55;
    img.style.cssText = [
      'position:absolute',
      'width:' + size + 'px',
      'height:' + size + 'px',
      'top:' + (cy - r) + 'px',
      'left:' + (cx - r) + 'px',
      'transform:rotate(' + rot + 'deg)',
      'opacity:' + op,
      'pointer-events:none',
      'user-select:none'
    ].join(';');
    container.appendChild(img);
  }
})();
