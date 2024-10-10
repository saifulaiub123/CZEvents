import { TestBed } from '@angular/core/testing';

import { RedirectToSectionAllGuard } from './redirect-to-section-all.guard';

describe('RedirectToSectionAllGuard', () => {
  let guard: RedirectToSectionAllGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RedirectToSectionAllGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
