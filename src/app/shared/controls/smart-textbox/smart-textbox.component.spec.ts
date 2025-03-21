import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartTextboxComponent } from './smart-textbox.component';

describe('SmartTextboxComponent', () => {
  let component: SmartTextboxComponent;
  let fixture: ComponentFixture<SmartTextboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartTextboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
