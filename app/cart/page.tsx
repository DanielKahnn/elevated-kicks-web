'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart()
  const [checkingOut, setCheckingOut] = useState(false)

  const handleCheckout = async () => {
    if (items.length === 0) return
    setCheckingOut(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      const { checkoutUrl } = await res.json()
      if (checkoutUrl) {
        clearCart()
        window.location.href = checkoutUrl
      }
    } catch {
      setCheckingOut(false)
    }
  }

  if (items.length === 0) {
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '5rem 0 7rem' }}>
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,0.1)" strokeWidth="1.2"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ marginBottom: '1.5rem' }}>
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
              <Link href="/collections" className="btn-primary">Shop Collections</Link>
              <Link href="/search" className="btn-secondary">Search Products</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '3rem', alignItems: 'start' }}>
          {/* Item list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map(item => (
              <div key={item.variantId} style={{
                display: 'grid',
                gridTemplateColumns: '90px 1fr auto',
                gap: '1.25rem',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '14px',
                padding: '1rem 1.25rem',
              }}>
                {/* Image */}
                <Link href={`/products/${item.productHandle}`}>
                  <div style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '10px', overflow: 'hidden', background: 'rgba(255,255,255,0.04)', flexShrink: 0 }}>
                    {item.image ? (
                      <Image src={item.image.url} alt={item.productTitle} fill style={{ objectFit: 'cover' }} sizes="90px" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', color: 'rgba(255,255,255,0.1)' }}>EK</div>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div>
                  <Link href={`/products/${item.productHandle}`}>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff', marginBottom: '0.2rem' }}>{item.productTitle}</p>
                  </Link>
                  {item.variantTitle !== 'Default Title' && (
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.6rem' }}>{item.variantTitle}</p>
                  )}
                  <p style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>
                    ${(parseFloat(item.price.amount) * item.quantity).toFixed(2)}
                  </p>

                  {/* Qty controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.6rem' }}>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >−</button>
                    <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >+</button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.variantId)}
                  aria-label="Remove item"
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1, padding: '0.25rem', transition: 'color 0.2s', alignSelf: 'start' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#FF2D1F')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '20px',
            padding: '2rem',
            position: 'sticky',
            top: '88px',
          }}>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', letterSpacing: '0.06em', marginBottom: '1.5rem' }}>
              Order Summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                <span>Estimated Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={handleCheckout}
              disabled={checkingOut}
              style={{ width: '100%', fontSize: '1rem', padding: '1rem', cursor: checkingOut ? 'wait' : 'pointer' }}
            >
              {checkingOut ? 'Redirecting…' : 'Proceed to Checkout →'}
            </button>

            <Link href="/collections" className="btn-secondary" style={{ width: '100%', marginTop: '0.75rem', display: 'flex', justifyContent: 'center', fontSize: '0.85rem', padding: '0.75rem' }}>
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Responsive: stack on mobile */}
        <style>{`
          @media (max-width: 768px) {
            .cart-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </div>
  )
}
