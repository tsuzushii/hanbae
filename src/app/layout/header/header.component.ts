import { AgTranslateModule } from '@ag/vc.ag-core/translate';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { LayoutService } from '../../shared/services/layout.service';
import { UtilityBarComponent } from "./utility-bar/utility-bar.component";
import { HeaderItem } from './models/header.types';
@Component({
  selector: 'ag-header',
  standalone: true,
  imports: [AgTranslateModule, UtilityBarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  encapsulation: ViewEncapsulation.None
})


export class HeaderComponent implements OnInit {
  // you'll get this from api call
   readonly headerCollection: HeaderItem[] = [
    { idPlace: 1, libelle: 'Contract', value: 'AG Care - 04 / 9.902.370' },
    { idPlace: 2, libelle: 'Referentie', value: '' },
    { idPlace: 3, libelle: '', value: '' },
    { idPlace: 4, libelle: 'Tussenpersoon', value: '69213 - SCRI BNCONTYPE2' },
    { idPlace: 5, libelle: '', value: '' },
    { idPlace: 6, libelle: '', value: '' }
  ];
  constructor (
    private readonly layoutService: LayoutService
    ) {}
   
  @ViewChild('utilityLinksContainer', { static: true }) utilityLinksContainer!: ElementRef;
  ngOnInit(): void {
      this.layoutService.loadHeaderData(this.headerCollection);
  }
}

