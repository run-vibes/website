# Prototype Refinements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build 6 new prototype variations — 2 light/dark variants and 4 alternative Daybreak animations.

**Architecture:** Each variant reuses shared utilities (reset.css, content.js, animations.js). Only CSS colors and hero animation JS differ. HTML structure is copied from base prototype with minor adjustments.

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript, Canvas API, SVG, CSS 3D Transforms

---

## Task 1: Midnight Light - HTML

**Files:**
- Create: `prototypes/midnight-light/index.html`

**Step 1: Copy Midnight HTML and adjust**

Copy `prototypes/midnight/index.html` to `prototypes/midnight-light/index.html` with these changes:
- Title: "Vibes — Midnight Light Theme"
- Keep all structure identical

```bash
cp prototypes/midnight/index.html prototypes/midnight-light/index.html
```

Then update the title tag.

**Step 2: Commit**

```bash
git add prototypes/midnight-light/index.html
git commit -m "Add Midnight Light HTML structure"
```

---

## Task 2: Midnight Light - CSS

**Files:**
- Create: `prototypes/midnight-light/styles.css`

**Step 1: Create light theme CSS**

Copy Midnight's CSS and update the color variables in `:root`:

```css
:root {
  /* Light background */
  --bg-primary: #f8f9fc;
  --bg-surface: #ffffff;
  --bg-elevated: #f0f2f5;

  /* Deeper accents for light bg contrast */
  --accent-primary: #00b8e6;
  --accent-secondary: #e6006a;

  /* Dark text */
  --text-primary: #0a0a14;
  --text-secondary: #5a5a6a;
  --text-muted: #8a8a9a;

  /* Rest unchanged */
}
```

**Additional CSS changes:**
- `.nav` background: `rgba(248, 249, 252, 0.9)` with backdrop-filter
- `.btn-primary:hover` box-shadow: use rgba with lower opacity (no bright glow)
- `.service-card:hover`, `.work-card:hover`: use subtle shadow instead of glow
- All `box-shadow` using accent colors should use lower opacity

**Step 2: Commit**

```bash
git add prototypes/midnight-light/styles.css
git commit -m "Add Midnight Light CSS styles"
```

---

## Task 3: Midnight Light - Particles

**Files:**
- Create: `prototypes/midnight-light/particles.js`

**Step 1: Copy and adjust particle system**

Copy `prototypes/midnight/particles.js` with these changes:

```javascript
const COLORS = {
  primary: '#00b8e6',  // Deeper cyan
  secondary: '#e6006a' // Deeper magenta
};
```

In the `Particle.draw()` method:
- Reduce `shadowBlur` from 15 to 8

In `drawConnections()`:
- Change line color to `rgba(0, 184, 230, ${opacity * 0.4})` (darker for visibility)

**Step 2: Commit**

```bash
git add prototypes/midnight-light/particles.js
git commit -m "Add Midnight Light particle system"
```

---

## Task 4: Daybreak Dark - HTML

**Files:**
- Create: `prototypes/daybreak-dark/index.html`

**Step 1: Copy Daybreak HTML and adjust**

```bash
cp prototypes/daybreak/index.html prototypes/daybreak-dark/index.html
```

Update title to "Vibes — Daybreak Dark Theme"

**Step 2: Commit**

```bash
git add prototypes/daybreak-dark/index.html
git commit -m "Add Daybreak Dark HTML structure"
```

---

## Task 5: Daybreak Dark - CSS

**Files:**
- Create: `prototypes/daybreak-dark/styles.css`

**Step 1: Create dark theme CSS**

Copy Daybreak's CSS and update `:root`:

```css
:root {
  /* Dark backgrounds */
  --bg-primary: #1a1a24;
  --bg-surface: #252530;
  --bg-alt: #1f1f28;

  /* Brighter accents for dark bg */
  --accent-primary: #ff6b6b;
  --accent-secondary: #6366f1;

  /* Light text */
  --text-primary: #ffffff;
  --text-secondary: #a0a0a8;
  --text-muted: #707078;

  /* Shadows become glows */
  --shadow-sm: 0 0 10px rgba(255, 107, 107, 0.1);
  --shadow-md: 0 0 20px rgba(255, 107, 107, 0.15);
  --shadow-lg: 0 0 30px rgba(255, 107, 107, 0.2);
  --shadow-xl: 0 0 40px rgba(255, 107, 107, 0.25);
}
```

