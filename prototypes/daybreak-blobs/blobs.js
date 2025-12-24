/**
 * Daybreak Blobs - Organic Morphing Shapes
 */
function initBlobs() {
  const canvas = document.getElementById('blobs')
  const ctx = canvas.getContext('2d')

  let width
  let height
  let time = 0
  const mouse = { x: null, y: null }

  const COLORS = [
    'rgba(255, 77, 77, 0.6)', // Coral
    'rgba(67, 56, 202, 0.5)', // Indigo
    'rgba(255, 160, 160, 0.4)', // Soft pink
    'rgba(160, 212, 255, 0.4)', // Light blue
  ]

  class Blob {
    constructor(x, y, radius, color, speed) {
      this.baseX = x
      this.baseY = y
      this.x = x
      this.y = y
      this.radius = radius
      this.color = color
      this.speed = speed
      this.offset = Math.random() * Math.PI * 2
      this.points = []
      this.numPoints = 6

      // Initialize control points
      for (let i = 0; i < this.numPoints; i++) {
        this.points.push({
          angle: (i / this.numPoints) * Math.PI * 2,
          radius: radius,
          speed: 0.5 + Math.random() * 0.5,
        })
      }
    }

    update(t) {
      // Organic movement
      this.x = this.baseX + Math.sin(t * this.speed + this.offset) * 30
      this.y = this.baseY + Math.cos(t * this.speed * 0.8 + this.offset) * 20

      // Mouse attraction
      if (mouse.x !== null) {
        const dx = mouse.x - this.x
        const dy = mouse.y - this.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 200) {
          const force = ((200 - dist) / 200) * 0.3
          this.x += dx * force * 0.02
          this.y += dy * force * 0.02
        }
      }

      // Morph points
      this.points.forEach((point, i) => {
        const noise = Math.sin(t * point.speed + i) * 0.2
        point.radius = this.radius * (1 + noise)
      })
    }

    draw() {
      ctx.beginPath()

      const points = this.points.map((p, i) => ({
        x: this.x + Math.cos(p.angle) * p.radius,
        y: this.y + Math.sin(p.angle) * p.radius,
      }))

      // Draw smooth curve through points
      ctx.moveTo(points[0].x, points[0].y)

      for (let i = 0; i < points.length; i++) {
        const curr = points[i]
        const next = points[(i + 1) % points.length]
        const midX = (curr.x + next.x) / 2
        const midY = (curr.y + next.y) / 2
        ctx.quadraticCurveTo(curr.x, curr.y, midX, midY)
      }

      ctx.closePath()
      ctx.fillStyle = this.color
      ctx.fill()
    }
  }

  let blobs = []

  function resize() {
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight
    createBlobs()
  }

  function createBlobs() {
    blobs = [
      new Blob(width * 0.2, height * 0.3, 180, COLORS[0], 0.3),
      new Blob(width * 0.7, height * 0.25, 150, COLORS[1], 0.4),
      new Blob(width * 0.5, height * 0.6, 200, COLORS[2], 0.25),
      new Blob(width * 0.8, height * 0.7, 120, COLORS[3], 0.35),
      new Blob(width * 0.15, height * 0.7, 100, COLORS[1], 0.45),
    ]
  }

  function animate() {
    ctx.clearRect(0, 0, width, height)
    time += 0.01

    blobs.forEach((blob) => {
      blob.update(time)
      blob.draw()
    })

    requestAnimationFrame(animate)
  }

  window.addEventListener('resize', resize)
  canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  })
  canvas.addEventListener('mouseleave', () => {
    mouse.x = null
    mouse.y = null
  })

  resize()
  animate()
}
