export interface IEmiNotificationCronService {
    run():Promise<void>
    notifyDueInTwoDays(startDate:Date,endDate:Date):Promise<void>
    notifyDueToday(startDate:Date,endDate:Date):Promise<void>
    notifyOverdueEmis(currentDate:Date):Promise<void>
}