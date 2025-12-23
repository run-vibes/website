# Homepage Prototypes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build three visually distinct full-page homepage prototypes (Midnight, Daybreak, Aurora) with light interactivity.

**Architecture:** Pure HTML/CSS/JS prototypes with no build step. Shared utilities handle scroll animations and content data. Each prototype has its own hero visual (particles, geometry, mesh gradient) implemented in vanilla JS/Canvas/SVG.

**Tech Stack:** HTML5, CSS3 (custom properties, flexbox, grid), Vanilla JavaScript, Canvas API, SVG animations

---

## Task 1: Shared Reset CSS

**Files:**
- Create: `prototypes/shared/reset.css`

**Step 1: Create the reset stylesheet**

```css
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  min-height: 100vh;
  line-height: 1.6;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}

ul,
ol {
  list-style: none;
}

h1, h2, h3, h4, h5, h6 {
  line-height: 1.2;
  text-wrap: balance;
}

p {
  text-wrap: pretty;
}
```

**Step 2: Verify file created**

Run: `cat prototypes/shared/reset.css | head -20`
Expected: CSS content displayed

**Step 3: Commit**

```bash
git add prototypes/shared/reset.css
git commit -m "Add shared CSS reset"
```

---

## Task 2: Shared Content Data

**Files:**
- Create: `prototypes/shared/content.js`

**Step 1: Create the content data module**

```javascript
const CONTENT = {
  hero: {
    headline: "The studio where AI agents come to life",
    subheadline: "Delivering impact you can measure",
    description: "We design and build AI agents that transform how businesses operate — from intelligent automation to multi-agent systems that scale.",
    primaryCta: "Let's Talk",
    secondaryCta: "See Our Work"
  },

  services: [
    {
      title: "Agent Development",
      tagline: "Intelligent agents. Coordinated swarms. Real-world impact.",
      description: "End-to-end design and development of AI agents — from single agents to multi-agent orchestration.",
      icon: "agent"
    },
    {
      title: "AI Strategy & Consulting",
      tagline: "Navigate the AI landscape with a clear plan.",
      description: "AI readiness assessments, architecture reviews, and transformation roadmaps.",
      icon: "strategy"
    },
    {
      title: "Product Development",
      tagline: "Ship AI products that users love.",
      description: "New product ideation, AI feature integration, and scaling from MVP to production.",
      icon: "product"
    },
    {
      title: "Workshops & Training",
      tagline: "Empower your team to think in agents.",
      description: "Hands-on agent-building workshops and executive AI literacy sessions.",
      icon: "workshop"
    }
  ],

  caseStudies: [
    {
      industry: "Fintech",
      title: "Automated Compliance Agent",
      challenge: "Manual compliance reviews taking 40+ hours per week",
      outcome: "85% reduction in review time, zero compliance violations",
      metrics: ["85%", "time saved"]
    },
    {
      industry: "E-commerce",
      title: "Inventory Optimization System",
      challenge: "Stockouts and overstock costing millions annually",
      outcome: "Real-time demand prediction with 94% accuracy",
      metrics: ["94%", "accuracy"]
    },
    {
      industry: "SaaS",
      title: "Customer Support Automation",
      challenge: "Support team overwhelmed with repetitive queries",
      outcome: "70% of tickets resolved automatically",
      metrics: ["70%", "auto-resolved"]
    }
  ],

  industries: [
    { name: "Fintech", icon: "fintech" },
    { name: "E-commerce", icon: "ecommerce" },
    { name: "SaaS", icon: "saas" },
    { name: "Professional Services", icon: "services" }
  ],

  insights: [
    {
      title: "Building Multi-Agent Systems That Scale",
      category: "Technical",
      readTime: "8 min"
    },
    {
      title: "The ROI of AI Agents: A Framework",
      category: "Business",
      readTime: "5 min"
    },
    {
      title: "From Chatbot to Agent: What's the Difference?",
      category: "Technical",
      readTime: "6 min"
    }
  ],

  finalCta: {
    headline: "Ready to bring your AI vision to life?",
    description: "Let's talk about what you're building.",
    primaryCta: "Start a Conversation",
    secondaryCta: "Subscribe to Insights"
  },

  footer: {
    copyright: "© 2025 Vibes. All rights reserved.",
    links: ["About", "Careers", "Privacy", "Terms"]
  }
};

// Make available globally for prototypes
if (typeof window !== 'undefined') {
  window.CONTENT = CONTENT;
}
```

**Step 2: Verify file created**

Run: `cat prototypes/shared/content.js | head -20`
Expected: JavaScript content displayed

**Step 3: Commit**

```bash
git add prototypes/shared/content.js
git commit -m "Add shared content data"
```

---

## Task 3: Shared Animation Utilities

**Files:**
- Create: `prototypes/shared/animations.js`

**Step 1: Create the animation utilities**

```javascript
/**
 * Scroll-triggered animation observer
 */
function initScrollAnimations(options = {}) {
  const {
    selector = '[data-animate]',
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    staggerDelay = 100
  } = options;

  const elements = document.querySelectorAll(selector);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;

        // Handle staggered children
        if (el.hasAttribute('data-stagger')) {
          const children = el.querySelectorAll('[data-animate-child]');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('visible');
            }, index * staggerDelay);
          });
        }

        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }, { threshold, rootMargin });

  elements.forEach((el) => observer.observe(el));
}

/**
 * Smooth easing functions
 */
const easing = {
  // Smooth deceleration
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  // Smooth acceleration then deceleration
  easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  // Bouncy deceleration
  easeOutBack: (t) => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2),
  // Dreamy float
  easeOutQuart: (t) => 1 - Math.pow(1 - t, 4)
};

/**
 * Linear interpolation
 */
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

/**
 * Map value from one range to another
 */
function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Clamp value between min and max
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Throttle function calls
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Initialize on DOM ready
 */
function onReady(callback) {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}

// Export for use
if (typeof window !== 'undefined') {
  window.AnimUtils = {
    initScrollAnimations,
    easing,
    lerp,
    mapRange,
    clamp,
    throttle,
    onReady
  };
}
```

**Step 2: Verify file created**

Run: `cat prototypes/shared/animations.js | head -20`
Expected: JavaScript content displayed

**Step 3: Commit**

```bash
git add prototypes/shared/animations.js
git commit -m "Add shared animation utilities"
```

---

## Task 4: Midnight - Base HTML Structure

**Files:**
- Create: `prototypes/midnight/index.html`

**Step 1: Create the HTML structure**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vibes — Midnight Theme</title>
  <link rel="stylesheet" href="../shared/reset.css">
  <link rel="stylesheet" href="styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
