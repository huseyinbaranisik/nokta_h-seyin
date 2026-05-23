import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { getColors } from '../../theme/colors';

interface VoiceVisualizerProps {
  isRecording: boolean;
  audioLevel?: number; // 0 to 1
}

const BAR_COUNT = 5;

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ isRecording, audioLevel = 0 }) => {
  const { themeMode, accentColor } = useTheme();
  const colors = getColors(themeMode, accentColor);

  // Reanimated shared values for each bar
  const barHeights = Array.from({ length: BAR_COUNT }).map(() => useSharedValue(10));

  useEffect(() => {
    if (isRecording) {
      // If we have an active audioLevel (e.g. from RMS metering), use it
      if (audioLevel > 0) {
        barHeights.forEach((height, i) => {
          // Add some randomness and offset for each bar based on the audio level
          const randomFactor = Math.random() * 0.5 + 0.5;
          const targetHeight = Math.max(10, Math.min(100, audioLevel * 200 * randomFactor));
          height.value = withSpring(targetHeight, { damping: 12, stiffness: 100 });
        });
      } else {
        // Idle animation while recording but no audio level provided
        barHeights.forEach((height, i) => {
          height.value = withRepeat(
            withSequence(
              withTiming(15 + Math.random() * 20, { duration: 300 + i * 50 }),
              withTiming(10, { duration: 300 + i * 50 })
            ),
            -1,
            true
          );
        });
      }
    } else {
      // Not recording: flatten the bars
      barHeights.forEach((height) => {
        height.value = withSpring(4);
      });
    }
  }, [isRecording, audioLevel]);

  return (
    <View style={styles.container}>
      {barHeights.map((height, i) => {
        const animatedStyle = useAnimatedStyle(() => {
          return {
            height: height.value,
          };
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.bar,
              { backgroundColor: isRecording ? colors.error : colors.textMuted },
              animatedStyle,
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    gap: 8,
  },
  bar: {
    width: 12,
    borderRadius: 6,
  },
});
