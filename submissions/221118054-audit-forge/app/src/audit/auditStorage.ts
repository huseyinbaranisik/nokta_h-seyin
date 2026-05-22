// src/audit/auditStorage.ts
// AuditStorage interface'inin AsyncStorage implementasyonu.
// README § Kullanım > Storage adaptörü ile birebir uyumlu.
//
// Bu dosya "host application boundary" sınırının host tarafındaki
// somut karşılığıdır — widget storage'ın nerede olduğunu bilmez.

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuditStorage, AuditNote } from '@xtatistix/mobile-audit';

const STORAGE_KEY = 'nokta_audit_notes';

export const auditStorage: AuditStorage = {
  async loadNotes(): Promise<AuditNote[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuditNote[]) : [];
  },
  async saveNotes(notes: AuditNote[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  },
};
