import { ContactModel } from 'src/app/models/contact.model';
import { enforce, omitWhen, only, staticSuite, test } from 'vest';
import { addressValidations } from './address.validation';

export type FieldNames = keyof ContactModel;

export const createHRContactValidationSuite = () => {
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

    test<FieldNames>('salary', 'Salary is required', () => {
      enforce(model.salary).isNotBlank();
    });

    omitWhen(
      () => {
        if (model.age) {
          if (model.age < 60) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      },
      () => {
        test<FieldNames>(
          'salary',
          'Elderly must at least have 30.000 in salary.',
          () => {
            enforce(model.salary).greaterThanOrEquals(30000);
          }
        );
      }
    );

    addressValidations(model.addresses?.homeAddress, 'addresses.homeAddress');
  });
};
