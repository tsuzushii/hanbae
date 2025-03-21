import { ApplicationRef, Injectable } from '@angular/core';

import { HeaderItem } from '../../layout/header/models/header.types';
import { ToolBarButton } from '../../layout/toolbar/models/toolbar.types';
import { ToolbarService } from '../../layout/toolbar/services/toolbar.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  readonly CSS_DISABLED = 'disabled';
  readonly CSS_DISABLED_BUTTON = 'buttonDisabled';
  readonly CSS_DISABLED_INPUT = 'inputDisabled';
  readonly CSS_DISABLED_HELPBUTTON = 'helpButtonDisabled';
  readonly CSS_DISABLED_FORCED = 'stayDisabled';
  readonly CSS_MANDATORY = 'mandatory';
  readonly CSS_MANDATORY_FORCED = 'forceMandatory';
  readonly CSS_HOVER = 'hover';

  // HTML Attributes
  readonly ATTR_DISABLED = 'disabled';
  readonly ATTR_CHECKED = 'checked';

  // Layout Configuration
  readonly MIN_WIDTH = 1000;
  readonly MIN_HEIGHT = 640;

  // Global State Variables
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  getScreenValues = true;
  canEnablePage = true;
  LaunchPrintPdfPreview = false;

  // Treeview Scroll Object
  treeviewScrollObject: any = null; // Placeholder for actual treeview object
  constructor(private readonly toolbarService: ToolbarService,
    private readonly appRef: ApplicationRef) {}

  public configureToolbar(): void {
    // Set which buttons are visible
    this.toolbarService.setVisible(ToolBarButton.Next, true);
    this.toolbarService.setVisible(ToolBarButton.Previous, false);
    this.toolbarService.setVisible(ToolBarButton.Save, true);
    this.toolbarService.setVisible(ToolBarButton.Print, true);
    this.toolbarService.setVisible(ToolBarButton.Confirm, true);
    this.toolbarService.setVisible(ToolBarButton.Cancel, false);
    this.toolbarService.setVisible(ToolBarButton.Ok, false);
    this.toolbarService.setVisible(ToolBarButton.Info, false);
    
    // Set which buttons are enabled
    this.toolbarService.setEnabled(ToolBarButton.Next, true);
    this.toolbarService.setEnabled(ToolBarButton.Save, true); // Assuming this is first page
    this.toolbarService.setEnabled(ToolBarButton.Print, false);
    this.toolbarService.setEnabled(ToolBarButton.Confirm, false);
  }
  public resizeScreen(): void {
     
    if (this.getScreenValues) {  // when set to true, get new window width and height
      this.windowWidth = Math.max(window.innerWidth, this.MIN_WIDTH);
      this.windowHeight = Math.max(window.innerHeight, this.MIN_HEIGHT);
    } else {  // use previous calculated values and reset the flag for the next time
      this.getScreenValues = true;
    }
  
    // Main Layout
    const mainLayout = document.querySelector('div#MainLayout') as HTMLElement;
    if (mainLayout) {
      mainLayout.style.width = `${this.windowWidth}px`;
      mainLayout.style.height = `${this.windowHeight}px`;
    }
  
    // Header Area
    const headerArea = document.querySelector('div#HeaderArea') as HTMLElement;
    if (headerArea) {
      headerArea.style.width = `${this.windowWidth}px`;
    }
  
    // Header Data Width Calculation
    const headerData = document.querySelector('div#HeaderArea div.LogoBar div.HeaderData') as HTMLElement;
    const agImage = document.querySelector('div#HeaderArea div.LogoBar div.agimage') as HTMLElement;
    if (headerData && agImage) {
      const headerDataStyle = window.getComputedStyle(headerData);
      // Calculate the extra width from margins, padding, and borders (jQuery outerWidth(true) - width equivalent)
      const headerDataExtraWidth = 
        parseFloat(headerDataStyle.marginLeft || '0') +
        parseFloat(headerDataStyle.marginRight || '0') +
        parseFloat(headerDataStyle.paddingLeft || '0') +
        parseFloat(headerDataStyle.paddingRight || '0') +
        parseFloat(headerDataStyle.borderLeftWidth || '0') +
        parseFloat(headerDataStyle.borderRightWidth || '0');
  
      // Calculate the header data width
      const headerDataWidth = this.windowWidth - agImage.getBoundingClientRect().width - headerDataExtraWidth;
      headerData.style.width = `${headerDataWidth}px`;
    }
  
    // Lower Area
    const lowerArea = document.querySelector('div#LowerArea') as HTMLElement;
    if (lowerArea) {
      const lowerAreaStyle = window.getComputedStyle(lowerArea);
      // Calculate the extra space from margins, padding, and borders
      const lowerAreaExtraSpace = 
        parseFloat(lowerAreaStyle.marginTop || '0') +
        parseFloat(lowerAreaStyle.marginBottom || '0') +
        parseFloat(lowerAreaStyle.paddingTop || '0') +
        parseFloat(lowerAreaStyle.paddingBottom || '0') +
        parseFloat(lowerAreaStyle.borderTopWidth || '0') +
        parseFloat(lowerAreaStyle.borderBottomWidth || '0');
  
      // Calculate the lower area dimensions
      const headerHeight = headerArea?.getBoundingClientRect().height || 0;
      const lowerAreaHeight = this.windowHeight - headerHeight - lowerAreaExtraSpace;
      lowerArea.style.width = `${this.windowWidth}px`;
      lowerArea.style.height = `${lowerAreaHeight}px`;
  
      // Side Navigation
      const sideNavigation = document.querySelector('div#LowerArea div#SideNavigation') as HTMLElement;
      if (sideNavigation) {
        const sideNavigationStyle = window.getComputedStyle(sideNavigation);
        const sideNavigationExtraHeight = 
          parseFloat(sideNavigationStyle.marginTop || '0') +
          parseFloat(sideNavigationStyle.marginBottom || '0') +
          parseFloat(sideNavigationStyle.paddingTop || '0') +
          parseFloat(sideNavigationStyle.paddingBottom || '0') +
          parseFloat(sideNavigationStyle.borderTopWidth || '0') +
          parseFloat(sideNavigationStyle.borderBottomWidth || '0');
  
        // Calculate the side navigation height
        const sideNavigationHeight = lowerAreaHeight - sideNavigationExtraHeight;
        sideNavigation.style.height = `${sideNavigationHeight}px`;
  
        // Calculate treeview scroll container dimensions
        const topSpace = sideNavigation.querySelector('.treeviewTopborder')?.getBoundingClientRect().height || 0;
        const bottomSpace = sideNavigation.querySelector('.treeviewBottomborder')?.getBoundingClientRect().height || 0;
        const scrollContainerHeight = sideNavigationHeight - topSpace - bottomSpace;
        
        // Set the height of the scroll container
        const scrollContainer = sideNavigation.querySelector('.GN_GlobalNavigationMenu')?.parentElement as HTMLElement;
        if (scrollContainer) {
          scrollContainer.style.height = `${scrollContainerHeight}px`;
        }
  
        // Check if we need to show scroll buttons
        const navigationMenu = sideNavigation.querySelector('.GN_GlobalNavigationMenu') as HTMLElement;
        const ulElement = navigationMenu?.querySelector('ul') as HTMLElement;
        
        if (ulElement && navigationMenu) {
          const ulHeight = ulElement.getBoundingClientRect().height;
          
          if (ulHeight > scrollContainerHeight) {
            // Don't set height on the menu, otherwise scroll won't work in IE8
            navigationMenu.style.height = '';
            
            // Set up hover events for scroll buttons
            sideNavigation.addEventListener('mouseenter', () => {
              const scrollLinks = sideNavigation.querySelectorAll('.treeviewScrollLink');
              scrollLinks.forEach(link => (link as HTMLElement).style.display = 'block');
            });
            
            sideNavigation.addEventListener('mouseleave', () => {
              const scrollLinks = sideNavigation.querySelectorAll('.treeviewScrollLink');
              scrollLinks.forEach(link => (link as HTMLElement).style.display = 'none');
            });
          } else {
            // Remove hover events if not needed
            sideNavigation.removeEventListener('mouseenter', () => {});
            sideNavigation.removeEventListener('mouseleave', () => {});
            
            // Set height to 100% to show full side borders
            navigationMenu.style.height = '100%';
          }
        }
      }
  
      // Content Area
      const contentArea = document.querySelector('div#LowerArea div#ContentArea') as HTMLElement;
      
      if (contentArea && sideNavigation) {
        const contentAreaStyle = window.getComputedStyle(contentArea);
        const contentAreaExtraWidth = 
          parseFloat(contentAreaStyle.marginLeft || '0') +
          parseFloat(contentAreaStyle.marginRight || '0') +
          parseFloat(contentAreaStyle.paddingLeft || '0') +
          parseFloat(contentAreaStyle.paddingRight || '0') +
          parseFloat(contentAreaStyle.borderLeftWidth || '0') +
          parseFloat(contentAreaStyle.borderRightWidth || '0');
        
        // Calculate content area dimensions
        const contentAreaWidth = this.windowWidth - sideNavigation.getBoundingClientRect().width - contentAreaExtraWidth;
        const contentAreaHeight = sideNavigation.getBoundingClientRect().height;
        
        contentArea.style.width = `${contentAreaWidth}px`;
        contentArea.style.height = `${contentAreaHeight}px`;
  
        // Content inside content area
        const content = contentArea.querySelector('div.Content') as HTMLElement;
        if (content) {
          const contentStyle = window.getComputedStyle(content);
          const contentExtraWidth = 
            parseFloat(contentStyle.marginLeft || '0') +
            parseFloat(contentStyle.marginRight || '0') +
            parseFloat(contentStyle.paddingLeft || '0') +
            parseFloat(contentStyle.paddingRight || '0') +
            parseFloat(contentStyle.borderLeftWidth || '0') +
            parseFloat(contentStyle.borderRightWidth || '0');
          
          // Calculate the content width
          const contentWidth = contentAreaWidth - contentExtraWidth;
          
          // Calculate the heights of elements in content area
          const toolbarHeight = this.calculateTotalHeight(contentArea.querySelector('div.ToolBar'));
          const titleHeight = this.calculateTotalHeight(contentArea.querySelector('h1'));
          const familisPremiumHeight = this.calculateTotalHeight(contentArea.querySelector('#FamilisPremiumContainer'));
          const errorAreaHeight = this.calculateTotalHeight(contentArea.querySelector('#ErrorContainer'));
          
          
          // Calculate content height
          const contentHeight = contentAreaHeight - toolbarHeight - titleHeight - familisPremiumHeight - errorAreaHeight;
          
          content.style.width = `${contentWidth}px`;
          content.style.height = `${contentHeight}px`;
        }
  
        // Resize PDF if present
        this.resizePdf();
        
        // Error container
        const errorContainer = contentArea.querySelector('#ErrorContainer') as HTMLElement;
        if (errorContainer) {
          errorContainer.style.width = `${contentAreaWidth}px`;
        }
      }
    }
  
    
  }
  private calculateTotalHeight(element: HTMLElement): number {
    if (!element) {
        console.error('Element is not valid', element);
        return 0;
    }

    const style = window.getComputedStyle(element);
    const height = parseFloat(style.height);
    const marginTop = parseFloat(style.marginTop || '0');
    const marginBottom = parseFloat(style.marginBottom || '0');
    const paddingTop = parseFloat(style.paddingTop || '0');
    const paddingBottom = parseFloat(style.paddingBottom || '0');
    const borderTopWidth = parseFloat(style.borderTopWidth || '0');
    const borderBottomWidth = parseFloat(style.borderBottomWidth || '0');
    return height + marginTop + marginBottom + paddingTop + paddingBottom + borderTopWidth + borderBottomWidth;
}
public loadHeaderData(headerCollection: HeaderItem[]): void {
  headerCollection.forEach(item => {
    // Find label elements by ID pattern matching the original
    const headerLabel = document.getElementById(`LabelHEADER${item.idPlace}`) as HTMLElement;
    const separatorLabel = document.getElementById(`LabelSEP${item.idPlace}`) as HTMLElement;
    const dataLabel = document.getElementById(`LabelDATA${item.idPlace}`) as HTMLElement;
    
    // Update header label text if element exists
    if (headerLabel) {
      headerLabel.textContent = item.libelle.trim();
    }
    
    // Update separator visibility if element exists
    if (separatorLabel) {
      separatorLabel.style.display = item.libelle.trim() ? '' : 'none';
    }
    
    // Update data label text if element exists
    if (dataLabel) {
      dataLabel.textContent = item.value.trim();
    }
  });
}
  // Helper function to set width and height of elements
  private setElementSize(selector: string, width?: number, height?: number, isParent = false): HTMLElement | null {
    const element = document.querySelector(selector) as HTMLElement | null;
    if (!element) {
      console.warn(`setElementSize: Element not found for selector "${selector}"`);
      return null;
    }
    if (width !== undefined) element.style.width = `${width}px`;
    if (height !== undefined) element.style.height = `${height}px`;
    return isParent ? element.parentElement : element;
  }
  

  // Helper function to get element height, including margins
  private getElementHeight(parent: HTMLElement | null, selector: string): number {
    const element = parent?.querySelector(selector) as HTMLElement;
    return element ? element.offsetHeight : 0;
  }

  private resizePdf(): void {
    // ResizePdf function implementation placeholder
  }

  private initializeTreeviewScroll(): void {
    // initializeTreeviewScroll function implementation placeholder
  }

  public initializeToolBar(): void {
    this.hoverToolBarButtonEvent();
    this.expandButtonClickEvents();
  
    const disabledLinks = document.querySelectorAll('.ToolBar ul.ActionsList li a[disabled]');
    disabledLinks.forEach(link => {
      link.classList.add('disabled');
      link.addEventListener('click', event => event.preventDefault());
    });
  }
  // Update these methods in your layout.service.ts file

  public hoverToolBarButtonEvent(): void {
    // Initial check - run immediately when the component is loaded
    setTimeout(() => this.attachHoverEvents(), 0);
    
    // Set up a MutationObserver to detect when toolbar buttons are added to DOM
    const observer = new MutationObserver((mutations) => {
      // Check if any mutations affected .ImgBtn elements
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          const hasButtons = Array.from(mutation.addedNodes).some(node => {
            if (node instanceof HTMLElement) {
              return node.classList?.contains('ImgBtn') || 
                    node.querySelector?.('.ImgBtn') !== null;
            }
            return false;
          });
          
          if (hasButtons) {
            setTimeout(() => this.attachHoverEvents(), 0);
            break;
          }
        }
      }
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  }

  private attachHoverEvents(): void {
    // First handle the initial rendering for all buttons
    const allButtons = document.querySelectorAll('.ToolBar .ImgBtn');
    allButtons.forEach(button => {
      // Force initial state rendering for all buttons - to ensure translation is visible
      button.parentElement?.classList.add('initial-render');
      // Remove class after a short delay
      setTimeout(() => {
        button.parentElement?.classList.remove('initial-render');
      }, 50);
    });
    
    // Then attach hover events only to enabled buttons
    const enabledButtons = document.querySelectorAll('.ToolBar .ImgBtn:not([disabled])');
    enabledButtons.forEach(button => {
      // Skip buttons that already have event handlers attached
      if ((button as any)._hoverEventsAttached) {
        return;
      }
      
      const mouseEnterHandler = () => {
        // Only add hover if button is not disabled
        if (!button.hasAttribute('disabled')) {
          button.parentElement?.classList.add(this.CSS_HOVER);
        }
      };
      
      const mouseLeaveHandler = () => {
        button.parentElement?.classList.remove(this.CSS_HOVER);
      };
      
      const blurHandler = () => {
        button.parentElement?.classList.remove(this.CSS_HOVER); 
      };
      
      button.addEventListener('mouseenter', mouseEnterHandler);
      button.addEventListener('mouseleave', mouseLeaveHandler);
      button.addEventListener('blur', blurHandler);
      
      // Mark this button as having events attached
      (button as any)._hoverEventsAttached = true;
      
      // Store handlers for potential cleanup
      (button as any)._eventHandlers = {
        mouseenter: mouseEnterHandler,
        mouseleave: mouseLeaveHandler,
        blur: blurHandler
      };
    });
    
    // Add mutation observer for disabled state changes
    this.observeDisabledChanges();
  }
  private observeDisabledChanges(): void {
    // This will observe changes to the disabled attribute and update hover behavior
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'disabled' && 
            mutation.target instanceof HTMLElement) {
          
          const button = mutation.target;
          
          // If button became disabled, remove hover class
          if (button.hasAttribute('disabled')) {
            button.parentElement?.classList.remove(this.CSS_HOVER);
            
            // Remove existing event handlers if any
            if ((button as any)._eventHandlers) {
              button.removeEventListener('mouseenter', (button as any)._eventHandlers.mouseenter);
              button.removeEventListener('mouseleave', (button as any)._eventHandlers.mouseleave);
              button.removeEventListener('blur', (button as any)._eventHandlers.blur);
              (button as any)._hoverEventsAttached = false;
            }
          } 
          // If button became enabled, add hover handlers if not already present
          else if (!(button as any)._hoverEventsAttached) {
            const mouseEnterHandler = () => {
              if (!button.hasAttribute('disabled')) {
                button.parentElement?.classList.add(this.CSS_HOVER);
              }
            };
            
            const mouseLeaveHandler = () => {
              button.parentElement?.classList.remove(this.CSS_HOVER);
            };
            
            const blurHandler = () => {
              button.parentElement?.classList.remove(this.CSS_HOVER); 
            };
            
            button.addEventListener('mouseenter', mouseEnterHandler);
            button.addEventListener('mouseleave', mouseLeaveHandler);
            button.addEventListener('blur', blurHandler);
            
            (button as any)._hoverEventsAttached = true;
            (button as any)._eventHandlers = {
              mouseenter: mouseEnterHandler,
              mouseleave: mouseLeaveHandler,
              blur: blurHandler
            };
          }
        }
      });
    });
    
    // Observe all toolbar buttons for disabled attribute changes
    document.querySelectorAll('.ToolBar .ImgBtn').forEach(button => {
      observer.observe(button, { attributes: true, attributeFilter: ['disabled'] });
    });
  }
  public expandButtonClickEvents(): void {
    const expandButtons = document.querySelectorAll('.ToolBar .ImgBtnExpand');
  
    expandButtons.forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault();
        
        const parentDiv = button.parentElement?.parentElement;
        if (!parentDiv) return;
  
        // If already expanded, do nothing
        if (parentDiv.classList.contains('expand')) return;
  
        // Close other open menus
        document.querySelectorAll('.ToolBar .expand').forEach(openMenu => {
          openMenu.classList.remove('expand');
          const actionsList = openMenu.querySelector('ul.ActionsList') as HTMLElement;
          if (actionsList) actionsList.style.display = 'none';
        });
  
        // Expand the clicked one
        parentDiv.classList.add('expand');
        const actionsList = parentDiv.querySelector('ul.ActionsList') as HTMLElement;
        if (actionsList) actionsList.style.display = 'block';
  
        // Close when clicking anywhere outside
        document.addEventListener('click', (event) => {
          if (!parentDiv.contains(event.target as Node)) {
            parentDiv.classList.remove('expand');
            if (actionsList) actionsList.style.display = 'none';
          }
        }, { once: true });
      });
    });
  }
  
  public disableLinks(): void {
    document.querySelectorAll('a.disabled, div.Content.disabled:not(.stayEnabled) a').forEach(link => {
      link.addEventListener('click', event => event.preventDefault());
    });
  }

  public makeColorboxDraggable(): void {
    const colorbox = document.getElementById('colorbox');
    if (!colorbox) return;
  
    let offsetX = 0, offsetY = 0, isDragging = false;
  
    const onMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;
      colorbox.style.left = `${Math.max(0, Math.min(window.innerWidth - colorbox.offsetWidth, event.clientX - offsetX))}px`;
      colorbox.style.top = `${Math.max(0, Math.min(window.innerHeight - colorbox.offsetHeight, event.clientY - offsetY))}px`;
    };
  
    colorbox.addEventListener('mousedown', (event: MouseEvent) => {
      isDragging = true;
      offsetX = event.clientX - colorbox.getBoundingClientRect().left;
      offsetY = event.clientY - colorbox.getBoundingClientRect().top;
      colorbox.style.position = 'absolute';
  
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', () => {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
      }, { once: true });
    });
  }
  public selectTextBoxOnClick(): void {
    document.body.addEventListener('focusin', (event: FocusEvent) => {
      const target = event.target as HTMLInputElement;
      if (target.tagName === 'INPUT' && target.type === 'text') {
        target.select();
      }
    });
  }
  public highlightLabels(): void {
    document.body.addEventListener('focusin', (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (['INPUT', 'SELECT'].includes(target.tagName)) {
        const label = document.querySelector(`label[for="${target.id}"]`);
        if (label) label.classList.add('red');
      }
    });
  
    document.body.addEventListener('focusout', (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (['INPUT', 'SELECT'].includes(target.tagName)) {
        const label = document.querySelector(`label[for="${target.id}"]`);
        if (label) label.classList.remove('red');
      }
    });
  }
  public initializeGeneralTableStyles(): void {
    // Add right column class
    document.querySelectorAll('table.generalTableStyle:not(.listFormat) tbody tr.itembody td:last-child')
      .forEach(td => td.classList.add('rightColumn'));
  
    document.querySelectorAll('table.generalTableStyle:not(.listFormat) tbody tr.itembodyinner td.itembodyinner')
      .forEach(td => td.classList.add('rightColumn'));
  
    // Manage alternate row classes
    document.querySelectorAll('table.generalTableStyle:not(.listFormat):not(.alternative) tbody tr.itembody:not(.expand, .expand tr)')
      .forEach(row => row.classList.remove('alternateRow'));
  
    document.querySelectorAll('table.generalTableStyle:not(.listFormat):not(.alternative) tbody tr.itembody:nth-child(odd):not(.expand, .expand tr)')
      .forEach(row => row.classList.add('alternateRow'));
  
    // Add hover effect
    document.querySelectorAll('table.generalTableStyle:not(.notHoverable, .listFormat) tbody tr:not(.disabledRow, .expand, .expand tr)')
      .forEach(row => {
        row.addEventListener('mouseenter', () => row.classList.add('hoverRow'));
        row.addEventListener('mouseleave', () => row.classList.remove('hoverRow'));
      });
  
    // Add row selection functionality
    document.querySelectorAll('table.generalTableStyle:not(.notHoverable, .listFormat) tbody tr:not(.disabledRow, .selectedRow, .expand, .expand tr)')
      .forEach(row => {
        row.addEventListener('click', () => {
          document.querySelectorAll('table.generalTableStyle tbody tr.selectedRow')
            .forEach(selectedRow => selectedRow.classList.remove('selectedRow'));
          row.classList.add('selectedRow');
        });
      });
  
    // Manage button clicks inside table rows
    document.querySelectorAll('table.generalTableStyle tbody tr td.buttonColumn input.button:not(:disabled, .viewOnly)')
      .forEach(button => {
        button.addEventListener('click', event => {
          event.preventDefault();
          this.showManageButtonList(button);
        });
      });
  
    // Manage button clicks inside `dxgvControl` tables
    document.querySelectorAll('table.dxgvControl.generalTableStyle tbody tr td table.dxgvTable tbody tr td.dxgv.rightColumn input.button:not(:disabled, .viewOnly)')
      .forEach(button => {
        button.addEventListener('click', event => {
          event.preventDefault();
          this.showManageButtonList(button);
        });
      });
  
    // Manage focus and blur events on button lists
    document.querySelectorAll('table.generalTableStyle tbody tr td ul.ButtonList li a')
      .forEach(link => {
        link.addEventListener('focus', () => link.parentElement?.classList.add('focused'));
        link.addEventListener('blur', () => link.parentElement?.classList.remove('focused'));
      });
  }
  public showManageButtonList(button: Element): void {
    const tdParent = button.closest('td');
    if (!tdParent) return;
  
    const list = tdParent.querySelector('ul.ButtonList') as HTMLElement;
    if (!list || list.style.display === 'block') return;
  
    // Close other open popups before showing the new one
    document.body.click();
  
    const buttonRect = button.getBoundingClientRect();
    list.style.position = 'absolute';
    list.style.top = `${buttonRect.bottom}px`;
    list.style.left = `${buttonRect.left}px`;
    list.style.display = 'block';
  
    // Add event listeners for closing on keypress, mouse scroll, or click outside
    document.addEventListener('keydown', this.manageButtonListKeyEvents);
    document.addEventListener('wheel', this.manageButtonScrollEvents);
    document.addEventListener('click', this.hideManageButtonList);
  }
  public hideManageButtonList = (event: Event): void => {
    const list = document.querySelector('ul.ButtonList[style*="display: block"]') as HTMLElement;
    if (list && !list.contains(event.target as Node)) {
      list.style.display = 'none';
      document.removeEventListener('keydown', this.manageButtonListKeyEvents);
      document.removeEventListener('wheel', this.manageButtonScrollEvents);
      document.removeEventListener('click', this.hideManageButtonList);
    }
  };
  public manageButtonListKeyEvents = (event: KeyboardEvent): void => {
    const list = document.querySelector('ul.ButtonList[style*="display: block"]') as HTMLElement;
    if (!list) return;
  
    const items = Array.from(list.querySelectorAll('li a'));
    const focusedIndex = items.findIndex(item => item === document.activeElement);
  
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = (focusedIndex + 1) % items.length;
      (items[nextIndex] as HTMLElement).focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = (focusedIndex - 1 + items.length) % items.length;
      (items[prevIndex] as HTMLElement).focus();
    } else if (event.key === 'Escape') {
      this.hideManageButtonList(event);
    }
  };
  public manageButtonScrollEvents = (event: WheelEvent): void => {
    const list = document.querySelector('ul.ButtonList[style*="display: block"]') as HTMLElement;
    if (!list) return;
  
    const items = Array.from(list.querySelectorAll('li a'));
    if (event.deltaY > 0) {
      (items[0] as HTMLElement).focus();
    } else {
      (items[items.length - 1] as HTMLElement).focus();
    }
  };
}
