/* ================================================================
   PORTFOLIO — script.js
   Author: Shaik Basheer Ahmed Basha
   ================================================================

   TABLE OF CONTENTS
   1.  Custom Cursor
   2.  Navbar — Scroll + Active Link
   3.  Mobile Menu (Hamburger)
   4.  Dark/Light Theme Toggle
   5.  Hero Typewriter Effect
   6.  Scroll-Reveal Animations
   7.  Skill Bar Animations
   8.  Scroll-to-Top Button
   9.  Contact Form (demo handler)
   10. Init on DOMContentLoaded
================================================================ */


/* ================================================================
   1. CUSTOM CURSOR
   Moves two layered elements to follow the mouse
================================================================ */
function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  // Bail out on touch devices
  if (!dot || !ring || window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Dot follows instantly
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Ring follows with slight lag
  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Enlarge ring on hoverable elements
  const hoverTargets = 'a, button, .project-card, .cert-card, .stat-card, .skill-category';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
}


/* ================================================================
   2. NAVBAR — Scroll behaviour + Active Section Highlight
================================================================ */
function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Add .scrolled class when page scrolled beyond 50px
  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveLink();
  }

  // Highlight link for the currently visible section
  function highlightActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load
}


/* ================================================================
   3. MOBILE MENU (HAMBURGER)
================================================================ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });
}


/* ================================================================
   4. DARK / LIGHT THEME TOGGLE
   Persists preference to localStorage
================================================================ */
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const html   = document.documentElement;

  // Load saved preference (default: dark)
  const saved = localStorage.getItem('theme') ?? 'dark';
  html.setAttribute('data-theme', saved);

  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}


/* ================================================================
   5. HERO TYPEWRITER EFFECT
   Edit the `words` array to change what gets typed
================================================================ */
function initTypewriter() {
  const el = document.getElementById('typedText');
  if (!el) return;

  // ---- EDIT THESE WORDS ----
  const words = [
    'Aspiring Developer',
    'Problem Solver',
    'Data Enthusiast',
    'AI Explorer',
    'CSE Student',
  ];

  let wordIndex   = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  const typeSpeed = 90;
  const delSpeed  = 50;
  const pauseTime = 1800;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      el.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? delSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentWord.length) {
      delay = pauseTime;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 300;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 800);
}


/* ================================================================
   6. SCROLL-REVEAL ANIMATIONS
   Uses IntersectionObserver to add .visible class to elements
================================================================ */
function initScrollReveal() {
  // Hero .animate-in elements — triggered once on load
  const heroElements = document.querySelectorAll('.animate-in');
  heroElements.forEach(el => {
    // Small timeout so CSS transition fires
    setTimeout(() => el.classList.add('visible'), 100);
  });

  // All other .reveal elements — triggered when they enter viewport
  const revealElements = document.querySelectorAll(
    '.section-header, .about-grid, .skill-category, .project-card, ' +
    '.cert-card, .edu-item, .activity-card, .contact-grid, .stat-card'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger delay for grid children
          const siblings = entry.target.parentElement.querySelectorAll('.reveal');
          let delay = 0;
          siblings.forEach((sib, idx) => {
            if (sib === entry.target) delay = idx * 80;
          });
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => observer.observe(el));
}


/* ================================================================
   7. SKILL BAR ANIMATIONS
   Animates width of .skill-fill elements when they enter viewport
================================================================ */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetWidth = entry.target.getAttribute('data-width');
          entry.target.style.width = targetWidth + '%';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  fills.forEach(fill => observer.observe(fill));
}


/* ================================================================
   8. SCROLL-TO-TOP BUTTON
================================================================ */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ================================================================
   9b. CLICKABLE PROJECT CARDS
   Makes the entire card navigate to the project link when clicked.
   The individual icon links still work independently via stopPropagation.
