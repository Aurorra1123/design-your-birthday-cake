import { Candle } from './Candle'
import type { GameState } from '../hooks/useGameState'

interface CandlesProps {
  litCandles: boolean[]
  state: GameState
}

const CANDLE_CONFIGS = [
  { position: [-0.5, 1.15, -0.15] as [number, number, number], color: '#ff6b9d' },
  { position: [-0.25, 1.15, 0.2] as [number, number, number], color: '#4dc9ff' },
  { position: [0, 1.15, -0.1] as [number, number, number], color: '#ffd700' },
  { position: [0.25, 1.15, 0.2] as [number, number, number], color: '#c44dff' },
  { position: [0.5, 1.15, -0.15] as [number, number, number], color: '#4dff88' },
]

export function Candles({ litCandles, state }: CandlesProps) {
  return (
    <group>
      {CANDLE_CONFIGS.map((config, i) => (
        <Candle
          key={i}
          position={config.position}
          color={config.color}
          isLit={litCandles[i]}
          isBlowing={state === 'blowing'}
        />
      ))}
    </group>
  )
}
