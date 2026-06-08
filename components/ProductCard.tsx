'use client'
import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { type ShopifyProduct, formatPrice } from '@/lib/shopify'
import { PRODUCT_IMAGES } from '@/lib/productImages'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }: { product: ShopifyProduct }) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapperRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const rotateY = ((e.clientX - cx) / (rect.width / 2)) * 8
    const rotateX = -((e.clientY - cy) / (rect.height / 2)) * 8
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`
  }
  const onMouseLeave = () => {
    if (wrapperRef.current)
      wrapperRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)'
  }

  const price = product.priceRange.minVariantPrice
  const compareAt = product.variants.edges[0]?.node?.compareAtPrice
  const onSale = compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount)

  // Use Shopify image if available; fall back to our curated CDN map
  const shopifyImage = product.featuredImage
  const overrideUrls = PRODUCT_IMAGES[product.handle]
  const imageUrl = shopifyImage?.url ?? overrideUrls?.[0] ?? null
  const imageAlt = shopifyImage?.altText ?? product.title

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transition: 'transform 0.08s ease-out' }}
    >
      <Link href={`/products/${product.handle}`} className={styles.card}>
        {/* Image */}
        <div className={styles.imageWrap}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className={styles.image}
            />
          ) : (
            <div className={styles.noImage}>EK</div>
          )}
          {onSale && <span className={styles.saleBadge}>SALE</span>}
        </div>

        {/* Info */}
        <div className={styles.info}>
          <h3 className={styles.title}>{product.title}</h3>
          <div className={styles.priceRow}>
            <span className={onSale ? styles.salePrice : styles.price}>
              {formatPrice(price)}
            </span>
            {onSale && compareAt && (
              <span className={styles.comparePrice}>{formatPrice(compareAt)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
