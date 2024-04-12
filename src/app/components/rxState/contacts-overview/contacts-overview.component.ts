import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { map } from 'rxjs';

import { rxState } from '@rx-angular/state';
import { rxActions } from '@rx-angular/state/actions';
import { rxEffects } from '@rx-angular/state/effects';
import { TableModule } from 'primeng/table';

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
    openDialog: void;
  }>();
  state = rxState<{
    contacts: ContactModel[];
    selectedRow: ContactModel;
    editedContact: ContactModel;
  }>(({ connect, set }) => {
    // This is where the initial state is set.
    set({ contacts: [] });

    // Connect the upserContact action and set state accordingly
    connect(
      this.actions.upsertContact$.pipe(
        // If the contact has an id it already exists, otherwise give the contact an uid
        map((contact) =>
          'id' in contact ? contact : { ...contact, ...{ id: uid(7) } }
        )
      ),
      // Update the state - if the contact exist we replace otherwise we append
      (oldstate, contact) => ({
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

  // This is just an example of how to implement an effect
  // It is not referenced anywhere.
  private readonly effects = rxEffects(({ register }) => {
    register(this.actions.openDialog$, () => {
      console.log('Open dialog');
    });
  });

  // This converts the state to a signal, that can be consumed in the template
  private viewModel = this.state.computed(
    ({ contacts, selectedRow, editedContact }) => ({
      contacts,
      selectedRow,
      editedContact,
    })
  );

  protected get vm() {
    return this.viewModel();
  }

  constructor() {}
}
