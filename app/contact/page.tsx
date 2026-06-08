'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      })
      if (res.ok) {
        setSent(true)
        setName(''); setEmail(''); setSubject(''); setMessage('')
      } else {
        setError('Something went wrong. Please try again or email us directly.')
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setSubmitting(false)
  }

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Contact Us</h1>
          <p className={styles.heroSub}>
            Questions about an order, a product, or just want to talk sneakers? We&apos;re here for it.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Info Panel */}
          <div className={styles.infoPanel}>
            <h2 className={styles.infoTitle}>Get in Touch</h2>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <p className={styles.infoLabel}>Email</p>
                <a href="mailto:info@elevatedkickshou.com" className={styles.infoValue}>
                  info@elevatedkickshou.com
                </a>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <p className={styles.infoLabel}>Location</p>
                <p className={styles.infoValue}>Houston, TX</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <p className={styles.infoLabel}>Hours</p>
                <p className={styles.infoValue}>Mon–Sat: 10am – 7pm</p>
                <p className={styles.infoValue}>Sun: 12pm – 5pm</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.88a16 16 0 0 0 6.29 6.29l.88-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z"/>
                </svg>
              </div>
              <div>
                <p className={styles.infoLabel}>Phone</p>
                <a href="tel:+17135550100" className={styles.infoValue}>(713) 555-0100</a>
              </div>
            </div>

            <div className={styles.social}>
              <p className={styles.infoLabel} style={{ marginBottom: '0.75rem' }}>Follow Us</p>
              <div className={styles.socialLinks}>
                <a href="https://instagram.com/elevatedkickshou" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  Instagram
                </a>
                <a href="https://twitter.com/elevatedkicks" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  Twitter / X
                </a>
              </div>
            </div>
          </div>

          {/* Form Panel */}
          <div className={styles.formPanel}>
            {sent ? (
              <div className={styles.successWrap}>
                <div className={styles.successIcon}>✓</div>
                <h3 className={styles.successTitle}>Message Sent!</h3>
                <p className={styles.successText}>
                  Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
                <button className="btn-secondary" onClick={() => setSent(false)} style={{ marginTop: '1.5rem' }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.formTitle}>Send a Message</h2>

                {error && <div className={styles.errorMsg}>{error}</div>}

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Name</label>
                    <input
                      type="text" required
                      className={styles.input}
                      placeholder="Your name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Email</label>
                    <input
                      type="email" required
                      className={styles.input}
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Subject</label>
                  <input
                    type="text" required
                    className={styles.input}
                    placeholder="Order question, product inquiry, etc."
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Message</label>
                  <textarea
                    required rows={5}
                    className={styles.textarea}
                    placeholder="Tell us how we can help…"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', fontSize: '1rem' }} disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
