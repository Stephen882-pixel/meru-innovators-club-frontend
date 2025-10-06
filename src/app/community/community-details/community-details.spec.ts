import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityDetails } from './community-details';

describe('CommunityDetails', () => {
  let component: CommunityDetails;
  let fixture: ComponentFixture<CommunityDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
