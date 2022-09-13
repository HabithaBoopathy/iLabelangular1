import { TestBed } from '@angular/core/testing';

import { QuotationReferenceNumberService } from '../services/quotation-reference-number.service';

describe('QuotationReferenceNumberService', () => {
  let service: QuotationReferenceNumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuotationReferenceNumberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
