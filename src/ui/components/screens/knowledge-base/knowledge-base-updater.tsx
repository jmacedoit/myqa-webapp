

/*
 * Module dependencies.
 */

import { AutoField, AutoForm, ErrorField } from 'uniforms-mui';
import { DialogActions } from 'src/ui/components/layout/dialog-actions';
import { FromSchema } from 'json-schema-to-ts';
import { JSONSchemaType } from 'ajv';
import { KnowledgeBase } from 'src/types/knowledge-bases';
import { createDefaultValidator } from 'src/ui/ajv';
import { patchKnowledgeBase } from 'src/services/backend/knowledge-bases';
import { properties } from 'src/utils/types';
import { translationKeys } from 'src/translations';
import { updateKnowledgeBaseAction } from 'src/state/slices/data';
import { useAppDispatch } from 'src/ui/hooks/redux';
import { useMutation } from 'react-query';
import { useTranslation } from 'react-i18next';
import JSONSchemaBridge from 'uniforms-bridge-json-schema';
import React, { useRef } from 'react';
import SimpleButton from '../../buttons/simple-button';
import Type from 'src/ui/styles/type';

/*
 * Update knowledge base schema.
 */

const createUpdateKnowledgeBaseSchema = (t: (key: string) => string) => ({
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 4,
      maxLength: 32,
      title: t(translationKeys.forms.updateKnowledgeBase.name.label)
    }
  },
  errorMessage: {
    required: {
      name: t(translationKeys.forms.updateKnowledgeBase.name.requiredError)
    },
    properties: {
      name: t(translationKeys.forms.updateKnowledgeBase.name.invalidError)
    }
  },
  required: ['name'],
  additionalProperties: false
}) as const;

type UpdateData = FromSchema<ReturnType<typeof createUpdateKnowledgeBaseSchema>>;

/*
 * Export KnowledgeBaseUpdater.
 */

function KnowledgeBaseUpdaterComponent({ knowledgeBaseId, onKnowledgeBaseUpdated }: { knowledgeBaseId: string, onKnowledgeBaseUpdated: () => void }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const editFormRef = useRef<any>(null);
  const knowledgeBaseUpdate = useMutation('updateKnowledgeBase', async (modifications: Partial<KnowledgeBase>) => {
    await patchKnowledgeBase(knowledgeBaseId, modifications);

    dispatch(updateKnowledgeBaseAction({ id: knowledgeBaseId, modifications }));
  });

  const handleEditKnowledgeBaseSubmit = async (data: UpdateData) => {
    await knowledgeBaseUpdate.mutateAsync(data);

    onKnowledgeBaseUpdated();
  };

  const updateKnowledgeBaseSchema = createUpdateKnowledgeBaseSchema(t);
  const updateKnowledgeBaseSchemaValidator = createDefaultValidator(updateKnowledgeBaseSchema as JSONSchemaType<UpdateData>);
  const updateKnowledgeBaseBridge = new JSONSchemaBridge(updateKnowledgeBaseSchema, updateKnowledgeBaseSchemaValidator);

  return (
    <>
      <Type.H4>
        {t(translationKeys.screens.knowledgeBases.editKnowledgeBase)}
      </Type.H4>

      <AutoForm
        onSubmit={handleEditKnowledgeBaseSubmit}
        ref={editFormRef}
        schema={updateKnowledgeBaseBridge}
      >
        <AutoField name={properties<UpdateData>().name} />

        <ErrorField name={properties<UpdateData>().name} />
      </AutoForm>

      <DialogActions>
        <SimpleButton
          loading={knowledgeBaseUpdate.isLoading}
          onClick={event => {
            event.preventDefault();

            editFormRef.current?.submit();
          }}
        >
          {t(translationKeys.forms.updateKnowledgeBase.submitEditLabel)}
        </SimpleButton>
      </DialogActions>
    </>
  );
}

export const KnowledgeBaseUpdater = React.memo(KnowledgeBaseUpdaterComponent);
