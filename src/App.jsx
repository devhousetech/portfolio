import { useState, useEffect, useRef } from 'react'
import { SVG3D } from '3dsvg'
import './index.css'

const DEVHOUSE_SVG = `<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1481 1565" width="1481" height="1565">
  <style>.s0 { opacity: 1; fill: #ffffff }</style>
  <path id="Path 0" class="s0" d="m1148 347.07c-4.67 0.51-13.9 1.84-20.5 2.95-6.6 1.11-17.29 3.36-23.75 5-6.46 1.64-16.59 4.6-22.5 6.58-5.91 1.98-184.9 74.47-397.75 161.11-212.85 86.63-393.52 160.53-401.5 164.22-7.98 3.7-22.15 10.91-31.5 16.03-9.35 5.13-23.53 13.43-31.5 18.45-7.97 5.03-19 12.33-24.5 16.23-5.5 3.89-14.5 10.58-20 14.86-5.5 4.28-14.49 11.66-19.98 16.39-5.49 4.74-14.45 12.88-19.91 18.11-5.45 5.23-14.46 14.46-20.02 20.53-5.55 6.06-14.4 16.41-19.67 23-5.27 6.58-13.22 17.14-17.67 23.47-4.44 6.33-11.22 16.67-15.05 23-3.83 6.33-10.14 17.58-14.01 25-3.87 7.42-9.83 20.02-13.23 28-3.41 7.98-8.83 22.37-12.04 32-3.22 9.62-7.17 22.67-8.8 29-1.62 6.33-4.12 17.35-5.57 24.5-1.44 7.15-3.49 19.75-4.54 28-1.06 8.25-2.45 23.1-3.09 33-0.7 10.75-0.91 25.45-0.51 36.5 0.36 10.17 1.33 25.03 2.15 33 0.82 7.97 2.58 21.25 3.92 29.5 1.34 8.25 3.77 20.85 5.39 28 1.63 7.15 4.84 19.53 7.14 27.5 2.3 7.97 6.44 20.8 9.2 28.5 2.76 7.7 7.7 20.3 10.98 28 3.28 7.7 9.9 21.65 14.71 31 4.82 9.35 12.62 23.3 17.34 31 4.72 7.7 12.73 19.85 17.81 27 5.08 7.15 12.66 17.25 16.84 22.45 4.19 5.19 11.43 13.74 16.1 19 4.66 5.25 13.66 14.69 20 20.96 6.33 6.28 16.46 15.66 22.51 20.85 6.05 5.19 16.18 13.38 22.5 18.21 6.32 4.82 17.35 12.6 24.5 17.29 7.15 4.68 19.75 12.27 28 16.85 8.25 4.58 21.75 11.34 30 15.01 8.25 3.67 21.07 8.92 28.5 11.67 7.43 2.75 20.7 7.03 29.5 9.52 8.8 2.48 20.05 5.43 25 6.55 4.95 1.13 14.4 2.96 21 4.07 6.6 1.12 18.07 2.75 25.5 3.63 7.43 0.87 25.88 1.84 41 2.14 17.17 0.35 33.32 0.11 43-0.62 8.52-0.65 20.68-1.84 27-2.64 6.33-0.81 18.02-2.64 26-4.07 7.98-1.44 21.25-4.32 29.5-6.4 8.25-2.09 20.85-5.68 28-7.99 7.15-2.32 19.75-6.84 28-10.07 8.25-3.22 22.2-9.4 31-13.73 8.8-4.32 22.08-11.49 29.5-15.92 7.42-4.43 18.45-11.52 24.5-15.75 6.05-4.24 16.4-12.03 23-17.33 6.6-5.29 20.59-18.19 31.09-28.65 10.5-10.47 23.56-24.43 29.02-31.03 5.46-6.6 13.34-16.5 17.51-22 4.16-5.5 11.63-16.08 16.58-23.5 4.95-7.42 12.07-18.67 15.81-25 3.75-6.33 10.48-18.7 14.95-27.5 4.48-8.8 11.2-23.2 14.94-32 3.74-8.8 10.11-25.9 14.16-38 4.05-12.1 8.92-28.08 10.81-35.5 1.9-7.42 4.61-19.13 6.02-26 1.41-6.88 3.5-18.58 4.65-26 1.14-7.42 2.8-19.35 3.69-26.5 1.42-11.43 1.66-34.34 1.94-190.25 0.31-168.44 0.24-177.22-1.42-176.69-0.96 0.31-50.46 21.8-110 47.75l-108.25 47.19c-0.59 251.36-0.79 265.1-2.36 275.5-0.96 6.33-2.89 16.9-4.28 23.5-1.4 6.6-4.25 17.17-6.34 23.5-2.08 6.33-6.12 16.9-8.96 23.5-2.84 6.6-7.68 16.5-10.75 22-3.07 5.5-8.15 13.83-11.29 18.5-3.14 4.67-9.08 12.55-13.2 17.5-4.13 4.95-11.51 12.92-16.41 17.71-4.9 4.8-12.06 11.24-15.91 14.33-3.85 3.08-11.05 8.3-16 11.58-4.95 3.29-14.62 8.82-21.5 12.3-6.87 3.47-16.77 7.93-22 9.91-5.23 1.99-13.55 4.76-18.5 6.17-4.95 1.4-13.73 3.44-19.5 4.52-5.77 1.08-14.55 2.42-19.5 2.97-4.95 0.54-15.98 1-24.5 1-8.52 0.01-21.35-0.67-28.5-1.51-7.15-0.84-18.18-2.68-24.5-4.1-6.32-1.41-16.9-4.34-23.5-6.51-6.6-2.17-19.2-7.51-28-11.87-8.8-4.36-20.73-11.01-26.5-14.77-5.77-3.77-14.55-10.25-19.5-14.39-4.95-4.15-13.3-12-18.56-17.44-5.26-5.45-12.71-14.18-16.56-19.4-3.84-5.22-8.82-12.42-11.05-16-2.23-3.58-6.65-11.67-9.83-18-3.18-6.33-7.56-16.22-9.73-22-2.17-5.78-5.46-16.35-7.29-23.5-1.84-7.15-4.26-19.3-5.39-27-1.12-7.7-2.33-20.08-2.68-27.5-0.37-7.76-0.15-19.24 0.51-27 0.63-7.42 1.83-17.55 2.67-22.5 0.84-4.95 2.61-13.28 3.94-18.5 1.32-5.22 3.71-13.33 5.32-18 1.6-4.67 4.79-12.77 7.08-18 2.29-5.23 6.85-14.23 10.14-20 3.28-5.77 9.63-15.45 14.12-21.5 4.48-6.05 13.14-16.11 19.23-22.36 6.1-6.25 15.58-15 21.08-19.44 5.5-4.44 14.73-11.14 20.5-14.9 5.77-3.75 16.8-9.93 24.5-13.74 7.7-3.81 168.13-71.47 356.5-150.37 188.38-78.9 344.75-144.19 347.5-145.08 2.75-0.89 9.5-2.48 15-3.53 5.5-1.06 14.5-2.23 20-2.61 5.77-0.39 14.87-0.19 21.5 0.48 6.33 0.63 15.33 1.98 20 3 4.67 1.01 12.1 3.05 16.5 4.52 4.4 1.47 12.5 4.85 18 7.52 5.5 2.66 14.05 7.55 19 10.85 4.95 3.31 12.18 8.86 16.08 12.34 3.89 3.47 9.92 9.47 13.41 13.32 3.48 3.85 9.01 11.05 12.28 16 3.26 4.95 7.64 12.38 9.72 16.5 2.08 4.13 5.2 11.55 6.94 16.5 1.74 4.95 4.14 13.27 5.34 18.5l2.18 9.5c0.43 401.84 0.89 518.5 1.3 518.51 0.41 0 50.47-22.86 111.25-50.82l110.5-50.83c0-465.09-0.26-518.03-1.32-526.86-0.72-6.05-2.22-16.17-3.32-22.5-1.1-6.33-3.29-16.45-4.87-22.5-1.57-6.05-4.92-16.96-7.43-24.25-2.51-7.29-6.83-18.31-9.6-24.5-2.77-6.19-7.53-15.75-10.59-21.25-3.05-5.5-9.29-15.62-13.88-22.5-4.58-6.87-13.03-18.12-18.77-25-5.75-6.87-15.68-17.56-22.08-23.75-6.4-6.19-16.25-14.93-21.89-19.42-5.64-4.5-15.87-11.89-22.75-16.42-6.87-4.54-17-10.65-22.5-13.58-5.5-2.94-14.28-7.32-19.5-9.73-5.22-2.42-14.22-6.15-20-8.29-5.78-2.14-15-5.2-20.5-6.8-5.5-1.6-14.28-3.86-19.5-5.03-5.22-1.17-15.35-3.03-22.5-4.14-9.76-1.52-19.23-2.11-38-2.36-13.75-0.19-28.83 0.08-33.5 0.59zm-347-299.08l-109.5 46.82c-0.39 256.67-0.16 331.19 0.25 331.2 0.41 0 50.48-21.55 111.25-47.9l110.5-47.91c0.49-320.92 0.42-329.2-1.25-329.12-0.96 0.05-51.02 21.15-111.25 46.91z"/>
</svg>`

