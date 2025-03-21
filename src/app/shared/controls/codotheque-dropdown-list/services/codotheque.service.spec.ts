import { TestBed } from '@angular/core/testing';

import { CodothequeService } from './codotheque.service';

describe('CodothequeService', () => {
  let service: CodothequeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodothequeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
