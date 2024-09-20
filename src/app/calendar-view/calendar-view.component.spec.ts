import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarViewComponent } from './calendar-view.component';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

class MockMatDialog {
  open() {
    return {
      afterClosed: () =>
        new BehaviorSubject({ time: '10:00', title: 'Test Appointment' }),
    };
  }
}

describe('CalendarViewComponent', () => {
  let component: CalendarViewComponent;
  let fixture: ComponentFixture<CalendarViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CalendarViewComponent,
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
      ],
      providers: [{ provide: MatDialog, useClass: MockMatDialog }],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarViewComponent);
    component = fixture.componentInstance;

    component.appointments$ = new BehaviorSubject({});

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the modal and add an appointment', () => {
    const date = new Date();
    component.openModal(date);
    const appointments =
      component.appointments$.getValue()[component.dateKey(date)] || [];
    expect(appointments).toBeDefined();
    expect(appointments.length).toBe(1);
  });

  it('should delete an appointment', () => {
    const date = new Date();

    const appointmentKey = component.dateKey(date);
    component.appointments$.next({
      [appointmentKey]: [{ time: '10:00', title: 'Test Appointment' }],
    });

    expect(component.appointments$.getValue()[appointmentKey].length).toBe(1);

    component.deleteAppointment(date, 0, new MouseEvent('click'));

    expect(component.appointments$.getValue()[appointmentKey]).toBeUndefined(); // Should be undefined after deletion
  });

  it('should not delete appointment for past date', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const appointmentKey = component.dateKey(pastDate);

    const initialAppointments = {
      [appointmentKey]: [{ time: '10:00', title: 'Test Appointment' }],
    };
    component.appointments$.next(initialAppointments);

    component.deleteAppointment(pastDate, 0, new MouseEvent('click'));

    const updatedAppointments =
      component.appointments$.getValue()[appointmentKey] || [];
    expect(updatedAppointments.length).toBe(1);
    expect(updatedAppointments[0].time).toBe('10:00');
  });
});
