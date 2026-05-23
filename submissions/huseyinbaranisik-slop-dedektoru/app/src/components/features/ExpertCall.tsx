import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getColors } from '../../theme/colors';
import { saveToBridgeMD } from '../../utils/fileManager';

interface ExpertCallProps {
  roomName: string;
  onClose: () => void;
}

export const ExpertCall: React.FC<ExpertCallProps> = ({ roomName, onClose }) => {
  const { themeMode, accentColor } = useTheme();
  const colors = getColors(themeMode, accentColor);
  const [isSaving, setIsSaving] = useState(false);
  
  const jitsiUrl = `https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false&config.disableDeepLinking=true`;

  const handleClose = async () => {
    setIsSaving(true);
    try {
      const simulatedSummary = "Uzman ile görüşüldü. Pitch metnindeki abartılı ifadeler (slop) tespit edildi ve kullanıcının daha somut veri sunması (örn: kullanıcı test sonuçları, ilk faturalar) gerektiğine karar verildi. Forge süreci bu bilgiler ışığında devam edecek.";
      await saveToBridgeMD(simulatedSummary);
    } catch (e) {
      console.error("BRIDGE.md kaydedilemedi", e);
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { backgroundColor: colors.bgCard, borderBottomColor: colors.bgCardBorder }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Uzmana Bağlanıldı</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={handleClose} disabled={isSaving}>
          {isSaving ? (
             <ActivityIndicator size="small" color={colors.textPrimary} />
          ) : (
             <Ionicons name="close" size={24} color={colors.textPrimary} />
          )}
        </TouchableOpacity>
      </View>
      <WebView
        source={{ uri: jitsiUrl }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 8,
  },
  webview: {
    flex: 1,
  },
});
