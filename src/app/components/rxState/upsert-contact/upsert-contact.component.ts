import {
  ChangeDetectionStrategy,
  Component,
  Input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

import { ContactModel } from '../../../models/contact.model';

import { FormDirective } from 'src/app/utils/form/form.directive';
import {
  TemplateDrivenForms,
  TemplateDrivenFormsViewProviders,
} from 'src/app/utils/form/template-driven-forms';
import { StaticSuite } from 'vest';
import { AddressComponent } from './address/address.component';
import { createContactValidationSuite } from './validation/contact.validation';

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
    FormDirective,
    TemplateDrivenForms,
  ],
  templateUrl: './upsert-contact.component.html',
  styleUrls: ['./upsert-contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [TemplateDrivenFormsViewProviders],
})
export class UpsertContactComponent {
  @ViewChild(NgForm) ngForm: NgForm | undefined;
  protected readonly formValue = signal<ContactModel>({});
  protected readonly formValid = signal<boolean>(false);

  protected readonly validationSuite = signal<StaticSuite>(
    createContactValidationSuite()
  );
  private contactId = '';

  protected setFormValue(valueChange: {
    formValue: any;
    key: string | undefined;
  }): void {
    this.formValue.set(valueChange.formValue);
  }

  submitForm = output<ContactModel>();

  @Input() set contact(contact: ContactModel | undefined) {
    this.contactId = contact?.id ?? '';
    this.formValue.set(contact ?? {});
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
      this.ngForm?.form.markAsPristine();
      this.ngForm?.form.markAsUntouched();
    }
  }
}
