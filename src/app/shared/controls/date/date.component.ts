
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { AutoTabbingEnum } from '../smart-textbox/models/smart-textbox.types';
import { SmartTextboxComponent } from '../smart-textbox/smart-textbox.component';
import { DateService } from './services/date.service';


/**
 * Date component that emulates the WebForms DateControl3 control
 */
@Component({
  selector: 'ag-date',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SmartTextboxComponent],
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateComponent),
      multi: true
    }
  ]
})
export class DateComponent implements OnInit, ControlValueAccessor {
  @Input() id: string = '';
  @Input() width: string = '50px';
  @Input() pivotYear: number = 30;
  @Input() allowCalendar: boolean = false;
  @Input() autoTabbing: AutoTabbingEnum = AutoTabbingEnum.Select;
  @Input() cssClass: string = 'inputFields';
  @Input() disabled: boolean = false;
  @Input() separatorText: string = '/';
  @Input() minDate: Date = new Date(1, 0, 1); // 1/1/0001
  @Input() maxDate: Date = new Date(2999, 11, 31); // Apparently this the max date for the MF
  
  @Output() textChanged = new EventEmitter<Event>();
  
  @ViewChild('dayBox') dayBox: SmartTextboxComponent;
  @ViewChild('monthBox') monthBox: SmartTextboxComponent;
  @ViewChild('yearBox') yearBox: SmartTextboxComponent;
  
  dayValue: string = '';
  monthValue: string = '';
  yearValue: string = '';
  
  autoTabbingEnum = AutoTabbingEnum;
  isValid: boolean = true;
  isEmpty: boolean = true;
  
  // For ControlValueAccessor
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  
  constructor(
    private dateService: DateService
  ) {}
  
  ngOnInit(): void {
    // Nothing to initialize here, as we're using direct binding to the SmartTextbox components
  }
  
  /**
   * Checks if the current date is valid and/or empty
   */
  private checkValidAndEmpty(): void {
    // Check if all fields are empty
    this.isEmpty = !this.dayValue && !this.monthValue && !this.yearValue;
    
    // If any field is provided, all fields must be provided and valid
    if (!this.isEmpty) {
      if (!this.dayValue || !this.monthValue || !this.yearValue) {
        this.isValid = false;
        return;
      }
      
      const dayNum = parseInt(this.dayValue, 10);
      const monthNum = parseInt(this.monthValue, 10);
      const yearNum = parseInt(this.yearValue, 10);
      
      // Apply pivot year if needed
      const adjustedYear = this.applyPivotYear(yearNum);
      
      // Validate that date is valid
      const validDate = this.dateService.isValidDate(dayNum, monthNum, adjustedYear);
      
      if (!validDate) {
        this.isValid = false;
        return;
      }
      
      // Validate against min/max dates
      const dateValue = new Date(adjustedYear, monthNum - 1, dayNum);
      this.isValid = dateValue >= this.minDate && dateValue <= this.maxDate;
    } else {
      // Empty values are considered valid
      this.isValid = true;
    }
  }
  
  /**
   * Apply the pivot year logic to a 2-digit year
   */
  private applyPivotYear(year: number): number {
    if (this.pivotYear < 0 || year >= 100) {
      return year;
    }
    
    if (year < this.pivotYear) {
      return year + 2000;
    } else {
      return year + 1900;
    }
  }
  
  /**
   * Formats the date value from day, month, year parts
   */
  private formatDate(): string | null {
    if (!this.dayValue || !this.monthValue || !this.yearValue) {
      return null;
    }
    
    // Apply pivot year if needed
    const yearNum = parseInt(this.yearValue, 10);
    const adjustedYear = this.applyPivotYear(yearNum);
    
    return `${this.dayValue.padStart(2, '0')}/${this.monthValue.padStart(2, '0')}/${adjustedYear}`;
  }
  
  /**
   * Parses a date string into day, month, year form values
   */
  private parseDate(value: string): void {
    if (!value) {
      this.dayValue = '';
      this.monthValue = '';
      this.yearValue = '';
      return;
    }
    
    const parts = value.split('/');
    if (parts.length === 3) {
      this.dayValue = parts[0].padStart(2, '0');
      this.monthValue = parts[1].padStart(2, '0');
      this.yearValue = parts[2];
    }
  }
  
  // Handlers for each SmartTextbox
  onDayChanged(value: string): void {
    this.dayValue = value;
    this.updateModel();
  }
  
  onMonthChanged(value: string): void {
    this.monthValue = value;
    this.updateModel();
  }
  
  onYearChanged(value: string): void {
    this.yearValue = value;
    this.updateModel();
  }
  
  private updateModel(): void {
    this.checkValidAndEmpty();
    
    const newDate = this.formatDate();
    this.onChange(newDate);
  }
  
  // ControlValueAccessor methods
  writeValue(value: any): void {
    if (value instanceof Date) {
      this.dayValue = value.getDate().toString().padStart(2, '0');
      this.monthValue = (value.getMonth() + 1).toString().padStart(2, '0');
      this.yearValue = value.getFullYear().toString();
    } else if (typeof value === 'string') {
      this.parseDate(value);
    } else {
      this.dayValue = '';
      this.monthValue = '';
      this.yearValue = '';
    }
    
    this.checkValidAndEmpty();
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  
  /**
   * Gets the date value as a string
   */
  getStringValue(): string {
    return this.formatDate();
  }
  
  /**
   * Sets the date value from a string
   */
  setStringValue(value: string): void {
    this.parseDate(value);
    this.updateModel();
  }
  
  /**
   * Adds a CSS class to the inputs
   */
  addCssClass(className: string): void {
    this.cssClass = `${this.cssClass} ${className}`.trim();
  }
  
  /**
   * Sets focus to the day input
   */
  setFocus(): void {
    if (this.dayBox) {
      const dayInput = document.getElementById(this.id + '_datecontrol_DayBox') as HTMLInputElement;
      if (dayInput) {
        dayInput.focus();
      }
    }
  }
  
  /**
   * Clears all the inputs
   */
  clear(): void {
    this.dayValue = '';
    this.monthValue = '';
    this.yearValue = '';
    this.isEmpty = true;
    this.isValid = true;
    this.updateModel();
  }
}
