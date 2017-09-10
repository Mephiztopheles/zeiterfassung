import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StundenzettelListeComponent } from './stundenzettel-liste.component';

describe('StundenzettelListeComponent', () => {
  let component: StundenzettelListeComponent;
  let fixture: ComponentFixture<StundenzettelListeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StundenzettelListeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StundenzettelListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
