import { TestBed } from '@angular/core/testing';

import { ProductReferenceService } from './service/product-reference.service';

describe('ProductReferenceService', () => {
  let service: ProductReferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductReferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