**Additional changes:**
- `.nav` background: `rgba(26, 26, 36, 0.9)`
- Card hover: add subtle border glow instead of shadow expansion
- Remove alternating section backgrounds (use single dark tone)

**Step 2: Commit**

```bash
git add prototypes/daybreak-dark/styles.css
git commit -m "Add Daybreak Dark CSS styles"
```

---

## Task 6: Daybreak Dark - Shapes

**Files:**
- Create: `prototypes/daybreak-dark/shapes.js`

**Step 1: Copy and adjust shapes**

Copy `prototypes/daybreak/shapes.js` with these changes:

```javascript
const COLORS = {
  coral: '#ff6b6b',      // Brighter
  indigo: '#6366f1',     // Brighter
  gray: '#3a3a4a',       // Dark gray
  lightGray: '#4a4a5a'   // Slightly lighter dark gray
};
```

Add glow effect to shapes by updating the Shape class `createShape()`:
- Add `filter: drop-shadow(0 0 10px ${this.color}40)` to shape elements

**Step 2: Commit**

```bash
git add prototypes/daybreak-dark/shapes.js
git commit -m "Add Daybreak Dark geometric shapes"
```

---

## Task 7: Daybreak Blobs - HTML

**Files:**
- Create: `prototypes/daybreak-blobs/index.html`

**Step 1: Copy Daybreak HTML**

```bash
cp prototypes/daybreak/index.html prototypes/daybreak-blobs/index.html
```

Update:
- Title: "Vibes — Daybreak Blobs Theme"
- Change `<div class="hero-shapes" id="shapes">` to `<canvas class="hero-canvas" id="blobs"></canvas>`
- Change script from `shapes.js` to `blobs.js`
- Change `initShapes()` to `initBlobs()`

**Step 2: Commit**

```bash
git add prototypes/daybreak-blobs/index.html
git commit -m "Add Daybreak Blobs HTML structure"
```

---

## Task 8: Daybreak Blobs - CSS

**Files:**
- Create: `prototypes/daybreak-blobs/styles.css`

**Step 1: Copy Daybreak CSS**

```bash
cp prototypes/daybreak/styles.css prototypes/daybreak-blobs/styles.css
```

Update `.hero-shapes` to `.hero-canvas`:

```css
.hero-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
```

**Step 2: Commit**

```bash
git add prototypes/daybreak-blobs/styles.css
git commit -m "Add Daybreak Blobs CSS styles"
```

---

## Task 9: Daybreak Blobs - Animation

**Files:**
- Create: `prototypes/daybreak-blobs/blobs.js`

**Step 1: Create morphing blob animation**

```javascript
/**
 * Daybreak Blobs - Organic Morphing Shapes
 */
function initBlobs() {
  const canvas = document.getElementById('blobs');
  const ctx = canvas.getContext('2d');

  let width, height;
  let time = 0;
  let mouse = { x: null, y: null };

  const COLORS = [
    'rgba(255, 77, 77, 0.6)',   // Coral
    'rgba(67, 56, 202, 0.5)',   // Indigo
    'rgba(255, 160, 160, 0.4)', // Soft pink
    'rgba(160, 212, 255, 0.4)'  // Light blue
  ];

  class Blob {
    constructor(x, y, radius, color, speed) {
      this.baseX = x;
      this.baseY = y;
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.speed = speed;
      this.offset = Math.random() * Math.PI * 2;
      this.points = [];
      this.numPoints = 6;

      // Initialize control points
      for (let i = 0; i < this.numPoints; i++) {
        this.points.push({
          angle: (i / this.numPoints) * Math.PI * 2,
          radius: radius,
          speed: 0.5 + Math.random() * 0.5
        });
      }
    }

    update(t) {
      // Organic movement
      this.x = this.baseX + Math.sin(t * this.speed + this.offset) * 30;
      this.y = this.baseY + Math.cos(t * this.speed * 0.8 + this.offset) * 20;

      // Mouse attraction
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200 * 0.3;
          this.x += dx * force * 0.02;
          this.y += dy * force * 0.02;
        }
      }

      // Morph points
      this.points.forEach((point, i) => {
        const noise = Math.sin(t * point.speed + i) * 0.2;
        point.radius = this.radius * (1 + noise);
      });
    }

    draw() {
      ctx.beginPath();

      const points = this.points.map((p, i) => ({
        x: this.x + Math.cos(p.angle) * p.radius,
        y: this.y + Math.sin(p.angle) * p.radius
      }));

      // Draw smooth curve through points
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 0; i < points.length; i++) {
        const curr = points[i];
        const next = points[(i + 1) % points.length];
        const midX = (curr.x + next.x) / 2;
        const midY = (curr.y + next.y) / 2;
        ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
      }

      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  let blobs = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createBlobs();
  }

  function createBlobs() {
    blobs = [
      new Blob(width * 0.2, height * 0.3, 180, COLORS[0], 0.3),
      new Blob(width * 0.7, height * 0.25, 150, COLORS[1], 0.4),
      new Blob(width * 0.5, height * 0.6, 200, COLORS[2], 0.25),
      new Blob(width * 0.8, height * 0.7, 120, COLORS[3], 0.35),
      new Blob(width * 0.15, height * 0.7, 100, COLORS[1], 0.45)
    ];
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    time += 0.01;

    blobs.forEach(blob => {
      blob.update(time);
      blob.draw();
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  resize();
  animate();
}
```

