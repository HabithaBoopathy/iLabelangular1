import { TestBed } from '@angular/core/testing';

import { MunitService } from './service/munit.service';

describe('MunitService', () => {
  let service: MunitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MunitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
