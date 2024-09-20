import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { TableModule, TableRowSelectEvent } from 'primeng/table';

import { notNullOrUndefined } from 'src/app/utils/general/not-null-undefined';
import { ContactModel } from '../../../models/contact.model';

@Component({
  selector: 'app-contacts-list',
  standalone: true,
  imports: [TableModule, ButtonModule],
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsListComponent {
  contacts = input.required<ContactModel[]>();
  isRowSelected = computed(() => {
    if (notNullOrUndefined(this.selectedRow())) {
      return true;
    } else {
      return false;
    }
  });
  selectedRow = signal<ContactModel | undefined>(undefined);

  editContact = output<ContactModel>();
  removeContact = output<ContactModel>();
  rowSelected = output<ContactModel>();
  rowUnSelected = output();

  onRowSelected(event: TableRowSelectEvent) {
    this.selectedRow.set(event.data);
    this.rowSelected.emit(event.data);
  }

  onRowUnSelected() {
    this.selectedRow.set(undefined);
    console.log('Selected row', this.selectedRow());
    this.rowUnSelected.emit();
  }

  onEditContact(contact: ContactModel) {
    console.log('Edit contact', this.selectedRow());
    this.editContact.emit(contact);
  }

  onRemoveContact(contact: ContactModel) {
    this.selectedRow.set(undefined);
    this.removeContact.emit(contact);
  }
}
