import { Routes } from '@angular/router';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';

export const routes: Routes = [
  {
    path: 'calendar',
    component: CalendarViewComponent,
  },
  { path: '', redirectTo: 'calendar', pathMatch: 'full' },
];
