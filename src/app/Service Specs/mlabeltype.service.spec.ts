import { TestBed } from '@angular/core/testing';

import { MlabeltypeService } from './service/mlabeltype.service';

describe('MlabeltypeService', () => {
  let service: MlabeltypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MlabeltypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