</head>
<body>
  <!-- Navigation -->
  <nav class="nav">
    <div class="nav-container">
      <a href="#" class="nav-logo">Vibes</a>
      <div class="nav-links">
        <a href="#services">Services</a>
        <a href="#work">Work</a>
        <a href="#industries">Industries</a>
        <a href="#insights">Insights</a>
        <a href="#contact" class="nav-cta">Let's Talk</a>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <section class="hero" id="hero">
    <canvas class="hero-canvas" id="particles"></canvas>
    <div class="hero-content" data-animate>
      <h1 class="hero-headline"></h1>
      <p class="hero-subheadline"></p>
      <p class="hero-description"></p>
      <div class="hero-ctas">
        <button class="btn btn-primary"></button>
        <button class="btn btn-secondary"></button>
      </div>
    </div>
  </section>

  <!-- Social Proof -->
  <section class="social-proof" data-animate>
    <div class="container">
      <p class="social-proof-label">Trusted by innovative teams</p>
      <div class="social-proof-logos">
        <div class="logo-placeholder"></div>
        <div class="logo-placeholder"></div>
        <div class="logo-placeholder"></div>
        <div class="logo-placeholder"></div>
        <div class="logo-placeholder"></div>
      </div>
    </div>
  </section>

  <!-- Services -->
  <section class="services" id="services">
    <div class="container">
      <h2 class="section-title" data-animate>What We Build</h2>
      <div class="services-grid" data-animate data-stagger>
        <!-- Populated by JS -->
      </div>
    </div>
  </section>

  <!-- Featured Work -->
  <section class="work" id="work">
    <div class="container">
      <h2 class="section-title" data-animate>Featured Work</h2>
      <div class="work-grid" data-animate data-stagger>
        <!-- Populated by JS -->
      </div>
      <div class="work-cta" data-animate>
        <a href="#" class="btn btn-secondary">View All Work</a>
      </div>
    </div>
  </section>

  <!-- Industries -->
  <section class="industries" id="industries">
    <div class="container">
      <h2 class="section-title" data-animate>Industries We Serve</h2>
      <div class="industries-grid" data-animate data-stagger>
        <!-- Populated by JS -->
      </div>
    </div>
  </section>

  <!-- Insights -->
  <section class="insights" id="insights">
    <div class="container">
      <h2 class="section-title" data-animate>Latest Insights</h2>
      <div class="insights-grid" data-animate data-stagger>
        <!-- Populated by JS -->
      </div>
      <div class="insights-newsletter" data-animate>
        <p>Get insights delivered to your inbox</p>
        <form class="newsletter-form">
          <input type="email" placeholder="your@email.com" class="newsletter-input">
          <button type="submit" class="btn btn-primary">Subscribe</button>
        </form>
      </div>
    </div>
  </section>

  <!-- Final CTA -->
  <section class="final-cta" id="contact">
    <div class="container" data-animate>
      <h2 class="final-cta-headline"></h2>
      <p class="final-cta-description"></p>
      <div class="final-cta-buttons">
        <button class="btn btn-primary btn-large"></button>
        <button class="btn btn-secondary"></button>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <span class="footer-copyright"></span>
        <div class="footer-links">
          <!-- Populated by JS -->
        </div>
      </div>
    </div>
  </footer>

  <script src="../shared/content.js"></script>
  <script src="../shared/animations.js"></script>
  <script src="particles.js"></script>
  <script>
    // Populate content
    AnimUtils.onReady(() => {
      // Hero
      document.querySelector('.hero-headline').textContent = CONTENT.hero.headline;
      document.querySelector('.hero-subheadline').textContent = CONTENT.hero.subheadline;
      document.querySelector('.hero-description').textContent = CONTENT.hero.description;
      document.querySelector('.hero-ctas .btn-primary').textContent = CONTENT.hero.primaryCta;
      document.querySelector('.hero-ctas .btn-secondary').textContent = CONTENT.hero.secondaryCta;

      // Services
      const servicesGrid = document.querySelector('.services-grid');
      CONTENT.services.forEach(service => {
        servicesGrid.innerHTML += `
          <div class="service-card" data-animate-child>
            <div class="service-icon" data-icon="${service.icon}"></div>
            <h3 class="service-title">${service.title}</h3>
            <p class="service-tagline">${service.tagline}</p>
            <p class="service-description">${service.description}</p>
          </div>
        `;
      });

      // Case Studies
      const workGrid = document.querySelector('.work-grid');
      CONTENT.caseStudies.forEach(study => {
        workGrid.innerHTML += `
          <div class="work-card" data-animate-child>
            <span class="work-industry">${study.industry}</span>
            <h3 class="work-title">${study.title}</h3>
            <p class="work-challenge">${study.challenge}</p>
            <div class="work-outcome">
              <span class="work-metric">${study.metrics[0]}</span>
              <span class="work-metric-label">${study.metrics[1]}</span>
            </div>
          </div>
        `;
      });

      // Industries
      const industriesGrid = document.querySelector('.industries-grid');
      CONTENT.industries.forEach(industry => {
        industriesGrid.innerHTML += `
          <div class="industry-card" data-animate-child>
            <div class="industry-icon" data-icon="${industry.icon}"></div>
            <span class="industry-name">${industry.name}</span>
          </div>
        `;
      });

      // Insights
      const insightsGrid = document.querySelector('.insights-grid');
      CONTENT.insights.forEach(insight => {
        insightsGrid.innerHTML += `
          <div class="insight-card" data-animate-child>
            <span class="insight-category">${insight.category}</span>
            <h3 class="insight-title">${insight.title}</h3>
            <span class="insight-read-time">${insight.readTime} read</span>
          </div>
        `;
      });

      // Final CTA
      document.querySelector('.final-cta-headline').textContent = CONTENT.finalCta.headline;
      document.querySelector('.final-cta-description').textContent = CONTENT.finalCta.description;
      document.querySelector('.final-cta-buttons .btn-primary').textContent = CONTENT.finalCta.primaryCta;
      document.querySelector('.final-cta-buttons .btn-secondary').textContent = CONTENT.finalCta.secondaryCta;

      // Footer
      document.querySelector('.footer-copyright').textContent = CONTENT.footer.copyright;
      const footerLinks = document.querySelector('.footer-links');
      CONTENT.footer.links.forEach(link => {
        footerLinks.innerHTML += `<a href="#">${link}</a>`;
      });

      // Initialize animations
      AnimUtils.initScrollAnimations();

      // Initialize particles
      initParticles();
    });
  </script>
</body>
</html>
```

**Step 2: Verify file created**

Run: `cat prototypes/midnight/index.html | head -30`
Expected: HTML content displayed

**Step 3: Commit**

```bash
git add prototypes/midnight/index.html
git commit -m "Add Midnight prototype HTML structure"
```

---

## Task 5: Midnight - CSS Styles

**Files:**
- Create: `prototypes/midnight/styles.css`

**Step 1: Create the stylesheet**

```css
/* ================================
   Midnight Theme - Dark & Electric
   ================================ */

:root {
  /* Colors */
  --bg-primary: #0a0a14;
  --bg-surface: #12121f;
  --bg-elevated: #1a1a2a;
  --accent-primary: #00d4ff;
  --accent-secondary: #ff2d7a;
  --text-primary: #ffffff;
  --text-secondary: #a0a0b0;
  --text-muted: #606070;

  /* Typography */
  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;

  /* Spacing */
  --section-padding: 120px;
  --container-max: 1200px;
  --grid-gap: 32px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 500ms ease;
}

body {
  font-family: var(--font-body);
  background-color: var(--bg-primary);
  color: var(--text-secondary);
}

/* Container */
.container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 24px;
}

/* ================================
   Navigation
   ================================ */

.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 20px 0;
  background: linear-gradient(to bottom, var(--bg-primary), transparent);
}

.nav-container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.nav-links {
  display: flex;
  gap: 32px;
  align-items: center;
}

.nav-links a {
  font-size: 14px;
  color: var(--text-secondary);
  transition: color var(--transition-fast);
}

.nav-links a:hover {
  color: var(--text-primary);
}

.nav-cta {
  padding: 10px 20px;
  background: var(--accent-primary);
  color: var(--bg-primary) !important;
  border-radius: 6px;
  font-weight: 500;
}

.nav-cta:hover {
  background: #00e5ff;
}

/* ================================
   Buttons
   ================================ */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-primary {
  background: var(--accent-primary);
  color: var(--bg-primary);
}

.btn-primary:hover {
  background: #00e5ff;
  box-shadow: 0 0 30px rgba(0, 212, 255, 0.4);
}

.btn-secondary {
  background: transparent;
  color: var(--accent-primary);
  border: 1px solid var(--accent-primary);
}

