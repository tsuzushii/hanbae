import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GlobalNavigationItem, NodeItem, NodeType } from '../models/navigation.types';

@Injectable({
    providedIn: 'root'
})

export class NavigationService {
    private navigationItems = new BehaviorSubject<GlobalNavigationItem[]>([]);
    private selectedItemId = new BehaviorSubject<string>('');
    private itemsCollectionForCurrentState: NodeItem[] = [];
    
    navigationItems$ = this.navigationItems.asObservable();
    selectedItemId$ = this.selectedItemId.asObservable();

    loadGlobalNavigationData(globalNavigationCollection: NodeItem[], selectedItemId: string): void {
        // Clear existing items
        this.itemsCollectionForCurrentState = [];
        
        // Add items to state collection if not exists
        globalNavigationCollection.forEach(item => {
            const exists = this.itemsCollectionForCurrentState.some(
                stateItem => stateItem.idNode === item.idNode
            );
            
            if (!exists) {
                this.itemsCollectionForCurrentState.push(item);
            }
        });

        // Transform items to navigation items
        const navigationItems: GlobalNavigationItem[] = this.itemsCollectionForCurrentState
            .filter(nodeItem => nodeItem.visible)
            .map(nodeItem => {
                switch (nodeItem.typeNode) {
                    case NodeType.Category:
                        return {
                            type: 'Category',
                            id: nodeItem.idNode,
                            text: nodeItem.libelle,
                            level: nodeItem.level,
                            available: nodeItem.available
                        };

                    case NodeType.Step:
                        return {
                            type: 'Step',
                            id: nodeItem.idNode,
                            text: nodeItem.libelle,
                            level: nodeItem.level,
                            available: nodeItem.available,
                            completed: nodeItem.completed,
                            locked: nodeItem.locked
                        };

                    case NodeType.Header:
                        return {
                            type: 'Header',
                            text: nodeItem.libelle
                        };

                    case NodeType.Separator:
                        return {
                            type: 'Separator'
                        };
                }
            });

        // Update observables
        this.navigationItems.next(navigationItems);
        this.setSelectedItem(selectedItemId);
    }

    // Add this method that was missing
    setSelectedItem(id: string): void {
        this.selectedItemId.next(id);
    }
}