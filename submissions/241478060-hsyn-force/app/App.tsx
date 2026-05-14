import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Animated, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { captureScreen, captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuditWidget, AuditStorage, AuditNote } from './audit-widget';

const STORAGE_KEY = 'audit_notes';

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

  useEffect(() => {
    // Cycle #1: Pulse animation logic
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Nokta Forge</Text>
          <Text style={styles.subtitle}>241478060 — hsyn-force</Text>
          
          <View style={styles.dotContainer}>
            <Animated.View style={[styles.dot, { transform: [{ scale: pulseAnim }] }]} />
          </View>
          
          <Text style={styles.info}>
            Bug raporu için kırmızı butona dokunun.{"\n"}
            Markdown export için butona uzun basın.
          </Text>
          
          {/* Mock content to trigger ScrollView */}
          <View style={{ height: 200 }} />
          <Text style={styles.info}>
            [FORGE] Cycle #4: ScrollView entegrasyonu başarılı.
          </Text>
        </View>
      </ScrollView>

      <AuditWidget
        appName="Nokta-Hsyn"
        deps={{
          captureScreen: () => captureScreen({ format: 'png', result: 'tmpfile' }),
          captureRef: (ref) => captureRef(ref, { format: 'png', result: 'tmpfile' }),
          writeFile: async (filename, content) => {
            const uri = FileSystem.documentDirectory + filename;
            await FileSystem.writeAsStringAsync(uri, content);
            return uri;
          },
          writeFileBinary: async (filename, base64) => {
            const uri = FileSystem.documentDirectory + filename;
            await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
            return uri;
          },
          shareFile: (uri) => Sharing.shareAsync(uri),
          storage: auditStorage,
          currentScreen: 'HomeScreen',
          BugIcon: <Text style={{ fontSize: 24 }}>🐛</Text>,
        }}
      />
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  dotContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF5A5F',
  },
  info: {
    textAlign: 'center',
    color: '#999',
    lineHeight: 24,
  },
});
