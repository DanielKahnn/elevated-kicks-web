import { NextResponse } from 'next/server'

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN!
const API_URL = `https://${STORE_DOMAIN}/api/2024-01/graphql.json`

export async function POST(req: Request) {
  try {
    const { items } = await req.json()

    const lines = items.map((item: { variantId: string; quantity: number }) => ({
      merchandiseId: item.variantId,
      quantity: item.quantity,
    }))

    const mutation = `
      mutation CartCreate($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) {
          cart {
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Shopify-Storefront-Private-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query: mutation, variables: { lines } }),
    })

    const { data, errors } = await res.json()
    if (errors || data?.cartCreate?.userErrors?.length > 0) {
      return NextResponse.json({ error: 'Failed to create cart' }, { status: 500 })
    }

    // Shopify returns the checkout URL on the store's *primary* domain
    // (elevatedkickshou.com), which now points to this Vercel storefront and has
    // no /cart/c/... route — so it 404s. Force the checkout onto the myshopify.com
    // domain (Shopify's own servers) so the hosted checkout actually loads.
    const rawCheckoutUrl: string = data.cartCreate.cart.checkoutUrl
    const checkoutUrl = rawCheckoutUrl.replace(/^https?:\/\/[^/]+/, `https://${STORE_DOMAIN}`)
    return NextResponse.json({ checkoutUrl })
  } catch {
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
