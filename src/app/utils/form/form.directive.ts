/* eslint-disable @angular-eslint/directive-selector */
import { Directive, inject, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

import { debounceTime, map, Observable } from 'rxjs';

@Directive({
  selector: 'form',
  standalone: true,
})
export class FormDirective<T> {
  public readonly ngForm = inject(NgForm, { self: true });
  @Output() formValueChange: Observable<T> = this.ngForm.form.valueChanges.pipe(
    debounceTime(0),
    map(() => this.ngForm.form.getRawValue())
  );
}
