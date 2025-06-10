export interface Discount {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdDate: Date;
  updatedDate: Date;
  createdBy: string;
  updatedBy: string;
  images?: DiscountImage[] | null;
}

export interface DiscountImage {
  imageUrl: string;
  publicId: string;
  isDisplay: boolean;
}

export interface DiscountRequest {
  name: string;
  description?: string;
  startDate: Date;
  endDate: string;
  isActive: boolean;
  createdBy: string;
}

export interface UpdateDiscountRequest {
  name: string;
  description?: string;
  startDate: Date;
  endDate: string;
  isActive: boolean;
  updatedBy: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  discountId: string;

  usageLimit?: number | null;
  perUserLimit?: number | null;

  usedCount: number;

  type: DiscountType;
  value: number;

  minSubtotal?: number | null;
  maxDiscountAmount?: number | null;

  startDate: Date;
  endDate: Date;

  isActive: boolean;

  createdDate: Date;
  updatedDate: Date;
  createdBy: string;
  updatedBy: string;
}
export interface DiscountCodeDto {
  id: string;
  discountId: string;
  discountName?: string;
  code: string;
  type: DiscountType;
  value: number;
  usedCount: number;
  usageLimit?: number;
  perUserLimit?: number;
  startDate: Date;
  endDate: Date;
  minSubtotal?: number;
  maxDiscountAmount?: number;
  isActive: boolean;
}

export interface CreateDiscountCode {
  discountId: string;
  code: string;

  type: DiscountType;
  value: number;
  usageLimit?: number | null;
  perUserLimit?: number | null;
  minSubtotal?: number | null;
  maxDiscountAmount?: number | null;

  startDate: Date;
  endDate: Date;

  isActive: boolean;
  createdBy: string;
}

export interface UpdateDiscountCode {
  code: string;

  type: DiscountType;
  value: number;
  usageLimit?: number | null;
  perUserLimit?: number | null;
  minSubtotal?: number | null;
  maxDiscountAmount?: number | null;

  startDate: Date;
  endDate: Date;

  isActive: boolean;
  updatedBy: string;
}

export enum DiscountType {
  Percentage = 0,
  FixedAmount = 1,
}
