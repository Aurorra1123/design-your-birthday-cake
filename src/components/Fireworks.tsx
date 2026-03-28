import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Object3D, Color } from 'three'
import type { InstancedMesh } from 'three'

interface FireworksProps {
  active: boolean
}

const BURST_COUNT = 8
const PARTICLES_PER_BURST = 40
const TOTAL = BURST_COUNT * PARTICLES_PER_BURST
const dummy = new Object3D()

const BURST_COLORS = [
  '#ff6b9d', '#ffd700', '#4dc9ff', '#c44dff',
  '#4dff88', '#ff4d4d', '#ffaa33', '#ff69b4',
]

interface Spark {
  x: number; y: number; z: number
  vx: number; vy: number; vz: number
  life: number
  maxLife: number
  scale: number
  delay: number
}

export function Fireworks({ active }: FireworksProps) {
  const meshRef = useRef<InstancedMesh>(null)
  const initialized = useRef(false)
  const sparksRef = useRef<Spark[]>([])
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (!meshRef.current) return

    if (active && !initialized.current) {
      initialized.current = true
      const sparks: Spark[] = []

      for (let b = 0; b < BURST_COUNT; b++) {
        // Each burst originates from a random position in the sky
        const cx = (Math.random() - 0.5) * 6
        const cy = 3 + Math.random() * 3
        const cz = (Math.random() - 0.5) * 4
        const burstDelay = b * 0.4 + Math.random() * 0.3

        for (let p = 0; p < PARTICLES_PER_BURST; p++) {
          // Spherical explosion
          const theta = Math.random() * Math.PI * 2
          const phi = Math.random() * Math.PI
          const speed = 1.5 + Math.random() * 2.5

          sparks.push({
            x: cx,
            y: cy,
            z: cz,
            vx: Math.sin(phi) * Math.cos(theta) * speed,
            vy: Math.sin(phi) * Math.sin(theta) * speed,
            vz: Math.cos(phi) * speed,
            life: 0,
            maxLife: 1.0 + Math.random() * 0.8,
            scale: 0.03 + Math.random() * 0.04,
            delay: burstDelay,
          })
        }

        // Set colors per burst
        const color = new Color(BURST_COLORS[b % BURST_COLORS.length])
        for (let p = 0; p < PARTICLES_PER_BURST; p++) {
          // Slight color variation within burst
          const variation = new Color(color)
          variation.offsetHSL(0, 0, (Math.random() - 0.5) * 0.2)
          meshRef.current!.setColorAt(b * PARTICLES_PER_BURST + p, variation)
        }
      }

      sparksRef.current = sparks
      meshRef.current.instanceColor!.needsUpdate = true
    }

    if (!active || !initialized.current) {
      // Hide all
      for (let i = 0; i < TOTAL; i++) {
        dummy.scale.setScalar(0)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
      }
      meshRef.current.instanceMatrix.needsUpdate = true
      return
    }

    timeRef.current += delta

    sparksRef.current.forEach((s, i) => {
      if (timeRef.current < s.delay) {
        // Not yet launched
        dummy.scale.setScalar(0)
      } else {
        const t = timeRef.current - s.delay
        if (t > s.maxLife) {
          dummy.scale.setScalar(0)
        } else {
          s.life = t
          const progress = t / s.maxLife

          // Position with gravity
          const px = s.x + s.vx * t
          const py = s.y + s.vy * t - 0.8 * t * t
          const pz = s.z + s.vz * t

          // Trail fade: bright start, dim end
          const fade = 1 - progress * progress
          const currentScale = s.scale * fade

          dummy.position.set(px, py, pz)
          dummy.scale.setScalar(Math.max(0, currentScale))
        }
      }
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, TOTAL]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial vertexColors transparent fog={false} />
    </instancedMesh>
  )
}
