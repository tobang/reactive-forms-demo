/* eslint-disable */
import { Directive, inject, input } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';

import { Observable } from 'rxjs';
import { FormDirective } from './form.directive';
import { ValidationOptions } from './types';
import { getFormGroupFieldName } from './utils/form.utils';

/**
 * This directive's selector targets the Angular Template Driven ngModelGroup directive and extends it
 * with validation features by implementing Angulars Validator interface.
 */
@Directive({
  selector: '[ngModelGroup]',
  standalone: true,
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: FormModelGroupDirective,
      multi: true,
    },
  ],
})
export class FormModelGroupDirective implements AsyncValidator {
  public validationOptions = input<ValidationOptions>({ debounceTime: 0 });
  private readonly formDirective = inject(FormDirective);

  public validate(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    const { ngForm } = this.formDirective;
    const field = getFormGroupFieldName(ngForm.control, control);
    return this.formDirective.createAsyncValidator(
      field,
      this.validationOptions()
    )(control.value) as Observable<ValidationErrors | null>;
  }
}