================================================================ */
function initProjectCards() {
  document.querySelectorAll('.project-card').forEach(card => {
    const viewBtn = card.querySelector('.btn-view-project');
    if (!viewBtn) return;

    const url = viewBtn.getAttribute('href');

    card.addEventListener('click', (e) => {
      // Don't fire if user clicked a link/button inside the card
      if (e.target.closest('a') || e.target.closest('button')) return;
      window.open(url, '_blank', 'noopener');
    });
  });
}


/* ================================================================
   9. CONTACT FORM — DEMO HANDLER
   Replace this with Formspree / EmailJS / Netlify Forms as needed.

   To use Formspree:
     1. Go to https://formspree.io and create a form
     2. Add action="https://formspree.io/f/YOUR_ID" to the <form>
     3. Remove the preventDefault below and let it submit normally
        OR keep it and use fetch() for AJAX submission

   To use EmailJS:
     1. npm install @emailjs/browser OR add CDN script
     2. Replace the submit handler body with EmailJS.sendForm(...)
================================================================ */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Gather values
    const name    = document.getElementById('formName').value.trim();
    const email   = document.getElementById('formEmail').value.trim();
    const message = document.getElementById('formMsg').value.trim();

    if (!name || !email || !message) return;

    // -----------------------------------------------------------
    // DEMO: simulate sending — replace with real API call
    // -----------------------------------------------------------
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      btn.innerHTML = '<iconify-icon icon="ph:paper-plane-tilt-bold"></iconify-icon> Send Message';
      btn.disabled  = false;
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1200);
    // -----------------------------------------------------------
  });
}

