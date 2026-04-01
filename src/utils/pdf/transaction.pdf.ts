import PDFDocument from "pdfkit";
import { Response } from "express";

export const generateTransactionPDF = (transactions: any[], res: Response) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=transactions.pdf");

  doc.pipe(res);

  doc.fontSize(18).text("Transaction Report", { align: "center" });
  doc.moveDown();

  transactions.forEach((txn, index) => {
    doc
      .fontSize(10)
      .text(
        `${index + 1}. ${txn.transactionId} | ₹${txn.totalAmount} | ${txn.paymentStatus} | ${new Date(txn.paidAt).toLocaleDateString()}`
      );
  });

  doc.end();
};