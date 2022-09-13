import { TestBed } from '@angular/core/testing';

import { PrintedService } from './service/orderForms/printed.service';

describe('PrintedService', () => {
  let service: PrintedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
