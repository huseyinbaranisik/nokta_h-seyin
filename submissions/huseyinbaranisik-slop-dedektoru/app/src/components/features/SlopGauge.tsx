import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../../theme/colors';

interface Props {
  score: number; // 0-100
}

const SIZE = 200;
const STROKE = 16;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function scoreColor(score: number): string {
  if (score < 35) return colors.green;
  if (score < 65) return colors.amber;
  return colors.red;
}

function scoreLabel(score: number): string {
  if (score < 35) return 'TEMİZ';
  if (score < 65) return 'ŞÜPHELI';
  return 'SLOP!';
}

export const SlopGauge: React.FC<Props> = ({ score }) => {
  const animVal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animVal, {
      toValue: score,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [score]);

  const color = scoreColor(score);
  const label = scoreLabel(score);

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE}>
        <Defs>
          <LinearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity="1" />
            <Stop offset="100%" stopColor={colors.magenta} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        {/* Track */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={STROKE}
          fill="none"
        />
        {/* Progress — using JS-based offset for simplicity in this bridge */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="url(#gaugeGrad)"
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={`${CIRCUMFERENCE}`}
          strokeDashoffset={CIRCUMFERENCE * (1 - score / 100)}
          strokeLinecap="round"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </Svg>

      {/* Center text */}
      <View style={styles.centerText}>
        <Animated.Text style={[styles.scoreNumber, { color }]}>{score}</Animated.Text>
        <Text style={styles.scorePercent}>/100</Text>
        <Text style={[styles.scoreLabel, { color }]}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -2,
  },
  scorePercent: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: -4,
    fontWeight: '500',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 4,
  },
});
