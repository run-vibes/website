/**
 * Daybreak 3D Shapes - All Shape Showcase
 * 9 different 3D shapes in neutral gray for evaluation
 */
function initShapes3D() {
  const container = document.getElementById('shapes');
  let mouse = { x: 0.5, y: 0.5 };
  let time = 0;

  const objects = [];

  // Base class for all 3D objects
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

      this.createShape(config.type);
      this.el.style.left = `${this.x}%`;
      this.el.style.top = `${this.y}%`;
      this.el.style.transform = `scale(${this.scale})`;

      container.appendChild(this.el);
    }

    createShape(type) {
      switch (type) {
        case 'cube':
          this.createCube();
          break;
        case 'pyramid':
          this.createPyramid();
          break;
        case 'octahedron':
          this.createOctahedron();
          break;
        case 'prism':
          this.createPrism();
          break;
        case 'wireframe':
          this.createWireframe();
          break;
        case 'plane':
          this.createPlane();
          break;
        case 'sphere':
          this.createSphere();
          break;
        case 'star':
          this.createStar();
          break;
        case 'dna':
          this.createDNA();
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

    createPyramid() {
      // 3 triangular faces + base
      for (let i = 1; i <= 3; i++) {
        const div = document.createElement('div');
        div.className = `face face-${i}`;
        this.el.appendChild(div);
      }
      const base = document.createElement('div');
      base.className = 'face base';
      this.el.appendChild(base);
    }

    createOctahedron() {
      // 8 triangular faces (4 top, 4 bottom)
      ['top-1', 'top-2', 'top-3', 'top-4', 'bot-1', 'bot-2', 'bot-3', 'bot-4'].forEach(face => {
        const div = document.createElement('div');
        div.className = `face ${face}`;
        this.el.appendChild(div);
      });
    }

    createPrism() {
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

    createPlane() {
      const div = document.createElement('div');
      div.className = 'face';
      this.el.appendChild(div);
    }

    createSphere() {
      const div = document.createElement('div');
      div.className = 'face';
      this.el.appendChild(div);
    }

    createStar() {
      for (let i = 1; i <= 3; i++) {
        const div = document.createElement('div');
        div.className = `face plane-${i}`;
        this.el.appendChild(div);
      }
    }

    createDNA() {
      const nucleotides = 16;
      const height = 180;
      const radius = 20;
      const turns = 2;

      for (let i = 0; i < nucleotides; i++) {
        const progress = i / nucleotides;
        const angle = progress * Math.PI * 2 * turns;
        const y = progress * height;

        // Left strand
        const left = document.createElement('div');
        left.className = 'nucleotide';
        left.style.left = `${30 + Math.cos(angle) * radius}px`;
        left.style.top = `${y}px`;
        this.el.appendChild(left);

        // Right strand (offset by PI)
        const right = document.createElement('div');
        right.className = 'nucleotide';
        right.style.left = `${30 + Math.cos(angle + Math.PI) * radius}px`;
        right.style.top = `${y}px`;
        this.el.appendChild(right);

        // Connector every 4th nucleotide
        if (i % 4 === 0) {
          const connector = document.createElement('div');
          connector.className = 'connector';
          connector.style.top = `${y + 5}px`;
          connector.style.transform = `rotate(${angle * 180 / Math.PI}deg)`;
          this.el.appendChild(connector);
        }
      }
    }

    update(t) {
      this.rotX += this.speedX;
      this.rotY += this.speedY;
      this.rotZ += this.speedZ;

      // Floating bob
      const bob = Math.sin(t * this.bobSpeed) * this.bobAmount;

      // Mouse tilt influence
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

  // Create all 9 shapes with varied positions and behaviors
  const configs = [
    // Cube - top left
    {
      type: 'cube',
      x: 12,
      y: 22,
      speedY: 0.3,
      bobSpeed: 0.8,
      scale: 1
    },
    // Pyramid - top right
    {
      type: 'pyramid',
      x: 82,
      y: 18,
      speedY: 0.5,
      speedX: 0.15,
      bobSpeed: 1.1,
      scale: 0.9
    },
    // Octahedron - center left
    {
      type: 'octahedron',
      x: 8,
      y: 50,
      speedY: 0.4,
      speedX: 0.3,
      bobSpeed: 0.9,
      scale: 1.1
    },
    // Prism - center right
    {
      type: 'prism',
      x: 88,
      y: 45,
      speedY: -0.25,
      bobSpeed: 0.7,
      scale: 0.85
    },
    // Wireframe - bottom left
    {
      type: 'wireframe',
      x: 15,
      y: 75,
      speedY: 0.6,
      speedZ: 0.1,
      bobSpeed: 1.2,
      scale: 0.9
    },
    // Plane - top center
    {
      type: 'plane',
      x: 50,
      y: 12,
      speedY: 0.8,
      bobSpeed: 0.6,
      bobAmount: 8,
      scale: 0.8
    },
    // Sphere - bottom right
    {
      type: 'sphere',
      x: 85,
      y: 72,
      speedY: 0,
      bobSpeed: 0.5,
      bobAmount: 12,
      scale: 1
    },
    // Star - center (eye-catching)
    {
      type: 'star',
      x: 50,
      y: 55,
      speedY: 0.2,
      speedZ: 0.15,
      bobSpeed: 0.4,
      bobAmount: 6,
      scale: 1.2
    },
    // DNA - right side, tall
    {
      type: 'dna',
      x: 92,
      y: 25,
      speedY: 0.15,
      bobSpeed: 0.3,
      bobAmount: 5,
      scale: 1
    }
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
