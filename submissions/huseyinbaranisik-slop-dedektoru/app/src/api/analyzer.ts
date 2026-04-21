// ─── Nokta · Slop Detector ────────────────────────────────────────────────────
// Gemini 1.5 Flash ile pitch metnini analiz edip JSON döner.
// Decision log: Gemini Flash tercih edildi — hız/maliyet/kalite optimumu.
// ─────────────────────────────────────────────────────────────────────────────

import { AnalysisResult } from '../types';

// 🔑 Groq API anahtarınızı buraya ya da .env'e koyun
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY ?? 'YOUR_API_KEY_HERE';

const SYSTEM_PROMPT = `
Sen Nokta platformunun Due Diligence motorusun. Görevin verilen bir startup pitch paragrafını analiz etmek.

Şunları yap:
1. Pitch içindeki somut iddiaları tespit et.
2. Her iddiayı kategorize et: GÜÇLÜ, ABARTILI veya DOĞRULANAMAZ.
3. 0–100 arası "Slop Skoru" hesapla (100 = tamamen slop).
4. Genel özet ve yatırımcıya öneri yaz.

SADECE aşağıdaki JSON formatında yanıt ver:
{
  "slopScore": <sayı>,
  "summary": "<cümle>",
  "claims": [{"text": "...", "verdict": "...", "reasoning": "..."}],
  "recommendation": "..."
}
`;

export async function analyzePitch(pitch: string): Promise<AnalysisResult> {
  // ── Mock mod: API key yoksa örnek veri döndür ──────────────────────────────
  if (GROQ_API_KEY === 'YOUR_API_KEY_HERE' || !GROQ_API_KEY) {
    return getMockResult(pitch);
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: pitch }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API Hatası: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || '{}';
  return JSON.parse(content) as AnalysisResult;
}

// ── Offline/Demo mock ────────────────────────────────────────────────────────
function getMockResult(pitch: string): AnalysisResult {
  const wordCount = pitch.split(' ').length;
  const buzzwords = ['disrupting', 'revolutionizing', 'AI-powered', 'blockchain',
    'trillion', 'milyar', 'milyon kullanıcı', 'exponential', 'next amazon'];
  const buzzCount = buzzwords.filter(w => pitch.toLowerCase().includes(w.toLowerCase())).length;
  const slopScore = Math.min(95, 30 + buzzCount * 15 + (wordCount < 30 ? 20 : 0));

  return {
    slopScore,
    summary: `Pitch ${wordCount} kelimelik ve ${buzzCount} adet jargon/abartı içeriyor.`,
    claims: [
      {
        text: '"2 yılda 10 milyon kullanıcıya ulaşacağız"',
        verdict: slopScore > 60 ? 'DOĞRULANAMAZ' : 'ABARTILI',
        reasoning: 'Pazar büyüklüğü ve büyüme hızı için kaynak veya referans sunulmuyor. Sessiz varsayımlar mevcut.',
      },
      {
        text: '"Sektördeki tek AI destekli çözüm"',
        verdict: 'ABARTILI',
        reasoning: 'Rekabet analizi eksik. Bu segment\'te onlarca rakip aktif olduğundan iddia doğrulanamıyor.',
      },
      {
        text: '"Ürün 3 ayda MVP\'ye hazır"',
        verdict: slopScore < 50 ? 'GÜÇLÜ' : 'ABARTILI',
        reasoning: 'Teknik ekip ve sprint planı gösterilirse makul; aksi hâlde iyimser bir tahmin.',
      },
    ],
    recommendation:
      slopScore > 70
        ? 'Yüksek slop riski. Pazar verileri ve teknik ayrıntılar talep edilmeden yatırım değerlendirmesi önerilmez.'
        : slopScore > 40
        ? 'Orta düzey slop. Temel iddialar doğrulanabilir hâle getirildiğinde due-diligence\'a alınabilir.'
        : 'Güçlü pitch. Hızlı değerlendirme için yeterli temel mevcut.',
  };
}
