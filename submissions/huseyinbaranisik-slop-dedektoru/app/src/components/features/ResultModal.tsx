import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Share,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { SlopGauge } from './SlopGauge';
import { ClaimCard } from './ClaimCard';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { AnalysisResult } from '../../types';

interface Props {
  visible: boolean;
  result: AnalysisResult | null;
  pitch: string;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function ResultModal({ visible, result, pitch, onClose }: Props) {
  if (!result) return null;

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
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Semi-transparent background */}
        <TouchableOpacity 
          activeOpacity={1} 
          style={styles.backdrop} 
          onPress={onClose} 
        />
        
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#1F2937', '#111827']}
            style={styles.modalContent}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.dragIndicator} />
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Analiz Raporu</Text>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Score card directly in modal */}
              <View style={styles.scoreSection}>
                <SlopGauge score={result.slopScore} />
                <View style={[styles.interpretBand, { backgroundColor: scoreBg, borderColor: `${scoreColor}44` }]}>
                  <Text style={[styles.interpretText, { color: scoreColor }]}>
                    {result.slopScore < 35 ? '✓ Güçlü Pitch' :
                     result.slopScore < 65 ? '⚠ Şüpheli Detaylar' :
                     '✗ Yüksek Slop Riski'}
                  </Text>
                </View>
              </View>

              {/* AI Summary */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>AI ÖZETİ</Text>
                <Card>
                  <Text style={styles.summaryText}>{result.summary}</Text>
                </Card>
              </View>

              {/* Claims */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>BULGULAR ({result.claims.length})</Text>
                {result.claims.map((claim, i) => (
                  <ClaimCard key={i} claim={claim} index={i} />
                ))}
              </View>

              {/* Recommendation */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>ÖNERİ</Text>
                <LinearGradient
                  colors={['rgba(124,58,237,0.15)', 'rgba(236,72,153,0.1)']}
                  style={styles.recommendCard}
                >
                  <Text style={styles.recommendText}>{result.recommendation}</Text>
                </LinearGradient>
              </View>

              <View style={styles.footerActions}>
                <Button 
                  text="Kapat" 
                  variant="secondary" 
                  onPress={onClose} 
                  style={{ flex: 1 }}
                />
                <Button 
                  text="Paylaş" 
                  onPress={handleShare} 
                  style={{ flex: 1 }}
                />
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContainer: {
    height: SCREEN_HEIGHT * 0.85,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  modalContent: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    marginBottom: 15,
  },
  closeBtn: {
    position: 'absolute',
    right: 20,
    top: 10,
    zIndex: 10,
  },
  closeIcon: {
    color: colors.textMuted,
    fontSize: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  interpretBand: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    borderWidth: 1,
  },
  interpretText: {
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    marginBottom: 25,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.purple,
    letterSpacing: 1,
    marginBottom: 10,
  },
  summaryText: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
  },
  recommendCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.2)',
  },
  recommendText: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  footerActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
});
