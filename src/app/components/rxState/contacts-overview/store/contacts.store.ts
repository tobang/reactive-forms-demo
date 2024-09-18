import { Injectable } from '@angular/core';
import { rxState } from '@rx-angular/state';
import { rxActions } from '@rx-angular/state/actions';
import { replaceOrAppend, uid } from 'radash';
import { map } from 'rxjs';
import { ContactModel } from 'src/app/models/contact.model';

export type ContactsModel = {
  contacts: ContactModel[];
  selectedRow: ContactModel;
  editedContact: ContactModel;
};

export type ContactsActions = {
  upsertContact: ContactModel;
  removeContact: ContactModel;
  editContact: ContactModel;
  rowSelected: ContactModel;
  rowUnselected: void;
};

@Injectable()
export class ContactsStore {
  public readonly actions = rxActions<ContactsActions>();

  private readonly store = rxState<ContactsModel>(({ connect, set }) => {
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

  public readonly contacts = this.store.signal('contacts');
  public readonly selectedRow = this.store.signal('selectedRow');
  public readonly editedContact = this.store.signal('editedContact');
}
