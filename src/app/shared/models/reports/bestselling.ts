import { Pagination } from '../paginations/pagination';

export interface BestSelling {
  productId: string;
  totalSold: number;
}

export interface BestSellingProductsResponse {
  products: Pagination<BestSelling>;
}

export interface GetBestSellingRequest {
  bestSellingList: BestSelling[];
  pageNumber?: number;
  pageSize?: number;
}

export interface GetProductsResponse {
  products: Pagination<ProductDisplay>;
}

export interface GetProductsReportResponse {
  products: Pagination<ProductReport>;
}

export interface GetTopCustomersResponse {
  customers: Pagination<TopCustomer>;
}

export interface TopCustomer {
  buyerEmail: string;
  totalProducts: number;
  totalAmount: number;
}

export interface ProductDisplay {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  averageRating: number;
  imageUrl: string;
  stock: number;
  totalSold?: number;
}

export interface ProductReport {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  averageRating: number;
  brand: string;
  type: string;
  imageUrl: string;
  stock: number;
  totalSold?: number;
}
