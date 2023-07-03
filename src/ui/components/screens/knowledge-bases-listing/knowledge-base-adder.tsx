
/*
 * Module dependencies.
 */

import { AutoField, AutoForm, ErrorField } from 'uniforms-mui';
import { Dialog } from '@mui/material';
import { DialogActions } from '../../layout/dialog-actions';
import { DialogBodyContainer } from 'src/ui/components/layout/dialog-body-container';
import { FromSchema } from 'json-schema-to-ts';
import { JSONSchemaType } from 'ajv';
import { createDefaultValidator } from 'src/ui/ajv';
import { createKnowledgeBase } from 'src/services/backend/knowledge-bases';
import { createKnowledgeBaseAction } from 'src/state/slices/data';
import { isNil } from 'lodash';
import { palette } from 'src/ui/styles/colors';
import { properties } from 'src/utils/types';
import { selectActiveOrganization } from 'src/state/slices/ui';
import { staticUri } from 'src/utils/environment';
import { translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useAppDispatch, useAppSelector } from 'src/ui/hooks/redux';
import { useMutation } from 'react-query';
import { useTranslation } from 'react-i18next';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import JSONSchemaBridge from 'uniforms-bridge-json-schema';
import KnowledgeBaseContainer from './knowledge-base-container';
import React, { useRef, useState } from 'react';
import SimpleButton from 'src/ui/components/buttons/simple-button';
import Type from 'src/ui/styles/type';
import breakpoints from 'src/ui/styles/breakpoints';
import styled from 'styled-components';

/*
 * Styles.
 */

const HeightDummy = styled.div`
  padding-top: 100%;
`;
const InnerContainer = styled.div`
  background-color: ${palette.extraDarkGreen};
  color: ${palette.white};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${units(2)}px ${units(4)}px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Name = styled(Type.H5)`
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: ${units(1)}px;
  overflow-x: clip;
`;

const ImageContainer = styled.div`
  flex: 1;
  margin-bottom: 10%;
  position: relative;
`;

const InfoContainer = styled.div`
  padding-bottom: ${units(3)}px;
`;

const TreeSeed = styled.img`
  width: 65%;

  @media (min-width: ${breakpoints.sm}px) {
    width: 55%;
  }

  @media (min-width: ${breakpoints.xl}px) {
    width: 65%;
  }
`;

const ImageSpacer = styled.div`
  padding-top: 61.22%;
`;

const TreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
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

type CreateData = FromSchema<ReturnType<typeof createCreateKnowledgeBaseSchema>>;

/*
 * Knowledge base component.
 */

export default function KnowledgeBaseComponent(props: { inGridOf: number }) {
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
      <KnowledgeBaseContainer
        inGridOf={props.inGridOf}
        onClick={handleOpenCreateDialog}
      >
        <HeightDummy />

        <InnerContainer>
          <ImageContainer>
            <ImageSpacer />

            <TreeContainer>
              <TreeSeed src={staticUri(`assets/images/tree-seed.png`)} />
            </TreeContainer>
          </ImageContainer>

          <InfoContainer>
            <Name>
              {t(translationKeys.screens.knowledgeBases.createKnowledgeBaseButtonLabel)}
            </Name>

            <Type.Paragraph style={{ marginBottom: 0, fontWeight: 600 }}>
              <AddOutlinedIcon />
            </Type.Paragraph>
          </InfoContainer>
        </InnerContainer>
      </KnowledgeBaseContainer>

      <Dialog
        PaperComponent={DialogBodyContainer}
        fullWidth
        maxWidth={'xs'}
        onClose={handleCloseCreateDialog}
        open={createDialogOpen}
      >
        <Type.H5>
          {t(translationKeys.screens.knowledgeBases.createKnowledgeBase)}
        </Type.H5>

        <AutoForm
          onSubmit={handleCreateKnowledgeBaseSubmit}
          ref={createForRef}
          schema={bridge}
        >
          <AutoField name={properties<CreateData>().name} />

          <ErrorField name={properties<CreateData>().name} />
        </AutoForm>

        <DialogActions>
          <SimpleButton
            loading={knowledgeBaseCreation.isLoading}
            onClick={event => {
              event.preventDefault();

              createForRef.current?.submit();
            }}
          >
            {t(translationKeys.forms.updateKnowledgeBase.submitEditLabel)}
          </SimpleButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
