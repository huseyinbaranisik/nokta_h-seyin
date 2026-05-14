import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { NoteManager } from '../core/storage';
import { buildMarkdown } from '../export/markdown';
import type { AuditNote, AuditStorage } from '../core/types';

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
  initialPosition?: { bottom: number; right: number };
}

const BUTTON_SIZE = 56;

export function AuditWidget({ deps, appName = 'App' }: Props) {
  const [isExporting, setIsExporting] = useState(false);
  const manager = useRef(new NoteManager(deps.storage)).current;

  const handlePress = async () => {
    console.log('[AuditWidget] Action triggered');
    try {
      const uri = await deps.captureScreen();
      await manager.add({
        screenName: deps.currentScreen,
        screenshot: uri,
        note: 'Yeni bug raporu',
        highlightBounds: null,
        reporterId: deps.reporterId,
      });
      alert('Ekran yakalandı ve rapora eklendi!');
    } catch (e) {
      console.error(e);
    }
  };

  const handleLongPress = async () => {
    setIsExporting(true);
    try {
      const all = await manager.getAll();
      if (all.length === 0) {
        alert('Henüz raporlanmış bir bug yok.');
        return;
      }
      const md = buildMarkdown(all, { appName, exportedAt: new Date().toISOString(), totalNotes: all.length });
      const fileUri = await deps.writeFile(`audit-${Date.now()}.md`, md);
      await deps.shareFile(fileUri);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      <TouchableOpacity
        style={styles.fab}
        onPress={handlePress}
        onLongPress={handleLongPress}
        activeOpacity={0.7}
      >
        {deps.BugIcon}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
    zIndex: 9999,
  },
  fab: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#FF5A5F',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
