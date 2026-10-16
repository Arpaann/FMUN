export interface PaymentInitiationRequest {
  delegateId: string;
  referenceCode: string;
  amount: number; // in NPR
  delegateName: string;
  delegateEmail: string;
  delegatePhone: string;
  returnUrl: string;
  failureUrl: string;
}

export interface EsewaFormPayload {
  actionUrl: string;
  fields: {
    amount: string;
    tax_amount: string;
    total_amount: string;
    transaction_uuid: string;
    product_code: string;
    product_service_charge: string;
    product_delivery_charge: string;
    success_url: string;
    failure_url: string;
    signed_field_names: string;
    signature: string;
  };
}

export interface KhaltiInitiationResponse {
  pidx: string;
  paymentUrl: string;
  expiresAt: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  status: 'verified' | 'failed' | 'pending';
  transactionId?: string;
  amount?: number;
  message: string;
  rawResponse?: Record<string, unknown>;
}
