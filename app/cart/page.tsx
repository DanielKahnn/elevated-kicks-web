'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Cart functionality will be wired up with CartContext in a future session.
  // For now we show the empty state — this replaces the 404.
  const cartItems: never[] = []

  if (!mounted) return null

  return (
    <div className="page-enter" style={{ padding: '4rem 0 6rem', position: 'relative', zIndex: 1 }}>
      <div className="container">
        <div style={{ marginBottom: '3rem' }}>
          <p className="section-sub" style={{ marginBottom: '0.5rem' }}>Review your order</p>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '0.04em', lineHeight: 1 }}>
            Your Cart
          </h1>
          <div className="section-divider" />
        </div>

        {cartItems.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '5rem 0 7rem' }}>
            {/* Bag icon */}
            <svg
              width="72" height="72" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,0.1)" strokeWidth="1.2"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ marginBottom: '1.5rem' }}
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>

            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.5rem', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.15)', marginBottom: '0.75rem' }}>
              Your cart is empty
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.95rem', maxWidth: '360px', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Looks like you haven&apos;t added anything yet. Browse the collection and find your next pair.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/collections" className="btn-primary">
                Shop Collections
              </Link>
              <Link href="/search" className="btn-secondary">
                Search Products
              </Link>
            </div>
          </div>
        ) : (
          /* Cart items will render here once CartContext is wired up */
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Cart items go here.</p>
        )}
      </div>
    </div>
  )
}
