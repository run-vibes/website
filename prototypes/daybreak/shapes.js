/**
 * Daybreak Theme - Geometric Shapes Animation
 */
function initShapes() {
  const container = document.getElementById('shapes')

  const COLORS = {
    coral: '#ff4d4d',
    indigo: '#4338ca',
    gray: '#e5e5e5',
    lightGray: '#f0f0f0',
  }

  const shapes = []
  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

  class Shape {
    constructor(config) {
      this.el = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      this.el.style.cssText = `
        position: absolute;
        pointer-events: none;
        transition: transform 0.3s ease-out;
      `

      this.x = config.x
      this.y = config.y
      this.baseX = config.x
      this.baseY = config.y
      this.size = config.size
      this.rotation = config.rotation || 0
      this.rotationSpeed = config.rotationSpeed || 0
      this.parallaxFactor = config.parallax || 0.02
      this.type = config.type
      this.color = config.color

      this.el.setAttribute('width', this.size)
      this.el.setAttribute('height', this.size)
      this.el.setAttribute('viewBox', `0 0 ${this.size} ${this.size}`)

      this.createShape()
      container.appendChild(this.el)
    }

    createShape() {
      let shape
      const center = this.size / 2
      const radius = this.size / 2 - 4

      switch (this.type) {
        case 'circle':
          shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
          shape.setAttribute('cx', center)
          shape.setAttribute('cy', center)
          shape.setAttribute('r', radius)
          break
        case 'rounded-rect':
          shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
          shape.setAttribute('x', 4)
          shape.setAttribute('y', 4)
          shape.setAttribute('width', this.size - 8)
          shape.setAttribute('height', this.size - 8)
          shape.setAttribute('rx', this.size * 0.2)
          break
        case 'pill':
          shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
          shape.setAttribute('x', 4)
          shape.setAttribute('y', this.size * 0.3)
          shape.setAttribute('width', this.size - 8)
          shape.setAttribute('height', this.size * 0.4)
          shape.setAttribute('rx', this.size * 0.2)
          break
      }

      shape.setAttribute('fill', this.color)
      this.el.appendChild(shape)
    }

    update() {
      // Parallax based on mouse
      const dx = (mouse.x - window.innerWidth / 2) * this.parallaxFactor
      const dy = (mouse.y - window.innerHeight / 2) * this.parallaxFactor

      this.x = this.baseX + dx
      this.y = this.baseY + dy

      // Rotation
      this.rotation += this.rotationSpeed

      this.el.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`
    }
  }

  // Create shapes
  const shapeConfigs = [
    {
      x: '15%',
      y: '20%',
      size: 200,
      type: 'circle',
      color: COLORS.coral,
      parallax: 0.04,
      rotationSpeed: 0,
    },
    {
      x: '70%',
      y: '15%',
      size: 150,
      type: 'rounded-rect',
      color: COLORS.indigo,
      parallax: 0.02,
      rotationSpeed: 0.1,
    },
    {
      x: '80%',
      y: '60%',
      size: 180,
      type: 'circle',
      color: COLORS.lightGray,
      parallax: 0.01,
      rotationSpeed: 0,
    },
    {
      x: '25%',
      y: '70%',
      size: 120,
      type: 'rounded-rect',
      color: COLORS.gray,
      parallax: 0.03,
      rotationSpeed: -0.08,
    },
    {
      x: '60%',
      y: '75%',
      size: 100,
      type: 'pill',
      color: COLORS.coral,
      parallax: 0.035,
      rotationSpeed: 0.15,
      rotation: 45,
    },
    {
      x: '5%',
      y: '50%',
      size: 80,
      type: 'circle',
      color: COLORS.indigo,
      parallax: 0.025,
      rotationSpeed: 0,
    },
    {
      x: '90%',
      y: '30%',
      size: 60,
      type: 'rounded-rect',
      color: COLORS.gray,
      parallax: 0.015,
      rotationSpeed: 0.2,
    },
  ]

  shapeConfigs.forEach((config) => {
    // Convert percentage to pixels
    const x =
      typeof config.x === 'string'
        ? (Number.parseFloat(config.x) / 100) * window.innerWidth
        : config.x
    const y =
      typeof config.y === 'string'
        ? (Number.parseFloat(config.y) / 100) * window.innerHeight
        : config.y

    shapes.push(new Shape({ ...config, x, y, baseX: x, baseY: y }))
  })

  // Mouse tracking
  document.addEventListener(
    'mousemove',
    AnimUtils.throttle((e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }, 16),
  )

  // Animation loop
  function animate() {
    shapes.forEach((shape) => shape.update())
    requestAnimationFrame(animate)
  }

  animate()

  // Handle resize
  window.addEventListener('resize', () => {
    shapes.forEach((shape, i) => {
      const config = shapeConfigs[i]
      shape.baseX =
        typeof config.x === 'string'
          ? (Number.parseFloat(config.x) / 100) * window.innerWidth
          : config.x
      shape.baseY =
        typeof config.y === 'string'
          ? (Number.parseFloat(config.y) / 100) * window.innerHeight
          : config.y
    })
  })
}
