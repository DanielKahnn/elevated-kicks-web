'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCustomer } from '@/context/CustomerContext'
import { formatPrice } from '@/lib/shopify'
import styles from './page.module.css'

export default function AccountPage() {
  const { customer, loading, login, register, logout } = useCustomer()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const result = await login(loginEmail, loginPassword)
    if (!result.success) setError(result.error || 'Login failed.')
    setSubmitting(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (regPassword !== confirmPassword) { setError('Passwords do not match.'); return }
    if (regPassword.length < 5) { setError('Password must be at least 5 characters.'); return }
    setSubmitting(true)
    const result = await register(regEmail, regPassword, firstName, lastName)
    if (!result.success) setError(result.error || 'Registration failed.')
    else setSuccess('Account created! Welcome to Elevated Kicks.')
    setSubmitting(false)
  }

  const handleLogout = async () => {
    await logout()
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container" style={{ textAlign: 'center', padding: '6rem 0', color: 'rgba(255,255,255,0.4)' }}>
          Loading…
        </div>
      </div>
    )
  }

  // ── Logged in — dashboard ─────────────────────────────────────
  if (customer) {
    const orders = customer.orders.edges.map(e => e.node)
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.dashHeader}>
            <div>
              <h1 className={styles.title}>
                Welcome back, {customer.firstName || 'Sneakerhead'}
              </h1>
              <p className={styles.subtitle}>{customer.email}</p>
            </div>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Sign Out
            </button>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Order History</h2>
            {orders.length === 0 ? (
              <div className={styles.emptyOrders}>
                <p>No orders yet.</p>
                <Link href="/collections/sneakers" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                  Shop Sneakers
                </Link>
              </div>
            ) : (
              <div className={styles.orderList}>
                {orders.map(order => (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <div>
                        <span className={styles.orderNum}>Order #{order.orderNumber}</span>
                        <span className={styles.orderDate}>
                          {new Date(order.processedAt).toLocaleDateString('en-US', {
                            month: 'long', day: 'numeric', year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className={styles.orderMeta}>
                        <span className={`${styles.badge} ${order.fulfillmentStatus === 'FULFILLED' ? styles.badgeFulfilled : styles.badgePending}`}>
                          {order.fulfillmentStatus.replace(/_/g, ' ')}
                        </span>
                        <span className={styles.orderTotal}>{formatPrice(order.totalPrice)}</span>
                      </div>
                    </div>
                    <div className={styles.orderItems}>
                      {order.lineItems.edges.map(({ node: item }, i) => (
                        <div key={i} className={styles.orderItem}>
                          {item.variant?.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.variant.image.url}
                              alt={item.variant.image.altText || item.title}
                              className={styles.itemImg}
                            />
                          )}
                          <div className={styles.itemInfo}>
                            <span className={styles.itemTitle}>{item.title}</span>
                            <span className={styles.itemQty}>Qty: {item.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Logged out — login / register ─────────────────────────────
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.authWrap}>
          <h1 className={styles.title}>My Account</h1>
          <p className={styles.subtitle}>Sign in to view your orders and manage your account.</p>

          <div className={styles.tabs}>
            <button
              className={`${styles.tabBtn} ${tab === 'login' ? styles.tabActive : ''}`}
              onClick={() => { setTab('login'); setError(''); setSuccess('') }}
            >
              Sign In
            </button>
            <button
              className={`${styles.tabBtn} ${tab === 'register' ? styles.tabActive : ''}`}
              onClick={() => { setTab('register'); setError(''); setSuccess('') }}
            >
              Create Account
            </button>
          </div>

          <div className={styles.formCard}>
            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.successMsg}>{success}</div>}

            {tab === 'login' ? (
              <form onSubmit={handleLogin} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>Email</label>
                  <input
                    type="email" required
                    className={styles.input}
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Password</label>
                  <input
                    type="password" required
                    className={styles.input}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={submitting}>
                  {submitting ? 'Signing in…' : 'Sign In'}
                </button>
                <p className={styles.switchHint}>
                  Don&apos;t have an account?{' '}
                  <button type="button" className={styles.switchLink} onClick={() => { setTab('register'); setError('') }}>
                    Create one
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister} className={styles.form}>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>First Name</label>
                    <input
                      type="text" required
                      className={styles.input}
                      placeholder="Jordan"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Last Name</label>
                    <input
                      type="text" required
                      className={styles.input}
                      placeholder="Smith"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email</label>
                  <input
                    type="email" required
                    className={styles.input}
                    placeholder="you@example.com"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Password</label>
                  <input
                    type="password" required minLength={5}
                    className={styles.input}
                    placeholder="Min 5 characters"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Confirm Password</label>
                  <input
                    type="password" required
                    className={styles.input}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={submitting}>
                  {submitting ? 'Creating account…' : 'Create Account'}
                </button>
                <p className={styles.switchHint}>
                  Already have an account?{' '}
                  <button type="button" className={styles.switchLink} onClick={() => { setTab('login'); setError('') }}>
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