.btn-secondary:hover {
  background: rgba(0, 212, 255, 0.1);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
}

.btn-large {
  padding: 18px 36px;
  font-size: 18px;
}

/* ================================
   Hero
   ================================ */

.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  padding: 0 24px;
}

.hero-headline {
  font-family: var(--font-display);
  font-size: clamp(40px, 8vw, 72px);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.hero-subheadline {
  font-size: clamp(20px, 3vw, 28px);
  color: var(--accent-primary);
  margin-bottom: 24px;
  font-weight: 500;
}

.hero-description {
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-ctas {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* ================================
   Social Proof
   ================================ */

.social-proof {
  padding: 60px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.social-proof-label {
  text-align: center;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: 32px;
}

.social-proof-logos {
  display: flex;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;
}

.logo-placeholder {
  width: 120px;
  height: 40px;
  background: var(--bg-surface);
  border-radius: 4px;
  opacity: 0.5;
}

/* ================================
   Section Styles
   ================================ */

.services,
.work,
.industries,
.insights {
  padding: var(--section-padding) 0;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 64px;
}

/* ================================
   Services
   ================================ */

.services {
  background: var(--bg-surface);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--grid-gap);
}

.service-card {
  background: var(--bg-primary);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 32px;
  transition: all var(--transition-base);
}

.service-card:hover {
  border-color: var(--accent-primary);
  box-shadow: 0 0 40px rgba(0, 212, 255, 0.15);
  transform: translateY(-4px);
}

.service-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 10px;
  margin-bottom: 20px;
  opacity: 0.8;
}

.service-title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.service-tagline {
  font-size: 14px;
  color: var(--accent-primary);
  margin-bottom: 12px;
}

.service-description {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* ================================
   Work / Case Studies
   ================================ */

.work-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: var(--grid-gap);
}

.work-card {
  background: var(--bg-surface);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 32px;
  transition: all var(--transition-base);
}

.work-card:hover {
  border-color: var(--accent-secondary);
  box-shadow: 0 0 40px rgba(255, 45, 122, 0.15);
}

.work-industry {
  display: inline-block;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent-secondary);
  margin-bottom: 12px;
}

.work-title {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.work-challenge {
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.work-outcome {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.work-metric {
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 700;
  color: var(--accent-primary);
}

.work-metric-label {
  font-size: 14px;
  color: var(--text-muted);
}

.work-cta {
  text-align: center;
  margin-top: 48px;
}

/* ================================
   Industries
   ================================ */

.industries {
  background: var(--bg-surface);
}

.industries-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--grid-gap);
}

@media (max-width: 768px) {
  .industries-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.industry-card {
  background: var(--bg-primary);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  transition: all var(--transition-base);
}

.industry-card:hover {
  border-color: var(--accent-primary);
  box-shadow: 0 0 30px rgba(0, 212, 255, 0.1);
}

.industry-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 12px;
  margin: 0 auto 16px;
  opacity: 0.8;
}

.industry-name {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

/* ================================
   Insights
   ================================ */

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--grid-gap);
  margin-bottom: 64px;
}

.insight-card {
  background: var(--bg-surface);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 28px;
  transition: all var(--transition-base);
}

.insight-card:hover {
  border-color: var(--accent-primary);
  transform: translateY(-2px);
}

.insight-category {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent-primary);
  margin-bottom: 12px;
  display: block;
}

.insight-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
  line-height: 1.3;
}

.insight-read-time {
  font-size: 13px;
  color: var(--text-muted);
}

