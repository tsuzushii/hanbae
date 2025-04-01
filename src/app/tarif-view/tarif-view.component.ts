import { AgTranslateModule } from '@ag/vc.ag-core/translate';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Severity } from '../layout/error-container/models/error.types';
import { ErrorDisplayService } from '../layout/error-container/services/error-display.service';
import { ToolbarService } from '../layout/toolbar/services/toolbar.service';
import { CodothequeDropdownListComponent } from "../shared/controls/codotheque-dropdown-list/codotheque-dropdown-list.component";
import { DisplayField, LocalizedLabel } from '../shared/controls/codotheque-dropdown-list/models/codotheque-dropdown-list.types';
import { DateComponent } from '../shared/controls/date/date.component';
import { SmartTextboxComponent } from '../shared/controls/smart-textbox/smart-textbox.component';
import { InsuredPerson } from './models/insured-person.model';
import { TarifPresenter } from './tarif.presenter';

@Component({
  selector: 'ag-tarif-view',
  standalone: true,
  imports: [
    CommonModule, 
    SmartTextboxComponent, 
    FormsModule, 
    ReactiveFormsModule, 
    CodothequeDropdownListComponent, 
    AgTranslateModule,
    DateComponent
  ],
  templateUrl: './tarif-view.component.html',
  styleUrl: './tarif-view.component.scss',
  viewProviders: [TarifPresenter]
})
export class TarifViewComponent implements OnInit {
  test = DisplayField.Label;
  
  // Model for insured persons list
  insuredPersons: InsuredPerson[] = [];
  
  // Mock data for dropdowns
  mutuelleLabels: LocalizedLabel[] = [
    {code: '01', label: 'K+G'},
  ];  
  
  coverLabels: LocalizedLabel[] = [
    {code: '1', label: 'Normaal'},
    {code: '2', label: 'Vision'},
  ];

  // Add other properties as needed
  showPopupAcceptationMedical = false;
  domiciliationId = '';
  error = '';
  isEffDate = false;

  public get TarifForm(): FormGroup {
    return this._presenter.tarifForm;
  }
  
  constructor(
    private readonly _presenter: TarifPresenter,
    private readonly fb: FormBuilder,
    private readonly toolbarService: ToolbarService,
    private readonly errorDisplayService: ErrorDisplayService
  ) {}

  ngOnInit(): void {
    // Subscribe to toolbar button clicks
    this.toolbarService.nextClicked$.subscribe(() => {
      this.onNextClicked();
    });
    
    this.toolbarService.saveClicked$.subscribe(() => {
      this.onSaveClicked();
    });
    
    // Initialize insured list if empty
    if (this.insuredPersons.length === 0) {
      this.addFirstRowToList();
    }
    
    // Check if the medical acceptation popup should be shown
    this.showPopupAcceptationMedical = this._presenter.showAcceptationMedical();
  }

  /**
   * Handle Next button click
   * Based on ButtonNext_Click from the C# code
   */
  onNextClicked() {
    console.log('Next button clicked');
    this.errorDisplayService.removeAllNotifications();
    
    // Perform full validation of entered data using the presenter
    if (this._presenter.validateData(this.insuredPersons)) {
      // Map view data to model
      this._presenter.mapViewToModel(this.insuredPersons);
      
      // Navigate to next step
      this._presenter.deduceNextStep();
      this._presenter.processEvent();
    } else {
      // Get client IDs for domiciliation dropdown
      this.getClientIDs();
      
      // Set error flag to "1" to be used for domiciliation notification
      this.error = "1";
    }
  }

  /**
   * Handle Save button click
   * Based on ButtonSave_Click from the C# code
   */
  onSaveClicked() {
    console.log('Save button clicked');
    this.errorDisplayService.removeAllNotifications();
    
    try {
      // Validate data using the presenter
      if (this._presenter.validateData(this.insuredPersons)) {
        // Map view data to model
        this._presenter.mapViewToModel(this.insuredPersons);
        
        // Save to database
        const noErrors = this._presenter.saveOnDB();
        
        if (noErrors) {
          // Success case - would show success message
          console.log('Saved successfully');
          // In the original C# code: SaveContract()
        }
      }
    } catch (error) {
      console.error('Error saving data:', error);
      this.errorDisplayService.addNotification(
        'Error saving data',
        Severity.Error,
        'An unexpected error occurred while saving your data.',
        'SAVE001',
        ''
      );
    }
  }