/* ================================================================
   ANIMATED BACKGROUND — Stars (dark) / Bubbles (light)
   Draws on a full-screen canvas behind everything
================================================================ */
/* ================================================================
   ANIMATED BACKGROUND — Stars + Dragon (dark) / Bubbles (light)
================================================================ */
/* ================================================================
PORTFOLIO — CLEAN BACKGROUND (NO DRAGON)
================================================================ */
function initBackground() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;

  // ── RENDERER ──
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  // ── SCENE & CAMERA ──
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000);
  camera.position.set(0, 80, 500);
  camera.lookAt(0, 0, 0);

  // ── MOUSE PARALLAX ──
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth  - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // ── HELPERS ──
  const rand  = (a, b) => a + Math.random() * (b - a);
  const randI = (a, b) => Math.floor(rand(a, b + 1));

  // ── 1. MAIN PARTICLE FIELD ──
  const PARTICLE_COUNT = 8000;
  const positions  = new Float32Array(PARTICLE_COUNT * 3);
  const colors     = new Float32Array(PARTICLE_COUNT * 3);
  const sizes      = new Float32Array(PARTICLE_COUNT);
  const velocities = [];

  const neonColors = [
    new THREE.Color(0x4fc3f7),
    new THREE.Color(0x0288d1),
    new THREE.Color(0xe0f7fa),
    new THREE.Color(0xffffff),
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    positions[i3]     = rand(-1200, 1200);
    positions[i3 + 1] = rand(-600, 600);
    positions[i3 + 2] = rand(-1000, 200);

    const c = neonColors[randI(0, neonColors.length - 1)];
    colors[i3]     = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;

    sizes[i] = rand(0.5, 3.5);
    velocities.push(
      rand(-0.04, 0.04),
      rand(-0.02, 0.02),
      rand(0.05, 0.4)
    );
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color',    new THREE.BufferAttribute(colors,    3));
  particleGeo.setAttribute('size',     new THREE.BufferAttribute(sizes,     1));

  const particleMat = new THREE.PointsMaterial({
    size: 2.2,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  scene.add(new THREE.Points(particleGeo, particleMat));

  // ── 2. GRID FLOOR ──
  function createGrid(size, divisions, color, opacity) {
    const grid = new THREE.GridHelper(size, divisions, color, color);
    grid.material.transparent = true;
    grid.material.opacity     = opacity;
    grid.material.blending    = THREE.AdditiveBlending;
    return grid;
  }

  const gridMain = createGrid(2400, 48, 0x4fc3f7, 0.06);
  gridMain.position.y = -200;
  scene.add(gridMain);

  const gridSub = createGrid(2400, 24, 0x0288d1, 0.04);
  gridSub.position.y = -202;
  scene.add(gridSub);

  // ── 3. FLOATING WIREFRAME SHAPES ──
  const meshGroup = new THREE.Group();
  scene.add(meshGroup);

  const meshMats = [
    new THREE.MeshBasicMaterial({ color: 0x4fc3f7, wireframe: true, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending }),
    new THREE.MeshBasicMaterial({ color: 0x0288d1, wireframe: true, transparent: true, opacity: 0.10, blending: THREE.AdditiveBlending }),
    new THREE.MeshBasicMaterial({ color: 0xe0f7fa, wireframe: true, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending }),
  ];

  const geoTypes = [
    () => new THREE.IcosahedronGeometry(rand(20, 60), 1),
    () => new THREE.OctahedronGeometry(rand(18, 50), 0),
    () => new THREE.TetrahedronGeometry(rand(20, 55), 0),
    () => new THREE.TorusGeometry(rand(18, 40), rand(4, 12), 8, 16),
    () => new THREE.CylinderGeometry(0, rand(20, 45), rand(40, 80), 6, 1),
  ];

  const floatingMeshes = [];
  for (let i = 0; i < 30; i++) {
    const geo  = geoTypes[randI(0, geoTypes.length - 1)]();
    const mat  = meshMats[randI(0, meshMats.length - 1)];
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(rand(-900, 900), rand(-300, 300), rand(-800, 100));
    mesh.rotation.set(rand(0, Math.PI * 2), rand(0, Math.PI * 2), rand(0, Math.PI * 2));
    const speed = { rx: rand(-0.003, 0.003), ry: rand(-0.004, 0.004), rz: rand(-0.002, 0.002) };
    floatingMeshes.push({ mesh, speed, oy: mesh.position.y, phase: rand(0, Math.PI * 2) });
    meshGroup.add(mesh);
  }

  // ── 4. NEON RINGS ──
  const ringGroup = new THREE.Group();
  scene.add(ringGroup);

  function createRing(radius, color, opacity) {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending });
    return new THREE.Line(geo, mat);
  }

  const ringData = [];
  [
    { r: 300, col: 0x4fc3f7, op: 0.18 },
    { r: 500, col: 0x0288d1, op: 0.12 },
    { r: 700, col: 0xe0f7fa, op: 0.08 },
    { r: 160, col: 0x4fc3f7, op: 0.22 },
  ].forEach((cfg, i) => {
    const ring = createRing(cfg.r, cfg.col, cfg.op);
    ring.position.y = -200 + i * 20;
    ring.rotation.x = Math.PI / 2 + rand(-0.1, 0.1);
    ringGroup.add(ring);
    ringData.push({ ring, speed: (i % 2 === 0 ? 1 : -1) * rand(0.0004, 0.0012) });
  });

  // ── 5. CENTRAL SPHERE ──
  const sphere1 = new THREE.Mesh(
    new THREE.IcosahedronGeometry(60, 4),
    new THREE.MeshBasicMaterial({ color: 0x4fc3f7, wireframe: true, transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending })
  );
  const sphere2 = new THREE.Mesh(
    new THREE.IcosahedronGeometry(80, 3),
    new THREE.MeshBasicMaterial({ color: 0x0288d1, wireframe: true, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending })
  );
  sphere1.position.set(300, 80, -300);
  sphere2.position.set(300, 80, -300);
  scene.add(sphere1, sphere2);

  // ── ANIMATION LOOP ──
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Mouse parallax
    currentX += (targetX - currentX) * 0.04;
    currentY += (targetY - currentY) * 0.04;
    camera.position.x = currentX * 120;
    camera.position.y = 80 - currentY * 60;
    camera.lookAt(0, 0, 0);

    // Particles drift toward camera + wrap
    const pos = particleGeo.attributes.position;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      pos.array[i3]     += velocities[i3];
      pos.array[i3 + 1] += velocities[i3 + 1];
      pos.array[i3 + 2] += velocities[i3 + 2];
      if (pos.array[i3 + 2] > 600)    { pos.array[i3 + 2] = -1000; pos.array[i3] = rand(-1200, 1200); pos.array[i3 + 1] = rand(-600, 600); }
      if (pos.array[i3 + 2] < -1000)    pos.array[i3 + 2] = 600;
      if (Math.abs(pos.array[i3])     > 1300) pos.array[i3]     *= -1;
      if (Math.abs(pos.array[i3 + 1]) > 700)  pos.array[i3 + 1] *= -1;
    }
    pos.needsUpdate = true;

    // Particle pulse
    particleMat.opacity = 0.65 + 0.15 * Math.sin(t * 0.8);

    // Floating shapes
    floatingMeshes.forEach(({ mesh, speed, oy, phase }) => {
      mesh.rotation.x += speed.rx;
      mesh.rotation.y += speed.ry;
      mesh.rotation.z += speed.rz;
      mesh.position.y  = oy + Math.sin(t * 0.5 + phase) * 20;
    });

    // Rings rotate
    ringData.forEach(({ ring, speed }) => { ring.rotation.z += speed; });

    // Grid shimmer
    gridMain.material.opacity = 0.04 + 0.03 * Math.sin(t * 1.2);
    gridSub.material.opacity  = 0.025 + 0.02 * Math.sin(t * 0.7 + 1);

    // Sphere rotate
    sphere1.rotation.y += 0.003;
    sphere1.rotation.x += 0.001;
    sphere2.rotation.y -= 0.002;
    sphere2.rotation.z += 0.0015;

    // Grid parallax
    gridMain.position.x = -currentX * 30;
    gridSub.position.x  = -currentX * 20;

    renderer.render(scene, camera);
  }
  animate();

  // ── RESIZE ──
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── THEME SWITCH — rebuild colors ──
  new MutationObserver(() => {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    particleMat.opacity = isDark ? 0.8 : 0.4;
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

function initScrollBackground() {
  let lastScroll = 0;
  let scrollVelocity = 0;
  let targetVelocity = 0;

  const lerp = (a, b, t) => a + (b - a) * t;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    targetVelocity = Math.abs(current - lastScroll);
    lastScroll = current;
  }, { passive: true });

  function update() {
    const scrollY = window.scrollY;
    const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(scrollY / maxScroll, 1);

    scrollVelocity = lerp(scrollVelocity, targetVelocity, 0.1);
    targetVelocity *= 0.85;

    const parallax = scrollY * 0.15;
    const hue = progress * 30;
    const brightnessBoost = 1 + Math.min(scrollVelocity * 0.008, 0.25);
    const saturationBoost = 1 + Math.min(scrollVelocity * 0.01, 0.3);

    const canvas = document.getElementById('bgCanvas');
    if (canvas) {
      canvas.style.transform = `translateY(${scrollY * 0.05}px)`;
      canvas.style.filter = `hue-rotate(${hue}deg) brightness(${brightnessBoost}) saturate(${saturationBoost})`;
    }

    document.documentElement.style.setProperty('--scroll-progress', progress);
    requestAnimationFrame(update);
  }

  update();
}

/* ================================================================
   10. INIT — Run everything after DOM is ready
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNavbar();
  initMobileMenu();
  initTheme();
  initTypewriter();
  initScrollReveal();
  initSkillBars();
  initScrollTop();
  initContactForm();
  initProjectCards();
  initBackground(); 
  initScrollBackground();
  // Smooth scroll for all anchor links (fallback for older browsers)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

