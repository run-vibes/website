/**
 * Aurora Theme - Generative Mesh Gradient
 */
function initGradient() {
  const canvas = document.getElementById('gradient')
  const ctx = canvas.getContext('2d')

  let width
  let height
  let time = 0
  const mouse = { x: 0.5, y: 0.5 }

  const COLORS = [
    { r: 168, g: 85, b: 247 }, // Purple
    { r: 20, g: 184, b: 166 }, // Teal
    { r: 245, g: 158, b: 11 }, // Gold
    { r: 99, g: 102, b: 241 }, // Indigo
  ]

  function resize() {
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight
  }

  // Simplex noise approximation
  function noise(x, y, t) {
    const sin1 = Math.sin(x * 0.01 + t)
    const sin2 = Math.sin(y * 0.01 + t * 0.8)
    const sin3 = Math.sin((x + y) * 0.01 + t * 0.5)
    const sin4 = Math.sin(Math.sqrt(x * x + y * y) * 0.01 - t * 0.3)
    return (sin1 + sin2 + sin3 + sin4) / 4
  }

  function getColor(x, y, t) {
    // Normalized coordinates
    const nx = x / width
    const ny = y / height

    // Mouse influence
    const mdx = nx - mouse.x
    const mdy = ny - mouse.y
    const mouseDist = Math.sqrt(mdx * mdx + mdy * mdy)
    const mouseInfluence = Math.max(0, 1 - mouseDist * 2)

    // Noise values for color mixing
    const n1 = noise(x, y, t) * 0.5 + 0.5
    const n2 = noise(x + 1000, y + 1000, t * 1.3) * 0.5 + 0.5
    const n3 = noise(x - 500, y + 500, t * 0.7) * 0.5 + 0.5

    // Mix colors based on noise and position
    let r = 0
    let g = 0
    let b = 0

    // Base gradient (top to bottom)
    const baseColor = {
      r: 26 + ny * 15,
      g: 26 + ny * 25,
      b: 46 + ny * 50,
    }

    // Add color blobs
    const colorMix = [
      { color: COLORS[0], factor: n1 * (1 - ny * 0.5) },
      { color: COLORS[1], factor: n2 * mouseInfluence * 2 },
      { color: COLORS[2], factor: n3 * ny * 0.5 },
      { color: COLORS[3], factor: (1 - n1) * (1 - ny) * 0.3 },
    ]

    r = baseColor.r
    g = baseColor.g
    b = baseColor.b

    colorMix.forEach((mix) => {
      const f = mix.factor * 0.4
      r += (mix.color.r - r) * f
      g += (mix.color.g - g) * f
      b += (mix.color.b - b) * f
    })

    return { r: Math.floor(r), g: Math.floor(g), b: Math.floor(b) }
  }

  function draw() {
    const imageData = ctx.createImageData(width, height)
    const data = imageData.data

    // Lower resolution for performance
    const scale = 4
    const scaledWidth = Math.ceil(width / scale)
    const scaledHeight = Math.ceil(height / scale)

    // Create low-res version
    const lowRes = new Uint8ClampedArray(scaledWidth * scaledHeight * 4)

    for (let y = 0; y < scaledHeight; y++) {
      for (let x = 0; x < scaledWidth; x++) {
        const color = getColor(x * scale, y * scale, time)
        const i = (y * scaledWidth + x) * 4
        lowRes[i] = color.r
        lowRes[i + 1] = color.g
        lowRes[i + 2] = color.b
        lowRes[i + 3] = 255
      }
    }

    // Upscale with bilinear interpolation
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const sx = x / scale
        const sy = y / scale
        const x0 = Math.floor(sx)
        const y0 = Math.floor(sy)
        const x1 = Math.min(x0 + 1, scaledWidth - 1)
        const y1 = Math.min(y0 + 1, scaledHeight - 1)
        const fx = sx - x0
        const fy = sy - y0

        const i00 = (y0 * scaledWidth + x0) * 4
        const i10 = (y0 * scaledWidth + x1) * 4
        const i01 = (y1 * scaledWidth + x0) * 4
        const i11 = (y1 * scaledWidth + x1) * 4

        const i = (y * width + x) * 4

        for (let c = 0; c < 3; c++) {
          const top = lowRes[i00 + c] * (1 - fx) + lowRes[i10 + c] * fx
          const bottom = lowRes[i01 + c] * (1 - fx) + lowRes[i11 + c] * fx
          data[i + c] = top * (1 - fy) + bottom * fy
        }
        data[i + 3] = 255
      }
    }

    ctx.putImageData(imageData, 0, 0)

    // Add subtle vignette
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.7,
    )
    gradient.addColorStop(0, 'rgba(0,0,0,0)')
    gradient.addColorStop(1, 'rgba(0,0,0,0.4)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }

  function animate() {
    time += 0.005
    draw()
    requestAnimationFrame(animate)
  }

  // Event listeners
  window.addEventListener('resize', resize)

  document.addEventListener(
    'mousemove',
    AnimUtils.throttle((e) => {
      mouse.x = e.clientX / width
      mouse.y = e.clientY / height
    }, 50),
  )

  // Initialize
  resize()
  animate()
}
