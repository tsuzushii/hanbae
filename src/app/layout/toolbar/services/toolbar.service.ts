// src/app/toolbar/services/toolbar.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ToolBarButton, ToolbarState } from '../models/toolbar.types';

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {
  // Initial state with all buttons invisible and disabled
  private initialState: ToolbarState = {
    [ToolBarButton.Print]: { visible: false, enabled: false },
    [ToolBarButton.Save]: { visible: false, enabled: false },
    [ToolBarButton.Previous]: { visible: false, enabled: false },
    [ToolBarButton.Next]: { visible: false, enabled: false },
    [ToolBarButton.Confirm]: { visible: false, enabled: false },
    [ToolBarButton.Cancel]: { visible: false, enabled: false },
    [ToolBarButton.Ok]: { visible: false, enabled: false },
    [ToolBarButton.Info]: { visible: false, enabled: false },
    [ToolBarButton.PrimesComptant]: { visible: false, enabled: false },
    [ToolBarButton.CommissionsEtPouvoirs]: { visible: false, enabled: false },
    [ToolBarButton.MotifValMan]: { visible: false, enabled: false }
  };

  // State management
  private toolbarStateSubject = new BehaviorSubject<ToolbarState>(this.initialState);
  toolbarState$ = this.toolbarStateSubject.asObservable();

  // Event subjects
  private nextClickedSubject = new Subject<void>();
  private previousClickedSubject = new Subject<void>();
  private saveClickedSubject = new Subject<void>();
  private printClickedSubject = new Subject<void>();
  private confirmClickedSubject = new Subject<void>();
  private cancelClickedSubject = new Subject<void>();
  private okClickedSubject = new Subject<void>();
  private savePreviousScreenSubject = new Subject<void>();
  private printExecutedSubject = new Subject<void>();
  private infoClickedSubject = new Subject<string>();

  // Observable streams that components can subscribe to
  nextClicked$ = this.nextClickedSubject.asObservable();
  previousClicked$ = this.previousClickedSubject.asObservable();
  saveClicked$ = this.saveClickedSubject.asObservable();
  printClicked$ = this.printClickedSubject.asObservable();
  confirmClicked$ = this.confirmClickedSubject.asObservable();
  cancelClicked$ = this.cancelClickedSubject.asObservable();
  okClicked$ = this.okClickedSubject.asObservable();
  savePreviousScreen$ = this.savePreviousScreenSubject.asObservable();
  printExecuted$ = this.printExecutedSubject.asObservable();
  infoClicked$ = this.infoClickedSubject.asObservable();

  constructor() {}

  /**
   * Set the visibility of a toolbar button
   * @param button The button to update
   * @param visible Whether the button should be visible
   */
  setVisible(button: ToolBarButton, visible: boolean): void {
    const currentState = this.toolbarStateSubject.value;
    const buttonState = currentState[button] || { visible: false, enabled: false };
    
    this.toolbarStateSubject.next({
      ...currentState,
      [button]: {
        ...buttonState,
        visible
      }
    });
  }
  
  /**
   * Set the enabled state of a toolbar button
   * @param button The button to update
   * @param enabled Whether the button should be enabled
   */
  setEnabled(button: ToolBarButton, enabled: boolean): void {
    const currentState = this.toolbarStateSubject.value;
    const buttonState = currentState[button] || { visible: false, enabled: false };
    
    this.toolbarStateSubject.next({
      ...currentState,
      [button]: {
        ...buttonState,
        enabled
      }
    });
  }
  
  /**
   * Reset the toolbar to its initial state
   */
  resetToolbar(): void {
    this.toolbarStateSubject.next(this.initialState);
  }

  // Methods to trigger events (called by the toolbar component)
  triggerNextClicked(): void {
    this.nextClickedSubject.next();
  }
  
  triggerPreviousClicked(): void {
    this.previousClickedSubject.next();
  }
  
  triggerSaveClicked(): void {
    this.saveClickedSubject.next();
  }
  
  triggerPrintClicked(): void {
    this.printClickedSubject.next();
  }
  
  triggerConfirmClicked(): void {
    this.confirmClickedSubject.next();
  }
  
  triggerCancelClicked(): void {
    this.cancelClickedSubject.next();
  }
  
  triggerOkClicked(): void {
    this.okClickedSubject.next();
  }
  
  triggerSavePreviousScreen(): void {
    this.savePreviousScreenSubject.next();
  }
  
  triggerPrintExecuted(): void {
    this.printExecutedSubject.next();
  }
  
  triggerInfoClicked(option: string): void {
    this.infoClickedSubject.next(option);
  }
}