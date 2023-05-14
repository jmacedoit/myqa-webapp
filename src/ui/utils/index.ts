
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
