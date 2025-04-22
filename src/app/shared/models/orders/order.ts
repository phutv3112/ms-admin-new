export interface Order {
  id: string;
  orderDate: Date;
  buyerEmail: string;
  shippingAddress: ShippingAddress;
  deliveryMethod: string;
  shippingPrice: number;
  payment: Payment;
  status: string;
  orderItems: OrderItem[];
  subtotal: number;
  total: number;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface Payment {
  paymentIntentId: string;
  paymentType: number;
  paymentDetails: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  pictureUrl: string;
  quantity: number;
  price: number;
  variant: string | null;
}

export interface Variant {
  id: string;
  productId: string;
  color: string;
  size: string;
  additionalPrice: number;
}
