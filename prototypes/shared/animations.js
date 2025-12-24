/**
 * Scroll-triggered animation observer
 */
function initScrollAnimations(options = {}) {
  const {
    selector = '[data-animate]',
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    staggerDelay = 100,
  } = options

  const elements = document.querySelectorAll(selector)

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target

          // Handle staggered children
          if (el.hasAttribute('data-stagger')) {
            const children = el.querySelectorAll('[data-animate-child]')
            children.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add('visible')
              }, index * staggerDelay)
            })
          }

          el.classList.add('visible')
          observer.unobserve(el)
        }
      })
    },
    { threshold, rootMargin },
  )

  elements.forEach((el) => observer.observe(el))
}

/**
 * Smooth easing functions
 */
const easing = {
  // Smooth deceleration
  easeOutCubic: (t) => 1 - (1 - t) ** 3,
  // Smooth acceleration then deceleration
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  // Bouncy deceleration
  easeOutBack: (t) => 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2,
  // Dreamy float
  easeOutQuart: (t) => 1 - (1 - t) ** 4,
}

/**
 * Linear interpolation
 */
function lerp(start, end, factor) {
  return start + (end - start) * factor
}

/**
 * Map value from one range to another
 */
function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

/**
 * Clamp value between min and max
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Throttle function calls
 */
function throttle(func, limit) {
  let inThrottle
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Initialize on DOM ready
 */
function onReady(callback) {
  if (document.readyState !== 'loading') {
    callback()
  } else {
    document.addEventListener('DOMContentLoaded', callback)
  }
}

// Export for use
if (typeof window !== 'undefined') {
  window.AnimUtils = {
    initScrollAnimations,
    easing,
    lerp,
    mapRange,
    clamp,
    throttle,
    onReady,
  }
}
