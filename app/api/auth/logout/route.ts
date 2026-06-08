import { NextResponse } from 'next/server'
import { customerLogout } from '@/lib/shopify'

export async function POST(req: Request) {
  try {
    const { accessToken } = await req.json()
    if (accessToken) await customerLogout(accessToken)
  } catch {}
  return NextResponse.json({ success: true })
}
