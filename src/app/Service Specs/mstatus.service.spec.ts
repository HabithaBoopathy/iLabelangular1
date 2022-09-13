import { TestBed } from '@angular/core/testing';

import { MstatusService } from './service/mstatus.service';

describe('MstatusService', () => {
  let service: MstatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MstatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
