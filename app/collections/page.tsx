import Link from 'next/link'
import Image from 'next/image'
import { getCollections } from '@/lib/shopify'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Collections',
  description: 'Browse all sneaker and apparel collections at Elevated Kicks Houston.',
}

export default async function CollectionsPage() {
  const collections = await getCollections()

  return (
    <div className="page-enter" style={{ padding: '4rem 0 6rem', position: 'relative', zIndex: 1 }}>
      <div className="container">
        <div style={{ marginBottom: '3rem' }}>
          <p className="section-sub" style={{ marginBottom: '0.5rem' }}>Browse</p>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '0.04em', lineHeight: 1 }}>
            All Collections
          </h1>
          <div className="section-divider" />
        </div>

        {collections.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {collections.map(col => (
              <Link key={col.id} href={`/collections/${col.handle}`} style={{ display: 'block', borderRadius: '20px', overflow: 'hidden', position: 'relative', aspectRatio: '4/3', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {col.image && (
                  <Image
                    src={col.image.url}
                    alt={col.image.altText ?? col.title}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 0.7s ease' }}
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,6,0.85) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem 1.8rem' }}>
                  <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', letterSpacing: '0.06em', color: '#fff' }}>
                    {col.title}
                  </h2>
                  {col.description && (
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      {col.description.slice(0, 80)}{col.description.length > 80 ? '…' : ''}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '6rem 0', color: 'rgba(255,255,255,0.4)' }}>
            <p>No collections found. Add some in your Shopify admin.</p>
          </div>
        )}
      </div>
    </div>
  )
}
