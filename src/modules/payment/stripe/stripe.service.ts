import Stripe from 'stripe';
import { CreatePaymentIntentRequest, PaymentIntentResponse } from './stripe.interface';
import logger from '../../../utils/logging/logger';
import { InternalServerError } from '../../../commons/error';

export default class StripeService {
  private apiKey: string | undefined;
  private stripe: any;
  private config: Stripe.StripeConfig;

  constructor(apiKey: string | undefined, config: Stripe.StripeConfig) {
    this.apiKey = apiKey;
    if(this.apiKey === undefined) throw Error('Invalid Stripe API key');
    this.config = config;
    this.stripe = new Stripe(this.apiKey, this.config);
  }

  public async makePaymentIntent(amount: number, currency: string): Promise<any> {
    // Create a new transaction using the Paystack client
    const paymentPayload: CreatePaymentIntentRequest = {
      amount,
      currency
    };
    try{
      const paymentIntent = await this.stripe.paymentIntents.create(paymentPayload);

      // Extract the paymentIntentId from the client_secret
      const paymentIntentId = paymentIntent.id;
      return {clientSecret: paymentIntent.client_secret, paymentIntentId};
    } catch (error) {
      logger.error(error);
      throw new InternalServerError();
    }
  }

  public async confirmPayment(paymentIntentId: string): Promise<PaymentIntentResponse> {
    try {
      // Retrieve the payment intent using the Stripe API
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

      // Confirm the payment intent
      const { id, status, amount, currency, client_secret, payment_method, charges } = await this.stripe.paymentIntents.confirm(paymentIntentId);

      return {id, status, amount, currency, client_secret, payment_method, charges};
    } catch (error) {
      logger.error(error);
      throw new InternalServerError();
    }
  }
}
