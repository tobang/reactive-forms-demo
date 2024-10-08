import {
  Component,
  computed,
  Input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

import { injectDestroy } from 'ngxtension/inject-destroy';

import { ContactModel } from '../../../models/contact.model';

import { JsonPipe } from '@angular/common';
import { skip, Subject, takeUntil } from 'rxjs';
import { FormDirective } from 'src/app/utils/form/form.directive';
import { TemplateDrivenForms } from 'src/app/utils/form/template-driven-forms';
import { staticSuite } from 'vest';
import { AddressComponent } from './address/address.component';
import { createContactValidationSuite } from './validation/contact.validation';
import { createHRContactValidationSuite } from './validation/hr-contact.validation';

@Component({
  selector: 'app-upsert-contact',
  standalone: true,
  imports: [
    InputNumberModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    CheckboxModule,
    AddressComponent,
    JsonPipe,
    FormDirective,
    TemplateDrivenForms,
  ],
  templateUrl: './upsert-contact.component.html',
  styleUrls: ['./upsert-contact.component.scss'],
})
export class UpsertContactComponent {
  protected readonly ngForm = viewChild.required(NgForm);

  protected readonly formValue = signal<ContactModel>({});
  protected readonly formValid = signal<boolean>(false);
  protected readonly validationConfig = signal({
    relatedFieldsValidation: {
      age: ['salary'],
    },
  });
  private readonly changeValidation$ = new Subject<boolean>();
  private readonly destroy$ = injectDestroy();
  private readonly isManager = signal(false);

  changeValidationSignal = toSignal(this.changeValidation$.pipe(skip(2)));

  protected readonly validationSuite = computed(() => {
    if (this.changeValidationSignal()) {
      if (!this.isManager()) {
        return createContactValidationSuite();
      } else {
        return createHRContactValidationSuite();
      }
    } else {
      return staticSuite(() => {});
    }
  });

  private contactId = '';

  protected setFormValue(valueChange: {
    formValue: any;
    key: string | undefined;
  }): void {
    this.formValue.set(valueChange.formValue);
  }

  submitForm = output<ContactModel>();

  @Input({ required: true }) set includeValidation(includeValidation: boolean) {
    this.changeValidation$.next(includeValidation);
  }

  @Input({ required: true }) set isHRManager(isHRManager: boolean) {
    this.changeValidation$.next(true);
    this.isManager.set(isHRManager);
  }

  constructor() {
    // We have to reset the form when the validation changes
    this.changeValidation$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const formValue = { ...this.formValue(), id: this.contactId };
      this.ngForm().form.reset(formValue);
      this.ngForm().form.markAllAsTouched();
    });
  }

  @Input() set contact(contact: ContactModel | undefined) {
    this.contactId = contact?.id ?? '';
    this.formValue.set(contact ?? {});
  }

  showReactiveForm() {
    console.log(this.ngForm().form);
  }

  onSubmit() {
    if (this.formValid()) {
      this.submitForm.emit(
        this.contactId !== ''
          ? { ...this.formValue(), id: this.contactId }
          : this.formValue()
      );
      this.formValue.set({});
      this.contactId = '';
      this.ngForm().form.markAsPristine();
      this.ngForm().form.markAsUntouched();
    }
  }
}
