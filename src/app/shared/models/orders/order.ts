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
  vnPayTransaction?: VnPayTransaction;
}

export interface VnPayTransaction {
  vnpTxnRef: string;
  vnpAmount: number;
  vnpTransactionNo: string;
  vnpTransactionDate: string;
  vnpOrderInfo: string;
  vnpCreateBy: string;
}

export interface RefundResponse {
  vnp_ResponseCode: string;
  vnp_Message: string;
}

export interface VnPayRefundModel {
  vnp_RequestId: string;
  vnp_Version: string;
  vnp_Command: 'refund';
  vnp_TmnCode: string;
  vnp_TransactionType: '02';
  vnp_TxnRef: string;
  vnp_Amount: number;
  vnp_OrderInfo: string;
  vnp_TransactionNo: string;
  vnp_TransactionDate: string;
  vnp_CreateBy: string;
  vnp_CreateDate: string;
  vnp_IpAddr: string;
  vnp_SecureHash: string;
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
