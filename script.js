/* ═══════════════════════════════════════════════════
   ASIR HERITAGE DIGITIZATION INITIATIVE
   Interactive Scripts
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initRevealAnimations();
  initNavigation();
  initTabs();
  initCounters();
});

/* ══════════════════════════════════════
   PARTICLE CANVAS — Asiri Geometric Motifs
   ══════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, particles = [], mouse = { x: 0, y: 0 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Create particles — mix of shapes inspired by القط العسيري patterns
  const shapes = ['diamond', 'triangle', 'dot', 'line'];
  const goldColors = [
    'rgba(245, 215, 122, 0.15)',
    'rgba(212, 168, 67, 0.12)',
    'rgba(196, 146, 52, 0.10)',
    'rgba(168, 121, 43, 0.08)',
    'rgba(45, 212, 191, 0.06)',
  ];

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 6 + 2,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: goldColors[Math.floor(Math.random() * goldColors.length)],
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.01,
      baseX: 0,
      baseY: 0,
    });
    particles[i].baseX = particles[i].x;
    particles[i].baseY = particles[i].y;
  }

  function drawParticle(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.strokeStyle = p.color;

    switch (p.shape) {
      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size, 0);
        ctx.lineTo(0, p.size);
        ctx.lineTo(-p.size, 0);
        ctx.closePath();
        ctx.fill();
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size, p.size);
        ctx.lineTo(-p.size, p.size);
        ctx.closePath();
        ctx.fill();
        break;
      case 'dot':
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'line':
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-p.size, 0);
        ctx.lineTo(p.size, 0);
        ctx.stroke();
        break;
    }
    ctx.restore();
  }

  // Draw connecting lines between nearby particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.strokeStyle = `rgba(212, 168, 67, ${0.03 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
      // Gentle float movement
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;

      // Mouse repulsion (very subtle)
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const force = (200 - dist) / 200 * 0.5;
        p.x += (dx / dist) * force;
        p.y += (dy / dist) * force;
      }

      // Wrap around screen edges
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;

      drawParticle(p);
    });

    drawConnections();
    requestAnimationFrame(animate);
  }

  animate();
}

/* ══════════════════════════════════════
   SCROLL REVEAL ANIMATIONS
   ══════════════════════════════════════ */
function initRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════
   NAVIGATION
   ══════════════════════════════════════ */
function initNavigation() {
  const topNav = document.querySelector('.top-nav');
  const sideNav = document.querySelectorAll('.side-nav a');
  const sections = document.querySelectorAll('section[id]');

  // Show top nav on scroll
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 100) {
      topNav.classList.add('visible');
    } else {
      topNav.classList.remove('visible');
    }
    lastScroll = currentScroll;

    // Update active side nav dot
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 200;
      if (currentScroll >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    sideNav.forEach(dot => {
      dot.classList.remove('active');
      if (dot.getAttribute('href') === `#${current}`) {
        dot.classList.add('active');
      }
    });
  });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ══════════════════════════════════════
   TABS — Objectives & Partners
   ══════════════════════════════════════ */
function initTabs() {
  // Generic tab handler
  function setupTabs(tabSelector, panelSelector) {
    const tabs = document.querySelectorAll(tabSelector);
    const panels = document.querySelectorAll(panelSelector);
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.target;
        
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        panels.forEach(p => {
          p.classList.remove('active');
          if (p.id === target) p.classList.add('active');
        });
      });
    });
  }

  setupTabs('.obj-tab', '.objectives-panel');
  setupTabs('.partner-tab', '.partners-panel');
}

/* ══════════════════════════════════════
   ANIMATED COUNTERS
   ══════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 2000;
  const start = performance.now();

  function update(timestamp) {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    
    el.textContent = prefix + current.toLocaleString('ar-SA') + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ══════════════════════════════════════
   PARALLAX HERO ELEMENTS
   ══════════════════════════════════════ */
document.addEventListener('mousemove', (e) => {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;
  
  const rect = heroContent.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const deltaX = (e.clientX - centerX) / window.innerWidth * 8;
  const deltaY = (e.clientY - centerY) / window.innerHeight * 8;
  
  heroContent.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
});
