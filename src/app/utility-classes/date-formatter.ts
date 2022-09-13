export class DateFormatter {
  constructor() {}

  //returns date in dd-MM-yyyy format
  public static getDate_ddMMyyyy(date = new Date()) {
    //getting day, month and year
    let day = String(date.getDate());
    let month = String(date.getMonth() + 1);
    const year = String(date.getFullYear());

    //concatenating 0 in front if day and month if it is less than 10
    if (day.length < 2) day = '0' + day;
    if (month.length < 2) month = '0' + month;

    //returning the formatted date in the dd-MM-yyyy format
    return `${day}-${month}-${year}`;
  }

  //returns date in yyyy-MM-dd format
  public static getDate_yyyyMMdd(date = new Date()) {
    //getting day, month and year
    let day = String(date.getDate());
    let month = String(date.getMonth() + 1);
    const year = String(date.getFullYear());

    //concatenating 0 in front if day and month if it is less than 10
    if (day.length < 2) day = '0' + day;
    if (month.length < 2) month = '0' + month;

    //returning the formatted date in the yyyy-MM-dd format
    return `${year}-${month}-${day}`;
  }

  public static getTime_HHMMSS(date = new Date()) {
    //24 to 12 hour format
    let hour24 = date.getHours();
    hour24 = hour24 % 12;
    hour24 = hour24 ? hour24 : 12;

    let hour = String(hour24);
    let minute = String(date.getMinutes());
    let second = String(date.getSeconds());

    if (hour.length < 2) hour = '0' + hour;
    if (minute.length < 2) minute = '0' + minute;
    if (second.length < 2) second = '0' + second;

    return `${hour}-${minute}-${second}`;
  }

  public convertDateToDDMMYYYY(date: string): string {
    let dateArr = date.split('-');
    return dateArr[2] + '-' + dateArr[1] + '-' + dateArr[0];
  }
}
