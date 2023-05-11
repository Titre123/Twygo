import { Paystack } from 'paystack';
import {PaystackPaymentVerification, PaystackAuthorization, PaystackPayment} from './paystack.interface';
import logger from '../../../utils/logging/logger';
import { InternalServerError } from '../../../commons/error';

export default class PaystackService {
  private apiKey: string | undefined;
  private paystack: any;

  constructor(apiKey: string | undefined) {
    this.apiKey = apiKey;
    if(this.apiKey === undefined) throw Error('Invalid Paystack API key');
    this.paystack = new Paystack(this.apiKey);
  }

  public async makePayment(amount: number, email: string, reference: string): Promise<PaystackAuthorization> {
    // Create a new transaction using the Paystack client
    const paymentPayload: PaystackPayment = {
      amount,
      email,
      reference,
    };
    try{
      const transaction = await this.paystack.transaction.initialize(paymentPayload);
      return transaction.data.authorization_url;
    } catch (error) {
      logger.error(error);
      throw new InternalServerError();
    }
  }

  public async confirmPayment(reference: string ): Promise<PaystackPaymentVerification> {
    // Verify the payment using the Paystack client
    try{
      const verifyTransaction = await this.paystack.transaction.verify({ reference });
      return verifyTransaction.data.data;
    } catch(error) {
      logger.error(error);
      throw new InternalServerError();
    }
  }
}
