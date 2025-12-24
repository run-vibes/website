/**
 * Daybreak Hybrid - 3D Floating Objects
 * Cubes and pyramids with mouse parallax
 */
function init3DObjects() {
  const container = document.getElementById('shapes')
  if (!container) return

  const mouse = { x: 0.5, y: 0.5 }
  let time = 0

  const objects = []

  class Object3D {
    constructor(config) {
      this.el = document.createElement('div')
      this.el.className = `object-3d ${config.type}`

      this.x = config.x
      this.y = config.y
      this.rotX = config.rotX || 0
      this.rotY = config.rotY || 0
      this.rotZ = config.rotZ || 0
      this.speedX = config.speedX || 0
      this.speedY = config.speedY || 0.5
      this.speedZ = config.speedZ || 0
      this.bobSpeed = config.bobSpeed || 1
      this.bobAmount = config.bobAmount || 10
      this.baseY = config.y

      this.createFaces(config.type, config.color)
      this.el.style.left = `${this.x}%`
      this.el.style.top = `${this.y}%`

      container.appendChild(this.el)
    }

    createFaces(type, color) {
      if (type === 'cube') {
        const faces = ['front', 'back', 'right', 'left', 'top', 'bottom']
        faces.forEach((face) => {
          const div = document.createElement('div')
          div.className = `face ${face}`
          div.style.background = `rgba(${color}, 0.15)`
          div.style.borderColor = `rgba(${color}, 0.4)`
          this.el.appendChild(div)
        })
      } else if (type === 'pyramid') {
        for (let i = 1; i <= 4; i++) {
          const div = document.createElement('div')
          div.className = `face face-${i}`
          div.style.borderBottomColor = `rgba(${color}, 0.2)`
          this.el.appendChild(div)
        }
      }
    }

    update(t) {
      this.rotX += this.speedX
      this.rotY += this.speedY
      this.rotZ += this.speedZ

      // Floating bob
      const bob = Math.sin(t * this.bobSpeed) * this.bobAmount

      // Mouse tilt influence
      const tiltX = (mouse.y - 0.5) * 20
      const tiltY = (mouse.x - 0.5) * 20

      this.el.style.transform = `
        translateY(${bob}px)
        rotateX(${this.rotX + tiltX}deg)
        rotateY(${this.rotY + tiltY}deg)
        rotateZ(${this.rotZ}deg)
      `
    }
  }

  // 3D object configurations - Earth colors (amber + teal)
  const configs = [
    { type: 'cube', x: 12, y: 25, speedY: 0.3, bobSpeed: 0.8, color: '245, 158, 11' },
    { type: 'cube', x: 82, y: 22, speedY: -0.4, speedX: 0.2, bobSpeed: 1.2, color: '20, 184, 166' },
    {
      type: 'pyramid',
      x: 50,
      y: 60,
      speedY: 0.15,
      bobSpeed: 0.5,
      bobAmount: 8,
      color: '20, 184, 166',
    },
    { type: 'cube', x: 88, y: 65, speedY: 0.35, bobSpeed: 0.9, color: '245, 158, 11' },
  ]

  configs.forEach((config) => {
    objects.push(new Object3D(config))
  })

  // Mouse tracking
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX / window.innerWidth
    mouse.y = e.clientY / window.innerHeight
  })

  // Animation loop
  function animate() {
    time += 0.016
    objects.forEach((obj) => obj.update(time))
    requestAnimationFrame(animate)
  }

  animate()
}
