import { TestBed } from '@angular/core/testing';

import { CostingSheetService } from './costing-sheet.service';

describe('CostingSheetService', () => {
  let service: CostingSheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CostingSheetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
