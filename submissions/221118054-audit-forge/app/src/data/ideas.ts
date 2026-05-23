// src/data/ideas.ts
// Mock veri — mini nokta klonu için fikir listesi.
// Gerçek kullanıcı verisi içermez (spec gereği).

export interface Idea {
  id: string;
  title: string;
  summary: string;
  track: 'A' | 'B' | 'C';
  status: 'taslak' | 'olgun' | 'arşiv';
  votes: number;
  createdAt: string;
}

export const IDEAS: Idea[] = [
  {
    id: 'idea-1',
    title: 'Sesli not alma asistanı',
    summary:
      'Toplantı sırasında konuşmaları otomatik özetleyen, aksiyon maddelerini çıkaran mobil asistan.',
    track: 'A',
    status: 'olgun',
    votes: 42,
    createdAt: '2026-05-01T10:00:00Z',
  },
  {
    id: 'idea-2',
    title: 'Mahalle takas platformu',
    summary:
      'Komşuların kullanmadığı eşyaları para olmadan takas edebildiği konum-bazlı uygulama.',
    track: 'B',
    status: 'taslak',
    votes: 18,
    createdAt: '2026-05-03T14:30:00Z',
  },
  {
    id: 'idea-3',
    title: 'Bitki bakım hatırlatıcısı',
    summary:
      'Ev bitkilerinin sulama, gübreleme ve ışık ihtiyaçlarını takip eden, fotoğraftan tür tanıyan uygulama.',
    track: 'A',
    status: 'olgun',
    votes: 67,
    createdAt: '2026-05-05T09:15:00Z',
  },
  {
    id: 'idea-4',
    title: 'Öğrenci ders takas ağı',
    summary:
      'Üniversite öğrencilerinin bildikleri konuları birbirine öğrettiği, kredi tabanlı bilgi paylaşım ağı.',
    track: 'C',
    status: 'taslak',
    votes: 31,
    createdAt: '2026-05-07T16:45:00Z',
  },
  {
    id: 'idea-5',
    title: 'Yerel üretici pazarı',
    summary:
      'Küçük çiftçilerin ürünlerini aracısız satabildiği, hasat takvimine göre sipariş alan platform.',
    track: 'B',
    status: 'arşiv',
    votes: 9,
    createdAt: '2026-05-09T11:20:00Z',
  },
];

export function getIdeaById(id: string): Idea | undefined {
  return IDEAS.find((i) => i.id === id);
}
