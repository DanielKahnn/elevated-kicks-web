import { NextResponse } from 'next/server'
import { getCustomer } from '@/lib/shopify'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')
    if (!token) return NextResponse.json(null)
    const customer = await getCustomer(token)
    return NextResponse.json(customer)
  } catch {
    return NextResponse.json(null)
  }
}
