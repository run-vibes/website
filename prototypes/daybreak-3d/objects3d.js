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
