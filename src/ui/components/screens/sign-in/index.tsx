
/*
 * Module dependencies.
 */

import { AutoField, AutoForm, ErrorField } from 'uniforms-mui';
import { Col, Container, Row } from 'react-grid-system';
import { FromSchema } from 'json-schema-to-ts';
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';
import { JSONSchemaType } from 'ajv';
import { authenticate, getAuthenticatedUser } from 'src/services/backend/authentication';
import { authenticateUser } from 'src/state/slices/authenticated-user';
import { createDefaultValidator } from 'src/ui/ajv';
import { getOrganizations } from 'src/services/backend/organizations';
import { palette } from 'src/ui/styles/colors';
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
import MainButton from 'src/ui/components/buttons/main-button';
import React, { useRef } from 'react';
import Type from 'src/ui/styles/type';
import UnderlinedButton from 'src/ui/components/buttons/underlined-button';
import styled from 'styled-components';

/*
 * Styles.
 */

const Wrapper = styled.div`
  background-color: ${palette.extraDarkGreen};
`;

const StyledColumn = styled(Col)`;
  text-align: center;
`;

const FieldWrapper = styled.div`
  margin-bottom: ${units(1)}px;
`;

const StyledErrorField = styled(ErrorField)`
  text-align: left;
`;

const ShortPageContentSpacer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: ${units(10)}px;
  padding-bottom: ${units(10)}px;
`;

const ContentContainer = styled.div`
  width: 100%;
  border-radius: ${units(2)}px;
  background-color: ${palette.lightGreen};
  box-shadow: 0px 0px 75px rgba(33, 47, 27, 0.2), 0px 0px 7px -1px #101E1A, 0px 4px 25px 5px rgba(4, 24, 18, 0.5);
  padding: ${units(6)}px ${units(4)}px;
  color: ${palette.extraDarkGreen};
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
  const formRef = useRef<any>(null);
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
    <Wrapper>
      <Container>
        <Row>
          <StyledColumn md={3} />

          <StyledColumn
            md={6}
            xs={12}
          >
            <ShortPageContentSpacer>
              <ContentContainer>
                <Type.H3>
                  {t(translationKeys.screens.signIn.title)}
                </Type.H3>

                <AutoForm
                  onSubmit={(model: SignInData) => {
                    authentication.mutate(model);
                  }}
                  ref={formRef}
                  schema={bridge}
                >
                  <div style={{ marginBottom: units(4), textAlign: 'left' }}>
                    <FieldWrapper>
                      <AutoField name={properties<SignInData>().email} />

                      <StyledErrorField name={properties<SignInData>().email} />
                    </FieldWrapper>

                    <FieldWrapper>
                      <AutoField
                        name={properties<SignInData>().password}
                        type={'password'}
                      />

                      <StyledErrorField name={properties<SignInData>().password} />
                    </FieldWrapper>
                  </div>

                  <div style={{ marginBottom: units(6) }}>
                    <MainButton
                      onClick={event => {
                        event.preventDefault();

                        formRef.current?.submit();
                      }}
                      style={{ marginRight: units(1) }}
                    >
                      {'Submit'}
                    </MainButton>

                    <MainButton outlined>
                      {'Sign up'}
                    </MainButton>
                  </div>

                  <UnderlinedButton
                    color={palette.mildGreenDark}
                    display={'block'}
                    onClick={event => {
                      event.preventDefault();

                      console.log('Forgot your password?');
                    }}
                  >
                    <Type.Paragraph style={{ marginBottom: 0 }}>
                      {'Forgot your password?'}
                    </Type.Paragraph>
                  </UnderlinedButton>

                </AutoForm>
              </ContentContainer>
            </ShortPageContentSpacer>
          </StyledColumn>
        </Row>
      </Container>
    </Wrapper>
  );
}

export default React.memo(SignIn);
