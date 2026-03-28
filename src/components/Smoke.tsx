import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Object3D, Color } from 'three'
import type { InstancedMesh } from 'three'

interface SmokeProps {
  active: boolean
}

const PARTICLE_COUNT = 20
const dummy = new Object3D()

export function Smoke({ active }: SmokeProps) {
  const meshRef = useRef<InstancedMesh>(null)
  const particlesRef = useRef(
    Array.from({ length: PARTICLE_COUNT }, () => ({
      x: 0, y: 0, z: 0,
      vx: 0, vy: 0, vz: 0,
      life: 0,
      maxLife: 0,
      scale: 0,
    }))
  )
  const spawnTimerRef = useRef(0)
  const hasActivated = useRef(false)

  const smokeColor = useMemo(() => new Color('#cccccc'), [])

  useFrame((_, delta) => {
    if (!meshRef.current) return

    // Spawn new particles when activated
    if (active && !hasActivated.current) {
      hasActivated.current = true
      // Spawn a burst of particles
      particlesRef.current.forEach((p) => {
        p.x = (Math.random() - 0.5) * 0.05
        p.y = 0.15
        p.z = (Math.random() - 0.5) * 0.05
        p.vx = (Math.random() - 0.5) * 0.3
        p.vy = 0.4 + Math.random() * 0.5
        p.vz = (Math.random() - 0.5) * 0.3
        p.life = Math.random() * 0.5 // stagger start
        p.maxLife = 1.5 + Math.random() * 1.0
        p.scale = 0.02 + Math.random() * 0.03
      })
    }

    if (active) {
      spawnTimerRef.current += delta
    }

    // Update particles
    particlesRef.current.forEach((p, i) => {
      if (p.life < p.maxLife && hasActivated.current) {
        p.life += delta
        p.x += p.vx * delta
        p.y += p.vy * delta
        p.z += p.vz * delta
        p.vx *= 0.98
        p.vy *= 0.99
        p.vz *= 0.98

        const lifeRatio = p.life / p.maxLife
        const currentScale = p.scale * (1 + lifeRatio * 2) * (1 - lifeRatio)

        dummy.position.set(p.x, p.y, p.z)
        dummy.scale.setScalar(Math.max(0, currentScale))
      } else {
        dummy.scale.setScalar(0)
      }
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={smokeColor} transparent opacity={0.4} />
    </instancedMesh>
  )
}