  /**
   * Handles adding a new insured person
   * Direct implementation of ButtonNewInsured_Click from the C# code
   */
  buttonNewInsuredClick() {
    console.log('New insured button clicked');
    
    try {
      // Create a new dataset for insured persons
      const dtAssure: InsuredPerson[] = [];
      
      // Loop through existing insured persons and add to temporary array
      for (let i = 0; i < this.insuredPersons.length; i++) {
        const person = this.insuredPersons[i];
        
        // Special handling for first person's domiciliation
        if (i === 0) {
          // Check if effective date is greater than 1 month from current date
          const domSelect = document.getElementById(`ddlDomiciliation${i}`) as HTMLSelectElement;
          if (domSelect && domSelect.value === '0') {
            this.isEffDate = this._presenter.isEffectiveDateGreaterThanOneMonth();
          } else {
            this.isEffDate = false;
          }
        }
        
        // Add to temporary array
        dtAssure.push({...person});
      }
      
      // Create a new insured person
      const newPerson: InsuredPerson = {
        firstName: '',
        gender: 0,
        postalCode: '',
        mutualType: '01',
        coverType: 1,
        relationNumber: 0,
        isPaymentBankDomiciliation: 0,
        assuredNumber: this.insuredPersons.length,
        newAssure: '1'
      };
      
      // If we have existing insured persons, copy some values from the first one
      if (this.insuredPersons.length > 0) {
        newPerson.postalCode = this.insuredPersons[0].postalCode;
        newPerson.mutualType = this.insuredPersons[0].mutualType;
        newPerson.coverType = this.insuredPersons[0].coverType;
      }
      
      // Add the new person to our temporary array
      dtAssure.push(newPerson);
      
      // Update the insured persons list
      this.insuredPersons = dtAssure;
      
      // Disable the New Insured button if we've reached the maximum (8)
      if (this.insuredPersons.length >= 8) {
        const buttonNewInsured = document.getElementById('ButtonNewInsured') as HTMLButtonElement;
        if (buttonNewInsured) {
          buttonNewInsured.disabled = true;
        }
      }
    } catch (error) {
      console.error('Error adding new insured:', error);
    }
  }

  /**
   * Handles deleting an insured person
   * Direct implementation of ListInsured_ItemDeleting from the C# code
   * @param index The index of the insured person to delete
   */
  deleteInsured(index: number) {
    console.log('deleteInsured called with index', index);
    
    // Check if this is an existing insured in the model
    const hfNewAssure = document.getElementById(`hfNewAssure${index}`) as HTMLInputElement;
    
    // If the insured exists in the model (not newly added), mark for deletion
    if (this._presenter.listOfAssured.length > 0 && hfNewAssure && hfNewAssure.value !== '1') {
      const assureNumber = document.getElementById(`txtAssureNumber${index}`) as HTMLInputElement;
      if (assureNumber) {
        const assureIdx = parseInt(assureNumber.value);
        // Mark for deletion in the model
        this._presenter.markAssureForDeletion(assureIdx);
      }
    }
    
    // Remove the insured from our local array
    if (index >= 0 && index < this.insuredPersons.length) {
      this.insuredPersons.splice(index, 1);
      
      // Re-number the remaining insured persons
      this.insuredPersons.forEach((person, idx) => {
        person.assuredNumber = idx;
      });
      
      // Re-enable the New Insured button if we are below the maximum (8)
      if (this.insuredPersons.length < 8) {
        const buttonNewInsured = document.getElementById('ButtonNewInsured') as HTMLButtonElement;
        if (buttonNewInsured) {
          buttonNewInsured.disabled = false;
        }
      }
    }
  }

  /**
   * Gets client IDs for error highlighting
   */
  getClientIDs(): void {
    this.domiciliationId = '';
    if (this.insuredPersons.length > 0) {
      const domiciliationElement = document.getElementById('ddlDomiciliation0');
      if (domiciliationElement) {
        this.domiciliationId = '#' + domiciliationElement.id;
      }
    }
  }
  /**
   * Handles date changes from the date control
   */
  onDateChanged(index: number, event: any): void {
    console.log(`Date changed for insured ${index}:`, event);
    // Update the model with the new date value
    if (this.insuredPersons[index]) {
      this.insuredPersons[index].dateOfBirth = event;
    }
  }
  /**
   * Private helper method to add the first row to the list
   */
  private addFirstRowToList() {
    if (this.insuredPersons.length === 0) {
      // Create default insured person
      const firstPerson: InsuredPerson = {
        firstName: '',
        gender: 0,
        postalCode: '',
        mutualType: '01',
        coverType: 1,
        relationNumber: 0,
        isPaymentBankDomiciliation: 0,
        assuredNumber: 0,
        newAssure: '1'
      };
      
      this.insuredPersons.push(firstPerson);
    }
  }
}