.insights-newsletter {
  text-align: center;
  padding: 48px;
  background: var(--bg-surface);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.insights-newsletter p {
  font-size: 18px;
  color: var(--text-primary);
  margin-bottom: 24px;
}

.newsletter-form {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.newsletter-input {
  padding: 14px 20px;
  font-size: 16px;
  background: var(--bg-primary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: var(--text-primary);
  min-width: 280px;
}

.newsletter-input:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.newsletter-input::placeholder {
  color: var(--text-muted);
}

/* ================================
   Final CTA
   ================================ */

.final-cta {
  padding: var(--section-padding) 0;
  background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-surface) 100%);
  text-align: center;
}

.final-cta-headline {
  font-family: var(--font-display);
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.final-cta-description {
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 40px;
}

.final-cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* ================================
   Footer
   ================================ */

.footer {
  padding: 40px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}

.footer-copyright {
  font-size: 14px;
  color: var(--text-muted);
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-links a {
  font-size: 14px;
  color: var(--text-muted);
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: var(--text-primary);
}

/* ================================
   Animations
   ================================ */

[data-animate] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity var(--transition-slow), transform var(--transition-slow);
}

[data-animate].visible {
  opacity: 1;
  transform: translateY(0);
}

[data-animate-child] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity var(--transition-base), transform var(--transition-base);
}

[data-animate-child].visible {
  opacity: 1;
  transform: translateY(0);
}
```

**Step 2: Verify file created**

Run: `wc -l prototypes/midnight/styles.css`
Expected: ~400+ lines

**Step 3: Commit**

```bash
git add prototypes/midnight/styles.css
git commit -m "Add Midnight prototype CSS styles"
```

---

## Task 6: Midnight - Particle System

**Files:**
- Create: `prototypes/midnight/particles.js`

**Step 1: Create the particle system**

```javascript
/**
 * Midnight Theme - Particle Flow System
 */
function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };

  const PARTICLE_COUNT = 80;
  const CONNECTION_DISTANCE = 150;
  const COLORS = {
    primary: '#00d4ff',
    secondary: '#ff2d7a'
  };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? COLORS.primary : COLORS.secondary;
    }

    update() {
      // Mouse interaction
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.vx -= Math.cos(angle) * force * 0.02;
          this.vy -= Math.sin(angle) * force * 0.02;
        }
      }

      // Apply velocity
      this.x += this.vx;
      this.y += this.vy;

      // Damping
      this.vx *= 0.99;
      this.vy *= 0.99;

      // Add slight drift
      this.vx += (Math.random() - 0.5) * 0.01;
      this.vy += (Math.random() - 0.5) * 0.01;

      // Boundary wrapping
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();

      // Glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = this.color;
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DISTANCE) {
          const opacity = 1 - (dist / CONNECTION_DISTANCE);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    ctx.shadowBlur = 0;

    drawConnections();

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    requestAnimationFrame(animate);
  }

  // Event listeners
  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Initialize
  resize();
  createParticles();
  animate();
}
```

**Step 2: Verify file created**

Run: `wc -l prototypes/midnight/particles.js`
Expected: ~120+ lines

**Step 3: Open in browser to verify**

Run: `echo "Open prototypes/midnight/index.html in browser to verify particle system"`

**Step 4: Commit**

```bash
git add prototypes/midnight/particles.js
git commit -m "Add Midnight particle system"
```

---

## Task 7: Daybreak - HTML Structure

**Files:**
- Create: `prototypes/daybreak/index.html`

**Step 1: Create the HTML (copy from Midnight, update references)**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vibes — Daybreak Theme</title>
  <link rel="stylesheet" href="../shared/reset.css">
  <link rel="stylesheet" href="styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <!-- Navigation -->
  <nav class="nav">
    <div class="nav-container">
      <a href="#" class="nav-logo">Vibes</a>
      <div class="nav-links">
        <a href="#services">Services</a>
        <a href="#work">Work</a>
        <a href="#industries">Industries</a>
        <a href="#insights">Insights</a>
        <a href="#contact" class="nav-cta">Let's Talk</a>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <section class="hero" id="hero">
    <div class="hero-shapes" id="shapes"></div>
    <div class="hero-content" data-animate>
      <h1 class="hero-headline"></h1>
      <p class="hero-subheadline"></p>
      <p class="hero-description"></p>
      <div class="hero-ctas">
        <button class="btn btn-primary"></button>
        <button class="btn btn-secondary"></button>
      </div>
    </div>
  </section>

  <!-- Social Proof -->
  <section class="social-proof" data-animate>
    <div class="container">
      <p class="social-proof-label">Trusted by innovative teams</p>
      <div class="social-proof-logos">
        <div class="logo-placeholder"></div>
        <div class="logo-placeholder"></div>
        <div class="logo-placeholder"></div>
        <div class="logo-placeholder"></div>
        <div class="logo-placeholder"></div>
      </div>
    </div>
  </section>

  <!-- Services -->
  <section class="services" id="services">
    <div class="container">
      <h2 class="section-title" data-animate>What We Build</h2>
      <div class="services-grid" data-animate data-stagger>
      </div>
    </div>
  </section>

  <!-- Featured Work -->
  <section class="work" id="work">
    <div class="container">
      <h2 class="section-title" data-animate>Featured Work</h2>
      <div class="work-grid" data-animate data-stagger>
      </div>
      <div class="work-cta" data-animate>
        <a href="#" class="btn btn-secondary">View All Work</a>
      </div>
    </div>
  </section>

  <!-- Industries -->
  <section class="industries" id="industries">
    <div class="container">
      <h2 class="section-title" data-animate>Industries We Serve</h2>
      <div class="industries-grid" data-animate data-stagger>
      </div>
    </div>
  </section>

  <!-- Insights -->
  <section class="insights" id="insights">
    <div class="container">
      <h2 class="section-title" data-animate>Latest Insights</h2>
      <div class="insights-grid" data-animate data-stagger>
      </div>
      <div class="insights-newsletter" data-animate>
        <p>Get insights delivered to your inbox</p>
        <form class="newsletter-form">
          <input type="email" placeholder="your@email.com" class="newsletter-input">
          <button type="submit" class="btn btn-primary">Subscribe</button>
        </form>
      </div>
    </div>
  </section>

  <!-- Final CTA -->
  <section class="final-cta" id="contact">
    <div class="container" data-animate>
      <h2 class="final-cta-headline"></h2>
      <p class="final-cta-description"></p>
      <div class="final-cta-buttons">
        <button class="btn btn-primary btn-large"></button>
        <button class="btn btn-secondary"></button>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <span class="footer-copyright"></span>
        <div class="footer-links">
        </div>
      </div>
    </div>
  </footer>

  <script src="../shared/content.js"></script>
  <script src="../shared/animations.js"></script>
  <script src="shapes.js"></script>
  <script>
    AnimUtils.onReady(() => {
      // Hero
      document.querySelector('.hero-headline').textContent = CONTENT.hero.headline;
      document.querySelector('.hero-subheadline').textContent = CONTENT.hero.subheadline;
      document.querySelector('.hero-description').textContent = CONTENT.hero.description;
      document.querySelector('.hero-ctas .btn-primary').textContent = CONTENT.hero.primaryCta;
      document.querySelector('.hero-ctas .btn-secondary').textContent = CONTENT.hero.secondaryCta;

      // Services
      const servicesGrid = document.querySelector('.services-grid');
      CONTENT.services.forEach(service => {
        servicesGrid.innerHTML += `
          <div class="service-card" data-animate-child>
            <div class="service-icon" data-icon="${service.icon}"></div>
            <h3 class="service-title">${service.title}</h3>
            <p class="service-tagline">${service.tagline}</p>
            <p class="service-description">${service.description}</p>
          </div>
        `;
      });

      // Case Studies
      const workGrid = document.querySelector('.work-grid');
      CONTENT.caseStudies.forEach(study => {
        workGrid.innerHTML += `
          <div class="work-card" data-animate-child>
            <span class="work-industry">${study.industry}</span>
            <h3 class="work-title">${study.title}</h3>
            <p class="work-challenge">${study.challenge}</p>
            <div class="work-outcome">
              <span class="work-metric">${study.metrics[0]}</span>
              <span class="work-metric-label">${study.metrics[1]}</span>
            </div>
          </div>
        `;
      });

      // Industries
      const industriesGrid = document.querySelector('.industries-grid');
      CONTENT.industries.forEach(industry => {
        industriesGrid.innerHTML += `
          <div class="industry-card" data-animate-child>
            <div class="industry-icon" data-icon="${industry.icon}"></div>
            <span class="industry-name">${industry.name}</span>
          </div>
        `;
      });

      // Insights
      const insightsGrid = document.querySelector('.insights-grid');
      CONTENT.insights.forEach(insight => {
        insightsGrid.innerHTML += `
          <div class="insight-card" data-animate-child>
            <span class="insight-category">${insight.category}</span>
            <h3 class="insight-title">${insight.title}</h3>
            <span class="insight-read-time">${insight.readTime} read</span>
          </div>
        `;
      });

      // Final CTA
      document.querySelector('.final-cta-headline').textContent = CONTENT.finalCta.headline;
      document.querySelector('.final-cta-description').textContent = CONTENT.finalCta.description;
      document.querySelector('.final-cta-buttons .btn-primary').textContent = CONTENT.finalCta.primaryCta;
      document.querySelector('.final-cta-buttons .btn-secondary').textContent = CONTENT.finalCta.secondaryCta;

      // Footer
      document.querySelector('.footer-copyright').textContent = CONTENT.footer.copyright;
      const footerLinks = document.querySelector('.footer-links');
      CONTENT.footer.links.forEach(link => {
        footerLinks.innerHTML += `<a href="#">${link}</a>`;
      });

      // Initialize
      AnimUtils.initScrollAnimations();
      initShapes();
    });
  </script>
</body>
</html>
```

**Step 2: Commit**

```bash
git add prototypes/daybreak/index.html
git commit -m "Add Daybreak prototype HTML structure"
```

---

## Task 8: Daybreak - CSS Styles

**Files:**
- Create: `prototypes/daybreak/styles.css`

**Step 1: Create the stylesheet**

