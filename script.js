(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar scroll state ---------- */
  var navbar = document.getElementById('navbar');
  function onScroll() {
    if (!navbar) return;
    if (window.scrollY > 12) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primary-nav');

  function closeMenu() {
    if (!navToggle || !primaryNav) return;
    navToggle.setAttribute('aria-expanded', 'false');
    primaryNav.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    if (!navToggle || !primaryNav) return;
    var isOpen = primaryNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleMenu);
  }

  if (primaryNav) {
    primaryNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- Scroll-reveal animations ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Build With Us form (backend pending — see setup comment in HTML) ---------- */
  var buildForm = document.getElementById('buildForm');
  if (buildForm) {
    buildForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot: real users never fill this hidden field; bots that
      // auto-fill every input do. Silently drop the submission.
      var honeypot = buildForm.querySelector('input[name="website"]');
      if (honeypot && honeypot.value.trim() !== '') {
        buildForm.reset();
        return;
      }

      var submitBtn = buildForm.querySelector('button[type="submit"]');
      var originalText = submitBtn ? submitBtn.textContent : '';
      var successText = buildForm.getAttribute('data-success-text') || originalText;
      if (submitBtn) {
        submitBtn.textContent = successText;
        submitBtn.disabled = true;
      }
      setTimeout(function () {
        buildForm.reset();
        if (submitBtn) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      }, 3200);
    });
  }

  /* ---------- Cookie consent banner ---------- */
  var cookieBanner = document.getElementById('cookieBanner');
  var cookieAccept = document.getElementById('cookieAccept');
  var COOKIE_CONSENT_KEY = 'dbl_cookie_consent';

  if (cookieBanner) {
    var hasConsent = false;
    try {
      hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted';
    } catch (err) {
      hasConsent = false;
    }
    if (!hasConsent) {
      cookieBanner.hidden = false;
    }
    if (cookieAccept) {
      cookieAccept.addEventListener('click', function () {
        try {
          localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
        } catch (err) {
          /* localStorage unavailable (private mode, etc.) — banner will just show again next visit */
        }
        cookieBanner.hidden = true;
      });
    }
  }

  /* ---------- Chat placeholder (no live-chat account connected yet) ---------- */
  var chatToggle = document.getElementById('chatToggle');
  var chatPopover = document.getElementById('chatPopover');

  if (chatToggle && chatPopover) {
    chatToggle.addEventListener('click', function () {
      var isHidden = chatPopover.hidden;
      chatPopover.hidden = !isHidden;
      chatToggle.setAttribute('aria-expanded', String(isHidden));
    });

    document.addEventListener('click', function (e) {
      if (!chatPopover.hidden && !chatPopover.contains(e.target) && e.target !== chatToggle && !chatToggle.contains(e.target)) {
        chatPopover.hidden = true;
        chatToggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !chatPopover.hidden) {
        chatPopover.hidden = true;
        chatToggle.setAttribute('aria-expanded', 'false');
        chatToggle.focus();
      }
    });
  }
})();
