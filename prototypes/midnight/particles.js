/**
 * Midnight Theme - Particle Flow System
 */
function initParticles() {
  const canvas = document.getElementById('particles')
  const ctx = canvas.getContext('2d')

  let width
  let height
  let particles = []
  const mouse = { x: null, y: null, radius: 150 }

  const PARTICLE_COUNT = 80
  const CONNECTION_DISTANCE = 150
  const COLORS = {
    primary: '#00d4ff',
    secondary: '#ff2d7a',
  }

  function resize() {
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width
      this.y = Math.random() * height
      this.vx = (Math.random() - 0.5) * 0.5
      this.vy = (Math.random() - 0.5) * 0.5
      this.radius = Math.random() * 2 + 1
      this.color = Math.random() > 0.5 ? COLORS.primary : COLORS.secondary
    }

    update() {
      // Mouse interaction
      if (mouse.x !== null) {
        const dx = mouse.x - this.x
        const dy = mouse.y - this.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius
          const angle = Math.atan2(dy, dx)
          this.vx -= Math.cos(angle) * force * 0.02
          this.vy -= Math.sin(angle) * force * 0.02
        }
      }

      // Apply velocity
      this.x += this.vx
      this.y += this.vy

      // Damping
      this.vx *= 0.99
      this.vy *= 0.99

      // Add slight drift
      this.vx += (Math.random() - 0.5) * 0.01
      this.vy += (Math.random() - 0.5) * 0.01

      // Boundary wrapping
      if (this.x < 0) this.x = width
      if (this.x > width) this.x = 0
      if (this.y < 0) this.y = height
      if (this.y > height) this.y = 0
    }

    draw() {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.fillStyle = this.color
      ctx.fill()

      // Glow effect
      ctx.shadowBlur = 15
      ctx.shadowColor = this.color
    }
  }

  function createParticles() {
    particles = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle())
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < CONNECTION_DISTANCE) {
          const opacity = 1 - dist / CONNECTION_DISTANCE
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.3})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height)
    ctx.shadowBlur = 0

    drawConnections()

    particles.forEach((particle) => {
      particle.update()
      particle.draw()
    })

    requestAnimationFrame(animate)
  }

  // Event listeners
  window.addEventListener('resize', () => {
    resize()
    createParticles()
  })

  canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  })

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null
    mouse.y = null
  })

  // Initialize
  resize()
  createParticles()
  animate()
}
