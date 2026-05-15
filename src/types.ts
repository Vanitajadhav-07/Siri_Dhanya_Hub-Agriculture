export interface NutritionalValue {
  label: string;
  value: string;
  unit: string;
}

export interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role: 'Farmer' | 'Consumer' | 'Merchant';
}

export interface Millet {
  id: string;
  name: string;
  scientificName: string;
  kannadaName: string;
  description: string;
  kannadaDescription?: string;
  benefits: string[];
  kannadaBenefits?: string[];
  nutritionalValues: NutritionalValue[];
  color: string;
  imageAlt: string;
  imageUrl: string;
  earImageUrl?: string;
  recipeImageUrl?: string;
  ingredients?: string[];
  kannadaIngredients?: string[];
  process?: string[];
  kannadaProcess?: string[];
  videoUrl?: string;
  offlineAvailable?: boolean;
  searchUrl?: string;
  youtubeId?: string;
  videoScenes?: VideoScene[];
  price?: number;
  kg?: number;
  type?: string;
}

export interface VideoKeyword {
  en: string;
  kn: string;
}

export interface VideoScene {
  id: string;
  title: string;
  description: string;
  visualCue: string;
  duration: number;
  keywords?: string[];
  cameraAngle?: string;
  lighting?: string;
}
