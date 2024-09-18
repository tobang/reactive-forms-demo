import { AddressModel } from './address.model';

export interface ContactModel {
  id?: string;
  firstName?: string;
  lastName?: string;
  salary?: number;
  age?: number;
  addresses?: {
    homeAddress?: AddressModel;
  };
}
