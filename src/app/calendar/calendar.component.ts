import { Component, OnInit, HostListener } from '@angular/core';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: false,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  currentView: 'month' | 'week' = 'month';
  currentDate: Date = new Date();
  days: CalendarDay[] = [];
  weekDays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  isMobile: boolean = false;

  ngOnInit(): void {
    this.checkScreenSize();
    this.generateCalendar();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768; // Adjust breakpoint as needed
    if (this.isMobile) {
      this.currentView = 'week';
    }
    this.generateCalendar();
  }

  setView(view: 'month' | 'week') {
    if (this.isMobile && view === 'month') return;
    this.currentView = view;
    this.generateCalendar();
  }

  toggleView(event: any) {
    const isChecked = event.target.checked;
    this.setView(isChecked ? 'week' : 'month');
  }

  previous() {
    if (this.currentView === 'month') {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    } else {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() - 7);
    }
    this.generateCalendar();
  }

  next() {
    if (this.currentView === 'month') {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    } else {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() + 7);
    }
    this.generateCalendar();
  }

  generateCalendar() {
    this.days = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    if (this.currentView === 'month') {
      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);

      // Get the day of the week for the first day (0 = Sunday, 1 = Monday, ...)
      // Adjust to make Monday the first day (0 = Monday, 6 = Sunday)
      let startDay = firstDayOfMonth.getDay() - 1;
      if (startDay === -1) startDay = 6;

      // Previous month's days
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      for (let i = startDay; i > 0; i--) {
        this.days.push({
          date: new Date(year, month - 1, prevMonthLastDay - i + 1),
          isCurrentMonth: false,
          isToday: false
        });
      }

      // Current month's days
      for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const date = new Date(year, month, i);
        this.days.push({
          date: date,
          isCurrentMonth: true,
          isToday: this.isSameDate(date, new Date())
        });
      }

      // Next month's days to fill the grid (up to 42 cells for 6 weeks max)
      const remainingCells = 42 - this.days.length;
      for (let i = 1; i <= remainingCells; i++) {
        this.days.push({
          date: new Date(year, month + 1, i),
          isCurrentMonth: false,
          isToday: false
        });
      }
    } else {
      // Week view
      const currentDay = this.currentDate.getDay(); // 0 = Sun, 1 = Mon
      let diff = this.currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // Adjust when day is sunday

      const monday = new Date(this.currentDate.setDate(diff));

      // Reset currentDate because setDate mutates it
      this.currentDate = new Date(monday);
      // Actually, we want currentDate to track the week, so keeping it as the start of the week or just a date in that week is fine.
      // But let's make sure we generate 7 days starting from Monday.

      // Re-calculate Monday correctly without mutating if possible, or just use the mutated one.
      // Let's be cleaner:
      const curr = new Date(this.currentDate); // copy
      const day = curr.getDay();
      const diff2 = curr.getDate() - day + (day === 0 ? -6 : 1);
      const startOfWeek = new Date(curr.setDate(diff2));

      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        this.days.push({
          date: date,
          isCurrentMonth: date.getMonth() === month,
          isToday: this.isSameDate(date, new Date())
        });
      }
    }
  }

  isSameDate(d1: Date, d2: Date): boolean {
    return d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();
  }

  addActivity(date: Date) {
    // Placeholder for future modal logic
    console.log('Add activity for', date);
  }
}
