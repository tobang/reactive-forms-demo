import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateContactComponent } from '../create-contact/create-contact.component';

@Component({
  selector: 'app-contacts-overview',
  standalone: true,
  imports: [CommonModule, CreateContactComponent],
  templateUrl: './contacts-overview.component.html',
  styleUrls: ['./contacts-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsOverviewComponent {}
