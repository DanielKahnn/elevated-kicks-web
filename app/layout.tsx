import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import { CartProvider } from '@/context/CartContext'
import { CustomerProvider } from '@/context/CustomerContext'

export const metadata: Metadata = {
  title: { default: 'Elevated Kicks — Houston\'s Premier Sneaker Store', template: '%s | Elevated Kicks' },
  description: 'Authentic sneakers curated for culture, style, and everyday heat. Jordans, Kobes, and more in Houston.',
  openGraph: { siteName: 'Elevated Kicks', locale: 'en_US', type: 'website' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CustomerProvider>
        <CartProvider>
          <div className="ek-progress-bar" id="ek-progress" aria-hidden="true" />
          <Header />
          <main style={{ paddingTop: '80px' }}>{children}</main>

          {/* ── Footer ── */}
          <footer style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: '#080706',
            padding: '5rem 0 2.5rem',
            marginTop: '8rem',
          }}>
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
                {/* Brand */}
                <div>
                  <div style={{ fontFamily: '\'Playfair Display\', Georgia, serif', fontSize: '1.6rem', fontWeight: 600, letterSpacing: '-0.01em', marginBottom: '1.25rem' }}>
                    Elevated <span style={{ color: 'var(--gold)' }}>Kicks</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-faint)', lineHeight: 1.8, maxWidth: '260px' }}>
                    Houston's premier destination for authenticated sneakers — curated for culture, style, and everyday heat.
                  </p>
                </div>
                {/* Shop links */}
                <div>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem' }}>Shop</p>
                  <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {[['Sneakers', '/collections/sneakers'], ['Apparel', '/collections/apparel'], ['All Collections', '/collections']].map(([label, href]) => (
                      <a key={href} href={href} className="footer-link">{label}</a>
                    ))}
                  </nav>
                </div>
                {/* Company links */}
                <div>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem' }}>Company</p>
                  <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {[['Contact Us', '/contact'], ['My Account', '/account'], ['Search', '/search']].map(([label, href]) => (
                      <a key={href} href={href} className="footer-link">{label}</a>
                    ))}
                  </nav>
                </div>
              </div>
              <div style={{ height: '1px', background: 'var(--border)', marginBottom: '2rem' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <p style={{ color: 'var(--text-faint)', fontSize: '0.78rem' }}>© {new Date().getFullYear()} Elevated Kicks Houston. All rights reserved.</p>
                <p style={{ color: 'var(--text-faint)', fontSize: '0.78rem' }}>Houston, Texas</p>
              </div>
            </div>
          </footer>

          <ProgressScript />
          <RevealScript />
        </CartProvider>
        </CustomerProvider>
      </body>
    </html>
  )
}

function ProgressScript() {
  return (
    <script dangerouslySetInnerHTML={{ __html: `(function(){var bar=document.getElementById('ek-progress');if(!bar)return;function u(){var s=window.scrollY,t=document.documentElement.scrollHeight-window.innerHeight;bar.style.width=t>0?(s/t*100)+'%':'0%';}window.addEventListener('scroll',u,{passive:true});u();})();` }} />
  )
}

function RevealScript() {
  return (
    <script dangerouslySetInnerHTML={{ __html: `
(function(){
  var rm=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var SEL='.reveal,.reveal-left,.reveal-scale,.reveal-clip,.reveal-zoom';

  /* ── Scroll reveals ── */
  function showAll(){
    document.querySelectorAll(SEL).forEach(function(e){e.classList.add('in-view');});
  }
  if(rm){
    showAll();
  } else {
    var mo=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('in-view');mo.unobserve(e.target);}
      });
    },{threshold:0.07,rootMargin:'0px 0px -40px 0px'});
    function init(){
      document.querySelectorAll(SEL).forEach(function(e){
        if(!e.classList.contains('in-view'))mo.observe(e);
      });
    }
    document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
    /* forward navigation (pushState) — animate in normally */
    var op=history.pushState;
    history.pushState=function(){op.apply(this,arguments);setTimeout(init,150);};
    /* back/forward navigation (popstate) — show immediately, no black flash */
    window.addEventListener('popstate',function(){setTimeout(showAll,50);});
    /* bfcache restore (iOS Safari, etc.) */
    window.addEventListener('pageshow',function(ev){if(ev.persisted)showAll();});
  }

  /* ── Parallax layers ── */
  if(!rm){
    function onScroll(){
      var sy=window.scrollY;
      document.querySelectorAll('.parallax').forEach(function(el){
        var speed=parseFloat(el.getAttribute('data-speed')||'0.15');
        el.style.setProperty('--parallax-y',-(sy*speed).toFixed(1)+'px');
      });
    }
    window.addEventListener('scroll',onScroll,{passive:true});
  }

  /* ── Counter animation ── */
  function animateCount(el){
    var target=parseFloat(el.getAttribute('data-count')||el.textContent);
    var isInt=Number.isInteger(target);
    var suffix=el.getAttribute('data-suffix')||'';
    var duration=1400;
    var start=null;
    function step(ts){
      if(!start)start=ts;
      var p=Math.min((ts-start)/duration,1);
      var ease=1-Math.pow(1-p,4);
      var val=target*ease;
      el.textContent=(isInt?Math.round(val):val.toFixed(1))+suffix;
      if(p<1)requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var co=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){animateCount(e.target);co.unobserve(e.target);}
    });
  },{threshold:0.5});
  function initCounters(){
    document.querySelectorAll('[data-count]').forEach(function(el){co.observe(el);});
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',initCounters):initCounters();
})();
    `}} />
  )
}
