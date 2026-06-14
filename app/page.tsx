import Link from 'next/link'
import Image from 'next/image'
import { getFeaturedProducts } from '@/lib/shopify'
import { PRODUCT_IMAGES } from '@/lib/productImages'
import ProductCard from '@/components/ProductCard'
import styles from './page.module.css'

export default async function HomePage() {
  const products = await getFeaturedProducts(8)

  const heroProduct = products[0]
  const heroImageUrl = heroProduct?.featuredImage?.url ?? PRODUCT_IMAGES[heroProduct?.handle]?.[0] ?? null
  const featuredProducts = products.slice(0, 4)
  const archiveProducts = products.slice(4)

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <p className={`${styles.heroEyebrow} reveal`}>Houston · Est. 2024</p>
          <h1 className={`${styles.heroTitle} reveal-clip delay-1`}>
            The Art of<br />
            the <em className={styles.heroItalic}>Sneaker.</em>
          </h1>
          <p className={`${styles.heroSub} reveal delay-2`}>
            Houston's premier destination for authenticated Jordans, Kobes,
            and limited releases — curated for those who move with culture.
          </p>
          <div className={`${styles.heroCtas} reveal delay-3`}>
            <Link href="/collections/sneakers" className="btn-primary">Shop Sneakers</Link>
            <Link href="/collections" className="btn-secondary">All Collections</Link>
          </div>

          {/* Stats row */}
          <div className={`${styles.heroStats} reveal delay-4`}>
            {[
              { n: '26', suffix: '+', label: 'Exclusive Pairs' },
              { n: '100', suffix: '%', label: 'Authenticated' },
              { n: 'HTX', suffix: '', label: 'Based & Proud', raw: true },
            ].map(({ n, suffix, label, raw }) => (
              <div key={label} className={styles.heroStat}>
                <span
                  className={styles.heroStatNum}
                  {...(!raw ? { 'data-count': n, 'data-suffix': suffix } : {})}
                >
                  {n}{suffix}
                </span>
                <span className={styles.heroStatLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${styles.heroRight} reveal-zoom delay-2`}>
          {heroImageUrl ? (
            <div className={`${styles.heroImgWrap} parallax`} data-speed="0.08">
              <Image
                src={heroImageUrl}
                alt={heroProduct?.title ?? 'Featured sneaker'}
                fill
                priority
                quality={90}
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: 'contain' }}
                className="float"
              />
              {heroProduct && (
                <div className={styles.heroImgLabel}>
                  <span className={styles.heroImgName}>{heroProduct.title}</span>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.heroImgPlaceholder}>
              <span>EK</span>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator} aria-hidden="true">
          <div className={styles.scrollLine} />
          <span className={styles.scrollLabel}>Scroll</span>
        </div>
      </section>

      {/* ── Ticker ────────────────────────────────────────────── */}
      <div className={styles.ticker} aria-hidden="true">
        <div className="ticker-track">
          {[...Array(2)].map((_, i) => (
            <span key={i} className={styles.tickerInner}>
              {['Authentic Sneakers', 'Houston', 'Air Jordan', 'Kobe Bryant', 'Limited Drops', 'Est. 2024', 'Elevated Kicks', 'Free Shipping', 'HTX Culture'].map(item => (
                <span key={item} className={styles.tickerItem}>{item} <span className={styles.tickerDot}>·</span></span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── Latest Drops ─────────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className={styles.section}>
          <div className="container">
            <div className={`${styles.sectionHeader} reveal`}>
              <p className="section-sub">Fresh Arrivals</p>
              <h2 className={`${styles.sectionTitle} reveal-clip delay-1`}>Latest Drops</h2>
              <div className="section-divider" />
            </div>

            <div className={styles.featuredGrid}>
              {/* Large hero card */}
              <Link href={`/products/${featuredProducts[0].handle}`} className={`${styles.featuredHero} reveal-zoom`}>
                <div className={styles.featuredHeroImg}>
                  {(() => {
                    const img = featuredProducts[0].featuredImage?.url ?? PRODUCT_IMAGES[featuredProducts[0].handle]?.[0]
                    return img ? (
                      <Image src={img} alt={featuredProducts[0].title} fill quality={90} sizes="(max-width: 900px) 100vw, 45vw" />
                    ) : <div className={styles.noImg} />
                  })()}
                  <div className={styles.featuredHeroInfo}>
                    <p className={styles.featuredTag}>Featured Drop</p>
                    <h3 className={styles.featuredHeroTitle}>{featuredProducts[0].title}</h3>
                    <p style={{ color: 'var(--gold)', fontFamily: '\'Playfair Display\', Georgia, serif', fontWeight: 600, fontSize: '1.1rem', marginTop: '0.35rem' }}>
                      From ${parseFloat(featuredProducts[0].priceRange.minVariantPrice.amount).toFixed(0)}
                    </p>
                    <span className={styles.featuredCta}>Shop Now →</span>
                  </div>
                </div>
              </Link>

              {/* Side cards */}
              <div className={styles.featuredSide}>
                {featuredProducts.slice(1, 4).map((product, i) => {
                  const img = product.featuredImage?.url ?? PRODUCT_IMAGES[product.handle]?.[0]
                  return (
                    <Link key={product.id} href={`/products/${product.handle}`} className={`${styles.featuredCard} reveal delay-${i + 1}`}>
                      <div className={styles.featuredCardImg}>
                        {img ? (
                          <Image src={img} alt={product.title} fill quality={90} sizes="30vw" />
                        ) : <div className={styles.noImg} />}
                      </div>
                      <div className={styles.featuredCardInfo}>
                        <h3 className={styles.featuredCardTitle}>{product.title}</h3>
                        <span className={styles.featuredCardPrice}>
                          From ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(0)}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className={`${styles.viewAll} reveal`}>
              <Link href="/collections/sneakers" className="btn-secondary">View All Sneakers →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Collections Banner ────────────────────────────────── */}
      <section className={styles.collectionsSection}>
        <div className={styles.collectionsInner}>
          {[
            { title: 'Sneakers', sub: 'Jordans, Kobes & More', href: '/collections/sneakers' },
            { title: 'Apparel', sub: 'Fresh Fits for Every Day', href: '/collections/apparel' },
          ].map(({ title, sub, href }, i) => (
            <Link key={title} href={href} className={`${styles.collectionPanel} reveal-zoom delay-${i + 1}`}>
              <div className={styles.collectionPanelOverlay} />
              <div className={styles.collectionPanelContent}>
                <p className={styles.collectionPanelSub}>{sub}</p>
                <h2 className={`${styles.collectionPanelTitle} reveal-clip delay-${i + 2}`}>{title}</h2>
                <span className={styles.collectionPanelCta}>Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Brand Statement ───────────────────────────────────── */}
      <section className={styles.statementSection}>
        <div className="container">
          <div className={styles.statementInner}>
            <div className={`${styles.statementLine} reveal delay-1`} />
            <blockquote className={`${styles.statementQuote} reveal-clip delay-2`}>
              "Where Houston Meets The Culture"
            </blockquote>
            <p className={`${styles.statementSub} reveal delay-3`}>
              Every pair authenticated. Every drop curated. Every customer respected.
            </p>
            <div className={`${styles.statementLine} reveal delay-4`} />
          </div>
        </div>
      </section>

      {/* ── Archive Products ──────────────────────────────────── */}
      {archiveProducts.length > 0 && (
        <section className={styles.section}>
          <div className="container">
            <div className={`${styles.sectionHeader} reveal`}>
              <p className="section-sub">More Heat</p>
              <h2 className={styles.sectionTitle}>From The Archive</h2>
              <div className="section-divider" />
            </div>
            <div className={styles.productsGrid}>
              {archiveProducts.map((product, i) => (
                <div key={product.id} className={`reveal delay-${(i % 4) + 1}`}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
