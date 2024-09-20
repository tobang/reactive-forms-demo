import { ContactModel } from 'src/app/models/contact.model';
import { enforce, only, staticSuite, test } from 'vest';
import { addressValidations } from './address.validation';

export type FieldNames = keyof ContactModel;

export const createContactValidationSuite = () => {
  return staticSuite((model: ContactModel, field: string) => {
    only(field);

    test<FieldNames>('firstName', 'First name is required', () => {
      enforce(model.firstName).isNotBlank();
    });

    test<FieldNames>('lastName', 'Last name is required', () => {
      enforce(model.lastName).isNotBlank();
    });

    test<FieldNames>('age', 'Age is required', () => {
      enforce(model.age).isNotBlank();
    });

    test<FieldNames>('age', 'Age must be a number', () => {
      enforce(model.age).isNumeric();
    });

    test<FieldNames>('salary', 'Salary is required', () => {
      enforce(model.salary).isNotBlank();
    });

    test<FieldNames>('salary', 'Salary must be a number', () => {
      enforce(model.age).isNumeric();
    });

    addressValidations(model.addresses?.homeAddress, 'addresses.homeAddress');
  });
};
