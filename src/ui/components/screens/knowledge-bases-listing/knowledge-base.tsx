
/*
 * Module dependencies.
 */

import { AutoField, AutoForm, ErrorField } from 'uniforms-mui';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { FromSchema } from 'json-schema-to-ts';
import { JSONSchemaType } from 'ajv';
import { KnowledgeBase } from 'src/types/knowledge-bases';
import { createDefaultValidator } from 'src/ui/ajv';
import { deleteKnowledgeBase, patchKnowledgeBase } from 'src/services/backend/knowledge-bases';
import { deleteKnowledgeBaseAction, updateKnowledgeBaseAction } from 'src/state/slices/data';
import { properties } from 'src/utils/types';
import { translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useAppDispatch } from 'src/ui/hooks/redux';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import JSONSchemaBridge from 'uniforms-bridge-json-schema';
import KnowledgeBaseContainer from './knowledge-base-container';
import React, { useRef, useState } from 'react';
import Shapes from 'src/ui/components/screens/knowledge-base/shapes';
import Type from 'src/ui/styles/type';
import styled from 'styled-components';
import { routes } from 'src/ui/routes';

/*
 * Styles.
 */

const HeightDummy = styled.div`
  padding-top: 100%;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${units(2)}px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const StyledH4 = styled(Type.H4)`
  margin-bottom: ${units(1)}px;
`;

const ImageContainer = styled.div`
  position: relative;
  flex: 1;
`;

const Actions = styled.div`
  text-align: right;
  margin-bottom: ${units(-1)}px;
  margin-right: ${units(-1)}px;
`;

const NameContainer = styled.div`

`;

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

type UpdateData = FromSchema<ReturnType<typeof createUpdateKnowledgeBaseSchema>>;

/*
 * Knowledge base component.
 */

export default function KnowledgeBaseComponent({ knowledgeBase }: { knowledgeBase: KnowledgeBase }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const dispatch = useAppDispatch();
  const editFormRef = useRef<any>(null);
  const knowledgeBaseUpdate = useMutation('updateKnowledgeBase', async (modifications: Partial<KnowledgeBase>) => {
    await patchKnowledgeBase(knowledgeBase.id, modifications);

    dispatch(updateKnowledgeBaseAction({ id: knowledgeBase.id, modifications }));
  });

  const knowledgeBaseRemoval = useMutation('deleteKnowledgeBase', async (knowledgeBaseId: string) => {
    await deleteKnowledgeBase(knowledgeBaseId);

    dispatch(deleteKnowledgeBaseAction(knowledgeBase.id));
  });

  const handleOpenEditDialog = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();

    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleDeleteKnowledgeBase = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();

    await knowledgeBaseRemoval.mutateAsync(knowledgeBase.id);
  };

  const handleEditKnowledgeBaseSubmit = async (data: UpdateData) => {
    await knowledgeBaseUpdate.mutateAsync(data);

    setEditDialogOpen(false);
  };

  const updateKnowledgeBaseSchema = createUpdateKnowledgeBaseSchema(t);
  const schemaValidator = createDefaultValidator(updateKnowledgeBaseSchema as JSONSchemaType<UpdateData>);
  const bridge = new JSONSchemaBridge(updateKnowledgeBaseSchema, schemaValidator);

  return (
    <>
      <KnowledgeBaseContainer
        onClick={() => {
          navigate(routes.getKnowledgeBase(knowledgeBase.id));
        }}
        variant={'outlined'}
      >
        <HeightDummy />

        <InnerContainer>
          <ImageContainer>
            <Shapes
              knowledgeBaseId={knowledgeBase.id}
              numberOfShapes={3}
            />
          </ImageContainer>

          <NameContainer>
            <StyledH4>
              {knowledgeBase.name}
            </StyledH4>
          </NameContainer>

          <Type.Paragraph style={{ marginBottom: 0 }}>
            {knowledgeBase.resourcesCount > 0 ? (
              <>
                <b>{`${knowledgeBase.resourcesCount} `}</b>

                {t(translationKeys.screens.knowledgeBases.resourcesCountSufix)}
              </>
            ) : t(translationKeys.screens.knowledgeBases.noResources)}
          </Type.Paragraph>

          <Actions>
            <IconButton onClick={handleDeleteKnowledgeBase}>
              {knowledgeBaseRemoval.isLoading ? <CircularProgress size={25} /> : <Delete />}
            </IconButton>

            <IconButton onClick={handleOpenEditDialog}>
              <Edit />
            </IconButton>
          </Actions>
        </InnerContainer>
      </KnowledgeBaseContainer>

      <Dialog
        onClose={handleCloseEditDialog}
        open={editDialogOpen}
      >
        <DialogTitle>
          {t(translationKeys.screens.knowledgeBases.editKnowledgeBase)}
        </DialogTitle>

        <DialogContent>
          <AutoForm
            onSubmit={handleEditKnowledgeBaseSubmit}
            ref={editFormRef}
            schema={bridge}
          >
            <AutoField name={properties<UpdateData>().name} />

            <ErrorField name={properties<UpdateData>().name} />
          </AutoForm>
        </DialogContent>

        <DialogActions>
          {knowledgeBaseUpdate.isLoading ? (
            <CircularProgress />
          ) : (
            <Button onClick={event => {
              event.preventDefault();

              editFormRef.current?.submit();
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
