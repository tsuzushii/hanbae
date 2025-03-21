import { AgMaintenanceUtilities } from '@ag/vc.ag-core/maintenance';
import { AgTranslateService } from '@ag/vc.ag-core/translate';
import { AgConfigurationService } from '@ag/vc.ag-ui/config';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CustomLayoutComponent } from './layout/custom-layout.component';
@Component({
  selector: 'ag-root',
  standalone: true,
  imports: [
    CommonModule,
    CustomLayoutComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    private readonly configurationService: AgConfigurationService,
    private readonly translateService: AgTranslateService,
  ) {
    AgMaintenanceUtilities.checkStatus();
    this.translateService.changeLanguage('nl');
  }
  

       
}
