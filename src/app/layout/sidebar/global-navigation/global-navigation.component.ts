// global-navigation.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GlobalNavigationCategory, GlobalNavigationHeader, GlobalNavigationItem, GlobalNavigationSeparator, GlobalNavigationStep, NodeItem, NodeLevel, NodeType } from '../models/navigation.types';
import { NavigationService } from '../services/navigation.service';
 
@Component({
    selector: 'ag-global-navigation',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './global-navigation.component.html',
    styleUrls: ['./global-navigation.component.scss']
})
export class GlobalNavigationComponent implements OnInit, OnDestroy {
    navigationItems: GlobalNavigationItem[] = [];
    selectedItemId = '';
    private destroy$ = new Subject<void>();

    constructor(private navigationService: NavigationService) {}

    ngOnInit() {
        // Sample navigation data - replace with your actual data source
        const navigationCollection: NodeItem[] = [
            {
                idNode: 'tarief',
                typeNode: NodeType.Step,
                libelle: 'Tarief',
                eventName: 'tarief_event',
                level: NodeLevel.Level_1,
                visible: true,
                available: true,
                completed: false,
                locked: false
            },
            {
                idNode: 'separator1',
                typeNode: NodeType.Separator,
                libelle: '',
                eventName: '',
                level: NodeLevel.Level_1,
                visible: true,
                available: true,
                completed: false,
                locked: false
            },
            {
                idNode: 'premies',
                typeNode: NodeType.Step,
                libelle: 'Premies',
                eventName: 'premies_event',
                level: NodeLevel.Level_1,
                visible: true,
                available: true,
                completed: false,
                locked: false
            },
            {
                idNode: 'separator2',
                typeNode: NodeType.Separator,
                libelle: '',
                eventName: '',
                level: NodeLevel.Level_1,
                visible: true,
                available: true,
                completed: false,
                locked: false
            },
            {
                idNode: 'voorstel',
                typeNode: NodeType.Step,
                libelle: 'Voorstel',
                eventName: 'voorstel_event',
                level: NodeLevel.Level_1,
                visible: true,
                available: false,
                completed: false,
                locked: false
            },
            {
                idNode: 'separator3',
                typeNode: NodeType.Separator,
                libelle: '',
                eventName: '',
                level: NodeLevel.Level_1,
                visible: true,
                available: true,
                completed: false,
                locked: false
            },
            {
                idNode: 'printPreview',
                typeNode: NodeType.Step,
                libelle: 'Print Preview',
                eventName: 'print_preview_event',
                level: NodeLevel.Level_1,
                visible: true,
                available: false,
                completed: false,
                locked: false
            }
        ];

        // Load the navigation data
        this.navigationService.loadGlobalNavigationData(navigationCollection, 'tarief');

        // Subscribe to updates
        this.navigationService.navigationItems$
            .pipe(takeUntil(this.destroy$))
            .subscribe(items => {
                this.navigationItems = items;
            });

        this.navigationService.selectedItemId$
            .pipe(takeUntil(this.destroy$))
            .subscribe(id => {
                this.selectedItemId = id;
            });
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    getStepClasses(item: GlobalNavigationItem): string {
        if (item.type !== 'Step') return '';

        const classes = [`GN_Step_L${item.level}`];
        
        if (item.id === this.selectedItemId) {
            classes.push(`GN_Step_L${item.level}_Selected`);
        }
        
        if (item.available) {
            classes.push('GN_Clickable');
        }
        
        if (!item.available) {
            classes.push(`GN_Step_L${item.level}_NotAvailable`);
        }
        
        if (item.completed) {
            classes.push(`GN_Step_L${item.level}_Completed`);
        }
        
        return classes.join(' ');
    }

    getCategoryClasses(item: GlobalNavigationItem): string {
        if (item.type !== 'Category') return '';

        const classes = [`GN_Category_L${item.level}`];
        
        if (item.id === this.selectedItemId) {
            classes.push(`GN_Category_L${item.level}_Selected`);
        }
        
        if (item.available) {
            classes.push('GN_Clickable');
        }
        
        if (!item.available) {
            classes.push(`GN_Category_L${item.level}_NotAvailable`);
        }
        
        return classes.join(' ');
    }

    onItemClick(item: GlobalNavigationItem): void {
        if ((item.type === 'Step' || item.type === 'Category') && item.available) {
            this.navigationService.setSelectedItem(item.id);
        }
    }

    // Type guard helpers
    isStep(item: GlobalNavigationItem): item is GlobalNavigationStep {
        return item.type === 'Step';
    }

    isCategory(item: GlobalNavigationItem): item is GlobalNavigationCategory {
        return item.type === 'Category';
    }

    isHeader(item: GlobalNavigationItem): item is GlobalNavigationHeader {
        return item.type === 'Header';
    }

    isSeparator(item: GlobalNavigationItem): item is GlobalNavigationSeparator {
        return item.type === 'Separator';
    }
}