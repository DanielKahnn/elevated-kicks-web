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
    <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
        {[0, 1, 2].map(i => (
          <div key={i} className="skeleton" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gold-border)' }} />
        ))}
      </div>
    </div>
  )

  if (!product) return (
    <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>
      <h1 style={{ fontFamily: '\'Playfair Display\', Georgia, serif', fontSize: '3rem', color: 'var(--text)' }}>
        Product Not Found
      </h1>
      <Link href="/" className="btn-secondary" style={{ marginTop: '2rem', display: 'inline-flex' }}>← Back Home</Link>
    </div>
  )

  const shopifyImages = product.images.edges.map(e => e.node)
  const overrideUrls = PRODUCT_IMAGES[product.handle] ?? []
  const allImages: Array<{ url: string; altText: string | null }> =
    shopifyImages.length > 0
      ? shopifyImages
      : overrideUrls.map(url => ({ url, altText: product.title }))

  const variants = product.variants.edges.map(e => e.node)
  const sizeVariants = variants.filter(v => v.title !== 'Default Title')
  const selectedVariant = variants[selectedVariantIdx] ?? variants[0]
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
    <div style={{ padding: '5rem 0 7rem', position: 'relative', zIndex: 1 }}>
      <div className="container">
        <Link href="/" className={styles.backLink}>
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
                  sizes="(max-width: 900px) 100vw, 55vw"
                  style={{ objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)' }}
                  priority
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '\'Playfair Display\', Georgia, serif', fontStyle: 'italic', fontSize: '4rem', color: 'var(--text-faint)' }}>EK</div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className={styles.thumbs}>
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.thumb} ${i === selectedImageIdx ? styles.thumbActive : ''}`}
                    onClick={() => setSelectedImageIdx(i)}
                    aria-label={`View image ${i + 1}`}
                  >
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

            {/* Size selector */}
            {sizeVariants.length > 0 && (
              <div className={styles.variantSection}>
                <p className={styles.variantLabel}>
                  Size: <strong>{selectedVariant?.title}</strong>
                  {!selectedVariant?.availableForSale && (
                    <span style={{ color: '#e55', fontWeight: 400, marginLeft: '0.5rem' }}>(Sold Out)</span>
                  )}
                </p>
                <div className={styles.variants}>
                  {sizeVariants.map((v) => {
                    const idx = variants.findIndex(vi => vi.id === v.id)
                    return (
                      <button
                        key={v.id}
                        className={`${styles.variantBtn} ${idx === selectedVariantIdx ? styles.variantSelected : ''} ${!v.availableForSale ? styles.variantSoldOut : ''}`}
                        onClick={() => setSelectedVariantIdx(idx)}
                        title={!v.availableForSale ? 'Sold out' : v.title}
                      >
                        {v.title}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Add to cart */}
            <button
              className={`btn-primary ${styles.addToCartBtn}`}
              onClick={handleAddToCart}
              disabled={!selectedVariant?.availableForSale}
              style={{ cursor: !selectedVariant?.availableForSale ? 'not-allowed' : 'pointer', opacity: !selectedVariant?.availableForSale ? 0.5 : 1 }}
            >
              {!selectedVariant?.availableForSale ? 'Sold Out' : addedToCart ? '✓ Added to Cart' : 'Add to Cart →'}
            </button>

            {addedToCart && (
              <div className={styles.addedMsg}>
                <Link href="/cart" style={{ color: 'var(--gold)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                  View Cart →
                </Link>
              </div>
            )}

            {/* Guarantees */}
            <div className={styles.guarantees}>
              {[
                ['100% Authenticated', 'Every pair verified before it ships'],
                ['Free Shipping', 'On all orders to the Houston area'],
                ['Secure Checkout', 'Powered by Shopify'],
              ].map(([title, sub]) => (
                <div key={title} className={styles.guarantee}>
                  <svg className={styles.guaranteeIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span><strong style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{title}</strong> — {sub}</span>
                </div>
              ))}
            </div>

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
