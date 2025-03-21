import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Notification, Severity } from '../models/error.types';
import { ErrorDisplayService } from '../services/error-display.service';

@Component({
  selector: 'ag-error-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-display.component.html',
  styleUrl: './error-display.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ErrorDisplayComponent implements OnInit {
  @Input() showDetail = false;
  @Input() showCodothequeId = true;
  @Input() showLongMessageInSummary = false;
  @Input() iconVerticalAlignment: 'Top' | 'Middle' | 'Bottom' = 'Top';
  @Input() verticalSizing: 'Auto' | 'Fixed' | 'NotLimited' = 'Fixed';
  @Input() maximumHeight = 68;
  
  notifications: Notification[] = [];
  
  constructor(
    private errorDisplayService: ErrorDisplayService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.errorDisplayService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
      this.adjustPanelHeight();
    });
  }
  
  ngAfterViewInit(): void {
    this.errorDisplayService.initialize(
      this.elementRef.nativeElement.querySelector('#ErrorDisplayMaster_NotifPanel'),
      this.elementRef.nativeElement.querySelector('#ErrorDisplayMaster_NotifTable'),
      this.showDetail,
      this.showCodothequeId,
      this.showLongMessageInSummary,
      this.iconVerticalAlignment.toLowerCase(),
      this.verticalSizing.toLowerCase()
    );
  }

  adjustPanelHeight(): void {
    const notifPanel = this.elementRef.nativeElement.querySelector('#ErrorDisplayMaster_NotifPanel');
    if (!notifPanel) return;
    
    if (this.verticalSizing === 'Fixed') {
      notifPanel.style.height = `${this.maximumHeight}px`;
    } else if (this.verticalSizing === 'Auto') {
      const rowCount = this.notifications.length;
      if (rowCount === 0) {
        notifPanel.style.height = '0px';
      } else if (rowCount === 1) {
        notifPanel.style.height = '25px';
      } else if (rowCount === 2) {
        notifPanel.style.height = '48px';
      } else {
        notifPanel.style.height = '71px';
      }
    } else if (this.verticalSizing === 'NotLimited' && this.notifications.length === 0) {
      notifPanel.style.height = '0px';
    }
  }
  
  getCodothequeClass(severity: Severity): string {
    switch (severity) {
      case Severity.Error:
        return 'CodothequeLabelError';
      case Severity.Warning:
        return 'CodothequeLabelWarning';
      case Severity.Notification:
        return 'CodothequeLabelNotification';
      default:
        return 'CodothequeLabelError';
    }
  }
  
  // This is an alias function to maintain compatibility with the HTML template
  getCodothequeIdClass(severity: Severity): string {
    return this.getCodothequeClass(severity);
  }
  
  getMessageClass(severity: Severity, hasLinkedControl: boolean): string {
    let baseClass = hasLinkedControl ? 'LabelErrorLinkedControl ' : 'LabelError ';
    
    switch (severity) {
      case Severity.Error:
        return baseClass + (hasLinkedControl ? 'ED_MessageErrorLinkedControl' : 'ED_MessageError');
      case Severity.Warning:
        return baseClass + (hasLinkedControl ? 'ED_MessageWarningLinkedControl' : 'ED_MessageWarning');
      case Severity.Notification:
        return baseClass + (hasLinkedControl ? 'ED_MessageNotificationLinkedControl' : 'ED_MessageNotification');
      default:
        return baseClass + (hasLinkedControl ? 'ED_MessageErrorLinkedControl' : 'ED_MessageError');
    }
  }
  
  getIconUrl(severity: Severity): string {
    switch (severity) {
      case Severity.Error:
        return 'assets/WebResources/HRCOFIBError_DE14.png'; // Update with your actual image paths
      case Severity.Warning:
        return 'assets/WebResources/HRCOFIBWarning_DE14.png';
      case Severity.Notification:
        return 'assets/WebResources/HRCOFIBNotification_DE14.png';
      default:
        return 'assets/WebResources/HRCOFIBError_DE14.png';
    }
  }
  
  // This is an alias function to maintain compatibility with the HTML template
  getSeverityImageUrl(severity: Severity): string {
    return this.getIconUrl(severity);
  }
  
  onRowClick(controlId: string | undefined, event: Event): void {
    console.log("onrowclick", controlId);
    if (controlId) {
      this.errorDisplayService.setFocusOnControl(controlId);
    }
  }
  
  showLongMessage(longMessage: string | undefined, event: Event): void {
    console.log("showlongmessage");
    if (longMessage) {
      this.errorDisplayService.showLongMessagePopUp(longMessage);
    }
  }
  
  // These are alias methods to maintain compatibility with the HTML template
  setFocusOnControl(controlId: string): void {
    this.errorDisplayService.setFocusOnControl(controlId);
  }
  
  showLongMessagePopUp(longMessage: string): void {
    this.errorDisplayService.showLongMessagePopUp(longMessage);
  }
}
