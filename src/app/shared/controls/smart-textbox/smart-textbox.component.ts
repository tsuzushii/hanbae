// smart-textbox.component.ts
import { NgClass } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AutoTabbingEnum, CharacterCaseEnum } from './models/smart-textbox.types';

@Component({
  selector: 'ag-smart-textbox',
  standalone: true,
  imports: [NgClass, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SmartTextboxComponent),
      multi: true
    }
  ],
  templateUrl: './smart-textbox.component.html',
  styleUrl: './smart-textbox.component.scss'
})
export class SmartTextboxComponent implements OnInit, OnChanges, ControlValueAccessor {
  @ViewChild('textInput') textInput!: ElementRef<HTMLInputElement | HTMLTextAreaElement>;
  @Input() textMode: 'SingleLine' | 'MultiLine' | 'Password' = 'SingleLine';
  @Input() id = '';
  @Input() width: string = '';
  @Input() height: string = '';
  @Input() tabIndex: number = 0;
  @Input() rows: number = 3;
  @Input() cols: number = 20;
  @Input() maxLength: number = 0;
  @Input() validateWhiteSpace: boolean = true;
  @Input() characterCase: CharacterCaseEnum = CharacterCaseEnum.Mixed;
  @Input() autoTabbing: AutoTabbingEnum = AutoTabbingEnum.None;
  @Input() mask: string = '';
  @Input() validCharacterValues: string = '';
  @Input() nextTabElementId: string = '';
  @Input() cssClass: string = 'inputFields';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;

