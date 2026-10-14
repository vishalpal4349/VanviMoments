// Rose-petal shower - a floating button below the background-music toggle that,
// when tapped, showers the viewport with falling rose petals. Guest-facing (and
// works in preview); skipped while the couple is editing the template.
(function () {
  var RI = window.RoseInvite;
  if (RI && RI.mode === 'edit') return;

  // The same petal artwork the date-reveal pile uses (see petals.js).
  var PETALS = [
    'media/rose_petals/Property 1=pink1.png',
    'media/rose_petals/Property 1=pink2.png',
    'media/rose_petals/Property 1=re2.png',
    'media/rose_petals/Property 1=red1.png',
    'media/rose_petals/Property 1=red3.png',
    'media/rose_petals/Property 1=yellow.png',
  ];

  // A single red rose petal for the button.
  var ICON = '<img class="petal-toggle__icon" src="media/rose_petals/Property 1=red3.png" alt="" aria-hidden="true" />';

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'petal-toggle';
  btn.setAttribute('aria-label', 'Shower rose petals');
  btn.title = 'Rose petals';
  btn.innerHTML = ICON;
  document.body.appendChild(btn);

  function rand(min, max) { return min + Math.random() * (max - min); }

  function shower() {
    var layer = document.createElement('div');
    layer.className = 'petal-shower';
    document.body.appendChild(layer);

    var COUNT = 44;
    var remaining = COUNT;
    var drop = function (el) {
      if (el.parentNode) el.parentNode.removeChild(el);
      remaining -= 1;
      if (remaining <= 0 && layer.parentNode) layer.parentNode.removeChild(layer);
    };

    for (var i = 0; i < COUNT; i++) {
      var p = document.createElement('img');
      p.className = 'petal-shower__petal';
      p.src = PETALS[(Math.random() * PETALS.length) | 0];
      p.alt = '';
      p.setAttribute('aria-hidden', 'true');
      p.style.left = rand(-4, 100).toFixed(2) + '%';
      p.style.width = rand(30, 62).toFixed(0) + 'px';
      p.style.setProperty('--dx', rand(-80, 80).toFixed(0) + 'px');   // horizontal drift
      p.style.setProperty('--rot', rand(360, 900).toFixed(0) + 'deg'); // spin
      p.style.animationDuration = rand(3.4, 6).toFixed(2) + 's';
      p.style.animationDelay = rand(0, 1.3).toFixed(2) + 's';
      (function (petal) {
        petal.addEventListener('animationend', function () { drop(petal); });
      })(p);
      layer.appendChild(p);
    }

    // Safety net: clear the layer even if an animationend is ever missed.
    setTimeout(function () { if (layer.parentNode) layer.parentNode.removeChild(layer); }, 9000);
  }

  btn.addEventListener('click', shower);
})();
