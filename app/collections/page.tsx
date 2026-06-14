import Link from 'next/link'
import Image from 'next/image'
import { getCollections } from '@/lib/shopify'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Collections — Elevated Kicks',
  description: 'Browse all sneaker and apparel collections at Elevated Kicks Houston.',
}

export default async function CollectionsPage() {
  const collections = await getCollections()

  return (
    <div style={{ padding: '6rem 0 8rem', position: 'relative', zIndex: 1 }}>
      <div className="container">
        <div className="reveal" style={{ marginBottom: '4rem' }}>
          <p className="section-sub">Browse</p>
          <h1 style={{
            fontFamily: '\'Playfair Display\', Georgia, serif',
            fontSize: 'clamp(2.75rem, 6vw, 5rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            color: 'var(--text)',
            marginBottom: '0',
          }}>
            All Collections
          </h1>
          <div className="section-divider" />
        </div>

        {collections.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {collections.map((col, i) => (
              <Link
                key={col.id}
                href={`/collections/${col.handle}`}
                className={`reveal delay-${(i % 4) + 1}`}
                style={{
                  display: 'block',
                  overflow: 'hidden',
                  position: 'relative',
                  aspectRatio: '4/3',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  transition: 'border-color 0.4s, box-shadow 0.4s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--gold-border)';
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 16px 48px rgba(0,0,0,0.5)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
                }}
              >
                {col.image && (
                  <Image
                    src={col.image.url}
                    alt={col.image.altText ?? col.title}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)' }}
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,9,8,0.9) 0%, rgba(10,9,8,0.3) 55%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.75rem 2rem' }}>
                  <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
                    Collection
                  </p>
                  <h2 style={{
                    fontFamily: '\'Playfair Display\', Georgia, serif',
                    fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    color: 'var(--text)',
                    lineHeight: 1.15,
                  }}>
                    {col.title}
                  </h2>
                  {col.description && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.4rem', lineHeight: 1.5 }}>
                      {col.description.slice(0, 80)}{col.description.length > 80 ? '…' : ''}
                    </p>
                  )}
                  <span style={{
                    display: 'inline-block',
                    marginTop: '1rem',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    borderBottom: '1px solid var(--gold-border)',
                    paddingBottom: '2px',
                  }}>
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '8rem 0', color: 'var(--text-faint)' }}>
            <p style={{ fontSize: '1rem' }}>No collections found. Add some in your Shopify admin.</p>
          </div>
        )}
      </div>
    </div>
  )
}
