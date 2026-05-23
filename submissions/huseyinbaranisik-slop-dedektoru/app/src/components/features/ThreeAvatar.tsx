// @ts-nocheck
// Bu dosya three.js JSX elemanları içerdiğinden TypeScript kontrolü atlanır.
// Three.js elemanları (group, primitive, ambientLight vb.) runtime'da @react-three/fiber tarafından sağlanır.

import React, { Suspense, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';

interface ThreeAvatarProps {
  isSpeaking: boolean;
  audioLevel?: number;
}

let ThreeAvatarComponent: React.FC<ThreeAvatarProps> | null = null;

try {
  const { Canvas } = require('@react-three/fiber/native');
  const { useGLTF, Environment, ContactShadows } = require('@react-three/drei/native');

  function AvatarModel({ isSpeaking, audioLevel = 0 }) {
    const { scene } = useGLTF(require('../../../assets/avatar.glb'));
    const avatarRef = useRef(null);

    useEffect(() => {
      scene.traverse((child) => {
        if (child.isMesh && child.morphTargetDictionary && child.morphTargetInfluences) {
          const mouthOpenIndex = child.morphTargetDictionary['mouthOpen'] || child.morphTargetDictionary['viseme_O'];
          if (mouthOpenIndex !== undefined) {
            const targetValue = isSpeaking ? Math.min(1, audioLevel * 2 + 0.1) : 0;
            child.morphTargetInfluences[mouthOpenIndex] = targetValue;
          }
        }
      });
    }, [scene, isSpeaking, audioLevel]);

    return (
      <group ref={avatarRef} position={[0, -1.5, 0]} scale={[2, 2, 2]}>
        <primitive object={scene} />
      </group>
    );
  }

  ThreeAvatarComponent = ({ isSpeaking, audioLevel = 0 }) => (
    <View style={styles.container3D}>
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[-10, 10, -10]} intensity={0.5} />
        <Suspense fallback={null}>
          <AvatarModel isSpeaking={isSpeaking} audioLevel={audioLevel} />
          <Environment preset="city" />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={5} blur={2} far={4} />
        </Suspense>
      </Canvas>
    </View>
  );
} catch (e) {
  console.warn('Three.js yüklenemedi, 3D avatar kullanılamaz.');
}

export { ThreeAvatarComponent };

const styles = StyleSheet.create({
  container3D: {
    height: 300,
    width: '100%',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    borderRadius: 20,
    marginVertical: 10,
  },
});
