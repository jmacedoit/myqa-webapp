
/*
 * Module dependencies.
 */

import { AutoField, AutoForm, ErrorField, SubmitField } from 'uniforms-mui';
import { Col, Container, Row } from 'react-grid-system';
import { FromSchema } from 'json-schema-to-ts';
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';
import { JSONSchemaType } from 'ajv';
import { Paper } from '@mui/material';
import { authenticate, getAuthenticatedUser } from 'src/services/backend/authentication';
import { authenticateUser } from 'src/state/slices/authenticated-user';
import { createDefaultValidator } from 'src/ui/ajv';
import { getOrganizations } from 'src/services/backend/organizations';
import { properties } from 'src/utils/types';
import { routes } from 'src/ui/routes';
import { setActiveOrganizationId } from 'src/state/slices/ui';
import { setOrganizationsAction } from 'src/state/slices/data';
import { translationKeys as translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useAppDispatch } from 'src/ui/hooks/redux';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React from 'react';
import Type from 'src/ui/styles/type';
import styled from 'styled-components';

/*
 * Styles.
 */

const StyledContainer = styled(Container)`
  padding-top: ${units(10)}px;
`;

const StyledColumn = styled(Col)`
  text-align: center;
`;

const StyledErrorField = styled(ErrorField)`
  text-align: left;

  margin-bottom: ${units(1)}px;
`;

const StyledPaper = styled(Paper)`
  padding: ${units(8)}px;
`;

/*
 * Sign in schema.
 */

const creatSignInSchema = (t: (key: string) => string) => ({
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      title: t(translationKeys.forms.email.label)
    },
    password: {
      type: 'string',
      title: t(translationKeys.forms.password.label)
    }
  },
  additionalProperties: false,
  required: ['email', 'password'],
  errorMessage: {
    required: {
      email: t(translationKeys.forms.email.requiredError),
      password: t(translationKeys.forms.password.requiredError)
    },
    properties: {
      email: t(translationKeys.forms.email.invalidError)
    }
  }
}) as const;

type SignInData = FromSchema<ReturnType<typeof creatSignInSchema>>;

/*
 * SignIn component.
 */

function SignIn() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authentication = useMutation(async (data: SignInData) => {
    await authenticate(data);

    const user = await getAuthenticatedUser();
    const organizations = await getOrganizations();

    dispatch(authenticateUser(user));
    dispatch(setOrganizationsAction(organizations));
    dispatch(setActiveOrganizationId(organizations.find(organization => organization.isPersonal)?.id ?? null));

    navigate(routes.knowledgeBasesListing);
  });

  const signInSchema = creatSignInSchema(t);
  const schemaValidator = createDefaultValidator(signInSchema as JSONSchemaType<SignInData>);
  const bridge = new JSONSchemaBridge(signInSchema, schemaValidator);

  return (
    <>
      <StyledContainer>
        <Row>
          <StyledColumn md={3} />

          <StyledColumn
            md={6}
            xs={12}
          >
            <StyledPaper variant={'outlined'}>
              <Type.H3>
                {t(translationKeys.screens.signIn.title)}
              </Type.H3>

              <AutoForm
                onSubmit={(model: SignInData) => {
                  authentication.mutate(model);
                }}
                schema={bridge}
              >
                <div style={{ marginBottom: units(4), textAlign: 'left' }}>
                  <AutoField name={properties<SignInData>().email} />

                  <StyledErrorField name={properties<SignInData>().email} />

                  <AutoField
                    name={properties<SignInData>().password}
                    type={'password'}
                  />

                  <StyledErrorField name={properties<SignInData>().password} />
                </div>

                <SubmitField />
              </AutoForm>
            </StyledPaper>
          </StyledColumn>
        </Row>
      </StyledContainer>
    </>
  );
}

export default React.memo(SignIn);
