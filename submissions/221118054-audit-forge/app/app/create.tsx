// app/create.tsx — CreateIdeaScreen
// Yeni fikir ekleme formu (mock — backend yok).

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function CreateIdeaScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');

  const isValid = title.trim().length > 0 && summary.trim().length > 0;

  const handleSubmit = () => {
    if (!title.trim() || !summary.trim()) {
      Alert.alert('Eksik alan', 'Başlık ve özet zorunludur.');
      return;
    }
    Alert.alert('Kaydedildi', 'Fikrin taslak olarak eklendi.', [
      { text: 'Tamam', onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>BAŞLIK</Text>
      <TextInput
        style={styles.input}
        placeholder="Fikrini bir cümlede özetle"
        placeholderTextColor="#484f58"
        value={title}
        onChangeText={setTitle}
        maxLength={80}
      />

      <Text style={styles.label}>ÖZET</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Problemi, hedef kullanıcıyı ve çözümü kısaca anlat"
        placeholderTextColor="#484f58"
        value={summary}
        onChangeText={setSummary}
        multiline
        textAlignVertical="top"
        maxLength={400}
      />
      <Text style={styles.charCount}>{summary.length}/400</Text>

      <TouchableOpacity
        style={[styles.submitBtn, { opacity: isValid ? 1 : 0.5 }]}
        onPress={handleSubmit}
        disabled={!isValid}
      >
        <Text style={styles.submitBtnText}>Kaydet</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelBtn}
        onPress={() => router.back()}
      >
        <Text style={styles.cancelBtnText}>Vazgeç</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1117' },
  content: { padding: 20, paddingBottom: 40 },
  label: {
    color: '#484f58',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#161b22',
    borderRadius: 10,
    padding: 14,
    color: '#f0f6fc',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  textArea: {
    backgroundColor: '#161b22',
    borderRadius: 10,
    padding: 14,
    color: '#f0f6fc',
    fontSize: 15,
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  charCount: {
    color: '#484f58',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 6,
  },
  submitBtn: {
    backgroundColor: '#238636',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  cancelBtn: { alignItems: 'center', paddingVertical: 14, marginTop: 4 },
  cancelBtnText: { color: '#58a6ff', fontSize: 14 },
});
