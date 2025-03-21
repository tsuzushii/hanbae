export enum NodeLevel {
    Level_1 = 1,
    Level_2 = 2
}

export enum NodeType {
    Category = 'Category',
    Step = 'Step',
    Header = 'Header',
    Separator = 'Separator'
}

export interface NodeItem {
    idNode: string;
    typeNode: NodeType;
    libelle: string;
    eventName: string;
    level: NodeLevel;
    visible: boolean;
    available: boolean;
    completed: boolean;
    locked: boolean;
}

export interface GlobalNavigationCategory {
    id: string;
    text: string;
    level: number;
    available: boolean;
    type: 'Category';
}

export interface GlobalNavigationStep {
    id: string;
    text: string;
    level: number;
    available: boolean;
    completed: boolean;
    locked: boolean;
    type: 'Step';
}

export interface GlobalNavigationHeader {
    text: string;
    type: 'Header';
}

export interface GlobalNavigationSeparator {
    type: 'Separator';
}

export type GlobalNavigationItem = 
    | GlobalNavigationCategory 
    | GlobalNavigationStep 
    | GlobalNavigationHeader 
    | GlobalNavigationSeparator;