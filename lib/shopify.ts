// ============================================================
// ELEVATED KICKS — Shopify Storefront API Client
// ============================================================

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN!
const API_VERSION = '2024-01'
const API_URL = `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`

// ── Core fetcher ─────────────────────────────────────────────
async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Shopify-Storefront-Private-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }, // cache for 60s, auto-revalidate
  })

  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`)
  const { data, errors } = await res.json()
  if (errors) throw new Error(errors[0].message)
  return data
}

// ── Types ─────────────────────────────────────────────────────
export interface ShopifyImage {
  url: string
  altText: string | null
  width?: number
  height?: number
}

export interface ShopifyMoney {
  amount: string
  currencyCode: string
}

export interface ShopifyVariant {
  id: string
  title: string
  availableForSale: boolean
  price: ShopifyMoney
  compareAtPrice: ShopifyMoney | null
}

export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  featuredImage: ShopifyImage | null
  images: { edges: { node: ShopifyImage }[] }
  priceRange: { minVariantPrice: ShopifyMoney; maxVariantPrice: ShopifyMoney }
  variants: { edges: { node: ShopifyVariant }[] }
  tags: string[]
}

export interface ShopifyCollection {
  id: string
  title: string
  handle: string
  description: string
  image: ShopifyImage | null
  products: { edges: { node: ShopifyProduct }[] }
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: { totalAmount: ShopifyMoney; subtotalAmount: ShopifyMoney }
  lines: {
    edges: {
      node: {
        id: string
        quantity: number
        merchandise: { id: string; title: string; product: { title: string; featuredImage: ShopifyImage | null }; price: ShopifyMoney }
      }
    }[]
  }
}

// ── Fragments ─────────────────────────────────────────────────
const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id title handle description descriptionHtml tags
    featuredImage { url altText width height }
    images(first: 8) { edges { node { url altText width height } } }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    variants(first: 20) {
      edges { node { id title availableForSale
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
      } }
    }
  }
`

// ── Queries ───────────────────────────────────────────────────
export async function getCollections(): Promise<ShopifyCollection[]> {
  const query = `
    query Collections {
      collections(first: 12) {
        edges { node {
          id title handle description
          image { url altText width height }
          products(first: 1) { edges { node { featuredImage { url altText } } } }
        } }
      }
    }
  `
  const data = await shopifyFetch<{ collections: { edges: { node: ShopifyCollection }[] } }>(query)
  return data.collections.edges.map(e => e.node)
}

export async function getCollection(handle: string): Promise<ShopifyCollection | null> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query Collection($handle: String!) {
      collectionByHandle(handle: $handle) {
        id title handle description
        image { url altText width height }
        products(first: 50) { edges { node { ...ProductFields } } }
      }
    }
  `
  const data = await shopifyFetch<{ collectionByHandle: ShopifyCollection | null }>(query, { handle })
  return data.collectionByHandle
}

export async function getFeaturedProducts(count = 8): Promise<ShopifyProduct[]> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query FeaturedProducts($count: Int!) {
      products(first: $count, sortKey: BEST_SELLING) {
        edges { node { ...ProductFields } }
      }
    }
  `
  const data = await shopifyFetch<{ products: { edges: { node: ShopifyProduct }[] } }>(query, { count })
  return data.products.edges.map(e => e.node)
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query Product($handle: String!) {
      productByHandle(handle: $handle) { ...ProductFields }
    }
  `
  const data = await shopifyFetch<{ productByHandle: ShopifyProduct | null }>(query, { handle })
  return data.productByHandle
}

export async function searchProducts(query: string): Promise<ShopifyProduct[]> {
  const gql = `
    ${PRODUCT_FRAGMENT}
    query Search($query: String!) {
      products(first: 20, query: $query) {
        edges { node { ...ProductFields } }
      }
    }
  `
  const data = await shopifyFetch<{ products: { edges: { node: ShopifyProduct }[] } }>(gql, { query })
  return data.products.edges.map(e => e.node)
}

// ── Cart mutations ────────────────────────────────────────────
const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id checkoutUrl totalQuantity
    cost { totalAmount { amount currencyCode } subtotalAmount { amount currencyCode } }
    lines(first: 50) {
      edges { node {
        id quantity
        merchandise { ... on ProductVariant {
          id title price { amount currencyCode }
          product { title featuredImage { url altText } }
        } }
      } }
    }
  }
`

export async function createCart(): Promise<ShopifyCart> {
  const query = `
    ${CART_FRAGMENT}
    mutation CartCreate { cartCreate { cart { ...CartFields } } }
  `
  const data = await shopifyFetch<{ cartCreate: { cart: ShopifyCart } }>(query)
  return data.cartCreate.cart
}

export async function addToCart(cartId: string, variantId: string, quantity = 1): Promise<ShopifyCart> {
  const query = `
    ${CART_FRAGMENT}
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } }
    }
  `
  const data = await shopifyFetch<{ cartLinesAdd: { cart: ShopifyCart } }>(query, {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  })
  return data.cartLinesAdd.cart
}

export async function removeFromCart(cartId: string, lineId: string): Promise<ShopifyCart> {
  const query = `
    ${CART_FRAGMENT}
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } }
    }
  `
  const data = await shopifyFetch<{ cartLinesRemove: { cart: ShopifyCart } }>(query, {
    cartId,
    lineIds: [lineId],
  })
  return data.cartLinesRemove.cart
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const query = `
    ${CART_FRAGMENT}
    query GetCart($cartId: ID!) { cart(id: $cartId) { ...CartFields } }
  `
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>(query, { cartId })
  return data.cart
}

// ── Helpers ───────────────────────────────────────────────────
export function formatPrice(money: ShopifyMoney): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode,
  }).format(parseFloat(money.amount))
}
