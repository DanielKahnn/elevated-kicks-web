import { NextResponse } from 'next/server'
import { getProduct } from '@/lib/shopify'

export async function GET(_req: Request, { params }: { params: { handle: string } }) {
  try {
    const product = await getProduct(params.handle)
    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}
