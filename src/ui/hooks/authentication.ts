
/*
 * Module dependencies.
 */
import { routes } from 'src/ui/routes';
import { useNavigate } from 'react-router-dom';

/*
 * Use authentication error handler.
 */

export function useAuthenticationHandler() {
  const navigate = useNavigate();

  async function handleAuthenticatedRequest<T>(promiseFactory: () => Promise<T>) {
    let result: T;

    try {
      result = await promiseFactory();

      return result;
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        navigate(routes.signIn);
      }

      throw error;
    }
  }

  return { handleAuthenticatedRequest };
}
