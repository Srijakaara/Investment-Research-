import { useEffect, useRef } from 'react'

interface ParticleNetworkBackgroundProps {
  /** Base opacity of the whole canvas layer (0–1). Default 0.4. */
  opacity?: number
  /** Enable mouse-follow connector lines + gentle particle attraction. Default false — safe to drop behind dense, clickable pages. */
  interactive?: boolean
  className?: string
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
}

const ACCENT = '#E51E25'
const GRID_CELL = 100

/**
 * Ambient canvas background: drifting particles connected by faint lines,
 * with a red"scanline"sweeping across that highlights nearby particles —
 * matching the kaara.ai hero/section background treatment.
 */
export function ParticleNetworkBackground({
  opacity = 0.4,
  interactive = false,
  className = '',
}: ParticleNetworkBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const frameRef = useRef(0)
  const particlesRef = useRef<Particle[]>([])
  const visibleRef = useRef(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let scanX = 0

    const seedParticles = () => {
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 150)
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: 1.5 * Math.random() + 0.5,
      }))
    }

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      seedParticles()
    }

    const buildGrid = (particles: Particle[]) => {
      const grid: Record<string, Particle[]> = {}
      for (const p of particles) {
        const key = `${Math.floor(p.x / GRID_CELL)},${Math.floor(p.y / GRID_CELL)}`
        ;(grid[key] ??= []).push(p)
      }
      return grid
    }

    const neighborsOf = (grid: Record<string, Particle[]>, p: Particle) => {
      const cx = Math.floor(p.x / GRID_CELL)
      const cy = Math.floor(p.y / GRID_CELL)
      const out: Particle[] = []
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const bucket = grid[`${cx + dx},${cy + dy}`]
          if (bucket) out.push(...bucket)
        }
      }
      return out
    }

    const isDark = () => document.documentElement.classList.contains('dark')

    const draw = () => {
      if (!visibleRef.current) {
        frameRef.current = requestAnimationFrame(draw)
        return
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      scanX = (scanX + 6) % (canvas.width + 500)

      const particles = particlesRef.current
      const mouse = mouseRef.current
      const grid = buildGrid(particles)
      const dark = isDark()
      const dimFill = dark ? 'rgba(255,255,255,0.15)' : 'rgba(18,18,18,0.15)'
      const lineBase = dark ? 'rgba(255,255,255,' : 'rgba(18,18,18,'

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        const distFromScan = Math.abs(p.x - scanX)
        const nearScan = distFromScan < 100

        ctx.beginPath()
        ctx.arc(p.x, p.y, nearScan ? 1.8 * p.size : p.size, 0, Math.PI * 2)
        ctx.fillStyle = nearScan ? ACCENT : dimFill
        ctx.fill()

        if (interactive) {
          const mdx = mouse.x - p.x
          const mdy = mouse.y - p.y
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy)
          if (mDist < 200) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.strokeStyle = `rgba(229,30,37,${(1 - mDist / 200) * 0.6})`
            ctx.lineWidth = 1
            ctx.stroke()
            p.x += 0.005 * mdx
            p.y += 0.005 * mdy
          }
        }

        for (const other of neighborsOf(grid, p)) {
          if (other === p) continue
          const ddx = p.x - other.x
          const ddy = p.y - other.y
          const dist = Math.sqrt(ddx * ddx + ddy * ddy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(other.x, other.y)
            if (nearScan && Math.abs(other.x - scanX) < 100) {
              ctx.strokeStyle = `rgba(229,30,37,${0.3 * (1 - distFromScan / 100)})`
              ctx.lineWidth = 1.5
            } else {
              ctx.strokeStyle = `${lineBase}${Math.max(0, 0.04 - dist / 2500)})`
              ctx.lineWidth = 0.5
            }
            ctx.stroke()
          }
        }
      }

      frameRef.current = requestAnimationFrame(draw)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
      },
      { threshold: 0.1 },
    )
    observer.observe(canvas)

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    window.addEventListener('resize', resize)
    if (interactive) {
      canvas.addEventListener('mousemove', onMouseMove)
      canvas.addEventListener('mouseleave', onMouseLeave)
    }

    resize()
    draw()

    return () => {
      cancelAnimationFrame(frameRef.current)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      if (interactive) {
        canvas.removeEventListener('mousemove', onMouseMove)
        canvas.removeEventListener('mouseleave', onMouseLeave)
      }
    }
  }, [interactive])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full ${interactive ? 'pointer-events-auto' : 'pointer-events-none'} ${className}`}
      style={{ opacity }}
    />
  )
}
