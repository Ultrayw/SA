// SAFe, rôle par rôle : thème, menu mobile, filtres, sommaire actif. Sans dépendance.
(function () {
  var root = document.documentElement;

  function currentTheme() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('safe-theme', next); } catch (e) {}
    });
  });

  var menuBtn = document.querySelector('[data-menu-toggle]');
  var nav = document.getElementById('main-nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
  }

  // Filtres de l'accueil
  var chips = document.querySelectorAll('[data-filter]');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
      document.querySelectorAll('[data-group]').forEach(function (g) {
        g.hidden = !(f === 'all' || g.getAttribute('data-group') === f);
      });
    });
  });

  // Sommaire : section active
  var tocLinks = document.querySelectorAll('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    tocLinks.forEach(function (l) { map[l.getAttribute('href').slice(1)] = l; });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          tocLinks.forEach(function (l) { l.classList.remove('active'); });
          var l = map[e.target.id];
          if (l) l.classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) obs.observe(el);
    });
  }
})();
