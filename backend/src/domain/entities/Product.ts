export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice?: number;
  sku: string;
  category: ProductCategory;
  subcategory?: string;
  brand: string;
  stock: number;
  images: ProductImage[];
  ingredients: Ingredient[];
  nutritionalInfo: NutritionalInfo;
  specifications: ProductSpecification[];
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  weight: number;
  dimensions: ProductDimensions;
  seoTitle?: string;
  seoDescription?: string;
  averageRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProductCategory {
  VITAMINS = 'vitamins',
  MINERALS = 'minerals',
  HERBAL = 'herbal',
  SPORTS_NUTRITION = 'sports_nutrition',
  PROTEIN = 'protein',
  AMINO_ACIDS = 'amino_acids',
  OMEGA_FATTY_ACIDS = 'omega_fatty_acids',
  PROBIOTICS = 'probiotics'
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  dailyValue?: number;
}

export interface NutritionalInfo {
  servingSize: string;
  servingsPerContainer: number;
  calories?: number;
  totalFat?: string;
  sodium?: string;
  totalCarbohydrates?: string;
  protein?: string;
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: string;
}