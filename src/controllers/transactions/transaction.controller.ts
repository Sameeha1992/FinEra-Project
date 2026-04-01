import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { IVendorTransactionPdfService } from "@/interfaces/helper/pdfDoc.service.interface";
import { ITransactionService } from "@/interfaces/services/transaction/transaction.service.interface";
import { CustomError } from "@/middleware/errorMiddleware";
import { AuthenticateRequest } from "@/types/express/authenticateRequest.interface";
import { Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { success } from "zod";

@injectable()
export class TransactionController {
  constructor(
    @inject("ITransactionService")
    private readonly _iTransactionService: ITransactionService,
    @inject("IVendorTransactionPdfService")
    private readonly _iVendorTransactionPdfService: IVendorTransactionPdfService,
  ) {}

  async getUserTransactions(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user?.id;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const transactions = await this._iTransactionService.getUserTransactions(
        userId!,
        page,
        limit,
      );

      console.log("Transactions", transactions);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.TRANSACTIONS_FETCHED_SUCCESSFULLY,
        data: transactions,
      });
    } catch (error) {
      console.log("Something issue in the transactions", error);
      next(error);
    }
  }

  async getVendorTransactions(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const vendorId = req.user?.id;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const transactions =
        await this._iTransactionService.getVendorTransactions(
          vendorId!,
          page,
          limit,
        );

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.TRANSACTIONS_FETCHED_SUCCESSFULLY,
        data: transactions,
      });
    } catch (error) {
      next(error);
    }
  }

  async downloadVendorTransactionReport(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const vendorId = req.user?.id;

      if (!vendorId) {
        throw new CustomError(
          MESSAGES.VENDOR_NOT_FOUND,
          STATUS_CODES.BAD_REQUEST,
        );
      }

      const startDate = req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined;

      const endDate = req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined;

      const transactions =
        await this._iTransactionService.getVendorTransactionReportData(
          vendorId,
          startDate,
          endDate,
        );

      const doc =
        this._iVendorTransactionPdfService.generateVendorTransactionPdf(
          transactions,
          "Vendor Transaction Report",
        );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="vendor-transaction-report.pdf"',
      );

      doc.pipe(res);
      doc.end();
    } catch (error) {
      next(error);
    }
  }
}
