/* ============================================================
   LAHARI S PORTFOLIO — SCRIPT.JS
   Handles: Loader, Cursor, Navbar, Particles, Scroll Reveal,
            Skill Bars, Counter Animation, Hamburger, Form, Back-to-top
   ============================================================ */

'use strict';

/* ==========================================
   1. LOADER
   ========================================== */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1700);
});

/* ==========================================
   2. CUSTOM CURSOR
   ========================================== */
const cursor       = document.getElementById('cursor');
const cursorFollow = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followX = 0, followY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  }
});

function animateCursor() {
  followX += (mouseX - followX) * 0.12;
  followY += (mouseY - followY) * 0.12;
  if (cursorFollow) {
    cursorFollow.style.left = followX + 'px';
    cursorFollow.style.top  = followY + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* ==========================================
   3. NAVBAR — scroll style + active link
   ========================================== */
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-link');
const sections  = document.querySelectorAll('section[id]');

function updateNavbar() {
  const scrolled = window.scrollY > 50;
  navbar.classList.toggle('scrolled', scrolled);

  // Highlight active link based on scroll position
  let currentSection = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) currentSection = sec.getAttribute('id');
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-section') === currentSection) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

/* ==========================================
   4. HAMBURGER MENU
   ========================================== */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

// Close menu on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ==========================================
   5. FLOATING PARTICLES
   ========================================== */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const dur  = Math.random() * 15 + 10;
    const delay = Math.random() * 10;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      opacity: 0;
    `;
    container.appendChild(p);
  }
}
createParticles();

/* ==========================================
   6. SCROLL REVEAL
   ========================================== */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ==========================================
   7. SKILL BARS
   ========================================== */
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const width = fill.getAttribute('data-width');
      fill.style.width = width + '%';
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));

/* ==========================================
   8. COUNTER ANIMATION (About stats)
   ========================================== */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1500;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 16);
}

const statNums = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(num => counterObserver.observe(num));

/* ==========================================
   9. BACK TO TOP
   ========================================== */
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTopBtn.classList.toggle('show', window.scrollY > 400);
}, { passive: true });

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ==========================================
   10. CONTACT FORM (client-side demo)
   ========================================== */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn   = document.getElementById('submitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Button loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate async send
    setTimeout(() => {
      contactForm.reset();
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      submitBtn.disabled = false;
      formSuccess.classList.add('show');

      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1500);
  });
}

/* ==========================================
   11. RESUME BUTTONS — toast if no PDF
   ========================================== */
function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%);
    background: rgba(15,15,26,0.95); border: 1px solid rgba(255,255,255,0.1);
    color: #f1f5f9; padding: 14px 24px; border-radius: 12px;
    font-size: 0.9rem; font-weight: 500; z-index: 9999;
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    animation: fadeUp 0.3s ease;
    backdrop-filter: blur(20px);
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

const viewResume = document.getElementById('viewResumeBtn');
const dlResume   = document.getElementById('downloadResumeBtn');

[viewResume, dlResume].forEach(btn => {
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    // Only intercept if resume.pdf likely doesn't exist (dev mode hint)
    const isView = btn.id === 'viewResumeBtn';
    // Let the browser handle it; if missing the browser shows its own error.
    // Optionally show a notice for the placeholder:
    console.log(`${isView ? 'Viewing' : 'Downloading'} resume...`);
  });
});

/* ==========================================
   12. SMOOTH SCROLL for all anchor links
   ========================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ==========================================
   13. ACTIVE SECTION HIGHLIGHT (on home load)
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();
});
