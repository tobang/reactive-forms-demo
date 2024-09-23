import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ContactsStore } from '../contacts-overview/store/contacts.store';

@Component({
  selector: 'app-contacts-overview-configurator',
  standalone: true,
  imports: [CheckboxModule, FormsModule],
  templateUrl: './contacts-overview-configurator.component.html',
  styleUrl: './contacts-overview-configurator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsOverviewConfiguratorComponent {
  protected readonly store = inject(ContactsStore);
  public readonly includeValidation = model<boolean>(false);
  public readonly isHRManager = model<boolean>(false);

  public includeValidationChanged(include: boolean) {
    this.store.actions.updateIncludeValidation(include);
  }

  public isHRMangerChanged(isManager: boolean) {
    this.store.actions.updateHRManager(isManager);
  }
}
