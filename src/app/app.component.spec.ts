import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AgMaintenanceUtilities } from '@ag/vc.ag-core/maintenance';
import { AgOneTrustService, GdprUrls } from '@ag/vc.ag-core/gdpr';
import { AgTranslateTestingModule } from '@ag/vc.ag-core/translate';
import { AgConfigurationTestingModule } from '@ag/vc.ag-ui/config';

jest.mock('@ag/vc.ag-core/maintenance');

class GdprServiceMock {
  getGdprUrls(): GdprUrls {
    return {
      gdpr: 'https://www.example.org/gdpr',
      privacy: 'https://www.example.org/privacy',
      termsOfUse: 'https://www.example.org/termsOfUse',
    }
  }
}

describe('AppComponent', () => {
  beforeEach(async () => {
    jest
      .spyOn(AgMaintenanceUtilities, 'checkStatus')
      .mockImplementation(() => {});

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        AgTranslateTestingModule,
        AgConfigurationTestingModule
      ],
      providers: [
        { provide: AgOneTrustService, useClass: GdprServiceMock }
      ]
    }).compileComponents();
  });

  test('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
