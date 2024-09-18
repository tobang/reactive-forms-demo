import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TableModule } from 'primeng/table';

import { ContactModel } from '../../../models/contact.model';
import { ContactsListComponent } from '../contacts-list/contacts-list.component';
import { UpsertContactComponent } from '../upsert-contact/upsert-contact.component';

import { IfNotObjectEmptyDirective } from '../../../utils/directives/if-not-object-is-empty.directive';
import { ContactsStore } from './store/contacts.store';

@Component({
  selector: 'app-contacts-overview',
  standalone: true,
  imports: [
    UpsertContactComponent,
    TableModule,
    ContactsListComponent,
    IfNotObjectEmptyDirective,
  ],
  templateUrl: './contacts-overview.component.html',
  styleUrls: ['./contacts-overview.component.scss'],
  providers: [ContactsStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsOverviewComponent {
  protected readonly store = inject(ContactsStore);

  editContact(contact: ContactModel) {
    this.store.actions.editContact(contact);
  }

  removeContact(contact: ContactModel) {
    this.store.actions.removeContact(contact);
  }

  rowSelected(contact: ContactModel) {
    this.store.actions.rowSelected(contact);
  }

  rowUnselected() {
    this.store.actions.rowUnselected();
  }

  upsertContact(contact: ContactModel) {
    this.store.actions.upsertContact(contact);
  }
}
