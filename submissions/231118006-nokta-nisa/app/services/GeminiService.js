const API_KEY = 'AIzaSyCqjeXtMTBJro_S8ebWnBBHmu2O8e0WWF8';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';

export const generateGeminiResponse = async (prompt, history = [], audioBase64 = null) => {
  try {
    const contents = [...history];
    
    const parts = [];
    if (audioBase64) {
      parts.push({
        inline_data: {
          mime_type: 'audio/mp4',
          data: audioBase64
        }
      });
      parts.push({ text: prompt || "Lütfen bu sesli mesajı analiz et. Önce kullanıcının ne dediğini tam olarak yazıya dök (transkript), sonra cevabını ver. Format: TRANSKRİPT: [metin] ||| CEVAP: [cevap]" });
    } else {
      parts.push({ text: prompt });
    }

    contents.push({ role: 'user', parts });

    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    if (error.message.includes('high demand')) {
      return 'Şu an çok fazla istek var, Google sunucuları biraz meşgul. Lütfen birkaç saniye sonra tekrar dene.';
    }
    return 'Üzgünüm, şu an bir hata oluştu: ' + error.message;
  }

};
