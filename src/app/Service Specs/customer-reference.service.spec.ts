import { TestBed } from '@angular/core/testing';

import { CustomerReferenceService } from './service/customer-reference.service';

describe('CustomerReferenceService', () => {
  let service: CustomerReferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerReferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
