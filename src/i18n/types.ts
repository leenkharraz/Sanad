/** Recursively requires the same nested shape as T, but only enforces that
 * leaves are `string` (or `readonly string[]`) — not that they match T's
 * literal content. This lets ar.ts be type-checked against en.ts's *shape*
 * (same keys, nothing missing/extra) without forcing identical text. */
export type DeepStringSchema<T> = T extends readonly string[]
  ? readonly string[]
  : T extends string
    ? string
    : { [K in keyof T]: DeepStringSchema<T[K]> };

type Join<K, P> = K extends string ? (P extends string ? `${K}.${P}` : K) : never;

/** Union of every dot-path leaf key, e.g. "auth.signIn.title". */
export type Leaves<T> = T extends readonly string[]
  ? never
  : T extends string
    ? never
    : { [K in keyof T]-?: T[K] extends string | readonly string[] ? K & string : Join<K & string, Leaves<T[K]>> }[keyof T];
