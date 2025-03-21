
// Enums from KHCOCommonTypes used in codotheque-dropdown-list custom control

export enum DisplayField {
    Code = 1,
    Label = 2,
    CodeAndLabel = 3
  }
  
  export enum LabelLength {
    // 12 characters length
    Char12 = 1,
    // 65 characters length
    Char65 = 2,
    // 05 characters length
    Char05 = 3,
    // 25 characters length
    Char25 = 4,
    // 1648 characters length
    Char1648 = 5,
  }
  
  export enum SortField {
    //sort by code
    Code = 1,
    //sort by label
    Label = 2,
    //don't sort the list
    None = 3
  }
  
  export enum SortDirection {
    Ascending = 1,
    Descending = 2,
    None = 3,
  }
  //from KHCOLocalizedLabel
  export enum LabelCodeType {
    String = 0,
    Numeric = 1,
    Unknown = 2,
  }
  // Interfaces
  export interface LocalizedLabel {
    code: string;
    label: string;
    language?: string;
    length?: LabelLength;
    codeType?: LabelCodeType;
    attributeName?: string;
  }


  