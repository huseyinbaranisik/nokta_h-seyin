import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { SlopGauge } from '../components/features/SlopGauge';
import { ClaimCard } from '../components/features/ClaimCard';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useResultAnimation } from '../hooks/useResultAnimation';
import type { RootStackParamList, NavigationProp } from '../types';

type ResultRoute = RouteProp<RootStackParamList, 'Result'>;

export default function ResultScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ResultRoute>();
  const { result, pitch } = route.params;
  const { fadeAnim, slideAnim } = useResultAnimation();

  const handleShare = async () => {
    const msg =
      `🔍 Nokta Due Diligence Raporu\n\n` +
      `Slop Skoru: ${result.slopScore}/100\n\n` +
      `Özet: ${result.summary}\n\n` +
      `Öneri: ${result.recommendation}\n\n` +
      `— Nokta Slop Dedektörü`;
    await Share.share({ message: msg });
  };

  const scoreColor =
    result.slopScore < 35 ? colors.green :
    result.slopScore < 65 ? colors.amber : colors.red;

  const scoreBg =
    result.slopScore < 35 ? 'rgba(34,197,94,0.1)' :
    result.slopScore < 65 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#0F1117', '#1A1025']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Analiz Raporu</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
          <Text style={styles.shareIcon}>↑</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Score Card */}
          <Card style={[styles.scoreCard, { borderColor: `${scoreColor}44` }]}>
            <SlopGauge score={result.slopScore} />

            {/* Score interpretation band */}
            <View style={[styles.interpretBand, { backgroundColor: scoreBg, borderColor: `${scoreColor}44` }]}>
              <Text style={[styles.interpretText, { color: scoreColor }]}>
                {result.slopScore < 35 ? '✓ Güçlü Pitch — Hızlı değerlendirmeye alın' :
                 result.slopScore < 65 ? '⚠ Şüpheli — Detay istenebilir' :
                 '✗ Yüksek Slop Riski — Fon ciddi riski taşır'}
              </Text>
            </View>
          </Card>

          {/* AI Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>AI ÖZETİ</Text>
            <Card>
              <Text style={styles.summaryText}>{result.summary}</Text>
            </Card>
          </View>

          {/* Claims Analysis */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>İDDİA ANALİZİ · {result.claims.length} BULGU</Text>
            {result.claims.map((claim, i) => (
              <ClaimCard key={i} claim={claim} index={i} />
            ))}
          </View>

          {/* Investor Recommendation */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>YATIRIMCI ÖNERİSİ</Text>
            <LinearGradient
              colors={['rgba(124,58,237,0.15)', 'rgba(236,72,153,0.10)']}
              style={styles.recommendCard}
            >
              <Text style={styles.recommendText}>{result.recommendation}</Text>
            </LinearGradient>
          </View>

          {/* Analyzed Pitch Snippet */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ANALİZ EDİLEN PİTCH</Text>
            <Card style={styles.pitchSnippet}>
              <Text style={styles.pitchText} numberOfLines={5}>{pitch}</Text>
            </Card>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Button
              variant="secondary"
              text="↩  Yeni Pitch"
              onPress={() => navigation.goBack()}
              style={{ flex: 1 }}
            />
            <Button
              text="↑  Raporu Paylaş"
              onPress={handleShare}
              style={{ flex: 1 }}
            />
          </View>

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 36, height: 36,
    backgroundColor: colors.bgCard,
    borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { fontSize: 18, color: colors.textPrimary },
  topTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  shareBtn: {
    width: 36, height: 36,
    backgroundColor: colors.bgCard,
    borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  shareIcon: { fontSize: 18, color: colors.textPrimary },

  scroll: { paddingHorizontal: 20, paddingBottom: 40 },

  scoreCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 20,
    gap: 16,
  },
  interpretBand: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
  },
  interpretText: { fontSize: 13, fontWeight: '600', textAlign: 'center' },

  section: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.purple,
    letterSpacing: 1.5,
    marginBottom: 10,
  },

  summaryText: { color: colors.textPrimary, fontSize: 14, lineHeight: 21 },

  recommendCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.25)',
  },
  recommendText: { color: colors.textPrimary, fontSize: 14, lineHeight: 21, fontStyle: 'italic' },

  pitchSnippet: {
    padding: 14,
  },
  pitchText: { color: colors.textMuted, fontSize: 13, lineHeight: 19 },

  actions: { flexDirection: 'row', gap: 10, marginTop: 4 },
});
