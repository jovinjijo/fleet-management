import { TestBed } from '@angular/core/testing';

import { FleetDataProviderService } from './fleet-data-provider.service';

describe('FleetDataProviderService', () => {
  let service: FleetDataProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FleetDataProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
