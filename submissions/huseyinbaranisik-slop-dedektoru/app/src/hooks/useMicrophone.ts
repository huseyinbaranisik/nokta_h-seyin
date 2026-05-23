import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

export function useMicrophone() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync().catch(err => console.error('Cleanup error', err));
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recording]);

  async function startRecording() {
    try {
      const permission = await Audio.getPermissionsAsync();
      if (permission.status !== 'granted') {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          alert('Mikrofon izni gerekli!');
          return;
        }
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

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

      const { recording: newRecording } = await Audio.Recording.createAsync(
        RECORDING_OPTIONS
      );
      
      newRecording.setOnRecordingStatusUpdate((status) => {
        if (status.isRecording && status.metering !== undefined) {
          // Normalize metering value from dB (typically -160 to 0) to a 0-1 scale.
          const db = status.metering;
          const MIN_DB = -60;
          let level = 0;
          if (db > MIN_DB) {
            level = (db - MIN_DB) / Math.abs(MIN_DB);
          }
          setAudioLevel(Math.min(1, Math.max(0, level)));
        } else if (!status.isRecording) {
            setAudioLevel(0);
        }
      });
      
      setRecording(newRecording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      alert('Kayıt başlatılamadı.');
    }
  }

  async function stopRecording() {
    if (!recording) return null;

    try {
      setIsRecording(false);
      setAudioLevel(0);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setAudioUri(uri);
      setRecording(null);
      return uri;
    } catch (err) {
      console.error('Failed to stop recording', err);
      setIsRecording(false);
      setAudioLevel(0);
      setRecording(null);
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
