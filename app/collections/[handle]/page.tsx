import { notFound } from 'next/navigation'
import { getCollection } from '@/lib/shopify'
import ProductCard from '@/components/ProductCard'
import type { Metadata } from 'next'

interface Props { params: { handle: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const col = await getCollection(params.handle)
  if (!col) return { title: 'Collection Not Found' }
  return { title: `${col.title} — Elevated Kicks`, description: col.description }
}

export default async function CollectionPage({ params }: Props) {
  const collection = await getCollection(params.handle)
  if (!collection) notFound()

  const products = collection.products.edges.map(e => e.node)

  return (
    <div style={{ padding: '6rem 0 8rem', position: 'relative', zIndex: 1 }}>
      <div className="container">
        {/* Header */}
        <div className="reveal" style={{ marginBottom: '3.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
          <p className="section-sub">Collection</p>
          <h1 style={{
            fontFamily: '\'Playfair Display\', Georgia, serif',
            fontSize: 'clamp(2.75rem, 6vw, 5.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            color: 'var(--text)',
          }}>
            {collection.title}
          </h1>
          {collection.description && (
            <p style={{
              color: 'var(--text-muted)',
              marginTop: '1.25rem',
              maxWidth: '560px',
              fontSize: '1rem',
              lineHeight: 1.75,
            }}>
              {collection.description}
            </p>
          )}
          <p style={{
            marginTop: '1rem',
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--text-faint)',
          }}>
            {products.length} {products.length === 1 ? 'Item' : 'Items'}
          </p>
        </div>

        {/* Products */}
        {products.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {products.map((product, i) => (
              <div key={product.id} className={`reveal delay-${(i % 4) + 1}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '8rem 0', color: 'var(--text-faint)' }}>
            <p style={{ fontSize: '1.1rem' }}>No products in this collection yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
