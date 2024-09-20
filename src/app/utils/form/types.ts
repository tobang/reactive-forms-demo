import { AbstractControl } from '@angular/forms';

export type ValidationConfig = {
  debouncedFields?: Record<string, number>;
  relatedFieldsValidation?: Record<string, string[]>;
};

export interface AbstractControlWarn extends AbstractControl {
  warnings?: string[];
}

export interface ValidationOptions {
  /**
   * debounceTime for the next validation
   */
  debounceTime: number;
}
