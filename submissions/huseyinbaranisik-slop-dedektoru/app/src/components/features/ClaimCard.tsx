import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { Card } from '../common/Card';
import type { Claim } from '../../types';

const VERDICT_CONFIG = {
  GÜÇLÜ: { bg: 'rgba(34,197,94,0.15)', border: colors.green, text: colors.green, icon: '✓' },
  ABARTILI: { bg: 'rgba(249,115,22,0.15)', border: colors.orange, text: colors.orange, icon: '⚠' },
  DOĞRULANAMAZ: { bg: 'rgba(239,68,68,0.15)', border: colors.red, text: colors.red, icon: '✗' },
};

interface Props {
  claim: Claim;
  index: number;
}

export const ClaimCard: React.FC<Props> = ({ claim, index }) => {
  const cfg = VERDICT_CONFIG[claim.verdict];

  return (
    <Card style={[styles.card, { borderColor: colors.bgCardBorder }]}>
      {/* Header row */}
      <View style={styles.header}>
        <View style={[styles.indexBadge, { backgroundColor: cfg.bg }]}>
          <Text style={[styles.icon, { color: cfg.text }]}>{cfg.icon}</Text>
        </View>
        <Text style={styles.claimText} numberOfLines={2}>
          {claim.text}
        </Text>
        <View style={[styles.verdictChip, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
          <Text style={[styles.verdictText, { color: cfg.text }]}>{claim.verdict}</Text>
        </View>
      </View>

      {/* Reasoning */}
      <Text style={styles.reasoning}>{claim.reasoning}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icon: {
    fontSize: 14,
    fontWeight: '700',
  },
  claimText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '500',
    lineHeight: 18,
  },
  verdictChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexShrink: 0,
  },
  verdictText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  reasoning: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
  },
});
