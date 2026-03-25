import cron from "node-cron";
import { container } from "tsyringe";
import { IEmiNotificationCronService } from "@/interfaces/helper/emi.notification.crone.service"

export const startCronJobs = (): void => {
  const emiNotificationCronService = container.resolve<IEmiNotificationCronService>(
    "IEmiNotificationCronService"
  );

  cron.schedule("0 * * * *", async () => {
    console.log("Running EMI notification cron...");
    await emiNotificationCronService.run();
  });
};