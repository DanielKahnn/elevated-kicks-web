import { NextResponse } from 'next/server'
import { getFeaturedProducts } from '@/lib/shopify'

export async function GET() {
  try {
    // Fetch up to 50 products for client-side search filtering
    const products = await getFeaturedProducts(50)
    return NextResponse.json(products)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}
