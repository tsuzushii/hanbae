import { AgTranslateService } from "@ag/vc.ag-core/translate";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Severity } from "../layout/error-container/models/error.types";
import { ErrorDisplayService } from "../layout/error-container/services/error-display.service";
import { ToolbarService } from '../layout/toolbar/services/toolbar.service';
import { InsuredPerson } from "./models/insured-person.model";

@Injectable()
export class TarifPresenter {
  tarifForm: FormGroup; 
  listOfAssured: InsuredPerson[] = []; // This would be populated from API/model in a real implementation
  
  // Translation keys
  private readonly TRANSLATION_KEYS = {
    ASSURE_PREFIX: 'OLEH1000',
    FIRSTNAME_REQUIRED: 'OLEH1002',
    FIRSTNAME_CAPITALIZATION: 'GRE00814',
    GENDER_REQUIRED: 'OLEH1003',
    DOB_REQUIRED: 'OLEH1004',
    DOB_INVALID: 'OLEH1005',
    DOB_FUTURE: 'OLEH1006',
    DOB_AFTER_CONTRACT: 'OLEH1007',
    DOB_AGE_LIMIT: 'OLEH1008',
    POSTALCODE_REQUIRED: 'OLEH1009',
    RELATION_REQUIRED: 'OLEH1010',
    DOMICILIATION_REQUIRED_LIB: 'OLEH1012Lib',
    DOMICILIATION_REQUIRED: 'OLEH1012',
    EMPTY_LIST: 'OLEH1001'
  };
  
  // Contract details
  contractEffectiveDate = new Date(); // This would come from the model
  isAtleastOneNormal = false;
  isAtleastOneVision = false;
  passageFMObligatoire = false;

  constructor(
    private readonly toolbar: ToolbarService,
    private readonly errorDisplayService: ErrorDisplayService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly translateService: AgTranslateService
  ) {
    this.tarifForm = this.fb.group({
      firstName: ['', Validators.required],
      TextBoxPostalCode: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      mutuelle: ['', Validators.required],
      cover: ['', Validators.required]
    });
    
    // Set today's date as the contract effective date for demo
    // In a real app, this would come from a service
    this.contractEffectiveDate = new Date();
  }
  
  /**
   * Maps view data to the model
   * @param insuredPersons List of insured persons from the view
   */
  mapViewToModel(insuredPersons: InsuredPerson[]): void {
    this.listOfAssured = [...insuredPersons];
    
    // Reset flags
    this.isAtleastOneNormal = false;
    this.isAtleastOneVision = false;
    
    // Update flags based on cover types
    for (const person of insuredPersons) {
      if (person.coverType === 1) {
        this.isAtleastOneNormal = true;
      }
      if (person.coverType === 2) {
        this.isAtleastOneVision = true;
      }
    }
    
    // In a real implementation, this would update the backend model
    console.log('Updated model with insured persons:', this.listOfAssured);
  }
  
  /**
   * Marks an insured person for deletion in the model
   * @param assuredNumber The number of the insured person to mark for deletion
   */
  markAssureForDeletion(assuredNumber: number): void {
    const index = this.listOfAssured.findIndex(p => p.assuredNumber === assuredNumber);
    if (index >= 0) {
      this.listOfAssured[index].action = 'D';
      console.log(`Marked insured person ${assuredNumber} for deletion`);
    }
  }
  
  /**
   * Checks if the effective date is greater than one month from now
   * @returns true if the effective date is more than one month in the future
   */
  isEffectiveDateGreaterThanOneMonth(): boolean {
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    return this.contractEffectiveDate > oneMonthFromNow;
  }
  
  /**
   * Determines the next step in the workflow
   */
  deduceNextStep(): void {
    // In a real implementation, this would determine the next page/step
    console.log('Proceeding to next step');
    
    // Example implementation:
    // this.router.navigate(['/tarif/premies']);
  }
  
  /**
   * Process event - typically navigates to next page/step
   */
  processEvent(): void {
    console.log('Processing event');
    // In a real implementation, this would navigate to the next page
    // this.router.navigate(['/next-page']);
  }
  
