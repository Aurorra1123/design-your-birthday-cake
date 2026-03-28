import { Flame } from './Flame'
import { Smoke } from './Smoke'

interface CandleProps {
  position: [number, number, number]
  color: string
  isLit: boolean
  isBlowing: boolean
}

export function Candle({ position, color, isLit, isBlowing }: CandleProps) {
  const showSmoke = !isLit

  return (
    <group position={position}>
      {/* Candle body */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Candle stripe decoration */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.06, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.06, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Wick */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.008, 0.005, 0.04, 4]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Flame */}
      <group position={[0, 0.42, 0]}>
        <Flame isLit={isLit} isBlowing={isBlowing && isLit} />
      </group>

      {/* Smoke */}
      <group position={[0, 0.42, 0]}>
        <Smoke active={showSmoke} />
      </group>
    </group>
  )
}
