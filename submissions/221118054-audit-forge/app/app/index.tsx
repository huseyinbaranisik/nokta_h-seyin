// app/index.tsx — IdeaListScreen
// Mini nokta klonunun ana ekranı: fikir listesi.

import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { IDEAS, Idea } from '../src/data/ideas';

const STATUS_LABEL: Record<Idea['status'], string> = {
  taslak: 'Taslak',
  olgun: 'Olgun',
  arşiv: 'Arşiv',
};

const STATUS_COLOR: Record<Idea['status'], string> = {
  taslak: '#d29922',
  olgun: '#3fb950',
  arşiv: '#8b949e',
};

export default function IdeaListScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: Idea }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/detail?id=${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View
          style={[styles.badge, { backgroundColor: STATUS_COLOR[item.status] }]}
        >
          <Text style={styles.badgeText}>{STATUS_LABEL[item.status]}</Text>
        </View>
      </View>
      <Text style={styles.cardSummary} numberOfLines={2}>
        {item.summary}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={styles.trackTag}>Track {item.track}</Text>
        <Text style={styles.votes}>{item.votes} oy</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createBtn}
        onPress={() => router.push('/create')}
      >
        <Text style={styles.createBtnText}>+ Yeni Fikir Ekle</Text>
      </TouchableOpacity>

      <FlatList
        data={IDEAS}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.aboutLink}
        onPress={() => router.push('/about')}
      >
        <Text style={styles.aboutLinkText}>Uygulama hakkında →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1117', padding: 16 },
  createBtn: {
    backgroundColor: '#238636',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  createBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  list: { paddingBottom: 24 },
  card: {
    backgroundColor: '#161b22',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    color: '#f0f6fc',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { color: '#0d1117', fontSize: 11, fontWeight: '700' },
  cardSummary: { color: '#8b949e', fontSize: 13, lineHeight: 19 },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  trackTag: { color: '#58a6ff', fontSize: 12, fontWeight: '600' },
  votes: { color: '#8b949e', fontSize: 13 },
  aboutLink: { alignItems: 'center', paddingVertical: 12 },
  aboutLinkText: { color: '#58a6ff', fontSize: 13 },
});
