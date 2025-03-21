// global-navigation.types.ts
export interface BaseNavigationItem {
    text: string;
}

export interface SelectableNavigationItem extends BaseNavigationItem {
    id: string;
    available: boolean;
    level: 1 | 2;
}

export interface NavigationCategory extends SelectableNavigationItem {
    type: 'category';
}

export interface NavigationStep extends SelectableNavigationItem {
    type: 'step';
    completed: boolean;
    locked: boolean;
}

export interface NavigationHeader extends BaseNavigationItem {
    type: 'header';
}

export interface NavigationSeparator {
    type: 'separator';
}

export type NavigationItem = 
    | NavigationCategory 
    | NavigationStep 
    | NavigationHeader 
    | NavigationSeparator;