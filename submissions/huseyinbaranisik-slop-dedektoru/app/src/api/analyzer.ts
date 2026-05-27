import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisResult } from '../types';

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY ?? '';
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';

// Sadece geçerli bir Gemini anahtarı varsa genAI başlat
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

const SYSTEM_PROMPT = `
Sen Nokta platformunun Kıdemli Due Diligence motorusun. Görevin verilen bir startup pitch içeriğini (metin veya döküman) analiz etmek.

Analiz sırasında şunlara odaklan:
1. Pitch içindeki somut iddiaları (pazar payı, büyüme hızı, teknik özellik vb.) tespit et.
2. Her iddiayı kategorize et: GÜÇLÜ (kanıtlanabilir), ABARTILI (desteklenmemiş) veya DOĞRULANAMAZ (gerçek dışı veya spekülatif).
3. 0–100 arası bir "Slop Skoru" (gereksiz laf kalabalığı ve abartı oranı) hesapla. (100 = tamamen içi boş/abartı).
4. "summary" (Özet) kısmını düz bir sayısal rapor gibi değil, daha yorumsal ve eleştirel yaz. Örneğin: "Bu fikir şu bakımdan güçlü, pazar potansiyeli iyi anlatılmış ancak şurada böyle bir hatanız/abartınız var..." tarzında, doğrudan girişimciye veya yatırımcıya net, yapıcı bir geri bildirim ver.
5. "recommendation" (Öneri) kısmında yatırımcı gözüyle ne yapılması gerektiğini çok net söyle.

SADECE aşağıdaki JSON formatında yanıt ver. Başka hiçbir açıklama, markdown bloğu ekleme! Sadece ham JSON nesnesi döndür.
{
  "slopScore": 0,
  "summary": "Türkçe özet",
  "claims": [{"text": "iddia metni", "verdict": "GÜÇLÜ", "reasoning": "neden bu sonuç verildi?"}],
  "recommendation": "yatırımcıya net öneri"
}
`;

export async function analyzePitch(pitch: string): Promise<AnalysisResult> {
  if (!GROQ_API_KEY && !GEMINI_API_KEY) {
    return getMockResult(pitch);
  }

  // Gemini daha iyi sonuç verdiği için varsa önce onu dene (özellikle PDF desteği için)
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      const result = await model.generateContent([SYSTEM_PROMPT, pitch]);
      const response = await result.response;
      const text = response.text();
      const cleanedJson = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanedJson) as AnalysisResult;
    } catch (error) {
      console.error("Gemini hatası, Groq deneniyor veya fallback kullanılıyor:", error);
    }
  }
  
  if (GROQ_API_KEY) {
    try {
      return await analyzeWithGroq(pitch);
    } catch (error) {
      console.error("Groq hatası:", error);
    }
  }
  
  return getMockResult(pitch);
}

async function analyzeWithGroq(pitch: string): Promise<AnalysisResult> {
  if (!GROQ_API_KEY) return getMockResult(pitch);

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

  if (!response.ok) throw new Error(`API Hatası: ${response.status}`);
  const data = await response.json();
  const content = data.choices[0]?.message?.content || '{}';
  try {
    return JSON.parse(content);
  } catch (e) {
    return getMockResult(pitch); // Hata durumunda güvenli dönüş
  }
}

export async function analyzeFile(base64: string, mimeType: string): Promise<AnalysisResult> {
  if (!genAI) {
    throw new Error("Dosya analizi için Google Gemini API anahtarı gereklidir. Lütfen ayarlardan ekleyin.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent([
    SYSTEM_PROMPT,
    {
      inlineData: {
        data: base64,
        mimeType: mimeType
      }
    }
  ]);

  const response = await result.response;
  const text = response.text();
  const cleanedJson = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleanedJson) as AnalysisResult;
}

