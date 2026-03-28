import { useRef } from 'react'
import type { Mesh } from 'three'
import { Text } from '@react-three/drei'
import { FONT_CURSIVE, FONT_SERIF, FONT_ELEGANT } from '../fonts'

function CreamSwirl({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <mesh position={position} rotation={rotation || [Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.15, 0.06, 8, 16]} />
      <meshStandardMaterial color="#fff5f5" />
    </mesh>
  )
}

function CandyDot({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.06, 8, 8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export function Cake() {
  const cakeRef = useRef<Mesh>(null)
  const dotColors = ['#ff6b9d', '#c44dff', '#4dc9ff', '#ffd700', '#ff4d4d', '#4dff88']

  // Generate candy dots around bottom layer
  const bottomDots = []
  for (let i = 0; i < 18; i++) {
    const angle = (i / 18) * Math.PI * 2
    const radius = 1.42
    bottomDots.push(
      <CandyDot
        key={`bd-${i}`}
        position={[
          Math.cos(angle) * radius,
          -0.1 + Math.sin(i * 3) * 0.2,
          Math.sin(angle) * radius,
        ]}
        color={dotColors[i % dotColors.length]}
      />
    )
  }

  // Generate candy dots around top layer
  const topDots = []
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2
    const radius = 0.95
    topDots.push(
      <CandyDot
        key={`td-${i}`}
        position={[
          Math.cos(angle) * radius,
          0.75 + Math.sin(i * 2) * 0.15,
          Math.sin(angle) * radius,
        ]}
        color={dotColors[(i + 3) % dotColors.length]}
      />
    )
  }

  // Cream swirls on top
  const creamSwirls = []
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const radius = 0.55
    creamSwirls.push(
      <CreamSwirl
        key={`cs-${i}`}
        position={[Math.cos(angle) * radius, 1.22, Math.sin(angle) * radius]}
        rotation={[Math.PI / 2, 0, angle]}
      />
    )
  }

  return (
    <group ref={cakeRef}>
      {/* Bottom layer */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.9, 32]} />
        <meshStandardMaterial color="#ffb6c1" />
      </mesh>

      {/* Bottom layer cream border (top) */}
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.07, 8, 32]} />
        <meshStandardMaterial color="#fff0f5" />
      </mesh>

      {/* Bottom layer cream border (bottom) */}
      <mesh position={[0, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.07, 8, 32]} />
        <meshStandardMaterial color="#fff0f5" />
      </mesh>

      {/* Top layer */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 0.8, 32]} />
        <meshStandardMaterial color="#ffc0cb" />
      </mesh>

      {/* Top layer cream border */}
      <mesh position={[0, 1.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.0, 0.07, 8, 32]} />
        <meshStandardMaterial color="#fff0f5" />
      </mesh>

      {/* Top surface - slightly lighter */}
      <mesh position={[0, 1.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.0, 32]} />
        <meshStandardMaterial color="#ffd1dc" />
      </mesh>

      {/* Candy dots */}
      {bottomDots}
      {topDots}

      {/* Cream swirls on top */}
      {creamSwirls}

      {/* Front text - Cursive "Happy Birthday" */}
      <Text
        font={FONT_CURSIVE}
        position={[0, 0.78, 1.01]}
        fontSize={0.2}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor="#ff8c00"
      >
        {'Happy Birthday'}
      </Text>
      {/* Name in elegant serif */}
      <Text
        font={FONT_SERIF}
        position={[0, 0.55, 1.01]}
        fontSize={0.18}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor="#ff69b4"
      >
        {'Luo Kingfung'}
      </Text>

      {/* Date & location tag */}
      <group position={[0, -0.1, 1.52]}>
        <mesh>
          <boxGeometry args={[1.3, 0.35, 0.04]} />
          <meshStandardMaterial color="#ffd1dc" />
        </mesh>
        <mesh position={[0, 0, -0.005]}>
          <boxGeometry args={[1.36, 0.41, 0.03]} />
          <meshStandardMaterial color="#ff69b4" />
        </mesh>
        <Text
          font={FONT_ELEGANT}
          position={[0, 0.04, 0.025]}
          fontSize={0.1}
          color="#6b3a7d"
          anchorX="center"
          anchorY="middle"
        >
          {'March 28, 2026'}
        </Text>
        <Text
          font={FONT_ELEGANT}
          position={[0, -0.09, 0.025]}
          fontSize={0.08}
          color="#c44dff"
          anchorX="center"
          anchorY="middle"
        >
          {'Los Angeles'}
        </Text>
      </group>

      {/* Cake plate */}
      <mesh position={[0, -0.65, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.8, 32]} />
        <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.3} />
      </mesh>
    </group>
  )
}