const HEADSHOT = '/hero.png'

// ── DATA ──────────────────────────────────────────────────────────────────
const PROJECTS = [
  { client: 'Arsenal Aviation',     type: 'Website',      role: 'Designer & Developer', year: '2025', url: 'https://www.arsenalaviation.com/', credit: 'own' },
  { client: 'Evolve Realty',        type: 'Website',      role: 'Designer & Developer', year: '2025', url: 'https://www.evolverealtypro.com/', credit: 'own' },
  { client: 'Whitney Harvey',       type: 'Website',      role: 'Designer & Developer', year: '2025', url: 'https://www.whitneyharveyteam.com/', credit: 'own' },
  { client: 'Cisneros Realty',      type: 'Website',      role: 'Designer & Developer', year: '2025', url: null, credit: 'own' },
  { client: 'Lynea Carver',         type: 'Website',      role: 'Build & Production',   year: '2025', url: 'https://www.lyneacarver.com/', credit: 'team' },
  { client: 'Sanjay Gupta',         type: 'Website',      role: 'Build & Production',   year: '2025', url: 'https://sanjay-gupta---staging---dht-new.webflow.io/', credit: 'team' },
  { client: 'Stacie Krajcir',       type: 'Website',      role: 'Build & Production',   year: '2025', url: 'https://www.staciekrajcir.com/', credit: 'team' },
  { client: 'Diane Cardano',        type: 'Website',      role: 'Build & Production',   year: '2025', url: 'https://cardano-realtors.webflow.io/', credit: 'team' },
  { client: 'Jason Young',          type: 'Website',      role: 'Build & Production',   year: '2025', url: 'https://www.jasonyoungrealtor.com/', credit: 'team' },
  { client: 'Miguel Jubiz',         type: 'Website',      role: 'Build & Production',   year: '2025', url: 'https://srhomesgroup.com/', credit: 'team' },
  { client: 'Email Seq. Generator', type: 'SaaS Product', role: 'Solo Build',           year: '2025', url: 'https://sequence.devhousetech.io', credit: 'own' },
]