**Step 2: Commit**

```bash
git add prototypes/daybreak-blobs/blobs.js
git commit -m "Add Daybreak Blobs morphing animation"
```

---

## Task 10: Daybreak 3D - HTML

**Files:**
- Create: `prototypes/daybreak-3d/index.html`

**Step 1: Copy and adjust**

```bash
cp prototypes/daybreak/index.html prototypes/daybreak-3d/index.html
```

Update:
- Title: "Vibes — Daybreak 3D Theme"
- Keep `<div class="hero-shapes" id="shapes">` (3D objects will be divs)
- Change script to `objects3d.js`
- Change init to `init3DObjects()`

**Step 2: Commit**

```bash
git add prototypes/daybreak-3d/index.html
git commit -m "Add Daybreak 3D HTML structure"
```

---

## Task 11: Daybreak 3D - CSS

**Files:**
- Create: `prototypes/daybreak-3d/styles.css`

**Step 1: Copy Daybreak CSS and add 3D styles**

Add these 3D-specific styles:

```css
.hero-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  perspective: 1000px;
  overflow: hidden;
}

.object-3d {
  position: absolute;
  transform-style: preserve-3d;
  pointer-events: none;
}

.object-3d .face {
  position: absolute;
  backface-visibility: hidden;
}

.cube {
  width: 80px;
  height: 80px;
}

.cube .face {
  width: 80px;
  height: 80px;
  border: 1px solid rgba(255, 77, 77, 0.3);
  background: rgba(255, 77, 77, 0.1);
}

.cube .front  { transform: translateZ(40px); }
.cube .back   { transform: rotateY(180deg) translateZ(40px); }
.cube .right  { transform: rotateY(90deg) translateZ(40px); }
.cube .left   { transform: rotateY(-90deg) translateZ(40px); }
.cube .top    { transform: rotateX(90deg) translateZ(40px); }
.cube .bottom { transform: rotateX(-90deg) translateZ(40px); }
```

**Step 2: Commit**

```bash
git add prototypes/daybreak-3d/styles.css
git commit -m "Add Daybreak 3D CSS styles"
```

---

## Task 12: Daybreak 3D - Animation

**Files:**
- Create: `prototypes/daybreak-3d/objects3d.js`

**Step 1: Create 3D objects animation**

