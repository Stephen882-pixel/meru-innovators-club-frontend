import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityJoin } from './community-join';

describe('CommunityJoin', () => {
  let component: CommunityJoin;
  let fixture: ComponentFixture<CommunityJoin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityJoin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityJoin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