const SKILLS = [
  { skill: 'Webflow',          category: 'Development', usedFor: 'Real estate websites, CMS, animations',      since: '2021' },
  { skill: 'React + Vite',     category: 'Development', usedFor: 'SaaS products, web apps',                    since: '2024' },
  { skill: 'WordPress',        category: 'Development', usedFor: 'Custom themes, WooCommerce',                 since: '2016' },
  { skill: 'Interactive SVG',  category: 'Development', usedFor: 'Neighborhood maps, custom graphics',         since: '2022' },
  { skill: 'IDX Integration',  category: 'Real Estate', usedFor: 'Property search, iHomefinder',              since: '2021' },
  { skill: 'GA4 / GTM / GSC',  category: 'Analytics',   usedFor: 'Tracking, conversion optimisation',         since: '2021' },
  { skill: 'Supabase',         category: 'Backend',     usedFor: 'Auth, database, RLS policies',               since: '2024' },
  { skill: 'Node.js',          category: 'Backend',     usedFor: 'Serverless functions, APIs',                 since: '2024' },
  { skill: 'Technical SEO',    category: 'Marketing',   usedFor: 'On-page SEO, blog, keyword research',        since: '2021' },
  { skill: 'Claude',           category: 'AI Tools',    usedFor: 'Code generation, copywriting, product dev',  since: '2023' },
  { skill: 'ChatGPT',          category: 'AI Tools',    usedFor: 'Research, copy, image generation',           since: '2023' },
  { skill: 'Gemini',           category: 'AI Tools',    usedFor: 'Video generation, research',                 since: '2024' },
  { skill: 'Canva',            category: 'Design',      usedFor: 'Marketing assets, social, presentations',    since: '2020' },
  { skill: 'Photoshop',        category: 'Design',      usedFor: 'Image editing, mockups, graphics',           since: '2016' },
  { skill: 'Team Leadership',  category: 'Operations',  usedFor: 'Sprint planning, SOPs, delivery',            since: '2022' },
]

// ── NAV ───────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    ['#work', 'Work'],
    ['#skills', 'Skills'],
    ['#about', 'About'],
    ['#saas', 'SaaS'],
    ['#contact', 'Contact'],
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 clamp(20px, 4vw, 60px)',
      height: '58px',
      background: scrolled ? 'rgba(12,13,15,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'background 0.3s, border-color 0.3s, backdrop-filter 0.3s',
    }}>
      <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.01em', color: 'var(--offwhite)' }}>
        mike<span style={{ color: 'var(--teal)' }}>.</span>devhousetech
      </div>

      {/* Desktop */}
      <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
        {links.map(([href, label]) => (
          <a key={href} href={href} style={{
            fontSize: '13px', color: 'var(--silver)',
            transition: 'color 0.2s', display: window.innerWidth < 768 ? 'none' : 'block'
          }}
          onMouseEnter={e => e.target.style.color = 'var(--offwhite)'}
          onMouseLeave={e => e.target.style.color = 'var(--silver)'}
          >{label}</a>
        ))}
        <a href="https://calendly.com/michael-devhousetech/30min" target="_blank" rel="noreferrer"
          style={{
            fontSize: '12px', fontWeight: 500,
            padding: '7px 18px',
            border: '1px solid var(--border)',
            borderRadius: '3px',
            color: 'var(--offwhite)',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--silver)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >Book a call</a>
      </div>
    </nav>
  )
}