```javascript
/**
 * Daybreak 3D - CSS 3D Floating Objects
 */
function init3DObjects() {
  const container = document.getElementById('shapes');
  let mouse = { x: 0.5, y: 0.5 };
  let time = 0;

  const objects = [];

  class Object3D {
    constructor(config) {
      this.el = document.createElement('div');
      this.el.className = `object-3d ${config.type}`;

      this.x = config.x;
      this.y = config.y;
      this.rotX = config.rotX || 0;
      this.rotY = config.rotY || 0;
      this.rotZ = config.rotZ || 0;
      this.speedX = config.speedX || 0;
      this.speedY = config.speedY || 0.5;
      this.speedZ = config.speedZ || 0;
      this.bobSpeed = config.bobSpeed || 1;
      this.bobAmount = config.bobAmount || 10;
      this.baseY = config.y;

      this.createFaces(config.type, config.color);
      this.el.style.left = `${this.x}%`;
      this.el.style.top = `${this.y}%`;

      container.appendChild(this.el);
    }

    createFaces(type, color) {
      if (type === 'cube') {
        const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
        faces.forEach(face => {
          const div = document.createElement('div');
          div.className = `face ${face}`;
          div.style.background = `rgba(${color}, 0.15)`;
          div.style.borderColor = `rgba(${color}, 0.4)`;
          this.el.appendChild(div);
        });
      }
    }

    update(t) {
      this.rotX += this.speedX;
      this.rotY += this.speedY;
      this.rotZ += this.speedZ;

      // Floating bob
      const bob = Math.sin(t * this.bobSpeed) * this.bobAmount;

      // Mouse tilt influence
      const tiltX = (mouse.y - 0.5) * 20;
      const tiltY = (mouse.x - 0.5) * 20;

      this.el.style.transform = `
        translateY(${bob}px)
        rotateX(${this.rotX + tiltX}deg)
        rotateY(${this.rotY + tiltY}deg)
        rotateZ(${this.rotZ}deg)
      `;
    }
  }

  // Create objects
  const configs = [
    { type: 'cube', x: 15, y: 25, speedY: 0.3, bobSpeed: 0.8, color: '255, 77, 77' },
    { type: 'cube', x: 75, y: 20, speedY: -0.4, speedX: 0.2, bobSpeed: 1.2, color: '67, 56, 202' },
    { type: 'cube', x: 60, y: 70, speedY: 0.5, bobSpeed: 0.6, color: '200, 200, 200' },
    { type: 'cube', x: 25, y: 65, speedY: -0.3, speedZ: 0.1, bobSpeed: 1, color: '255, 77, 77' },
    { type: 'cube', x: 85, y: 55, speedY: 0.4, bobSpeed: 0.9, color: '67, 56, 202' }
  ];

  configs.forEach(config => {
    objects.push(new Object3D(config));
  });

  // Mouse tracking
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = e.clientY / window.innerHeight;
  });

  // Animation loop
  function animate() {
    time += 0.016;
    objects.forEach(obj => obj.update(time));
    requestAnimationFrame(animate);
  }

  animate();
}
```

**Step 2: Commit**

```bash
git add prototypes/daybreak-3d/objects3d.js
git commit -m "Add Daybreak 3D floating objects animation"
```

---

## Task 13: Daybreak Lines - HTML

**Files:**
- Create: `prototypes/daybreak-lines/index.html`

**Step 1: Copy and adjust**

```bash
cp prototypes/daybreak/index.html prototypes/daybreak-lines/index.html
```

Update:
- Title: "Vibes — Daybreak Lines Theme"
- Change `<div class="hero-shapes" id="shapes">` to `<svg class="hero-lines" id="lines"></svg>`
- Change script to `lines.js`
- Change init to `initLines()`

**Step 2: Commit**

```bash
git add prototypes/daybreak-lines/index.html
git commit -m "Add Daybreak Lines HTML structure"
```

---

## Task 14: Daybreak Lines - CSS

**Files:**
- Create: `prototypes/daybreak-lines/styles.css`

**Step 1: Copy Daybreak CSS and add line styles**

Replace `.hero-shapes` with:

```css
.hero-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: visible;
}

.hero-lines path {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.hero-lines .line-primary {
  stroke: var(--accent-primary);
  stroke-width: 2;
}

.hero-lines .line-secondary {
  stroke: var(--accent-secondary);
  stroke-width: 1.5;
}

.hero-lines .line-gray {
  stroke: #d0d0d0;
  stroke-width: 1;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

.hero-lines path.animate {
  animation: draw 2s ease-out forwards;
}
```

**Step 2: Commit**

```bash
git add prototypes/daybreak-lines/styles.css
git commit -m "Add Daybreak Lines CSS styles"
```

---

## Task 15: Daybreak Lines - Animation

**Files:**
- Create: `prototypes/daybreak-lines/lines.js`

**Step 1: Create line drawing animation**

