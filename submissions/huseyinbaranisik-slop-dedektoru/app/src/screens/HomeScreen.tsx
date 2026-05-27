import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../theme/colors';
import { usePitchAnalysis } from '../hooks/usePitchAnalysis';
import { useMicrophone } from '../hooks/useMicrophone';
import { useAnalysisHistory } from '../hooks/useAnalysisHistory';
import { Button } from '../components/common/Button';
import { VoiceVisualizer } from '../components/features/VoiceVisualizer';
import { AvatarScene } from '../components/features/AvatarScene';
import { ExpertCall } from '../components/features/ExpertCall';
import { SlopGauge } from '../components/features/SlopGauge';
import { Ionicons } from '@expo/vector-icons';
import { transcribeAudio } from '../api/analyzer';
import { saveToForgeMD } from '../utils/fileManager';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { AnalysisResult } from '../types';

const VERDICT_CONFIG: Record<string, { color: string; icon: string; bg: string }> = {
  'GÜÇLÜ':        { color: '#22c55e', icon: 'checkmark-circle', bg: '#22c55e18' },
  'ABARTILI':     { color: '#f59e0b', icon: 'warning',           bg: '#f59e0b18' },
  'DOĞRULANAMAZ': { color: '#ef4444', icon: 'close-circle',      bg: '#ef444418' },
};

