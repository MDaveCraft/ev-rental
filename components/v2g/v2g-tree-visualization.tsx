"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import * as THREE from "three"

interface TreeProps {
  totalCredits: number
  lockedCredits: number
  vestingCredits: number
  claimableCredits: number
}

// Leaf component with subtle animation
function Leaf({
  position,
  scale,
  color,
  delay,
}: {
  position: [number, number, number]
  scale: number
  color: string
  delay: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle swaying motion
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + delay) * 0.1
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3 + delay) * 0.02
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
    </mesh>
  )
}

// Branch component
function Branch({
  start,
  end,
  thickness,
}: {
  start: [number, number, number]
  end: [number, number, number]
  thickness: number
}) {
  const direction = new THREE.Vector3(...end).sub(new THREE.Vector3(...start))
  const length = direction.length()
  const midpoint = new THREE.Vector3(...start).add(direction.multiplyScalar(0.5))

  return (
    <mesh position={[midpoint.x, midpoint.y, midpoint.z]}>
      <cylinderGeometry args={[thickness * 0.8, thickness, length, 8]} />
      <meshStandardMaterial color="#5c4033" roughness={0.9} />
    </mesh>
  )
}

// Main tree component
function Tree({ totalCredits, lockedCredits, vestingCredits, claimableCredits }: TreeProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Generate leaves based on credit data
  const leaves = useMemo(() => {
    const leafArray: { position: [number, number, number]; color: string; scale: number }[] = []
    const totalLeaves = Math.min(totalCredits / 20, 150) // Cap at 150 leaves

    const lockedRatio = lockedCredits / totalCredits
    const vestingRatio = vestingCredits / totalCredits
    const claimableRatio = claimableCredits / totalCredits

    for (let i = 0; i < totalLeaves; i++) {
      // Distribute leaves in a tree-like pattern
      const angle = (i / totalLeaves) * Math.PI * 8 + Math.random() * 0.5
      const radius = 0.3 + Math.random() * 1.2
      const height = 0.5 + (i / totalLeaves) * 2.5 + Math.random() * 0.3

      const x = Math.cos(angle) * radius * (1 - (height - 0.5) / 3)
      const z = Math.sin(angle) * radius * (1 - (height - 0.5) / 3)

      // Determine color based on credit status
      let color: string
      const random = i / totalLeaves
      if (random < lockedRatio) {
        color = "#9ca3af" // Grey for locked
      } else if (random < lockedRatio + vestingRatio) {
        color = "#d97706" // Amber for vesting
      } else if (random < lockedRatio + vestingRatio + claimableRatio) {
        color = "#22c55e" // Green for claimable
      } else {
        color = "#c2956d" // Warm amber for general
      }

      leafArray.push({
        position: [x, height, z],
        color,
        scale: 0.6 + Math.random() * 0.6,
      })
    }

    return leafArray
  }, [totalCredits, lockedCredits, vestingCredits, claimableCredits])

  // Subtle rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {/* Trunk */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.08, 0.15, 0.8, 12]} />
        <meshStandardMaterial color="#4a3728" roughness={0.9} />
      </mesh>

      {/* Main trunk extension */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.8, 12]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>

      {/* Upper trunk */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.6, 12]} />
        <meshStandardMaterial color="#6b5344" roughness={0.9} />
      </mesh>

      {/* Branches */}
      <Branch start={[0, 0.8, 0]} end={[-0.4, 1.2, 0.2]} thickness={0.04} />
      <Branch start={[0, 0.8, 0]} end={[0.3, 1.1, -0.3]} thickness={0.04} />
      <Branch start={[0, 1.2, 0]} end={[-0.5, 1.6, -0.2]} thickness={0.03} />
      <Branch start={[0, 1.2, 0]} end={[0.4, 1.5, 0.3]} thickness={0.03} />
      <Branch start={[0, 1.5, 0]} end={[-0.3, 2.0, 0.1]} thickness={0.025} />
      <Branch start={[0, 1.5, 0]} end={[0.2, 1.9, -0.2]} thickness={0.025} />
      <Branch start={[0, 1.8, 0]} end={[0.1, 2.3, 0.1]} thickness={0.02} />

      {/* Roots visualization */}
      <mesh position={[-0.15, 0.05, 0.1]} rotation={[0, 0, -0.4]}>
        <cylinderGeometry args={[0.02, 0.04, 0.3, 8]} />
        <meshStandardMaterial color="#3d2b1f" roughness={0.95} />
      </mesh>
      <mesh position={[0.12, 0.05, -0.08]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.02, 0.04, 0.25, 8]} />
        <meshStandardMaterial color="#3d2b1f" roughness={0.95} />
      </mesh>
      <mesh position={[0.05, 0.03, 0.15]} rotation={[0.3, 0, 0.2]}>
        <cylinderGeometry args={[0.015, 0.03, 0.2, 8]} />
        <meshStandardMaterial color="#3d2b1f" roughness={0.95} />
      </mesh>

      {/* Leaves */}
      {leaves.map((leaf, i) => (
        <Leaf key={i} position={leaf.position} color={leaf.color} scale={leaf.scale} delay={i * 0.1} />
      ))}

      {/* Subtle glow on trunk */}
      <pointLight position={[0, 1, 0]} intensity={0.3} color="#d4a574" distance={2} />
    </group>
  )
}

// Ground plane
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
      <circleGeometry args={[3, 64]} />
      <meshStandardMaterial color="#e8dfd5" roughness={1} transparent opacity={0.5} />
    </mesh>
  )
}

export function V2GTreeVisualization({ totalCredits, lockedCredits, vestingCredits, claimableCredits }: TreeProps) {
  return (
    <div className="relative h-[400px] w-full">
      <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
        <directionalLight position={[-3, 3, -3]} intensity={0.3} color="#ffd4a0" />

        <Tree
          totalCredits={totalCredits}
          lockedCredits={lockedCredits}
          vestingCredits={vestingCredits}
          claimableCredits={claimableCredits}
        />
        <Ground />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate
          autoRotateSpeed={0.3}
        />

        <Environment preset="studio" />
      </Canvas>

      {/* Overlay info */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
        <div className="bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2">
          <p className="text-xs text-muted-foreground">Total V2G Credits</p>
          <p className="text-2xl font-bold text-amber-700">{totalCredits.toLocaleString()}</p>
        </div>
        <div className="bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 text-right">
          <p className="text-xs text-muted-foreground">Lifetime Contribution</p>
          <p className="text-lg font-semibold text-stone-700">1,284 kWh</p>
        </div>
      </div>
    </div>
  )
}
