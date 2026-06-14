'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './Header.module.css'
import { useCart } from '@/context/CartContext'
import { useCustomer } from '@/context/CustomerContext'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { customer } = useCustomer()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Elevated <span className={styles.logoAccent}>Kicks</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/collections/sneakers" className={styles.navLink}>Sneakers</Link>
          <Link href="/collections/apparel" className={styles.navLink}>Apparel</Link>
          <Link href="/collections" className={styles.navLink}>Collections</Link>
          <Link href="/contact" className={styles.navLink}>Contact</Link>
        </nav>

        <div className={styles.actions}>
          <Link href="/search" className={styles.iconBtn} aria-label="Search">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </Link>

          <Link href="/account" className={styles.iconBtn} aria-label={customer ? 'My Account' : 'Sign in'} style={{ position: 'relative' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            {customer && <span className={styles.dot} />}
          </Link>

          <Link href="/cart" className={styles.cartBtn} aria-label="Cart">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {totalItems > 0 && <span className={styles.cartCount}>{totalItems > 9 ? '9+' : totalItems}</span>}
          </Link>

          <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span className={`${styles.bar} ${menuOpen ? styles.barX1 : ''}`}/>
            <span className={`${styles.bar} ${menuOpen ? styles.barX2 : ''}`}/>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className={styles.mobileMenu}>
          {[
            ['Sneakers', '/collections/sneakers'],
            ['Apparel', '/collections/apparel'],
            ['Collections', '/collections'],
            ['Contact', '/contact'],
            [customer ? 'My Account' : 'Sign In', '/account'],
          ].map(([label, href]) => (
            <Link key={href} href={href} className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
