import { DOCUMENT } from "@angular/common";
import { Injectable, Renderer2, RendererFactory2, inject } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { DetailPopupConfig, Notification, Severity } from "../models/error.types";

@Injectable({
    providedIn: 'root'
  })
  export class ErrorDisplayService {
    private document = inject(DOCUMENT);
    private renderer: Renderer2;
    private lastId = 0;
    private detailPopupElement: HTMLElement | null = null;
    
    // Configuration properties
    private notifPanelElement: HTMLElement | null = null;
    private notifTableElement: HTMLElement | null = null;
    private showDetail = false;
    private showCodothequeId = true;
    private showLongMessageInSummary = false;
    private iconVerticalAlignment = 'top';
    private sizingMode = 'fixed';
  
    // Notifications storage and observable
    private notificationsSubject = new BehaviorSubject<Notification[]>([]);
    notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();
    
    // Detail popup configuration
    private detailPopupConfig: DetailPopupConfig = {
      showDetail: false,
      headerText: 'Error detail',
      modal: true,
      allowDragging: true,
      verticalAlign: 'TopSides',
      horizontalAlign: 'WindowCenter'
    };
  
    constructor(rendererFactory: RendererFactory2) {
      this.renderer = rendererFactory.createRenderer(null, null);
      
      // Create and initialize the detail popup if it doesn't exist
      this.createDetailPopupIfNeeded();
    }
  
    initialize(
      notifPanelElement: HTMLElement,
      notifTableElement: HTMLElement,
      showDetail: boolean,
      showCodothequeId: boolean,
      showLongMessageInSummary: boolean,
      iconVerticalAlignment: string,
      sizingMode: string,
      detailPopupConfig?: DetailPopupConfig
    ): void {
      this.notifPanelElement = notifPanelElement;
      this.notifTableElement = notifTableElement;
      this.showDetail = showDetail;
      this.showCodothequeId = showCodothequeId;
      this.showLongMessageInSummary = showLongMessageInSummary;
      this.iconVerticalAlignment = iconVerticalAlignment;
      this.sizingMode = sizingMode;
      
      if (detailPopupConfig) {
        this.detailPopupConfig = {...this.detailPopupConfig, ...detailPopupConfig};
      }
    }
  
    /**
     * Add a notification to the error display
     */
    addNotification(
      shortMessage: string, 
      severity: Severity, 
      longMessage?: string, 
      codothequeId?: string, 
      controlId?: string
    ): number {
      if (!shortMessage) {
        return -1;
      }
  
      this.lastId++;
      
      const notification: Notification = {
        id: this.lastId,
        shortMessage,
        longMessage,
        severity,
        codothequeId,
        controlId
      };
  
      const currentNotifications = this.notificationsSubject.getValue();
      this.notificationsSubject.next([...currentNotifications, notification]);
      
      return this.lastId;
    }
  
    /**
     * Remove a notification by its ID
     */
    removeNotification(id: number): void {
      if (!id) return;
      
      const currentNotifications = this.notificationsSubject.getValue();
      const filteredNotifications = currentNotifications.filter((n: Notification) => n.id !== id);
      
      if (filteredNotifications.length !== currentNotifications.length) {
        this.notificationsSubject.next(filteredNotifications);
      }
    }
  
    /**
     * Remove all notifications
     */
    removeAllNotifications(): void {
      this.notificationsSubject.next([]);
    }
  
    /**
     * Get all notifications
     */
    getNotifications(): Notification[] {
      return this.notificationsSubject.getValue();
    }
    
    /**
     * Set focus on a control by ID
     */
    setFocusOnControl(controlId: string): void {
      if (!controlId) return;
      
      const element = this.document.getElementById(controlId);
      if (element) {
        if (element instanceof HTMLInputElement || 
            element instanceof HTMLSelectElement || 
            element instanceof HTMLTextAreaElement) {
          element.focus();
        }
      }
    }
    
    /**
     * Show the long message popup
     */
    showLongMessagePopUp(longMessage: string): void {
      if (!longMessage || !this.showDetail) return;
      
      this.createDetailPopupIfNeeded();
      
      if (this.detailPopupElement) {
        // Find the message label element
        const messageLabelElement = this.detailPopupElement.querySelector('#DetailPopUp_LabelLongMessage');
        if (messageLabelElement) {
          messageLabelElement.textContent = longMessage;
        }
        
        // Show the popup
        this.detailPopupElement.style.display = 'block';
        
        // Handle click outside to close
        const closeHandler = (e: MouseEvent) => {
          if (!this.detailPopupElement?.contains(e.target as Node)) {
            this.detailPopupElement.style.display = 'none';
            this.document.removeEventListener('click', closeHandler);
          }
        };
        
        // Add the event listener after a short delay to prevent immediate closing
        setTimeout(() => {
          this.document.addEventListener('click', closeHandler);
        }, 100);
      }
    }
  
    /**
     * Create the detail popup if it doesn't exist
     */
    private createDetailPopupIfNeeded(): void {
      if (this.detailPopupElement) return;
      
      // Check if the popup already exists in the DOM
      const existingPopup = this.document.getElementById('DetailPopup');
      if (existingPopup) {
        this.detailPopupElement = existingPopup;
        return;
      }
      
      // Create the popup
      this.detailPopupElement = this.renderer.createElement('div');
      this.renderer.setAttribute(this.detailPopupElement, 'id', 'DetailPopup');
      this.renderer.setAttribute(this.detailPopupElement, 'class', 'ED_DetailPopup');
      this.renderer.setStyle(this.detailPopupElement, 'display', 'none');
      this.renderer.setStyle(this.detailPopupElement, 'position', 'fixed');
      this.renderer.setStyle(this.detailPopupElement, 'z-index', '1000');
      this.renderer.setStyle(this.detailPopupElement, 'top', '50%');
      this.renderer.setStyle(this.detailPopupElement, 'left', '50%');
      this.renderer.setStyle(this.detailPopupElement, 'transform', 'translate(-50%, -50%)');
      this.renderer.setStyle(this.detailPopupElement, 'width', '500px');
      
      // Create header
      const header = this.renderer.createElement('div');
      this.renderer.setAttribute(header, 'class', 'EDHeader');
      this.renderer.setStyle(header, 'background-color', '#E2B838');
      this.renderer.setStyle(header, 'color', 'white');
      this.renderer.setStyle(header, 'font-weight', 'bold');
      this.renderer.setStyle(header, 'padding', '5px');
      
      const headerText = this.renderer.createElement('span');
      this.renderer.appendChild(headerText, this.renderer.createText(this.detailPopupConfig.headerText));
      this.renderer.appendChild(header, headerText);
      
      // Create body
      const body = this.renderer.createElement('div');
      this.renderer.setAttribute(body, 'class', 'EDBody');
      this.renderer.setStyle(body, 'padding', '10px');
      this.renderer.setStyle(body, 'max-height', '150px');
      this.renderer.setStyle(body, 'overflow', 'auto');
      
      const messageLabel = this.renderer.createElement('span');
      this.renderer.setAttribute(messageLabel, 'id', 'DetailPopUp_LabelLongMessage');
      this.renderer.appendChild(body, messageLabel);
      
      // Assemble the popup
      this.renderer.appendChild(this.detailPopupElement, header);
      this.renderer.appendChild(this.detailPopupElement, body);
      
      // Add to document body
      this.renderer.appendChild(this.document.body, this.detailPopupElement);
    }
  }
  