export async function askAiQuestion(pitch: string, question: string, context: AnalysisResult): Promise<string> {
  const prompt = `
  Analiz edilen startup pitch: "${pitch}"
  Mevcut Slop Analizi: ${JSON.stringify(context)}
  
  Kullanıcının sorusu: "${question}"
  
  Lütfen bu startup hakkındaki soruyu bir profesyonel yatırımcı gibi detaylı ama net şekilde Türkçeyle yanıtla. Sadece gerçeğe ve analize dayalı konuş.
  `;

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (e) {
      console.error("Gemini sohbet hatası, Groq deneniyor:", e);
    }
  }

  // Groq Fallback
  if (!GROQ_API_KEY) throw new Error("Sohbet için bir API anahtarı (Gemini veya Groq) gereklidir.");

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: "Sen Nokta platformunun Kıdemli Due Diligence motorusun." },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile'
    })
  });

  if (!response.ok) throw new Error(`Sohbet API Hatası: ${response.status}`);
  const data = await response.json();
  return data.choices[0]?.message?.content || 'Yanıt alınamadı.';
}

export async function transcribeAudio(uri: string): Promise<string> {
  if (!GROQ_API_KEY) return "Demo Modu: Ses transkripsiyonu simüle ediliyor...";

  const formData = new FormData();
  
  // React Native fetch için en güvenli dosya yapısı
  const fileToUpload = {
    uri: uri,
    type: 'audio/m4a',
    name: 'audio.m4a',
  };
  
  // @ts-ignore
  formData.append('file', fileToUpload);
  formData.append('model', 'whisper-large-v3-turbo');

  try {
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Accept': 'application/json',
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq Transkripsiyon Hatası:", errorData);
      throw new Error(`Transkripsiyon hatası: ${response.status}`);
    }
    
    const data = await response.json();
    return data.text || '';
  } catch (error) {
    console.error("Transkripsiyon isteği başarısız:", error);
    throw error;
  }
}

