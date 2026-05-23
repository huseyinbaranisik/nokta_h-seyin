// app/_layout.tsx
// Kök ağaç. AuditWidget burada TEK SATIR ile mount edilir.
//
// Track A drop-in disiplini:
//   grep -r 'AuditWidget' app/  →  yalnızca bu dosyada tek mount döner.
//   Bu mount satırı silinirse uygulama bozulmadan çalışmaya devam eder.

import React from 'react';
import { Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuditWidget } from '@xtatistix/mobile-audit';
import { buildAuditDeps } from '../src/audit/auditDeps';

/** Expo Router segment'lerini okunabilir ekran adına çevirir. */
function useCurrentScreen(): string {
  const segments = useSegments();
  const last = segments[segments.length - 1];
  const map: Record<string, string> = {
    index: 'IdeaListScreen',
    detail: 'IdeaDetailScreen',
    create: 'CreateIdeaScreen',
    onboarding: 'OnboardingScreen',
    about: 'AboutScreen',
  };
  return map[last] ?? 'IdeaListScreen';
}

export default function RootLayout() {
  const currentScreen = useCurrentScreen();

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0d1117' },
          headerTintColor: '#f0f6fc',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#0d1117' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Nokta · Fikirler' }} />
        <Stack.Screen name="detail" options={{ title: 'Fikir Detayı' }} />
        <Stack.Screen name="create" options={{ title: 'Yeni Fikir' }} />
        <Stack.Screen name="onboarding" options={{ title: 'Hoş Geldin' }} />
        <Stack.Screen name="about" options={{ title: 'Hakkında' }} />
      </Stack>

      {/* ── nokta-audit drop-in mount — host boundary'nin tek değdiği nokta ── */}
      <AuditWidget
        appName="Nokta Audit-Forge"
        deps={buildAuditDeps(currentScreen)}
        initialPosition={{ bottom: 110, right: 16 }}
      />
    </>
  );
}
