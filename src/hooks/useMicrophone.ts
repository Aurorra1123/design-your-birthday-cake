import { useState, useRef, useCallback, useEffect } from 'react'

interface UseMicrophoneOptions {
  threshold?: number
  sustainMs?: number
}

export function useMicrophone({
  threshold = 0.35,
  sustainMs = 800,
}: UseMicrophoneOptions = {}) {
  const [volume, setVolume] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [triggered, setTriggered] = useState(false)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number>(0)
  const aboveStartRef = useRef<number | null>(null)
  const onTriggerRef = useRef<(() => void) | null>(null)

  const startListening = useCallback(async (onTrigger: () => void) => {
    onTriggerRef.current = onTrigger

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const audioCtx = new AudioContext()
      audioCtxRef.current = audioCtx

      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.5
      source.connect(analyser)
      analyserRef.current = analyser

      setIsListening(true)

      const dataArray = new Uint8Array(analyser.frequencyBinCount)

      const tick = () => {
        analyser.getByteFrequencyData(dataArray)

        // Calculate RMS volume normalized to 0-1
        let sum = 0
        for (let i = 0; i < dataArray.length; i++) {
          const v = dataArray[i] / 255
          sum += v * v
        }
        const rms = Math.sqrt(sum / dataArray.length)
        setVolume(rms)

        // Check if above threshold for sustained period
        if (rms > threshold) {
          if (aboveStartRef.current === null) {
            aboveStartRef.current = Date.now()
          } else if (Date.now() - aboveStartRef.current >= sustainMs) {
            setTriggered(true)
            onTriggerRef.current?.()
            onTriggerRef.current = null
            stopListening()
            return
          }
        } else {
          aboveStartRef.current = null
        }

        rafRef.current = requestAnimationFrame(tick)
      }

      tick()
    } catch {
      console.warn('Microphone access denied')
    }
  }, [threshold, sustainMs])

  const stopListening = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    audioCtxRef.current?.close()
    audioCtxRef.current = null
    analyserRef.current = null
    streamRef.current = null
    aboveStartRef.current = null
    setIsListening(false)
    setVolume(0)
  }, [])

  const reset = useCallback(() => {
    stopListening()
    setTriggered(false)
  }, [stopListening])

  useEffect(() => {
    return () => stopListening()
  }, [stopListening])

  return { volume, isListening, triggered, startListening, stopListening, reset }
}
