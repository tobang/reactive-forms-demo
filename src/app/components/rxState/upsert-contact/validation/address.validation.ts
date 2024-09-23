import { enforce, test } from 'vest';

import { AddressModel } from 'src/app/models/address.model';

export function addressValidations(
  model: AddressModel | undefined,
  field: string
): void {
  test(`${field}.street`, 'Street is required', () => {
    enforce(model?.street).isNotBlank();
  });
  test(`${field}.city`, 'City is required', () => {
    // warn();
    enforce(model?.city).isNotBlank();
  });
  test(`${field}.zipcode`, 'Zip code is required', () => {
    enforce(model?.zipcode).isNotBlank();
  });
}