```css
/* ================================
   Daybreak Theme - Light & Bold
   ================================ */

:root {
  /* Colors */
  --bg-primary: #fafafa;
  --bg-surface: #ffffff;
  --bg-alt: #f5f5f5;
  --accent-primary: #ff4d4d;
  --accent-secondary: #4338ca;
  --text-primary: #111111;
  --text-secondary: #555555;
  --text-muted: #888888;

  /* Typography */
  --font-display: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;

  /* Spacing */
  --section-padding: 120px;
  --container-max: 1200px;
  --grid-gap: 32px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 400ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.12);
}

body {
  font-family: var(--font-body);
  background-color: var(--bg-primary);
  color: var(--text-secondary);
}

.container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 24px;
}

/* ================================
   Navigation
   ================================ */

.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 20px 0;
  background: rgba(250, 250, 250, 0.9);
  backdrop-filter: blur(10px);
}

.nav-container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-primary);
}

.nav-links {
  display: flex;
  gap: 32px;
  align-items: center;
}

.nav-links a {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  transition: color var(--transition-fast);
}

.nav-links a:hover {
  color: var(--text-primary);
}

.nav-cta {
  padding: 10px 20px;
  background: var(--accent-primary);
  color: white !important;
  border-radius: 8px;
  font-weight: 600;
}

.nav-cta:hover {
  background: #ff3333;
}

/* ================================
   Buttons
   ================================ */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-primary {
  background: var(--accent-primary);
  color: white;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  background: #ff3333;
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: var(--accent-secondary);
  border: 2px solid var(--accent-secondary);
}

.btn-secondary:hover {
  background: var(--accent-secondary);
  color: white;
}

.btn-large {
  padding: 18px 36px;
  font-size: 18px;
}

/* ================================
   Hero
   ================================ */

.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--bg-surface);
}

.hero-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  padding: 0 24px;
}

.hero-headline {
  font-size: clamp(44px, 8vw, 76px);
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 16px;
  letter-spacing: -0.03em;
  line-height: 1.05;
}

.hero-subheadline {
  font-size: clamp(20px, 3vw, 28px);
  color: var(--accent-primary);
  margin-bottom: 24px;
  font-weight: 700;
}

.hero-description {
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-ctas {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* ================================
   Social Proof
   ================================ */

.social-proof {
  padding: 60px 0;
  background: var(--bg-alt);
}

.social-proof-label {
  text-align: center;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 32px;
}

.social-proof-logos {
  display: flex;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;
}

.logo-placeholder {
  width: 120px;
  height: 40px;
  background: var(--bg-surface);
  border-radius: 6px;
  box-shadow: var(--shadow-sm);
}

/* ================================
   Section Styles
   ================================ */

.services,
.work,
.industries,
.insights {
  padding: var(--section-padding) 0;
}

.services {
  background: var(--bg-surface);
}

.work {
  background: var(--bg-alt);
}

.industries {
  background: var(--bg-surface);
}

.insights {
  background: var(--bg-alt);
}

.section-title {
  font-size: clamp(36px, 5vw, 52px);
  font-weight: 800;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 64px;
  letter-spacing: -0.02em;
}

/* ================================
   Services
   ================================ */

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--grid-gap);
}

.service-card {
  background: var(--bg-primary);
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.service-card:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-6px);
}

.service-icon {
  width: 52px;
  height: 52px;
  background: var(--accent-primary);
  border-radius: 12px;
  margin-bottom: 20px;
}

.service-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.service-tagline {
  font-size: 14px;
  color: var(--accent-primary);
  font-weight: 600;
  margin-bottom: 12px;
}

.service-description {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* ================================
   Work / Case Studies
   ================================ */

.work-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: var(--grid-gap);
}

.work-card {
  background: var(--bg-surface);
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.work-card:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-4px);
}

.work-industry {
  display: inline-block;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  color: var(--accent-secondary);
  background: rgba(67, 56, 202, 0.1);
  padding: 6px 12px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.work-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.work-challenge {
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.work-outcome {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding-top: 20px;
  border-top: 2px solid var(--bg-alt);
}

.work-metric {
  font-size: 40px;
  font-weight: 800;
  color: var(--accent-primary);
}

.work-metric-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
}

.work-cta {
  text-align: center;
  margin-top: 48px;
}

/* ================================
   Industries
   ================================ */

.industries-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--grid-gap);
}

@media (max-width: 768px) {
  .industries-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.industry-card {
  background: var(--bg-alt);
  border-radius: 16px;
  padding: 36px 24px;
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.industry-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
  background: var(--bg-surface);
}

.industry-icon {
  width: 60px;
  height: 60px;
  background: var(--accent-secondary);
  border-radius: 14px;
  margin: 0 auto 16px;
}

.industry-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

/* ================================
   Insights
   ================================ */

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--grid-gap);
  margin-bottom: 64px;
}

.insight-card {
  background: var(--bg-surface);
  border-radius: 16px;
  padding: 28px;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.insight-card:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-4px);
}

.insight-category {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  color: var(--accent-primary);
  margin-bottom: 12px;
  display: block;
}

.insight-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
  line-height: 1.3;
}

.insight-read-time {
  font-size: 13px;
  color: var(--text-muted);
}

.insights-newsletter {
  text-align: center;
  padding: 48px;
  background: var(--bg-surface);
  border-radius: 20px;
  box-shadow: var(--shadow-lg);
}

.insights-newsletter p {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 24px;
}

.newsletter-form {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.newsletter-input {
  padding: 14px 20px;
  font-size: 16px;
  background: var(--bg-alt);
  border: 2px solid transparent;
  border-radius: 10px;
  color: var(--text-primary);
  min-width: 280px;
  transition: border-color var(--transition-fast);
}

.newsletter-input:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.newsletter-input::placeholder {
  color: var(--text-muted);
}

/* ================================
   Final CTA
   ================================ */

.final-cta {
  padding: var(--section-padding) 0;
  background: var(--bg-surface);
  text-align: center;
}

.final-cta-headline {
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.final-cta-description {
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 40px;
}

.final-cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* ================================
   Footer
   ================================ */

.footer {
  padding: 40px 0;
  background: var(--bg-alt);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}

.footer-copyright {
  font-size: 14px;
  color: var(--text-muted);
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-links a {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: var(--text-primary);
}

/* ================================
   Animations
   ================================ */

[data-animate] {
  opacity: 0;
  transform: translateX(-30px);
  transition: opacity var(--transition-slow), transform var(--transition-slow);
}

[data-animate]:nth-child(even) {
  transform: translateX(30px);
}

[data-animate].visible {
  opacity: 1;
  transform: translateX(0);
}

[data-animate-child] {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity var(--transition-base), transform var(--transition-base);
}

[data-animate-child].visible {
  opacity: 1;
  transform: scale(1);
}
```

**Step 2: Commit**

```bash
git add prototypes/daybreak/styles.css
git commit -m "Add Daybreak prototype CSS styles"
```

---

## Task 9: Daybreak - Geometric Shapes

**Files:**
- Create: `prototypes/daybreak/shapes.js`

**Step 1: Create the geometric shapes animation**

