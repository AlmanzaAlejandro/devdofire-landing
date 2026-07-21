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

  /* ---------- Contact form validation ---------- */
  var form = document.getElementById('contactForm');
  if (form) {
    var successEl = document.getElementById('formSuccess');
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var phoneRegex = /^\d{10}$/;

    var fields = {
      name: { el: document.getElementById('name'), errorEl: document.getElementById('nameError') },
      email: { el: document.getElementById('email'), errorEl: document.getElementById('emailError') },
      phone: { el: document.getElementById('phone'), errorEl: document.getElementById('phoneError') },
      plan: { el: document.getElementById('plan'), errorEl: document.getElementById('planError') }
    };

    function setError(field, message) {
      field.el.classList.add('is-invalid');
      field.errorEl.textContent = message;
    }

    function clearError(field) {
      field.el.classList.remove('is-invalid');
      field.errorEl.textContent = '';
    }

    function validate() {
      var valid = true;

      if (!fields.name.el.value.trim()) {
        setError(fields.name, 'Ingresa tu nombre o gamer tag.');
        valid = false;
      } else {
        clearError(fields.name);
      }

      if (!fields.email.el.value.trim()) {
        setError(fields.email, 'Ingresa tu correo.');
        valid = false;
      } else if (!emailRegex.test(fields.email.el.value.trim())) {
        setError(fields.email, 'Formato de correo inválido.');
        valid = false;
      } else {
        clearError(fields.email);
      }

      var phoneVal = fields.phone.el.value.trim().replace(/\D/g, '');
      if (!phoneVal) {
        setError(fields.phone, 'Ingresa tu teléfono.');
        valid = false;
      } else if (!phoneRegex.test(phoneVal)) {
        setError(fields.phone, 'Debe tener 10 dígitos.');
        valid = false;
      } else {
        clearError(fields.phone);
      }

      if (!fields.plan.el.value) {
        setError(fields.plan, 'Selecciona un plan.');
        valid = false;
      } else {
        clearError(fields.plan);
      }

      return valid;
    }

    Object.keys(fields).forEach(function (key) {
      fields[key].el.addEventListener('input', function () {
        clearError(fields[key]);
      });
      fields[key].el.addEventListener('change', function () {
        clearError(fields[key]);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      successEl.textContent = '';

      if (validate()) {
        successEl.textContent = '¡Squad recibido! Te contactaremos muy pronto. 🔥';
        form.reset();
      } else {
        successEl.textContent = '';
        var firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  }

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
