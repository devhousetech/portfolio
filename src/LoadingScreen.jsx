import { useEffect, useRef, useState, useCallback } from 'react'

const CW = 640
const CH = 320
const GROUND_Y = CH - 80
const CAR_H = 52
const CAR_W_MOV = Math.round(587 * CAR_H / 259)

const IMGS = {}
function preload(cb) {
  const urls = {
    bg:     '/assets/game/california-bg.png',
    road:   '/assets/game/road.png',
    moving: '/assets/game/main-char-moving.png',
    banana: '/assets/game/banana.png',
    house1: '/assets/game/house-1.png',
    house2: '/assets/game/house-2.png',
    tree1:  '/assets/game/tree-1.png',
    tree2:  '/assets/game/tree-4.png',
    cloud1: '/assets/game/cloud-1.png',
    cloud2: '/assets/game/cloud-2.png',
  }
  let n = 0, total = Object.keys(urls).length
  Object.entries(urls).forEach(([k, url]) => {
    const img = new window.Image()
    img.onload = img.onerror = () => { IMGS[k] = img; if (++n === total) cb() }
    img.src = url
  })
}

export default function LoadingScreen({ onDone }) {
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)
  const frameRef  = useRef(0)
  const [out, setOut] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    preload(() => setLoaded(true))
  }, [])

  useEffect(() => {
    if (!loaded) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false

    // Scene objects
    const clouds = [
      { x: 60,  y: 22, w: 80, key: 'cloud1', spd: 0.3 },
      { x: 240, y: 16, w: 60, key: 'cloud2', spd: 0.2 },
      { x: 380, y: 26, w: 70, key: 'cloud1', spd: 0.25 },
    ]
    const features = [
      { type: 'house', x: 320, key: 'house1' },
      { type: 'tree',  x: 220, key: 'tree1'  },
      { type: 'tree',  x: 500, key: 'tree2'  },
      { type: 'house', x: 620, key: 'house2' },
    ]

    // Banana placed at x=520 in world space
    // Car starts at x=30, moves at speed, hits banana ~4-5s
    const SPEED = 1.8
    const BANANA_WORLD_X = 420

    let carX = 30
    let camX = 0
    let hitBanana = false
    let hitFrame = 0

    const drawImg = (key, x, y, h) => {
      const img = IMGS[key]; if (!img) return
      const w = img.naturalWidth * (h / img.naturalHeight)
      ctx.drawImage(img, x, y - h, w, h)
    }
    const drawFrame = (key, fi, total, x, y, h) => {
      const img = IMGS[key]; if (!img) return
      const FW = img.naturalWidth / total, FH = img.naturalHeight
      const w = FW * (h / FH)
      ctx.drawImage(img, fi * FW, 0, FW, FH, x, y - h, w, h)
    }

    const loop = () => {
      const frame = frameRef.current++

      if (!hitBanana) {
        carX += SPEED
        camX = Math.max(0, carX + CAR_W_MOV / 2 - CW * 0.5)
      } else {
        hitFrame++
      }

      // Check banana hit
      const bananaScreenX = BANANA_WORLD_X - camX
      if (!hitBanana && carX + 28 > BANANA_WORLD_X && carX < BANANA_WORLD_X + 12) {
        hitBanana = true
      }

      // Exit after hit + 40 frames
      if (hitBanana && hitFrame > 40) {
        setOut(true)
        setTimeout(() => onDone(), 600)
        return
      }

      // ── Draw ──────────────────────────────────────────────────────

      // BG
      if (IMGS['bg']) {
        const bgH = CH, bgScale = bgH / IMGS['bg'].naturalHeight
        const bgW = IMGS['bg'].naturalWidth * bgScale
        const bgOff = camX % bgW
        ctx.drawImage(IMGS['bg'], -bgOff, 0, bgW, bgH)
        ctx.drawImage(IMGS['bg'], bgW - bgOff, 0, bgW, bgH)
      } else {
        ctx.fillStyle = '#87ceeb'; ctx.fillRect(0, 0, CW, CH)
      }

      // Clouds
      for (const cl of clouds) {
        const img = IMGS[cl.key]; if (!img) continue
        const cx = ((cl.x - camX * 0.3) % (CW + 100) + CW + 100) % (CW + 100) - 50
        const cw = cl.w, ch = img.naturalHeight * (cw / img.naturalWidth)
        ctx.globalAlpha = 0.88
        ctx.drawImage(img, cx, cl.y, cw, ch)
        ctx.globalAlpha = 1
      }

      // Road
      if (IMGS['road']) {
        const rH = CH * 0.38, rY = CH - rH
        const rScale = rH / IMGS['road'].naturalHeight
        const rW = IMGS['road'].naturalWidth * rScale
        const rOff = Math.round(camX) % rW
        for (let x = -rOff; x < CW + rW; x += rW)
          ctx.drawImage(IMGS['road'], x, rY, rW, rH)
      }

      // Features
      for (const f of features) {
        const fx = f.x - camX
        if (fx < -120 || fx > CW + 80) continue
        if (f.type === 'house') {
          const img = IMGS[f.key]; if (!img) continue
          const h = 80, w = img.naturalWidth * (h / img.naturalHeight)
          ctx.drawImage(img, fx, GROUND_Y - 17 - h, w, h)
        } else {
          const img = IMGS[f.key]; if (!img) continue
          const h = 60, w = img.naturalWidth * (h / img.naturalHeight)
          ctx.drawImage(img, fx - w / 2, GROUND_Y - 17 - h, w, h)
        }
      }

      // Banana
      if (!hitBanana) {
        const img = IMGS['banana']
        if (img) {
          const bh = 14, bw = img.naturalWidth * (bh / img.naturalHeight)
          ctx.drawImage(img, BANANA_WORLD_X - camX - bw / 2, GROUND_Y - bh, bw, bh)
        }
      }

      // Car
      const fi = Math.floor(frame / 9) % 8
      const carScreenX = carX - camX
      drawFrame('moving', fi, 8, carScreenX, GROUND_Y, CAR_H)

      // Hit flash
      if (hitBanana) {
        ctx.fillStyle = `rgba(255,60,60,${Math.max(0, 0.6 - hitFrame * 0.015)})`
        ctx.fillRect(0, 0, CW, CH)
      }

      // Vignette — strong cinematic edges
      const vig = ctx.createRadialGradient(CW/2, CH/2, CH*0.1, CW/2, CH/2, CH*0.9)
      vig.addColorStop(0, 'transparent')
      vig.addColorStop(0.6, 'rgba(4,6,10,0.15)')
      vig.addColorStop(1, 'rgba(4,6,10,0.88)')
      ctx.fillStyle = vig; ctx.fillRect(0, 0, CW, CH)

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [loaded, onDone])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: '#0c0d0f',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: out ? 0 : 1,
      transition: out ? 'opacity 0.6s ease' : 'none',
      pointerEvents: out ? 'none' : 'all',
    }}>
      {/* Outer dark fade frame */}
      <div style={{
        position: 'relative',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 0 120px 80px rgba(4,6,10,0.98), 0 0 0 1px rgba(255,255,255,0.04)',
        width: 'min(90vw, 800px)',
        aspectRatio: '2/1',
      }}>
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          style={{ display: 'block', width: '100%', height: '100%', imageRendering: 'pixelated' }}
        />
        {/* Top + bottom letterbox bars */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none',
          background: 'linear-gradient(to bottom, rgba(4,6,10,0.85) 0%, transparent 30%, transparent 70%, rgba(4,6,10,0.85) 100%)'
        }}/>
        {/* Left + right fade */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none',
          background: 'linear-gradient(to right, rgba(4,6,10,0.92) 0%, transparent 18%, transparent 82%, rgba(4,6,10,0.92) 100%)'
        }}/>
      </div>

      {/* Label */}
      <div style={{
        marginTop: 20,
        fontSize: 10,
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        color: 'rgba(138,140,146,0.5)',
      }}>
        {loaded ? 'Loading . . .' : 'Preparing . . .'}
      </div>
    </div>
  )
}
