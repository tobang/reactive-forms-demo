import { Component, input } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

import {
  TemplateDrivenForms,
  TemplateDrivenFormsViewProviders,
} from 'src/app/utils/form/template-driven-forms';
import { AddressModel } from '../../../../models/address.model';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [FormsModule, InputTextModule, TemplateDrivenForms],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  viewProviders: [TemplateDrivenFormsViewProviders],
})
export class AddressComponent {
  public address = input<AddressModel>();
}
