import * as dotenv from 'dotenv';
import Stripe from 'stripe';
import {Request, Response} from 'express';
import StripeService from "./stripe.service";

dotenv.config();

// get api Paystack api key
const apiKey: string | undefined = process.env.STRIPE_SECRET_KEY;

const config: Stripe.StripeConfig = {
  apiVersion: "2022-11-15",
};

// Define the PaystackService class
class StripeController {
  private static stripeService = new StripeService(apiKey, config);

  static async makePayment(request: Request, response: Response) {
    // Retrieve payment details from the request body
    const { amount, currency } = request.body;
    const {clientSecret, paymentIntentId }= await StripeController.stripeService.makePaymentIntent(amount, currency);
    response.status(200).json({ clientSecret, paymentIntentId });
  }

  static async confirmPayment(request: Request, response: Response) {
    // Retrieve the reference code from the request body
    const { paymentIntentId } = request.body;
    const { id, status, amount, currency, client_secret, payment_method, charges } = await StripeController.stripeService.confirmPayment(paymentIntentId);
  }
}