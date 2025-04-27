export interface PaidOrderMessage {
  id: string;
  orderId: string;
  buyerEmail: string;
  createdAt: Date;
  createdBy: string;
  isRead?: boolean;
}
