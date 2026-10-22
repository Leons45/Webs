import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  MeshTransmissionMaterial,
  Sparkles,
  Float,
  ContactShadows,
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import * as THREE from 'three'

// A hand-jittered icosahedron so the crystal reads as a raw, cut gem
// rather than a perfect platonic solid.
function useJitteredGeometry(seed = 7) {
  return useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.5, 1)
    const pos = geo.attributes.position
    let s = seed
    const rnd = () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff
      return (s / 0x7fffffff)
    }
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
      const n = 1 + (rnd() - 0.5) * 0.14
      pos.setXYZ(i, x * n, y * n, z * n)
    }
    geo.computeVertexNormals()
    return geo
  }, [seed])
}

function Crystal({ scrollRef }) {
  const group = useRef()
  const geo = useJitteredGeometry()

  useFrame((state, delta) => {
    if (!group.current) return
    const p = scrollRef.current
    group.current.rotation.y += delta * (0.12 + p * 0.5)
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.15 + p * 0.6
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.08
  })

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
      <mesh ref={group} geometry={geo} castShadow>
        <MeshTransmissionMaterial
          thickness={1.1}
          roughness={0.04}
          transmission={1}
          ior={1.35}
          chromaticAberration={0.045}
          anisotropy={0.3}
          distortion={0.15}
          distortionScale={0.3}
          temporalDistortion={0.08}
          clearcoat={1}
          attenuationColor="#9FD8FF"
          attenuationDistance={1.3}
          color="#eef7ff"
          background={new THREE.Color('#07080A')}
        />
      </mesh>
    </Float>
  )
}

function CameraRig({ scrollRef, pointer }) {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3(0, 0, 0))

  useFrame(() => {
    const p = scrollRef.current
    const desiredZ = 6.2 - p * 2.6
    const desiredY = p * 1.1
    const px = pointer.current.x * 0.6
    const py = pointer.current.y * 0.35

    camera.position.x += (px - camera.position.x) * 0.04
    camera.position.y += (desiredY + py - camera.position.y) * 0.04
    camera.position.z += (desiredZ - camera.position.z) * 0.05
    camera.lookAt(target.current)
  })
  return null
}

export default function Scene({ scrollRef, pointer }) {
  return (
    <>
      <color attach="background" args={['#07080A']} />
      <fog attach="fog" args={['#07080A', 6, 16]} />

      {/*
        No external HDRI / Environment preset here on purpose: that fetches
        an asset from a third-party CDN at runtime, and if that request
        fails in a visitor's browser (network, ad-block, CORS) it throws
        past the Suspense boundary with nothing to catch it. Everything the
        crystal needs to look like glass instead comes from real geometry
        and light sources placed directly in the scene below, which
        MeshTransmissionMaterial renders a live reflection/refraction of —
        so the "environment" it reflects is this scene itself, not a file.
      */}
      <ambientLight intensity={0.22} />
      <directionalLight position={[4, 5, 3]} intensity={1.3} color="#EAF3FF" />
      <directionalLight position={[-3, -4, -4]} intensity={0.5} color="#8EC9FF" />
      <pointLight position={[-4, -2, -3]} intensity={10} color="#8EC9FF" />
      <pointLight position={[3, -3, 2]} intensity={7} color="#D8FF4F" />
      <pointLight position={[0, 4, -5]} intensity={5} color="#FFFFFF" />

      {/* Simple bright panels floating in the scene give the glass real
          hard-edged highlights to refract, standing in for a studio softbox
          without needing any loaded texture. */}
      <mesh position={[-3.4, 1.2, -2]}>
        <planeGeometry args={[2.2, 3]} />
        <meshBasicMaterial color="#EAF3FF" toneMapped={false} />
      </mesh>
      <mesh position={[3.2, -1, -2.4]} rotation={[0, 0.3, 0]}>
        <planeGeometry args={[1.8, 2.4]} />
        <meshBasicMaterial color="#D8FF4F" toneMapped={false} />
      </mesh>

      <Crystal scrollRef={scrollRef} />

      <Sparkles count={120} scale={[9, 6, 6]} size={1.6} speed={0.25} color="#D8FF4F" opacity={0.5} />
      <Sparkles count={80} scale={[7, 5, 5]} size={1} speed={0.15} color="#8EC9FF" opacity={0.35} />

      <ContactShadows position={[0, -1.8, 0]} opacity={0.35} scale={10} blur={2.4} far={3} color="#000000" />

      <CameraRig scrollRef={scrollRef} pointer={pointer} />

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.55} luminanceThreshold={0.18} luminanceSmoothing={0.3} mipmapBlur />
        <Noise opacity={0.025} />
        <Vignette eskil={false} offset={0.15} darkness={0.9} />
      </EffectComposer>
    </>
  )
}
