import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatError } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointment-modal',
  templateUrl: './appointment-modal.component.html',
  styleUrls: ['./appointment-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatError,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    MatFormFieldModule,
    MatInputModule,
    MatDialogActions,
    MatDialogContent,
    FormsModule,
  ],
})
export class AppointmentModalComponent {
  appointmentForm: FormGroup;
  title: string = '';
  time: string = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AppointmentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { date: Date },
  ) {
    this.appointmentForm = this.fb.group({
      title: ['', Validators.required],
    });
  }

  onSave(): void {
    if (this.title && this.time) {
      this.dialogRef.close({ title: this.title, time: this.time });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
