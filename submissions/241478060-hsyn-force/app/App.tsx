import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Animated,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { captureScreen, captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, Zap, Sparkles } from 'lucide-react-native';

import { AuditWidget, AuditStorage, AuditNote } from './audit-widget';

// @ts-ignore
const { documentDirectory, writeAsStringAsync, EncodingType } = FileSystem;

const STORAGE_KEY = 'audit_notes';
const { width } = Dimensions.get('window');

const auditStorage: AuditStorage = {
  async loadNotes(): Promise<AuditNote[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },
  async saveNotes(notes: AuditNote[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  },
};

export default function App() {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Premium Fade-in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // The Sentient Dot Pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#0f172a']}
        style={StyleSheet.absoluteFill}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <View style={styles.badge}>
                <Sparkles size={14} color="#818cf8" />
                <Text style={styles.badgeText}>B TRACK: CREATIVITY</Text>
              </View>
              <Text style={styles.title}>Nokta Forge</Text>
              <Text style={styles.idText}>241478060 — hsyn-force</Text>
            </View>

            <View style={styles.heroSection}>
              <LinearGradient
                colors={['rgba(99, 102, 241, 0.1)', 'rgba(99, 102, 241, 0.05)']}
                style={styles.dotOuterRing}
              >
                <View style={styles.dotInnerRing}>
                  <Animated.View style={[styles.dot, { transform: [{ scale: pulseAnim }] }]}>
                    <LinearGradient
                      colors={['#818cf8', '#6366f1']}
                      style={StyleSheet.absoluteFill}
                    />
                  </Animated.View>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <Zap size={24} color="#6366f1" style={styles.cardIcon} />
                <Text style={styles.cardTitle}>Duyarlı Nokta</Text>
                <Text style={styles.cardDesc}>
                  Kaydedilmemiş bir fikir olduğunda nokta hafifçe "pulse" animasyonu ile sizi uyarır.
                </Text>
              </View>

              <View style={styles.card}>
                <Shield size={24} color="#6366f1" style={styles.cardIcon} />
                <Text style={styles.cardTitle}>Otonom Forge</Text>
                <Text style={styles.cardDesc}>
                  Geri bildirimleriniz anında analiz edilir ve otonom döngülerle koda dönüştürülür.
                </Text>
              </View>
            </View>

            <View style={styles.footerInfo}>
              <Text style={styles.infoText}>
                Hızlı raporlama için sağ alttaki butona dokunun.{"\n"}
                Raporları dışa aktarmak için butona uzun basın.
              </Text>
            </View>
            
            <View style={{ height: 100 }} />
          </ScrollView>
        </Animated.View>
      </SafeAreaView>

      <AuditWidget
        appName="Nokta Premium"
        deps={{
          captureScreen: () => captureScreen({ format: 'png', result: 'tmpfile' }),
          captureRef: (ref) => captureRef(ref, { format: 'png', result: 'tmpfile' }),
          writeFile: async (filename, content) => {
            const uri = (documentDirectory || '') + filename;
            await writeAsStringAsync(uri, content);
            return uri;
          },
          writeFileBinary: async (filename, base64) => {
            const uri = (documentDirectory || '') + filename;
            await writeAsStringAsync(uri, base64, { encoding: EncodingType?.Base64 });
            return uri;
          },
          shareFile: (uri) => Sharing.shareAsync(uri),
          storage: auditStorage,
          currentScreen: 'PremiumDashboard',
          BugIcon: <BugIcon />,
        }}
      />
    </View>
  );
}

const BugIcon = () => (
  <View style={styles.bugIconContainer}>
    <Shield color="#fff" size={24} />
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(129, 140, 248, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.3)',
  },
  badgeText: {
    color: '#818cf8',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
    letterSpacing: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#f8fafc',
    letterSpacing: -1,
  },
  idText: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 4,
    fontWeight: '500',
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  dotOuterRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotInnerRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  cardContainer: {
    gap: 16,
    marginTop: 24,
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardIcon: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 15,
    color: '#94a3b8',
    lineHeight: 22,
  },
  footerInfo: {
    marginTop: 40,
    alignItems: 'center',
  },
  infoText: {
    color: '#64748b',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 20,
  },
  bugIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
