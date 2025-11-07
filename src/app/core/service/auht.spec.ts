import { TestBed } from '@angular/core/testing';

import { Auht } from './auht';

describe('Auht', () => {
  let service: Auht;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Auht);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
