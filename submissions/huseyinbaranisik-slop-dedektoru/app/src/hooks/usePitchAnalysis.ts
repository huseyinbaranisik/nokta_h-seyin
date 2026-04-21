import { useState } from 'react';
import { analyzePitch } from '../api/analyzer';
import { AnalysisResult } from '../types';

export function usePitchAnalysis() {
  const [pitch, setPitch] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnalyze = async () => {
    if (pitch.trim().length < 20) {
      alert('Lütfen en az 20 karakterlik bir pitch metni gir.');
      return;
    }
    
    setLoading(true);
    try {
      const res = await analyzePitch(pitch.trim());
      setResult(res);
      setShowResult(true);
    } catch (e) {
      console.error('Analiz hatası:', e);
      alert(`Analiz sırasında bir sorun oluştu: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    pitch,
    setPitch,
    loading,
    result,
    showResult,
    setShowResult,
    handleAnalyze,
  };
}
