'use client'
import Link from 'next/link'
import Image from 'next/image'
import { type ShopifyProduct, formatPrice } from '@/lib/shopify'
import { PRODUCT_IMAGES } from '@/lib/productImages'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }: { product: ShopifyProduct }) {
  const price = product.priceRange.minVariantPrice
  const compareAt = product.variants.edges[0]?.node?.compareAtPrice
  const onSale = compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount)

  const shopifyImage = product.featuredImage
  const overrideUrls = PRODUCT_IMAGES[product.handle]
  const imageUrl = shopifyImage?.url ?? overrideUrls?.[0] ?? null
  const imageAlt = shopifyImage?.altText ?? product.title

  return (
    <Link href={`/products/${product.handle}`} className={styles.card}>
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
        {onSale && <span className={styles.saleBadge}>Sale</span>}
        <div className={styles.hoverOverlay}>
          <span className={styles.shopNow}>View →</span>
        </div>
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{product.title}</h3>
        <div className={styles.priceRow}>
          <span className={onSale ? styles.salePrice : styles.price}>{formatPrice(price)}</span>
          {onSale && compareAt && (
            <span className={styles.comparePrice}>{formatPrice(compareAt)}</span>
          )}
        </div>
      </div>
      <div className={styles.goldBar} />
    </Link>
  )
}
