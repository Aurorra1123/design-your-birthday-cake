import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Object3D, Color } from 'three'
import type { InstancedMesh } from 'three'

interface ConfettiProps {
  active: boolean
}

const CONFETTI_COUNT = 500
const dummy = new Object3D()

interface Particle {
  x: number; y: number; z: number
  vx: number; vy: number; vz: number
  rx: number; ry: number; rz: number
  rvx: number; rvy: number; rvz: number
  color: Color
  scale: number
  life: number
}

const COLORS = [
  '#ff85b3', '#6dd9ff', '#ffe44d', '#d77fff', '#6dff9e',
  '#ff6666', '#ffaa33', '#33ffaa', '#ff88cc', '#aaddff',
]

export function Confetti({ active }: ConfettiProps) {
  const meshRef = useRef<InstancedMesh>(null)
  const initialized = useRef(false)

  const particles = useMemo<Particle[]>(() =>
    Array.from({ length: CONFETTI_COUNT }, () => ({
      x: 0, y: 0, z: 0,
      vx: 0, vy: 0, vz: 0,
      rx: 0, ry: 0, rz: 0,
      rvx: 0, rvy: 0, rvz: 0,
      color: new Color(COLORS[Math.floor(Math.random() * COLORS.length)]),
      scale: 0.06 + Math.random() * 0.06,
      life: 0,
    })),
  [])

  useFrame((_, delta) => {
    if (!meshRef.current) return

    if (active && !initialized.current) {
      initialized.current = true
      particles.forEach((p) => {
        p.x = (Math.random() - 0.5) * 4
        p.y = 4 + Math.random() * 3
        p.z = (Math.random() - 0.5) * 4
        p.vx = (Math.random() - 0.5) * 1.5
        p.vy = -(1 + Math.random() * 2)
        p.vz = (Math.random() - 0.5) * 1.5
        p.rx = Math.random() * Math.PI * 2
        p.ry = Math.random() * Math.PI * 2
        p.rz = Math.random() * Math.PI * 2
        p.rvx = (Math.random() - 0.5) * 8
        p.rvy = (Math.random() - 0.5) * 8
        p.rvz = (Math.random() - 0.5) * 8
        p.life = 0
      })
      // Set colors
      particles.forEach((p, i) => {
        meshRef.current!.setColorAt(i, p.color)
      })
      meshRef.current.instanceColor!.needsUpdate = true
    }

    particles.forEach((p, i) => {
      if (active && initialized.current) {
        p.life += delta
        p.x += p.vx * delta
        p.y += p.vy * delta
        p.z += p.vz * delta

        // Gravity + air resistance
        p.vy -= 1.5 * delta
        p.vx *= 0.99
        p.vz *= 0.99

        // Wobble / flutter
        p.vx += Math.sin(p.life * 3 + i) * 0.3 * delta
        p.vz += Math.cos(p.life * 2 + i) * 0.3 * delta

        p.rx += p.rvx * delta
        p.ry += p.rvy * delta
        p.rz += p.rvz * delta

        // Fade out after 5 seconds
        const fade = p.life > 5 ? Math.max(0, 1 - (p.life - 5) / 2) : 1

        dummy.position.set(p.x, p.y, p.z)
        dummy.rotation.set(p.rx, p.ry, p.rz)
        dummy.scale.setScalar(p.scale * fade)
      } else {
        dummy.scale.setScalar(0)
      }
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, CONFETTI_COUNT]}>
      <boxGeometry args={[1, 1, 0.1]} />
      <meshBasicMaterial vertexColors transparent fog={false} />
    </instancedMesh>
  )
}
