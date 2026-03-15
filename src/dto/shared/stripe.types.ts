export interface CreateCheckoutSessionInput {
  amount: number;
  emiId: string;
  loanId: string;
  userId: string;
  emiNumber: number;
  successUrl: string;
  cancelUrl: string;
}