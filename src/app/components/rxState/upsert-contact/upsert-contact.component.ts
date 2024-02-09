import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

import { rxState } from '@rx-angular/state';
import { rxActions } from '@rx-angular/state/actions';
import { assign } from 'radash';

import { AddressComponent } from './address/address.component';
import { ContactModel } from '../../../models/contact.model';
import { FormDirective } from '../../../utils/form/form.directive';

@Component({
  selector: 'app-upsert-contact',
  standalone: true,
  imports: [
    CommonModule,
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
  actions = rxActions<{
    formValueChange: ContactModel;
    submit: ContactModel;
  }>();

  state = rxState<{ form: ContactModel }>(({ connect, set }) => {
    set({ form: {} });
    connect(this.actions.formValueChange$, (oldstate, form) => ({
      form: assign(oldstate.form, form),
    }));
  });

  @Output() submitForm = this.actions.submit$;
  @Input() set contact(contact: ContactModel | undefined) {
    this.state.set({ form: contact ?? {} });
  }

  // View
  form$ = this.state.select('form');

  onSubmit() {
    this.actions.submit(this.state.get('form'));
    this.state.set({ form: {} });
  }
}
