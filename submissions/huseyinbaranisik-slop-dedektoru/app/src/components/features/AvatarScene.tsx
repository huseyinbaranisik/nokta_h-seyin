import React, { Component, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { getColors } from '../../theme/colors';
import { ThreeAvatarComponent } from './ThreeAvatar';

interface AvatarSceneProps {
  isSpeaking: boolean;
  audioLevel?: number;
}

// ─── Error Boundary ───
// 3D sahneler Expo Go'da crash olabilir. Bu boundary crash'i yakalar ve 2D fallback gösterir.
class AvatarErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn('AvatarScene 3D yüklenemedi, 2D fallback gösteriliyor:', error?.message);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// ─── 2D Animated Avatar Fallback ───
// 3D sahne yüklenemezse veya Expo Go'da çalışıyorsa bu kullanılır.
const Avatar2D: React.FC<AvatarSceneProps> = ({ isSpeaking, audioLevel = 0 }) => {
  const { themeMode, accentColor } = useTheme();
  const colors = getColors(themeMode, accentColor);
  
  const scale = useSharedValue(1);
  const mouthHeight = useSharedValue(4);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    if (isSpeaking) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.04, { duration: 600 }),
          withTiming(1.0, { duration: 600 })
        ),
        -1,
        true
      );
      const mouthTarget = Math.max(4, audioLevel * 30);
      mouthHeight.value = withSpring(mouthTarget, { damping: 8, stiffness: 200 });
      glowOpacity.value = withSpring(0.6 + audioLevel * 0.4);
    } else {
      scale.value = withSpring(1);
      mouthHeight.value = withSpring(4);
      glowOpacity.value = withSpring(0.3);
    }
  }, [isSpeaking, audioLevel]);

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const mouthStyle = useAnimatedStyle(() => ({
    height: mouthHeight.value,
    borderRadius: mouthHeight.value / 2,
  }));
  
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.container2D}>
      <Animated.View style={[styles.glow, { backgroundColor: colors.primary }, glowStyle]} />
      
      <Animated.View style={[styles.avatarCircle, { backgroundColor: colors.bgCard, borderColor: colors.primary }, avatarStyle]}>
        <View style={styles.face}>
          <View style={styles.eyes}>
            <View style={[styles.eye, { backgroundColor: colors.textPrimary }]}>
              <View style={[styles.eyeHighlight, { backgroundColor: colors.primary }]} />
            </View>
            <View style={[styles.eye, { backgroundColor: colors.textPrimary }]}>
              <View style={[styles.eyeHighlight, { backgroundColor: colors.primary }]} />
            </View>
          </View>
          <Animated.View
            style={[
              styles.mouth,
              { backgroundColor: colors.primary },
              mouthStyle,
            ]}
          />
        </View>
      </Animated.View>
      
      <Text style={[styles.label, { color: colors.textMuted }]}>
        {isSpeaking ? '🎙️ Dinleniyor...' : 'AI Avatar'}
      </Text>
    </View>
  );
};

// ─── Main Export ───
export const AvatarScene: React.FC<AvatarSceneProps> = ({ isSpeaking, audioLevel = 0 }) => {
  const fallback = <Avatar2D isSpeaking={isSpeaking} audioLevel={audioLevel} />;

  if (ThreeAvatarComponent) {
    return (
      <AvatarErrorBoundary fallback={fallback}>
        <ThreeAvatarComponent isSpeaking={isSpeaking} audioLevel={audioLevel} />
      </AvatarErrorBoundary>
    );
  }

  return fallback;
};

const styles = StyleSheet.create({
  container2D: {
    height: 240,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  glow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    transform: [{ scale: 1.3 }],
  },
  avatarCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  face: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyes: {
    flexDirection: 'row',
    gap: 28,
    marginBottom: 18,
  },
  eye: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 3,
  },
  eyeHighlight: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  mouth: {
    width: 28,
    minHeight: 4,
  },
  label: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
