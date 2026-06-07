import Link from 'next/link'
import Image from 'next/image'
import { getCollections, getFeaturedProducts } from '@/lib/shopify'
import ProductCard from '@/components/ProductCard'
import styles from './page.module.css'

export default async function HomePage() {
  const [collections, products] = await Promise.all([
    getCollections(),
    getFeaturedProducts(8),
  ])

  return (
    <div className="page-enter">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>Houston's Premier Sneaker Store</p>
          <h1 className={styles.heroTitle}>
            FUEL YOUR<br />
            <span className={styles.heroAccent}>ROTATION</span>
          </h1>
          <p className={styles.heroSub}>
            Authentic Jordans, Kobes, and fire apparel —<br />
            curated for culture, style, and everyday heat.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/collections/sneakers" className="btn-primary">
              Shop Sneakers
            </Link>
            <Link href="/collections" className="btn-secondary">
              All Collections
            </Link>
          </div>
        </div>
        {/* Background glow accent */}
        <div className={styles.heroGlow} aria-hidden="true" />
      </section>

      {/* ── Collections ────────────────────────────────────── */}
      {collections.length > 0 && (
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <p className="section-sub">Shop by Category</p>
              <h2 className="section-heading">Collections</h2>
              <div className="section-divider" />
            </div>
            <div className={styles.collectionsGrid}>
              {collections.slice(0, 4).map((col) => (
                <Link key={col.id} href={`/collections/${col.handle}`} className={styles.collectionCard}>
                  <div className={styles.collectionImg}>
                    {col.image ? (
                      <Image
                        src={col.image.url}
                        alt={col.image.altText ?? col.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className={styles.collectionImgEl}
                      />
                    ) : (
                      <div className={styles.collectionPlaceholder} />
                    )}
                    <div className={styles.collectionOverlay} />
                  </div>
                  <div className={styles.collectionLabel}>
                    <h3 className={styles.collectionTitle}>{col.title}</h3>
                    <span className={styles.collectionArrow}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Products ───────────────────────────────── */}
      {products.length > 0 && (
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <p className="section-sub">Best Sellers</p>
              <h2 className="section-heading">Hot Right Now</h2>
              <div className="section-divider" />
            </div>
            <div className={styles.productsGrid}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Link href="/collections" className="btn-secondary">
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Brand Statement ─────────────────────────────────── */}
      <section className={styles.brandSection}>
        <div className="container">
          <div className={styles.brandInner}>
            <div>
              <p className="section-sub">Why Elevated Kicks</p>
              <h2 className={styles.brandTitle}>BUILT FOR<br />THE CULTURE</h2>
              <p className={styles.brandText}>
                We're not just selling shoes — we're curating heat. Every pair in our store
                is authenticated, sourced, and selected for Houston's sneaker community.
              </p>
              <Link href="/collections" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-flex' }}>
                Shop Now
              </Link>
            </div>
            <div className={styles.brandStats}>
              {[
                { num: '500+', label: 'Pairs In Stock' },
                { num: '100%', label: 'Authenticated' },
                { num: 'HTX', label: 'Based & Proud' },
              ].map(({ num, label }) => (
                <div key={label} className={styles.statBox}>
                  <span className={styles.statNum}>{num}</span>
                  <span className={styles.statLabel}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
