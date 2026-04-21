// Nokta AI ile konuşan tek giriş noktası.
// UI sadece askNokta() çağırır; SDK'nın kendisi, hata sınıfları ve
// JSON doğrulaması bu modülün arkasında kalır.

import Anthropic from '@anthropic-ai/sdk';

import {
  NOKTA_SYSTEM_PROMPT,
  TOHUM_MAX_TOKENS,
  TOHUM_MODEL,
} from '@/constants/prompt';
import {
  isNoktaAiResponse,
  type ChatTurn,
  type NoktaAiResponse,
} from '@/constants/schema';

export class TohumAiError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'TohumAiError';
  }
}

export class MissingApiKeyError extends TohumAiError {
  constructor() {
    super(
      'ANTHROPIC_API_KEY bulunamadı. app/.env dosyasına EXPO_PUBLIC_ANTHROPIC_API_KEY ekleyip uygulamayı yeniden başlat.',
    );
    this.name = 'MissingApiKeyError';
  }
}

export class NetworkError extends TohumAiError {
  constructor(cause: unknown) {
    super('AI servisine ulaşılamadı. İnternet bağlantını kontrol et.', cause);
    this.name = 'NetworkError';
  }
}

export class MalformedResponseError extends TohumAiError {
  constructor(public raw: string) {
    super('AI beklenmedik bir format döndü. Tekrar dene.');
    this.name = 'MalformedResponseError';
  }
}

export class RateLimitError extends TohumAiError {
  constructor() {
    super('AI şu an yoğun. Birkaç saniye sonra tekrar dene.');
    this.name = 'RateLimitError';
  }
}

function getClient(): Anthropic {
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.length < 10) {
    throw new MissingApiKeyError();
  }
  return new Anthropic({
    apiKey,
    // React Native sandbox'ta "browser-like" kontrol tetiklenebiliyor;
    // SDK bu bayrak olmadan çalışmayı reddediyor.
    dangerouslyAllowBrowser: true,
  });
}

/**
 * ChatTurn dizisini Anthropic Messages API formatına çevirir.
 * AI turlarında tam JSON zarfı (NoktaAiResponse) assistant mesajı olarak
 * geri gönderilir; rubric durumu bu sayede konuşma boyunca sticky kalır.
 */
function turnsToMessages(turns: ChatTurn[]): Anthropic.MessageParam[] {
  return turns.map<Anthropic.MessageParam>((turn) => {
    if (turn.role === 'user') {
      return { role: 'user', content: turn.content };
    }
    const envelope = {
      message: turn.content,
      suggestions: turn.suggestions,
      rubric: turn.rubric,
      ready: turn.ready,
      idea_md: turn.idea_md,
    };
    return {
      role: 'assistant',
      content: JSON.stringify(envelope),
    };
  });
}

/** Model cevabından ilk geçerli JSON bloğunu ayıklar. */
function extractJson(text: string): unknown {
  const trimmed = text.trim();
  // Model bazen ```json ... ``` ile sarabilir; temizle.
  const unfenced = trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  try {
    return JSON.parse(unfenced);
  } catch {
    // Son çare: ilk { ile son } arasını dene.
    const start = unfenced.indexOf('{');
    const end = unfenced.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
      throw new MalformedResponseError(text);
    }
    try {
      return JSON.parse(unfenced.slice(start, end + 1));
    } catch {
      throw new MalformedResponseError(text);
    }
  }
}

/**
 * Kullanıcı turunu ve geçmişi alır, Nokta AI'dan JSON cevabı döndürür.
 * UI bu fonksiyonu await eder; tüm hatalar TohumAiError türevidir.
 */
export async function askNokta(history: ChatTurn[]): Promise<NoktaAiResponse> {
  const client = getClient();
  const messages = turnsToMessages(history);

  let response: Anthropic.Message;
  try {
    response = await client.messages.create({
      model: TOHUM_MODEL,
      max_tokens: TOHUM_MAX_TOKENS,
      system: NOKTA_SYSTEM_PROMPT,
      messages,
    });
  } catch (err: unknown) {
    if (err instanceof Anthropic.APIError) {
      if (err.status === 429) throw new RateLimitError();
      if (err.status && err.status >= 500) {
        throw new NetworkError(err);
      }
      throw new TohumAiError(err.message, err);
    }
    throw new NetworkError(err);
  }

  const firstBlock = response.content[0];
  if (!firstBlock || firstBlock.type !== 'text') {
    throw new MalformedResponseError(JSON.stringify(response.content));
  }

  const parsed = extractJson(firstBlock.text);
  if (!isNoktaAiResponse(parsed)) {
    throw new MalformedResponseError(firstBlock.text);
  }
  return parsed;
}
