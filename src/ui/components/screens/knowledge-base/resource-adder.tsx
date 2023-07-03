
/*
 * Module dependencies.
 */

import { AutoField, AutoForm, ErrorField, HiddenField } from 'uniforms-mui';
import { DialogActions } from 'src/ui/components/layout/dialog-actions';
import { FromSchema } from 'json-schema-to-ts';
import { JSONSchemaType } from 'ajv';
import { addFileResourceToKnowledgeBase } from 'src/services/backend/resources';
import { addNotification } from 'src/state/slices/ui';
import { createDefaultValidator } from 'src/ui/ajv';
import { createKnowledgeBaseResourceAction } from 'src/state/slices/data';
import { isNil } from 'lodash';
import { properties } from 'src/utils/types';
import { translationKeys } from 'src/translations';
import { useAppDispatch } from 'src/ui/hooks/redux';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FileField from 'src/ui/components/fields/file';
import JSONSchemaBridge from 'uniforms-bridge-json-schema';
import React, { useRef } from 'react';
import SimpleButton from 'src/ui/components/buttons/simple-button';
import Type from 'src/ui/styles/type';

/*
 * Resource creation schema.
 */

const createResourceCreationSchema = (t: (key: string) => string) => ({
  type: 'object',
  properties: {
    file: {
      isFile: true,
      type: 'object',
      uniforms: { component: FileField },
      title: t(translationKeys.forms.common.resourceFile.label)
    },
    dummy: {
      type: 'string',
      nullable: true
    }
  },
  errorMessage: {
    properties: {
      file: t(translationKeys.forms.common.resourceFile.requiredError)
    }
  },
  required: ['file'],
  additionalProperties: false
}) as const;

type ResourceCreationData = FromSchema<ReturnType<typeof createResourceCreationSchema>>;

/*
 * Export ResourceAdder.
 */

function ResourceAdder({ onResourceAdded }: { onResourceAdded: () => void }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { knowledgeBaseId } = useParams();
  const formRef = useRef<any>(null);
  const resourceCreation = useMutation('createResource', async (resourceCreationData: ResourceCreationData) => {
    if (isNil(knowledgeBaseId)) {
      return;
    }

    const addedResource = await addFileResourceToKnowledgeBase(knowledgeBaseId, resourceCreationData.file as unknown as File);

    dispatch(createKnowledgeBaseResourceAction({
      knowledgeBaseId,
      resource: addedResource
    }));

    dispatch(addNotification({
      message: t(translationKeys.screens.addResource.successMessage),
      type: 'success'
    }));
  });

  const handleSubmit = async (model: ResourceCreationData) => {
    await resourceCreation.mutateAsync(model);

    onResourceAdded();
  };

  const resourceCreationBaseSchema = createResourceCreationSchema(t);
  const schemaValidator = createDefaultValidator(resourceCreationBaseSchema as JSONSchemaType<ResourceCreationData>);
  const bridge = new JSONSchemaBridge(resourceCreationBaseSchema, schemaValidator);

  return (
    <>
      <Type.H4>
        {t(translationKeys.screens.addResource.title)}
      </Type.H4>

      <AutoForm
        onSubmit={handleSubmit}
        ref={formRef}
        schema={bridge}
      >
        <AutoField
          name={properties<ResourceCreationData>().file}
          onFileAdded={() => {
            // Nasty hack to retrigger model change when adding a file.
            formRef.current?.change(properties<ResourceCreationData>().dummy, Math.random().toString());
          }}
        />

        <HiddenField name={properties<ResourceCreationData>().dummy ?? ''} />

        <ErrorField name={properties<ResourceCreationData>().file} />
      </AutoForm>

      {resourceCreation.isLoading && (
        <Type.XSmall>
          {t(translationKeys.screens.addResource.loadingMessge)}
        </Type.XSmall>
      )}

      <DialogActions>
        <SimpleButton
          loading={resourceCreation.isLoading}
          onClick={event => {
            event.preventDefault();

            formRef.current?.submit();
          }}
        >
          {t(translationKeys.forms.updateKnowledgeBase.submitAddLabel)}
        </SimpleButton>
      </DialogActions>
    </>
  );
}

export default React.memo(ResourceAdder);
