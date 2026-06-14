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

  const empty = items.length === 0

  return (
    <div style={{ padding: '6rem 0 8rem', position: 'relative', zIndex: 1, minHeight: '80vh' }}>
      <div className="container">
        {/* Page header */}
        <div className="reveal" style={{ marginBottom: '3.5rem' }}>
          <p className="section-sub">Review your order</p>
          <h1 style={{
            fontFamily: '\'Playfair Display\', Georgia, serif',
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            color: 'var(--text)',
          }}>
            Your Cart
          </h1>
          <div className="section-divider" />
        </div>

        {empty ? (
          /* Empty state */
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '5rem 0 7rem' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none"
              stroke="var(--border-warm)" strokeWidth="1"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ marginBottom: '2rem' }}>
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <h2 style={{
              fontFamily: '\'Playfair Display\', Georgia, serif',
              fontSize: '2rem',
              fontStyle: 'italic',
              color: 'var(--text-faint)',
              marginBottom: '0.75rem',
              fontWeight: 500,
            }}>
              Your cart is empty
            </h2>
            <p style={{ color: 'var(--text-faint)', fontSize: '0.92rem', maxWidth: '360px', lineHeight: 1.7, marginBottom: '2.5rem' }}>
              Looks like you haven&apos;t added anything yet. Browse the collection and find your next pair.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/collections" className="btn-primary">Shop Collections</Link>
              <Link href="/search" className="btn-secondary">Search Products</Link>
            </div>
          </div>
        ) : (
          /* Cart layout */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '3.5rem', alignItems: 'start' }}>
            {/* Item list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
              {items.map((item, i) => (
                <div key={item.variantId} className={`reveal delay-${(i % 3) + 1}`} style={{
                  display: 'grid',
                  gridTemplateColumns: '88px 1fr auto',
                  gap: '1.5rem',
                  alignItems: 'center',
                  background: 'var(--bg-surface)',
                  padding: '1.5rem',
                }}>
                  {/* Image */}
                  <Link href={`/products/${item.productHandle}`} style={{ flexShrink: 0 }}>
                    <div style={{ position: 'relative', width: '88px', height: '88px', overflow: 'hidden', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                      {item.image ? (
                        <Image src={item.image.url} alt={item.productTitle} fill style={{ objectFit: 'cover' }} sizes="88px" />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '\'Playfair Display\', Georgia, serif', fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--text-faint)' }}>EK</div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div>
                    <Link href={`/products/${item.productHandle}`}>
                      <p style={{ fontFamily: '\'Playfair Display\', Georgia, serif', fontWeight: 500, fontSize: '1rem', color: 'var(--text)', marginBottom: '0.2rem', letterSpacing: '-0.01em' }}>
                        {item.productTitle}
                      </p>
                    </Link>
                    {item.variantTitle !== 'Default Title' && (
                      <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '0.6rem' }}>
                        Size {item.variantTitle}
                      </p>
                    )}
                    <p style={{ fontFamily: '\'Playfair Display\', Georgia, serif', fontWeight: 600, color: 'var(--gold)', fontSize: '1.05rem' }}>
                      ${(parseFloat(item.price.amount) * item.quantity).toFixed(2)}
                    </p>

                    {/* Qty controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        style={{ width: '28px', height: '28px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.2s' }}
                        aria-label="Decrease quantity"
                      >−</button>
                      <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        style={{ width: '28px', height: '28px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.2s' }}
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.variantId)}
                    aria-label="Remove item"
                    style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1, padding: '0.25rem', transition: 'color 0.2s', alignSelf: 'flex-start' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#e55')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="reveal delay-2" style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              padding: '2rem',
              position: 'sticky',
              top: '100px',
            }}>
              <h2 style={{
                fontFamily: '\'Playfair Display\', Georgia, serif',
                fontSize: '1.5rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: 'var(--text)',
                marginBottom: '1.75rem',
              }}>
                Order Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  <span>Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-faint)', fontSize: '0.82rem' }}>
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>Estimated Total</span>
                  <span style={{ fontFamily: '\'Playfair Display\', Georgia, serif', fontWeight: 600, fontSize: '1.4rem', color: 'var(--gold)' }}>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={handleCheckout}
                disabled={checkingOut}
                style={{ width: '100%', fontSize: '0.85rem', padding: '1rem', cursor: checkingOut ? 'wait' : 'pointer' }}
              >
                {checkingOut ? 'Redirecting…' : 'Proceed to Checkout →'}
              </button>

              <Link href="/collections" className="btn-secondary" style={{ width: '100%', marginTop: '0.75rem', display: 'flex', justifyContent: 'center', fontSize: '0.78rem', padding: '0.75rem' }}>
                Continue Shopping
              </Link>

              <p style={{ marginTop: '1.5rem', fontSize: '0.68rem', color: 'var(--text-faint)', textAlign: 'center', letterSpacing: '0.06em' }}>
                Secure checkout powered by Shopify
              </p>
            </div>

            <style>{`
              @media (max-width: 860px) {
                .cart-responsive { grid-template-columns: 1fr !important; }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  )
}
