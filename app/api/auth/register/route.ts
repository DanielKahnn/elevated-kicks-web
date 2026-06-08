import { NextResponse } from 'next/server'
import { customerCreate } from '@/lib/shopify'

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json()
    const { errors } = await customerCreate(email, password, firstName, lastName)
    if (errors.length) return NextResponse.json({ error: errors[0] }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
  }
}
