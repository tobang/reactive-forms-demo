import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { map } from 'rxjs';

import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { rxActions } from '@rx-angular/state/actions';
import { rxState } from '@rx-angular/state';

import { ContactModel } from '../../../models/contact.model';

@Component({
  selector: 'app-contacts-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsListComponent {
  // This is how you define your actions
  // They are so called action streams that which your code
  // can react on.
  actions = rxActions<{
    removeContact: ContactModel;
    editContact: ContactModel;
    rowSelected: TableRowSelectEvent;
    rowUnselected: void;
  }>();

  // Here your state is defined
  state = rxState<{ selectedRow: ContactModel; contacts: ContactModel[] }>(
    ({ connect, set }) => {
      // Set the default state
      set({ contacts: [] });
      // Connect the actions stream to the state
      connect(this.actions.rowSelected$, (_, event) => ({
        selectedRow: event.data,
      }));
      // Reset the selectedRow status
      connect(this.actions.rowUnselected$, () => ({ selectedRow: undefined }));
      connect(this.actions.removeContact$, () => ({ selectedRow: undefined }));
      connect(this.actions.editContact$, () => ({ selectedRow: undefined }));
    }
  );

  // Connect the contacts input to the state
  @Input() set contacts(contacts: ContactModel[]) {
    this.state.set({ contacts });
  }
  // Observable outputs from actions and state
  @Output() editContact = this.actions.editContact$;
  @Output() removeContact = this.actions.removeContact$;
  @Output() rowSelected = this.state.select('selectedRow');
  @Output() rowUnSelected = this.actions.rowUnselected$;

  vm$ = this.state.select();
}
