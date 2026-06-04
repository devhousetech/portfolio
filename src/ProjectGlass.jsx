/* eslint-disable react/no-unknown-property */
import * as THREE from 'three'
import { useRef, useState, useEffect, memo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useFBO, useGLTF, MeshTransmissionMaterial } from '@react-three/drei'
import { easing } from 'maath'

function CoverPlane({ texture }) {
  const { viewport, camera } = useThree()
  const v = viewport.getCurrentViewport(camera, [0, 0, 0])
  const imgW = texture.image?.width || 1
  const imgH = texture.image?.height || 1
  const imgAspect = imgW / imgH
  const vpAspect = v.width / v.height

  let scaleX, scaleY
  if (imgAspect > vpAspect) {
    scaleY = v.height
    scaleX = v.height * imgAspect
  } else {
    scaleX = v.width
    scaleY = v.width / imgAspect
  }

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

  // Offscreen scene with the card image as a background plane
  const [bgScene] = useState(() => {
    const scene = new THREE.Scene()
    return scene
  })

  const bgMeshRef = useRef()

  useEffect(() => {
    if (!texture || !bgScene) return

    if (bgMeshRef.current) bgScene.remove(bgMeshRef.current)

    // Match the image's natural aspect ratio
    const imgW = texture.image.width
    const imgH = texture.image.height
    const imgAspect = imgW / imgH

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(imgAspect, 1),
      new THREE.MeshBasicMaterial({ map: texture })
    )
    bgMeshRef.current = mesh
    bgScene.add(mesh)
  }, [texture, bgScene])

  useFrame((state, delta) => {
    const v = viewport.getCurrentViewport(camera, [0, 0, 15])

    // Scale bg plane to fill viewport with cover-fit
    if (bgMeshRef.current) {
      const imgW = texture.image?.width || 1
      const imgH = texture.image?.height || 1
      const imgAspect = imgW / imgH
      const vpAspect = v.width / v.height

      let scaleX, scaleY
      if (imgAspect > vpAspect) {
        // Image wider than viewport — fit height, crop sides
        scaleY = v.height
        scaleX = v.height * imgAspect
      } else {
        // Image taller — fit width, crop top/bottom
        scaleX = v.width
        scaleY = v.width / imgAspect
      }

      bgMeshRef.current.scale.set(scaleX, scaleY, 1)
      bgMeshRef.current.position.z = 14
    }

    // Lens follows pointer
    const destX = (pointer.x * v.width) / 2
    const destY = (pointer.y * v.height) / 2
    easing.damp3(lensRef.current.position, [destX, destY, 15], 0.12, delta)

    // Render bg into buffer for lens distortion
    gl.setRenderTarget(buffer)
    gl.render(bgScene, camera)
    gl.setRenderTarget(null)
  })

  return (
    <>
      {/* Visible background plane showing the card image with cover-fit */}
      <CoverPlane texture={texture} />

      {/* Glass lens distorting the buffer */}
      <mesh
        ref={lensRef}
        scale={0.13}
        rotation-x={Math.PI / 2}
        geometry={nodes.Cylinder?.geometry}
        position={[0, 0, 15]}
      >
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

export default function ProjectGlass({ imgSrc, visible }) {
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    if (!imgSrc) return
    const loader = new THREE.TextureLoader()
    loader.load(imgSrc, (t) => {
      t.colorSpace = THREE.SRGBColorSpace
      setTexture(t)
    })
  }, [imgSrc])

  if (!texture) return null

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.4s ease',
    }}>
      <Canvas
        camera={{ position: [0, 0, 20], fov: 15 }}
        gl={{ alpha: false, antialias: true }}
      >
        <Scene texture={texture} />
      </Canvas>
    </div>
  )
}