// ── HERO ──────────────────────────────────────────────────────────────────
function Hero() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section style={{
      position: 'relative',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'clip',
      overflowY: 'hidden',
    }}>

      {/* BG orb — DO NOT TOUCH */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)' }} />
        <div style={{
          position: 'absolute',
          width: '90vw', height: '90vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(80,40,200,0.20) 0%, rgba(74,222,222,0.07) 45%, transparent 70%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'orbDrift1 22s ease-in-out infinite',
          pointerEvents: 'none',
          filter: 'blur(4px)',
        }} />
      </div>

      {/* TOP — headline centered */}
      <div style={{
        position: 'relative', zIndex: 4,
        height: isMobile ? '40%' : '32%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '0 clamp(24px, 5vw, 80px)',
      }}>
        <h1 style={{
          fontSize: 'clamp(26px, 4.2vw, 64px)',
          fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.08,
          color: 'var(--offwhite)', marginBottom: '12px',
        }}>
          Web Design, Development<br />
          <span style={{ color: 'var(--offwhite)' }}>&amp; Real Estate Tech</span>
        </h1>
        <p style={{
          fontSize: 'clamp(11px, 1vw, 14px)', color: 'var(--silver)',
          whiteSpace: isMobile ? 'normal' : 'nowrap',
          textAlign: 'center',
          maxWidth: isMobile ? '280px' : 'none',
          marginBottom: '20px',
        }}>
          Webflow · React · Real estate websites · Based in the Philippines
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <a href="#work" style={{
            padding: '9px 22px', background: 'var(--offwhite)', color: 'var(--bg)',
            fontSize: '13px', fontWeight: 600, borderRadius: '4px', transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >View work</a>
          <a href="#contact" style={{
            padding: '9px 22px', border: '1px solid rgba(138,140,146,0.35)',
            color: 'var(--offwhite)', fontSize: '13px', fontWeight: 500, borderRadius: '4px',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--silver)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(138,140,146,0.35)'}
          >About</a>
        </div>
      </div>

      {/* BOTTOM — photo left, logo right (logo hidden on mobile) */}
      <div style={{
        position: 'relative', zIndex: 2,
        height: isMobile ? '60%' : '68%',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        minHeight: 0,
        overflow: 'visible',
      }}>

        {/* LEFT — photo */}
        <div style={{ position: 'relative', overflow: 'visible', zIndex: 3 }}>
          <img
            src={HEADSHOT}
            alt="Dan Michael Villamarin"
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'auto',
              height: '115%',
              display: 'block',
            }}
          />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            display: 'flex', justifyContent: 'center', gap: isMobile ? '20px' : 'clamp(24px, 3.5vw, 56px)',
            padding: '18px 28px',
            background: isMobile
              ? 'rgba(12,13,15,0.88)'
              : 'linear-gradient(to right, transparent 0%, rgba(12,13,15,0.92) 28%, rgba(12,13,15,0.92) 72%, transparent 100%)',
          }}>
            {[['9+', 'Years experience'], ['70+', 'Projects delivered'], ['5yr', 'Real estate tech']].map(([n, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: isMobile ? '20px' : 'clamp(20px, 2.4vw, 34px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--offwhite)', lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: '10px', color: isMobile ? 'var(--offwhite)' : 'var(--muted)', marginTop: '4px', letterSpacing: '0.04em' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — 3D logo (tablet + desktop only) */}
        {!isMobile && (
          <div style={{ position: 'relative', overflow: 'visible' }}>
            <div style={{
              position: 'absolute',
              top: '-40%',
              left: '-10%',
              width: '120%',
              height: '160%',
              pointerEvents: 'none',
              userSelect: 'none',
            }}>
              <SVG3D
                svg={DEVHOUSE_SVG}
                smoothness={0.6}
                animate="float"
                animateSpeed={0.4}
                cursorOrbit
                lightPosition={[3, 2, 4]}
              />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes orbDrift1 {
          0%,100% { transform: translate(-50%, -50%) scale(1); }
          33%     { transform: translate(-50%, -52%) scale(1.04); }
          66%     { transform: translate(-50%, -48%) scale(0.97); }
        }
      `}</style>
    </section>
  )
}

// ── FEATURED PROJECTS ────────────────────────────────────────────────────
function FeaturedProjects() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const projects = [
    {
      img: '/Email_Sequence_Generator.png',
      title: 'Email Sequence Generator',
      tag: 'SaaS Product',
      span: 'full',
    },
    {
      img: '/Evolve_Realty.png',
      title: 'Evolve Realty',
      tag: 'Real Estate Website',
      span: 'small',
    },
    {
      img: '/Stacie_Krajcir.png',
      title: 'Stacie Krajcir',
      tag: 'Real Estate Website',
      span: 'medium',
    },
    {
      img: '/Arsenal_Aviation.png',
      title: 'Arsenal Aviation',
      tag: 'Brand Website',
      span: 'full',
    },
    {
      img: '/Devhouse_Site.png',
      title: 'DevHouse Technologies',
      tag: 'Agency Website',
      span: 'full',
    },
  ]

  return (
    <section id="work" style={{ padding: 'clamp(80px, 10vw, 120px) clamp(20px, 5vw, 60px)', maxWidth: 'var(--max)', margin: '0 auto', borderTop: '1px solid var(--border)' }}>
      <div style={{ marginBottom: '48px', textAlign: isMobile ? 'center' : 'left' }}>
        <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '8px' }}>Featured Work</div>
        <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--offwhite)' }}>Selected Projects</h2>
      </div>

      {/* All 4 cards — desktop: big/small+medium/big layout. Mobile: 4 equal rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Row 1 — full width */}
        <div style={{ borderRadius: '6px', overflow: 'hidden', position: 'relative' }}
          onMouseEnter={e => e.currentTarget.querySelector('.overlay').style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.querySelector('.overlay').style.opacity = '0'}
        >
          <img src={projects[0].img} alt={projects[0].title} style={{ width: '100%', height: 'clamp(200px, 42vw, 580px)', objectFit: 'cover', display: 'block' }} />
          <div className="overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(12,13,15,0.45)', opacity: 0, transition: 'opacity 0.3s' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 28px', background: 'linear-gradient(to top, rgba(12,13,15,0.9) 0%, transparent 100%)', textAlign: isMobile ? 'center' : 'left' }}>
            <div style={{ fontSize: '11px', color: 'var(--teal)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>{projects[0].tag}</div>
            <div style={{ fontSize: 'clamp(15px, 2vw, 22px)', fontWeight: 700, color: 'var(--offwhite)', letterSpacing: '-0.01em' }}>{projects[0].title}</div>
          </div>
        </div>

        {/* Row 2 — small + medium on desktop, stacked on mobile */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '16px' }}>
          {[projects[1], projects[2]].map((p) => (
            <div key={p.title} style={{ borderRadius: '6px', overflow: 'hidden', position: 'relative' }}
              onMouseEnter={e => e.currentTarget.querySelector('.overlay').style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.querySelector('.overlay').style.opacity = '0'}
            >
              <img src={p.img} alt={p.title} style={{ width: '100%', height: 'clamp(200px, 28vw, 400px)', objectFit: 'cover', display: 'block' }} />
              <div className="overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(12,13,15,0.45)', opacity: 0, transition: 'opacity 0.3s' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 24px', background: 'linear-gradient(to top, rgba(12,13,15,0.9) 0%, transparent 100%)', textAlign: isMobile ? 'center' : 'left' }}>
                <div style={{ fontSize: '10px', color: 'var(--teal)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>{p.tag}</div>
                <div style={{ fontSize: 'clamp(14px, 1.6vw, 18px)', fontWeight: 700, color: 'var(--offwhite)', letterSpacing: '-0.01em' }}>{p.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Row 3 — full width */}
        <div style={{ borderRadius: '6px', overflow: 'hidden', position: 'relative' }}
          onMouseEnter={e => e.currentTarget.querySelector('.overlay').style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.querySelector('.overlay').style.opacity = '0'}
        >
          <img src={projects[3].img} alt={projects[3].title} style={{ width: '100%', height: 'clamp(200px, 42vw, 580px)', objectFit: 'cover', display: 'block' }} />
          <div className="overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(12,13,15,0.45)', opacity: 0, transition: 'opacity 0.3s' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 28px', background: 'linear-gradient(to top, rgba(12,13,15,0.9) 0%, transparent 100%)', textAlign: isMobile ? 'center' : 'left' }}>
            <div style={{ fontSize: '11px', color: 'var(--teal)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>{projects[3].tag}</div>
            <div style={{ fontSize: 'clamp(15px, 2vw, 22px)', fontWeight: 700, color: 'var(--offwhite)', letterSpacing: '-0.01em' }}>{projects[3].title}</div>
          </div>
        </div>

        {/* Row 4 — DevHouse full width */}
        <div style={{ borderRadius: '6px', overflow: 'hidden', position: 'relative' }}
          onMouseEnter={e => e.currentTarget.querySelector('.overlay').style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.querySelector('.overlay').style.opacity = '0'}
        >
          <img src={projects[4].img} alt={projects[4].title} style={{ width: '100%', height: 'clamp(200px, 42vw, 580px)', objectFit: 'cover', display: 'block' }} />
          <div className="overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(12,13,15,0.45)', opacity: 0, transition: 'opacity 0.3s' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 28px', background: 'linear-gradient(to top, rgba(12,13,15,0.9) 0%, transparent 100%)', textAlign: isMobile ? 'center' : 'left' }}>
            <div style={{ fontSize: '11px', color: 'var(--teal)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>{projects[4].tag}</div>
            <div style={{ fontSize: 'clamp(15px, 2vw, 22px)', fontWeight: 700, color: 'var(--offwhite)', letterSpacing: '-0.01em' }}>{projects[4].title}</div>
          </div>
        </div>

      </div>
    </section>
  )
}

// ── WORK TABLE ────────────────────────────────────────────────────────────
function WorkTable() {
  const [hovered, setHovered] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY })

  return (
    <section id="work" style={{ padding: 'clamp(80px, 10vw, 120px) clamp(20px, 5vw, 60px)', maxWidth: 'var(--max)', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '48px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '8px' }}>Selected Work</div>
          <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--offwhite)' }}>
            Projects ({PROJECTS.length})
          </h2>
        </div>
        <a href="https://docs.google.com/spreadsheets/d/1GYS5qjInHNRv_rbDMowEMzsWmkN91QUdFnjh_C5fo08" target="_blank" rel="noreferrer"
          style={{ fontSize: '12px', color: 'var(--silver)', borderBottom: '1px solid var(--border)', paddingBottom: '1px' }}>
          View all ↗
        </a>
      </div>

      {/* Table header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 80px',
        padding: '0 0 12px', borderBottom: '1px solid var(--border)',
        gap: '16px',
      }}>
        {['Client', 'Category', 'Role', 'Year'].map(h => (
          <div key={h} style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>{h}</div>
        ))}
      </div>

      {/* Rows */}
      <div onMouseMove={handleMouseMove}>
        {PROJECTS.map((p, i) => (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 80px',
              padding: '18px 0', gap: '16px',
              borderBottom: '1px solid var(--border)',
              cursor: p.url ? 'pointer' : 'default',
              transition: 'background 0.15s',
              background: hovered === i ? 'rgba(255,255,255,0.02)' : 'transparent',
              borderRadius: '2px',
            }}
            onClick={() => p.url && window.open(p.url, '_blank')}
          >
            <div style={{
              fontSize: 'clamp(16px, 1.8vw, 22px)', fontWeight: 600,
              letterSpacing: '-0.01em',
              color: hovered === i ? 'var(--offwhite)' : 'var(--silver)',
              transition: 'color 0.2s',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              {p.client}
              {p.url && hovered === i && <span style={{ fontSize: '14px', color: 'var(--teal)' }}>↗</span>}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', alignSelf: 'center' }}>{p.type}</div>
            <div style={{ fontSize: '13px', color: p.credit === 'own' ? 'var(--silver)' : 'var(--muted)', alignSelf: 'center', fontStyle: p.credit === 'team' ? 'italic' : 'normal' }}>{p.role}</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', alignSelf: 'center' }}>{p.year}</div>
          </div>
        ))}
      </div>

      {/* Hover preview */}
      {hovered !== null && PROJECTS[hovered].url && (
        <div style={{
          position: 'fixed',
          left: mousePos.x + 20,
          top: mousePos.y - 80,
          zIndex: 500,
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          padding: '10px 16px',
          fontSize: '12px', color: 'var(--silver)',
          pointerEvents: 'none',
          maxWidth: '240px',
          wordBreak: 'break-all',
        }}>
          {PROJECTS[hovered].url}
        </div>
      )}
    </section>
  )
}

// ── SKILLS TABLE ──────────────────────────────────────────────────────────
function SkillsTable() {
  const [hovered, setHovered] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section id="skills" style={{ padding: 'clamp(80px, 10vw, 120px) clamp(20px, 5vw, 60px)', maxWidth: 'var(--max)', margin: '0 auto', borderTop: '1px solid var(--border)' }}>
      <div style={{ marginBottom: '48px', textAlign: isMobile ? 'center' : 'left' }}>
        <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '8px' }}>Capabilities</div>
        <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--offwhite)' }}>Skills &amp; Tools</h2>
      </div>

      {isMobile ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '0 0 12px', borderBottom: '1px solid var(--border)', gap: '8px' }}>
            <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>Skill</div>
            <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'right' }}>Details</div>
          </div>
          {SKILLS.map((s, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '14px 0', gap: '8px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--silver)' }}>{s.skill}</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '2px' }}>{s.category}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{s.usedFor}</div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 80px', padding: '0 0 12px', borderBottom: '1px solid var(--border)', gap: '16px' }}>
            {['Skill', 'Category', 'Used for', 'Since'].map(h => (
              <div key={h} style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>{h}</div>
            ))}
          </div>
          {SKILLS.map((s, i) => (
            <div key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 80px', padding: '18px 0', gap: '16px', borderBottom: '1px solid var(--border)', background: hovered === i ? 'rgba(255,255,255,0.02)' : 'transparent', transition: 'background 0.15s', borderRadius: '2px' }}>
              <div style={{ fontSize: 'clamp(16px, 1.8vw, 22px)', fontWeight: 600, letterSpacing: '-0.01em', color: hovered === i ? 'var(--offwhite)' : 'var(--silver)', transition: 'color 0.2s' }}>{s.skill}</div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', alignSelf: 'center' }}>{s.category}</div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', alignSelf: 'center' }}>{s.usedFor}</div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', alignSelf: 'center' }}>{s.since}</div>
            </div>
          ))}
        </>
      )}
    </section>
  )
}

// ── ABOUT ─────────────────────────────────────────────────────────────────
function About() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const facts = [
    ['Based', 'Quezon City, Philippines'],
    ['Experience', '9 years'],
    ['Previous', 'Luxury Presence — 4 years'],
    ['Progression', 'Web Designer → Integrations Specialist → Product Expert'],
    ['Primary stack', 'Webflow, WordPress, React + Vite'],
    ['Niche', 'US real estate websites'],
    ['Open to', 'Freelance · Full-time · White-label'],
  ]

  return (
    <section id="about" style={{ padding: 'clamp(80px, 10vw, 120px) clamp(20px, 5vw, 60px)', maxWidth: 'var(--max)', margin: '0 auto', borderTop: '1px solid var(--border)' }}>
      <div style={{ marginBottom: '56px', textAlign: isMobile ? 'center' : 'left' }}>
        <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '8px' }}>Background</div>
        <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--offwhite)' }}>About</h2>
      </div>

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: 'clamp(40px, 6vw, 100px)' }}>
        <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
          <p style={{ fontSize: '15px', color: 'var(--silver)', lineHeight: 1.85, marginBottom: '18px' }}>
            I go by <strong style={{ color: 'var(--offwhite)', fontWeight: 500 }}>Mike</strong>. I've been building websites for the US market since I joined <strong style={{ color: 'var(--offwhite)', fontWeight: 500 }}>Luxury Presence</strong> — one of the leading real estate website platforms in the US — where I spent nearly 4 years serving US real estate agents and agencies.
          </p>
          <p style={{ fontSize: '15px', color: 'var(--silver)', lineHeight: 1.85, marginBottom: '18px' }}>
            In 2025, I relaunched DevHouse Technologies, secured a white-label partnership with a US real estate marketing agency, built and led a team of 7, and delivered <strong style={{ color: 'var(--offwhite)', fontWeight: 500 }}>70+ projects in under 6 months</strong>. Then I designed, built, and shipped a live SaaS product solo.
          </p>
          <p style={{ fontSize: '15px', color: 'var(--silver)', lineHeight: 1.85 }}>
            I have a strong eye for luxury design and genuinely enjoy working with premium brands, high-end real estate clients, and anyone who takes their digital presence seriously. Comfortable in Webflow, WordPress, and React + Vite — with AI tools handling the heavy lifting on the dev side. Currently open to <strong style={{ color: 'var(--offwhite)', fontWeight: 500 }}>freelance, full-time, and white-label partnerships</strong>.
          </p>
        </div>

        <div>
          {facts.map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px 0', borderBottom: '1px solid var(--border)', gap: '20px' }}>
              <span style={{ fontSize: '12px', color: 'var(--muted)', flexShrink: 0, paddingTop: '1px' }}>{label}</span>
              <span style={{ fontSize: '13px', color: 'var(--offwhite)', fontWeight: 500, textAlign: 'right' }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── SAAS ──────────────────────────────────────────────────────────────────
function Saas() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section id="saas" style={{ padding: 'clamp(80px, 10vw, 120px) clamp(20px, 5vw, 60px)', maxWidth: 'var(--max)', margin: '0 auto', borderTop: '1px solid var(--border)' }}>
      <div style={{ marginBottom: '48px', textAlign: isMobile ? 'center' : 'left' }}>
        <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '8px' }}>Product</div>
        <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--offwhite)' }}>Built &amp; Shipped a SaaS</h2>
      </div>

      <div style={{
        border: '1px solid var(--border)', borderRadius: '6px', padding: 'clamp(28px, 4vw, 56px)',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
        gap: 'clamp(32px, 4vw, 60px)', alignItems: 'center',
      }}>
        <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
          <h3 style={{ fontSize: 'clamp(22px, 2.5vw, 34px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--offwhite)', lineHeight: 1.15, marginBottom: '14px' }}>
            Lead Follow-Up<br />Email Sequence Generator
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--silver)', lineHeight: 1.8, marginBottom: '24px' }}>
            A tool built specifically for real estate agents — generates personalised email follow-up sequences from a single input. Designed, built, and launched solo. React + Vite, Vercel serverless, Supabase, Lemon Squeezy, Claude API.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px', justifyContent: isMobile ? 'center' : 'flex-start' }}>
            {['React + Vite', 'Vercel', 'Supabase', 'Lemon Squeezy', 'Claude API'].map(t => (
              <span key={t} style={{ fontSize: '11px', fontWeight: 500, padding: '4px 10px', border: '1px solid var(--border)', borderRadius: '2px', color: 'var(--silver)', letterSpacing: '0.03em' }}>{t}</span>
            ))}
          </div>
          <a href="https://sequence.devhousetech.io" target="_blank" rel="noreferrer"
            style={{ fontSize: '13px', color: 'var(--silver)', borderBottom: '1px solid rgba(196,198,204,0.25)', paddingBottom: '1px' }}>
            sequence.devhousetech.io ↗
          </a>
        </div>
        <div style={{ textAlign: isMobile ? 'center' : 'right' }}>
          <div style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--offwhite)', lineHeight: 1 }}>
            $29<span style={{ fontSize: '16px', color: 'var(--muted)', fontWeight: 400 }}>/mo</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>Pro Plan</div>
          <div style={{ fontSize: '13px', color: 'var(--silver)', marginTop: '10px' }}>Free Tier · 3 Sequences</div>
        </div>
      </div>
    </section>
  )
}

// ── CONTACT ───────────────────────────────────────────────────────────────
function Contact() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const links = [
    ['Email', 'michael@devhousetech.io', 'mailto:michael@devhousetech.io'],
    ['LinkedIn', 'Dan Michael Villamarin', 'https://linkedin.com/in/dan-michael-villamarin-666692130'],
    ['Instagram', '@web.mike', 'https://instagram.com/web.mike'],
    ['Studio', '@devhousetech', 'https://instagram.com/devhousetech'],
    ['Portfolio', 'Full project sheet ↗', 'https://docs.google.com/spreadsheets/d/1GYS5qjInHNRv_rbDMowEMzsWmkN91QUdFnjh_C5fo08'],
  ]

  return (
    <section id="contact" style={{ padding: 'clamp(80px, 10vw, 120px) clamp(20px, 5vw, 60px)', maxWidth: 'var(--max)', margin: '0 auto', borderTop: '1px solid var(--border)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 'clamp(48px, 6vw, 100px)' }}>
        <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
          <h2 style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--offwhite)', lineHeight: 1.05, marginBottom: '18px' }}>
            Let's work<br />together.
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.8, marginBottom: '36px', maxWidth: isMobile ? '100%' : '360px' }}>
            Looking for a Webflow expert, a white-label partner for your agency, or a developer who knows real estate inside out.
          </p>
          <a href="mailto:michael@devhousetech.io"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 28px', background: 'var(--offwhite)', color: 'var(--bg)', fontSize: '13px', fontWeight: 600, borderRadius: '3px' }}>
            michael@devhousetech.io
          </a>
        </div>

        <div>
          {links.map(([label, val, href]) => (
            <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid var(--border)', gap: '16px', transition: 'opacity 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <span style={{ fontSize: '12px', color: 'var(--muted)', flexShrink: 0 }}>{label}</span>
              <span style={{ fontSize: '13px', color: 'var(--silver)', fontWeight: 500, textAlign: 'right' }}>{val}</span>
            </a>
          ))}
          <div style={{ marginTop: '28px', textAlign: isMobile ? 'center' : 'left' }}>
            <a href="https://calendly.com/michael-devhousetech/30min" target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', border: '1px solid var(--border)', borderRadius: '3px', fontSize: '13px', color: 'var(--silver)', transition: 'border-color 0.2s, color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--silver)'; e.currentTarget.style.color = 'var(--offwhite)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--silver)' }}
            >
              Book a 30-min call ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── FOOTER ────────────────────────────────────────────────────────────────
function Footer() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '24px clamp(20px, 5vw, 60px)' }}>
      <div style={{ maxWidth: 'var(--max)', margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', gap: '12px', textAlign: isMobile ? 'center' : 'left' }}>
        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>© 2026 Dan Michael Villamarin · DevHouse Technologies</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[['devhousetech.io', 'https://devhousetech.io'], ['LinkedIn', 'https://linkedin.com/in/dan-michael-villamarin-666692130']].map(([l, h]) => (
            <a key={l} href={h} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: 'var(--muted)', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--silver)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
            >{l}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}

// ── LOADING SCREEN ────────────────────────────────────────────────────────
const WORD = 'MIKE'

function LoadingScreen({ onDone }) {
  const [displayed, setDisplayed] = useState([])
  const [fadeOut, setFadeOut] = useState(false)

useEffect(() => {
  const timers = []

  setDisplayed([])

  const startTyping = setTimeout(() => {
    WORD.split('').forEach((char, i) => {
      const timer = setTimeout(() => {
        setDisplayed(prev => [...prev, char])
      }, i * 600)

      timers.push(timer)
    })
  }, 800)

  timers.push(startTyping)

    // Start fade out
    timers.push(
      setTimeout(() => {
        setFadeOut(true)
      }, 4500)
    )

    // Finish loading
    timers.push(
      setTimeout(() => {
        onDone()
      }, 6000)
    )

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [onDone])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 1.5s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      <div
        style={{
          fontSize: 'clamp(48px, 10vw, 120px)',
          fontWeight: 700,
          letterSpacing: '0.4em',
          color: 'var(--offwhite)',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {displayed.map((char, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              animation:
                'letterIn 0.5s cubic-bezier(0.16,1,0.3,1) both',
            }}
          >
            {char}
          </span>
        ))}

        <span className="loading-cursor" />
      </div>

      <style>{`
        .loading-cursor{
          display:inline-block;
          width:3px;
          height:0.8em;
          background:var(--offwhite);
          margin-left:8px;
          border-radius:2px;
          animation:cursorBlink 1s step-end infinite;
        }

        @keyframes cursorBlink{
          50%{
            opacity:0;
          }
        }

        @keyframes letterIn{
          from{
            opacity:0;
            transform:translateY(16px);
            filter:blur(4px);
          }

          to{
            opacity:1;
            transform:translateY(0);
            filter:blur(0);
          }
        }
      `}</style>
    </div>
  )
}

// ── APP ───────────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(true)

  return (
    <>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      <Nav />
      <Hero />
      <FeaturedProjects />
      <SkillsTable />
      <About />
      <Saas />
      <Contact />
      <Footer />
    </>
  )
}
