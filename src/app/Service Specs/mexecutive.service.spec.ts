import { TestBed } from '@angular/core/testing';

import { MexecutiveService } from '../services/mexecutive.service';

describe('MexecutiveService', () => {
  let service: MexecutiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MexecutiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
