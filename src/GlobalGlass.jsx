/* eslint-disable react/no-unknown-property */
import * as THREE from 'three'
import { useRef, useState, useEffect, memo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useFBO, useGLTF, MeshTransmissionMaterial } from '@react-three/drei'
import { easing } from 'maath'

const SCALE = 0.25 // capture resolution — lower = faster, less sharp under lens

function CoverPlane({ texture }) {
  const { viewport, camera } = useThree()
  const v = viewport.getCurrentViewport(camera, [0, 0, 0])
  const imgW = texture.image?.width || 1
  const imgH = texture.image?.height || 1
  const imgAspect = imgW / imgH
  const vpAspect = v.width / v.height
  let scaleX, scaleY
  if (imgAspect > vpAspect) { scaleY = v.height; scaleX = v.height * imgAspect }
  else { scaleX = v.width; scaleY = v.width / imgAspect }
  return (
    <mesh scale={[scaleX, scaleY, 1]} position={[0, 0, 0]}>
      <planeGeometry />
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}

const Scene = memo(function Scene({ texture }) {
  const lensRef = useRef()
  const { nodes } = useGLTF('/assets/3d/lens.glb')
  const buffer = useFBO()
  const { viewport, pointer, camera, gl } = useThree()
  const [bgScene] = useState(() => new THREE.Scene())
  const bgMeshRef = useRef()

  useEffect(() => {
    if (!texture || !bgScene) return
    if (bgMeshRef.current) bgScene.remove(bgMeshRef.current)
    const imgAspect = texture.image.width / texture.image.height
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(imgAspect, 1),
      new THREE.MeshBasicMaterial({ map: texture })
    )
    bgMeshRef.current = mesh
    bgScene.add(mesh)
  }, [texture, bgScene])

  useFrame((_, delta) => {
    const v = viewport.getCurrentViewport(camera, [0, 0, 15])
    if (bgMeshRef.current && texture?.image) {
      const imgAspect = texture.image.width / texture.image.height
      const vpAspect = v.width / v.height
      let scaleX, scaleY
      if (imgAspect > vpAspect) { scaleY = v.height; scaleX = v.height * imgAspect }
      else { scaleX = v.width; scaleY = v.width / imgAspect }
      bgMeshRef.current.scale.set(scaleX, scaleY, 1)
      bgMeshRef.current.position.z = 14
    }
    const destX = (pointer.x * v.width) / 2
    const destY = (pointer.y * v.height) / 2
    easing.damp3(lensRef.current.position, [destX, destY, 15], 0.12, delta)
    gl.setRenderTarget(buffer)
    gl.render(bgScene, camera)
    gl.setRenderTarget(null)
  })

  return (
    <>
      <CoverPlane texture={texture} />
      <mesh ref={lensRef} scale={0.13} rotation-x={Math.PI / 2} geometry={nodes.Cylinder?.geometry} position={[0, 0, 15]}>
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={1.15}
          thickness={5}
          anisotropy={0.01}
          chromaticAberration={0.1}
          transparent
        />
      </mesh>
    </>
  )
})

export default function GlobalGlass() {
  const [texture, setTexture] = useState(null)
  const [visible, setVisible] = useState(false)
  const capturingRef = useRef(false)
  const h2cRef = useRef(null)
  const pendingRef = useRef(false)

  useEffect(() => {
    import('html2canvas').then(mod => { h2cRef.current = mod.default })
  }, [])

  const capture = useCallback(async () => {
    if (capturingRef.current || !h2cRef.current) return
    capturingRef.current = true
    try {
      const canvas = await h2cRef.current(document.body, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#0c0d0f',
        scale: SCALE,           // 0.25 = 4× faster than scale:1
        logging: false,
        x: window.scrollX,
        y: window.scrollY,
        width: window.innerWidth,
        height: window.innerHeight,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        ignoreElements: (el) => el.id === 'global-glass-canvas',
      })
      const tex = new THREE.CanvasTexture(canvas)
      tex.colorSpace = THREE.SRGBColorSpace
      setTexture(prev => { if (prev) prev.dispose(); return tex })
    } catch { /* silent */ }
    finally { capturingRef.current = false }
  }, [])

  // Debounced scroll — only recapture 300ms after scroll stops
  useEffect(() => {
    let timer
    const onScroll = () => {
      clearTimeout(timer)
      timer = setTimeout(capture, 300)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(timer) }
  }, [capture])

  // First capture on first mousemove
  useEffect(() => {
    const onFirst = () => { setVisible(true); capture() }
    window.addEventListener('mousemove', onFirst, { once: true })
    return () => window.removeEventListener('mousemove', onFirst)
  }, [capture])

  useEffect(() => {
    const hide = () => setVisible(false)
    const show = () => setVisible(true)
    document.documentElement.addEventListener('mouseleave', hide)
    document.documentElement.addEventListener('mouseenter', show)
    return () => {
      document.documentElement.removeEventListener('mouseleave', hide)
      document.documentElement.removeEventListener('mouseenter', show)
    }
  }, [])

  return (
    <div
      id="global-glass-canvas"
      style={{ position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none', opacity: visible ? 1 : 0, transition: 'opacity 0.2s' }}
    >
      <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true, antialias: true }} style={{ width: '100%', height: '100%' }}>
        {texture && <Scene texture={texture} />}
      </Canvas>
    </div>
  )
}
