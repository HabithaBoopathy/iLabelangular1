import { TestBed } from '@angular/core/testing';

import { WovenService } from './service/orderForms/woven.service';

describe('WovenService', () => {
  let service: WovenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WovenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
