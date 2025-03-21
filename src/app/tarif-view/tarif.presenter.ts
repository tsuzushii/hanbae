import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ErrorDisplayService } from "../layout/error-container/services/error-display.service";
import { ToolbarService } from '../layout/toolbar/services/toolbar.service';

@Injectable()
export class TarifPresenter {
tarifForm: FormGroup; 

constructor(
    private readonly toolbar: ToolbarService,
    private readonly error: ErrorDisplayService,
    private readonly fb: FormBuilder
) {
    this.fb.group({
        firstName: ['', Validators.required]
      });
}
 
}