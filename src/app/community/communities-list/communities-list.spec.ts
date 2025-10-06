import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitiesList } from './communities-list';

describe('CommunitiesList', () => {
  let component: CommunitiesList;
  let fixture: ComponentFixture<CommunitiesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunitiesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunitiesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
