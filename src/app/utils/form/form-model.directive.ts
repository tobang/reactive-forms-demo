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
import { getFormControlFieldName } from './utils/form.utils';
/**
 * This directive's selector targets the Angular Template Driven ngModel directive and extends it
 * with validation features by implementing Angulars AsynValidator interface.
 */
@Directive({
  selector: '[ngModel]',
  standalone: true,
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: FormModelDirective,
      multi: true,
    },
  ],
})
export class FormModelDirective implements AsyncValidator {
  public validationOptions = input<ValidationOptions>({ debounceTime: 0 });
  // Inject the parent form
  private readonly formDirective = inject(FormDirective);

  // Validate is part of the AsyncValidator interface
  public validate(
    control: AbstractControl
  ): Observable<ValidationErrors | null> | Promise<ValidationErrors | null> {
    // Get form and suite from the parent form directive
    const { ngForm } = this.formDirective;

    // Get the name of the that this validator is attached to
    const fieldName = getFormControlFieldName(ngForm.control, control);

    // This calls function that takes care of
    // creating the validator that tests if the model passes or fails
    const validatorFn = this.formDirective.createAsyncValidator(
      fieldName,
      this.validationOptions()
    );
    return validatorFn(control);
  }
}
