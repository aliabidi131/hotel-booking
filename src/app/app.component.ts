import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SeedService } from './services/seed.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    main {
      min-height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'hotel-booking';
  private seedService = inject(SeedService);

  async ngOnInit() {
    try {
      const result = await this.seedService.seedHotels();
      console.log('Seed result:', result.message);
      
      if (result.success && result.message.includes('added')) {
        await this.seedService.seedRatings();
        await this.seedService.seedBookings();
      }
    } catch (error) {
      console.error('Seed error:', error);
    }
  }
}
