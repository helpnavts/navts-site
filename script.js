const WHATSAPP_NUMBER = '919175697934';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer:fine)').matches;
const isMobileNav = () => window.matchMedia('(max-width: 980px)').matches;

document.getElementById('year').textContent = new Date().getFullYear();

function splitChars(node) {
  const text = node.textContent;
  node.textContent = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.style.setProperty('--c', String(i));
    span.textContent = ch === ' ' ? '\u00a0' : ch;
    node.appendChild(span);
  });
}

function splitWords(node) {
  const words = node.textContent.trim().split(/\s+/);
  node.textContent = '';
  words.forEach((word) => {
    const wrap = document.createElement('span');
    wrap.className = 'word';
    const inner = document.createElement('span');
    inner.textContent = word;
    wrap.appendChild(inner);
    node.appendChild(wrap);
  });
}

document.querySelectorAll('.split-chars').forEach(splitChars);
document.querySelectorAll('.split-words').forEach(splitWords);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    const counter = entry.target.querySelector('.count');
    if (counter) animateCount(counter);
    observer.unobserve(entry.target);
  });
}, { threshold: isMobileNav() ? 0.08 : 0.16, rootMargin: '0px 0px -4% 0px' });

document.querySelectorAll('.reveal').forEach((el) => {
  if (el.dataset.delay) el.style.setProperty('--delay', `${el.dataset.delay}ms`);
  observer.observe(el);
});

function animateCount(el) {
  const end = Number(el.dataset.count || el.textContent);
  if (reduceMotion) {
    el.textContent = String(end);
    return;
  }
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min((now - start) / 1200, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = String(Math.round(end * eased));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function enquiryMessage() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const lines = ['Hi NAVTS, I’d like to discuss a website project.'];
  if (name) lines.push('', `Name: ${name}`);
  if (email) lines.push(`Email: ${email}`);
  if (message) lines.push('', message);
  return lines.join('\n');
}

function whatsappUrl(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  window.open(whatsappUrl(enquiryMessage()), '_blank', 'noopener');
});

document.getElementById('whatsappLink').addEventListener('click', (e) => {
  e.preventDefault();
  const message = document.getElementById('message').value.trim();
  const text = message ? enquiryMessage() : 'Hi NAVTS, I’d like to discuss a website project.';
  window.open(whatsappUrl(text), '_blank', 'noopener');
});

const menu = document.getElementById('mobileMenu');
const menuToggle = document.querySelector('.menu-toggle');

function setMenu(open) {
  document.body.classList.toggle('menu-open', open);
  menu.setAttribute('aria-hidden', open ? 'false' : 'true');
  menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

menuToggle.addEventListener('click', () => {
  setMenu(!document.body.classList.contains('menu-open'));
});

menu.querySelectorAll('a').forEach((link) => {
  link.style.setProperty('--i', link.dataset.i || '1');
  link.addEventListener('click', () => setMenu(false));
});

function markReady() {
  document.body.classList.remove('is-loading');
  document.body.classList.add('is-ready');
}

if (reduceMotion) {
  markReady();
} else {
  window.setTimeout(markReady, isMobileNav() ? 1050 : 1450);
}

if (!reduceMotion) {
  const nav = document.querySelector('.nav');
  const progress = document.querySelector('.scroll-progress');
  const heroArt = document.querySelector('.hero-art');
  const glow = document.querySelector('.hero-glow');
  const tilt = document.querySelector('.hero-tilt');
  let lastY = 0;

  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? y / max : 0;
    progress.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
    nav.classList.toggle('is-scrolled', y > 12);
    if (!isMobileNav() && !document.body.classList.contains('menu-open')) {
      nav.classList.toggle('is-hidden', y > lastY && y > 80);
    } else {
      nav.classList.remove('is-hidden');
    }
    lastY = y;

    if (!finePointer && tilt && glow) {
      const p = Math.min(Math.max(y / Math.max(window.innerHeight, 1), 0), 1);
      tilt.style.transform = `rotate(${5 + p * 6}deg) translate3d(0, ${p * 36}px, 0)`;
      glow.style.setProperty('--gx', `${58 + p * 10}%`);
      glow.style.setProperty('--gy', `${42 - p * 16}%`);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (heroArt && tilt && glow && finePointer) {
    heroArt.addEventListener('pointermove', (e) => {
      const box = heroArt.getBoundingClientRect();
      const x = (e.clientX - box.left) / box.width;
      const y = (e.clientY - box.top) / box.height;
      glow.style.setProperty('--gx', `${x * 100}%`);
      glow.style.setProperty('--gy', `${y * 100}%`);
      tilt.style.transform = `rotateX(${(0.5 - y) * 10}deg) rotateY(${(x - 0.5) * 14}deg)`;
    });
    heroArt.addEventListener('pointerleave', () => {
      tilt.style.transform = '';
    });
  }

  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const box = card.getBoundingClientRect();
      card.style.setProperty('--spotx', `${e.clientX - box.left}px`);
      card.style.setProperty('--spoty', `${e.clientY - box.top}px`);
    });
    card.addEventListener('pointerdown', (e) => {
      const box = card.getBoundingClientRect();
      card.style.setProperty('--spotx', `${e.clientX - box.left}px`);
      card.style.setProperty('--spoty', `${e.clientY - box.top}px`);
      card.classList.add('is-pressed');
    });
    card.addEventListener('pointerup', () => card.classList.remove('is-pressed'));
    card.addEventListener('pointerleave', () => card.classList.remove('is-pressed'));
  });

  if (finePointer) {
    document.querySelectorAll('.magnetic').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const box = el.getBoundingClientRect();
        const x = e.clientX - box.left - box.width / 2;
        const y = e.clientY - box.top - box.height / 2;
        el.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });
  }
}

if (!reduceMotion && finePointer) {
  const cursor = document.querySelector('.cursor');
  const ring = document.querySelector('.cursor-ring');
  document.body.classList.add('has-cursor');
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let rx = x;
  let ry = y;

  window.addEventListener('pointermove', (e) => {
    x = e.clientX;
    y = e.clientY;
    document.body.style.setProperty('--mx', `${x}px`);
    document.body.style.setProperty('--my', `${y}px`);
    const hover = e.target.closest('a, button, input, textarea');
    document.body.classList.toggle('is-pointer', Boolean(hover));
  });

  const loop = () => {
    rx += (x - rx) * 0.18;
    ry += (y - ry) * 0.18;
    cursor.style.transform = `translate(${x}px, ${y}px)`;
    ring.style.transform = `translate(calc(-50% + ${rx - x}px), calc(-50% + ${ry - y}px))`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
} else {
  document.querySelector('.cursor')?.classList.add('is-off');
}
