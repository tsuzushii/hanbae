// src/app/toolbar/toolbar.component.ts
import { AgTranslateModule } from '@ag/vc.ag-core/translate';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToolBarButton, ToolbarState } from './models/toolbar.types';
import { ToolbarService } from './services/toolbar.service';

@Component({
  selector: 'ag-toolbar',
  standalone: true,
  imports: [CommonModule, AgTranslateModule],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToolbarComponent implements OnInit {
  toolbarState: ToolbarState = {};
  ToolBarButton = ToolBarButton; // Make enum available to template
  
  // Popup state
  showPopup = false;
  popupMessage = '';
  popupQuestion = '';
  
  constructor(
    private toolbarService: ToolbarService) {}
 
  ngOnInit(): void {
    // Subscribe to toolbar state changes
    this.toolbarService.toolbarState$.subscribe(state => {
      this.toolbarState = state;
    });
  }
  
  // Button click handlers
  onNextClick(): void {
    if (this.isButtonEnabled(ToolBarButton.Next)) {
      this.toolbarService.triggerNextClicked();
    }
  }
  
  onPreviousClick(): void {
    if (this.isButtonEnabled(ToolBarButton.Previous)) {
      this.toolbarService.triggerPreviousClicked();
    }
  }
  
  onSaveClick(): void {
    if (this.isButtonEnabled(ToolBarButton.Save)) {
      this.toolbarService.triggerSaveClicked();
    }
  }
  
  onPrintClick(): void {
    if (this.isButtonEnabled(ToolBarButton.Print)) {
      this.toolbarService.triggerPrintClicked();
    }
  }
  
  onConfirmClick(): void {
    if (this.isButtonEnabled(ToolBarButton.Confirm)) {
      this.toolbarService.triggerConfirmClicked();
    }
  }
  
  onCancelClick(): void {
    if (this.isButtonEnabled(ToolBarButton.Cancel)) {
      this.toolbarService.triggerCancelClicked();
    }
  }
  
  onOkClick(): void {
    if (this.isButtonEnabled(ToolBarButton.Ok)) {
      this.toolbarService.triggerOkClicked();
    }
  }
  
  onInfoClick(): void {
    if (this.isButtonEnabled(ToolBarButton.Info)) {
      // Toggle info menu will be handled by CSS
    }
  }
  
  onCommissionsEtPouvoirsClick(): void {
    if (this.isButtonEnabled(ToolBarButton.CommissionsEtPouvoirs)) {
      this.toolbarService.triggerInfoClicked('COMM');
    }
  }
  
  onMotiveManualValidationClick(): void {
    if (this.isButtonEnabled(ToolBarButton.MotifValMan)) {
      this.toolbarService.triggerInfoClicked('MOTI');
    }
  }
  
  // Popup handlers
  onSaveValidationOk(): void {
    this.showPopup = false;
    this.toolbarService.triggerSavePreviousScreen();
  }
  
  onSaveValidationCancel(): void {
    this.showPopup = false;
  }
  
  // Helper to show save validation popup
  showSaveValidationPopup(message: string, question: string): void {
    this.popupMessage = message;
    this.popupQuestion = question;
    this.showPopup = true;
  }
  
  // Helper method to check if button is enabled
  private isButtonEnabled(button: ToolBarButton): boolean {
    return this.toolbarState[button]?.enabled ?? false;
  }
}