import { NextResponse } from 'next/server'
import { customerLogin } from '@/lib/shopify'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const { accessToken, errors } = await customerLogin(email, password)
    if (errors.length) return NextResponse.json({ error: errors[0] }, { status: 400 })
    return NextResponse.json({ accessToken })
  } catch {
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 })
  }
}
