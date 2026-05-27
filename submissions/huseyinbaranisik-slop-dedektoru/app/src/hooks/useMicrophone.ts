import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

// Singleton kayıt referansı — "only one recorder" hatasını önler
let globalRecording: Audio.Recording | null = null;

const RECORDING_OPTIONS = {
  isMeteringEnabled: true,
  android: {
    extension: '.m4a',
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {},
};

export function useMicrophone() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Unmount olduğunda açık kaydı temizle
  useEffect(() => {
    return () => {
      if (globalRecording) {
        globalRecording.stopAndUnloadAsync().catch(() => {});
        globalRecording = null;
      }
    };
  }, []);

  async function startRecording() {
    try {
      // Önceki kaydı zorla kapat — "only one recorder" hatasını önler
      if (globalRecording) {
        try {
          await globalRecording.stopAndUnloadAsync();
        } catch (_) {}
        globalRecording = null;
      }

      // İzin al
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Mikrofon izni gerekli!');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(RECORDING_OPTIONS);

      // Doğru API — setProgressUpdateInterval (async değil, sync)
      newRecording.setProgressUpdateInterval(100);

      newRecording.setOnRecordingStatusUpdate((status) => {
        if (status.isRecording && status.metering !== undefined) {
          const db = status.metering;
          const MIN_DB = -60;
          const level = db > MIN_DB ? (db - MIN_DB) / Math.abs(MIN_DB) : 0;
          setAudioLevel(Math.min(1, Math.max(0, level)));
        } else if (!status.isRecording) {
          setAudioLevel(0);
        }
      });

      globalRecording = newRecording;
      setIsRecording(true);
    } catch (err) {
      console.error('Kayıt başlatma hatası:', err);
      alert('Kayıt başlatılamadı: ' + (err as Error).message);
    }
  }

  async function stopRecording(): Promise<string | null> {
    if (!globalRecording) return null;

    const recRef = globalRecording;
    globalRecording = null;
    setIsRecording(false);
    setAudioLevel(0);

    try {
      await recRef.stopAndUnloadAsync();
      const uri = recRef.getURI();
      setAudioUri(uri ?? null);
      return uri ?? null;
    } catch (err) {
      console.error('Kayıt durdurma hatası:', err);
      return null;
    }
  }

  return {
    isRecording,
    audioUri,
    audioLevel,
    startRecording,
    stopRecording,
  };
}
