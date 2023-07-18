
/*
 * Module dependencies.
 */

import { onClient } from 'src/utils/environment';
import usePromise from 'react-use-promise';

/*
 * Use promise on client.
 */

export function usePromiseOnClient<T>(promiseFactory: () => Promise<T>, updateProperties: any[]) {
  return usePromise(() => {
    if (!onClient()) {
      return Promise.resolve(null as T);
    }

    return promiseFactory();
  }, updateProperties);
}

export function truncateFilename(filename: string, maxLength: number): string {
  const ext = filename.split('.').pop();

  if (filename.length <= 16 || !ext) {
    return filename;
  }

  const nameLimit = maxLength - ext.length - 5;

  // Get the filename without the extension
  const name = filename.slice(0, -1 * (ext.length + 1));

  // Truncate the filename to the limit, add '...', and append the extension
  const newFilename = `${name.slice(0, nameLimit)}...  .${ext}`;

  return newFilename;
}
