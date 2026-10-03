// Intro: Stern mit rundem Kern wird kurz gezeigt, wandert nach oben und wird zur Menueleiste.
// Danach erscheinen die Videos. Pro Sitzung nur einmal, bei Link mit #Ziel oder bei
// reduzierter Bewegung wird das Intro uebersprungen.
(function () {
  var root = document.documentElement;
  var intro = document.getElementById('intro');
  var box = document.getElementById('field-box');
  if (!intro || !box) { root.classList.add('ready'); return; }

  function fit() {
    var s = Math.min(1, (window.innerWidth - 32) / 680, (window.innerHeight - 200) / 480);
    box.style.setProperty('--fit', Math.max(0.42, s));
  }
  fit();
  window.addEventListener('resize', fit);

  var pending = null;
  function scrollToPending() {
    if (!pending) return;
    var el = document.getElementById(pending);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    pending = null;
  }
  function finish() {
    root.classList.remove('intro-on', 'docking');
    root.classList.add('ready');
    scrollToPending();
  }
  function dock(target) {
    if (root.classList.contains('docking') || root.classList.contains('ready')) return;
    if (target) pending = target;
    root.classList.add('docking');
    try { sessionStorage.setItem('intro-seen', '1'); } catch (e) {}
    setTimeout(finish, 1900);
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var seen = false;
  try { seen = sessionStorage.getItem('intro-seen') === '1'; } catch (e) {}
  if (reduce || seen || location.hash.length > 1) { root.classList.add('ready'); return; }

  root.classList.add('intro-on');
  var timer = setTimeout(function () { dock(); }, 4200);

  // Klick auf eine Blase: Intro beenden und direkt zum Thema
  intro.querySelectorAll('a.bubble').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = (a.getAttribute('href') || '').replace('#', '');
      if (!id) return;
      e.preventDefault();
      e.stopPropagation();
      clearTimeout(timer);
      dock(id);
    });
  });
  ['click', 'keydown', 'touchstart', 'wheel'].forEach(function (ev) {
    window.addEventListener(ev, function () { clearTimeout(timer); dock(); }, { once: true, passive: true });
  });
})();

// Menue: aktives Thema beim Scrollen hervorheben
(function () {
  var links = document.querySelectorAll('.nb[href^="#"]');
  if (!links.length || !('IntersectionObserver' in window)) return;
  var map = {};
  links.forEach(function (l) { map[l.getAttribute('href').slice(1)] = l; });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var l = map[en.target.id];
      if (!l) return;
      if (en.isIntersecting) {
        links.forEach(function (x) { x.classList.remove('active'); });
        l.classList.add('active');
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  Object.keys(map).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) io.observe(el);
  });
})();
