
/*
 * Module dependencies.
 */

import { AutoField, AutoForm } from 'uniforms-mui';
import { FieldWrapper, StyledErrorField } from 'src/ui/components/fields/form-misc';
import { FromSchema } from 'json-schema-to-ts';
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';
import { JSONSchemaType } from 'ajv';
import { addNotification } from 'src/state/slices/ui';
import { createDefaultValidator } from 'src/ui/ajv';
import { properties } from 'src/utils/types';
import { requestPasswordRecovery } from 'src/services/backend/access-recovery';
import { routes } from 'src/ui/routes';
import { translationKeys as translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useAppDispatch } from 'src/ui/hooks/redux';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainButton from 'src/ui/components/buttons/main-button';
import QuickActionPage from 'src/ui/components/layout/quick-action-page';
import React, { useRef } from 'react';
import TextField from 'src/ui/components/fields/text-field';
import Type from 'src/ui/styles/type';

/*
 * Recover password schema.
 */

const createRecoverPasswordSchema = (t: (key: string) => string) => ({
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      component: TextField,
      title: t(translationKeys.forms.common.email.label)
    }
  },
  additionalProperties: false,
  required: ['email'],
  errorMessage: {
    required: {
      email: t(translationKeys.forms.common.email.requiredError)
    },
    properties: {
      email: t(translationKeys.forms.common.email.invalidError)
    }
  }
}) as const;

type RecoverPasswordData = FromSchema<ReturnType<typeof createRecoverPasswordSchema>>;

/*
 * RecoverPassword component.
 */

function RecoverPassword() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const formRef = useRef<any>(null);
  const passwordRecoveryRequestCreation = useMutation(async (data: RecoverPasswordData) => {
    try {
      await requestPasswordRecovery(data.email);
    } catch (error) {
      dispatch(addNotification({
        message: t(translationKeys.forms.common.operationErrors.genericError),
        type: 'error'
      }));

      return;
    }

    navigate(routes.recoverPasswordEmailSent);
  });

  const recoverPasswordSchema = createRecoverPasswordSchema(t);
  const schemaValidator = createDefaultValidator(recoverPasswordSchema as JSONSchemaType<RecoverPasswordData>);
  const bridge = new JSONSchemaBridge(recoverPasswordSchema, schemaValidator);

  return (
    <QuickActionPage>
      <Type.H3>
        {t(translationKeys.screens.passwordRecovery.title)}
      </Type.H3>

      <AutoForm
        onSubmit={(model: RecoverPasswordData) => {
          passwordRecoveryRequestCreation.mutate(model);
        }}
        ref={formRef}
        schema={bridge}
      >
        <div style={{ marginBottom: units(4), textAlign: 'left' }}>
          <FieldWrapper>
            <AutoField name={properties<RecoverPasswordData>().email} />

            <StyledErrorField name={properties<RecoverPasswordData>().email} />
          </FieldWrapper>
        </div>

        <MainButton
          loading={passwordRecoveryRequestCreation.isLoading}
          onClick={event => {
            event.preventDefault();

            formRef.current?.submit();
          }}
        >
          {t(translationKeys.forms.passwordRecovery.submitLabel)}
        </MainButton>
      </AutoForm>
    </QuickActionPage>
  );
}

/*
 * Export the component.
 */

export default React.memo(RecoverPassword);
