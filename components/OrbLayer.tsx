'use client'
import { useEffect, useRef } from 'react'

export default function OrbLayer() {
  const orb1 = useRef<HTMLDivElement>(null)
  const orb2 = useRef<HTMLDivElement>(null)
  const orb3 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const orbs = [orb1.current, orb2.current, orb3.current]
    const strength = [0.018, 0.012, 0.008]
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0
    let raf: number

    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2
      targetY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const animate = () => {
      currentX += (targetX - currentX) * 0.06
      currentY += (targetY - currentY) * 0.06
      orbs.forEach((orb, i) => {
        if (!orb) return
        const s = strength[i]
        orb.style.transform = `translate(${currentX * window.innerWidth * s}px, ${currentY * window.innerHeight * s}px)`
      })
      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="ek-orb-layer" aria-hidden="true">
      <div className="ek-orb ek-orb-1" ref={orb1} />
      <div className="ek-orb ek-orb-2" ref={orb2} />
      <div className="ek-orb ek-orb-3" ref={orb3} />
    </div>
  )
}
