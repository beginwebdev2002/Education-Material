export interface Material {
  id: string; // UUID
  title: string;
  authorId: string; // UUID of the author
  authorName: string;
  rating: number; // 1-5
  downloads: number;
  description: string;
  reviews: number;
  isPublic: boolean;
}

export interface MaterialTypes {
  id: string | number; // UUID of the material
  program: boolean;
  lecture: boolean;
  presentation: boolean;
  test: boolean;
}
export type MaterialTypesKey = keyof Omit<MaterialTypes, "id">
export interface MaterialDescription {
  id: string | number;
  key: MaterialTypesKey;
  name: string;
  sub: string;
  icon: string;
}