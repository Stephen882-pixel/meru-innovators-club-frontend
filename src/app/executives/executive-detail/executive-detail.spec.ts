import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveDetail } from './executive-detail';

describe('ExecutiveDetail', () => {
  let component: ExecutiveDetail;
  let fixture: ComponentFixture<ExecutiveDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutiveDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutiveDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
