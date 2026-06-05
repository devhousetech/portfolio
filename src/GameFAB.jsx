import { useState, useEffect } from 'react'

export default function GameFAB() {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  // Show after scrolling past hero
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > window.innerHeight * 0.5)
    window.addEventListener('scroll', fn)
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scrollToGame = () => {
    document.getElementById('minigame')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <style>{`
        @keyframes fab-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,222,0.35), 0 8px 32px rgba(0,0,0,0.45); }
          50%       { box-shadow: 0 0 0 8px rgba(74,222,222,0.0), 0 8px 32px rgba(0,0,0,0.45); }
        }
        @keyframes fab-in {
          from { opacity:0; transform: translateY(20px) scale(0.85); }
          to   { opacity:1; transform: translateY(0)    scale(1); }
        }
        @keyframes fab-out {
          from { opacity:1; transform: translateY(0)    scale(1); }
          to   { opacity:0; transform: translateY(20px) scale(0.85); }
        }
        @keyframes icon-bob {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-3px); }
        }
      `}</style>

      <button
        onClick={scrollToGame}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title="Play Mini Game"
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          zIndex: 999,
          width: 60,
          height: 60,
          borderRadius: '50%',
          border: '1px solid rgba(74,222,222,0.3)',
          background: hovered
            ? 'rgba(20,22,26,0.98)'
            : 'rgba(14,15,18,0.92)',
          backdropFilter: 'blur(12px)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          animation: visible
            ? 'fab-in 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards, fab-pulse 2.5s ease-in-out 1s infinite'
            : 'fab-out 0.25s ease forwards',
          transition: 'background 0.2s, border-color 0.2s',
          borderColor: hovered ? 'rgba(74,222,222,0.7)' : 'rgba(74,222,222,0.3)',
          overflow: 'visible',
        }}
      >
        <img
          src="/assets/game/game-icon.png"
          alt="Mini Game"
          style={{
            width: 34,
            height: 34,
            objectFit: 'contain',
            imageRendering: 'pixelated',
            animation: hovered ? 'icon-bob 0.5s ease-in-out infinite' : 'none',
            transition: 'transform 0.2s',
          }}
        />

        {/* Tooltip */}
        <div style={{
          position: 'absolute',
          right: 70,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(12,13,15,0.95)',
          border: '1px solid var(--border)',
          borderRadius: 4,
          padding: '5px 10px',
          fontSize: 11,
          fontWeight: 500,
          color: 'var(--offwhite)',
          whiteSpace: 'nowrap',
          letterSpacing: '0.04em',
          opacity: hovered ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.2s',
        }}>
          Take a break 🕹️
        </div>
      </button>
    </>
  )
}
