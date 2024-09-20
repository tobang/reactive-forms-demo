/* eslint-disable @angular-eslint/directive-selector */
import { Directive, inject } from '@angular/core';
import { NgForm } from '@angular/forms';

import { outputFromObservable } from '@angular/core/rxjs-interop';
import { debounceTime, map } from 'rxjs';

@Directive({
  selector: 'form',
  standalone: true,
})
export class FormDirective<T> {
  public readonly ngForm = inject(NgForm, { self: true });
  formValueChange = outputFromObservable(
    this.ngForm.form.valueChanges.pipe(
      debounceTime(0),
      map(() => this.ngForm.form.getRawValue())
    )
  );
}
