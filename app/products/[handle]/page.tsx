'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, type ShopifyProduct } from '@/lib/shopify'
import { useCart } from '@/context/CartContext'
import { PRODUCT_IMAGES } from '@/lib/productImages'
import styles from './page.module.css'

export default function ProductPage() {
  const params = useParams()
  const handle = params.handle as string
  const { addToCart } = useCart()

  const [product, setProduct] = useState<ShopifyProduct | null>(null)
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0)
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    fetch(`/api/products/${handle}`)
      .then(r => r.json())
      .then(p => { setProduct(p); setLoading(false) })
      .catch(() => setLoading(false))
  }, [handle])

  if (loading) return (
    <div style={{ padding: '8rem 2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
      <div className="skeleton" style={{ width: '200px', height: '24px', margin: '0 auto' }} />
    </div>
  )
  if (!product) return (
    <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '3rem' }}>Product Not Found</h1>
      <Link href="/" className="btn-secondary" style={{ marginTop: '2rem', display: 'inline-flex' }}>← Back Home</Link>
    </div>
  )

  const shopifyImages = product.images.edges.map(e => e.node)
  const overrideUrls = PRODUCT_IMAGES[product.handle] ?? []

  // Build a unified image list: prefer Shopify-hosted, fall back to CDN map
  const allImages: Array<{ url: string; altText: string | null }> =
    shopifyImages.length > 0
      ? shopifyImages
      : overrideUrls.map(url => ({ url, altText: product.title }))

  const variants = product.variants.edges.map(e => e.node)
  const selectedVariant = variants[selectedVariantIdx]
  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice
  const compareAt = selectedVariant?.compareAtPrice
  const onSale = compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount)
  const displayImage = allImages[selectedImageIdx] ?? null

  const handleAddToCart = () => {
    if (!selectedVariant?.availableForSale) return
    const cartImage = product.featuredImage ?? (allImages[0] ? { url: allImages[0].url, altText: allImages[0].altText, width: 800, height: 800 } : null)
    addToCart({
      variantId: selectedVariant.id,
      productHandle: product.handle,
      productTitle: product.title,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      image: cartImage,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="page-enter" style={{ padding: '4rem 0 6rem', position: 'relative', zIndex: 1 }}>
      <div className="container">
        <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2rem' }}>
          ← Back
        </Link>

        <div className={styles.layout}>
          {/* Images */}
          <div className={styles.images}>
            <div className={styles.mainImage}>
              {displayImage ? (
                <Image
                  src={displayImage.url}
                  alt={displayImage.altText ?? product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 55vw"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.1)', fontFamily: 'Bebas Neue, sans-serif', fontSize: '4rem' }}>EK</div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className={styles.thumbs}>
                {allImages.map((img, i) => (
                  <button key={i} className={`${styles.thumb} ${i === selectedImageIdx ? styles.thumbActive : ''}`} onClick={() => setSelectedImageIdx(i)}>
                    <Image src={img.url} alt={img.altText ?? ''} fill style={{ objectFit: 'cover' }} sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className={styles.info}>
            <h1 className={styles.title}>{product.title}</h1>
            <div className={styles.priceRow}>
              <span className={onSale ? styles.salePrice : styles.price}>{formatPrice(price)}</span>
              {onSale && compareAt && <span className={styles.comparePrice}>{formatPrice(compareAt)}</span>}
              {onSale && <span className={styles.saleBadge}>SALE</span>}
            </div>

            {/* Variants */}
            {variants.length > 1 && (
              <div className={styles.variantSection}>
                <p className={styles.variantLabel}>Select: <strong>{selectedVariant?.title}</strong></p>
                <div className={styles.variants}>
                  {variants.map((v, i) => (
                    <button
                      key={v.id}
                      className={`${styles.variantBtn} ${i === selectedVariantIdx ? styles.variantSelected : ''} ${!v.availableForSale ? styles.variantSoldOut : ''}`}
                      onClick={() => setSelectedVariantIdx(i)}
                      disabled={!v.availableForSale}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to cart */}
            <button
              className="btn-primary"
              onClick={handleAddToCart}
              disabled={!selectedVariant?.availableForSale}
              style={{ width: '100%', marginTop: '1.5rem', fontSize: '1rem', padding: '1rem 2rem' }}
            >
              {!selectedVariant?.availableForSale ? 'Sold Out' : addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>

            {addedToCart && (
              <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                <Link href="/cart" style={{ color: '#FF7B28', fontSize: '0.85rem', textDecoration: 'underline' }}>
                  View Cart →
                </Link>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className={styles.description}>
                <p>{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
