import * as dotenv from 'dotenv';
import {Request, Response} from 'express';
import PaystackService from "./paystack.service";

dotenv.config();

// get api Paystack api key
const apiKey: string | undefined = process.env.PAYSTACK_SECRET_KEY;

// Define the PaystackService class
class PaystackController {
  private static paystackService = new PaystackService(apiKey);

  static async makePayment(request: Request, response: Response) {
    // Retrieve payment details from the request body
    const { amount, email, reference } = request.body;
    const authorizationUrl = await PaystackController.paystackService.makePayment(amount, email, reference);
    response.status(200).json({ authorizationUrl });
  }

  static async confirmPayment(request: Request, response: Response) {
    // Retrieve the reference code from the request body
    const { reference } = request.body;
    const { status, amount, currency, customer } = await PaystackController.paystackService.confirmPayment(reference);
    if (status === 'success') {
      // Payment is successful
      response.status(200).json({ status, amount, currency, customer });
    } else {
      // Payment is not successful
      throw new Error('Payment verification failed');
    }
  }
}