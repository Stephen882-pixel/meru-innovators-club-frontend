import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubDetails } from './club-details';

describe('ClubDetails', () => {
  let component: ClubDetails;
  let fixture: ComponentFixture<ClubDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClubDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
