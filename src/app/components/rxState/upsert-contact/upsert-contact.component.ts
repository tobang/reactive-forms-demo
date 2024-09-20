import {
  ChangeDetectionStrategy,
  Component,
  Input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

import { ContactModel } from '../../../models/contact.model';
import { FormDirective } from '../../../utils/form/form.directive';
import { AddressComponent } from './address/address.component';

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
  ],
  templateUrl: './upsert-contact.component.html',
  styleUrls: ['./upsert-contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertContactComponent {
  protected readonly formValue = signal<ContactModel>({});
  private contactId = '';

  protected setFormValue(contact: ContactModel): void {
    this.formValue.set(contact);
  }

  submitForm = output<ContactModel>();

  @Input() set contact(contact: ContactModel | undefined) {
    this.contactId = contact?.id ?? '';
    this.formValue.set(contact ?? {});
  }

  onSubmit() {
    this.submitForm.emit(
      this.contactId !== ''
        ? { ...this.formValue(), id: this.contactId }
        : this.formValue()
    );
    this.formValue.set({});
    this.contactId = '';
  }
}
