import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomLayoutComponent } from './custom-layout.component';
import { AgLoggerTestingModule } from '@ag/vc.ag-core/logger';
import { AgTranslateTestingModule } from '@ag/vc.ag-core/translate';

describe('CustomLayoutComponent', () => {
  let component: CustomLayoutComponent;
  let fixture: ComponentFixture<CustomLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AgLoggerTestingModule,
        AgTranslateTestingModule
      ]
    });

    fixture = TestBed.createComponent(CustomLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
