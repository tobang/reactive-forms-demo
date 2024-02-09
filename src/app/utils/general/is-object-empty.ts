import { notNullOrUndefined } from './not-null-undefined';

export const isObjectEmpty = <T>(objectName: T) => {
  return (
    notNullOrUndefined(objectName) &&
    objectName &&
    Object.keys(objectName).length === 0 &&
    objectName.constructor === Object
  );
};
