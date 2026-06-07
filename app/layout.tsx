import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import OrbLayer from '@/components/OrbLayer'

export const metadata: Metadata = {
  title: { default: 'Elevated Kicks — Houston\'s Premier Sneaker Store', template: '%s | Elevated Kicks' },
  description: 'Authentic sneakers curated for culture, style, and everyday heat. Jordans, Kobes, and more in Houston.',
  openGraph: {
    siteName: 'Elevated Kicks',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="ek-progress-bar" id="ek-progress" aria-hidden="true" />
        <OrbLayer />
        <Header />
        <main style={{ paddingTop: '68px' }}>
          {children}
        </main>
        <footer style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(4,4,6,0.98)',
          padding: '3rem 0',
          marginTop: '6rem',
          position: 'relative',
          zIndex: 1,
        }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', letterSpacing: '0.08em' }}>
              ELEVATED <span style={{ color: '#FF2D1F' }}>KICKS</span>
            </span>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
              © {new Date().getFullYear()} Elevated Kicks Houston. All rights reserved.
            </p>
          </div>
        </footer>
        <ProgressScript />
      </body>
    </html>
  )
}

function ProgressScript() {
  return (
    <script dangerouslySetInnerHTML={{ __html: `
      (function(){
        var bar = document.getElementById('ek-progress');
        if (!bar) return;
        function update() {
          var s = window.scrollY, t = document.documentElement.scrollHeight - window.innerHeight;
          bar.style.width = t > 0 ? (s/t*100)+'%' : '0%';
        }
        window.addEventListener('scroll', update, {passive:true});
        update();
      })();
    `}} />
  )
}
