import { AgTranslateModule } from '@ag/vc.ag-core/translate';
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ag-utility-bar',
  standalone: true,
  imports: [AgTranslateModule],
  templateUrl: './utility-bar.component.html',
  styleUrl: './utility-bar.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UtilityBarComponent  {
  isHelpDisabled: boolean = false;
  isExitDisabled: boolean = false;

  onExit(): void {
    console.log('Exit Clicked');
  }

  onHelp(): void {
    console.log('Help Clicked');
  }
}
