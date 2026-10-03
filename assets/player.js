// Handy, Datensparmodus oder 2G/3G: kleine Videodatei laden
(function () {
  var c = navigator.connection || {};
  var small = window.matchMedia('(max-width:768px)').matches ||
    c.saveData === true || /^(slow-2g|2g|3g)$/.test(c.effectiveType || '');
  if (!small) return;
  document.querySelectorAll('video[data-small]').forEach(function (v) {
    var s = v.querySelector('source');
    if (s) { s.src = v.getAttribute('data-small'); v.load(); }
  });
})();
