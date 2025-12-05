export type AdType = 'text' | 'image' | 'video' | 'audio';

export interface Ad {
  id: string;
  title: string;
  content: string;
  type: AdType;
  isActive: boolean;
}
