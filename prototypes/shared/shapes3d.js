/**
 * Shared 3D Shapes - Cubes, Wireframes, Pyramids
 * Used across all daybreak-3d color variants
 */
function initShapes3D() {
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
      this.scale = config.scale || 1;
      this.colorClass = config.colorClass || 'primary';

      this.createShape(config.type);
      this.el.style.left = `${this.x}%`;
      this.el.style.top = `${this.y}%`;
      this.el.dataset.color = this.colorClass;

      container.appendChild(this.el);
    }

    createShape(type) {
      switch (type) {
        case 'cube':
          this.createCube();
          break;
        case 'wireframe':
          this.createWireframe();
          break;
        case 'pyramid':
          this.createPyramid();
          break;
      }
    }

    createCube() {
      const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
      faces.forEach(face => {
        const div = document.createElement('div');
        div.className = `face ${face}`;
        this.el.appendChild(div);
      });
    }

    createWireframe() {
      const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
      faces.forEach(face => {
        const div = document.createElement('div');
        div.className = `face ${face}`;
        this.el.appendChild(div);
      });
    }

    createPyramid() {
      for (let i = 1; i <= 4; i++) {
        const div = document.createElement('div');
        div.className = `face face-${i}`;
        this.el.appendChild(div);
      }
    }

    update(t) {
      this.rotX += this.speedX;
      this.rotY += this.speedY;
      this.rotZ += this.speedZ;

      const bob = Math.sin(t * this.bobSpeed) * this.bobAmount;
      const tiltX = (mouse.y - 0.5) * 15;
      const tiltY = (mouse.x - 0.5) * 15;

      this.el.style.transform = `
        scale(${this.scale})
        translateY(${bob}px)
        rotateX(${this.rotX + tiltX}deg)
        rotateY(${this.rotY + tiltY}deg)
        rotateZ(${this.rotZ}deg)
      `;
    }
  }

  // Mixed shapes: cubes, wireframes, pyramids
  const configs = [
    // Cubes - larger scales for visibility
    { type: 'cube', x: 8, y: 18, speedY: 0.3, bobSpeed: 0.8, scale: 2.2, colorClass: 'primary' },
    { type: 'cube', x: 82, y: 60, speedY: -0.4, bobSpeed: 1.1, scale: 1.8, colorClass: 'secondary' },
    { type: 'cube', x: 45, y: 72, speedY: 0.25, speedZ: 0.1, bobSpeed: 0.7, scale: 1.6, colorClass: 'tertiary' },

    // Wireframes - larger scales
    { type: 'wireframe', x: 72, y: 15, speedY: 0.5, speedZ: 0.15, bobSpeed: 1.2, scale: 2.4, colorClass: 'primary' },
    { type: 'wireframe', x: 18, y: 65, speedY: -0.35, bobSpeed: 0.9, scale: 2.0, colorClass: 'secondary' },

    // Pyramids - larger scales
    { type: 'pyramid', x: 85, y: 38, speedY: 0.45, speedX: 0.2, bobSpeed: 1, scale: 2.2, colorClass: 'primary' },
    { type: 'pyramid', x: 12, y: 42, speedY: -0.5, speedX: 0.15, bobSpeed: 0.85, scale: 1.9, colorClass: 'tertiary' },
    { type: 'pyramid', x: 55, y: 22, speedY: 0.35, bobSpeed: 0.75, scale: 1.7, colorClass: 'secondary' },
  ];

  configs.forEach(config => {
    objects.push(new Object3D(config));
  });

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = e.clientY / window.innerHeight;
  });

  function animate() {
    time += 0.016;
    objects.forEach(obj => obj.update(time));
    requestAnimationFrame(animate);
  }

  animate();
}
