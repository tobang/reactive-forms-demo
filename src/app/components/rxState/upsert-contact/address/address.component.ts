import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { formViewProvider } from '../../../../utils/form/form-view.provider';
import { AddressModel } from '../../../../models/address.model';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [FormsModule, InputTextModule],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  viewProviders: [formViewProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent {
  public address = input<AddressModel>();
}
