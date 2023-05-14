
/*
 * Module dependencies.
 */

import { CircularProgress } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { authenticateUser, selectAuthenticatedUser } from 'src/state/slices/authenticated-user';
import { getAuthenticatedUser } from 'src/services/backend/authentication';
import { getOrganizations } from 'src/services/backend/organizations';
import { isNil } from 'lodash';
import { onClient } from 'src/utils/environment';
import { selectActiveOrganizationId, setActiveOrganizationId } from 'src/state/slices/ui';
import { selectOrganizations, setOrganizationsAction } from 'src/state/slices/data';
import { useAppSelector } from 'src/ui/hooks/redux';
import { useAuthenticationHandler } from 'src/ui/hooks/authentication';
import { useDispatch } from 'react-redux';
import { useQuery } from 'react-query';
import React from 'react';

/*
 * Protected route component.
 */

export default function ProtectedRoute({ children }: { children?: React.ReactElement }) {
  const authenticatedUser = useAppSelector(selectAuthenticatedUser);
  const organizations = useAppSelector(selectOrganizations);
  const activeOrganizationId = useAppSelector(selectActiveOrganizationId);
  const dispatch = useDispatch();
  const { handleAuthenticatedRequest } = useAuthenticationHandler();
  const { isLoading, refetch } = useQuery('authenticationBaseData', async () => {
    const user = await handleAuthenticatedRequest(() => getAuthenticatedUser());
    const organizations = await handleAuthenticatedRequest(() => getOrganizations());

    dispatch(authenticateUser(user));
    dispatch(setOrganizationsAction(organizations));

    if (activeOrganizationId === null) {
      dispatch(setActiveOrganizationId(organizations.find(organization => organization.isPersonal)?.id ?? null));
    }
  }, {
    enabled: false
  });

  if (authenticatedUser === null || organizations.length === 0 || isLoading) {
    if (onClient()) {
      refetch();
    }

    return <CircularProgress />;
  }

  return !isNil(children) ? children : <Outlet />;
}
