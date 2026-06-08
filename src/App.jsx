import { useState, useEffect, useRef } from 'react'
import { SVG3D } from '3dsvg'
import HeroFluid from './HeroFluid'
import PixelGame from './PixelGame'
import GameFAB from './GameFAB'
import LoadingScreen from './LoadingScreen'
import './index.css'

const getTransform = (condition, mobileHidden = 'translateX(100vw)', desktopHidden = 'translateY(100vh)') => {
  const mobile = typeof window !== 'undefined' && window.innerWidth <= 768
  if (condition) return mobile ? mobileHidden : desktopHidden
  return 'translate(0,0)'
}

const DEVHOUSE_SVG = `<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1481 1565" width="1481" height="1565">
  <style>.s0 { opacity: 1; fill: #ffffff }</style>
  <path id="Path 0" class="s0" d="m1148 347.07c-4.67 0.51-13.9 1.84-20.5 2.95-6.6 1.11-17.29 3.36-23.75 5-6.46 1.64-16.59 4.6-22.5 6.58-5.91 1.98-184.9 74.47-397.75 161.11-212.85 86.63-393.52 160.53-401.5 164.22-7.98 3.7-22.15 10.91-31.5 16.03-9.35 5.13-23.53 13.43-31.5 18.45-7.97 5.03-19 12.33-24.5 16.23-5.5 3.89-14.5 10.58-20 14.86-5.5 4.28-14.49 11.66-19.98 16.39-5.49 4.74-14.45 12.88-19.91 18.11-5.45 5.23-14.46 14.46-20.02 20.53-5.55 6.06-14.4 16.41-19.67 23-5.27 6.58-13.22 17.14-17.67 23.47-4.44 6.33-11.22 16.67-15.05 23-3.83 6.33-10.14 17.58-14.01 25-3.87 7.42-9.83 20.02-13.23 28-3.41 7.98-8.83 22.37-12.04 32-3.22 9.62-7.17 22.67-8.8 29-1.62 6.33-4.12 17.35-5.57 24.5-1.44 7.15-3.49 19.75-4.54 28-1.06 8.25-2.45 23.1-3.09 33-0.7 10.75-0.91 25.45-0.51 36.5 0.36 10.17 1.33 25.03 2.15 33 0.82 7.97 2.58 21.25 3.92 29.5 1.34 8.25 3.77 20.85 5.39 28 1.63 7.15 4.84 19.53 7.14 27.5 2.3 7.97 6.44 20.8 9.2 28.5 2.76 7.7 7.7 20.3 10.98 28 3.28 7.7 9.9 21.65 14.71 31 4.82 9.35 12.62 23.3 17.34 31 4.72 7.7 12.73 19.85 17.81 27 5.08 7.15 12.66 17.25 16.84 22.45 4.19 5.19 11.43 13.74 16.1 19 4.66 5.25 13.66 14.69 20 20.96 6.33 6.28 16.46 15.66 22.51 20.85 6.05 5.19 16.18 13.38 22.5 18.21 6.32 4.82 17.35 12.6 24.5 17.29 7.15 4.68 19.75 12.27 28 16.85 8.25 4.58 21.75 11.34 30 15.01 8.25 3.67 21.07 8.92 28.5 11.67 7.43 2.75 20.7 7.03 29.5 9.52 8.8 2.48 20.05 5.43 25 6.55 4.95 1.13 14.4 2.96 21 4.07 6.6 1.12 18.07 2.75 25.5 3.63 7.43 0.87 25.88 1.84 41 2.14 17.17 0.35 33.32 0.11 43-0.62 8.52-0.65 20.68-1.84 27-2.64 6.33-0.81 18.02-2.64 26-4.07 7.98-1.44 21.25-4.32 29.5-6.4 8.25-2.09 20.85-5.68 28-7.99 7.15-2.32 19.75-6.84 28-10.07 8.25-3.22 22.2-9.4 31-13.73 8.8-4.32 22.08-11.49 29.5-15.92 7.42-4.43 18.45-11.52 24.5-15.75 6.05-4.24 16.4-12.03 23-17.33 6.6-5.29 20.59-18.19 31.09-28.65 10.5-10.47 23.56-24.43 29.02-31.03 5.46-6.6 13.34-16.5 17.51-22 4.16-5.5 11.63-16.08 16.58-23.5 4.95-7.42 12.07-18.67 15.81-25 3.75-6.33 10.48-18.7 14.95-27.5 4.48-8.8 11.2-23.2 14.94-32 3.74-8.8 10.11-25.9 14.16-38 4.05-12.1 8.92-28.08 10.81-35.5 1.9-7.42 4.61-19.13 6.02-26 1.41-6.88 3.5-18.58 4.65-26 1.14-7.42 2.8-19.35 3.69-26.5 1.42-11.43 1.66-34.34 1.94-190.25 0.31-168.44 0.24-177.22-1.42-176.69-0.96 0.31-50.46 21.8-110 47.75l-108.25 47.19c-0.59 251.36-0.79 265.1-2.36 275.5-0.96 6.33-2.89 16.9-4.28 23.5-1.4 6.6-4.25 17.17-6.34 23.5-2.08 6.33-6.12 16.9-8.96 23.5-2.84 6.6-7.68 16.5-10.75 22-3.07 5.5-8.15 13.83-11.29 18.5-3.14 4.67-9.08 12.55-13.2 17.5-4.13 4.95-11.51 12.92-16.41 17.71-4.9 4.8-12.06 11.24-15.91 14.33-3.85 3.08-11.05 8.3-16 11.58-4.95 3.29-14.62 8.82-21.5 12.3-6.87 3.47-16.77 7.93-22 9.91-5.23 1.99-13.55 4.76-18.5 6.17-4.95 1.4-13.73 3.44-19.5 4.52-5.77 1.08-14.55 2.42-19.5 2.97-4.95 0.54-15.98 1-24.5 1-8.52 0.01-21.35-0.67-28.5-1.51-7.15-0.84-18.18-2.68-24.5-4.1-6.32-1.41-16.9-4.34-23.5-6.51-6.6-2.17-19.2-7.51-28-11.87-8.8-4.36-20.73-11.01-26.5-14.77-5.77-3.77-14.55-10.25-19.5-14.39-4.95-4.15-13.3-12-18.56-17.44-5.26-5.45-12.71-14.18-16.56-19.4-3.84-5.22-8.82-12.42-11.05-16-2.23-3.58-6.65-11.67-9.83-18-3.18-6.33-7.56-16.22-9.73-22-2.17-5.78-5.46-16.35-7.29-23.5-1.84-7.15-4.26-19.3-5.39-27-1.12-7.7-2.33-20.08-2.68-27.5-0.37-7.76-0.15-19.24 0.51-27 0.63-7.42 1.83-17.55 2.67-22.5 0.84-4.95 2.61-13.28 3.94-18.5 1.32-5.22 3.71-13.33 5.32-18 1.6-4.67 4.79-12.77 7.08-18 2.29-5.23 6.85-14.23 10.14-20 3.28-5.77 9.63-15.45 14.12-21.5 4.48-6.05 13.14-16.11 19.23-22.36 6.1-6.25 15.58-15 21.08-19.44 5.5-4.44 14.73-11.14 20.5-14.9 5.77-3.75 16.8-9.93 24.5-13.74 7.7-3.81 168.13-71.47 356.5-150.37 188.38-78.9 344.75-144.19 347.5-145.08 2.75-0.89 9.5-2.48 15-3.53 5.5-1.06 14.5-2.23 20-2.61 5.77-0.39 14.87-0.19 21.5 0.48 6.33 0.63 15.33 1.98 20 3 4.67 1.01 12.1 3.05 16.5 4.52 4.4 1.47 12.5 4.85 18 7.52 5.5 2.66 14.05 7.55 19 10.85 4.95 3.31 12.18 8.86 16.08 12.34 3.89 3.47 9.92 9.47 13.41 13.32 3.48 3.85 9.01 11.05 12.28 16 3.26 4.95 7.64 12.38 9.72 16.5 2.08 4.13 5.2 11.55 6.94 16.5 1.74 4.95 4.14 13.27 5.34 18.5l2.18 9.5c0.43 401.84 0.89 518.5 1.3 518.51 0.41 0 50.47-22.86 111.25-50.82l110.5-50.83c0-465.09-0.26-518.03-1.32-526.86-0.72-6.05-2.22-16.17-3.32-22.5-1.1-6.33-3.29-16.45-4.87-22.5-1.57-6.05-4.92-16.96-7.43-24.25-2.51-7.29-6.83-18.31-9.6-24.5-2.77-6.19-7.53-15.75-10.59-21.25-3.05-5.5-9.29-15.62-13.88-22.5-4.58-6.87-13.03-18.12-18.77-25-5.75-6.87-15.68-17.56-22.08-23.75-6.4-6.19-16.25-14.93-21.89-19.42-5.64-4.5-15.87-11.89-22.75-16.42-6.87-4.54-17-10.65-22.5-13.58-5.5-2.94-14.28-7.32-19.5-9.73-5.22-2.42-14.22-6.15-20-8.29-5.78-2.14-15-5.2-20.5-6.8-5.5-1.6-14.28-3.86-19.5-5.03-5.22-1.17-15.35-3.03-22.5-4.14-9.76-1.52-19.23-2.11-38-2.36-13.75-0.19-28.83 0.08-33.5 0.59zm-347-299.08l-109.5 46.82c-0.39 256.67-0.16 331.19 0.25 331.2 0.41 0 50.48-21.55 111.25-47.9l110.5-47.91c0.49-320.92 0.42-329.2-1.25-329.12-0.96 0.05-51.02 21.15-111.25 46.91z"/>
</svg>`

