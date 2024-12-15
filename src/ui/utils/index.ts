
/*
 * Module dependencies.
 */

import { onClient } from 'src/utils/environment';
import breakpoints from 'src/ui/styles/breakpoints';
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

/*
 * Util for truncating filename up to a certain length.
 */

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

/*
 * Screen class comparing util.
 */

export function screenClassAtLeast(currentScreenClass: string, referenceScreenClass): boolean {
  const breakpointKeyPairs = Object.entries(breakpoints);
  const sortedBreakpointKeyPairs = breakpointKeyPairs.sort((a, b) => a[1] - b[1]);
  const breakpointSortedKeys = sortedBreakpointKeyPairs.map(pair => pair[0]);

  return breakpointSortedKeys.indexOf(currentScreenClass) >= breakpointSortedKeys.indexOf(referenceScreenClass);
}

export function screenClassAtMost(currentScreenClass: string, referenceScreenClass): boolean {
  const breakpointKeyPairs = Object.entries(breakpoints);
  const sortedBreakpointKeyPairs = breakpointKeyPairs.sort((a, b) => a[1] - b[1]);
  const breakpointSortedKeys = sortedBreakpointKeyPairs.map(pair => pair[0]);

  return breakpointSortedKeys.indexOf(currentScreenClass) <= breakpointSortedKeys.indexOf(referenceScreenClass);
}
