'use client'

import { useState, useEffect, useRef } from 'react'
import type { ShopifyProduct } from '@/lib/shopify'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ShopifyProduct[]>([])
  const [allProducts, setAllProducts] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load all products on mount so search is instant
  useEffect(() => {
    fetch('/api/search')
      .then(r => r.json())
      .then((products: ShopifyProduct[]) => {
        setAllProducts(products)
        setResults(products)
        setLoading(false)
      })
      .catch(() => setLoading(false))
    // Auto-focus the search input
    inputRef.current?.focus()
  }, [])

  // Filter as user types
  useEffect(() => {
    if (!query.trim()) {
      setResults(allProducts)
      return
    }
    setSearching(true)
    const q = query.toLowerCase()
    const filtered = allProducts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.tags?.some((t: string) => t.toLowerCase().includes(q))
    )
    setResults(filtered)
    setSearching(false)
  }, [query, allProducts])

  return (
    <div className="page-enter" style={{ padding: '4rem 0 6rem', position: 'relative', zIndex: 1 }}>
      <div className="container">

        {/* Search bar */}
        <div style={{ marginBottom: '3rem' }}>
          <p className="section-sub" style={{ marginBottom: '0.5rem' }}>Find anything</p>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '0.04em', lineHeight: 1, marginBottom: '2rem' }}>
            Search
          </h1>
          <div style={{ position: 'relative', maxWidth: '640px' }}>
            <svg
              style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }}
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search sneakers, brands, styles…"
              style={{
                width: '100%',
                padding: '1rem 1rem 1rem 3.2rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'inherit',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(255,45,31,0.6)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: '3/4', borderRadius: '20px' }} />
            ))}
          </div>
        ) : results.length > 0 ? (
          <>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              {query ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"` : `${results.length} products`}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {results.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '5rem', color: 'rgba(255,255,255,0.05)', lineHeight: 1 }}>NO RESULTS</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '-1rem', marginBottom: '2rem' }}>
              Nothing matched "{query}" — try a different search.
            </p>
            <button onClick={() => setQuery('')} className="btn-secondary">
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
