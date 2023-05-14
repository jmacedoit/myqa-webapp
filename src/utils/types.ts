
/*
 * Module dependencies.
 */

import { get } from 'lodash';

/*
 * Type which is made of the union of object values types.
 */

export type Values<T> = T[keyof T];

/*
 * Class constructor type.
 */

export type Constructor<T = {}> = new (...args: any[]) => T;

/*
 * DeepReadonly type is a mapped type that recursively applies the`readonly`
 * modifier to all properties and nested properties of a given type`T`.
 */

export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

/*
 * Useful to get the type of a property of an object in a type safe way that survives refactoring.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
export function properties<TObj>(obj?: TObj) {
  return new Proxy({}, {
    get: (_, prop) => prop,
    set: () => {
      throw new Error('Set not supported');
    }
  }) as {
    [P in keyof TObj]: P;
  };
}

type RecursiveProperties<T> = {
  [P in keyof T]: T[P] extends object ? RecursiveProperties<T[P]> : P;
};

function recursiveProperties(obj: any, prefix = ''): any {
  return new Proxy(
    {},
    {
      get: (_, prop: string) => {
        const path = prefix + (prefix !== '' ? '.' : '') + prop;

        if (get(obj, path) instanceof Object) {
          return recursiveProperties(obj, path);
        }

        return path;
      },
      set: () => {
        throw new Error('Set not supported');
      }
    }
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
export function propertiesLeaves<TObj>(obj?: TObj): RecursiveProperties<TObj> {
  return recursiveProperties(obj) as RecursiveProperties<TObj>;
}
