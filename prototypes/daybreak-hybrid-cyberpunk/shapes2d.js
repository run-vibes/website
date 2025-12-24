/**
 * Daybreak Hybrid - 2D Flat Shapes
 * Animated geometric shapes with mouse repel effect
 */
function init2DShapes() {
  const container = document.getElementById('shapes2d')
  if (!container) return

  const mouse = { x: 0.5, y: 0.5 }

  const shapes = []

  class Shape2D {
    constructor(config) {
      this.el = document.createElement('div')
      this.el.className = `shape-2d shape-${config.type}`

      this.baseX = config.x
      this.baseY = config.y
      this.x = config.x
      this.y = config.y
      this.repelStrength = config.repelStrength || 30

      this.el.style.left = `${this.x}%`
      this.el.style.top = `${this.y}%`

      container.appendChild(this.el)
    }

    update() {
      // Calculate distance from mouse
      const dx = mouse.x * 100 - this.baseX
      const dy = mouse.y * 100 - this.baseY
      const dist = Math.sqrt(dx * dx + dy * dy)

      // Repel effect - shapes drift away from cursor
      const maxDist = 40
      if (dist < maxDist) {
        const force = (1 - dist / maxDist) * this.repelStrength
        const angle = Math.atan2(dy, dx)
        const offsetX = -Math.cos(angle) * force
        const offsetY = -Math.sin(angle) * force

        this.el.style.transform = `translate(${offsetX}px, ${offsetY}px)`
      } else {
        this.el.style.transform = 'translate(0, 0)'
      }
    }
  }

  // 2D shape configurations
  const configs = [
    { type: 'circle', x: 20, y: 35, repelStrength: 25 },
    { type: 'diamond', x: 70, y: 40, repelStrength: 35 },
    { type: 'rectangle', x: 35, y: 75, repelStrength: 20 },
    { type: 'triangle', x: 78, y: 78, repelStrength: 30 },
    { type: 'circle', x: 55, y: 20, repelStrength: 28 },
    { type: 'diamond', x: 15, y: 70, repelStrength: 32 },
  ]

  configs.forEach((config) => {
    shapes.push(new Shape2D(config))
  })

  // Mouse tracking
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX / window.innerWidth
    mouse.y = e.clientY / window.innerHeight
  })

  // Animation loop
  function animate() {
    shapes.forEach((shape) => shape.update())
    requestAnimationFrame(animate)
  }

  animate()
}