function getMockResult(pitch: string): AnalysisResult {
  const lower = pitch.toLowerCase();
  const words = pitch.trim().split(/\s+/);
  const wordCount = words.length;

  // Slop kelimeleri — kırmızı bayrak
  const slopPatterns: { word: string; label: string }[] = [
    { word: 'yapay zeka', label: 'Yapay zeka iddiası' },
    { word: 'ai', label: 'AI iddiası' },
    { word: 'blockchain', label: 'Blockchain iddiası' },
    { word: 'devrim', label: 'Devrimsel değişim iddiası' },
    { word: 'yıkıcı', label: 'Disruptive/yıkıcı model' },
    { word: 'benzersiz', label: 'Benzersiz ürün iddiası' },
    { word: 'rakip yok', label: 'Rakipsiz pazar iddiası' },
    { word: 'trilyon', label: 'Trilyon dolarlık pazar' },
    { word: 'milyar', label: 'Milyar dolarlık büyüme hedefi' },
    { word: 'roket', label: 'Hızlı büyüme benzetmesi' },
    { word: '%100', label: 'Garanti büyüme vaadi' },
    { word: 'garantili', label: 'Garanti vaadi' },
    { word: 'dünyayı değiştir', label: 'Dünyayı değiştirme iddiası' },
    { word: 'dünya geneli', label: 'Küresel kapsam iddiası' },
    { word: 'viral', label: 'Viral büyüme iddiası' },
  ];

  // Güçlü sinyaller
  const strongPatterns: { word: string; label: string }[] = [
    { word: 'müşteri', label: 'Mevcut müşteri tabanı' },
    { word: 'gelir', label: 'Gelir kanıtı' },
    { word: 'mrr', label: 'Aylık tekrarlayan gelir (MRR)' },
    { word: 'arr', label: 'Yıllık tekrarlayan gelir (ARR)' },
    { word: 'patent', label: 'Patent / fikri mülkiyet' },
    { word: 'pilot', label: 'Pilot uygulama deneyimi' },
    { word: 'anlaşma', label: 'İş anlaşması' },
    { word: 'büyüdük', label: 'Kanıtlanmış büyüme' },
    { word: 'kullanıcı', label: 'Kullanıcı tabanı' },
    { word: 'ekip', label: 'Ekip deneyimi' },
  ];

  const foundSlop = slopPatterns.filter(p => lower.includes(p.word));
  const foundStrong = strongPatterns.filter(p => lower.includes(p.word));

  const claims: AnalysisResult['claims'] = [];

  foundSlop.forEach(p => {
    claims.push({
      text: p.label,
      verdict: 'ABARTILI',
      reasoning: `"${p.word}" ifadesi somut kanıt olmadan kullanılmış. Yatırımcılar bu tür iddialara şüpheyle bakar.`,
    });
  });

  foundStrong.forEach(p => {
    claims.push({
      text: p.label,
      verdict: 'GÜÇLÜ',
      reasoning: `"${p.word}" ifadesi somut bir değer veya kanıt içerdiğini düşündürüyor; desteklenmesi durumunda güçlü bir sinyal.`,
    });
  });

  if (wordCount < 30) {
    claims.push({
      text: 'Çok kısa ve yetersiz pitch',
      verdict: 'DOĞRULANAMAZ',
      reasoning: `Pitch yalnızca ${wordCount} kelimeden oluşuyor. Bir yatırımcıyı ikna etmek için çok az bilgi mevcut.`,
    });
  }

  if (claims.length === 0) {
    claims.push({
      text: 'Genel iş modeli açıklaması',
      verdict: 'DOĞRULANAMAZ',
      reasoning: 'Ne güçlü bir kanıt ne de açık bir abartı tespit edildi. Pitch daha spesifik veriler içermeli.',
    });
  }

  const slopRatio = foundSlop.length / Math.max(1, foundSlop.length + foundStrong.length);
  const baseScore = Math.round(slopRatio * 60 + (wordCount < 30 ? 25 : 0) + foundSlop.length * 5);
  const slopScore = Math.min(95, Math.max(5, baseScore));

  let summary = "";
  if (slopScore > 65) {
    summary = `Bu girişim fikri aşırı iddialı ancak altı boş görünüyor. Özellikle ${foundSlop.length > 0 ? foundSlop.map(s => "'" + s.word + "'").join(', ') + " gibi kelimelerle" : "kullanılan abartılı dille"} gerçeği yansıtmayan bir büyüme veya pazar potansiyeli çizilmiş. Fikrin pazar tarafı belki potansiyelli olabilir ama sunum şekli yatırımcıda güvensizlik yaratır.`;
  } else if (slopScore > 35) {
    summary = `Bu fikir potansiyel taşıyor ancak bazı noktalarda netleşmesi gereken detaylar var. ${foundStrong.length > 0 ? foundStrong.map(s => "'" + s.word + "'").join(', ') + " gibi somut verilere değinilmiş olması güçlü bir yön," : "Fikir genel olarak fena olmasa da,"} ${foundSlop.length > 0 ? "fakat " + foundSlop[0].word + " gibi iddialar biraz havada kalmış." : "ancak büyüme planı ve hedef kitle çok daha net tanımlanmalı."} İyi bir pazar araştırmasıyla çok daha güçlü hale gelebilir.`;
  } else {
    summary = `Bu oldukça güçlü ve ayakları yere basan bir fikir. ${foundStrong.length > 0 ? foundStrong.map(s => "'" + s.word + "'").join(', ') + " gibi kritik metriklerden/verilerden bahsedilmiş olması fikrin olgunluğunu gösteriyor." : "Gerçekçi ve net bir şekilde ifade edilmiş."} Abartılı jargonlardan uzak durulması, işin kendisine odaklanıldığını gösteriyor. Sadece rekabet analizini biraz daha derinleştirmek gerekebilir.`;
  }

  return {
    slopScore,
    summary,
    claims,
    recommendation: slopScore > 65
      ? 'Fikir tamamen baştan, somut gerçeklere dayandırılarak yeniden yazılmalı. Mevcut haliyle ciddiye alınması zor.'
      : slopScore > 35
      ? 'İyi bir başlangıç. Sunumdaki iddialı varsayımları verilerle destekleyerek tekrar gözden geçirilmeli.'
      : 'Harika bir temel. İcraat adımları ve takımın yetkinlikleri öne çıkarılarak yatırımcı görüşmelerine hazır hale getirilebilir.',
  };
}

