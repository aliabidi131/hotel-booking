import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { AppUser, AuthCredentials, SignupData } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase = inject(SupabaseService).supabase;
  private router = inject(Router);

  currentUser = signal<AppUser | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.initAuth();
  }

  private async initAuth() {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      if (session?.user) {
        this.setUserFromSession(session.user);
      }
    } catch (error) {
      console.error('Auth init error:', error);
    } finally {
      this.isLoading.set(false);
    }

    this.supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN' && session?.user) {
        this.setUserFromSession(session.user);
      } else if (event === 'SIGNED_OUT') {
        this.currentUser.set(null);
      }
      this.isLoading.set(false);
    });
  }

  private setUserFromSession(user: any) {
    const appUser: AppUser = {
      uid: user.id,
      email: user.email || '',
      displayName: user.user_metadata?.display_name || user.user_metadata?.displayName || user.email?.split('@')[0] || '',
      role: user.user_metadata?.role || 'user',
      createdAt: new Date(user.created_at)
    };
    this.currentUser.set(appUser);
  }

  async signup(data: SignupData): Promise<void> {
    this.errorMessage.set(null);
    this.isLoading.set(true);

    try {
      // Signup without email verification
      const { data: authData, error } = await this.supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            display_name: data.displayName,
            displayName: data.displayName,
            role: 'user'
          }
        }
      });

      if (error) {
        this.errorMessage.set(error.message);
        throw error;
      }

      if (authData.user) {
        // If email confirmation is disabled in Supabase, the user is immediately confirmed
        // Otherwise, you may need to auto-login or prompt user to verify email
        this.setUserFromSession(authData.user);
        
        // Navigate after a brief delay to ensure state is updated
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      this.errorMessage.set(error?.message || 'Signup failed. Please try again.');
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  async login(credentials: AuthCredentials): Promise<void> {
    this.errorMessage.set(null);
    this.isLoading.set(true);

    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) {
        this.errorMessage.set(error.message);
        throw error;
      }

      if (data.user) {
        this.setUserFromSession(data.user);
        this.router.navigate(['/']);
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  async logout(): Promise<void> {
    await this.supabase.auth.signOut();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  async setAdmin(email: string): Promise<void> {
    const { data, error } = await this.supabase.auth.admin.updateUserById(
      this.currentUser()?.uid || '',
      { user_metadata: { role: 'admin' } }
    );
    if (error) console.error('Error setting admin:', error);
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  isAuthenticated(): boolean {
    return !!this.currentUser();
  }
}
