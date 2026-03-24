/* ============================================================
   WHO DOES HER NAILS — script.js
   Interactions: sticky header, mobile menu, reveal animations,
   back to top, hero image parallax, smooth scroll
   ============================================================ */

(function () {
  'use strict';

  /* ---- DOM references ---- */
  const header      = document.getElementById('site-header');
  const hamburger   = document.getElementById('hamburger');
  const navMobile   = document.getElementById('nav-mobile');
  const mobileLinks = navMobile.querySelectorAll('.mobile-link, .mobile-cta');
  const backToTop   = document.getElementById('backToTop');
  const heroBg      = document.querySelector('.hero-bg-image');

  /* ====================================================
     1. STICKY HEADER — add `.scrolled` after scroll
  ==================================================== */
  function handleHeaderScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // run once on load

  /* ====================================================
     2. MOBILE MENU — hamburger toggle
  ==================================================== */
  function openMenu() {
    hamburger.classList.add('open');
    navMobile.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    hamburger.classList.remove('open');
    navMobile.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    const isOpen = navMobile.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close on link click
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (
      navMobile.classList.contains('open') &&
      !header.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMobile.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });

  /* ====================================================
     3. SMOOTH SCROLL — anchor links
  ==================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerHeight = header.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  /* ====================================================
     4. INTERSECTION OBSERVER — reveal elements
  ==================================================== */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // Fallback — show all immediately
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ====================================================
     5. BACK TO TOP button
  ==================================================== */
  function handleBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', handleBackToTop, { passive: true });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ====================================================
     6. HERO BACKGROUND — subtle parallax on scroll
  ==================================================== */
  if (heroBg) {
    // Trigger the scale-down transition once page is ready
    setTimeout(function () {
      heroBg.classList.add('loaded');
    }, 100);

    // Light parallax
    function handleHeroParallax() {
      const scrolled = window.scrollY;
      const heroHeight = document.querySelector('.hero').offsetHeight;
      if (scrolled < heroHeight) {
        const offset = scrolled * 0.35;
        heroBg.style.transform = 'scale(1) translateY(' + offset + 'px)';
      }
    }
    window.addEventListener('scroll', handleHeroParallax, { passive: true });
  }

  /* ====================================================
     7. GALLERY — simple lightbox on click
  ==================================================== */
  const galleryItems = document.querySelectorAll('.gallery-item');

  // Build lightbox
  const lightbox = document.createElement('div');
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Image lightbox');
  lightbox.style.cssText = [
    'display:none;',
    'position:fixed;',
    'inset:0;',
    'z-index:9000;',
    'background:rgba(46,42,47,.95);',
    'align-items:center;',
    'justify-content:center;',
    'padding:20px;',
    'cursor:zoom-out;'
  ].join('');

  const lightboxImg = document.createElement('img');
  lightboxImg.style.cssText = [
    'max-width:90vw;',
    'max-height:90vh;',
    'border-radius:12px;',
    'box-shadow:0 20px 80px rgba(0,0,0,.5);',
    'object-fit:contain;',
    'animation:fadeUp 0.25s ease forwards;'
  ].join('');
  lightboxImg.alt = '';

  const lightboxClose = document.createElement('button');
  lightboxClose.innerHTML = '&times;';
  lightboxClose.setAttribute('aria-label', 'Close lightbox');
  lightboxClose.style.cssText = [
    'position:absolute;',
    'top:20px;',
    'right:24px;',
    'background:none;',
    'border:none;',
    'color:#fff;',
    'font-size:2.5rem;',
    'line-height:1;',
    'cursor:pointer;',
    'font-family:inherit;',
    'opacity:.8;',
    'transition:opacity .2s;'
  ].join('');
  lightboxClose.addEventListener('mouseover', function () { this.style.opacity = '1'; });
  lightboxClose.addEventListener('mouseout', function () { this.style.opacity = '.8'; });

  lightbox.appendChild(lightboxImg);
  lightbox.appendChild(lightboxClose);
  document.body.appendChild(lightbox);

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }
  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const img = item.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const img = item.querySelector('img');
        if (img) openLightbox(img.src, img.alt);
      }
    });
    item.setAttribute('tabindex', '0');
  });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  lightboxClose.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') {
      closeLightbox();
    }
  });

  /* ====================================================
     8. SERVICE CARDS — stagger entrance on hover
  ==================================================== */
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      card.style.transition = 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease, border-color 0.28s ease';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transition = 'transform 0.32s ease, box-shadow 0.32s ease, border-color 0.32s ease';
    });
  });

  /* ====================================================
     9. PHONE LINK — pulse animation on CTA buttons
  ==================================================== */
  const ctaBtns = document.querySelectorAll('.btn-primary');
  ctaBtns.forEach(function (btn) {
    if (btn.href && btn.href.startsWith('tel:')) {
      btn.addEventListener('click', function () {
        btn.style.transform = 'scale(0.97)';
        setTimeout(function () { btn.style.transform = ''; }, 200);
      });
    }
  });

  /* ====================================================
     10. TICKER — pause on hover
  ==================================================== */
  const tickerTrack = document.querySelector('.ticker-track');
  if (tickerTrack) {
    tickerTrack.addEventListener('mouseenter', function () {
      tickerTrack.style.animationPlayState = 'paused';
    });
    tickerTrack.addEventListener('mouseleave', function () {
      tickerTrack.style.animationPlayState = 'running';
    });
  }

})();
