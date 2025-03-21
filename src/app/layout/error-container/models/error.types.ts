export enum Severity {
    Error = 'error',
    Warning = 'warning',
    Notification = 'notification'
  }
  
  export enum VerticalAlign {
    Top = 'top',
    Middle = 'middle',
    Bottom = 'bottom'
  }
  
  export enum VerticalSizingType {
    Auto = 'auto',
    Fixed = 'fixed',
    NotLimited = 'notLimited'
  }
  
  export enum PopupVerticalAlign {
    WindowCenter = 'windowCenter',
    TopSides = 'topSides',
    BottomSides = 'bottomSides',
    NotSet = 'notSet'
  }
  export interface DetailPopupConfig {
    showDetail: boolean;
    headerText: string;
    modal: boolean;
    allowDragging: boolean;
    verticalAlign:string;
    horizontalAlign: string;
  }
  export enum PopupHorizontalAlign {
    WindowCenter = 'windowCenter',
    LeftSides = 'leftSides',
    RightSides = 'rightSides',
    NotSet = 'notSet'
  }
  
  export enum ImageStyle {
    FIB = 'fib',
    BANK = 'bank'
  }
  
  export interface Notification {
    id?: number;
    shortMessage: string;
    severity: Severity;
    longMessage?: string;
    codothequeId?: string;
    controlId?: string;
    clientSide?: boolean;
  }