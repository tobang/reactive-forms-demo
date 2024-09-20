export type WithNonNullableProperties<T, K extends keyof T> = T & {
  [X in K]-?: NonNullable<T[X]>;
};

export const hasOwnProperty = <X extends object, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> => {
  // eslint-disable-next-line no-prototype-builtins
  return obj.hasOwnProperty(prop);
};

export const toInt = <T extends null | number = number>(
  value: any,
  defaultValue?: T
): T | number => {
  const def = defaultValue === undefined ? 0 : defaultValue;
  if (value === null || value === undefined) {
    return def;
  }
  const result = parseInt(value);
  return isNaN(result) ? def : result;
};

export const setProp = <T extends object, K>(
  initial: T,
  path: string,
  value: K
): T => {
  if (!initial) return {} as T;
  if (!path || value === undefined) return initial;
  const segments = path.split(/[\.\[\]]/g).filter((x) => !!x.trim());
  const _set = (node: any) => {
    if (segments.length > 1) {
      const key = segments.shift() as string;
      const nextIsNum = toInt(segments[0], null) === null ? false : true;
      node[key] = node[key] === undefined ? (nextIsNum ? [] : {}) : node[key];
      _set(node[key]);
    } else {
      node[segments[0]] = value;
    }
  };
  const cloned = structuredClone(initial);
  _set(cloned);
  return cloned;
};

export const notNullOrUndefined = <T>(val: T | null | undefined): val is T => {
  return val !== undefined && val !== null;
};

export const notNullOrUndefinedString = <T>(
  val: T | null | undefined | string
): val is T => {
  return notNullOrUndefined(val) && val !== '';
};

export const hasNonNullableProperties = <T, K extends keyof T>(
  obj: T,
  ...keys: readonly K[]
): obj is WithNonNullableProperties<T, K> => {
  return keys.every((key) => obj[key] != null);
};
