import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()
    // Log submission — configure email sending here (Resend, SendGrid, etc.)
    console.log('[Contact Form]', { name, email, subject, message })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}
