import { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene } from './components/Scene'
import { PhotoGallery } from './components/PhotoGallery'
import { useGameState } from './hooks/useGameState'
import { useMicrophone } from './hooks/useMicrophone'
import './App.css'

const CANDLE_COUNT = 5

function App() {
  const { state, litCandles, blow, reset } = useGameState(CANDLE_COUNT)
  const mic = useMicrophone({ threshold: 0.25, sustainMs: 600 })
  const [micReady, setMicReady] = useState(false)

  const handleStart = useCallback(() => {
    setMicReady(true)
    mic.startListening(() => {
      blow()
    })
  }, [mic, blow])

  const handleReset = useCallback(() => {
    reset()
    mic.reset()
    setMicReady(false)
  }, [reset, mic])

  return (
    <div className="app-root">
      {/* 3D Canvas - always visible but may be behind overlay */}
      <Canvas
        camera={{ position: [0, 3.5, 5.5], fov: 45, near: 0.1, far: 50 }}
      >
        <Scene state={state} litCandles={litCandles} />
      </Canvas>

      {/* Volume meter - shows when mic is active */}
      {micReady && state === 'waiting' && (
        <div className="volume-meter">
          <div className="volume-label">🎤 对着麦克风吹气...</div>
          <div className="volume-bar-bg">
            <div
              className="volume-bar-fill"
              style={{ width: `${Math.min(mic.volume * 300, 100)}%` }}
            />
            <div className="volume-threshold" style={{ left: '25%' }} />
          </div>
        </div>
      )}

      {/* Bottom UI */}
      <div className="bottom-ui">
        {state === 'waiting' && !micReady && (
          <button onClick={handleStart} className="blow-button">
            🎤 准备好了，开始吹蜡烛！
          </button>
        )}
        {state === 'waiting' && micReady && (
          <div className="status-text">🌬️ 用力吹！</div>
        )}
        {state === 'blowing' && (
          <div className="status-text blowing">✨ 蜡烛正在熄灭...</div>
        )}
      </div>

      {/* Photo gallery overlay after celebration */}
      {state === 'celebration' && (
        <PhotoGallery onReset={handleReset} />
      )}
    </div>
  )
}

export default App
