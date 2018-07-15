import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {
  formatBytes(size, precision = 1) {
    size = +size;
    if (isNaN(size) || size < 0) {
      return '-';
    }
    const units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
    const n = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, n)).toFixed(precision) +  ' ' + units[n];
  }
}