```javascript
/**
 * Daybreak Lines - Animated SVG Path Drawing
 */
function initLines() {
  const svg = document.getElementById('lines');
  const ns = 'http://www.w3.org/2000/svg';

  let width = window.innerWidth;
  let height = window.innerHeight;
  let mouse = { x: width / 2, y: height / 2 };

  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

  const lines = [];

  class Line {
    constructor(points, className, delay) {
      this.el = document.createElementNS(ns, 'path');
      this.el.setAttribute('class', className);
      this.points = points;
      this.delay = delay;

      const d = this.generatePath();
      this.el.setAttribute('d', d);

      const length = this.el.getTotalLength();
      this.el.style.strokeDasharray = length;
      this.el.style.strokeDashoffset = length;

      svg.appendChild(this.el);

      setTimeout(() => {
        this.el.classList.add('animate');
      }, delay);
    }

    generatePath() {
      let d = `M ${this.points[0].x} ${this.points[0].y}`;

      for (let i = 1; i < this.points.length; i++) {
        const prev = this.points[i - 1];
        const curr = this.points[i];

        // Smooth curve
        const midX = (prev.x + curr.x) / 2;
        const midY = (prev.y + curr.y) / 2;
        d += ` Q ${prev.x} ${prev.y} ${midX} ${midY}`;
      }

      const last = this.points[this.points.length - 1];
      d += ` L ${last.x} ${last.y}`;

      return d;
    }
  }

  function createLines() {
    // Clear existing
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    lines.length = 0;

    // Create architectural line patterns
    const patterns = [
      // Horizontal flows
      {
        points: [
          { x: 0, y: height * 0.3 },
          { x: width * 0.3, y: height * 0.35 },
          { x: width * 0.6, y: height * 0.25 },
          { x: width, y: height * 0.3 }
        ],
        className: 'line-gray',
        delay: 0
      },
      {
        points: [
          { x: 0, y: height * 0.6 },
          { x: width * 0.4, y: height * 0.55 },
          { x: width * 0.7, y: height * 0.65 },
          { x: width, y: height * 0.6 }
        ],
        className: 'line-gray',
        delay: 200
      },
      // Accent lines
      {
        points: [
          { x: width * 0.2, y: 0 },
          { x: width * 0.25, y: height * 0.4 },
          { x: width * 0.15, y: height * 0.7 },
          { x: width * 0.2, y: height }
        ],
        className: 'line-primary',
        delay: 400
      },
      {
        points: [
          { x: width * 0.7, y: 0 },
          { x: width * 0.75, y: height * 0.3 },
          { x: width * 0.65, y: height * 0.6 },
          { x: width * 0.7, y: height }
        ],
        className: 'line-secondary',
        delay: 600
      },
      // Connecting diagonals
      {
        points: [
          { x: width * 0.1, y: height * 0.2 },
          { x: width * 0.5, y: height * 0.5 },
          { x: width * 0.9, y: height * 0.4 }
        ],
        className: 'line-gray',
        delay: 800
      }
    ];

    patterns.forEach(p => {
      lines.push(new Line(p.points, p.className, p.delay));
    });
  }

  // Mouse ripple effect (subtle line pulse)
  document.addEventListener('mousemove', AnimUtils.throttle((e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, 50));

  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    createLines();
  });

  createLines();
}
```

**Step 2: Commit**

```bash
git add prototypes/daybreak-lines/lines.js
git commit -m "Add Daybreak Lines drawing animation"
```

---

## Task 16: Daybreak Orbs - HTML

**Files:**
- Create: `prototypes/daybreak-orbs/index.html`

**Step 1: Copy and adjust**

```bash
cp prototypes/daybreak/index.html prototypes/daybreak-orbs/index.html
```

Update:
- Title: "Vibes — Daybreak Orbs Theme"
- Change `<div class="hero-shapes" id="shapes">` to `<canvas class="hero-canvas" id="orbs"></canvas>`
- Change script to `orbs.js`
- Change init to `initOrbs()`

**Step 2: Commit**

```bash
git add prototypes/daybreak-orbs/index.html
git commit -m "Add Daybreak Orbs HTML structure"
```

---

## Task 17: Daybreak Orbs - CSS

**Files:**
- Create: `prototypes/daybreak-orbs/styles.css`