const HEADSHOT = '/hero.png'

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
  { skill: 'Webflow',          category: 'Development', usedFor: 'Real estate websites, CMS, animations' },
  { skill: 'React + Vite',     category: 'Development', usedFor: 'SaaS products, web apps' },
  { skill: 'WordPress',        category: 'Development', usedFor: 'Custom themes, WooCommerce' },
  { skill: 'Interactive SVG',  category: 'Development', usedFor: 'Neighborhood maps, custom graphics' },
  { skill: 'Supabase',         category: 'Backend',     usedFor: 'Auth, database, RLS policies' },
  { skill: 'Node.js',          category: 'Backend',     usedFor: 'Serverless functions, APIs' },
  { skill: 'Figma',            category: 'Design',      usedFor: 'UI design, prototyping, wireframes' },
  { skill: 'Canva',            category: 'Design',      usedFor: 'Marketing assets, social, presentations' },
  { skill: 'Photoshop',        category: 'Design',      usedFor: 'Image editing, mockups, graphics' },
  { skill: 'IDX Integration',  category: 'Real Estate', usedFor: 'Property search, iHomefinder' },
  { skill: 'Technical SEO',    category: 'Marketing',   usedFor: 'On-page SEO, blog, keyword research' },
  { skill: 'GA4 / GTM / GSC',  category: 'Analytics',   usedFor: 'Tracking, conversion optimisation' },
  { skill: 'Claude',           category: 'AI Tools',    usedFor: 'Code generation, copywriting, product dev' },
  { skill: 'ChatGPT',          category: 'AI Tools',    usedFor: 'Research, copy, image generation' },
  { skill: 'Gemini',           category: 'AI Tools',    usedFor: 'Video generation, research' },
  { skill: 'Team Leadership',  category: 'Operations',  usedFor: 'Sprint planning, SOPs, delivery' },
]

// ── NAV ───────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  const links = [['#work','WORK'],['#skills','SKILLS'],['#about','ABOUT'],['#saas','SAAS'],['#contact','CONTACT']]
  return (
    <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 clamp(20px,4vw,60px)', height:'68px', background: scrolled?'rgba(12,13,15,0.92)':'transparent', backdropFilter: scrolled?'blur(16px)':'none', transition:'background 0.3s' }}>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'1px', background:'linear-gradient(to right, transparent 0%, rgba(196,198,204,0.25) 35%, rgba(196,198,204,0.25) 65%, transparent 100%)' }} />
      <img src="/mike-dht-logo.png" alt="Mike" style={{ height:'34px', display:'block', position:'absolute', left:'50%', transform:'translateX(-50%)' }} />
    </nav>
  )
}

