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
  averageRating: number;
  totalReview: number;
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

export interface InventoryItem {
  inventoryId: string;
  productName: string;
  color: string;
  size: string;
  quantity: number;
  imageUrl: string;
}
export interface InventoryById {
  inventoryId: string;
  quantity: number;
}

export interface InventoryHistory {
  inventoryId: string;
  oldQuantity: number;
  newQuantity: number;
  reason: string;
  userName: string;
}
export interface InventoryHistoryResponse {
  id: string;
  inventoryId: string;
  oldQuantity: number;
  newQuantity: number;
  reason: string;
  changedBy: string;
  changedAt: Date;
}

export interface BrandResponse {
  id: string;
  name: string;
  imageUrl: string;
  isActive: boolean;
  changedBy: string;
  createdDate: Date;
  updatedDate: Date;
  productCount: number;
}

export interface ProductTypeResponse {
  id: string;
  name: string;
  isActive: boolean;
  changedBy: string;
  createdDate: Date;
  updatedDate: Date;
  productCount: number;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  orderId?: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface ProductLazyResponse {
  products: Product[];
  totalCount: number;
}

export interface FilterProductRequest {
  page: number;
  pageSize: number;
  stock: FilterCondition;
  averageRating: FilterCondition;
}
export interface FilterCondition {
  value?: number;
  matchMode: string;
  operator: string;
}
