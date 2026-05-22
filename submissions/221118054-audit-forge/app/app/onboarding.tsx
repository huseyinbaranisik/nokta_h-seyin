// app/onboarding.tsx — OnboardingScreen
// İlk açılış tanıtım ekranı.

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';

const STEPS = [
  {
    emoji: '💡',
    title: 'Fikrini Yakala',
    body: 'Aklına gelen her fikri saniyeler içinde kaydet, sonra olgunlaştır.',
  },
  {
    emoji: '🗳️',
    title: 'Topluluk Oylasın',
    body: 'Diğer kullanıcılar fikirlerine oy versin, en güçlüleri öne çıksın.',
  },
  {
    emoji: '🚀',
    title: 'Hayata Geçir',
    body: 'Olgunlaşan fikirleri spec haline getir, takımınla paylaş.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  const handleNext = () => {
    if (isLast) {
      router.replace('/');
    } else {
      setStep(step + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.emoji}>{current.emoji}</Text>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.body}>{current.body}</Text>
      </View>

      {/* BUG-4: ilerleme noktaları (dots) yanlış hizalanmış —
          alignItems eksik, noktalar sola yapışık görünüyor.
          Ortada olmalılar. Forge cycle 4 (ROLLBACK senaryosu)
          bunu deneyecek. */}
      <View style={styles.dots}>
        {STEPS.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === step && styles.dotActive]}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
        <Text style={styles.nextBtnText}>
          {isLast ? 'Başla' : 'Devam'}
        </Text>
      </TouchableOpacity>

      {!isLast && (
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.skipBtnText}>Atla</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
    padding: 24,
    justifyContent: 'center',
  },
  hero: { alignItems: 'center', marginBottom: 48 },
  emoji: { fontSize: 72, marginBottom: 24 },
  title: {
    color: '#f0f6fc',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  body: {
    color: '#8b949e',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 300,
  },
  // BUG-4 burada: dots container'da alignItems / justifyContent yok.
  dots: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#30363d',
    marginHorizontal: 4,
  },
  dotActive: { backgroundColor: '#1f6feb', width: 24 },
  nextBtn: {
    backgroundColor: '#238636',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  nextBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  skipBtn: { alignItems: 'center', paddingVertical: 14, marginTop: 4 },
  skipBtnText: { color: '#58a6ff', fontSize: 14 },
});
