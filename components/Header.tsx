'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './Header.module.css'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>ELEVATED</span>
          <span className={styles.logoAccent}>KICKS</span>
        </Link>

        {/* Desktop nav */}
        <nav className={styles.nav}>
          <Link href="/collections" className={styles.navLink}>Collections</Link>
          <Link href="/collections/sneakers" className={styles.navLink}>Sneakers</Link>
          <Link href="/collections/apparel" className={styles.navLink}>Apparel</Link>
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          <Link href="/search" className={styles.iconBtn} aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </Link>
          <Link href="/cart" className={styles.iconBtn} aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </Link>
          {/* Mobile hamburger */}
          <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`}/>
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`}/>
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ''}`}/>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className={styles.mobileMenu}>
          <Link href="/collections" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Collections</Link>
          <Link href="/collections/sneakers" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Sneakers</Link>
          <Link href="/collections/apparel" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Apparel</Link>
          <Link href="/search" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Search</Link>
        </nav>
      )}
    </header>
  )
}
