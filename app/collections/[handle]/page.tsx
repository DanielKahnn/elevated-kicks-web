import { notFound } from 'next/navigation'
import { getCollection } from '@/lib/shopify'
import ProductCard from '@/components/ProductCard'
import type { Metadata } from 'next'

interface Props { params: { handle: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const col = await getCollection(params.handle)
  if (!col) return { title: 'Collection Not Found' }
  return { title: col.title, description: col.description }
}

export default async function CollectionPage({ params }: Props) {
  const collection = await getCollection(params.handle)
  if (!collection) notFound()

  const products = collection.products.edges.map(e => e.node)

  return (
    <div className="page-enter" style={{ padding: '4rem 0 6rem', position: 'relative', zIndex: 1 }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '3rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="section-sub" style={{ marginBottom: '0.5rem' }}>Collection</p>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '0.04em', lineHeight: 1, color: '#fff' }}>
            {collection.title}
          </h1>
          {collection.description && (
            <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '1rem', maxWidth: '600px', fontSize: '1rem', lineHeight: 1.7 }}>
              {collection.description}
            </p>
          )}
        </div>

        {/* Products */}
        {products.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '6rem 0', color: 'rgba(255,255,255,0.4)' }}>
            <p style={{ fontSize: '1.1rem' }}>No products in this collection yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