  /**
   * Validates a date string
   * @param dateString Date string in format DD/MM/YYYY
   * @returns true if the date is valid
   */
  isValidDate(dateString: string): boolean {
    if (!dateString || dateString === '//') return false;
    
    const dateParts = dateString.split('/');
    if (dateParts.length !== 3) return false;
    
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // JavaScript months are 0-based
    const year = parseInt(dateParts[2], 10);
    
    const date = new Date(year, month, day);
    
    return (
      date.getDate() === day &&
      date.getMonth() === month &&
      date.getFullYear() === year
    );
  }
  
  /**
   * Saves data to the backend
   * @returns true if successful
   */
  saveOnDB(): boolean {
    // In a real implementation, this would make API calls
    console.log('Saving data to DB');
    return true;
  }
  
  /**
   * Checks whether to show the medical acceptation popup
   * @returns true if the medical acceptation popup should be shown
   */
  showAcceptationMedical(): boolean {
    // For demo purposes, we're returning false
    // In a real implementation, this would check the model
    return false;
  }
  
  /**
   * Get a translation by key
   * @param key The translation key
   * @returns The translated string or the key if not found
   */
  private getTranslation(key: string): string {
    // This is a synchronous method that returns the translation or the key if not found
    // We're using a simple fallback here for demo purposes
    // In a real app, you'd probably want to pre-load all translations
    try {
      // Get current translations from service - this is a workaround since we can't use instant()
      const currentLang = this.translateService.currentLang;
      const translations = (this.translateService as any)._translations[currentLang]?.translations;
      console.log(translations.key);
      console.log(key);
      return translations?.[key] || key;
    } catch (e) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }
  
