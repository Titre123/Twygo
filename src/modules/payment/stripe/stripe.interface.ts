interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
}

interface CreatePaymentIntentResponse {
  clientSecret: string;
}

interface PaymentIntentResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
  client_secret: string;
  payment_method: string;
  charges: any[]; // Replace 'any' with the actual type for charges if available
}

export {
  CreatePaymentIntentRequest,
  CreatePaymentIntentResponse,
  PaymentIntentResponse
};
