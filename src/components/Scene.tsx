import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { OrbitControls } from '@react-three/drei'
import { Cake } from './Cake'
import { Candles } from './Candles'
import { Confetti } from './Confetti'
import { Fireworks } from './Fireworks'
import { BirthdayText } from './BirthdayText'
import type { GameState } from '../hooks/useGameState'

interface SceneProps {
  state: GameState
  litCandles: boolean[]
}

function Table() {
  return (
    <mesh position={[0, -0.75, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[12, 12]} />
      <meshStandardMaterial color="#2d1b4e" />
    </mesh>
  )
}

function Lights({ state }: { state: GameState }) {
  const ambientRef = useRef<any>(null)
  const targetIntensity = state === 'celebration' ? 0.8 : 0.3

  useFrame((_, delta) => {
    if (ambientRef.current) {
      ambientRef.current.intensity +=
        (targetIntensity - ambientRef.current.intensity) * delta * 3
    }
  })

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={0.4} color="#ffeedd" />
      {state === 'celebration' && (
        <pointLight position={[0, 4, 0]} intensity={1.5} color="#ff69b4" distance={10} />
      )}
    </>
  )
}

function Stars() {
  const starsRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.02
    }
  })

  const stars = []
  for (let i = 0; i < 80; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI * 0.5 + 0.2
    const r = 8 + Math.random() * 4
    stars.push(
      <mesh
        key={i}
        position={[
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi) + 2,
          r * Math.sin(phi) * Math.sin(theta),
        ]}
      >
        <sphereGeometry args={[0.02 + Math.random() * 0.03, 4, 4]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5 + Math.random() * 0.5} />
      </mesh>
    )
  }

  return <group ref={starsRef}>{stars}</group>
}

export function Scene({ state, litCandles }: SceneProps) {
  return (
    <>
      <color attach="background" args={['#0a0520']} />
      <fog attach="fog" args={['#0a0520', 8, 20]} />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.55}
      />

      <Lights state={state} />
      <Stars />
      <Table />

      <Cake />
      <Candles litCandles={litCandles} state={state} />
      <Fireworks active={state === 'celebration'} />
      <Confetti active={state === 'celebration'} />
      <BirthdayText visible={state === 'celebration'} />
    </>
  )
}
