// src/audit/auditDeps.ts
// Host application boundary'nin somut sözleşmesi.
// Tüm native yetenekler burada toplanır — widget bunları
// kendi içinde import ETMEZ, host olarak biz sağlarız.
//
// Track A disiplini: bu dosya + auditStorage.ts + tek mount satırı
// = widget'ın host'a değdiği TÜM yüzey. Kaldırıldığında app çalışır.

import React from 'react';
import { Text } from 'react-native';
import { captureScreen, captureRef } from 'react-native-view-shot';
// SDK 54: yeni File API deprecated uyarısı veriyor — legacy API stabil.
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import type { AuditWidgetDeps } from '@xtatistix/mobile-audit';
import { auditStorage } from './auditStorage';

/**
 * currentScreen host router'dan dinamik beslenir.
 * AuditWidget mount edilirken aktif route adı parametre olarak geçilir.
 */
export function buildAuditDeps(currentScreen: string): AuditWidgetDeps {
  return {
    captureScreen: () =>
      captureScreen({ format: 'png', result: 'tmpfile' }),

    captureRef: (ref) =>
      captureRef(ref, { format: 'png', result: 'tmpfile' }),

    writeFile: async (filename: string, content: string) => {
      const uri = FileSystem.documentDirectory + filename;
      await FileSystem.writeAsStringAsync(uri, content);
      return uri;
    },

    writeFileBinary: async (filename: string, base64: string) => {
      const uri = FileSystem.documentDirectory + filename;
      await FileSystem.writeAsStringAsync(uri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return uri;
    },

    shareFile: (uri: string) => Sharing.shareAsync(uri),

    storage: auditStorage,

    currentScreen,

    reporterId: 'qa-221118054',

    BugIcon: React.createElement(Text, { style: { fontSize: 22 } }, '🐛'),
  };
}