
/*
 * Module dependencies.
 */

import { AddCircle } from '@mui/icons-material';
import { AutoField, AutoForm, ErrorField } from 'uniforms-mui';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { FromSchema } from 'json-schema-to-ts';
import { JSONSchemaType } from 'ajv';
import { createDefaultValidator } from 'src/ui/ajv';
import { createKnowledgeBase } from 'src/services/backend/knowledge-bases';
import { createKnowledgeBaseAction } from 'src/state/slices/data';
import { isNil } from 'lodash';
import { properties } from 'src/utils/types';
import { selectActiveOrganization } from 'src/state/slices/ui';
import { translationKeys } from 'src/translations';
import { useAppDispatch, useAppSelector } from 'src/ui/hooks/redux';
import { useMutation } from 'react-query';
import { useTranslation } from 'react-i18next';
import JSONSchemaBridge from 'uniforms-bridge-json-schema';
import KnowledgeBaseContainer from './knowledge-base-container';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';

/*
 * Styles.
 */

const HeightDummy = styled.div`
  padding-top: 100%;
`;

const InnerContainer = styled.button`
  border-width: 0;
  padding: 0;
  border: none;
  appearance: none;
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: pointer;
  opacity: 0.5;
  transition: 0.1s opacity;

  &:hover {
    opacity: 1;
  }
`;

/*
 * Knowledge base creation schema.
 */

const createCreateKnowledgeBaseSchema = (t: (key: string) => string) => ({
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 4,
      maxLength: 32,
      title: t(translationKeys.forms.knowledgeBase.name.label)
    }
  },
  errorMessage: {
    required: {
      name: t(translationKeys.forms.knowledgeBase.name.requiredError)
    },
    properties: {
      name: t(translationKeys.forms.knowledgeBase.name.invalidError)
    }
  },
  required: ['name'],
  additionalProperties: false
}) as const;

type CreateData = FromSchema<ReturnType<typeof createCreateKnowledgeBaseSchema>>;

/*
 * Knowledge base component.
 */

export default function KnowledgeBaseComponent() {
  const { t } = useTranslation();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const activeOrganization = useAppSelector(selectActiveOrganization);
  const dispatch = useAppDispatch();
  const createForRef = useRef<any>(null);
  const knowledgeBaseCreation = useMutation('createKnowledgeBase', async (data: CreateData) => {
    if (isNil(activeOrganization)) {
      throw new Error('No active organization');
    }

    const createdKnowledgeBase = await createKnowledgeBase(activeOrganization.id, data);

    dispatch(createKnowledgeBaseAction({ ...createdKnowledgeBase, organization: activeOrganization }));
  });

  const handleOpenCreateDialog = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();

    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleCreateKnowledgeBaseSubmit = async (data: CreateData) => {
    await knowledgeBaseCreation.mutateAsync(data);

    setCreateDialogOpen(false);
  };

  const createKnowledgeBaseSchema = createCreateKnowledgeBaseSchema(t);
  const schemaValidator = createDefaultValidator(createKnowledgeBaseSchema as JSONSchemaType<CreateData>);
  const bridge = new JSONSchemaBridge(createKnowledgeBaseSchema, schemaValidator);

  return (
    <>
      <KnowledgeBaseContainer variant={'outlined'}>
        <HeightDummy />

        <InnerContainer onClick={handleOpenCreateDialog}>
          <AddCircle sx={{ fontSize: '80px' }} />
        </InnerContainer>
      </KnowledgeBaseContainer>

      <Dialog
        onClose={handleCloseCreateDialog}
        open={createDialogOpen}
      >
        <DialogTitle>
          {t(translationKeys.screens.knowledgeBases.createKnowledgeBase)}
        </DialogTitle>

        <DialogContent>
          <AutoForm
            onSubmit={handleCreateKnowledgeBaseSubmit}
            ref={createForRef}
            schema={bridge}
          >
            <AutoField name={properties<CreateData>().name} />

            <ErrorField name={properties<CreateData>().name} />
          </AutoForm>
        </DialogContent>

        <DialogActions>
          {knowledgeBaseCreation.isLoading ? (
            <CircularProgress />
          ) : (
            <Button onClick={event => {
              event.preventDefault();

              createForRef.current?.submit();
            }}
            >
              {t(translationKeys.forms.knowledgeBase.submitEditLabel)}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
