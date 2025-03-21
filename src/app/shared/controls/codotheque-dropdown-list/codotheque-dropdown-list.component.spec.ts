import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodothequeDropdownListComponent } from './codotheque-dropdown-list.component';

describe('CodothequeDropdownListComponent', () => {
  let component: CodothequeDropdownListComponent;
  let fixture: ComponentFixture<CodothequeDropdownListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodothequeDropdownListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodothequeDropdownListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
