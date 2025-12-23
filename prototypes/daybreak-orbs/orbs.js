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
