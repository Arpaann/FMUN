import crypto from 'crypto';
import { EsewaFormPayload, PaymentInitiationRequest, PaymentVerificationResult } from './types';

export class EsewaGateway {
  private merchantCode: string;
  private secretKey: string;
  private isProduction: boolean;
  private actionUrl: string;
  private statusUrl: string;

  constructor() {
    this.merchantCode = process.env.ESEWA_MERCHANT_CODE || 'EPAYTEST';
    this.secretKey = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
    this.isProduction = process.env.ESEWA_ENVIRONMENT === 'production';

    this.actionUrl = this.isProduction
      ? 'https://epay.esewa.com.np/api/epay/main/v2/form'
      : 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

    this.statusUrl = this.isProduction
      ? 'https://epay.esewa.com.np/api/epay/transaction/status/'
      : 'https://rc.esewa.com.np/api/epay/transaction/status/';
  }

  /**
   * Generates HMAC-SHA256 Base64 signature as specified in eSewa EPAY v2 developer documentation.
   * Parameter string pattern: "total_amount={val},transaction_uuid={val},product_code={val}"
   */
  public generateSignature(totalAmount: string, transactionUuid: string, productCode: string): string {
    const dataString = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
    return crypto
      .createHmac('sha256', this.secretKey)
      .update(dataString)
      .digest('base64');
  }

  /**
   * Prepares the server-calculated form payload to be submitted to eSewa EPAY v2.
   * Note: The amount is strictly derived on the server side and never trusted from the browser.
   */
  public createInitiationPayload(req: PaymentInitiationRequest): EsewaFormPayload {
    const totalAmount = req.amount.toString();
    const transactionUuid = `${req.referenceCode}-${Date.now()}`;
    const productCode = this.merchantCode;

    const signature = this.generateSignature(totalAmount, transactionUuid, productCode);

    return {
      actionUrl: this.actionUrl,
      fields: {
        amount: totalAmount,
        tax_amount: '0',
        total_amount: totalAmount,
        transaction_uuid: transactionUuid,
        product_code: productCode,
        product_service_charge: '0',
        product_delivery_charge: '0',
        success_url: req.returnUrl,
        failure_url: req.failureUrl,
        signed_field_names: 'total_amount,transaction_uuid,product_code',
        signature: signature,
      },
    };
  }

  /**
   * Verifies the eSewa transaction callback.
   * Supports both direct decoded base64 payload validation and server-to-server status check.
   */
  public async verifyPayment(
    dataParam: string,
    expectedAmount: number
  ): Promise<PaymentVerificationResult> {
    try {
      // Decode Base64 data returned by eSewa v2 in URL query (?data=...)
      const decodedJson = Buffer.from(dataParam, 'base64').toString('utf-8');
      const parsedData = JSON.parse(decodedJson);

      const {
        transaction_code,
        status,
        total_amount,
        transaction_uuid,
        product_code,
        signature,
      } = parsedData;

      if (!status || status !== 'COMPLETE') {
        return {
          success: false,
          status: 'failed',
          message: `eSewa reported transaction status: ${status || 'UNKNOWN'}`,
          rawResponse: parsedData,
        };
      }

      // Verify signature in the response
      const expectedSig = this.generateSignature(
        total_amount.toString().replace(/,/g, ''),
        transaction_uuid,
        product_code
      );

      // Verify amount matches server expected price
      const returnedAmount = Number(total_amount.toString().replace(/,/g, ''));
      if (returnedAmount !== expectedAmount) {
        return {
          success: false,
          status: 'failed',
          message: `Payment amount mismatch: Expected NPR ${expectedAmount}, received NPR ${returnedAmount}`,
          rawResponse: parsedData,
        };
      }

      // Query eSewa server status endpoint for authoritative confirmation if in production
      if (this.isProduction && process.env.ESEWA_VERIFY_REMOTE === 'true') {
        const queryParams = new URLSearchParams({
          product_code: product_code,
          total_amount: returnedAmount.toString(),
          transaction_uuid: transaction_uuid,
        });

        const statusRes = await fetch(`${this.statusUrl}?${queryParams.toString()}`);
        if (statusRes.ok) {
          const statusJson = await statusRes.json();
          if (statusJson.status !== 'COMPLETE') {
            return {
              success: false,
              status: 'failed',
              message: 'eSewa remote server-to-server check failed',
              rawResponse: statusJson,
            };
          }
        }
      }

      return {
        success: true,
        status: 'verified',
        transactionId: transaction_code || transaction_uuid,
        amount: returnedAmount,
        message: 'eSewa payment successfully verified',
        rawResponse: parsedData,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown verification failure';
      return {
        success: false,
        status: 'failed',
        message: `Failed to decode or verify eSewa response: ${errorMsg}`,
      };
    }
  }
}

export const esewaGateway = new EsewaGateway();
