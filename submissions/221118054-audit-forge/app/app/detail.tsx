// app/detail.tsx — IdeaDetailScreen
// Tek bir fikrin detay görünümü.

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getIdeaById, Idea } from '../src/data/ideas';

const STATUS_LABEL: Record<Idea['status'], string> = {
  taslak: 'Taslak',
  olgun: 'Olgun',
  arşiv: 'Arşiv',
};

export default function IdeaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const idea = getIdeaById(id ?? '');

  if (!idea) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Fikir bulunamadı.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>← Listeye dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const created = new Date(idea.createdAt).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{idea.title}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaItem}>Track {idea.track}</Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.metaItem}>{STATUS_LABEL[idea.status]}</Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.metaItem}>{idea.votes} oy</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>ÖZET</Text>
        <Text style={styles.summary}>{idea.summary}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>OLUŞTURULMA</Text>
        <Text style={styles.dateText}>{created}</Text>
      </View>

      <TouchableOpacity
        style={styles.voteBtn}
        onPress={() => {
          /* mock — oylama backend yok */
        }}
      >
        <Text style={styles.voteBtnText}>👍 Bu fikre oy ver</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backBtnText}>← Listeye dön</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1117' },
  content: { padding: 20, paddingBottom: 40 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d1117',
  },
  notFound: { color: '#8b949e', fontSize: 16, marginBottom: 16 },
  backLink: { color: '#58a6ff', fontSize: 15 },
  title: { color: '#f0f6fc', fontSize: 24, fontWeight: '800', marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  metaItem: { color: '#58a6ff', fontSize: 13, fontWeight: '600' },
  metaDot: { color: '#484f58', fontSize: 13, marginHorizontal: 8 },
  section: { marginBottom: 20 },
  sectionLabel: {
    color: '#484f58',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  summary: {
    color: '#c9d1d9',
    fontSize: 15,
    lineHeight: 23,
    backgroundColor: '#161b22',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  dateText: { color: '#c9d1d9', fontSize: 15 },
  voteBtn: {
    backgroundColor: '#1f6feb',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  voteBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  backBtn: { alignItems: 'center', paddingVertical: 14, marginTop: 4 },
  backBtnText: { color: '#58a6ff', fontSize: 14 },
});
