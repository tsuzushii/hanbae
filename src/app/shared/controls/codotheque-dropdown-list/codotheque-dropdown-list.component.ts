import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DisplayField, LabelLength, LocalizedLabel, SortDirection, SortField } from './models/codotheque-dropdown-list.types';
import { CodothequeService } from './services/codotheque.service';

@Component({
  selector: 'ag-codotheque-dropdown-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './codotheque-dropdown-list.component.html',
  styleUrl: './codotheque-dropdown-list.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodothequeDropdownListComponent),
      multi: true
    }
  ]
})
export class CodothequeDropdownListComponent implements OnInit, ControlValueAccessor {
  @Input() id = ''; // Element ID
  @Input() name = ''; // Element name attribute
  @Input() attribute = ''; // Codotheque attribute code
  @Input() displayField = DisplayField.CodeAndLabel;
  @Input() labelLength = LabelLength.Char25;
  @Input() allowNull = false;
  @Input() showValues = '';
  @Input() hideValues = '';
  @Input() min = '';
  @Input() max = '';
  @Input() sortField = SortField.None;
  @Input() sortDirection = SortDirection.None;
  @Input() cssClass = '';
  @Input() disabled = false;
  @Input() mockData: LocalizedLabel[] | null = null;

  @Output() selectedIndexChanged = new EventEmitter<string>();

  private codothequeService = inject(CodothequeService);

  public items: LocalizedLabel[] = [];
  public selectedValue = '';

  // ControlValueAccessor implementation
  private onChange: any = () => {};
  private onTouch: any = () => {};

  ngOnInit(): void {
    this.loadItems();
  }

  private loadItems(): void {
    if(this.mockData) {
      this.items = this.mockData;
      this.handleSelection();
      return;
    }
    
    this.codothequeService.getLabels(
      this.attribute, 
      this.labelLength, 
      this.sortField, 
      this.sortDirection,
      this.displayField,
      this.showValues,
      this.hideValues,
      this.min,
      this.max
    ).subscribe(labels => {
      this.items = labels;
      this.handleSelection();
    });
  }
  private handleSelection(): void {
    // If we have a value but it's not in the list, handle the error
    if (this.selectedValue && !this.items.some(item => item.code === this.selectedValue)) {
      console.error(`Selected value '${this.selectedValue}' was not found in the available options for attribute ${this.attribute}`);
      this.selectedValue = this.allowNull ? '' : (this.items.length > 0 ? this.items[0].code : '');
    }
    
    // If we don't allow null but no value is selected, select the first item
    if (!this.allowNull && !this.selectedValue && this.items.length > 0) {
      this.selectedValue = this.items[0].code;
      this.onChange(this.selectedValue);
    }
  }
  // Format the display text based on DisplayField setting
  public renderCaption(code: string, label: string): string {
    switch (this.displayField) {
      case DisplayField.Code:
        return code;
      case DisplayField.Label:
        return label;
      case DisplayField.CodeAndLabel:
      default:
        return `${code} - ${label}`;
    }
  }

  // Handle selection change
  public onSelectionChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedValue = select.value;
    this.onChange(this.selectedValue);
    this.onTouch();
    this.selectedIndexChanged.emit(this.selectedValue);
  }

  // ControlValueAccessor methods
  writeValue(value: string): void {
    this.selectedValue = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