export default function HomeScreen() {
  const { themeMode, accentColor } = useTheme();
  const colors = getColors(themeMode, accentColor);

  const {
    pitch, setPitch, loading, handleAnalyze, handleFileUpload,
    result, setResult, isStuck, resetStuck,
  } = usePitchAnalysis();

  const inputRef = useRef<TextInput>(null);
  const { isRecording, startRecording, stopRecording, audioLevel } = useMicrophone();
  const { history, refreshHistory, clearHistory } = useAnalysisHistory();
  const [transcribing, setTranscribing] = useState(false);

  // TTS + Avatar
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const [ttsAudioLevel, setTtsAudioLevel] = useState(0);

  // Sonuç gelince otomatik sesli okuma
  useEffect(() => {
    if (result?.summary) {
      Speech.stop();
      setIsTTSPlaying(true);
      Speech.speak(result.summary, {
        onDone: () => setIsTTSPlaying(false),
        onStopped: () => setIsTTSPlaying(false),
        onError: () => setIsTTSPlaying(false),
      });
    }
  }, [result]);

  // TTS sırasında avatar ağzını simüle et
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTTSPlaying) {
      interval = setInterval(() => setTtsAudioLevel(Math.random() * 0.7 + 0.3), 100);
    } else {
      setTtsAudioLevel(0);
    }
    return () => clearInterval(interval);
  }, [isTTSPlaying]);

  const handleMicPress = useCallback(async () => {
    if (isRecording) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const uri = await stopRecording();
      if (uri) {
        try {
          setTranscribing(true);
          const text = await transcribeAudio(uri);
          setPitch(prev => prev ? prev + ' ' + text : text);
          await saveToForgeMD(text);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setTimeout(() => inputRef.current?.focus(), 100);
        } catch (err) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Alert.alert('Hata', 'Ses yazıya dökülemedi: ' + (err as Error).message);
        } finally {
          setTranscribing(false);
        }
      }
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await startRecording();
    }
  }, [isRecording, stopRecording, startRecording]);

  const onAnalyzePress = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Speech.stop();
    setIsTTSPlaying(false);
    await handleAnalyze();
    refreshHistory();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [handleAnalyze, refreshHistory]);

  const onNewAnalysis = () => {
    Speech.stop();
    setIsTTSPlaying(false);
    setPitch('');
    setResult(null);
  };

  const openHistory = (item: { pitch: string; result: AnalysisResult }) => {
    Speech.stop();
    setIsTTSPlaying(false);
    setPitch(item.pitch);
    setResult(item.result);
  };

  if (isStuck) return <ExpertCall roomName="NoktaExpertAssistance" onClose={resetStuck} />;

  const scoreColor = result
    ? result.slopScore < 35 ? colors.success : result.slopScore < 65 ? colors.warning : colors.error
    : colors.primary;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Başlık */}
          <View style={styles.header}>
            <Text style={[styles.appName, { color: colors.textPrimary }]}>
              <Text style={{ color: colors.primary }}>●</Text> Slop Dedektörü
            </Text>
            <Text style={[styles.tagline, { color: colors.textMuted }]}>
              {isTTSPlaying ? '🔊 Asistan konuşuyor...' : result ? '📊 Analiz Raporu' : 'Pitch metnini gir veya sesle anlat'}
            </Text>
          </View>

          {/* Avatar */}
          <AvatarScene
            isSpeaking={isRecording || isTTSPlaying}
            audioLevel={isRecording ? audioLevel : ttsAudioLevel}
          />

          {/* ── Giriş Modu ── */}
          {!result ? (
            <>
              <View style={[styles.inputCard, { backgroundColor: colors.bgCard, borderColor: colors.bgCardBorder }]}>
                <TextInput
                  ref={inputRef}
                  style={[styles.mainInput, { color: colors.textPrimary }]}
                  placeholder="Girişim fikrini buraya yaz veya mikrofona bas..."
                  placeholderTextColor={colors.textDim}
                  value={pitch}
                  onChangeText={setPitch}
                  multiline
                  maxLength={2000}
                />

                {isRecording && (
                  <View style={{ marginBottom: 8 }}>
                    <VoiceVisualizer isRecording={isRecording} audioLevel={audioLevel} />
                  </View>
                )}

                <View style={styles.inputFooter}>
                  {/* PDF */}
                  <TouchableOpacity onPress={handleFileUpload} style={[styles.iconBtn, { borderColor: colors.bgCardBorder }]}>
                    <Ionicons name="document-attach-outline" size={20} color={colors.primary} />
                    <Text style={[styles.iconBtnLabel, { color: colors.textMuted }]}>PDF</Text>
                  </TouchableOpacity>

                  {/* Mikrofon */}
                  <TouchableOpacity
                    onPress={handleMicPress}
                    style={[styles.iconBtn, {
                      borderColor: isRecording ? colors.error : colors.bgCardBorder,
                      backgroundColor: isRecording ? colors.error + '18' : 'transparent',
                    }]}
                  >
                    {transcribing
                      ? <ActivityIndicator color={colors.primary} size="small" />
                      : <Ionicons name={isRecording ? 'stop' : 'mic'} size={20} color={isRecording ? colors.error : colors.primary} />
                    }
                    <Text style={[styles.iconBtnLabel, { color: isRecording ? colors.error : colors.textMuted }]}>
                      {isRecording ? 'Dur' : 'Ses'}
                    </Text>
                  </TouchableOpacity>

                  <View style={{ flex: 1 }} />
                  <Text style={[styles.charCount, { color: colors.textDim }]}>{pitch.length}/2000</Text>
                </View>
              </View>

              <Button
                text={loading ? 'Analiz Ediliyor...' : '⚡  Analiz Et'}
                onPress={onAnalyzePress}
                loading={loading}
                style={{ marginTop: 12 }}
              />

              {/* Geçmiş */}
              {history.length > 0 && (
                <View style={styles.historySection}>
                  <View style={styles.historyHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Geçmiş Girişim Analizleri</Text>
                    <TouchableOpacity onPress={() => Alert.alert('Geçmişi Temizle', 'Tüm analizler silinecek.', [
                      { text: 'Vazgeç', style: 'cancel' },
                      { text: 'Sil', style: 'destructive', onPress: clearHistory },
                    ])}>
                      <Ionicons name="trash-outline" size={16} color={colors.error} />
                    </TouchableOpacity>
                  </View>

                  {history.map((item) => {
                    const sc = item.result.slopScore;
                    const clr = sc < 35 ? colors.success : sc < 65 ? colors.warning : colors.error;
                    return (
                      <TouchableOpacity key={item.id} onPress={() => openHistory(item)}>
                        <View style={[styles.historyCard, { backgroundColor: colors.bgCard, borderColor: colors.bgCardBorder }]}>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.historyPitch, { color: colors.textPrimary }]} numberOfLines={1}>
                              {item.pitch.slice(0, 50)}…
                            </Text>
                            <Text style={[styles.historyDate, { color: colors.textDim }]}>
                              {new Date(item.timestamp).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </Text>
                          </View>
                          <View style={[styles.scoreBadge, { backgroundColor: clr + '22' }]}>
                            <Text style={[styles.scoreBadgeText, { color: clr }]}>{sc}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </>
          ) : (
            /* ── Sonuç Modu ── */
            <View style={[styles.resultCard, { backgroundColor: colors.bgCard, borderColor: colors.bgCardBorder }]}>

              {/* Gauge */}
              <View style={styles.gaugeRow}>
                <SlopGauge score={result.slopScore} />
              </View>
              <View style={[styles.scoreLabelBand, { backgroundColor: scoreColor + '18', borderColor: scoreColor + '44' }]}>
                <Text style={[styles.scoreLabelText, { color: scoreColor }]}>
                  {result.slopScore < 35 ? '✅ Güçlü Girişim' : result.slopScore < 65 ? '⚠️ Orta Risk' : '🚨 Yüksek Slop'}
                </Text>
              </View>

              {/* Özet */}
              <Text style={[styles.sectionTitle, { color: colors.textMuted, marginTop: 20, marginBottom: 8 }]}>Asistan Özeti</Text>
              <Text style={[styles.summaryText, { color: colors.textPrimary }]}>{result.summary}</Text>

              {/* Bulgular */}
              {result.claims && result.claims.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { color: colors.textMuted, marginTop: 20, marginBottom: 8 }]}>
                    Bulgular ({result.claims.length})
                  </Text>
                  {result.claims.map((claim, i) => {
                    const cfg = VERDICT_CONFIG[claim.verdict] ?? VERDICT_CONFIG['DOĞRULANAMAZ'];
                    return (
                      <View key={i} style={[styles.claimCard, { backgroundColor: cfg.bg, borderColor: cfg.color + '44' }]}>
                        <View style={styles.claimHeader}>
                          <Ionicons name={cfg.icon as any} size={16} color={cfg.color} />
                          <Text style={[styles.claimVerdict, { color: cfg.color }]}>{claim.verdict}</Text>
                        </View>
                        <Text style={[styles.claimText, { color: colors.textPrimary }]}>{claim.text}</Text>
                        <Text style={[styles.claimReasoning, { color: colors.textMuted }]}>{claim.reasoning}</Text>
                      </View>
                    );
                  })}
                </>
              )}

              {/* Öneri */}
              {result.recommendation && (
                <>
                  <Text style={[styles.sectionTitle, { color: colors.textMuted, marginTop: 20, marginBottom: 8 }]}>Yatırımcı Önerisi</Text>
                  <View style={[styles.recommendationBox, { backgroundColor: scoreColor + '12', borderColor: scoreColor + '44' }]}>
                    <Text style={[styles.recommendationText, { color: scoreColor }]}>{result.recommendation}</Text>
                  </View>
                </>
              )}

              <Button
                text="Yeni Analiz"
                variant="secondary"
                onPress={onNewAnalysis}
                style={{ marginTop: 24 }}
              />
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 50, paddingTop: 12 },

  header: { alignItems: 'center', marginBottom: 4 },
  appName: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  tagline: { fontSize: 13, marginTop: 4 },

  inputCard: { borderRadius: 20, borderWidth: 1, padding: 16, marginTop: 12, elevation: 2 },
  mainInput: { fontSize: 16, minHeight: 110, lineHeight: 24, textAlignVertical: 'top' },
  inputFooter: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)', paddingTop: 12, marginTop: 8, gap: 8 },
  iconBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  iconBtnLabel: { fontSize: 12, fontWeight: '700' },
  charCount: { fontSize: 11, fontWeight: '600' },

  sectionTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },

  historySection: { marginTop: 28 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  historyCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 8 },
  historyPitch: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  historyDate: { fontSize: 12 },
  scoreBadge: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  scoreBadgeText: { fontSize: 15, fontWeight: '900' },

  resultCard: { borderRadius: 20, borderWidth: 1, padding: 20, marginTop: 12 },
  gaugeRow: { alignItems: 'center', marginBottom: 8 },
  scoreLabelBand: { alignSelf: 'center', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 100, borderWidth: 1, marginBottom: 4 },
  scoreLabelText: { fontSize: 15, fontWeight: '800' },
  summaryText: { fontSize: 15, lineHeight: 24 },

  claimCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 8 },
  claimHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  claimVerdict: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  claimText: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  claimReasoning: { fontSize: 13, lineHeight: 19 },

  recommendationBox: { borderRadius: 14, borderWidth: 1, padding: 16 },
  recommendationText: { fontSize: 15, fontWeight: '700', lineHeight: 22 },
});
