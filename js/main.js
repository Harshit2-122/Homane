/* ==========================================================================
   MAIN — splash, navigation, reveals, and interactive components
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- SPLASH ---------- */
  (function initSplash(){
    const splash = document.getElementById('splash');
    const line = document.getElementById('splashLine');
    if (!splash) return;

    if (prefersReduced) {
      splash.style.display = 'none';
      return;
    }

    const text = 'Homane';
    [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.style.animationDelay = (i * 0.045) + 's';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      line.appendChild(span);
    });

    document.body.style.overflow = 'hidden';
    const dismiss = () => {
      splash.classList.add('hidden');
      document.body.style.overflow = '';
    };
    window.addEventListener('load', () => setTimeout(dismiss, 3000));
    const skipBtn = document.getElementById('splashSkip');
    if (skipBtn) skipBtn.addEventListener('click', dismiss);
    setTimeout(dismiss, 4200); // safety fallback
  })();

  /* ---------- SCROLL PROGRESS ---------- */
  (function initScrollProgress(){
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    const update = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.width = max > 0 ? `${(scrolled / max) * 100}%` : '0%';
    };
    document.addEventListener('scroll', update, { passive: true });
    update();
  })();

  /* ---------- MOBILE NAV ---------- */
  (function initMobileNav(){
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!navToggle || !mobileMenu) return;
    navToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  })();

  /* ---------- SCROLLSPY ---------- */
  (function initScrollspy(){
    const links = document.querySelectorAll('nav.links a.nav-link');
    if (!links.length) return;
    const map = {};
    links.forEach(l => {
      const id = l.getAttribute('href').replace('#', '');
      const el = document.getElementById(id);
      if (el) map[id] = l;
    });
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const link = map[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    Object.keys(map).forEach(id => spy.observe(document.getElementById(id)));
  })();

  /* ---------- SCROLL REVEAL ---------- */
  (function initReveal(){
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => observer.observe(el));
  })();

  /* ---------- DIAGRAM DRAW-ON ---------- */
  (function initDiagram(){
    const wrap = document.getElementById('diagramWrap');
    if (!wrap) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          wrap.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    observer.observe(wrap);
  })();

  /* ---------- OUTCOME ACCORDION ---------- */
  (function initAccordion(){
    const outcomes = document.querySelectorAll('.outcome');
    outcomes.forEach(item => {
      const head = item.querySelector('.outcome-head');
      head.addEventListener('click', () => {
        const isOpen = item.getAttribute('data-open') === 'true';
        outcomes.forEach(o => o.setAttribute('data-open', 'false'));
        outcomes.forEach(o => o.querySelector('.outcome-head').setAttribute('aria-expanded', 'false'));
        if (!isOpen) {
          item.setAttribute('data-open', 'true');
          head.setAttribute('aria-expanded', 'true');
        }
      });
    });
  })();

  /* ---------- STEP TOGGLER (How We Work) — click a step, or click a diagram dot ---------- */
  (function initStepToggle(){
    const buttons = document.querySelectorAll('.step-btn');
    const panels = document.querySelectorAll('.step-panel');
    const dots = document.querySelectorAll('.diagram-dot');
    if (!buttons.length) return;

    function activate(step){
      buttons.forEach(b => b.setAttribute('aria-selected', b.dataset.step === step ? 'true' : 'false'));
      panels.forEach(p => p.setAttribute('data-active', p.dataset.step === step ? 'true' : 'false'));
      dots.forEach(d => d.classList.toggle('active', d.dataset.step === step));
    }

    buttons.forEach(b => b.addEventListener('click', () => activate(b.dataset.step)));
    dots.forEach(d => d.addEventListener('click', () => activate(d.dataset.step)));

    activate(buttons[0].dataset.step);
  })();

  /* ---------- CONTACT FORM ---------- */
  (function initForm(){
    const form = document.getElementById('contactForm');
    if (!form) return;
    const status = document.getElementById('formStatus');
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const messageField = document.getElementById('message');
    const countEl = document.getElementById('messageCount');
    const submitButton = form.querySelector('button[type="submit"]');
    let submitting = false;
    // Keep native validation for visitors without JavaScript.
    form.noValidate = true;

    messageField.addEventListener('input', () => {
      const len = messageField.value.length;
      countEl.textContent = `${len} characters`;
      countEl.classList.toggle('warn', len > 0 && len < 10);
    });

    function setError(field, msg){
      const wrap = field.closest('.field');
      wrap.classList.toggle('error', Boolean(msg));
      field.setAttribute('aria-invalid', msg ? 'true' : 'false');
      const err = wrap.querySelector('.field-error');
      if (err) err.textContent = msg || '';
    }

    function validEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (submitting) return;
      status.classList.remove('success', 'error');
      let ok = true;

      if (!nameField.value.trim()) { setError(nameField, 'Tell us your name.'); ok = false; }
      else setError(nameField, '');

      if (!validEmail(emailField.value.trim())) { setError(emailField, 'That email doesn\u2019t look right.'); ok = false; }
      else setError(emailField, '');

      if (messageField.value.trim().length < 10) { setError(messageField, 'A sentence or two is enough to start.'); ok = false; }
      else setError(messageField, '');

      if (!ok) {
        status.textContent = '';
        status.classList.remove('success');
        form.querySelector('[aria-invalid="true"]').focus();
        return;
      }

      const data = new FormData(form);
      data.set('name', nameField.value.trim());
      data.set('email', emailField.value.trim());
      data.set('message', messageField.value.trim());
      submitting = true;
      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
      form.setAttribute('aria-busy', 'true');
      status.textContent = 'Sending your message…';

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
          signal: controller.signal
        });
        if (!response.ok) throw new Error('Submission failed');
        status.textContent = 'Thanks! Your message has been submitted. We’ll be in touch.';
        status.classList.add('success');
        form.reset();
        countEl.textContent = '0 characters';
        countEl.classList.remove('warn');
      } catch (error) {
        status.textContent = error.name === 'AbortError'
          ? 'Confirmation took too long. Your message may have arrived; contact homane.in@gmail.com if needed.'
          : 'We couldn’t confirm your submission. Your message is still here—please try again or email homane.in@gmail.com.';
        status.classList.add('error');
      } finally {
        clearTimeout(timeout);
        submitting = false;
        submitButton.disabled = false;
        submitButton.textContent = 'Send message';
        form.removeAttribute('aria-busy');
      }
    });
  })();
});
