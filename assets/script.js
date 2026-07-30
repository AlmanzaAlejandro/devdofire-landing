(function () {
  'use strict';

  /* ---------- Mobile nav toggle ---------- */
  var hamburger = document.getElementById('hamburger');
  var nav = document.getElementById('nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- FAQ accordion ---------- */
  var accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(function (item) {
    var trigger = item.querySelector('.accordion-trigger');
    var panel = item.querySelector('.accordion-panel');

    trigger.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      accordionItems.forEach(function (other) {
        other.classList.remove('is-open');
        other.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
        other.querySelector('.accordion-panel').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Game carousel selector ---------- */
  var gameCards = document.querySelectorAll('.game-card');
  gameCards.forEach(function (card) {
    card.addEventListener('click', function () {
      if (card.classList.contains('is-locked')) {
        card.classList.remove('is-shake');
        void card.offsetWidth;
        card.classList.add('is-shake');
        return;
      }

      gameCards.forEach(function (other) {
        if (other.classList.contains('is-locked')) return;
        other.classList.remove('is-active');
        other.setAttribute('aria-pressed', 'false');
        var check = other.querySelector('.game-card-check');
        if (check) check.remove();
      });

      card.classList.add('is-active');
      card.setAttribute('aria-pressed', 'true');
      if (!card.querySelector('.game-card-check')) {
        var checkEl = document.createElement('span');
        checkEl.className = 'game-card-check';
        checkEl.setAttribute('aria-hidden', 'true');
        checkEl.textContent = '✓';
        card.prepend(checkEl);
      }

      var plansSection = document.getElementById('planes');
      if (plansSection) {
        // Setting the hash to its current value is a no-op (no navigation,
        // no scroll), so repeat clicks after the first need an explicit
        // scroll instead of relying on the hash change.
        if (window.location.hash === '#planes') {
          plansSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.location.hash = 'planes';
        }
      }
    });
  });

  /* ---------- Header shrink/style on scroll (subtle) ---------- */
  var header = document.getElementById('header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 20) {
        header.style.borderBottomColor = 'rgba(255,107,0,0.25)';
      } else {
        header.style.borderBottomColor = '';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
