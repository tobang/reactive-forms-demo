export const strLeftBack = (sourceStr: string, keyStr: string): string => {
  const arr: Array<string> = sourceStr.split(keyStr);
  arr.pop();
  return keyStr === null || keyStr === '' ? '' : arr.join(keyStr);
};
