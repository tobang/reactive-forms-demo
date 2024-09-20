import { AbstractControl, FormGroup } from '@angular/forms';

/**
 * Returns the name of the control
 * @param control
 */
export const getControlName = (
  control: AbstractControl | null
): string | undefined => {
  return control
    ? Object.entries(control.parent?.controls ?? []).find(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, value]) => value === control
      )?.[0] ?? undefined
    : undefined;
};

/**
 * Returns an array of all possible control paths
 * ['firstName', 'addresses.homeAddress.street'] etc..
 * @param rootForm
 */
export const getAbstractControlPaths = (rootForm: FormGroup, c = '') => {
  return Object.keys(rootForm.controls)
    .map((key) => ({ control: rootForm.controls[key], key }))
    .reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (acc: string[], curr): any =>
        curr.control instanceof FormGroup
          ? [
              ...acc,
              ...getAbstractControlPaths(curr.control, c + curr.key + '.'),
            ]
          : [...acc, c + curr.key],
      []
    );
};

/**
 * Returns the field name/path of a form control
 * Eg: addresses.workAddress.street
 * @param  rootForm
 * @param  controlName
 * @param  parentName
 */
export const getAbstractControlPath = (
  rootForm: FormGroup,
  controlName: string,
  parentName?: string
): string => {
  return (
    getAbstractControlPaths(rootForm).find((path) =>
      path.includes(parentName ? `${parentName}.${controlName}` : controlName)
    ) ?? ''
  );
};

/**
 * Return the name/path of a form group: Eg: addresses.workAddress
 * @param rootGroup
 * @param group
 */
export const getGroupPath = (
  rootGroup: FormGroup,
  group: AbstractControl
): string =>
  // Recursively loop the controls of the form to find the path of the group
  Object.keys(rootGroup.controls).reduce((acc, key) => {
    const ctrl = rootGroup.get(key);
    // If we have a value the group path has been found
    if (acc.length > 0) return acc;
    // If the current group has the property the key
    if (Object.prototype.hasOwnProperty.call(rootGroup.controls, key)) {
      // If the ctrl equals the group we can just return the key
      // as we have found the right group
      if (ctrl === group) {
        return key;
      } else {
        // If the ctrl is a FormGroup we will need to call
        // ourself recursively
        if (ctrl instanceof FormGroup) {
          const path = getGroupPath(ctrl, group);
          if (path) {
            return key + '.' + path;
          }
        }
      }
    }
    return '';
  }, '');

/**
 * Calculates the field name/path of a form control: Eg: addresses.workAddress.street
 * @param rootForm
 * @param control
 */
export const getFormControlFieldName = (
  rootForm: FormGroup,
  control: AbstractControl
): string => {
  const parentFormGroup = control.parent?.controls;
  if (!parentFormGroup) {
    throw new Error(
      'An ngModel should always be wrapped in a parent FormGroup'
    );
  }

  const controlName = getControlName(control) as string;
  const parentName = getControlName(control.parent);

  const abstractControlPath = getAbstractControlPath(
    rootForm,
    controlName,
    parentName
  );
  return abstractControlPath;
};

/**
 * Calcuates the field name/path of a form group Eg: addresses.workAddress
 * @param rootForm
 * @param control
 */
export const getFormGroupFieldName = (
  rootForm: FormGroup,
  control: AbstractControl
): string => {
  const parentFormGroup = control.parent?.controls;
  if (!parentFormGroup) {
    throw new Error(
      'An ngModelGroup should always be wrapped in a parent FormGroup'
    );
  }
  return getGroupPath(rootForm, control);
};

export const arrayToObject = <T>(arr: T[]): { [key: number]: T } => {
  return arr.reduce((acc, value, index) => ({ ...acc, [index]: value }), {});
};

/**
 * Removes the property with the key passed in
 * and returns a new object without the property
 */
export const removeItem = <T>(
  items: Record<string, T>,
  key: string
): Record<string, T> => {
  const itemsArray = Object.values(items).filter(
    (v, index) => index !== Number(key)
  );
  return arrayToObject(itemsArray);
};

/**
 * Adds the value to the object passed in
 * and returns a new object with the new value
 */
export const addItem = <T>(items: Record<string, T>, value: T) => {
  const itemsArray = [...Object.values(items), value];
  return arrayToObject(itemsArray);
};

/**
 * This RxJS operator merges the value of the form with the raw value.
 * By doing this we can assure that we don't lose values of disabled form fields
 * @param form
 */
export function mergeValuesAndRawValues<T>(form: FormGroup): T {
  // Retrieve the standard values (respecting references)
  const value = { ...form.value };

  // Retrieve the raw values (including disabled values)
  const rawValue = form.getRawValue();

  // Recursive function to merge rawValue into value
  function mergeRecursive(target: any, source: any) {
    Object.keys(source).forEach((key) => {
      if (target[key] === undefined) {
        // If the key is not in the target, add it directly (for disabled fields)
        target[key] = source[key];
      } else if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        // If the value is an object, merge it recursively
        mergeRecursive(target[key], source[key]);
      }
      // If the target already has the key with a primitive value, it's left as is to maintain references
    });
  }

  mergeRecursive(value, rawValue);
  return value;
}
