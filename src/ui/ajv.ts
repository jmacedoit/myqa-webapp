
/*
 * Module dependencies.
 */

import { isNil } from 'lodash';
import Ajv, { JSONSchemaType } from 'ajv';
import addErrors from 'ajv-errors';
import addFormats from 'ajv-formats';

/*
 * Export ajv.
 */

export const ajv = addFormats(addErrors(new Ajv({
  allErrors: true,
  useDefaults: true,
  keywords: ['uniforms'],
  strict: false
})));

ajv.addKeyword({
  keyword: 'isFile',
  validate: (schema, data) => {
    if (schema === true && data instanceof File) {
      return true;
    }

    return false;
  },
  errors: false
});

/*
 * Default validator that simply returns model errors.
 */

export function createDefaultValidator<T>(schema: JSONSchemaType<T>) {
  const validator = ajv.compile(schema);

  return (model: Record<string, unknown>) => {
    validator(model);

    const errorsDetails = validator.errors?.map(error => {
      const detail = error.params?.errors?.[0];

      if (isNil(detail)) {
        return error;
      }

      detail.message = error.message;

      return detail;
    });

    return validator.errors?.length ? { details: errorsDetails ?? [] } : null;
  };
}
