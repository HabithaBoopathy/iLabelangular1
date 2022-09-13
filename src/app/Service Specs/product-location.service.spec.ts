import { TestBed } from '@angular/core/testing';

import { ProductLocationService } from './service/product-location.service';

describe('ProductLocationService', () => {
  let service: ProductLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
