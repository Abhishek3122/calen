import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FullCalendarComponent } from '@fullcalendar/angular'; // Import FullCalendarComponent

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    ReactiveFormsModule,
    FullCalendarModule,
    HttpClientModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular17';
  events: any[] = [];

  // Define month-year combinations
  monthYears: { label: string; value: string }[] = [];
  currentYear: number = new Date().getFullYear();
  selectedMonthYear: string = '';

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent; // Add ViewChild to access the calendar

  constructor(private http: HttpClient) {
    this.populateMonthYearOptions();
  }

  ngOnInit() {
    this.http.get<any[]>('http://localhost/events.php').subscribe(data => {
      this.events = data;
      console.log(this.events);

      // Set the initial events in calendar options
      this.calendarOptions.events = this.events;

      // Set the selected month-year to current month and year
      this.selectedMonthYear = `${this.currentYear}-${new Date().getMonth() < 10 ? '0' + new Date().getMonth() : new Date().getMonth()}`;
      this.updateCalendarView();
    });
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: []
  };

  // Populate month-year options
  populateMonthYearOptions() {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    for (let year = this.currentYear - 5; year <= this.currentYear + 5; year++) {
      for (let month = 0; month < 12; month++) {
        const label = `${months[month]} ${year}`;
        this.monthYears.push({ label, value: `${year}-${month < 10 ? '0' + month : month}` });
      }
    }
  }

  // Method to handle month-year change
  onMonthYearChange(event: Event) {
    this.selectedMonthYear = (event.target as HTMLSelectElement).value; // Get selected value
    this.updateCalendarView(); // Update calendar view
  }

  // Update calendar view based on selected month and year
  updateCalendarView() {
    const [year, month] = this.selectedMonthYear.split('-').map(Number);

    // Filter events based on selected month and year
    const filteredEvents = this.events.filter(event => {
      const eventDate = new Date(event.start); // Assuming 'start' is in YYYY-MM-DD format
      return eventDate.getFullYear() === year && eventDate.getMonth() === month; // Check if the year and month match
    });

    this.calendarOptions.events = filteredEvents; // Update calendar with filtered events
    this.calendarComponent.getApi().gotoDate(new Date(year, month)); // Navigate to the selected month
  }
}
