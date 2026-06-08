'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import type { ShopifyCustomer } from '@/lib/shopify'

const TOKEN_KEY = 'ek_customer_token'

interface CustomerContextType {
  customer: ShopifyCustomer | null
  accessToken: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const CustomerContext = createContext<CustomerContextType>({
  customer: null,
  accessToken: null,
  loading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
})

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<ShopifyCustomer | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // On mount: restore saved token and fetch customer data
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) { setLoading(false); return }
    setAccessToken(token)
    fetch(`/api/auth/customer?token=${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then(c => {
        if (c?.id) {
          setCustomer(c)
        } else {
          localStorage.removeItem(TOKEN_KEY)
          setAccessToken(null)
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setAccessToken(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok || !data.accessToken) {
        return { success: false, error: data.error || 'Login failed. Check your email and password.' }
      }
      localStorage.setItem(TOKEN_KEY, data.accessToken)
      setAccessToken(data.accessToken)
      const cRes = await fetch(`/api/auth/customer?token=${encodeURIComponent(data.accessToken)}`)
      const c = await cRes.json()
      if (c?.id) setCustomer(c)
      return { success: true }
    } catch {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }, [])

  const register = useCallback(async (
    email: string, password: string, firstName: string, lastName: string
  ) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName }),
      })
      const data = await res.json()
      if (!res.ok) return { success: false, error: data.error || 'Registration failed.' }
      return login(email, password)
    } catch {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }, [login])

  const logout = useCallback(async () => {
    try {
      if (accessToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken }),
        })
      }
    } catch {}
    localStorage.removeItem(TOKEN_KEY)
    setAccessToken(null)
    setCustomer(null)
  }, [accessToken])

  return (
    <CustomerContext.Provider value={{ customer, accessToken, loading, login, register, logout }}>
      {children}
    </CustomerContext.Provider>
  )
}

export function useCustomer() {
  return useContext(CustomerContext)
}