  /**
   * Validates the entire form
   * Based on ValidateData from the C# code
   * @param insuredPersons The list of insured persons to validate
   * @returns True if the data is valid, false otherwise
   */
  validateData(insuredPersons: InsuredPerson[]): boolean {
    this.errorDisplayService.removeAllNotifications();
    let isValid = true;
    let countWarning = 0;
    const errorList: any[] = [];
    
    // Loop through each insured person and validate
    for (let countAsu = 0; countAsu < insuredPersons.length; countAsu++) {
      const insured = insuredPersons[countAsu];
      const assure = this.getTranslation(this.TRANSLATION_KEYS.ASSURE_PREFIX) + (countAsu + 1).toString() + ':';
      
      // Get control IDs for error display
      const firstNameId = `TextBoxFirstName${countAsu}`;
      const genderId = `ddlSex${countAsu}`;
      const dobId = `UCDateOfBirth_datecontrol_DayBox${countAsu}`;
      const postalCodeId = `TextBoxPostalCode${countAsu}`;
      const relationId = `ddlRelation${countAsu}`;
      const domiciliationId = `ddlDomiciliation${countAsu}`;
      
      // Check first name
      if (!insured.firstName) {
        console.log(firstNameId);
        errorList.push({
          message: assure + this.getTranslation(this.TRANSLATION_KEYS.FIRSTNAME_REQUIRED),
          severity: Severity.Error,
          detail: this.getTranslation(this.TRANSLATION_KEYS.FIRSTNAME_REQUIRED),
          code: this.TRANSLATION_KEYS.FIRSTNAME_REQUIRED,
          controlId: firstNameId
        });
      } else if (insured.firstName === insured.firstName.toLowerCase()) {
        errorList.push({
          message: assure + this.getTranslation(this.TRANSLATION_KEYS.FIRSTNAME_CAPITALIZATION),
          severity: Severity.Error,
          detail: this.getTranslation(this.TRANSLATION_KEYS.FIRSTNAME_CAPITALIZATION),
          code: this.TRANSLATION_KEYS.FIRSTNAME_CAPITALIZATION,
          controlId: firstNameId
        });
      }
      
      // Check gender
      if (insured.gender === 0) {
        errorList.push({
          message: assure + this.getTranslation(this.TRANSLATION_KEYS.GENDER_REQUIRED),
          severity: Severity.Error,
          detail: this.getTranslation(this.TRANSLATION_KEYS.GENDER_REQUIRED),
          code: this.TRANSLATION_KEYS.GENDER_REQUIRED,
          controlId: genderId
        });
      }
      
      // Check DOB (would be implemented for a real date control)
      // Currently skipped as there's no proper date implementation
      
      // Check postal code
      if (!insured.postalCode || insured.postalCode.length !== 4) {
        errorList.push({
          message: assure + this.getTranslation(this.TRANSLATION_KEYS.POSTALCODE_REQUIRED),
          severity: Severity.Error,
          detail: this.getTranslation(this.TRANSLATION_KEYS.POSTALCODE_REQUIRED),
          code: this.TRANSLATION_KEYS.POSTALCODE_REQUIRED,
          controlId: postalCodeId
        });
      } else {
        const postalCodeInt = parseInt(insured.postalCode, 10);
        if (postalCodeInt < 1000 || postalCodeInt >= 9999) {
          errorList.push({
            message: assure + this.getTranslation(this.TRANSLATION_KEYS.POSTALCODE_REQUIRED),
            severity: Severity.Error,
            detail: this.getTranslation(this.TRANSLATION_KEYS.POSTALCODE_REQUIRED),
            code: this.TRANSLATION_KEYS.POSTALCODE_REQUIRED,
            controlId: postalCodeId
          });
        }
      }
      
      // Check relation for all except first insured
      if (countAsu > 0 && insured.relationNumber === 0) {
        errorList.push({
          message: assure + this.getTranslation(this.TRANSLATION_KEYS.RELATION_REQUIRED),
          severity: Severity.Error,
          detail: this.getTranslation(this.TRANSLATION_KEYS.RELATION_REQUIRED),
          code: this.TRANSLATION_KEYS.RELATION_REQUIRED,
          controlId: relationId
        });
      }
      
      // Check domiciliation for first insured
      if (countAsu === 0 && insured.isPaymentBankDomiciliation === 0) {
        errorList.push({
          message: this.getTranslation(this.TRANSLATION_KEYS.DOMICILIATION_REQUIRED_LIB) + ':' + 
                  this.getTranslation(this.TRANSLATION_KEYS.DOMICILIATION_REQUIRED),
          severity: Severity.Error,
          detail: this.getTranslation(this.TRANSLATION_KEYS.DOMICILIATION_REQUIRED),
          code: this.TRANSLATION_KEYS.DOMICILIATION_REQUIRED,
          controlId: domiciliationId
        });
      }
    }
    
    // Check if list is empty
    if (insuredPersons.length === 0) {
      errorList.push({
        message: this.getTranslation(this.TRANSLATION_KEYS.EMPTY_LIST),
        severity: Severity.Error,
        detail: this.getTranslation(this.TRANSLATION_KEYS.EMPTY_LIST),
        code: this.TRANSLATION_KEYS.EMPTY_LIST,
        controlId: 'ButtonNewInsured'
      });
    }
    
    // Add all errors to the error display service
    if (errorList.length > 0) {
      for (const error of errorList) {
        if (error.severity === Severity.Warning || error.severity === Severity.Notification) {
          countWarning++;
        }
        
        this.errorDisplayService.addNotification(
          error.message,
          error.severity,
          error.detail,
          error.code,
          error.controlId
        );
      }
      
      // If all errors are warnings or notifications, isValid is still true
      if (countWarning === errorList.length) {
        isValid = true;
      } else {
        isValid = false;
      }
    }
    
    return isValid;
  }
  
  /**
   * Validates an empty list
   * @param buttonId The ID of the button to focus when displaying the error
   * @returns An array of error objects
   */
  validateEmptyList(buttonId: string): any[] {
    return [{
      message: this.getTranslation(this.TRANSLATION_KEYS.EMPTY_LIST),
      severity: Severity.Error,
      detail: this.getTranslation(this.TRANSLATION_KEYS.EMPTY_LIST),
      code: this.TRANSLATION_KEYS.EMPTY_LIST,
      controlId: buttonId
    }];
  }
}