**Step 1: Copy Daybreak CSS**

Same as Blobs - update `.hero-shapes` to `.hero-canvas`:

```css
.hero-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
```

**Step 2: Commit**

```bash
git add prototypes/daybreak-orbs/styles.css
git commit -m "Add Daybreak Orbs CSS styles"
```

---

## Task 18: Daybreak Orbs - Animation

**Files:**
- Create: `prototypes/daybreak-orbs/orbs.js`

**Step 1: Create gradient orbs animation**

```javascript
/**
 * Daybreak Orbs - Floating Gradient Circles
 */
function initOrbs() {
  const canvas = document.getElementById('orbs');
  const ctx = canvas.getContext('2d');

  let width, height;
  let time = 0;
  let mouse = { x: null, y: null };

  const COLORS = [
    { r: 255, g: 77, b: 77, a: 0.4 },    // Coral
    { r: 67, g: 56, b: 202, a: 0.35 },   // Indigo
    { r: 255, g: 180, b: 180, a: 0.3 },  // Soft pink
    { r: 200, g: 180, b: 255, a: 0.3 },  // Lavender
    { r: 255, g: 200, b: 150, a: 0.25 }  // Peach
  ];

  class Orb {
    constructor(x, y, radius, color, speed) {
      this.baseX = x;
      this.baseY = y;
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.baseRadius = radius;
      this.color = color;
      this.speed = speed;
      this.offset = Math.random() * Math.PI * 2;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
    }

    update(t) {
      // Drift movement
      this.x += this.vx;
      this.y += this.vy;

      // Gentle oscillation
      this.x += Math.sin(t * this.speed + this.offset) * 0.5;
      this.y += Math.cos(t * this.speed * 0.8 + this.offset) * 0.3;

      // Breathing effect
      this.radius = this.baseRadius * (1 + Math.sin(t * this.speed * 2) * 0.1);

      // Mouse attraction
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250) {
          const force = (250 - dist) / 250 * 0.02;
          this.x += dx * force;
          this.y += dy * force;
        }
      }

      // Boundary wrapping
      if (this.x < -this.radius) this.x = width + this.radius;
      if (this.x > width + this.radius) this.x = -this.radius;
      if (this.y < -this.radius) this.y = height + this.radius;
      if (this.y > height + this.radius) this.y = -this.radius;
    }

    draw() {
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.radius
      );

      const { r, g, b, a } = this.color;
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a})`);
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${a * 0.5})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  let orbs = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createOrbs();
  }

  function createOrbs() {
    orbs = [];
    const count = 7;

    for (let i = 0; i < count; i++) {
      const color = COLORS[i % COLORS.length];
      const radius = 100 + Math.random() * 150;
      const x = Math.random() * width;
      const y = Math.random() * height;
      const speed = 0.3 + Math.random() * 0.4;

      orbs.push(new Orb(x, y, radius, color, speed));
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    time += 0.01;

    orbs.forEach(orb => {
      orb.update(time);
      orb.draw();
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  resize();
  animate();
}
```

**Step 2: Commit**

```bash
git add prototypes/daybreak-orbs/orbs.js
git commit -m "Add Daybreak Orbs floating gradient animation"
```

---

## Task 19: Final Verification

**Step 1: List all files**

```bash
find prototypes -type f -name "*.html" -o -name "*.css" -o -name "*.js" | sort
```

Expected: All 6 new prototypes should have index.html, styles.css, and their animation JS.

**Step 2: Final commit**

```bash
git add .
git commit -m "Complete all 6 prototype refinements"
```

---

## Success Criteria

- [ ] Midnight Light: HTML, CSS (light colors), particles.js (adjusted)
- [ ] Daybreak Dark: HTML, CSS (dark colors), shapes.js (adjusted)
- [ ] Daybreak Blobs: HTML, CSS, blobs.js (morphing shapes)
- [ ] Daybreak 3D: HTML, CSS (3D styles), objects3d.js (CSS 3D)
- [ ] Daybreak Lines: HTML, CSS (line styles), lines.js (SVG drawing)
- [ ] Daybreak Orbs: HTML, CSS, orbs.js (gradient circles)
- [ ] All prototypes render correctly in browser
- [ ] All hero animations respond to mouse
