import { useState, useCallback, useRef } from 'react'

export type GameState = 'waiting' | 'blowing' | 'celebration'

export function useGameState(candleCount: number) {
  const [state, setState] = useState<GameState>('waiting')
  const [litCandles, setLitCandles] = useState<boolean[]>(
    () => new Array(candleCount).fill(true)
  )
  const blowTimeoutRef = useRef<number[]>([])

  const blow = useCallback(() => {
    if (state !== 'waiting') return
    setState('blowing')

    // Extinguish candles one by one, left to right
    for (let i = 0; i < candleCount; i++) {
      const timeout = window.setTimeout(() => {
        setLitCandles(prev => {
          const next = [...prev]
          next[i] = false
          return next
        })

        // After last candle, transition to celebration
        if (i === candleCount - 1) {
          window.setTimeout(() => {
            setState('celebration')
          }, 500)
        }
      }, 300 + i * 200)
      blowTimeoutRef.current.push(timeout)
    }
  }, [state, candleCount])

  const reset = useCallback(() => {
    blowTimeoutRef.current.forEach(t => window.clearTimeout(t))
    blowTimeoutRef.current = []
    setLitCandles(new Array(candleCount).fill(true))
    setState('waiting')
  }, [candleCount])

  return { state, litCandles, blow, reset }
}
