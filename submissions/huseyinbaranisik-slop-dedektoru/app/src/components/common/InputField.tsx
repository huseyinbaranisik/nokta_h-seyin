import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors } from '../../theme/colors';

interface InputFieldProps extends TextInputProps {
  label?: string;
  charCount?: number;
  maxCharCount?: number;
}

export function InputField({
  label,
  charCount,
  maxCharCount,
  style,
  ...props
}: InputFieldProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textDim}
          textAlignVertical="top"
          {...props}
        />
        {maxCharCount !== undefined && charCount !== undefined && (
          <Text style={styles.charCount}>
            {charCount}/{maxCharCount}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.bgCardBorder,
    borderRadius: 20,
    padding: 16,
  },
  input: {
    color: colors.textPrimary,
    fontSize: 15,
    minHeight: 140,
    lineHeight: 22,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 11,
    color: colors.textDim,
    marginTop: 8,
  },
});
