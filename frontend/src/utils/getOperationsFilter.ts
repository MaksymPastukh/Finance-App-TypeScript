import config from "../config/config";

export class GetOperationsFilter {
  public static urlOperationsFilter(period: string = 'period', dateFrom: string | null = null, dateTo: string | null = null): string {
    let url: string = config.host + '/operations'

    switch (period) {
      case 'Week':
        url += '?period=week'
        break;
      case 'Month':
        url += '?period=month'
        break;
      case 'Year':
        url += '?period=year'
        break;
      case 'All':
        url += '?period=all'
        break;
      case 'Interval':
        if (dateFrom && dateTo) {
          url += `?period=interval&dateFrom=${GetOperationsFilter.chengeToData(dateFrom)}&dateTo=${GetOperationsFilter.chengeToData(dateTo)}`
        } else {
          url += `?period=interval&dateFrom=${GetOperationsFilter.newDate()}&dateTo=${GetOperationsFilter.newDate()}`
        }
        break;
    }

    return url
  }

  private static chengeToData(data: string) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      return data;
    } else if (/^\d{2}\.\d{2}\.\d{4}$/.test(data)) {
      let parts = data.split('.');
      let day: number = parseInt(parts[0]);
      let month: number = parseInt(parts[1]);
      let year: number = parseInt(parts[2]);


      day = +(day < 10 ? '0' : '') + day;
      month = +(month < 10 ? '0' : '') + month;

      return `${year}-${month}-${day}`;
    }
  }

  static formatDate(data: string): string {
    let dateInput: Date = new Date(data);

    let day: number = dateInput.getDate();
    let month: number = dateInput.getMonth() + 1;
    let year: number = dateInput.getFullYear();

    day = +(day < 10 ? '0' : '') + day;
    month = +(month < 10 ? '0' : '') + month;


    return `${day}.${month}.${year}`;
  }

  static newDate(): string {
    let date: Date = new Date();

    let day: number = date.getDate();
    let month: number = date.getMonth() + 1;
    let year: number = date.getFullYear();

    day = +(day < 10 ? '0' : '') + day;
    month = +(month < 10 ? '0' : '') + month;

    return `${year}-${month}-${day}`;
  }
}