```javascript
/**
 * Daybreak Theme - Geometric Shapes Animation
 */
function initShapes() {
  const container = document.getElementById('shapes');

  const COLORS = {
    coral: '#ff4d4d',
    indigo: '#4338ca',
    gray: '#e5e5e5',
    lightGray: '#f0f0f0'
  };

  const shapes = [];
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  class Shape {
    constructor(config) {
      this.el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      this.el.style.cssText = `
        position: absolute;
        pointer-events: none;
        transition: transform 0.3s ease-out;
      `;

      this.x = config.x;
      this.y = config.y;
      this.baseX = config.x;
      this.baseY = config.y;
      this.size = config.size;
      this.rotation = config.rotation || 0;
      this.rotationSpeed = config.rotationSpeed || 0;
      this.parallaxFactor = config.parallax || 0.02;
      this.type = config.type;
      this.color = config.color;

      this.el.setAttribute('width', this.size);
      this.el.setAttribute('height', this.size);
      this.el.setAttribute('viewBox', `0 0 ${this.size} ${this.size}`);

      this.createShape();
      container.appendChild(this.el);
    }

    createShape() {
      let shape;
      const center = this.size / 2;
      const radius = this.size / 2 - 4;

      switch (this.type) {
        case 'circle':
          shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          shape.setAttribute('cx', center);
          shape.setAttribute('cy', center);
          shape.setAttribute('r', radius);
          break;
        case 'rounded-rect':
          shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          shape.setAttribute('x', 4);
          shape.setAttribute('y', 4);
          shape.setAttribute('width', this.size - 8);
          shape.setAttribute('height', this.size - 8);
          shape.setAttribute('rx', this.size * 0.2);
          break;
        case 'pill':
          shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          shape.setAttribute('x', 4);
          shape.setAttribute('y', this.size * 0.3);
          shape.setAttribute('width', this.size - 8);
          shape.setAttribute('height', this.size * 0.4);
          shape.setAttribute('rx', this.size * 0.2);
          break;
      }

      shape.setAttribute('fill', this.color);
      this.el.appendChild(shape);
    }

    update() {
      // Parallax based on mouse
      const dx = (mouse.x - window.innerWidth / 2) * this.parallaxFactor;
      const dy = (mouse.y - window.innerHeight / 2) * this.parallaxFactor;

      this.x = this.baseX + dx;
      this.y = this.baseY + dy;

      // Rotation
      this.rotation += this.rotationSpeed;

      this.el.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
    }
  }

  // Create shapes
  const shapeConfigs = [
    { x: '15%', y: '20%', size: 200, type: 'circle', color: COLORS.coral, parallax: 0.04, rotationSpeed: 0 },
    { x: '70%', y: '15%', size: 150, type: 'rounded-rect', color: COLORS.indigo, parallax: 0.02, rotationSpeed: 0.1 },
    { x: '80%', y: '60%', size: 180, type: 'circle', color: COLORS.lightGray, parallax: 0.01, rotationSpeed: 0 },
    { x: '25%', y: '70%', size: 120, type: 'rounded-rect', color: COLORS.gray, parallax: 0.03, rotationSpeed: -0.08 },
    { x: '60%', y: '75%', size: 100, type: 'pill', color: COLORS.coral, parallax: 0.035, rotationSpeed: 0.15, rotation: 45 },
    { x: '5%', y: '50%', size: 80, type: 'circle', color: COLORS.indigo, parallax: 0.025, rotationSpeed: 0 },
    { x: '90%', y: '30%', size: 60, type: 'rounded-rect', color: COLORS.gray, parallax: 0.015, rotationSpeed: 0.2 },
  ];

  shapeConfigs.forEach(config => {
    // Convert percentage to pixels
    const x = typeof config.x === 'string' ?
      parseFloat(config.x) / 100 * window.innerWidth : config.x;
    const y = typeof config.y === 'string' ?
      parseFloat(config.y) / 100 * window.innerHeight : config.y;

    shapes.push(new Shape({ ...config, x, y, baseX: x, baseY: y }));
  });

  // Mouse tracking
  document.addEventListener('mousemove', AnimUtils.throttle((e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, 16));

  // Animation loop
  function animate() {
    shapes.forEach(shape => shape.update());
    requestAnimationFrame(animate);
  }

  animate();

  // Handle resize
  window.addEventListener('resize', () => {
    shapes.forEach((shape, i) => {
      const config = shapeConfigs[i];
      shape.baseX = typeof config.x === 'string' ?
        parseFloat(config.x) / 100 * window.innerWidth : config.x;
      shape.baseY = typeof config.y === 'string' ?
        parseFloat(config.y) / 100 * window.innerHeight : config.y;
    });
  });
}
```

**Step 2: Commit**

```bash
git add prototypes/daybreak/shapes.js
git commit -m "Add Daybreak geometric shapes animation"
```

---

## Task 10: Aurora - HTML Structure

**Files:**
- Create: `prototypes/aurora/index.html`

**Step 1: Create the HTML**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vibes — Aurora Theme</title>
  <link rel="stylesheet" href="../shared/reset.css">
  <link rel="stylesheet" href="styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <!-- Gradient Background -->
  <canvas class="gradient-bg" id="gradient"></canvas>

  <!-- Navigation -->
  <nav class="nav">
    <div class="nav-container">
      <a href="#" class="nav-logo">Vibes</a>
      <div class="nav-links">
        <a href="#services">Services</a>
        <a href="#work">Work</a>
        <a href="#industries">Industries</a>
        <a href="#insights">Insights</a>
        <a href="#contact" class="nav-cta">Let's Talk</a>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <section class="hero" id="hero">
    <div class="hero-content" data-animate>
      <h1 class="hero-headline"></h1>
      <p class="hero-subheadline"></p>
      <p class="hero-description"></p>
      <div class="hero-ctas">
        <button class="btn btn-primary"></button>
        <button class="btn btn-secondary"></button>
      </div>
    </div>
  </section>

  <!-- Social Proof -->
  <section class="social-proof" data-animate>
    <div class="container">
      <p class="social-proof-label">Trusted by innovative teams</p>
      <div class="social-proof-logos">
        <div class="logo-placeholder"></div>
        <div class="logo-placeholder"></div>
        <div class="logo-placeholder"></div>
        <div class="logo-placeholder"></div>
        <div class="logo-placeholder"></div>
      </div>
    </div>
  </section>

  <!-- Services -->
  <section class="services" id="services">
    <div class="container">
      <h2 class="section-title" data-animate>What We Build</h2>
      <div class="services-grid" data-animate data-stagger>
      </div>
    </div>
  </section>

  <!-- Featured Work -->
  <section class="work" id="work">
    <div class="container">
      <h2 class="section-title" data-animate>Featured Work</h2>
      <div class="work-grid" data-animate data-stagger>
      </div>
      <div class="work-cta" data-animate>
        <a href="#" class="btn btn-secondary">View All Work</a>
      </div>
    </div>
  </section>

  <!-- Industries -->
  <section class="industries" id="industries">
    <div class="container">
      <h2 class="section-title" data-animate>Industries We Serve</h2>
      <div class="industries-grid" data-animate data-stagger>
      </div>
    </div>
  </section>

  <!-- Insights -->
  <section class="insights" id="insights">
    <div class="container">
      <h2 class="section-title" data-animate>Latest Insights</h2>
      <div class="insights-grid" data-animate data-stagger>
      </div>
      <div class="insights-newsletter" data-animate>
        <p>Get insights delivered to your inbox</p>
        <form class="newsletter-form">
          <input type="email" placeholder="your@email.com" class="newsletter-input">
          <button type="submit" class="btn btn-primary">Subscribe</button>
        </form>
      </div>
    </div>
  </section>

  <!-- Final CTA -->
  <section class="final-cta" id="contact">
    <div class="container" data-animate>
      <h2 class="final-cta-headline"></h2>
      <p class="final-cta-description"></p>
      <div class="final-cta-buttons">
        <button class="btn btn-primary btn-large"></button>
        <button class="btn btn-secondary"></button>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <span class="footer-copyright"></span>
        <div class="footer-links">
        </div>
      </div>
    </div>
  </footer>

  <script src="../shared/content.js"></script>
  <script src="../shared/animations.js"></script>
  <script src="gradient.js"></script>
  <script>
    AnimUtils.onReady(() => {
      // Hero
      document.querySelector('.hero-headline').textContent = CONTENT.hero.headline;
      document.querySelector('.hero-subheadline').textContent = CONTENT.hero.subheadline;
      document.querySelector('.hero-description').textContent = CONTENT.hero.description;
      document.querySelector('.hero-ctas .btn-primary').textContent = CONTENT.hero.primaryCta;
      document.querySelector('.hero-ctas .btn-secondary').textContent = CONTENT.hero.secondaryCta;

      // Services
      const servicesGrid = document.querySelector('.services-grid');
      CONTENT.services.forEach(service => {
        servicesGrid.innerHTML += `
          <div class="service-card" data-animate-child>
            <div class="service-icon" data-icon="${service.icon}"></div>
            <h3 class="service-title">${service.title}</h3>
            <p class="service-tagline">${service.tagline}</p>
            <p class="service-description">${service.description}</p>
          </div>
        `;
      });

      // Case Studies
      const workGrid = document.querySelector('.work-grid');
      CONTENT.caseStudies.forEach(study => {
        workGrid.innerHTML += `
          <div class="work-card" data-animate-child>
            <span class="work-industry">${study.industry}</span>
            <h3 class="work-title">${study.title}</h3>
            <p class="work-challenge">${study.challenge}</p>
            <div class="work-outcome">
              <span class="work-metric">${study.metrics[0]}</span>
              <span class="work-metric-label">${study.metrics[1]}</span>
            </div>
          </div>
        `;
      });

      // Industries
      const industriesGrid = document.querySelector('.industries-grid');
      CONTENT.industries.forEach(industry => {
        industriesGrid.innerHTML += `
          <div class="industry-card" data-animate-child>
            <div class="industry-icon" data-icon="${industry.icon}"></div>
            <span class="industry-name">${industry.name}</span>
          </div>
        `;
      });

      // Insights
      const insightsGrid = document.querySelector('.insights-grid');
      CONTENT.insights.forEach(insight => {
        insightsGrid.innerHTML += `
          <div class="insight-card" data-animate-child>
            <span class="insight-category">${insight.category}</span>
            <h3 class="insight-title">${insight.title}</h3>
            <span class="insight-read-time">${insight.readTime} read</span>
          </div>
        `;
      });

      // Final CTA
      document.querySelector('.final-cta-headline').textContent = CONTENT.finalCta.headline;
      document.querySelector('.final-cta-description').textContent = CONTENT.finalCta.description;
      document.querySelector('.final-cta-buttons .btn-primary').textContent = CONTENT.finalCta.primaryCta;
      document.querySelector('.final-cta-buttons .btn-secondary').textContent = CONTENT.finalCta.secondaryCta;

      // Footer
      document.querySelector('.footer-copyright').textContent = CONTENT.footer.copyright;
      const footerLinks = document.querySelector('.footer-links');
      CONTENT.footer.links.forEach(link => {
        footerLinks.innerHTML += `<a href="#">${link}</a>`;
      });

      // Initialize
      AnimUtils.initScrollAnimations();
      initGradient();
    });
  </script>
