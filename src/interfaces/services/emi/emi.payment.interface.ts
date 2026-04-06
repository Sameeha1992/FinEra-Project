import { EmiListingLoans } from "@/dto/emi/create.emi.dto";

export interface IEmiPaymentService {
  createEmiPaymentSession(
    emiId: string,
    userId: string,
  ): Promise<{ success: boolean; message: string; checkoutUrl: string }>;
  refreshEmiStatus(emiId: string): Promise<EmiListingLoans | null>;
  handleSuccessfulEmiPayment(emiId: string): Promise<EmiListingLoans | null>;
}
