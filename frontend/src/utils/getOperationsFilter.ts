import config from "../config/config";

export class GetOperationsFilter {
  static urlOperationsFilter(period = 'period', dateFrom = null, dateTo = null) {
    let url = config.host + '/operations'

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

  static chengeToData(data) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      return data;
    } else if (/^\d{2}\.\d{2}\.\d{4}$/.test(data)) {
      let parts = data.split('.');
      let day = parseInt(parts[0]);
      let month = parseInt(parts[1]);
      let year = parseInt(parts[2]);

      day = (day < 10 ? '0' : '') + day;
      month = (month < 10 ? '0' : '') + month;

      return `${year}-${month}-${day}`;
    }
  }

  static formatDate(date) {
    let dateInput = new Date(date);

    let day = dateInput.getDate();
    let month = dateInput.getMonth() + 1;
    let year = dateInput.getFullYear();

    day = (day < 10 ? '0' : '') + day;
    month = (month < 10 ? '0' : '') + month;


    return `${day}.${month}.${year}`;
  }

  static newDate() {
    let date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    day = (day < 10 ? '0' : '') + day;
    month = (month < 10 ? '0' : '') + month;

    return `${year}-${month}-${day}`;
  }
}