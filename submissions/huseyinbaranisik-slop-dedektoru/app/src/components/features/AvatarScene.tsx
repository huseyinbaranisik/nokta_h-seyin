import React, { Suspense, useEffect, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { useGLTF, Environment, ContactShadows } from '@react-three/drei/native';
import * as THREE from 'three';

interface AvatarSceneProps {
  isSpeaking: boolean;
  audioLevel?: number;
}

// Avatar Model Component
function Avatar({ isSpeaking, audioLevel = 0 }: { isSpeaking: boolean; audioLevel?: number }) {
  // Yüzünüzle oluşturduğunuz avatar.glb modelini yüklüyoruz.
  // Not: require ile yüklenen objeler Expo'da metro.config.js ayarı gerektirebilir (assetExts: ['glb', 'gltf'])
  const { scene } = useGLTF(require('../../../assets/avatar.glb')) as any;
  const avatarRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // Lipsync Logic (Viseme pipeline basitleştirilmiş)
    // Eğer modelde morphTargets (blend shapes) varsa, sese veya isSpeaking'e göre ağız hareket ettirilir.
    // 'mouthOpen' veya benzeri bir morph hedefinin adını avatarına göre güncellemen gerekebilir.
    scene.traverse((child: any) => {
      if (child.isMesh && child.morphTargetDictionary && child.morphTargetInfluences) {
        const mouthOpenIndex = child.morphTargetDictionary['mouthOpen'] || child.morphTargetDictionary['viseme_O'];
        if (mouthOpenIndex !== undefined) {
          // Ses seviyesine göre ağzı aç
          const targetValue = isSpeaking ? Math.min(1, audioLevel * 2 + 0.1) : 0;
          
          // Yumuşak geçiş için basit bir animasyon döngüsü (gerçekte frame-by-frame veya useFrame ile yapılmalı)
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

export const AvatarScene: React.FC<AvatarSceneProps> = ({ isSpeaking, audioLevel = 0 }) => {
  return (
    <View style={styles.container}>
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[-10, 10, -10]} intensity={0.5} />
        <Suspense fallback={null}>
          <Avatar isSpeaking={isSpeaking} audioLevel={audioLevel} />
          <Environment preset="city" />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={5} blur={2} far={4} />
        </Suspense>
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    borderRadius: 20,
    marginVertical: 10,
  },
});
