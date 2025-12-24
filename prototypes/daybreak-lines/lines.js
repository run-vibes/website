/**
 * Daybreak Lines - Animated SVG Path Drawing
 */
function initLines() {
  const svg = document.getElementById('lines')
  const ns = 'http://www.w3.org/2000/svg'

  let width = window.innerWidth
  let height = window.innerHeight
  const mouse = { x: width / 2, y: height / 2 }

  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

  const lines = []

  class Line {
    constructor(points, className, delay) {
      this.el = document.createElementNS(ns, 'path')
      this.el.setAttribute('class', className)
      this.points = points
      this.delay = delay

      const d = this.generatePath()
      this.el.setAttribute('d', d)

      const length = this.el.getTotalLength()
      this.el.style.strokeDasharray = length
      this.el.style.strokeDashoffset = length

      svg.appendChild(this.el)

      setTimeout(() => {
        this.el.classList.add('animate')
      }, delay)
    }

    generatePath() {
      let d = `M ${this.points[0].x} ${this.points[0].y}`

      for (let i = 1; i < this.points.length; i++) {
        const prev = this.points[i - 1]
        const curr = this.points[i]

        // Smooth curve
        const midX = (prev.x + curr.x) / 2
        const midY = (prev.y + curr.y) / 2
        d += ` Q ${prev.x} ${prev.y} ${midX} ${midY}`
      }

      const last = this.points[this.points.length - 1]
      d += ` L ${last.x} ${last.y}`

      return d
    }
  }

  function createLines() {
    // Clear existing
    while (svg.firstChild) svg.removeChild(svg.firstChild)
    lines.length = 0

    // Create architectural line patterns
    const patterns = [
      // Horizontal flows
      {
        points: [
          { x: 0, y: height * 0.3 },
          { x: width * 0.3, y: height * 0.35 },
          { x: width * 0.6, y: height * 0.25 },
          { x: width, y: height * 0.3 },
        ],
        className: 'line-gray',
        delay: 0,
      },
      {
        points: [
          { x: 0, y: height * 0.6 },
          { x: width * 0.4, y: height * 0.55 },
          { x: width * 0.7, y: height * 0.65 },
          { x: width, y: height * 0.6 },
        ],
        className: 'line-gray',
        delay: 200,
      },
      // Accent lines
      {
        points: [
          { x: width * 0.2, y: 0 },
          { x: width * 0.25, y: height * 0.4 },
          { x: width * 0.15, y: height * 0.7 },
          { x: width * 0.2, y: height },
        ],
        className: 'line-primary',
        delay: 400,
      },
      {
        points: [
          { x: width * 0.7, y: 0 },
          { x: width * 0.75, y: height * 0.3 },
          { x: width * 0.65, y: height * 0.6 },
          { x: width * 0.7, y: height },
        ],
        className: 'line-secondary',
        delay: 600,
      },
      // Connecting diagonals
      {
        points: [
          { x: width * 0.1, y: height * 0.2 },
          { x: width * 0.5, y: height * 0.5 },
          { x: width * 0.9, y: height * 0.4 },
        ],
        className: 'line-gray',
        delay: 800,
      },
    ]

    patterns.forEach((p) => {
      lines.push(new Line(p.points, p.className, p.delay))
    })
  }

  // Mouse ripple effect (subtle line pulse)
  document.addEventListener(
    'mousemove',
    AnimUtils.throttle((e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }, 50),
  )

  window.addEventListener('resize', () => {
    width = window.innerWidth
    height = window.innerHeight
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    createLines()
  })

  createLines()
}
