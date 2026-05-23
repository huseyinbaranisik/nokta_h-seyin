// app/about.tsx — AboutScreen
// Uygulama hakkında bilgi ekranı.

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.logo}>·</Text>
      <Text style={styles.appName}>Nokta Audit-Forge</Text>
      <Text style={styles.version}>Sürüm 1.0.0</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nedir?</Text>
        <Text style={styles.text}>
          Bu uygulama, nokta-audit drop-in bug raporlama widget'ının host
          uygulamaya nasıl gömüldüğünü ve ürettiği raporların forge döngüsünde
          nasıl tüketildiğini gösteren bir referans entegrasyonudur.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Audit Widget</Text>
        <Text style={styles.text}>
          Sağ alttaki 🐛 butonuna dokun: ekranı yakala, sorunlu alanı sarı
          kutuyla işaretle, not düş. Çift dokunuş not listesini açar; oradan
          Markdown veya Word raporu dışa aktarabilirsin.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Drop-in disiplini</Text>
        <Text style={styles.text}>
          Widget host uygulamanın geri kalanına sızmaz. Tek mount satırı kök
          ağaçta yaşar; kaldırıldığında uygulama bozulmadan çalışmaya devam
          eder.
        </Text>
      </View>

      <Text style={styles.footer}>
        Track A — Sadelik · No backend · MIT
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1117' },
  content: { padding: 24, alignItems: 'center' },
  logo: {
    color: '#1f6feb',
    fontSize: 64,
    fontWeight: '900',
    lineHeight: 64,
  },
  appName: {
    color: '#f0f6fc',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 8,
  },
  version: { color: '#484f58', fontSize: 13, marginTop: 4, marginBottom: 24 },
  section: {
    backgroundColor: '#161b22',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#30363d',
    width: '100%',
  },
  sectionTitle: {
    color: '#f0f6fc',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  text: { color: '#8b949e', fontSize: 14, lineHeight: 21 },
  footer: {
    color: '#484f58',
    fontSize: 12,
    marginTop: 16,
    textAlign: 'center',
  },
});
