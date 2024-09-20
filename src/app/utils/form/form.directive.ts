/* eslint-disable */
import {
  Directive,
  Input,
  OnDestroy,
  Output,
  inject,
  input,
} from '@angular/core';
import { AsyncValidatorFn, NgForm, ValidationErrors } from '@angular/forms';

import {
  Observable,
  ReplaySubject,
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  pairwise,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';

import { StaticSuite } from 'vest';

import {
  AbstractControlWarn,
  ValidationConfig,
  ValidationOptions,
} from './types';
import { notNullOrUndefined, setProp } from './utils/object';

/**
 * This directive's selector targets form elments that have a model and a suite property.
 */
@Directive({
  selector: 'form[suite]',
  standalone: true,
})
export class FormDirective<T> implements OnDestroy {
  // Inject the NgForm directive and only in this directive injector
  public readonly ngForm = inject(NgForm, { self: true });

  private destroy$ = new Subject();

  /**
   *  Used to debounce formValues to make sure validations are not
   *  triggered all the time.
   */
  private readonly formValueCache: {
    [field: string]: Partial<{
      sub$$: ReplaySubject<unknown>;
      debounced: Observable<any>;
    }>;
  } = {};
  /**
   * The model input should contain the value of your form.
   * Each property will be mapped to a formControl.
   *
   * {
   *   firstName: string;
   *   lastName: string;
   * }
   *
   * Will be mapped to a formGroup with two
   * formControls, firstName and lastName.
   */
  public readonly model = input<T | null>(null);

  // This is your vest validation suite.
  public readonly suite = input<StaticSuite<
    string,
    string,
    (model: T, field: string) => void
  > | null>(null);

  /**
   * This input property gives you the ability to define how
   * related fields are validated and if fields should be debounced.
   *
   * The ValidationConfig type has two optional properties
   *
   * relatedFieldsValidation:
   * This is where you define related form fields.
   * The validation will be updated for the fields defined in the array,
   * when the field defined as key is changed.
   * Example:
   * {
   *  relatedFieldsValidation: { password: [ passwordConfirmed ] }
   * }
   * Here passwordConfirmed validation is updated whenever password field is
   * changed. This will make any errors appear for both fields.
   *
   *
   */
  @Input() public set validationConfig(config: ValidationConfig) {
    if (notNullOrUndefined(config.relatedFieldsValidation)) {
      Object.keys(config.relatedFieldsValidation).forEach((key) => {
        this.formValueChange
          .pipe(
            map(() => this.ngForm.form.get(key)?.value),
            distinctUntilChanged(),
            takeUntil(this.destroy$),
            tap(() => {
              if (notNullOrUndefined(config.relatedFieldsValidation)) {
                config.relatedFieldsValidation[key].forEach((path) => {
                  const control = this.ngForm.form.get(path);
                  control?.updateValueAndValidity({
                    onlySelf: false,
                    emitEvent: false,
                  });
                  control?.markAsTouched({ onlySelf: true });
                  control?.markAsDirty({ onlySelf: true });
                });
              }
            })
          )
          .subscribe();
      });
    }
  }

  /**
   *  This Output will emit the raw value of the form and the
   *  key name that caused the valueChanges to emit
   */
  @Output() formValueChange: Observable<{
    formValue: T;
    key: string | undefined;
  }> = this.ngForm.form.valueChanges.pipe(
    debounceTime(0),
    pairwise(),
    map(([oldValues, newValues]) => {
      return {
        formValue: this.ngForm.form.getRawValue(),
        key: Object.keys(newValues).find((k) => newValues[k] != oldValues[k]),
      };
    })
  );

  /**
   *  Emits every time the dirty property of the form changes.
   */
  @Output() public readonly dirtyChange = this.ngForm.form.valueChanges.pipe(
    map(() => this.ngForm.dirty),
    distinctUntilChanged()
  );

  public readonly pending$ = this.ngForm.form.statusChanges.pipe(
    filter((v) => v === 'PENDING'),
    distinctUntilChanged()
  );

  /**
   * Emits every time the form status changes in a state
   * that is not PENDING
   * We need this to assure that the form is in 'idle' state
   */
  public readonly idle$ = this.ngForm.form.statusChanges.pipe(
    filter((v) => v !== 'PENDING'),
    distinctUntilChanged()
  );

  /**
   * Emits every time the form status changes.
   */
  @Output() public readonly validChange = this.ngForm.form.statusChanges.pipe(
    debounceTime(0),
    // The validation is pos

    map((value) => {
      return this.ngForm.form.status === 'VALID' || value === 'VALID';
    })
  );

  constructor() {
    // Get notified when the ngSubmit event fires, so we can
    // mark all controls as touched to show any errors.
    this.ngForm.ngSubmit.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.ngForm.form.markAllAsTouched();
    });
  }

  /**
   * This creates an AsyncValidatorFn for the specified field,
   * and it is used by Angular to validate the field.
   * You can specify validationOptions, example:
   * {
   *  debounceTime: 200
   * }
   *
   * Debounces the async validation with 200ms
   *
   * @param field - The field that should be validated.
   * @param validationOptions - If the validation should be debounced
   *
   * The field is validated against the Vest suite, which has access
   * to the entire model.
   *
   */
  public createAsyncValidator(
    field: string,
    validationOptions: ValidationOptions
  ): AsyncValidatorFn {
    if (!this.suite()) {
      return () => of(null);
    }
    return (control: AbstractControlWarn) => {
      if (!this.model()) {
        return of(null);
      }
      const modelCloned = structuredClone(this.model());
      const modelUpdated = setProp(
        modelCloned as object,
        field,
        control.value
      ) as T;
      // Update the property with path
      if (!this.formValueCache[field]) {
        this.formValueCache[field] = {
          sub$$: new ReplaySubject(1), // Keep track of the last model
        };
        this.formValueCache[field].debounced = this.formValueCache[
          field
        ].sub$$!.pipe(debounceTime(validationOptions.debounceTime));
      }
      // Next the latest model in the cache for a certain field
      this.formValueCache[field].sub$$!.next(modelUpdated);

      return this.formValueCache[field].debounced!.pipe(
        // When debounced, take the latest value and perform the asynchronous vest validation
        take(1),
        switchMap(() => {
          return new Observable((observer) => {
            this.suite()!(modelUpdated, field).done((result) => {
              const errors = result.getErrors()[field];
              const warnings = result.getWarnings()[field];
              control.warnings = warnings;
              observer.next(errors ? { error: errors[0], errors } : null);
              observer.complete();
            });
          }) as Observable<ValidationErrors | null>;
        }),
        takeUntil(this.destroy$)
      );
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
