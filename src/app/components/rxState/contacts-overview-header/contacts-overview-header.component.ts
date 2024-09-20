import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ContactsStore } from '../contacts-overview/store/contacts.store';

@Component({
  selector: 'app-contacts-overview-header',
  standalone: true,
  imports: [],
  templateUrl: './contacts-overview-header.component.html',
  styleUrl: './contacts-overview-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsOverviewHeaderComponent {
  protected readonly store = inject(ContactsStore);

  protected readonly maxSalaryExceeded = computed(() => {
    const totalSalary = this.store.totalSalary();
    return totalSalary > 100000 ? true : false;
  });
}
