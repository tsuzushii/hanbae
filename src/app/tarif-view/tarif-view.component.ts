import { AgTranslateModule } from '@ag/vc.ag-core/translate';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarService } from '../layout/toolbar/services/toolbar.service';
import { CodothequeDropdownListComponent } from "../shared/controls/codotheque-dropdown-list/codotheque-dropdown-list.component";
import { DisplayField, LocalizedLabel } from '../shared/controls/codotheque-dropdown-list/models/codotheque-dropdown-list.types';
import { SmartTextboxComponent } from '../shared/controls/smart-textbox/smart-textbox.component';
import { TarifPresenter } from './tarif.presenter';

@Component({
  selector: 'ag-tarif-view',
  standalone: true,
  imports: [SmartTextboxComponent, FormsModule, ReactiveFormsModule, CodothequeDropdownListComponent, AgTranslateModule],
  templateUrl: './tarif-view.component.html',
  styleUrl: './tarif-view.component.scss',
  viewProviders: [TarifPresenter]
})
export class TarifViewComponent implements OnInit{
  test=  DisplayField.Label
  // data needs to come from api
  mutuelleLabels: LocalizedLabel[] = [
    {code: '01', label: 'K+G'},
  ]  
  coverLabels: LocalizedLabel[] = [
    {code: '1', label: 'Normaal'},
    {code: '2', label: 'Vision'},
  ];
  public get TarifForm(): FormGroup {
    return this._presenter.tarifForm;
  }
  constructor(
    private readonly _presenter: TarifPresenter,
    private readonly fb: FormBuilder,
    private readonly toolbarService: ToolbarService
    ) {
   
  }
  ngOnInit(): void {
    this.toolbarService.nextClicked$.subscribe(() => {
      this.onNextClicked();
    });
  }
  onNextClicked() {
    console.log('next button clicked')
  }
  

  deleteInsured() {
    console.log('deleteInsured');
  }
  buttonNewInsuredClick() {

  }
}
