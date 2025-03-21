import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorContainerComponent } from '../error-container/error-container.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  selector: 'ag-content',
  standalone: true,
  imports: [
    ToolbarComponent,
    ErrorContainerComponent,
    RouterOutlet
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ContentComponent {

}
