/* eslint-disable @angular-eslint/directive-selector */
import { Directive, inject, Input, output } from '@angular/core';
import { NgForm } from '@angular/forms';

import { debounceTime, map, Observable } from 'rxjs';
import { outputFromObservable } from "@angular/core/rxjs-interop";

@Directive({
  selector: 'form',
  standalone: true,
})
export class FormDirective<T> {
  public readonly ngForm = inject(NgForm, { self: true });
  formValueChange = outputFromObservable(this.ngForm.form.valueChanges.pipe(debounceTime(0), map(() => this.ngForm.form.getRawValue())));
}