</body>
</html>
```

**Step 2: Commit**

```bash
git add prototypes/aurora/index.html
git commit -m "Add Aurora prototype HTML structure"
```

---

## Task 11: Aurora - CSS Styles

**Files:**
- Create: `prototypes/aurora/styles.css`

**Step 1: Create the stylesheet**

```css
/* ================================
   Aurora Theme - Gradient-Rich
   ================================ */

:root {
  /* Colors */
  --bg-base: #1a1a2e;
  --bg-mid: #16213e;
  --bg-deep: #0f3460;
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --gradient-purple: #a855f7;
  --gradient-teal: #14b8a6;
  --gradient-gold: #f59e0b;
  --text-primary: #ffffff;
  --text-secondary: #d1d5db;
  --text-muted: #9ca3af;

  /* Typography */
  --font-display: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;

  /* Spacing */
  --section-padding: 120px;
  --container-max: 1200px;
  --grid-gap: 32px;

  /* Transitions */
  --transition-fast: 200ms ease;
  --transition-base: 400ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 700ms cubic-bezier(0.4, 0, 0.2, 1);
}

body {
  font-family: var(--font-body);
  background: linear-gradient(180deg, var(--bg-base) 0%, var(--bg-mid) 50%, var(--bg-deep) 100%);
  color: var(--text-secondary);
  min-height: 100vh;
}

.gradient-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 24px;
}

/* ================================
   Navigation
   ================================ */

.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 20px 0;
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(20px);
}

.nav-container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--gradient-purple), var(--gradient-teal));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 32px;
  align-items: center;
}

.nav-links a {
  font-size: 14px;
  color: var(--text-secondary);
  transition: color var(--transition-fast);
}

.nav-links a:hover {
  color: var(--text-primary);
}

.nav-cta {
  padding: 10px 20px;
  background: linear-gradient(135deg, var(--gradient-purple), var(--gradient-teal));
  color: white !important;
  border-radius: 8px;
  font-weight: 500;
}

.nav-cta:hover {
  opacity: 0.9;
}

/* ================================
   Buttons
   ================================ */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-primary {
  background: linear-gradient(135deg, var(--gradient-purple), var(--gradient-teal));
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(168, 85, 247, 0.3);
}

.btn-secondary {
  background: var(--glass-bg);
  color: var(--text-primary);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.btn-large {
  padding: 18px 36px;
  font-size: 18px;
}

/* ================================
   Hero
   ================================ */

.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  padding: 0 24px;
}

.hero-headline {
  font-size: clamp(40px, 8vw, 72px);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.hero-subheadline {
  font-size: clamp(20px, 3vw, 28px);
  background: linear-gradient(135deg, var(--gradient-purple), var(--gradient-teal));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
  font-weight: 600;
}

.hero-description {
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-ctas {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* ================================
   Social Proof
   ================================ */

.social-proof {
  position: relative;
  z-index: 1;
  padding: 60px 0;
  border-top: 1px solid var(--glass-border);
  border-bottom: 1px solid var(--glass-border);
}

.social-proof-label {
  text-align: center;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: 32px;
}

.social-proof-logos {
  display: flex;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;
}

.logo-placeholder {
  width: 120px;
  height: 40px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

/* ================================
   Section Styles
   ================================ */

.services,
.work,
.industries,
.insights {
  position: relative;
  z-index: 1;
  padding: var(--section-padding) 0;
}

.section-title {
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 64px;
}

/* ================================
   Glass Card Base
   ================================ */

.glass-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  transition: all var(--transition-base);
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
}

/* ================================
   Services
   ================================ */

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--grid-gap);
}

.service-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 32px;
  backdrop-filter: blur(20px);
  transition: all var(--transition-base);
}

.service-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
}

.service-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--gradient-purple), var(--gradient-teal));
  border-radius: 12px;
  margin-bottom: 20px;
}

.service-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.service-tagline {
  font-size: 14px;
  background: linear-gradient(135deg, var(--gradient-purple), var(--gradient-teal));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}

.service-description {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* ================================
   Work / Case Studies
   ================================ */

.work-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: var(--grid-gap);
}

.work-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 32px;
  backdrop-filter: blur(20px);
  transition: all var(--transition-base);
}

.work-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
}

.work-industry {
  display: inline-block;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: linear-gradient(135deg, var(--gradient-purple), var(--gradient-teal));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}

.work-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.work-challenge {
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.work-outcome {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding-top: 20px;
  border-top: 1px solid var(--glass-border);
}

.work-metric {
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--gradient-teal), var(--gradient-gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.work-metric-label {
  font-size: 14px;
  color: var(--text-muted);
}

.work-cta {
  text-align: center;
  margin-top: 48px;
}

/* ================================
   Industries
   ================================ */

.industries-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--grid-gap);
}

@media (max-width: 768px) {
  .industries-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.industry-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  backdrop-filter: blur(20px);
  transition: all var(--transition-base);
}

.industry-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
}

.industry-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--gradient-purple), var(--gradient-gold));
  border-radius: 14px;
  margin: 0 auto 16px;
}

.industry-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

/* ================================
   Insights
   ================================ */

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--grid-gap);
  margin-bottom: 64px;
}

.insight-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 28px;
  backdrop-filter: blur(20px);
  transition: all var(--transition-base);
}

.insight-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.insight-category {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: linear-gradient(135deg, var(--gradient-purple), var(--gradient-teal));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  display: block;
}

.insight-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
  line-height: 1.3;
}

.insight-read-time {
  font-size: 13px;
  color: var(--text-muted);
}

.insights-newsletter {
  text-align: center;
  padding: 48px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  backdrop-filter: blur(20px);
}

.insights-newsletter p {
  font-size: 18px;
  color: var(--text-primary);
  margin-bottom: 24px;
}

