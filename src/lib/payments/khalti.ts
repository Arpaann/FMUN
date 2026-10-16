import { KhaltiInitiationResponse, PaymentInitiationRequest, PaymentVerificationResult } from './types';

export class KhaltiGateway {
  private secretKey: string;
  private isProduction: boolean;
  private baseUrl: string;

  constructor() {
    this.secretKey = process.env.KHALTI_SECRET_KEY || 'live_secret_key_placeholder';
    this.isProduction = process.env.KHALTI_ENVIRONMENT === 'production';
    this.baseUrl = this.isProduction
      ? 'https://a.khalti.com/api/v2'
      : 'https://dev.khalti.com/api/v2';
  }

  /**
   * Initiates payment via Khalti ePayment API v2.
   * Note: The amount is converted into paisa (1 NPR = 100 paisa) on the server.
   */
  public async initiatePayment(req: PaymentInitiationRequest): Promise<KhaltiInitiationResponse> {
    const payload = {
      return_url: req.returnUrl,
      website_url: req.returnUrl,
      amount: req.amount * 100, // converted to paisa
      purchase_order_id: req.referenceCode,
      purchase_order_name: 'FMUN 2026 Delegate Registration Fee',
      customer_info: {
        name: req.delegateName,
        email: req.delegateEmail,
        phone: req.delegatePhone,
      },
    };

    // If no real secret key is configured, provide a sandbox-ready response
    if (!process.env.KHALTI_SECRET_KEY || process.env.KHALTI_SECRET_KEY === 'live_secret_key_placeholder') {
      return {
        pidx: `test_khalti_pidx_${req.referenceCode}_${Date.now()}`,
        paymentUrl: `${req.returnUrl}?pidx=test_khalti_pidx_${req.referenceCode}&status=Completed`,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      };
    }

    const response = await fetch(`${this.baseUrl}/epayment/initiate/`, {
      method: 'POST',
      headers: {
        Authorization: `Key ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Khalti payment initiation failed: ${errText}`);
    }

    const data = await response.json();
    return {
      pidx: data.pidx,
      paymentUrl: data.payment_url,
      expiresAt: data.expires_at,
    };
  }

  /**
   * Verifies transaction using Khalti server-side lookup endpoint /api/v2/epayment/lookup/
   */
  public async verifyPayment(
    pidx: string,
    expectedAmountNpr: number,
    expectedRefCode: string
  ): Promise<PaymentVerificationResult> {
    try {
      // Allow seamless testing in dev/sandbox if placeholder key is used
      if (!process.env.KHALTI_SECRET_KEY || process.env.KHALTI_SECRET_KEY === 'live_secret_key_placeholder') {
        if (pidx.startsWith('test_khalti_pidx_')) {
          return {
            success: true,
            status: 'verified',
            transactionId: pidx,
            amount: expectedAmountNpr,
            message: 'Sandbox Khalti payment successfully verified',
            rawResponse: { pidx, status: 'Completed', simulated: true },
          };
        }
      }

      const response = await fetch(`${this.baseUrl}/epayment/lookup/`, {
        method: 'POST',
        headers: {
          Authorization: `Key ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pidx }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return {
          success: false,
          status: 'failed',
          message: `Khalti lookup error: ${errText}`,
        };
      }

      const data = await response.json();
      const expectedPaisa = expectedAmountNpr * 100;

      if (data.status !== 'Completed') {
        return {
          success: false,
          status: 'failed',
          message: `Khalti transaction status is '${data.status}', not Completed`,
          rawResponse: data,
        };
      }

      if (Number(data.total_amount) !== expectedPaisa) {
        return {
          success: false,
          status: 'failed',
          message: `Amount mismatch: Expected ${expectedPaisa} paisa, received ${data.total_amount} paisa`,
          rawResponse: data,
        };
      }

      if (data.purchase_order_id && !data.purchase_order_id.includes(expectedRefCode)) {
        return {
          success: false,
          status: 'failed',
          message: `Reference mismatch: Expected order ${expectedRefCode}, got ${data.purchase_order_id}`,
          rawResponse: data,
        };
      }

      return {
        success: true,
        status: 'verified',
        transactionId: data.transaction_id || pidx,
        amount: expectedAmountNpr,
        message: 'Khalti payment successfully verified',
        rawResponse: data,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown Khalti verification failure';
      return {
        success: false,
        status: 'failed',
        message: errorMsg,
      };
    }
  }
}

export const khaltiGateway = new KhaltiGateway();
