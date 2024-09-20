import { ControlContainer, NgForm } from '@angular/forms';

import { FormModelGroupDirective } from './form-model-group.directive';
import { FormModelDirective } from './form-model.directive';
import { FormDirective } from './form.directive';
import { formViewProvider } from './utils/form-view.provider';
import { ValidationWrapperComponent } from './validation-wrapper/validation-wrapper.component';

export const TemplateDrivenForms = [
  ValidationWrapperComponent,
  FormDirective,
  FormModelDirective,
  FormModelGroupDirective,
] as const;

export * from './form-model-group.directive';
export * from './form-model.directive';
export * from './form.directive';
export * from './types';
export * from './validation-wrapper/validation-wrapper.component';

export const TemplateDrivenFormsViewProviders = [
  { provide: ControlContainer, useExisting: NgForm },
  formViewProvider,
];
