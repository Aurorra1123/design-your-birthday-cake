import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import type { Group } from 'three'
import { FONT_CURSIVE, FONT_SERIF, FONT_ELEGANT } from '../fonts'

interface BirthdayTextProps {
  visible: boolean
}

export function BirthdayText({ visible }: BirthdayTextProps) {
  const groupRef = useRef<Group>(null)
  const timeRef = useRef(0)
  const scaleRef = useRef(0)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    timeRef.current += delta

    const targetScale = visible ? 1 : 0
    scaleRef.current += (targetScale - scaleRef.current) * delta * 4

    const bounce = visible
      ? 1 + Math.sin(timeRef.current * 2) * 0.05
      : 1

    groupRef.current.scale.setScalar(scaleRef.current * bounce)
    groupRef.current.position.y = 3.5 + Math.sin(timeRef.current * 1.5) * 0.1
  })

  return (
    <group ref={groupRef} position={[0, 3.5, 0]}>
      {/* Cursive "Happy Birthday" */}
      <Text
        font={FONT_CURSIVE}
        fontSize={0.6}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#ff6b00"
      >
        {'Happy Birthday!'}
      </Text>
      {/* Serif name */}
      <Text
        font={FONT_SERIF}
        position={[0, -0.6, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.015}
        outlineColor="#ff69b4"
      >
        {'Luo Kingfung'}
      </Text>
      {/* Elegant date & location */}
      <Text
        font={FONT_ELEGANT}
        position={[0, -1.05, 0]}
        fontSize={0.18}
        color="#87ceeb"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.006}
        outlineColor="#1a1a3e"
      >
        {'March 28, 2026  ·  Los Angeles'}
      </Text>
    </group>
  )
}
