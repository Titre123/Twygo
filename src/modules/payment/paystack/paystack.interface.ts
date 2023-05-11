interface PaystackPayment {
  amount: number;
  email: string;
  reference: string;
}

interface PaystackAuthorization {
  authorizationUrl: string;
}

interface PaystackPaymentVerification {
  status: string;
  amount: number;
  currency: string;
  customer: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export { PaystackPayment, PaystackAuthorization, PaystackPaymentVerification };
