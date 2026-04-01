import PDFDocument from "pdfkit";
import { VendorTransactionPdfItemDto } from "@/dto/transaction/vendor.transaction.pdf";

export interface IVendorTransactionPdfService {
  generateVendorTransactionPdf(
    transactions: VendorTransactionPdfItemDto[],
    title?: string,
  ): PDFKit.PDFDocument;
}