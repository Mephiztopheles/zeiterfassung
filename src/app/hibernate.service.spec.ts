import { TestBed, inject } from '@angular/core/testing';

import { HibernateService } from './hibernate.service';

describe('HibernateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HibernateService]
    });
  });

  it('should be created', inject([HibernateService], (service: HibernateService) => {
    expect(service).toBeTruthy();
  }));
});
