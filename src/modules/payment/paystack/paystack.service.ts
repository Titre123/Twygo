import { Paystack } from 'paystack';
import {PaystackPaymentVerification, PaystackAuthorization, PaystackPayment} from './paystack.interface';

export default class PaystackService {
  private apiKey: string;
  private paystack: any;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.paystack = new Paystack(this.apiKey);
  }

  public async makePayment(amount: number, email: string, reference: string): Promise<PaystackAuthorization> {
    // Create a new transaction using the Paystack client
    const paymentPayload: PaystackPayment = {
      amount,
      email,
      reference,
    };
    const transaction = await this.paystack.transaction.initialize(paymentPayload);
    return transaction.data.authorization_url;
  }

  public async confirmPayment(reference: string ): Promise<PaystackPaymentVerification> {
    // Verify the payment using the Paystack client
    const verifyTransaction: PaystackPaymentVerification = await this.paystack.transaction.verify({ reference });
    return verifyTransaction;
  }
}
