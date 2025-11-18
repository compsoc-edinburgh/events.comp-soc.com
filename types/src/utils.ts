/**
 * Makes all properties of a type nullable
 * @template T - The type to make nullable
 */
export type Nullable<T> = T | null;

/**
 * Makes all properties of a type optional and nullable
 * @template T - The type to make partial and nullable
 */
export type PartialNullable<T> = {
  [P in keyof T]?: T[P] | null;
};

/**
 * Extracts the keys of an object as a union type
 * @template T - The object type
 */
export type KeysOf<T> = keyof T;

/**
 * Makes specific properties of a type required
 * @template T - The base type
 * @template K - The keys to make required
 */
export type RequireProps<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Makes specific properties of a type optional
 * @template T - The base type
 * @template K - The keys to make optional
 */
export type OptionalProps<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
