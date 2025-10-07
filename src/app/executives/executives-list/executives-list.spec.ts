import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutivesList } from './executives-list';

describe('ExecutivesList', () => {
  let component: ExecutivesList;
  let fixture: ComponentFixture<ExecutivesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutivesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutivesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
