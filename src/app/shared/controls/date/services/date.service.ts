import { Injectable } from '@angular/core';

/**
 * Service for date operations, emulating functionality of the WebForms DateControl3
 */
@Injectable({
  providedIn: 'root'
})
export class DateService {
  
  constructor() { }
  
  /**
   * Checks if a date is valid
   * @param day Day of the month
   * @param month Month (1-12)
   * @param year Full year
   * @returns True if the date is valid
   */
  isValidDate(day: number, month: number, year: number): boolean {
    // Check for valid ranges
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return false;
    }
    
    if (month < 1 || month > 12) {
      return false;
    }
    
    // Get the number of days in the specified month
    const daysInMonth = this.getDaysInMonth(year, month);
    
    if (day < 1 || day > daysInMonth) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Gets the number of days in a month
   * @param year Full year
   * @param month Month (1-12)
   * @returns Number of days in the month
   */
  getDaysInMonth(year: number, month: number): number {
    // Month is 1-based but Date constructor expects 0-based
    return new Date(year, month, 0).getDate();
  }
  
  /**
   * Parses a date string in DD/MM/YYYY format
   * @param dateString Date string in DD/MM/YYYY format
   * @returns Date object or null if invalid
   */
  parseDate(dateString: string): Date | null {
    if (!dateString) {
      return null;
    }
    
    const parts = dateString.split('/');
    if (parts.length !== 3) {
      return null;
    }
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return null;
    }
    
    if (!this.isValidDate(day, month, year)) {
      return null;
    }
    
    // Month is 1-based but Date constructor expects 0-based
    return new Date(year, month - 1, day);
  }
  
  /**
   * Formats a Date object to a string in DD/MM/YYYY format
   * @param date Date object
   * @returns Formatted date string or empty string if date is invalid
   */
  formatDate(date: Date): string {
    if (!date || isNaN(date.getTime())) {
      return '';
    }
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    
    return `${day}/${month}/${year}`;
  }
  
  /**
   * Applies pivot year logic to a 2-digit year
   * @param year Year value (1-99)
   * @param pivotYear Pivot year threshold
   * @returns Full 4-digit year
   */
  applyPivotYear(year: number, pivotYear: number): number {
    if (pivotYear < 0 || year >= 100) {
      return year;
    }
    
    if (year < pivotYear) {
      return year + 2000;
    } else {
      return year + 1900;
    }
  }
}
