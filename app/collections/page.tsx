import Link from 'next/link'
import Image from 'next/image'
import { getCollections } from '@/lib/shopify'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'All Collections — Elevated Kicks',
  description: 'Browse all sneaker and apparel collections at Elevated Kicks Houston.',
}

export default async function CollectionsPage() {
  const collections = await getCollections()

  return (
    <div style={{ padding: '6rem 0 8rem', position: 'relative', zIndex: 1 }}>
      <div className="container">
        <div className={`${styles.header} reveal`}>
          <p className="section-sub">Browse</p>
          <h1 style={{
            fontFamily: '\'Playfair Display\', Georgia, serif',
            fontSize: 'clamp(2.75rem, 6vw, 5rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            color: 'var(--text)',
          }}>
            All Collections
          </h1>
          <div className="section-divider" />
        </div>

        {collections.length > 0 ? (
          <div className={styles.grid}>
            {collections.map((col, i) => (
              <Link
                key={col.id}
                href={`/collections/${col.handle}`}
                className={`${styles.card} reveal delay-${(i % 4) + 1}`}
              >
                {col.image && (
                  <Image
                    src={col.image.url}
                    alt={col.image.altText ?? col.title}
                    fill
                    className={styles.cardImg}
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                )}
                <div className={styles.overlay} />
                <div className={styles.content}>
                  <p className={styles.tag}>Collection</p>
                  <h2 className={styles.title}>{col.title}</h2>
                  {col.description && (
                    <p className={styles.description}>
                      {col.description.slice(0, 80)}{col.description.length > 80 ? '…' : ''}
                    </p>
                  )}
                  <span className={styles.cta}>Explore →</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>No collections found. Add some in your Shopify admin.</p>
          </div>
        )}
      </div>
    </div>
  )
}
