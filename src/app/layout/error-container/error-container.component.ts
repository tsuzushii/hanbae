import { AgTranslateModule } from '@ag/vc.ag-core/translate';
import { Component } from '@angular/core';
import { ErrorDisplayComponent } from "./error-display/error-display.component";
@Component({
  selector: 'ag-error-container',
  standalone: true,
  imports: [AgTranslateModule, ErrorDisplayComponent],
  templateUrl: './error-container.component.html',
  styleUrl: './error-container.component.scss'
})
export class ErrorContainerComponent {

}
