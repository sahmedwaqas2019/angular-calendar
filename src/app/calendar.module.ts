import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';

const routes: Routes = [{ path: '', component: CalendarViewComponent }];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class CalendarModule {}
