import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordOtp } from './reset-password-otp';

describe('ResetPasswordOtp', () => {
  let component: ResetPasswordOtp;
  let fixture: ComponentFixture<ResetPasswordOtp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPasswordOtp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPasswordOtp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
