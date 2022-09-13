import { TestBed } from '@angular/core/testing';

import { MerchandiserService } from './merchandiser.service';

describe('MerchandiserService', () => {
  let service: MerchandiserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MerchandiserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
