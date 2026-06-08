import { useEffect, useRef } from 'react'

export default function LoadingScreen({ onDone }) {
  const wrapRef = useRef(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const onEnd = (e) => {
      if (e.animationName === 'loaderSlideUp') {
        el.style.display = 'none'
        onDone()
      }
    }
    el.addEventListener('animationend', onEnd)
    return () => el.removeEventListener('animationend', onEnd)
  }, [onDone])

  return (
    <div ref={wrapRef} style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      animation: 'loaderBg 2.4s cubic-bezier(0.76,0,0.24,1) forwards, loaderSlideUp 0.8s cubic-bezier(0.76,0,0.24,1) 2.4s forwards',
    }}>
      <style>{`
        @keyframes loaderBg {
          0%   { background: #111214; }
          35%  { background: #111214; }
          72%  { background: #E4E0D8; }
          100% { background: #E4E0D8; }
        }
        @keyframes loaderSlideUp {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }
        @keyframes loaderText {
          0%   { color: #EDEAE4; }
          35%  { color: #EDEAE4; }
          72%  { color: #111214; }
          100% { color: #111214; }
        }
        @keyframes loaderScale {
          0%   { transform: scale(1); }
          35%  { transform: scale(1); }
          72%  { transform: scale(1.05); }
          100% { transform: scale(1.05); }
        }
      `}</style>
      <span style={{
        fontSize: 'clamp(80px,16vw,220px)',
        fontWeight: 700,
        fontFamily: "'Biennale', sans-serif",
        letterSpacing: '-0.04em',
        lineHeight: 1,
        userSelect: 'none',
        display: 'inline-block',
        animation: 'loaderText 2.4s cubic-bezier(0.76,0,0.24,1) forwards, loaderScale 2.4s cubic-bezier(0.76,0,0.24,1) forwards',
      }}>
        MIKE
      </span>
    </div>
  )
}
