export enum ToolBarButton {
    Print = 'Print',
    Save = 'Save',
    Previous = 'Previous',
    Next = 'Next',
    Confirm = 'Confirm',
    Cancel = 'Cancel',
    Ok = 'Ok',
    Info = 'Info',
    PrimesComptant = 'PrimesComptant',
    CommissionsEtPouvoirs = 'CommissionsEtPouvoirs',
    MotifValMan = 'MotifValMan'
  }
  
  export interface ToolbarButtonState {
    visible: boolean;
    enabled: boolean;
  }
  
  export interface ToolbarState {
    [key: string]: ToolbarButtonState;
  }