import { AgTemplateService } from '@ag/vc.ag-core/template';
import { AgConfigurationService } from '@ag/vc.ag-ui/config';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, HostListener, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { LayoutService } from '../shared/services/layout.service';
import { ContentComponent } from './content/content.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'ag-custom-layout',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent,
    ContentComponent,
  ],
  templateUrl: './custom-layout.component.html',
  styleUrls: ['./custom-layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomLayoutComponent implements OnInit, AfterViewInit {
  componentClass = 'ag-custom-layout';

  @Output() languageSelected = new EventEmitter<string>();

  constructor(
    public readonly configService: AgConfigurationService,
    templateService: AgTemplateService,
    private readonly layout: LayoutService,
    private readonly cdr: ChangeDetectorRef,
  ) {
  }

  protected switchLanguage(language: string): void {
    this.languageSelected.emit(language);
  }
  ngOnInit(): void {
    

  }
  
  ngAfterViewInit(): void {
    this.hookUpEvents();
    this.resizeScreen();
  }


  private hookUpEvents(): void {
    this.layout.selectTextBoxOnClick();
    this.layout.highlightLabels();
    this.layout.initializeToolBar();
    this.layout.initializeGeneralTableStyles();
    this.layout.disableLinks();
    this.layout.makeColorboxDraggable();
    this.layout.configureToolbar();
  }
  private resizeScreen(){
    this.cdr.detectChanges();
    this.layout.resizeScreen();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.cdr.detectChanges();
    this.layout.resizeScreen();
  }
}