.newsletter-form {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.newsletter-input {
  padding: 14px 20px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  color: var(--text-primary);
  min-width: 280px;
  backdrop-filter: blur(10px);
}

.newsletter-input:focus {
  outline: none;
  border-color: var(--gradient-purple);
}

.newsletter-input::placeholder {
  color: var(--text-muted);
}

/* ================================
   Final CTA
   ================================ */

.final-cta {
  position: relative;
  z-index: 1;
  padding: var(--section-padding) 0;
  text-align: center;
}

.final-cta-headline {
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.final-cta-description {
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 40px;
}

.final-cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* ================================
   Footer
   ================================ */

.footer {
  position: relative;
  z-index: 1;
  padding: 40px 0;
  border-top: 1px solid var(--glass-border);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}

.footer-copyright {
  font-size: 14px;
  color: var(--text-muted);
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-links a {
  font-size: 14px;
  color: var(--text-muted);
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: var(--text-primary);
}

/* ================================
   Animations
   ================================ */

[data-animate] {
  opacity: 0;
  filter: blur(10px);
  transform: translateY(20px);
  transition: opacity var(--transition-slow), filter var(--transition-slow), transform var(--transition-slow);
}

[data-animate].visible {
  opacity: 1;
  filter: blur(0);
  transform: translateY(0);
}

[data-animate-child] {
  opacity: 0;
  filter: blur(5px);
  transform: translateY(15px);
  transition: opacity var(--transition-base), filter var(--transition-base), transform var(--transition-base);
}

[data-animate-child].visible {
  opacity: 1;
  filter: blur(0);
  transform: translateY(0);
}
```

**Step 2: Commit**

```bash
git add prototypes/aurora/styles.css
git commit -m "Add Aurora prototype CSS styles"
```

---

## Task 12: Aurora - Mesh Gradient

**Files:**
- Create: `prototypes/aurora/gradient.js`

**Step 1: Create the mesh gradient animation**

```javascript
/**
 * Aurora Theme - Generative Mesh Gradient
 */
function initGradient() {
  const canvas = document.getElementById('gradient');
  const ctx = canvas.getContext('2d');

  let width, height;
  let time = 0;
  let mouse = { x: 0.5, y: 0.5 };

  const COLORS = [
    { r: 168, g: 85, b: 247 },   // Purple
    { r: 20, g: 184, b: 166 },   // Teal
    { r: 245, g: 158, b: 11 },   // Gold
    { r: 99, g: 102, b: 241 },   // Indigo
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  // Simplex noise approximation
  function noise(x, y, t) {
    const sin1 = Math.sin(x * 0.01 + t);
    const sin2 = Math.sin(y * 0.01 + t * 0.8);
    const sin3 = Math.sin((x + y) * 0.01 + t * 0.5);
    const sin4 = Math.sin(Math.sqrt(x * x + y * y) * 0.01 - t * 0.3);
    return (sin1 + sin2 + sin3 + sin4) / 4;
  }

  function getColor(x, y, t) {
    // Normalized coordinates
    const nx = x / width;
    const ny = y / height;

    // Mouse influence
    const mdx = nx - mouse.x;
    const mdy = ny - mouse.y;
    const mouseDist = Math.sqrt(mdx * mdx + mdy * mdy);
    const mouseInfluence = Math.max(0, 1 - mouseDist * 2);

    // Noise values for color mixing
    const n1 = noise(x, y, t) * 0.5 + 0.5;
    const n2 = noise(x + 1000, y + 1000, t * 1.3) * 0.5 + 0.5;
    const n3 = noise(x - 500, y + 500, t * 0.7) * 0.5 + 0.5;

    // Mix colors based on noise and position
    let r = 0, g = 0, b = 0;

    // Base gradient (top to bottom)
    const baseColor = {
      r: 26 + (ny * 15),
      g: 26 + (ny * 25),
      b: 46 + (ny * 50)
    };

    // Add color blobs
    const colorMix = [
      { color: COLORS[0], factor: n1 * (1 - ny * 0.5) },
      { color: COLORS[1], factor: n2 * mouseInfluence * 2 },
      { color: COLORS[2], factor: n3 * ny * 0.5 },
      { color: COLORS[3], factor: (1 - n1) * (1 - ny) * 0.3 }
    ];

    r = baseColor.r;
    g = baseColor.g;
    b = baseColor.b;

    colorMix.forEach(mix => {
      const f = mix.factor * 0.4;
      r += (mix.color.r - r) * f;
      g += (mix.color.g - g) * f;
      b += (mix.color.b - b) * f;
    });

    return { r: Math.floor(r), g: Math.floor(g), b: Math.floor(b) };
  }

  function draw() {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    // Lower resolution for performance
    const scale = 4;
    const scaledWidth = Math.ceil(width / scale);
    const scaledHeight = Math.ceil(height / scale);

    // Create low-res version
    const lowRes = new Uint8ClampedArray(scaledWidth * scaledHeight * 4);

    for (let y = 0; y < scaledHeight; y++) {
      for (let x = 0; x < scaledWidth; x++) {
        const color = getColor(x * scale, y * scale, time);
        const i = (y * scaledWidth + x) * 4;
        lowRes[i] = color.r;
        lowRes[i + 1] = color.g;
        lowRes[i + 2] = color.b;
        lowRes[i + 3] = 255;
      }
    }

    // Upscale with bilinear interpolation
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const sx = x / scale;
        const sy = y / scale;
        const x0 = Math.floor(sx);
        const y0 = Math.floor(sy);
        const x1 = Math.min(x0 + 1, scaledWidth - 1);
        const y1 = Math.min(y0 + 1, scaledHeight - 1);
        const fx = sx - x0;
        const fy = sy - y0;

        const i00 = (y0 * scaledWidth + x0) * 4;
        const i10 = (y0 * scaledWidth + x1) * 4;
        const i01 = (y1 * scaledWidth + x0) * 4;
        const i11 = (y1 * scaledWidth + x1) * 4;

        const i = (y * width + x) * 4;

        for (let c = 0; c < 3; c++) {
          const top = lowRes[i00 + c] * (1 - fx) + lowRes[i10 + c] * fx;
          const bottom = lowRes[i01 + c] * (1 - fx) + lowRes[i11 + c] * fx;
          data[i + c] = top * (1 - fy) + bottom * fy;
        }
        data[i + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Add subtle vignette
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) * 0.7
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.4)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  function animate() {
    time += 0.005;
    draw();
    requestAnimationFrame(animate);
  }

  // Event listeners
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', AnimUtils.throttle((e) => {
    mouse.x = e.clientX / width;
    mouse.y = e.clientY / height;
  }, 50));

  // Initialize
  resize();
  animate();
}
```

**Step 2: Commit**

```bash
git add prototypes/aurora/gradient.js
git commit -m "Add Aurora mesh gradient animation"
```

---

## Task 13: Verify All Prototypes

**Step 1: List all files created**

Run: `find prototypes -type f | sort`

Expected output:
```
prototypes/aurora/README.md
prototypes/aurora/gradient.js
prototypes/aurora/index.html
prototypes/aurora/styles.css
prototypes/daybreak/README.md
prototypes/daybreak/index.html
prototypes/daybreak/shapes.js
prototypes/daybreak/styles.css
prototypes/midnight/README.md
prototypes/midnight/index.html
prototypes/midnight/particles.js
prototypes/midnight/styles.css
prototypes/shared/README.md
prototypes/shared/animations.js
prototypes/shared/content.js
prototypes/shared/reset.css
```

**Step 2: Open each prototype in browser**

```
echo "Open in browser to verify:"
echo "  prototypes/midnight/index.html"
echo "  prototypes/daybreak/index.html"
echo "  prototypes/aurora/index.html"
```

**Step 3: Final commit**

```bash
git add .
git commit -m "Complete all three homepage prototypes"
```

---

## Success Criteria

- [ ] Shared utilities (reset.css, content.js, animations.js) created
- [ ] Midnight prototype with particle system
- [ ] Daybreak prototype with geometric shapes
- [ ] Aurora prototype with mesh gradient
- [ ] All prototypes render correctly in browser
- [ ] Scroll animations work on all sections
- [ ] Hero visuals respond to mouse movement
- [ ] Hover states on all interactive elements
