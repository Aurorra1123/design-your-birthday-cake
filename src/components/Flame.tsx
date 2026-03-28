import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh, PointLight } from 'three'

interface FlameProps {
  isLit: boolean
  isBlowing: boolean
}

export function Flame({ isLit, isBlowing }: FlameProps) {
  const flameRef = useRef<Mesh>(null)
  const lightRef = useRef<PointLight>(null)
  const scaleRef = useRef(1)
  const timeRef = useRef(0)

  const targetScale = useMemo(() => {
    if (!isLit) return 0
    if (isBlowing) return 0.3
    return 1
  }, [isLit, isBlowing])

  useFrame((_, delta) => {
    timeRef.current += delta

    // Smooth scale transition
    scaleRef.current += (targetScale - scaleRef.current) * delta * 5

    if (flameRef.current) {
      const wobble = isBlowing ? 0.4 : 0.1
      const speed = isBlowing ? 12 : 4
      const offsetX = Math.sin(timeRef.current * speed) * wobble * scaleRef.current
      const offsetZ = Math.cos(timeRef.current * speed * 0.7) * wobble * 0.5 * scaleRef.current

      flameRef.current.position.x = offsetX
      flameRef.current.position.z = offsetZ
      flameRef.current.scale.setScalar(scaleRef.current)
      flameRef.current.visible = scaleRef.current > 0.01
    }

    if (lightRef.current) {
      lightRef.current.intensity = scaleRef.current * 0.8
      lightRef.current.visible = scaleRef.current > 0.01
    }
  })

  return (
    <group>
      {/* Flame outer glow */}
      <mesh ref={flameRef} position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.9} />
        {/* Inner bright core */}
        <mesh position={[0, -0.01, 0]} scale={0.6}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#ffff44" transparent opacity={0.95} />
        </mesh>
      </mesh>
      <pointLight
        ref={lightRef}
        position={[0, 0.2, 0]}
        color="#ffaa44"
        intensity={0.8}
        distance={3}
        decay={2}
      />
    </group>
  )
}
