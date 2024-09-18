
import {
  ChangeDetectionStrategy,
  Component,
  Input, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

import { rxState } from '@rx-angular/state';
import { rxActions } from '@rx-angular/state/actions';
import { assign } from 'radash';

import { ContactModel } from '../../../models/contact.model';
import { FormDirective } from '../../../utils/form/form.directive';
import { AddressComponent } from './address/address.component';
import { outputFromObservable } from "@angular/core/rxjs-interop";

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
    FormDirective
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
    connect(this.actions.formValueChange$, (oldstate, form) => {
      return {
        form: assign(oldstate.form, form),
      };
    });
  });

  submitForm = outputFromObservable(this.actions.submit$);
  @Input() set contact(contact: ContactModel | undefined) {
    this.state.set({ form: contact ?? {} });
  }

  // View
  form = this.state.signal('form');

  onSubmit() {
    this.actions.submit(this.state.get('form'));
    this.state.set({ form: {} });
  }
}
