import { TestBed } from '@angular/core/testing';

import { MdocumenttypeService } from './service/mdocumenttype.service';

describe('MdocumenttypeService', () => {
  let service: MdocumenttypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MdocumenttypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
