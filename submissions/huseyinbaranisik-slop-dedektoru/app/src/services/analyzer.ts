// ─── Nokta · Slop Detector ────────────────────────────────────────────────────
// Gemini 1.5 Flash ile pitch metnini analiz edip JSON döner.
// Decision log: Gemini Flash tercih edildi — hız/maliyet/kalite optimumu.
// ─────────────────────────────────────────────────────────────────────────────

import { GoogleGenerativeAI } from '@google/generative-ai';

// 🔑  Kendi API anahtarınızı buraya ya da .env'e koyun
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? 'YOUR_API_KEY_HERE';

export interface Claim {
  text: string;
  verdict: 'GÜÇLÜ' | 'ABARTILI' | 'DOĞRULANAMAZ';
  reasoning: string;
}

export interface AnalysisResult {
  slopScore: number;       // 0–100  (100 = tamamen slop)
  summary: string;         // 1 cümlelik genel değerlendirme
  claims: Claim[];         // tespit edilen iddialar
  recommendation: string;  // yatırımcıya öneri
}

const SYSTEM_PROMPT = `
Sen Nokta platformunun Due Diligence motorusun. Görevin verilen bir startup pitch paragrafını analiz etmek.

Şunları yap:
1. Pitch içindeki somut iddiaları (pazar büyüklüğü, büyüme oranı, kullanıcı sayısı, rekabet avantajı, gelir iddiası vb.) tespit et.
2. Her iddiayı üç kategoriden birine koy:
   - GÜÇLÜ: Makul, temellendirilebilir, sektör gerçeğiyle uyumlu
   - ABARTILI: Gerçek ama fazla şişirilmiş veya bağlamdan kopuk
   - DOĞRULANAMAZ: Kanıtsız, uçuk, halüsinasyon riski taşıyan
3. 0–100 arası "Slop Skoru" hesapla (100 = tamamen slop, 0 = neredeyse sıfır slop).
4. Genel özet ve yatırımcıya öneri yaz.

SADECE aşağıdaki JSON formatında yanıt ver, markdown ya da açıklama ekleme:
{
  "slopScore": <sayı 0-100>,
  "summary": "<tek cümle>",
  "claims": [
    {
      "text": "<iddianın kısa özeti>",
      "verdict": "GÜÇLÜ" | "ABARTILI" | "DOĞRULANAMAZ",
      "reasoning": "<1-2 cümle gerekçe>"
    }
  ],
  "recommendation": "<yatırımcıya öneri>"
}
`;

export async function analyzePitch(pitch: string): Promise<AnalysisResult> {
  // ── Mock mod: API key yoksa örnek veri döndür ──────────────────────────────
  if (GEMINI_API_KEY === 'YOUR_API_KEY_HERE' || !GEMINI_API_KEY) {
    return getMockResult(pitch);
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `${SYSTEM_PROMPT}\n\nPitch:\n${pitch}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // JSON bloğunu temizle (model bazen ```json ``` koyabilir)
  const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  return JSON.parse(jsonStr) as AnalysisResult;
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
