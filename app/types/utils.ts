export type Falsy = false | 0 | '' | null | undefined;

export const isNotFalsy = <T>(value: T | Falsy): value is T => {
  return (
    value !== null &&
    value !== undefined &&
    value !== false &&
    value !== 0 &&
    value !== ''
  );
};

export const isFalsy = <T>(value: T | Falsy): value is Falsy => {
  return !isNotFalsy(value);
};
