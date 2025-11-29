import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { HotelService } from '../../services/hotel.service';
import { BookingService } from '../../services/booking.service';
import { SeedService } from '../../services/seed.service';
import { ContactService, ContactMessage } from '../../services/contact.service';
import { Hotel } from '../../models/hotel.model';
import { Booking } from '../../models/booking.model';
import { HotelFormComponent } from './hotel-form.component';
import { HotelListAdminComponent } from './hotel-list-admin.component';
import { BookingListAdminComponent } from './booking-list-admin.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatChipsModule,
    HotelFormComponent,
    HotelListAdminComponent,
    BookingListAdminComponent
  ],
  template: `
    <div class="admin-container container">
      <h1 class="page-title">Admin Dashboard</h1>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon hotels">
              <mat-icon>hotel</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ totalHotels() }}</span>
              <span class="stat-label">Hotels</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon bookings">
              <mat-icon>book_online</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ totalBookings() }}</span>
              <span class="stat-label">Total Bookings</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon pending">
              <mat-icon>pending_actions</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ pendingBookings() }}</span>
              <span class="stat-label">Pending</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon revenue">
              <mat-icon>attach_money</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">\${{ totalRevenue() }}</span>
              <span class="stat-label">Revenue</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon messages">
              <mat-icon [matBadge]="unreadMessages()" matBadgeColor="warn" [matBadgeHidden]="unreadMessages() === 0">mail</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ totalMessages() }}</span>
              <span class="stat-label">Messages</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-tab-group>
        <mat-tab label="Hotels">
          <div class="tab-content">
            <div class="tab-header">
              <h2>Manage Hotels</h2>
              <button mat-raised-button color="primary" (click)="showAddHotel = true">
                <mat-icon>add</mat-icon>
                Add Hotel
              </button>
            </div>

            @if (showAddHotel) {
              <app-hotel-form 
                (hotelSaved)="onHotelSaved()"
                (cancelled)="showAddHotel = false">
              </app-hotel-form>
            }

            <app-hotel-list-admin 
              [hotels]="hotels()"
              (hotelDeleted)="loadHotels()">
            </app-hotel-list-admin>
          </div>
        </mat-tab>

        <mat-tab label="Bookings">
          <div class="tab-content">
            <h2>All Bookings</h2>
            <app-booking-list-admin 
              [bookings]="bookings()"
              (bookingUpdated)="loadBookings()">
            </app-booking-list-admin>
          </div>
        </mat-tab>

        <mat-tab label="Database">
          <div class="tab-content">
            <h2>Database Management</h2>
            
            <div class="db-stats">
              <mat-card class="db-stat-card">
                <mat-card-content>
                  <mat-icon>hotel</mat-icon>
                  <span>{{ dbStats().hotels }} Hotels</span>
                </mat-card-content>
              </mat-card>
              <mat-card class="db-stat-card">
                <mat-card-content>
                  <mat-icon>star</mat-icon>
                  <span>{{ dbStats().ratings }} Ratings</span>
                </mat-card-content>
              </mat-card>
              <mat-card class="db-stat-card">
                <mat-card-content>
                  <mat-icon>book_online</mat-icon>
                  <span>{{ dbStats().bookings }} Bookings</span>
                </mat-card-content>
              </mat-card>
            </div>

            <div class="db-actions">
              <mat-card class="action-card">
                <mat-card-header>
                  <mat-card-title>Seed Sample Data</mat-card-title>
                  <mat-card-subtitle>Add 5 sample hotels with images and ratings</mat-card-subtitle>
                </mat-card-header>
                <mat-card-actions>
                  <button mat-raised-button color="primary" 
                          (click)="seedDatabase()" 
                          [disabled]="isSeeding()">
                    @if (isSeeding()) {
                      <mat-spinner diameter="20"></mat-spinner>
                    } @else {
                      <mat-icon>add_circle</mat-icon>
                    }
                    Seed Hotels & Ratings
                  </button>
                </mat-card-actions>
              </mat-card>

              <mat-card class="action-card warning">
                <mat-card-header>
                  <mat-card-title>Reset Database</mat-card-title>
                  <mat-card-subtitle>Clear all data and reseed with sample data</mat-card-subtitle>
                </mat-card-header>
                <mat-card-actions>
                  <button mat-raised-button color="warn" 
                          (click)="clearAndSeedDatabase()" 
                          [disabled]="isSeeding()">
                    @if (isSeeding()) {
                      <mat-spinner diameter="20"></mat-spinner>
                    } @else {
                      <mat-icon>refresh</mat-icon>
                    }
                    Clear & Reseed All
                  </button>
                </mat-card-actions>
              </mat-card>

              <mat-card class="action-card danger">
                <mat-card-header>
                  <mat-card-title>Clear All Data</mat-card-title>
                  <mat-card-subtitle>Remove all hotels, bookings, and ratings</mat-card-subtitle>
                </mat-card-header>
                <mat-card-actions>
                  <button mat-raised-button color="warn" 
                          (click)="clearDatabase()" 
                          [disabled]="isSeeding()">
                    @if (isSeeding()) {
                      <mat-spinner diameter="20"></mat-spinner>
                    } @else {
                      <mat-icon>delete_forever</mat-icon>
                    }
                    Clear All Data
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            Messages
            @if (unreadMessages() > 0) {
              <span class="badge">{{ unreadMessages() }}</span>
            }
          </ng-template>
          <div class="tab-content">
            <h2>Contact Messages</h2>
            
            @if (messages().length === 0) {
              <div class="empty-state">
                <mat-icon>inbox</mat-icon>
                <p>No messages yet</p>
              </div>
            } @else {
              <div class="messages-list">
                @for (msg of messages(); track msg.id) {
                  <mat-card class="message-card" [class.unread]="msg.status === 'unread'">
                    <mat-card-header>
                      <mat-card-title>{{ msg.subject }}</mat-card-title>
                      <mat-card-subtitle>
                        From: {{ msg.name }} &lt;{{ msg.email }}&gt;
                        <span class="date">{{ msg.createdAt | date:'medium' }}</span>
                      </mat-card-subtitle>
                    </mat-card-header>
                    <mat-card-content>
                      <p>{{ msg.message }}</p>
                    </mat-card-content>
                    <mat-card-actions>
                      <mat-chip-set>
                        <mat-chip [class]="msg.status">{{ msg.status }}</mat-chip>
                      </mat-chip-set>
                      <div class="actions">
                        @if (msg.status === 'unread') {
                          <button mat-button color="primary" (click)="markAsRead(msg.id!)">
                            <mat-icon>mark_email_read</mat-icon> Mark as Read
                          </button>
                        }
                        <a mat-button color="accent" [href]="'mailto:' + msg.email + '?subject=Re: ' + msg.subject">
                          <mat-icon>reply</mat-icon> Reply
                        </a>
                        <button mat-button color="warn" (click)="deleteMessage(msg.id!)">
                          <mat-icon>delete</mat-icon> Delete
                        </button>
                      </div>
                    </mat-card-actions>
                  </mat-card>
                }
              </div>
            }
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .admin-container {
      padding-top: 84px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: white;
    }

    .stat-icon.hotels { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .stat-icon.bookings { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
    .stat-icon.pending { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .stat-icon.revenue { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .stat-icon.messages { background: linear-gradient(135deg, #f5af19 0%, #f12711 100%); }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 600;
      color: #333;
    }

    .stat-label {
      color: #666;
      font-size: 0.875rem;
    }

    .tab-content {
      padding: 24px 0;
    }

    .tab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .tab-header h2 {
      margin: 0;
    }

    h2 {
      margin-bottom: 16px;
      color: #333;
    }

    .db-stats {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .db-stat-card {
      flex: 1;
      min-width: 150px;
    }

    .db-stat-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      font-size: 1.1rem;
      font-weight: 500;
    }

    .db-stat-card mat-icon {
      color: #667eea;
    }

    .db-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }

    .action-card {
      border-left: 4px solid #667eea;
    }

    .action-card.warning {
      border-left-color: #ff9800;
    }

    .action-card.danger {
      border-left-color: #f44336;
    }

    .action-card mat-card-actions {
      padding: 16px;
    }

    .action-card button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .action-card mat-spinner {
      margin-right: 8px;
    }

    .badge {
      background: #f44336;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      margin-left: 8px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #999;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
    }

    .messages-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .message-card {
      border-left: 4px solid #ccc;
    }

    .message-card.unread {
      border-left-color: #f44336;
      background: #fff8f8;
    }

    .message-card mat-card-subtitle {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .message-card .date {
      color: #999;
    }

    .message-card mat-card-content p {
      white-space: pre-wrap;
      line-height: 1.6;
    }

    .message-card mat-card-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }

    .message-card .actions {
      display: flex;
      gap: 8px;
    }

    mat-chip.unread { background: #f44336; color: white; }
    mat-chip.read { background: #2196f3; color: white; }
    mat-chip.replied { background: #4caf50; color: white; }

    @media (max-width: 600px) {
      .stats-grid {
        grid-template-columns: 1fr 1fr;
      }

      .stat-card mat-card-content {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private hotelService = inject(HotelService);
  private bookingService = inject(BookingService);
  private seedService = inject(SeedService);
  private contactService = inject(ContactService);
  private snackBar = inject(MatSnackBar);

  hotels = signal<Hotel[]>([]);
  bookings = signal<Booking[]>([]);
  messages = signal<ContactMessage[]>([]);
  showAddHotel = false;

  totalHotels = signal<number>(0);
  totalBookings = signal<number>(0);
  pendingBookings = signal<number>(0);
  totalRevenue = signal<number>(0);
  totalMessages = signal<number>(0);
  unreadMessages = signal<number>(0);

  isSeeding = signal<boolean>(false);
  dbStats = signal<{ hotels: number; ratings: number; bookings: number }>({ hotels: 0, ratings: 0, bookings: 0 });

  ngOnInit() {
    this.loadHotels();
    this.loadBookings();
    this.loadDbStats();
    this.loadMessages();
  }

  loadHotels() {
    this.hotelService.getHotels().subscribe(hotels => {
      this.hotels.set(hotels);
      this.totalHotels.set(hotels.length);
    });
  }

  loadBookings() {
    this.bookingService.getAllBookings().subscribe(bookings => {
      this.bookings.set(bookings);
      this.totalBookings.set(bookings.length);
      this.pendingBookings.set(bookings.filter(b => b.status === 'pending').length);
      this.totalRevenue.set(
        bookings
          .filter(b => b.status !== 'cancelled')
          .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
      );
    });
  }

  onHotelSaved() {
    this.showAddHotel = false;
    this.loadHotels();
    this.loadDbStats();
  }

  async loadDbStats() {
    const stats = await this.seedService.getStats();
    this.dbStats.set(stats);
  }

  async seedDatabase() {
    this.isSeeding.set(true);
    try {
      const hotelResult = await this.seedService.seedHotels();
      if (hotelResult.success) {
        const ratingResult = await this.seedService.seedRatings();
        this.snackBar.open(hotelResult.message + ' ' + ratingResult.message, 'Close', { duration: 5000 });
      } else {
        this.snackBar.open(hotelResult.message, 'Close', { duration: 5000 });
      }
      this.loadHotels();
      this.loadDbStats();
    } catch (error: any) {
      this.snackBar.open('Error: ' + error.message, 'Close', { duration: 5000 });
    } finally {
      this.isSeeding.set(false);
    }
  }

  async clearAndSeedDatabase() {
    if (!confirm('This will delete ALL data and reseed. Are you sure?')) return;
    
    this.isSeeding.set(true);
    try {
      const result = await this.seedService.clearAndSeed();
      this.snackBar.open(result.message, 'Close', { duration: 5000 });
      this.loadHotels();
      this.loadBookings();
      this.loadDbStats();
    } catch (error: any) {
      this.snackBar.open('Error: ' + error.message, 'Close', { duration: 5000 });
    } finally {
      this.isSeeding.set(false);
    }
  }

  async clearDatabase() {
    if (!confirm('This will delete ALL hotels, bookings, and ratings. Are you sure?')) return;
    
    this.isSeeding.set(true);
    try {
      const result = await this.seedService.clearHotels();
      this.snackBar.open(result.message, 'Close', { duration: 5000 });
      this.loadHotels();
      this.loadBookings();
      this.loadDbStats();
    } catch (error: any) {
      this.snackBar.open('Error: ' + error.message, 'Close', { duration: 5000 });
    } finally {
      this.isSeeding.set(false);
    }
  }

  async loadMessages() {
    const msgs = await this.contactService.getAllMessages();
    this.messages.set(msgs);
    this.totalMessages.set(msgs.length);
    this.unreadMessages.set(msgs.filter(m => m.status === 'unread').length);
  }

  async markAsRead(id: string) {
    await this.contactService.markAsRead(id);
    this.loadMessages();
  }

  async deleteMessage(id: string) {
    if (!confirm('Delete this message?')) return;
    await this.contactService.deleteMessage(id);
    this.snackBar.open('Message deleted', 'Close', { duration: 3000 });
    this.loadMessages();
  }
}
