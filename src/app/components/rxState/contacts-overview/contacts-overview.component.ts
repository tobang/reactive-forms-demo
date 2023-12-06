import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { filter, map } from 'rxjs';

import { rxState } from '@rx-angular/state';
import { rxActions } from '@rx-angular/state/actions';
import { TableModule, TableRowSelectEvent } from 'primeng/table';

import { replaceOrAppend, uid } from 'radash';

import { UpsertContactComponent } from '../upsert-contact/upsert-contact.component';
import { ContactModel } from '../../../models/contact.model';
import { ContactsListComponent } from '../contacts-list/contacts-list.component';

import { IfNotObjectEmptyDirective } from '../../../utils/directives/if-not-object-is-empty.directive';

@Component({
  selector: 'app-contacts-overview',
  standalone: true,
  imports: [
    CommonModule,
    UpsertContactComponent,
    TableModule,
    ContactsListComponent,
    IfNotObjectEmptyDirective,
  ],
  templateUrl: './contacts-overview.component.html',
  styleUrls: ['./contacts-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsOverviewComponent {
  actions = rxActions<{
    upsertContact: ContactModel;
    removeContact: ContactModel;
    editContact: ContactModel;
    rowSelected: ContactModel;
    rowUnselected: void;
  }>();
  state = rxState<{
    contacts: ContactModel[];
    selectedRow: ContactModel;
    editedContact: ContactModel;
  }>(({ connect, set }) => {
    set({ contacts: [] });
    connect(
      this.actions.upsertContact$.pipe(
        map((contact) =>
          'id' in contact ? contact : { ...contact, ...{ id: uid(7) } }
        )
      ),
      (oldstate, contact) => ({
        // contacts: [...oldstate.contacts, contact],
        contacts: replaceOrAppend(
          oldstate.contacts,
          contact,
          (c) => c.id === contact.id
        ),
      })
    );
    connect(this.actions.rowSelected$, (_, contact) => ({
      selectedRow: contact,
    }));
    connect(this.actions.rowUnselected$, () => ({
      selectedRow: {},
    }));
    connect(this.actions.removeContact$, (state, contact) => ({
      contacts: state.contacts.filter((value) => value.id !== contact.id),
      selectedRow: {},
    }));
    connect(this.actions.editContact$, (_, contact) => ({
      editedContact: contact,
    }));
  });
  all$ = this.state.$.subscribe((value) => console.log('All', value));
  vm$ = this.state.select();

  constructor() {
    this.actions.rowSelected$.subscribe((data) =>
      console.log('Row selected', data)
    );
    /* this.state
      .select('selectedRow')
      .subscribe((value) => console.log('Value', value)); */
  }
}
