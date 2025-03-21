import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorDisplayDemoComponent } from './error-display-demo.component';

describe('ErrorDisplayDemoComponent', () => {
  let component: ErrorDisplayDemoComponent;
  let fixture: ComponentFixture<ErrorDisplayDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorDisplayDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorDisplayDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
