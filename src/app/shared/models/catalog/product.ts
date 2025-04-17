import { Category } from './category';

export interface Brand {
  id: string;
  name: string;
  imageUrl: string;
}
export interface ProductType {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  originalPrice: number;
  brand: string;
  type: string;
  stock: number;
  imageUrls: ProductImage[];
  variants: ProductVariant[];
  categories: Category[];
}

export interface ProductImage {
  imageUrl: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  color: string;
  size: string;
  additionalPrice: number;
  stock: number;
}
