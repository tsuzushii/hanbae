import { Component, ViewEncapsulation } from '@angular/core';
import { GlobalNavigationComponent } from './global-navigation/global-navigation.component';


@Component({
  selector: 'ag-sidebar',
  standalone: true,
  imports: [GlobalNavigationComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent {

}
