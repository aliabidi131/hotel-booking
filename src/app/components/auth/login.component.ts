import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
  selector: 'app-login',
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
          <mat-card-title>Welcome Back</mat-card-title>
          <mat-card-subtitle>Sign in to your account</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" placeholder="you@example.com">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="password">
              <button mat-icon-button matSuffix type="button" (click)="hidePassword.set(!hidePassword())">
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" class="full-width submit-btn"
                    [disabled]="!loginForm.valid || isSubmitting()">
              <mat-spinner *ngIf="isSubmitting()" diameter="20"></mat-spinner>
              <span *ngIf="!isSubmitting()">Sign In</span>
            </button>

          </form>
        </mat-card-content>

        <mat-card-actions>
          <p class="auth-link">
            Don't have an account? <a routerLink="/signup">Sign up</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .auth-card { width: 100%; max-width: 400px; padding: 24px; }
    mat-card-header { display: block; text-align: center; margin-bottom: 24px; }
    .full-width { width: 100%; }
    mat-form-field { margin-bottom: 8px; }
    .submit-btn { margin-top: 16px; padding: 8px; font-size: 1rem; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  hidePassword = signal<boolean>(true);
  isSubmitting = signal<boolean>(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  async onSubmit(): Promise<void> {
    if (!this.loginForm.valid) return;
    this.isSubmitting.set(true);
    try {
      await this.authService.login(this.loginForm.value);
      this.snackBar.open('Successfully signed in', 'Close', { duration: 3000 });
      this.router.navigate(['/']);
    } catch (error: any) {
      this.snackBar.open(this.authService.errorMessage() || 'Login failed', 'Close', { duration: 4000 });
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
