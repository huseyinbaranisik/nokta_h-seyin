import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { usePitchAnalysis } from '../hooks/usePitchAnalysis';
import { Button } from '../components/common/Button';
import { InputField } from '../components/common/InputField';
import { ResultModal } from '../components/features/ResultModal';

const EXAMPLES = [
  'Uygulamamız yapay zeka ile 2 yılda 10 milyon kullanıcıya ulaşacak ve 500 milyon dolarlık piyasayı domine edecek. Rakip yok, pazar hazır, sadece fon lazım.',
  'Platform aylık %40 büyüyor. 3 ayda MVP hazır. Sektördeki tek blockchain destekli çözümüz. Pre-seed için 2M$ arıyoruz.',
  'B2B SaaS modeliyle kurumsal müşterilere odaklanıyoruz. İlk 6 müşterimiz var, MRR 8.500$. Yol haritamız net, ekip 4 kişi.',
];

export default function HomeScreen() {
  const { 
    pitch, 
    setPitch, 
    loading, 
    handleAnalyze,
    result,
    showResult,
    setShowResult 
  } = usePitchAnalysis();

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#0F1117', '#1A1025']} style={StyleSheet.absoluteFill} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo + Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={['#7C3AED', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoBadge}
            >
              <Text style={styles.logoText}>N</Text>
            </LinearGradient>
            <Text style={styles.appName}>Nokta</Text>
            <Text style={styles.tagline}>Due Diligence Engine</Text>
          </View>

          {/* Title */}
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Slop Dedektörü</Text>
            <Text style={styles.subtitle}>
              Pitch paragrafını yapıştır → AI pazar iddialarını test eder → Slop Skoru üretir
            </Text>
          </View>

          {/* Input Area */}
          <InputField
            placeholder="Pitch'ini buraya yapıştır..."
            value={pitch}
            onChangeText={setPitch}
            multiline
            maxLength={2000}
            charCount={pitch.length}
            maxCharCount={2000}
          />

          {/* Example Pills */}
          <Text style={styles.exampleLabel}>Örnek pitch'ler →</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.pills}
            contentContainerStyle={{ gap: 8 }}
          >
            {EXAMPLES.map((ex, i) => (
              <TouchableOpacity
                key={i}
                style={styles.pill}
                onPress={() => setPitch(ex)}
                activeOpacity={0.7}
              >
                <Text style={styles.pillText} numberOfLines={2}>
                  {ex.slice(0, 70)}…
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Analyze Button */}
          <Button
            text="⚡  Analiz Et"
            onPress={handleAnalyze}
            loading={loading}
          />

          {/* Info Footer */}
          <Text style={styles.footer}>
            AI Powered by Groq (Llama 3.1) · Anti-Slop 🛡️
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Result Popup */}
      <ResultModal
        visible={showResult}
        result={result}
        pitch={pitch}
        onClose={() => setShowResult(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 10 },

  header: { alignItems: 'center', marginBottom: 24 },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#7C3AED',
    shadowRadius: 12,
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 4 },
  },
  logoText: { fontSize: 26, fontWeight: '900', color: '#fff' },
  appName: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  tagline: { fontSize: 12, color: colors.textMuted, letterSpacing: 1.5, marginTop: 2 },

  titleBlock: { marginBottom: 20 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginTop: 6,
  },

  exampleLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  pills: { marginBottom: 24 },
  pill: {
    backgroundColor: 'rgba(124,58,237,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.25)',
    borderRadius: 12,
    padding: 10,
    width: 200,
  },
  pillText: { color: colors.textMuted, fontSize: 12, lineHeight: 16 },

  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textDim,
    marginTop: 20,
    letterSpacing: 0.3,
  },
});