  // For ControlValueAccessor
  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};
  value: string = '';

  // Track keydown state
  private isNewKeyDown: boolean = false;
  private isAllowedChar: boolean = true;
  
  // RegExp for whitespace validation
  private onlySpacesRegExp = /^\s*$/;

  // Placeholder mappings for culture (will be properly initialized in ngAfterViewInit)
  private placeholderMapping: { [key: string]: string } = {
    '.': '.',
    ':': ':',
    '/': '/'
  };

  constructor() {}

  ngOnInit(): void {
    // Initialize with default values if needed
    if (this.value === undefined) {
      this.value = '';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['validCharacterValues']) {
    }
  }

  ngAfterViewInit(): void {
    // Initialize placeholder mappings with culture-specific values
    const currentCulture = navigator.language || 'en-US';
    const formatter = new Intl.NumberFormat(currentCulture);
    const dateFormatter = new Intl.DateTimeFormat(currentCulture);
    
    // Extract decimal separator
    const parts = formatter.formatToParts(1.1);
    const decimalPart = parts.find(part => part.type === 'decimal');
    if (decimalPart) {
      this.placeholderMapping['.'] = decimalPart.value;
    }
    
    // Get date format parts
    const dateParts = dateFormatter.formatToParts(new Date());
    const dateSeparator = dateParts.find(part => part.type === 'literal');
    if (dateSeparator) {
      this.placeholderMapping['/'] = dateSeparator.value;
    }
    
    // Time separator (using a fixed value since it's harder to extract)
    this.placeholderMapping[':'] = ':';
    
    // Set initial value to the input element if needed
    if (this.value && this.textInput?.nativeElement) {
      this.textInput.nativeElement.value = this.value;
    }
  }

  // Implement ControlValueAccessor methods
  writeValue(value: string): void {
    this.value = value || '';
    
    // Apply mask if specified
    if (this.mask && this.value) {
      try {
        this.value = this.applyMask(this.value);
      } catch (ex) {
        console.error('Error applying mask:', ex);
      }
    }
    
    // If the textInput exists, update its value directly as well
    if (this.textInput?.nativeElement) {
      this.textInput.nativeElement.value = this.value;
    }
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Public method to update the value - can be called from template
  setValue(value: string): void {
    this.value = value;
    this._onChange(value);
  }

  // Event handlers
  onKeyDown(event: KeyboardEvent): void {
    this.isNewKeyDown = true;
    this.isAllowedChar = true;
  }

  onKeyPress(event: KeyboardEvent): boolean {
    if (!event.key) return true;
    
    const charCode = event.key.charCodeAt(0);    
    // Check maxLength
    if (this.maxLength > 0 && charCode > 31) {
      const selectedText = this.getSelectedText();
      if (this.value.length >= this.maxLength && selectedText.length < 1) {
        event.preventDefault();
        return false;
      }
    }
    
    // Check if it's a valid character
    if (!this.isValidChar(charCode)) {
      this.isAllowedChar = false;
      event.preventDefault();
      return false;
    }
    
    return true;
  }

  onKeyUp(event: KeyboardEvent): void {
    // Log the current value for debugging    
    if (!event.key) return;
    const charCode = event.key.charCodeAt(0);
    
    // Handle character casing
    if (charCode > 46) {
      const pos = this.getCaretPosition();
      
      switch (this.characterCase) {
        case CharacterCaseEnum.LowerCase:
          this.setValue(this.value.toLowerCase());
          this.setCaretPosition(pos);
          break;
        case CharacterCaseEnum.UpperCase:
          this.setValue(this.value.toUpperCase());
          this.setCaretPosition(pos);
          break;
      }
    }
    
    // Handle auto-tabbing
    if (this.isNewKeyDown && 
        this.autoTabbing !== AutoTabbingEnum.None && 
        this.nextTabElementId && 
        this.maxLength > 0) {
      if (this.value.length === this.maxLength && charCode > 46) {
        if (this.isAllowedChar) {
          const nextElement = document.getElementById(this.nextTabElementId);
          if (nextElement) {
            nextElement.focus();
            if (this.autoTabbing === AutoTabbingEnum.Select && nextElement instanceof HTMLInputElement) {
              nextElement.select();
            }
          }
        }
      }
    }
    
    this.isNewKeyDown = false;
  }

  onBlur(): void {
    this._onTouched();
    
    // Apply mask if specified
    if (this.mask) {
      try {
        const resultText = this.applyMask(this.value);
        if (this.value !== resultText) {
          this.setValue(resultText);
          // Trigger another blur event to ensure any external logic runs
          this.fireEvent('blur');
        }
      } catch (ex) {
        console.error('Error applying mask:', ex);
        // Refocus on error
        if (this.textInput?.nativeElement) {
          this.textInput.nativeElement.focus();
        }
      }
    }
  }

  onPaste(event: ClipboardEvent): void {
    if (!event.clipboardData) return;
    
    const pastedText = event.clipboardData.getData('text');    
    // Check maxLength
    if (this.maxLength > 0) {
      const selectedText = this.getSelectedText();
      if (this.value.length + pastedText.length - selectedText.length > this.maxLength) {
        // Only allow paste up to maxLength
        const allowedText = pastedText.substring(0, this.maxLength - this.value.length + selectedText.length);
        
        // Prevent default and manually insert truncated text
        event.preventDefault();
        
        // Check if all characters are valid
        for (let i = 0; i < allowedText.length; i++) {
          const charCode = allowedText.charCodeAt(i);
          if (!this.isValidChar(charCode)) {
            return; // Don't paste if invalid chars
          }
        }
        
        // Insert the truncated text
        this.insertText(allowedText);
        return;
      }
    }
    
    // Check if all characters are valid
    let allValid = true;
    for (let i = 0; i < pastedText.length; i++) {
      const charCode = pastedText.charCodeAt(i);
      if (!this.isValidChar(charCode)) {
        allValid = false;
        break;
      }
    }
    
    if (!allValid) {
      event.preventDefault();
    }
  }

  // Handle direct input event from HTML
  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.setValue(inputElement.value);
  }

  // Helper methods
  private insertText(text: string): void {
    if (!this.textInput?.nativeElement) return;
    
    const input = this.textInput.nativeElement;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    
    const newValue = this.value.substring(0, start) + text + this.value.substring(end);
    this.setValue(newValue);
    
    // Set the cursor position
    setTimeout(() => {
      if (input.selectionStart !== undefined && input.selectionEnd !== undefined) {
        input.selectionStart = input.selectionEnd = start + text.length;
      }
    });
  }

  private getSelectedText(): string {
    if (!this.textInput?.nativeElement) return '';
    
    const input = this.textInput.nativeElement;
    if (input.selectionStart !== undefined && input.selectionEnd !== undefined) {
      return this.value.substring(input.selectionStart, input.selectionEnd);
    }
    return '';
  }

  private getCaretPosition(): number {
    return this.textInput?.nativeElement?.selectionStart || 0;
  }

  private setCaretPosition(position: number): void {
    const input = this.textInput?.nativeElement;
    if (!input || !input.setSelectionRange) return;
    
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(position, position);
    }, 0);
  }

  private isValidChar(charCode: number): boolean {
    // Always allow control characters (< 31)
    if (charCode < 31) {
      return true;
    }
    
    // If no validation rules are specified, allow all characters
    if (!this.validCharacterValues) {
      return true;
    }
    
    // Parse the validation rules
    const elements = this.validCharacterValues.split(',');
    
    // Check each element (single value or range)
    for (const element of elements) {
      if (element.includes('-')) {
        // Handle range
        const [first, second] = element.split('-').map(val => parseInt(val, 10));
        
        // Ensure proper order (like in the C# code)
        const min = Math.min(first, second);
        const max = Math.max(first, second);
        
        if (charCode >= min && charCode <= max) {
          return true;
        }
      } else if (element) {
        // Handle single value
        const value = parseInt(element, 10);
        if (charCode === value) {
          return true;
        }
      }
    }
    
    // Character is not in any of the allowed values/ranges
    return false;
  }

  private fireEvent(eventName: string): void {
    const input = this.textInput?.nativeElement;
    if (!input) return;
    
    const event = new Event(eventName, {
      bubbles: true,
      cancelable: true,
    });
    input.dispatchEvent(event);
  }

  /**
   * Applies a mask to the input text
   * Implementation based on the original WebForms SmartTextBox's JS
   */
  private applyMask(originalText: string): string {
    if (originalText.length === 0) return '';
    if (this.mask.length === 0) return originalText;
    if (!this.validateWhiteSpace && this.onlySpacesRegExp.test(originalText)) return '';
      
    let adaptedText = originalText;
    const indexText = adaptedText.indexOf(this.placeholderMapping["."]);
    const indexMask = this.mask.indexOf(".");
    
    if (indexMask >= 0) {
      // Handle decimal mask (for numbers)
      if (indexText < 0) {
        adaptedText = adaptedText + this.placeholderMapping["."];
      }
  
      if (adaptedText.length > this.mask.length) {
        throw new Error(`Text "${adaptedText}" is longer than the mask "${this.mask}".`);
      }

      // Add leading zeros
      for (let i = indexMask - adaptedText.indexOf(this.placeholderMapping["."]) - 1; i >= 0; i--) {
        if (this.mask.charAt(i) === '0') {
          adaptedText = '0' + adaptedText;
        }
      }
  
      // Add trailing zeros
      let nbrAddChar = 0;
      for (let i = indexMask + 1; i <= this.mask.length; i++) {
        if (this.mask.charAt(i) === '0') {
          nbrAddChar++;
        }
      }
      
      const decimalIndex = adaptedText.indexOf(this.placeholderMapping["."]);
      if (decimalIndex >= 0) {
        nbrAddChar = nbrAddChar - (adaptedText.length - decimalIndex - 1);
        adaptedText = adaptedText + '0'.repeat(Math.max(0, nbrAddChar));
      }
      
      // Check final length
      const finalDecimalIndex = adaptedText.indexOf(this.placeholderMapping["."]);
      if ((adaptedText.length > this.mask.length) || 
          (finalDecimalIndex > indexMask) || 
          ((adaptedText.length - finalDecimalIndex) > (this.mask.length - indexMask))) {
        throw new Error(`Text "${originalText}" is longer than the mask "${this.mask}".`);
      } else {
        return adaptedText;
      }
    } else {
      // Handle non-decimal masks
      let textIndex = adaptedText.length - 1;

      for (let maskIndex = this.mask.length - 1; (maskIndex >= 0) && (adaptedText.length <= this.mask.length); maskIndex--) {
        switch(this.mask.charAt(maskIndex)) {
          case '0': // Digit, required
            if (/[0-9]/.test(adaptedText.charAt(textIndex))) {
              textIndex--;
            } else {
              adaptedText = this.insertStringIntoString(adaptedText, '0', textIndex);
            }
            break;
          case '9': // Digit or space, optional
            if (/[ 0-9]/.test(adaptedText.charAt(textIndex))) {
              textIndex--;
            }
            break;
          case 'L': // Letter, required
            if (/[a-zA-Z]/.test(adaptedText.charAt(textIndex))) {
              textIndex--;
            } else {
              adaptedText = this.insertStringIntoString(adaptedText, 'a', textIndex);
            }
            break;
          case '?': // Letter, optional
            if (/[a-zA-Z]/.test(adaptedText.charAt(textIndex))) {
              textIndex--;
            }
            break;
          case 'A': // Alphanumeric, required
            if (/[a-zA-Z\u0080-\uffff]/.test(adaptedText.charAt(textIndex))) {
              textIndex--;
            } else {
              adaptedText = this.insertStringIntoString(adaptedText, 'a', textIndex);
            }
            break;
          case 'a': // Alphanumeric, optional
            if (/[a-zA-Z\u0080-\uffff]/.test(adaptedText.charAt(textIndex))) {
              textIndex--;
            }
            break;
          case '.':
          case ':':
          case '/':
            if (adaptedText.charAt(textIndex) === this.placeholderMapping[this.mask.charAt(maskIndex)]) {
              textIndex--;
            } else {
              adaptedText = this.insertStringIntoString(adaptedText, this.placeholderMapping[this.mask.charAt(maskIndex)], textIndex);
            }
            break;
          case '-':
            if (adaptedText.charAt(textIndex) === '-') {
              textIndex--;
            } else {
              adaptedText = this.insertStringIntoString(adaptedText, '-', textIndex);
            }
            break;
          default:
            throw new Error(`"${this.mask}" is not a valid mask.`);
        }
      }
      
      if (textIndex >= 0) {
        throw new Error(`Text "${originalText}" does not fit the mask "${this.mask}".`);
      }
  
      if (adaptedText.length <= this.mask.length) {
        return adaptedText;
      } else {
        throw new Error(`Text "${originalText}" does not fit the mask "${this.mask}".`);
      }
    }
  }

  private insertStringIntoString(originalString: string, insertFragment: string, position: number): string {
    return originalString.substring(0, position + 1) + insertFragment + originalString.substring(position + 1);
  }
}
