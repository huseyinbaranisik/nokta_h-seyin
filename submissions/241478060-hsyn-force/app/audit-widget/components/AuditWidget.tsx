import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { NoteManager } from '../core/storage';
import { buildMarkdown } from '../export/markdown';
import type { AuditNote, AuditStorage } from '../core/types';
import { Bug, Share2 } from 'lucide-react-native';

export interface AuditWidgetDeps {
  captureScreen: () => Promise<string>;
  captureRef: (ref: React.RefObject<any>) => Promise<string>;
  writeFile: (filename: string, content: string) => Promise<string>;
  writeFileBinary: (filename: string, base64: string) => Promise<string>;
  shareFile: (uri: string) => Promise<void>;
  storage: AuditStorage;
  currentScreen: string;
  reporterId?: string;
  BugIcon: React.ReactNode;
}

interface Props {
  deps: AuditWidgetDeps;
  appName?: string;
}

const BUTTON_SIZE = 64;

export function AuditWidget({ deps, appName = 'App' }: Props) {
  const [isExporting, setIsExporting] = useState(false);
  const manager = useRef(new NoteManager(deps.storage)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handlePress = async () => {
    console.log('[AuditWidget] Button pressed');
    animatePress();
    try {
      const uri = await deps.captureScreen();
      console.log('[AuditWidget] Screen captured:', uri);
      await manager.add({
        screenName: deps.currentScreen,
        screenshot: uri,
        note: 'Bug reported via Quick Action',
        highlightBounds: null,
        reporterId: deps.reporterId,
      });
      // @ts-ignore
      import('react-native').then(({ Alert }) => {
        Alert.alert('Başarılı', 'Bug raporu başarıyla kaydedildi! Paylaşmak için butona uzun basın.');
      });
    } catch (e) {
      console.error('[AuditWidget] Error:', e);
      // @ts-ignore
      import('react-native').then(({ Alert }) => {
        Alert.alert('Hata', 'Rapor kaydedilirken bir sorun oluştu.');
      });
    }
  };

  const handleLongPress = async () => {
    console.log('[AuditWidget] Long press detected - Exporting...');
    setIsExporting(true);
    try {
      const all = await manager.getAll();
      if (all.length === 0) {
        // @ts-ignore
        import('react-native').then(({ Alert }) => {
          Alert.alert('Bilgi', 'Henüz kaydedilmiş bir rapor bulunmuyor.');
        });
        return;
      }
      const md = buildMarkdown(all, { appName, exportedAt: new Date().toISOString(), totalNotes: all.length });
      const fileUri = await deps.writeFile(`audit-${Date.now()}.md`, md);
      await deps.shareFile(fileUri);
    } catch (e) {
      console.error('[AuditWidget] Export Error:', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.fab}
          onPress={handlePress}
          onLongPress={handleLongPress}
          activeOpacity={0.8}
        >
          {isExporting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            deps.BugIcon || <Bug color="#fff" size={28} />
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 24,
    zIndex: 9999,
  },
  fab: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#6366f1', // Indigo modern
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
});
