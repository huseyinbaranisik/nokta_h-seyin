import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  text: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export function Button({
  text,
  onPress,
  loading = false,
  variant = 'primary',
  style,
  textStyle,
  disabled = false,
}: ButtonProps) {
  const btnScale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true }).start();
  const pressOut = () =>
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true }).start();

  const isPrimary = variant === 'primary';

  return (
    <Animated.View style={[{ transform: [{ scale: btnScale }] }, style]}>
      <TouchableOpacity
        onPressIn={pressIn}
        onPressOut={pressOut}
        onPress={onPress}
        disabled={loading || disabled}
        activeOpacity={0.9}
      >
        {isPrimary ? (
          <LinearGradient
            colors={['#7C3AED', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.btn, styles.primaryBtn]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={[styles.btnText, styles.primaryBtnText, textStyle]}>{text}</Text>
            )}
          </LinearGradient>
        ) : (
          <TouchableOpacity
            style={[styles.btn, styles.secondaryBtn]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={loading || disabled}
          >
            <Text style={[styles.btnText, styles.secondaryBtnText, textStyle]}>{text}</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    shadowColor: '#7C3AED',
    shadowRadius: 10,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  btnText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  primaryBtnText: {
    color: '#fff',
  },
  secondaryBtnText: {
    color: '#fff',
  },
});
