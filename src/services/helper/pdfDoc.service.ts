import PDFDocument from "pdfkit";
import { injectable } from "tsyringe";
import { VendorTransactionPdfItemDto } from "@/dto/transaction/vendor.transaction.pdf"; 
import { IVendorTransactionPdfService } from "@/interfaces/helper/pdfDoc.service.interface";

@injectable()
export class VendorTransactionPdfService
  implements IVendorTransactionPdfService
{
  generateVendorTransactionPdf(
    transactions: VendorTransactionPdfItemDto[],
    title: string = "Vendor Transaction Report",
  ): PDFKit.PDFDocument {
    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
    });

    doc.fontSize(18).text(title, { align: "center" });
    doc.moveDown();

    const totalAmount = transactions.reduce(
      (sum, item) => sum + item.totalPaidAmount,
      0,
    );

    const totalPenalty = transactions.reduce(
      (sum, item) => sum + item.penaltyAmount,
      0,
    );

    doc.fontSize(11).text(`Total Transactions: ${transactions.length}`);
    doc.text(`Total Amount Received: ₹${totalAmount.toFixed(2)}`);
    doc.text(`Total Penalty Collected: ₹${totalPenalty.toFixed(2)}`);
    doc.moveDown();

    transactions.forEach((transaction, index) => {
      doc
        .fontSize(10)
        .text(`${index + 1}. Transaction ID: ${transaction.transactionId}`)
        .text(`User Name: ${transaction.userName}`)
        .text(`Loan Type: ${transaction.loanType}`)
        .text(`Loan Amount: ₹${transaction.loanAmount.toFixed(2)}`)
        .text(`Interest Rate: ${transaction.interestRate}%`)
        .text(`Penalty Amount: ₹${transaction.penaltyAmount.toFixed(2)}`)
        .text(`Total Paid Amount: ₹${transaction.totalPaidAmount.toFixed(2)}`)
        .text(`Payment Status: ${transaction.paymentStatus}`)
        .text(
          `Paid At: ${new Date(transaction.paidAt).toLocaleDateString()}`,
        );

      doc.moveDown();
    });

    return doc;
  }
}