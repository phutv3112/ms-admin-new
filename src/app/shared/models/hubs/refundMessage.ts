export interface RefundRequestMessage {
  id: string;
  orderId: string;
  reason: string;
  otherReason?: string;
  createdAt: Date;
  createdBy: string;
  isRead?: boolean;
}
