import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>Create Account</mat-card-title>
          <mat-card-subtitle>Join us and start booking</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="displayName" placeholder="John Doe">
              <mat-error *ngIf="signupForm.get('displayName')?.hasError('required')">Name is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" placeholder="you@example.com">
              <mat-error *ngIf="signupForm.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="signupForm.get('email')?.hasError('email')">Please enter a valid email</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="password">
              <button mat-icon-button matSuffix type="button" (click)="hidePassword.set(!hidePassword())">
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="signupForm.get('password')?.hasError('required')">Password is required</mat-error>
              <mat-error *ngIf="signupForm.get('password')?.hasError('minlength')">Password must be at least 6 characters</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirm Password</mat-label>
              <input matInput [type]="hideConfirmPassword() ? 'password' : 'text'" formControlName="confirmPassword">
              <button mat-icon-button matSuffix type="button" (click)="hideConfirmPassword.set(!hideConfirmPassword())">
                <mat-icon>{{ hideConfirmPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="signupForm.get('confirmPassword')?.hasError('required')">Please confirm your password</mat-error>
              <mat-error *ngIf="signupForm.hasError('passwordMismatch')">Passwords do not match</mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" class="full-width submit-btn"
                    [disabled]="!signupForm.valid || isSubmitting()">
              <mat-spinner *ngIf="isSubmitting()" diameter="20"></mat-spinner>
              <span *ngIf="!isSubmitting()">Create Account</span>
            </button>

          </form>
        </mat-card-content>

        <mat-card-actions>
          <p class="auth-link">
            Already have an account? <a routerLink="/login">Sign in</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .auth-card { width: 100%; max-width: 400px; padding: 24px; }
    mat-card-header { display: block; text-align: center; margin-bottom: 24px; }
    mat-card-title { font-size: 1.75rem; margin-bottom: 8px; }
    mat-card-subtitle { color: #666; }
    .full-width { width: 100%; }
    mat-form-field { margin-bottom: 8px; }
    .submit-btn { margin-top: 16px; padding: 8px; font-size: 1rem; }
    .submit-btn mat-spinner { display: inline-block; }
    mat-card-actions { padding-top: 16px; border-top: 1px solid #eee; }
    .auth-link { text-align: center; color: #666; margin: 0; }
    .auth-link a { color: #3f51b5; text-decoration: none; font-weight: 500; }
    .auth-link a:hover { text-decoration: underline; }
  `]
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  hidePassword = signal<boolean>(true);
  hideConfirmPassword = signal<boolean>(true);
  isSubmitting = signal<boolean>(false);

  signupForm: FormGroup = this.fb.group({
    displayName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  async onSubmit(): Promise<void> {
    if (!this.signupForm.valid) return;

    this.isSubmitting.set(true);
    try {
      const { confirmPassword, ...signupData } = this.signupForm.value;
      await this.authService.signup(signupData);
      this.snackBar.open('Account created successfully!', 'Close', { duration: 3000 });
    } catch (error: any) {
      let message = 'Signup failed. Please try again.';
      if (error?.code === 'auth/email-already-in-use') message = 'An account with this email already exists.';
      else if (error?.code === 'auth/weak-password') message = 'Password is too weak.';
      this.snackBar.open(message, 'Close', { duration: 3000 });
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
