import { AddressModel } from './address.model';

export interface ContactModel {
  id?: string;
  firstName?: string;
  lastName?: string;
  addresses?: {
    homeAddress?: AddressModel;
    workAddress?: AddressModel;
    includeWorkAddress?: boolean;
  };
}
