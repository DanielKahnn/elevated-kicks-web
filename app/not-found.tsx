import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', position: 'relative', zIndex: 1 }}>
      <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(6rem, 20vw, 16rem)', color: 'rgba(255,255,255,0.06)', lineHeight: 1 }}>404</h1>
      <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.5rem', marginTop: '-2rem', marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}>The page you're looking for doesn't exist.</p>
      <Link href="/" className="btn-primary">Back to Home</Link>
    </div>
  )
}
