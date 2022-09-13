import { TestBed } from '@angular/core/testing';

import { EverythingService } from './service/orderForms/everything.service';

describe('EverythingService', () => {
  let service: EverythingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EverythingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
