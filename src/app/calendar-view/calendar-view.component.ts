import { Component } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AppointmentModalComponent } from '../appointment-modal/appointment-modal.component';
import { CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    CdkDropList,
    CdkDrag,
    AppointmentModalComponent,
    MatIcon,
    MatFormField,
    MatLabel,
    MatError,
    MatTooltipModule,
  ],
})
export class CalendarViewComponent {
  dates: Date[] = [];
  appointments$ = new BehaviorSubject<{
    [key: string]: { time: string; title: string }[];
  }>({});
  currentMonth: Date = new Date();
  dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthYear: string = '';
  connectedDropLists: string[] = [];

  constructor(private dialog: MatDialog) {
    this.updateCalendar();
  }

  updateCalendar() {
    const startOfMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth(),
      1,
    );
    const endOfMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      0,
    );

    this.dates = [];
    this.connectedDropLists = [];
    for (
      let date = new Date(startOfMonth);
      date <= endOfMonth;
      date.setDate(date.getDate() + 1)
    ) {
      const dateClone = new Date(date);
      this.dates.push(dateClone);
      this.connectedDropLists.push(this.dateKey(dateClone));
    }

    this.monthYear = `${this.currentMonth.toLocaleString('default', { month: 'long' })} ${this.currentMonth.getFullYear()}`;
  }

  prevMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.updateCalendar();
  }

  nextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.updateCalendar();
  }

  openModal(date: Date) {
    if (this.isPastDate(date)) {
      return;
    }

    const dialogRef = this.dialog.open(AppointmentModalComponent, {
      width: '300px',
      data: { date },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const key = this.dateKey(date);
        const currentAppointments = this.appointments$.getValue();
        if (!currentAppointments[key]) {
          currentAppointments[key] = [];
        }
        currentAppointments[key].push({
          time: result.time,
          title: result.title,
        });
        this.appointments$.next(currentAppointments);
      }
    });
  }

  dateKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  onDrop(event: CdkDragDrop<string[]>, date: Date) {
    const previousContainerKey = event.previousContainer.id;
    const currentContainerKey = this.dateKey(date);

    if (this.isPastDate(date)) {
      return;
    }

    const currentAppointments = this.appointments$.getValue();

    if (event.previousContainer === event.container) {
      moveItemInArray(
        currentAppointments[currentContainerKey],
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      if (!currentAppointments[currentContainerKey]) {
        currentAppointments[currentContainerKey] = [];
      }
      transferArrayItem(
        currentAppointments[previousContainerKey],
        currentAppointments[currentContainerKey],
        event.previousIndex,
        event.currentIndex,
      );
    }
    if (
      currentAppointments[previousContainerKey] &&
      currentAppointments[previousContainerKey].length === 0
    ) {
      delete currentAppointments[previousContainerKey];
    }
    this.appointments$.next(currentAppointments);
  }

  isPastDate(date: Date): boolean {
    return date < new Date();
  }

  getAppointmentsForDate(
    date: Date,
  ): Observable<{ time: string; title: string }[]> {
    return this.appointments$.pipe(
      map((appointments) => appointments[this.dateKey(date)] || []),
    );
  }

  deleteAppointment(date: Date, index: number, event: MouseEvent) {
    event.stopPropagation();
    if (this.isPastDate(date)) {
      return;
    }

    const key = this.dateKey(date);
    const currentAppointments = this.appointments$.getValue();
    if (currentAppointments[key]) {
      currentAppointments[key].splice(index, 1);
      if (currentAppointments[key].length === 0) {
        delete currentAppointments[key];
      }
    }
    this.appointments$.next(currentAppointments);
  }

  getAppointmentKeys(): string[] {
    return Object.keys(this.appointments$.getValue());
  }

  getAppointmentsForDateObservable(
    key: string,
  ): Observable<{ time: string; title: string }[]> {
    return this.appointments$.pipe(
      map((appointments) => appointments[key] || []),
    );
  }
}