function Hero() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLowEnd, setIsLowEnd] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 4
    const memory = navigator.deviceMemory || 4
    const mobile = /Mobi|Android/i.test(navigator.userAgent)
    setIsLowEnd(cores <= 4 || memory <= 4 || (mobile && cores <= 6))
  }, [])

  return (
    <section style={{ position:'relative', height:'100vh', display:'flex', flexDirection:'column', overflowX:'clip', overflowY:'hidden' }}>
      <div style={{ position:'absolute', inset:0, zIndex:0, overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'var(--bg)' }} />
        {!isLowEnd && <div style={{ position:'absolute', width:'90vw', height:'90vw', borderRadius:'50%', background:'radial-gradient(circle, rgba(80,40,200,0.20) 0%, rgba(74,222,222,0.07) 45%, transparent 70%)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', animation:'orbDrift1 22s ease-in-out infinite', pointerEvents:'none', filter:'blur(4px)' }} />}
      </div>
      <HeroFluid />
      <div className="hero-content" style={{ position:'relative', zIndex:4, height: isMobile?'40%':'32%', minHeight: isMobile?'auto':'260px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'120px clamp(24px,5vw,80px) 0' }}>
        <h1 style={{ fontSize:'clamp(26px,4.2vw,64px)', fontWeight:700, letterSpacing:'-0.03em', lineHeight:1.08, color:'var(--offwhite)', marginBottom:'12px' }}>
          Web Design, Development<br /><span style={{ color:'var(--offwhite)' }}>&amp; Real Estate Tech</span>
        </h1>
        <p style={{ fontSize:'clamp(11px,1vw,14px)', color:'var(--silver)', whiteSpace: isMobile?'normal':'nowrap', textAlign:'center', maxWidth: isMobile?'280px':'none', marginBottom:'20px' }}>
          Webflow · React · Real Estate Websites · Integrations
        </p>
        <div style={{ display:'flex', gap:'12px', justifyContent:'center' }}>
          <a href="https://calendly.com/michael-devhousetech/30min" target="_blank" rel="noreferrer" className="px-btn px-btn-dark">Book a call</a>
          <a href="mailto:michael@devhousetech.io" className="px-btn px-btn-white">Email me</a>
        </div>
      </div>
      {/* Hero down arrow — triggers Skills */}
      <button id="hero-arrow-down" className="arrow-btn-down" onClick={() => {
        if (typeof window.__triggerSkills === 'function') window.__triggerSkills()
      }} style={{ position:'absolute', bottom:'20px', left:'50%', zIndex:10, background:'none', border:'none', cursor:'pointer', padding:'12px', color:'var(--offwhite)' }}>
        <svg width="24" height="14" viewBox="0 0 24 14" fill="none">
          <path d="M1 1L12 12L23 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div style={{ position:'relative', zIndex:2, height: isMobile?'60%':'68%', display:'grid', gridTemplateColumns: isMobile?'1fr':'1fr 1fr', minHeight:0, overflow:'visible' }}>
        <div style={{ position:'relative', overflow:'visible', zIndex:3 }}>
          <img src={HEADSHOT} alt="Dan Michael Villamarin" style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', width:'auto', height:'115%', display:'block' }} />
          <div style={{ position:'absolute', bottom:0, left:0, right:0, display:'flex', justifyContent:'center', gap: isMobile?'20px':'clamp(24px,3.5vw,56px)', padding:'18px 28px', background: isMobile?'rgba(12,13,15,0.88)':'linear-gradient(to right, transparent 0%, rgba(12,13,15,0.92) 28%, rgba(12,13,15,0.92) 72%, transparent 100%)' }}>
            {[['9+','Years experience'],['70+','Projects delivered'],['5yr','Real estate tech']].map(([n,l]) => (
              <div key={l} style={{ textAlign:'center' }}>
                <div style={{ fontSize: isMobile?'20px':'clamp(20px,2.4vw,34px)', fontWeight:700, letterSpacing:'-0.02em', color:'var(--offwhite)', lineHeight:1 }}>{n}</div>
                <div style={{ fontSize:'10px', color: isMobile?'var(--offwhite)':'var(--muted)', marginTop:'4px', letterSpacing:'0.04em' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        {!isMobile && !isLowEnd && (
          <div style={{ position:'relative', overflow:'visible' }}>
            <div style={{ position:'absolute', top:'-40%', left:'-10%', width:'120%', height:'160%', pointerEvents:'none', userSelect:'none' }}>
              <SVG3D svg={DEVHOUSE_SVG} smoothness={0.6} animate="float" animateSpeed={0.4} cursorOrbit lightPosition={[3,2,4]} />
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes orbDrift1 {
          0%,100% { transform: translate(-50%,-50%) scale(1); }
          33%     { transform: translate(-50%,-52%) scale(1.04); }
          66%     { transform: translate(-50%,-48%) scale(0.97); }
        }
      `}</style>
    </section>
  )
}

// ── BLINK ARROW NAV ───────────────────────────────────────────────────────
function ArrowNav({ onUp, onDown, showUp = true, showDown = true }) {
  return (
    <>
      <style>{`
        @keyframes arrowBlink {
          0%, 100% { opacity: 0.2; transform: translateX(-50%) translateY(0); }
          50% { opacity: 0.8; transform: translateX(-50%) translateY(-5px); }
        }
        @keyframes arrowBlinkDown {
          0%, 100% { opacity: 0.2; transform: translateX(-50%) translateY(0); }
          50% { opacity: 0.8; transform: translateX(-50%) translateY(5px); }
        }
        .arrow-btn-up {
          position: absolute; top: 72px; left: 50%;
          transform: translateX(-50%);
          background: none; border: none; cursor: pointer; padding: 12px;
          color: var(--offwhite); z-index: 20;
          animation: arrowBlink 1.8s ease-in-out infinite;
        }
        .arrow-btn-down {
          position: absolute; bottom: 20px; left: 50%;
          transform: translateX(-50%);
          background: none; border: none; cursor: pointer; padding: 12px;
          color: var(--offwhite); z-index: 20;
          animation: arrowBlinkDown 1.8s ease-in-out infinite;
        }
        .arrow-btn-up:hover { opacity: 1; animation: none; transform: translateX(-50%); }
        .arrow-btn-down:hover { opacity: 1; animation: none; transform: translateX(-50%); }
      `}</style>
      {showUp && (
        <button onClick={onUp} className="arrow-btn-up">
          <svg width="24" height="14" viewBox="0 0 24 14" fill="none">
            <path d="M1 13L12 2L23 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      {showDown && (
        <button onClick={onDown} className="arrow-btn-down">
          <svg width="24" height="14" viewBox="0 0 24 14" fill="none">
            <path d="M1 1L12 12L23 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </>
  )
}

// ── FEATURED PROJECTS ─────────────────────────────────────────────────────
const PROJECTS_LIST = [
  { img: '/Email_Sequence_Generator.png', title: 'Email Sequence Generator', tag: 'SaaS Product' },
  { img: '/Arsenal_Aviation.png',         title: 'Arsenal Aviation',         tag: 'Brand Website' },
  { img: '/Devhouse_Site.png',            title: 'DevHouse Technologies',    tag: 'Agency Website' },
  { img: '/Evolve_Realty.png',            title: 'Evolve Realty',            tag: 'Real Estate Website' },
  { img: '/Stacie_Krajcir.png',           title: 'Stacie Krajcir',           tag: 'Real Estate Website' },
]

function FeaturedProjects({ onEnter, onExitTop }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [phase, setPhase] = useState('hidden') // hidden | in | active | out | done
  const panelRef = useRef(null)
  const atFirstSince = useRef(null)
  const atLastSince = useRef(null)
  const TOTAL = PROJECTS_LIST.length

  // Register show trigger so Skills can call it
  useEffect(() => {
    if (onEnter) onEnter(() => {
      setPhase('hidden')
      requestAnimationFrame(() => {
        setPhase('pre-in')
        setTimeout(() => setPhase('in'), 16)
      })
    })
  }, [])

  // Animate in
  useEffect(() => {
    if (phase !== 'in') return
    const t = setTimeout(() => {
      atFirstSince.current = null
      atLastSince.current = null
      setPhase('active')
    }, 920)
    return () => clearTimeout(t)
  }, [phase])

  // Animate out back to Skills
  useEffect(() => {
    if (phase !== 'out') return
    const t = setTimeout(() => {
      setPhase('hidden')
      if (onExitTop) onExitTop()
    }, 920)
    return () => clearTimeout(t)
  }, [phase])

  // Wheel handler while active
  useEffect(() => {
    if (phase !== 'active') return
    let cooldown = false

    const onWheel = (e) => {
      e.preventDefault()
      if (cooldown) return

      const dir = e.deltaY > 0 ? 'down' : e.deltaY < 0 ? 'up' : null
      if (!dir) return

      cooldown = true
      setTimeout(() => { cooldown = false }, 600)

      if (dir === 'down') {
        setActiveIdx(prev => {
          if (prev < TOTAL - 1) {
            atLastSince.current = null
            return prev + 1
          }
          // At last — need one extra scroll to exit
          if (!atLastSince.current) {
            atLastSince.current = true
            return prev
          }
          atLastSince.current = null
          setTimeout(() => {
            if (typeof window.__showAbout === 'function') window.__showAbout()
          }, 50)
          setPhase('done')
          return prev
        })
      } else {
        setActiveIdx(prev => {
          if (prev > 0) {
            atFirstSince.current = null
            return prev - 1
          }
          // At first — need one extra scroll to exit
          if (!atFirstSince.current) {
            atFirstSince.current = true
            return prev
          }
          atFirstSince.current = null
          setPhase('out')
          return prev
        })
      }
    }

    // Mobile: swipe left/right = section nav, swipe up/down = item nav
    let touchStartX_p = 0
    let touchStartY_p = 0
    const onTouchStart = (e) => {
      touchStartX_p = e.touches[0].clientX
      touchStartY_p = e.touches[0].clientY
    }
    const onTouchEnd = (e) => {
      if (window.innerWidth > 768) return
      const dx = touchStartX_p - e.changedTouches[0].clientX
      const dy = touchStartY_p - e.changedTouches[0].clientY
      const isHorizontal = Math.abs(dx) > Math.abs(dy)
      if (isHorizontal) {
        if (Math.abs(dx) < 50) return
        if (dx > 0) {
          // swipe left → About
          setTimeout(() => { if (typeof window.__showAbout === 'function') window.__showAbout() }, 50)
          setPhase('done')
        } else {
          // swipe right → Skills
          setPhase('out')
        }
      } else {
        if (Math.abs(dy) < 50) return
        if (dy > 0) {
          // swipe up = next project
          setActiveIdx(prev => {
            if (prev < TOTAL - 1) { atLastSince.current = null; return prev + 1 }
            if (!atLastSince.current) { atLastSince.current = true; return prev }
            atLastSince.current = null
            setTimeout(() => { if (typeof window.__showAbout === 'function') window.__showAbout() }, 50)
            setPhase('done')
            return prev
          })
        } else {
          // swipe down = prev project
          setActiveIdx(prev => {
            if (prev > 0) { atFirstSince.current = null; return prev - 1 }
            if (!atFirstSince.current) { atFirstSince.current = true; return prev }
            atFirstSince.current = null
            setPhase('out')
            return prev
          })
        }
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [phase, TOTAL])

  // done — register re-entry callback for About to call back
  useEffect(() => {
    if (phase !== 'done') return
    window.__reenterProjects = () => {
      atFirstSince.current = null
      atLastSince.current = null
      setPhase('active')
    }
    return () => { window.__reenterProjects = null }
  }, [phase, TOTAL])

  const p = PROJECTS_LIST[activeIdx]
  const isFixed = phase !== 'done'

  const panelStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    height: '100vh',
    zIndex: 4,
    willChange: 'transform',
    overflow: 'hidden',
    transform: (phase === 'hidden' || phase === 'pre-in' || phase === 'out') ? (window.innerWidth <= 768 ? 'translateX(100vw)' : 'translateY(100vh)') : 'translate(0,0)',
    transition: phase === 'hidden' || phase === 'pre-in' ? 'none' : 'transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)',
  }

  return (
    <>
      <section id="work" style={{ height: '1px', position: 'relative', zIndex: 1 }}>
        <div id="work-anchor" style={{ height: 0 }} />
      </section>
      <div ref={panelRef} style={panelStyle}>
        {/* Crossfade image stack — luxury transition */}
        {PROJECTS_LIST.map((proj, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            opacity: i === activeIdx ? 1 : 0,
            transform: i === activeIdx ? 'scale(1)' : 'scale(1.04)',
            transition: 'opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 1.2s cubic-bezier(0.4,0,0.2,1)',
            willChange: 'opacity, transform',
          }}>
            <img src={proj.img} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', display: 'block' }} />
          </div>
        ))}
        {/* Vignette top — matches #0c0d0f brand bg */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to bottom, #0c0d0f 0%, rgba(12,13,15,0.6) 60%, transparent 100%)', pointerEvents: 'none', zIndex: 1 }} />
        {/* Vignette bottom — matches #0c0d0f brand bg */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, #0c0d0f 0%, rgba(12,13,15,0.7) 60%, transparent 100%)', pointerEvents: 'none', zIndex: 1 }} />
        {/* Section label — top left, pushed below red line area */}
        <div className="projects-label" style={{ position: 'absolute', top: '140px', left: 'clamp(20px,7.14vw,120px)', zIndex: 2 }}>
          <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '6px' }}>Featured Work</div>
          <h2 style={{ fontSize: 'clamp(20px,2vw,28px)', fontWeight: 700, color: 'var(--offwhite)' }}>Selected Projects</h2>
        </div>
        {/* Project info — bottom left, animated per card */}
        {PROJECTS_LIST.map((proj, i) => (
          <div key={i} className="projects-item-info" style={{
  position: 'absolute', bottom: '56px', left: 'clamp(20px,7.14vw,120px)', zIndex: 2,
            opacity: i === activeIdx ? 1 : 0,
            transform: i === activeIdx ? 'translateY(0px)' : 'translateY(16px)',
            transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1) 0.15s, transform 0.7s cubic-bezier(0.4,0,0.2,1) 0.15s',
            pointerEvents: 'none',
          }}>
            <div style={{ fontSize: '11px', color: 'var(--teal)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>{proj.tag}</div>
            <div style={{ fontSize: 'clamp(28px,4vw,56px)', fontWeight: 700, color: 'var(--offwhite)', letterSpacing: '-0.02em', textTransform: 'uppercase', fontFamily: "'Biennale', sans-serif", lineHeight: 1.05 }}>{proj.title}</div>
          </div>
        ))}
        <div style={{ position: 'absolute', right: 'clamp(20px,3vw,48px)', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          {PROJECTS_LIST.map((_, i) => (
            <div key={i} style={{
              width: '3px', height: i === activeIdx ? '24px' : '4px', borderRadius: '2px',
              background: i === activeIdx ? 'var(--offwhite)' : 'rgba(255,255,255,0.25)',
              transition: 'height 0.3s, background 0.3s',
            }} />
          ))}
        </div>
        <ArrowNav
          showUp={true}
          showDown={true}
          onUp={() => { atFirstSince.current = true; setPhase('out') }}
          onDown={() => {
            setTimeout(() => { if (typeof window.__showAbout === 'function') window.__showAbout() }, 50)
            setPhase('done')
          }}
        />
      </div>
    </>
  )
}

// ── SKILLS ROULETTE ───────────────────────────────────────────────────────
function SkillsTable() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [phase, setPhase] = useState('hidden') // hidden | in | sticky | out | done
  const panelRef = useRef(null)
  const TOTAL = SKILLS.length
  const ROW_HEIGHT = 80
  const atFirstItemSince = useRef(null)
  const atLastItemSince = useRef(null)
  const pinnedY = useRef(0)

  // ── Scroll lock ──────────────────────────────────────────────────────
  const lockRef = useRef(null)
  const lockScrollAt = (y) => {
    if (lockRef.current) window.removeEventListener('scroll', lockRef.current)
    lockRef.current = () => window.scrollTo({ top: y, behavior: 'instant' })
    window.addEventListener('scroll', lockRef.current)
  }
  const unlockScroll = () => {
    if (lockRef.current) { window.removeEventListener('scroll', lockRef.current); lockRef.current = null }
  }

  // ── Phase: in ────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'in') return
    pinnedY.current = window.scrollY
    lockScrollAt(window.scrollY)
    const t = setTimeout(() => { setPhase('sticky') }, 920)
    return () => { clearTimeout(t); unlockScroll() }
  }, [phase])

  // ── Phase: out ───────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'out') return
    unlockScroll()
    const t = setTimeout(() => {
      atFirstItemSince.current = null
      atLastItemSince.current = null
      setPhase('hidden')
    }, 920)
    return () => clearTimeout(t)
  }, [phase])

  // ── Phase: sticky ────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'sticky') return
    lockScrollAt(pinnedY.current)
    let cooldown = false

    const navigate = (dir) => {
      if (cooldown) return
      cooldown = true
      setTimeout(() => { cooldown = false }, 600)
      if (dir === 'down') {
        setActiveIdx(prev => {
          if (prev < TOTAL - 1) { atLastItemSince.current = null; return prev + 1 }
          if (!atLastItemSince.current) { atLastItemSince.current = true; return prev }
          atLastItemSince.current = null
          unlockScroll()
          setTimeout(() => { if (typeof window.__showProjects === 'function') window.__showProjects() }, 50)
          setPhase('done')
          return prev
        })
      } else {
        setActiveIdx(prev => {
          if (prev > 0) { atFirstItemSince.current = null; return prev - 1 }
          if (!atFirstItemSince.current) { atFirstItemSince.current = true; return prev }
          atFirstItemSince.current = null
          setPhase('out')
          return prev
        })
      }
    }

    const onWheel = (e) => { e.preventDefault(); if (e.deltaY > 0) navigate('down'); else navigate('up') }

    let tX = 0, tY = 0
    const onTouchStart = (e) => { tX = e.touches[0].clientX; tY = e.touches[0].clientY }
    const onTouchEnd = (e) => {
      if (window.innerWidth > 768) return
      const dx = tX - e.changedTouches[0].clientX
      const dy = tY - e.changedTouches[0].clientY
      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) < 50) return
        if (dx > 0) { unlockScroll(); setTimeout(() => { if (typeof window.__showProjects === 'function') window.__showProjects() }, 50); setPhase('done') }
        else { setPhase('out') }
      } else {
        if (Math.abs(dy) < 50) return
        navigate(dy > 0 ? 'down' : 'up')
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [phase, TOTAL])

  // ── Phase: hidden ────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'hidden') return
    window.scrollTo({ top: 0, behavior: 'instant' })
    const onScroll = () => window.scrollTo({ top: 0, behavior: 'instant' })

    const triggerIn = () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      setPhase('in')
    }
    const onWheel = (e) => { if (e.deltaY > 0) { e.preventDefault(); triggerIn() } }
    const SCROLL_KEYS = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space', 'End', 'Home']
    const onKeyDown = (e) => { if (SCROLL_KEYS.includes(e.code)) { e.preventDefault(); if (['ArrowDown','PageDown','Space','End'].includes(e.code)) triggerIn() } }
    let tX = 0
    const onTouchStart = (e) => { tX = e.touches[0].clientX }
    const onTouchEnd = (e) => { if (tX - e.changedTouches[0].clientX > 50) triggerIn() }

    window.__triggerSkills = triggerIn
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [phase])

  // ── Phase: done — keep __reenterSkills always registered ────────────
  useEffect(() => {
    if (phase !== 'done') return
    window.__reenterSkills = () => {
      atFirstItemSince.current = null
      atLastItemSince.current = null
      pinnedY.current = window.scrollY
      lockScrollAt(window.scrollY)
      setPhase('sticky')
    }
  }, [phase, TOTAL])

  const trackOffset = Math.max(0, (activeIdx - 1) * ROW_HEIGHT)
  const isFixed = phase !== 'sticky'
  const panelStyle = {
    height: '100vh',
    background: 'var(--bg)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    willChange: 'transform',
    ...(isFixed ? {
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 3,
      transform: (phase === 'hidden' || phase === 'pre-in' || phase === 'out') ? (window.innerWidth <= 768 ? 'translateX(100vw)' : 'translateY(100vh)') : 'translate(0,0)',
      transition: phase === 'hidden' ? 'none' : 'transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)',
    } : {
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 3,
      transform: 'translate(0,0)',
      transition: 'none',
    })
  }

  return (
    <section id="skills" style={{ position:'relative', height:'1px', zIndex:2 }}>
      <div ref={panelRef} style={panelStyle}>

        {/* Header */}
        <div style={{ padding:'0 clamp(20px,7.14vw,120px)', marginBottom:'32px' }}>
          <div style={{ fontSize:'11px', fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--teal)', marginBottom:'8px' }}>Capabilities</div>
          <h2 style={{ fontSize:'clamp(28px,3vw,40px)', fontWeight:700, color:'var(--offwhite)' }}>Skills &amp; Tools</h2>
        </div>

        {/* Track */}
        <div style={{ position:'relative', padding:'0 clamp(20px,7.14vw,120px)' }}>
          <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:2, background:`linear-gradient(to bottom, var(--bg) 0%, transparent 25%, transparent 75%, var(--bg) 100%)` }} />
          <div style={{ overflow:'hidden', height:`${ROW_HEIGHT * 3}px` }}>
            <div style={{ transition:'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)', transform:`translateY(-${trackOffset}px)` }}>
              {SKILLS.map((s, i) => {
                const dist = Math.abs(i - activeIdx)
                const opacity = dist === 0 ? 1 : dist === 1 ? 0.22 : 0.06
                const scale = dist === 0 ? 1 : dist === 1 ? 0.97 : 0.94
                return (
                  <div key={i} style={{
                    display:'grid', gridTemplateColumns:'2fr 1fr 2fr', gap:'16px',
                    borderBottom:'1px solid var(--border)',
                    borderTop: i === 0 ? '1px solid var(--border)' : 'none',
                    opacity, transform:`scale(${scale})`,
                    transition:'opacity 0.5s ease, transform 0.5s ease',
                    height:`${ROW_HEIGHT}px`, alignItems:'center',
                  }}>
                    <div style={{ fontSize:'clamp(22px,2.6vw,42px)', fontWeight:700, letterSpacing:'0.03em', color:'var(--offwhite)', fontFamily:"'Biennale', sans-serif", lineHeight:1, textTransform:'uppercase' }}>{s.skill}</div>
                    <div style={{ fontSize:'clamp(12px,1vw,14px)', color:'var(--muted)' }}>{s.category}</div>
                    <div style={{ fontSize:'clamp(12px,1vw,14px)', color:'var(--silver)', textAlign:'right' }}>{s.usedFor}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div style={{ position:'absolute', right:'clamp(20px,3vw,48px)', top:'50%', transform:'translateY(-50%)', display:'flex', flexDirection:'column', gap:'8px', alignItems:'center' }}>
          {SKILLS.map((_, i) => (
            <div key={i} style={{ width:'3px', height: i === activeIdx ? '24px' : '4px', borderRadius:'2px', background: i === activeIdx ? 'var(--offwhite)' : 'var(--border)', transition:'height 0.3s, background 0.3s' }} />
          ))}
        </div>

        <ArrowNav
          showUp={true}
          showDown={true}
          onUp={() => { atFirstItemSince.current = true; setPhase('out') }}
          onDown={() => { unlockScroll(); setTimeout(() => { if (typeof window.__showProjects === 'function') window.__showProjects() }, 50); setPhase('done') }}
        />
      </div>
    </section>
  )
}


// ── ABOUT ─────────────────────────────────────────────────────────────────
const ABOUT_SLIDES = [
  { id: 'professional' },
  { id: 'personal' },
  { id: 'product' },
  { id: 'game' },
]

function About({ onEnter, onExitTop }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [phase, setPhase] = useState('hidden')
  const panelRef = useRef(null)
  const atFirstSince = useRef(null)
  const atLastSince = useRef(null)
  const TOTAL = ABOUT_SLIDES.length

  useEffect(() => {
    if (onEnter) onEnter(() => {
      setPhase('hidden')
      requestAnimationFrame(() => {
        setPhase('pre-in')
        setTimeout(() => setPhase('in'), 16)
      })
    })
  }, [])

  useEffect(() => {
    if (phase !== 'in') return
    const t = setTimeout(() => {
      setActiveIdx(0)
      atFirstSince.current = null
      atLastSince.current = null
      setPhase('active')
    }, 920)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'out') return
    const t = setTimeout(() => {
      setPhase('hidden')
      if (onExitTop) onExitTop()
    }, 920)
    return () => clearTimeout(t)
  }, [phase])

  // Track activeIdx in a ref so wheel handler doesn't need it as a dep
  const activeIdxRef = useRef(0)
  useEffect(() => { activeIdxRef.current = activeIdx }, [activeIdx])

  // Separate handler for game slide — scroll up goes back, scroll down exits to Contact
  useEffect(() => {
    if (phase !== 'active') return
    let cooldown = false
    const onGameWheel = (e) => {
      if (activeIdxRef.current !== 3) return
      e.preventDefault()
      if (cooldown) return
      cooldown = true
      setTimeout(() => { cooldown = false }, 600)
      if (e.deltaY < 0) {
        // Scroll up — back to product slide
        setActiveIdx(2)
      } else {
        // Scroll down — exit to Contact
        setTimeout(() => {
          if (typeof window.__showContact === 'function') window.__showContact()
        }, 50)
        setPhase('done')
      }
    }
    // Mobile: swipe left on game slide → Contact, swipe right → back to slide 3
    let gameTouchStartX = 0
    const onGameTouchStart = (e) => { gameTouchStartX = e.touches[0].clientX }
    const onGameTouchEnd = (e) => {
      if (window.innerWidth > 768) return
      if (activeIdxRef.current !== 3) return
      const dx = gameTouchStartX - e.changedTouches[0].clientX
      if (Math.abs(dx) < 50) return
      if (dx > 0) {
        // swipe left → Contact
        setTimeout(() => { if (typeof window.__showContact === 'function') window.__showContact() }, 50)
        setPhase('done')
      } else {
        // swipe right → back to slide 3
        setActiveIdx(2)
      }
    }

    window.addEventListener('wheel', onGameWheel, { passive: false })
    window.addEventListener('touchstart', onGameTouchStart, { passive: true })
    window.addEventListener('touchend', onGameTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', onGameWheel)
      window.removeEventListener('touchstart', onGameTouchStart)
      window.removeEventListener('touchend', onGameTouchEnd)
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'active') return
    let cooldown = false
    const onWheel = (e) => {
      // Don't intercept scroll on game slide — let it scroll naturally
      if (activeIdxRef.current === 3) return
      e.preventDefault()
      if (cooldown) return
      const dir = e.deltaY > 0 ? 'down' : e.deltaY < 0 ? 'up' : null
      if (!dir) return
      cooldown = true
      setTimeout(() => { cooldown = false }, 600)

      if (dir === 'down') {
        setActiveIdx(prev => {
          if (prev < TOTAL - 1) {
            atLastSince.current = null
            return prev + 1
          }
          if (!atLastSince.current) {
            atLastSince.current = true
            return prev
          }
          atLastSince.current = null
          setTimeout(() => {
            if (typeof window.__showContact === 'function') window.__showContact()
          }, 50)
          setPhase('done')
          return prev
        })
      } else {
        setActiveIdx(prev => {
          if (prev > 0) {
            atFirstSince.current = null
            return prev - 1
          }
          if (!atFirstSince.current) {
            atFirstSince.current = true
            return prev
          }
          atFirstSince.current = null
          setPhase('out')
          return prev
        })
      }
    }
    // Mobile: swipe left/right = slide nav only, up/down = free scroll
    let touchStartX = 0
    let touchStartY = 0
    const onTouchStart = (e) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }
    const onTouchEnd = (e) => {
      if (window.innerWidth > 768) return
      if (activeIdxRef.current === 3) return
      const dx = touchStartX - e.changedTouches[0].clientX
      const dy = touchStartY - e.changedTouches[0].clientY
      // Only horizontal swipes navigate — vertical is free scroll
      if (Math.abs(dx) <= Math.abs(dy)) return
      if (Math.abs(dx) < 50) return
      if (dx > 0) {
        // swipe left → next slide, at last → Contact
        setActiveIdx(prev => {
          if (prev < TOTAL - 1) { atLastSince.current = null; return prev + 1 }
          if (!atLastSince.current) { atLastSince.current = true; return prev }
          atLastSince.current = null
          setTimeout(() => { if (typeof window.__showContact === 'function') window.__showContact() }, 50)
          setPhase('done')
          return prev
        })
      } else {
        // swipe right → prev slide, at first → Projects
        setActiveIdx(prev => {
          if (prev > 0) { atFirstSince.current = null; return prev - 1 }
          if (!atFirstSince.current) { atFirstSince.current = true; return prev }
          atFirstSince.current = null
          setPhase('out')
          return prev
        })
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [phase, TOTAL])

  useEffect(() => {
    if (phase !== 'done') return
    // Allow re-entry from Contact scrolling back up
    window.__reenterAbout = () => {
      setActiveIdx(TOTAL - 1)
      atLastSince.current = null
      setPhase('active')
    }
    return () => { window.__reenterAbout = null }
  }, [phase, TOTAL])

  const facts = [
    ['Based','Quezon City, Philippines'],
    ['Experience','9 years'],
    ['Previous','Luxury Presence — 4 years'],
    ['Progression','Web Designer → Integrations Specialist → Product Expert'],
    ['Primary stack','Webflow, WordPress, React + Vite'],
    ['Niche','US Real Estate Websites'],
    ['Open to','Freelance · Full-time · White-label'],
  ]

  const interests = [
    ['Current obsession','AI, Automation & SaaS'],
    ['Building','AI Tools for Realtors'],
    ['Weekend Mode','Gaming, Music & Side Projects'],
    ['Watching','Dota 2, Documentaries, Diary of a CEO, Anime'],
    ['Learning About','Startups, Technology, History'],
    ['Fuel','Coffee'],
    ['Work Style','Remote-first'],
    ['Long-term goal','Building Products That Help Businesses Grow'],
  ]

  const panelStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    height: '100vh',
    zIndex: 5,
    willChange: 'transform',
    overflow: 'hidden',
    background: 'var(--bg)',
    transform: (phase === 'hidden' || phase === 'pre-in' || phase === 'out') ? (window.innerWidth <= 768 ? 'translateX(100vw)' : 'translateY(100vh)') : 'translate(0,0)',
    transition: phase === 'hidden' || phase === 'pre-in' ? 'none' : 'transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)',
  }

  return (
    <>
      <section id="about" style={{ height: '1px', position: 'relative', zIndex: 1 }} />
      <div ref={panelRef} style={panelStyle}>

        {/* Slide 1 — Professional */}
<div className="about-panel" style={{
  position: 'absolute', inset: 0,
          opacity: activeIdx === 0 ? 1 : 0,
          transform: activeIdx === 0 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(80px,10vw,120px) clamp(20px,7.14vw,120px)',
          pointerEvents: activeIdx === 0 ? 'auto' : 'none',
          overflowY: 'auto',
        }}>
          <div style={{ marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '8px' }}>Background</div>
            <h2 style={{ fontSize: 'clamp(28px,3vw,40px)', fontWeight: 700, color: 'var(--offwhite)' }}>About</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,420px),1fr))', gap: 'clamp(40px,6vw,100px)' }}>
            <div>
              <p style={{ fontSize: '15px', color: 'var(--silver)', lineHeight: 1.85, marginBottom: '18px' }}>
                I've spent the last 9 years working across web design, development, and digital products.
              </p>
              <p style={{ fontSize: '15px', color: 'var(--silver)', lineHeight: 1.85, marginBottom: '18px' }}>
                Along the way, I've worked with startups, agencies, independent clients, and one of the leading real estate website platforms in the US. That journey eventually led me to relaunch <strong style={{ color: 'var(--offwhite)', fontWeight: 500 }}>DevHouse Technologies</strong>, build a team, and deliver more than <strong style={{ color: 'var(--offwhite)', fontWeight: 500 }}>70 projects</strong> for real estate businesses in a matter of months.
              </p>
              <p style={{ fontSize: '15px', color: 'var(--silver)', lineHeight: 1.85, marginBottom: '28px' }}>
                Today, my work sits at the intersection of design, development, AI, and product thinking. Whether I'm building a website, developing a SaaS product, or improving internal systems, I'm most interested in creating solutions that are both useful and well-crafted.
              </p>
<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                <a href="mailto:michael@devhousetech.io" className="px-btn px-btn-dark">Email me</a>
                <a href="https://calendly.com/michael-devhousetech/30min" target="_blank" rel="noreferrer" className="px-btn px-btn-white">Book a call</a>
              </div>
            </div>
            <div>
              {facts.map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px 0', borderBottom: '1px solid var(--border)', gap: '20px' }}>
                  <span style={{ fontSize: '12px', color: '#8A8C92', flexShrink: 0, paddingTop: '1px' }}>{label}</span>
                  <span style={{ fontSize: '13px', color: 'var(--offwhite)', fontWeight: 500, textAlign: 'right' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide 2 — Personal */}
<div className="personal-slide" style={{
  position: 'absolute', inset: 0,
  opacity: activeIdx === 1 ? 1 : 0,
  transform: activeIdx === 1 ? 'translateY(0)' : 'translateY(20px)',
  transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1) 0.1s, transform 0.7s cubic-bezier(0.4,0,0.2,1) 0.1s',
  pointerEvents: activeIdx === 1 ? 'auto' : 'none',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  overflow: 'hidden',
}}>
  {/* Left — photo */}
  <div className="personal-photo" style={{ position: 'relative', overflow: 'hidden' }}>
            <img src="/hero.png" alt="Mike" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, var(--bg) 100%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(to top, var(--bg) 0%, transparent 100%)' }} />
          </div>
          {/* Right — personal details */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(40px,6vw,80px) clamp(40px,6vw,80px) clamp(40px,6vw,80px) clamp(20px,4vw,60px)' }}>
            <div style={{ marginBottom: '40px' }}>
              <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '8px' }}>Beyond the screen</div>
              <h2 style={{ fontSize: 'clamp(28px,3vw,40px)', fontWeight: 700, color: 'var(--offwhite)' }}>The Other Side</h2>
            </div>
            <p style={{ fontSize: '15px', color: 'var(--silver)', lineHeight: 1.85, marginBottom: '18px' }}>
             Beyond client projects and product launches, I'm someone who genuinely enjoys building things.
            </p>
            <p style={{ fontSize: '15px', color: 'var(--silver)', lineHeight: 1.85, marginBottom: '18px' }}>
            If I become interested in something, I tend to learn everything I can about it until I understand it well enough to build, improve, or teach it. That mindset has taken me through web design, development, SaaS, AI, leadership, music, and countless side projects over the years.
            </p>
            <p style={{ fontSize: '15px', color: 'var(--silver)', lineHeight: 1.85, marginBottom: '18px' }}>
             Most weekends you'll find me experimenting with AI, exploring new product ideas, playing games, practicing music, or diving deep into whatever topic has captured my curiosity that week.
            </p>
            <p style={{ fontSize: '15px', color: 'var(--silver)', lineHeight: 1.85, marginBottom: '18px' }}>
             Outside of work, I enjoy traveling when I get the chance, following Dota 2 tournaments, watching documentaries and long-form interviews, and spending quiet evenings researching ideas that might eventually become products.
            </p>

            <div>
              {interests.map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid var(--border)', gap: '20px' }}>
                  <span style={{ fontSize: '12px', color: '#8A8C92', flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: '13px', color: 'var(--offwhite)', fontWeight: 500, textAlign: 'right' }}>{val}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '35px'}}>
                <a href="mailto:michael@devhousetech.io" className="px-btn px-btn-dark">Email me</a>
                <a href="https://calendly.com/michael-devhousetech/30min" target="_blank" rel="noreferrer" className="px-btn px-btn-white">Book a call</a>
              </div>
          </div>
        </div>

{/* Slide 3 — Product */}
<div className="saas-slide" style={{
  position: 'absolute', inset: 0,
          position: 'absolute', inset: 0,
          opacity: activeIdx === 2 ? 1 : 0,
          transform: activeIdx === 2 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1) 0.1s, transform 0.7s cubic-bezier(0.4,0,0.2,1) 0.1s',
          pointerEvents: activeIdx === 2 ? 'auto' : 'none',
display: 'flex', flexDirection: 'column', justifyContent: 'center',
padding: 'clamp(80px,10vw,120px) clamp(20px,7.14vw,120px)',
overflowY: 'auto',
        }}>
          <div style={{ marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '8px' }}>Product</div>
            <h2 style={{ fontSize: 'clamp(28px,3vw,40px)', fontWeight: 700, color: 'var(--offwhite)' }}>Built &amp; Shipped a SaaS</h2>
          </div>
          <div style={{ border: '1px solid var(--border)', borderRadius: '6px', padding: 'clamp(28px,4vw,56px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,320px),1fr))', gap: 'clamp(32px,4vw,60px)', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 'clamp(22px,2.5vw,34px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--offwhite)', lineHeight: 1.15, marginBottom: '14px' }}>Lead Follow-Up<br />Email Sequence Generator</h3>
              <p style={{ fontSize: '14px', color: 'var(--silver)', lineHeight: 1.8, marginBottom: '24px' }}>A tool built specifically for real estate agents — generates personalised email follow-up sequences from a single input. Designed, built, and launched solo. React + Vite, Vercel serverless, Supabase, Lemon Squeezy, Claude API.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                {['React + Vite','Vercel','Supabase','Lemon Squeezy','Claude API'].map(t => (
                  <span key={t} style={{ fontSize: '11px', fontWeight: 500, padding: '4px 10px', border: '1px solid var(--border)', borderRadius: '2px', color: 'var(--silver)', letterSpacing: '0.03em' }}>{t}</span>
                ))}
              </div>
              <a href="https://sequence.devhousetech.io" target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: 'var(--silver)', borderBottom: '1px solid rgba(196,198,204,0.25)', paddingBottom: '1px' }}>sequence.devhousetech.io ↗</a>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 'clamp(36px,4vw,52px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--offwhite)', lineHeight: 1 }}>$29<span style={{ fontSize: '16px', color: 'var(--muted)', fontWeight: 400 }}>/mo</span></div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>Pro Plan</div>
              <div style={{ fontSize: '13px', color: 'var(--silver)', marginTop: '10px' }}>Free Tier · 3 Sequences</div>
            </div>
          </div>
        </div>

        {/* Slide 4 — Game — full bleed, PixelGame renders as-is */}
        <div style={{
          position: 'absolute', inset: 0,
          opacity: activeIdx === 3 ? 1 : 0,
          transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1) 0.1s',
          pointerEvents: activeIdx === 3 ? 'auto' : 'none',
          overflowY: 'auto',
        }}>
          {activeIdx === 3 && <PixelGame />}
        </div>

        {/* Vertical pagination */}
        <div style={{ position: 'absolute', right: 'clamp(20px,3vw,48px)', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', zIndex: 10 }}>
          {ABOUT_SLIDES.map((_, i) => (
            <div key={i} style={{
              width: '3px',
              height: i === activeIdx ? '24px' : '4px',
              borderRadius: '2px',
              background: i === activeIdx ? 'var(--offwhite)' : 'var(--border)',
              transition: 'height 0.3s, background 0.3s',
            }} />
          ))}
        </div>

        <ArrowNav
          showUp={true}
          showDown={true}
          onUp={() => {
            if (activeIdx === 0) {
              atFirstSince.current = true
              setPhase('out')
            } else {
              setActiveIdx(prev => prev - 1)
            }
          }}
          onDown={() => {
            if (activeIdx === TOTAL - 1) {
              // Last slide — go to Contact
              setTimeout(() => { if (typeof window.__showContact === 'function') window.__showContact() }, 50)
              setPhase('done')
            } else {
              setActiveIdx(prev => prev + 1)
            }
          }}
        />

      </div>
    </>
  )
}

// ── SAAS ──────────────────────────────────────────────────────────────────
function Saas({ onEnter, onExitTop }) {
  const [phase, setPhase] = useState('hidden')
  const atExitSince = useRef(null)
  const atEnterSince = useRef(null)

  useEffect(() => {
    if (onEnter) onEnter(() => setPhase('in'))
  }, [])

  useEffect(() => {
    if (phase !== 'in') return
    const t = setTimeout(() => {
      atExitSince.current = null
      atEnterSince.current = null
      setPhase('active')
    }, 920)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'out') return
    const t = setTimeout(() => {
      setPhase('hidden')
      if (onExitTop) onExitTop()
    }, 920)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'active') return
    let cooldown = false
    const onWheel = (e) => {
      e.preventDefault()
      if (cooldown) return
      const dir = e.deltaY > 0 ? 'down' : e.deltaY < 0 ? 'up' : null
      if (!dir) return
      cooldown = true
      setTimeout(() => { cooldown = false }, 600)

      if (dir === 'down') {
        if (!atExitSince.current) {
          atExitSince.current = true
        } else {
          atExitSince.current = null
          setTimeout(() => {
            if (typeof window.__showContact === 'function') window.__showContact()
          }, 50)
          setPhase('done')
        }
      } else {
        if (!atEnterSince.current) {
          atEnterSince.current = true
        } else {
          atEnterSince.current = null
          setPhase('out')
        }
      }
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [phase])

  useEffect(() => {
    if (phase !== 'done') return
    window.__reenterSaas = () => setPhase('active')
    return () => { window.__reenterSaas = null }
  }, [phase])

  const panelStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    height: '100vh',
    zIndex: 6,
    willChange: 'transform',
    overflow: 'hidden',
    background: 'var(--bg)',
    transform: phase === 'hidden' || phase === 'pre-in' ? 'translateY(100vh)' : phase === 'out' ? 'translateY(100vh)' : 'translateY(0)',
    transition: phase === 'hidden' || phase === 'pre-in' ? 'none' : 'transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)',
  }

  return (
    <section id="saas" style={{ height: '1px', position: 'relative', zIndex: 1 }}>
      <div style={panelStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: 'clamp(80px,10vw,120px) clamp(20px,7.14vw,120px)' }}>
          <div style={{ marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '8px' }}>Product</div>
            <h2 style={{ fontSize: 'clamp(28px,3vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--offwhite)' }}>Built &amp; Shipped a SaaS</h2>
          </div>
          <div style={{ border: '1px solid var(--border)', borderRadius: '6px', padding: 'clamp(28px,4vw,56px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,320px),1fr))', gap: 'clamp(32px,4vw,60px)', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 'clamp(22px,2.5vw,34px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--offwhite)', lineHeight: 1.15, marginBottom: '14px' }}>Lead Follow-Up<br />Email Sequence Generator</h3>
              <p style={{ fontSize: '14px', color: 'var(--silver)', lineHeight: 1.8, marginBottom: '24px' }}>A tool built specifically for real estate agents — generates personalised email follow-up sequences from a single input. Designed, built, and launched solo. React + Vite, Vercel serverless, Supabase, Lemon Squeezy, Claude API.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                {['React + Vite','Vercel','Supabase','Lemon Squeezy','Claude API'].map(t => (
                  <span key={t} style={{ fontSize: '11px', fontWeight: 500, padding: '4px 10px', border: '1px solid var(--border)', borderRadius: '2px', color: 'var(--silver)', letterSpacing: '0.03em' }}>{t}</span>
                ))}
              </div>
              <a href="https://sequence.devhousetech.io" target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: 'var(--silver)', borderBottom: '1px solid rgba(196,198,204,0.25)', paddingBottom: '1px' }}>sequence.devhousetech.io ↗</a>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 'clamp(36px,4vw,52px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--offwhite)', lineHeight: 1 }}>$29<span style={{ fontSize: '16px', color: 'var(--muted)', fontWeight: 400 }}>/mo</span></div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>Pro Plan</div>
              <div style={{ fontSize: '13px', color: 'var(--silver)', marginTop: '10px' }}>Free Tier · 3 Sequences</div>
            </div>
          </div>
        </div>
        <ArrowNav
          showUp={true}
          showDown={true}
          onUp={() => { atEnterSince.current = true; setPhase('out') }}
          onDown={() => {
            setTimeout(() => { if (typeof window.__showContact === 'function') window.__showContact() }, 50)
            setPhase('done')
          }}
        />
      </div>
    </section>
  )
}

// ── MOBILE CONTACT ────────────────────────────────────────────────────────
function MobileContact({ onEnter, onExitTop }) {
  const [visible, setVisible] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (onEnter) onEnter(() => {
      setVisible(false)
      setAnimating(false)
      requestAnimationFrame(() => {
        setAnimating(true)
        setVisible(true)
      })
    })
  }, [])

  useEffect(() => {
    const nav = document.querySelector('nav')
    if (!nav) return
    nav.style.transition = 'opacity 0.3s'
    nav.style.opacity = visible ? '0' : '1'
    nav.style.pointerEvents = visible ? 'none' : 'auto'
  }, [visible])

  const handleUp = () => {
    setAnimating(true)
    setVisible(false)
    setTimeout(() => {
      setAnimating(false)
      if (onExitTop) onExitTop()
    }, 900)
  }

  useEffect(() => {
    if (!visible) return
    let cooldown = false
    const onWheel = (e) => {
      if (e.deltaY >= 0) return
      e.preventDefault()
      if (cooldown) return
      cooldown = true
      setTimeout(() => { cooldown = false }, 700)
      handleUp()
    }
    // Mobile: swipe right → go back (same as close)
    let touchStartX = 0
    const onTouchStart = (e) => { touchStartX = e.touches[0].clientX }
    const onTouchEnd = (e) => {
      if (window.innerWidth > 768) return
      const dx = touchStartX - e.changedTouches[0].clientX
      if (dx < -50) handleUp()
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [visible])

  const links = [
    ['HOME', '/', false],
    ['ABOUT', '#about', false],
    ['INSTAGRAM', 'https://instagram.com/web.mike', true],
    ['LINKEDIN', 'https://linkedin.com/in/dan-michael-villamarin-666692130', true],
    ['STUDIO', 'https://devhousetech.io', true],
  ]

  return (
    <div className="mobile-contact-panel" style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: '100vh',
      zIndex: 7,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      overflowY: 'auto',
      pointerEvents: visible ? 'auto' : 'none',
transform: visible ? 'translateX(0)' : 'translateX(100%)',
transition: animating ? 'transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
willChange: 'transform',
background: '#EDEAE4',
    }}>

      {/* BLACK — MIKE */}
<div style={{
  background: '#111214',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '50px 32px 32px 40px',
  flexShrink: 0,
  position: 'relative',
}}>
<button onClick={handleUp} style={{
  position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)',
  background: 'none', border: 'none', cursor: 'pointer', padding: '12px',
  color: '#EDEAE4', zIndex: 10,
  display: 'none',
}}>
  <svg width="24" height="14" viewBox="0 0 24 14" fill="none">
    <path d="M1 13L12 2L23 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
</button>
        <span onClick={handleUp} style={{
          position: 'absolute', top: '24px', right: '28px',
          fontSize: '13px', fontWeight: 700, color: '#fff',
          textDecoration: 'underline', textUnderlineOffset: '3px',
          cursor: 'pointer', letterSpacing: '0.05em', opacity: 0.6,
        }}>CLOSE</span>
        <span style={{
          fontSize: 'clamp(48px,14vw,80px)',
          fontWeight: 700,
          color: '#EDEAE4',
          fontFamily: "'Biennale', sans-serif",
          letterSpacing: '-0.04em',
          lineHeight: 0.85,
          userSelect: 'none',
        }}>MIKE</span>
      </div>

      {/* SILVER — Navigation links */}
      <div style={{
        background: '#E4E0D8',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '24px 32px 32px 40px',
gap: '2px',
flexShrink: 0,
position: 'relative',
      }}>

        {links.map(([label, href, external]) => (
          <a key={label} href={href}
            target={external ? '_blank' : undefined}
            rel="noreferrer"
            onClick={label === 'HOME' ? (e) => { e.preventDefault(); window.location.reload() } : undefined}
            style={{
              fontSize: 'clamp(24px,7vw,40px)',
              fontWeight: 700,
              fontFamily: "'Biennale', sans-serif",
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              color: '#111214',
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
              textDecorationThickness: '1px',
            }}
          >{label}</a>
        ))}
      </div>

      {/* WHITE — Let's work together */}
      <div style={{
        background: '#EDEAE4',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center',
        padding: '48px 32px 32px 32px',
flex: 1,
        flexShrink: 0,
        position: 'relative',
        minHeight: '300px',
      }}>
        <h2 style={{
          fontSize: 'clamp(32px,8vw,52px)', fontWeight: 700,
          letterSpacing: '-0.03em', lineHeight: 1,
          fontFamily: "'Biennale', sans-serif", marginBottom: '16px',
        }}>
          <span style={{ color: '#8A8C92' }}>Let's work</span><br />
          <span style={{ color: '#111214' }}>together.</span>
        </h2>
        <p style={{ fontSize: '14px', color: '#6B6E75', lineHeight: 1.8, marginBottom: '28px', maxWidth: '320px' }}>
          Looking for a Webflow expert, a white-label partner for your agency, or a developer who knows real estate inside out.
        </p>
        <a href="mailto:michael@devhousetech.io" style={{
          display: 'inline-flex', alignItems: 'center',
          padding: '12px 28px',
          background: 'rgba(17,18,20,0.08)', border: '1px solid rgba(17,18,20,0.18)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#111214',
          letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>Let's Connect</a>

        {/* Footer */}
        <div style={{ marginTop: '110px', display: 'flex', justifyContent: 'space-between', width: '100%', borderTop: '1px solid rgba(17,18,20,0.1)', paddingTop: '16px' }}>
          <div style={{ fontSize: '10px', color: '#8A8C92' }}>© 2026 Dan Michael Villamarin</div>
          <a href="https://devhousetech.io" target="_blank" rel="noreferrer" style={{ fontSize: '10px', color: '#8A8C92' }}>devhousetech.io</a>
        </div>

    
      </div>

    </div>
  )
}

// ── CONTACT + FOOTER ──────────────────────────────────────────────────────
function Contact({ onEnter, onExitTop }) {
  const [visible, setVisible] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (onEnter) onEnter(() => {
      setVisible(false)
      setAnimating(false)
      requestAnimationFrame(() => {
        setAnimating(true)
        setVisible(true)
      })
    })
  }, [])

  // Hide/show main nav
  useEffect(() => {
    const nav = document.querySelector('nav')
    if (!nav) return
    nav.style.transition = 'opacity 0.3s'
    nav.style.opacity = visible ? '0' : '1'
    nav.style.pointerEvents = visible ? 'none' : 'auto'
  }, [visible])

  const handleUp = () => {
    setAnimating(true)
    setVisible(false)
    setTimeout(() => {
      setAnimating(false)
      if (onExitTop) onExitTop()
    }, 900)
  }

  useEffect(() => {
    if (!visible) return
    let cooldown = false
    const onWheel = (e) => {
      if (e.deltaY >= 0) return
      e.preventDefault()
      if (cooldown) return
      cooldown = true
      setTimeout(() => { cooldown = false }, 700)
      handleUp()
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [visible])

  const navLinks = ['HOME', 'SKILLS', 'PROJECTS', 'ABOUT']
  const navHrefs = ['/', '#skills', '#work', '#about']

  const handleNavClick = (link, e) => {
  e.preventDefault()
  if (link === 'HOME') {
    window.location.reload()
    return
  }
  handleUp()
  setTimeout(() => {
    if (link === 'SKILLS') {
      if (typeof window.__reenterSkills === 'function') window.__reenterSkills()
    } else if (link === 'PROJECTS') {
      if (typeof window.__reenterProjects === 'function') window.__reenterProjects()
    } else if (link === 'ABOUT') {
      if (typeof window.__showAbout === 'function') window.__showAbout()
    }
  }, 100)
}

  const links = [
  ['HOME', '/', '/'],
  ['ABOUT', '#about', '#about'],
  ['INSTAGRAM', 'https://instagram.com/web.mike', 'https://instagram.com/web.mike'],
  ['LINKEDIN', 'https://linkedin.com/in/dan-michael-villamarin-666692130', 'https://linkedin.com/in/dan-michael-villamarin-666692130'],
  ['STUDIO', 'https://devhousetech.io', 'https://devhousetech.io'],
]

  return (
    <section id="contact" style={{ height: '1px' }}>
      <style>{`
        .contact-nav-link {
          position: relative;
          display: inline-block;
          text-decoration: none;
          color: #111214;
        }
        .contact-nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 100%; height: 1px;
          background: #111214;
          transform: scaleX(1);
          transform-origin: right;
          transition: transform 0.4s cubic-bezier(0.76, 0, 0.24, 1);
        }
        .contact-nav-link:hover::after {
          transform: scaleX(0);
          transform-origin: left;
        }
        .contact-nav-link:hover { opacity: 0.55; }
      `}</style>

      {/* Full panel slides in from right */}
      <div className="contact-panel" style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, height: '100vh',
        zIndex: 7,
        display: 'flex', flexDirection: 'row',
overflow: 'hidden',
        pointerEvents: visible ? 'auto' : 'none',
        willChange: 'transform',
      }}>

        {/* Left — slides in from left */}
<div className="contact-left" style={{
  width: '50%', height: '100%', display: 'flex', flexDirection: 'column',
  transform: visible ? 'translateX(0)' : 'translateX(-100%)',
  transition: animating ? 'transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
  willChange: 'transform',
}}>

          {/* Top — dark with MIKE */}
          <div className="contact-dark" style={{
  flex: '0 0 40%',
  background: '#111214',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
padding: 'clamp(32px,4vw,56px) clamp(24px,4vw,56px)',
          }}>
            <span style={{
              fontSize: 'clamp(80px,14vw,180px)',
              fontWeight: 700,
              color: '#EDEAE4',
              fontFamily: "'Biennale', sans-serif",
              letterSpacing: '-0.04em',
              lineHeight: 0.85,
              userSelect: 'none',
            }}>MIKE</span>
          </div>

          {/* Bottom — white with Let's work + button */}
          <div className="contact-white" style={{
            flex: 1,
            background: '#EDEAE4',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center',
padding: 'clamp(32px,4vw,56px) clamp(24px,4vw,56px)',
            position: 'relative',
          }}>
            <h2 style={{ fontSize: 'clamp(36px,4.5vw,64px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, fontFamily: "'Biennale', sans-serif", marginBottom: '16px' }}>
              <span style={{ color: '#8A8C92' }}>Let's work</span><br />
              <span style={{ color: '#111214' }}>together.</span>
            </h2>
            <p style={{ fontSize: '15px', color: '#6B6E75', lineHeight: 1.8, marginBottom: '28px', maxWidth: '420px' }}>
              Looking for a Webflow expert, a white-label partner for your agency, or a developer who knows real estate inside out.
            </p>
            <a href="mailto:michael@devhousetech.io" style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '11px 24px',
              background: 'rgba(17,18,20,0.08)', border: '1px solid rgba(17,18,20,0.18)',
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#111214',
              letterSpacing: '0.04em', textTransform: 'uppercase', transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(17,18,20,0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(17,18,20,0.08)'}
            >Let's Connect</a>

            {/* Footer bar */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px clamp(24px,4vw,56px)', borderTop: '1px solid rgba(17,18,20,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '10px', color: '#8A8C92' }}>© 2026 Dan Michael Villamarin</div>
              <a href="https://devhousetech.io" target="_blank" rel="noreferrer"
                style={{ fontSize: '10px', color: '#8A8C92', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#111214'}
                onMouseLeave={e => e.currentTarget.style.color = '#8A8C92'}>devhousetech.io</a>
            </div>

            <ArrowNav showUp={true} showDown={false} onUp={handleUp} onDown={() => {}} />
          </div>
        </div>

        {/* Right — slides in from right */}
<div className="contact-right" style={{
  width: '50%', height: '100%',
  background: '#E4E0D8',
  transform: visible ? 'translateX(0)' : 'translateX(100%)',
  transition: animating ? 'transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
  willChange: 'transform',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center',
          padding: 'clamp(40px,6vw,80px) clamp(24px,5vw,60px)',
          gap: '4px',
        }}>
          <span
  onClick={handleUp}
  style={{
    position: 'absolute',
    top: 'clamp(40px,6vw,80px)',
right: 'clamp(24px,5vw,60px)',
fontSize: '14px',
    fontWeight: 800,
    color: '#111214',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
    opacity: 0.6,
    transition: 'opacity 0.2s',
  }}
  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
  onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
>CLOSE</span>

          {links.map(([label, , href]) => (
            <a key={label} href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              onClick={label === 'HOME' ? (e) => { e.preventDefault(); window.location.reload() } : undefined}
              className="contact-nav-link"
              style={{
                fontSize: 'clamp(36px,4.5vw,64px)',
                fontWeight: 700,
                fontFamily: "'Biennale', sans-serif",
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                transition: 'opacity 0.3s',
              }}
            >{label}</a>
          ))}
        </div>

      </div>
    </section>
  )
}

// ── APP ───────────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(true)
  const [showGestureHint, setShowGestureHint] = useState(false)

  // Show gesture hint on touch devices (mobile + tablet) only, after loading
  useEffect(() => {
    if (loading) return
    if (window.innerWidth > 1024) return
    const t = setTimeout(() => setShowGestureHint(true), 300)
    return () => clearTimeout(t)
  }, [loading])

  // Hide on first touch or after 4 seconds
  useEffect(() => {
    if (!showGestureHint) return
    const hide = () => setShowGestureHint(false)
    const t = setTimeout(hide, 4000)
    window.addEventListener('touchstart', hide, { once: true })
    return () => {
      clearTimeout(t)
      window.removeEventListener('touchstart', hide)
    }
  }, [showGestureHint])

  useEffect(() => {
    window.__showContact = () => {
      if (window.innerWidth <= 768) {
        if (typeof window.__showMobileContact === 'function') window.__showMobileContact()
      } else {
        if (typeof window.__showDesktopContact === 'function') window.__showDesktopContact()
      }
    }
  }, [])
  return (
    <>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}

      {/* Gesture hint — mobile/tablet only, shows once after loading */}
      {showGestureHint && (
        <div style={{
          position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 999, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
          pointerEvents: 'none',
          animation: 'gestureHintFade 4s ease-in-out forwards',
        }}>
          <style>{`
            @keyframes gestureHintFade {
              0% { opacity: 0; }
              15% { opacity: 1; }
              75% { opacity: 1; }
              100% { opacity: 0; }
            }
            @keyframes swipeAnim {
              0%, 100% { transform: translateX(0px); opacity: 0.25; }
              50% { transform: translateX(-22px); opacity: 0.5; }
            }
          `}</style>
          <img src="/gesture-white.png" alt="swipe" style={{
            width: '64px', height: '64px', objectFit: 'contain',
            opacity: 0.4,
            animation: 'swipeAnim 1.2s ease-in-out infinite',
          }} />
          <div style={{
            fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--offwhite)', opacity: 0.5,
            background: 'rgba(12,13,15,0.7)', padding: '6px 14px',
            borderRadius: '20px', border: '1px solid rgba(196,198,204,0.2)',
            backdropFilter: 'blur(8px)', whiteSpace: 'nowrap',
          }}>Swipe to explore</div>
        </div>
      )}

      <Nav />
      {/* Hero layer */}
      <div style={{ position:'relative', zIndex:0 }}>
        <Hero />
      </div>
      <SkillsTable />
      <FeaturedProjects
        onEnter={(fn) => { window.__showProjects = fn }}
        onExitTop={() => { if (typeof window.__reenterSkills === 'function') window.__reenterSkills() }}
      />
      <About
        onEnter={(fn) => { window.__showAbout = fn }}
        onExitTop={() => { if (typeof window.__reenterProjects === 'function') window.__reenterProjects() }}
      />


      <Contact
        onEnter={(fn) => { window.__showDesktopContact = fn }}
        onExitTop={() => { if (typeof window.__reenterAbout === 'function') window.__reenterAbout() }}
      />
      <MobileContact
        onEnter={(fn) => { window.__showMobileContact = fn }}
        onExitTop={() => { if (typeof window.__reenterAbout === 'function') window.__reenterAbout() }}
      />
      <script dangerouslySetInnerHTML={{ __html: '' }} />

      {/* GameFAB hidden — game is now inside About slide 4 */}
    </>
  )
}
