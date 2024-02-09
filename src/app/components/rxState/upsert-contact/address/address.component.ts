import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { formViewProvider } from '../../../../utils/form/form-view.provider';
import { AddressModel } from '../../../../models/address.model';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  viewProviders: [formViewProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent {
  @Input() public address: AddressModel | undefined;
}
