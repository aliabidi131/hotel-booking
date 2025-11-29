import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
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
    <div class="contact-container container">
      <h1 class="page-title">Contact Us</h1>

      <div class="contact-grid">
        <mat-card class="contact-form-card">
          <mat-card-header>
            <mat-card-title>Send us a Message</mat-card-title>
            <mat-card-subtitle>We'd love to hear from you</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Your Name</mat-label>
                <input matInput formControlName="name" placeholder="John Doe">
                @if (contactForm.get('name')?.hasError('required') && contactForm.get('name')?.touched) {
                  <mat-error>Name is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" placeholder="you@example.com">
                @if (contactForm.get('email')?.hasError('required') && contactForm.get('email')?.touched) {
                  <mat-error>Email is required</mat-error>
                }
                @if (contactForm.get('email')?.hasError('email') && contactForm.get('email')?.touched) {
                  <mat-error>Please enter a valid email</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Subject</mat-label>
                <input matInput formControlName="subject" placeholder="How can we help?">
                @if (contactForm.get('subject')?.hasError('required') && contactForm.get('subject')?.touched) {
                  <mat-error>Subject is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Message</mat-label>
                <textarea matInput formControlName="message" rows="5" placeholder="Your message..."></textarea>
                @if (contactForm.get('message')?.hasError('required') && contactForm.get('message')?.touched) {
                  <mat-error>Message is required</mat-error>
                }
              </mat-form-field>

              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="!contactForm.valid || isSending()" class="submit-btn">
                @if (isSending()) {
                  <mat-spinner diameter="20"></mat-spinner>
                  Sending...
                } @else {
                  <mat-icon>send</mat-icon>
                  Send Message
                }
              </button>
            </form>
          </mat-card-content>
        </mat-card>

        <div class="contact-info">
          <mat-card class="info-card">
            <mat-card-content>
              <div class="info-item">
                <mat-icon color="primary">location_on</mat-icon>
                <div>
                  <h3>Address</h3>
                  <p>123 Hotel Street<br>New York, NY 10001</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="info-card">
            <mat-card-content>
              <div class="info-item">
                <mat-icon color="primary">phone</mat-icon>
                <div>
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="info-card">
            <mat-card-content>
              <div class="info-item">
                <mat-icon color="primary">email</mat-icon>
                <div>
                  <h3>Email</h3>
                  <p>aliabidi131&#64;gmail.com</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="info-card">
            <mat-card-content>
              <div class="info-item">
                <mat-icon color="primary">access_time</mat-icon>
                <div>
                  <h3>Hours</h3>
                  <p>24/7 Customer Support</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-container { padding-top: 84px; }
    .contact-grid { display: grid; grid-template-columns: 1fr 350px; gap: 24px; }
    .contact-form-card { padding: 8px; }
    .full-width { width: 100%; }
    .submit-btn { display: flex; align-items: center; gap: 8px; }
    .submit-btn mat-icon { margin-right: 8px; }
    .contact-info { display: flex; flex-direction: column; gap: 16px; }
    .info-card { transition: transform 0.2s; }
    .info-card:hover { transform: translateX(-4px); }
    .info-item { display: flex; gap: 16px; align-items: flex-start; }
    .info-item mat-icon { font-size: 32px; width: 32px; height: 32px; }
    .info-item h3 { margin: 0 0 4px; color: #333; }
    .info-item p { margin: 0; color: #666; line-height: 1.5; }
    @media (max-width: 900px) {
      .contact-grid { grid-template-columns: 1fr; }
      .contact-info { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    }
    @media (max-width: 600px) {
      .contact-info { grid-template-columns: 1fr; }
    }
  `]
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private contactService = inject(ContactService);

  isSending = signal<boolean>(false);

  contactForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', Validators.required]
  });

  async onSubmit() {
    if (!this.contactForm.valid) return;

    this.isSending.set(true);
    try {
      const result = await this.contactService.sendMessage(this.contactForm.value);
      
      if (result.success) {
        this.snackBar.open('Message sent successfully! We\'ll get back to you soon.', 'Close', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.contactForm.reset();
      } else {
        this.snackBar.open(result.message, 'Close', { duration: 5000 });
      }
    } catch (error: any) {
      this.snackBar.open('Failed to send message. Please try again.', 'Close', { duration: 5000 });
    } finally {
      this.isSending.set(false);
    }
  }
}
