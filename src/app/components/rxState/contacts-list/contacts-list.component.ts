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
  // They are so called action streams
  actions = rxActions<{
    removeContact: ContactModel;
    editContact: ContactModel;
    rowSelected: TableRowSelectEvent;
    rowUnselected: void;
  }>();

  state = rxState<{ selectedRow: ContactModel; contacts: ContactModel[] }>(
    ({ connect, set }) => {
      set({ contacts: [] });
      connect(this.actions.rowSelected$, (_, event) => ({
        selectedRow: event.data,
      }));
      connect(
        this.actions.rowUnselected$.pipe(map(() => ({ selectedRow: {} })))
      );
      connect(
        this.actions.removeContact$.pipe(map(() => ({ selectedRow: {} })))
      );
      // Todo: connect a service to show how this is done
    }
  );

  @Input() set contacts(contacts: ContactModel[]) {
    this.state.set({ contacts });
  }
  @Output() editContact = this.actions.editContact$;
  @Output() removeContact = this.actions.removeContact$;
  @Output() rowSelected = this.state.select('selectedRow');
  @Output() rowUnSelected = this.actions.rowUnselected$;

  vm$ = this.state.select();
}
