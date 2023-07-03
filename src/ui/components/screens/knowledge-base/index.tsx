
/*
 * Module dependencies.
 */

import { CircularProgress, Dialog, IconButton } from '@mui/material';
import { Col, Row } from 'react-grid-system';
import { DialogBodyContainer } from 'src/ui/components/layout/dialog-body-container';
import { StandardContentContainer } from 'src/ui/components/layout/standard-content-container';
import { StandardContentTitle } from 'src/ui/components/layout/standard-content-title';
import { deleteKnowledgeBase, getKnowledgeBases } from 'src/services/backend/knowledge-bases';
import {
  deleteKnowledgeBaseAction,
  deleteKnowledgeBaseResourceAction,
  selectKnowledgeBases,
  selectResources,
  setKnowledgeBaseResourcesAction,
  setKnowledgeBasesAction
} from 'src/state/slices/data';

import { KnowledgeBaseUpdater } from './knowledge-base-updater';
import { addNotification } from 'src/state/slices/ui';
import { deleteKnowledgeBaseResource, getKnowledgeBaseResources } from 'src/services/backend/resources';
import { getTree } from 'src/ui/utils/trees';
import { isEmpty, isNil } from 'lodash';
import { palette } from 'src/ui/styles/colors';
import { routes } from 'src/ui/routes';
import { staticUri } from 'src/utils/environment';
import { styled as styledMaterial } from '@mui/material/styles';
import { translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useAppDispatch, useAppSelector } from 'src/ui/hooks/redux';
import { useAuthenticationHandler } from 'src/ui/hooks/authentication';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import QuestionBar from 'src/ui/components/question-bar';
import React, { useState } from 'react';
import ResourceAdder from './resource-adder';
import SimpleButton from 'src/ui/components/buttons/simple-button';
import StandardPage from 'src/ui/components/layout/standard-page';
import Type from 'src/ui/styles/type';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import styled from 'styled-components';
import utc from 'dayjs/plugin/utc';

/*
 * Configure dayjs.
 */

dayjs.extend(relativeTime);
dayjs.extend(utc);

/*
 * Styles.
 */

const StyledStandardContentContainer = styled(StandardContentContainer)`
  z-index: 10;
`;

const ResourcesContainer = styled.div`
  margin-bottom: ${units(4)}px;
`;

const ResourceItem = styled.div`
  align-items: center;
  color: ${palette.extraDarkGreen};
  background-color: ${palette.lightGreen};
  border-radius: ${units(2)}px;
  display: flex;
  margin-bottom: ${units(1)}px;
  padding: ${units(2)}px;
`;

const ResourceInfo = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const ResourceActions = styled.div`
`;

const TitleContainer = styled.div`
  min-height: ${units(14)}px;
  margin-top: ${units(-5)}px;
  display: flex;
  align-items: flex-end;
  z-index: 1;
`;

const Tree = styled.img`
  width: 120px;
  height: 100%;
  margin-bottom: ${units(-1)}px;
  margin-right: ${units(-1.5)}px;
  margin-left: ${units(-2)}px;
`;

const StyledSimpleButton = styledMaterial(SimpleButton)`
  margin-right: ${units(1)}px;
`;

/*
 * Export KnowledgeBaseScreen.
 */

function KnowledgeBaseScreen() {
  const { t } = useTranslation();
  const { handleAuthenticatedRequest } = useAuthenticationHandler();
  const navigate = useNavigate();
  const [addResourceDialogOpen, setAddResourceDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { knowledgeBaseId: knowledgeBaseIdFromParams } = useParams();
  const knowledgeBaseId = knowledgeBaseIdFromParams ?? '';
  const knowledgeBase = useAppSelector(selectKnowledgeBases).find(knowledgeBase => knowledgeBase.id === knowledgeBaseId);
  const resources = useAppSelector(selectResources(knowledgeBaseId as string));
  const { isFetched, isLoading } = useQuery('knowledgeBaseResources', async () => {
    const getKnowledgeBasesPromise = handleAuthenticatedRequest(() => getKnowledgeBases());
    const resources = await handleAuthenticatedRequest(() => getKnowledgeBaseResources(knowledgeBaseId as string));

    const knowledgeBases = await getKnowledgeBasesPromise;

    if (!isNil(resources) && !isNil(knowledgeBaseId)) {
      dispatch(setKnowledgeBaseResourcesAction({ knowledgeBaseId, resources }));
      dispatch(setKnowledgeBasesAction(knowledgeBases));
    }
  });

  const resourceRemoval = useMutation('deleteResource', async (resourceRemovalData: { knowledgeBaseId: string, resourceId: string }) => {
    await deleteKnowledgeBaseResource(resourceRemovalData.knowledgeBaseId, resourceRemovalData.resourceId);

    dispatch(deleteKnowledgeBaseResourceAction(resourceRemovalData));
  });

  const knowledgeBaseRemoval = useMutation('deleteKnowledgeBase', async (knowledgeBaseId: string) => {
    await deleteKnowledgeBase(knowledgeBaseId);

    dispatch(deleteKnowledgeBaseAction(knowledgeBaseId));

    dispatch(addNotification({
      message: t(translationKeys.screens.knowledgeBase.deleteKnowledgeBaseSuccessMessage),
      type: 'success'
    }));

    navigate(routes.knowledgeBasesListing);
  });

  const handleOpenAddResourceDialog = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();

    setAddResourceDialogOpen(true);
  };

  const handleCloseAddResourceDialog = () => {
    setAddResourceDialogOpen(false);
  };

  const handleOpenEditDialog = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();

    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleDeleteKnowledgeBase = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();

    await knowledgeBaseRemoval.mutateAsync(knowledgeBaseId);
  };

  const handleDeleteResource = (resourceId: string) => async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();

    if (isNil(knowledgeBaseId)) {
      return;
    }

    await resourceRemoval.mutateAsync({ knowledgeBaseId, resourceId });
  };

  return (
    <>
      <StandardPage>
        <Row>
          <Col xs={12}>
            <QuestionBar
              titled
              topAligned
            />

            <TitleContainer>
              {!!knowledgeBase && (<Tree src={staticUri(`assets/images/tree${getTree(knowledgeBase, 3)}.png`)} />)}

              <StandardContentTitle>
                {knowledgeBase?.name}
              </StandardContentTitle>
            </TitleContainer>

            <StyledStandardContentContainer>
              <Type.H4>
                {t(translationKeys.screens.knowledgeBase.resourcesTitle)}
              </Type.H4>

              <ResourcesContainer>
                <div style={{ marginBottom: units(2) }}>
                  {isLoading ?
                    <CircularProgress /> :
                    (resources || []).map(resource => (
                      <ResourceItem key={resource.id}>
                        <ResourceInfo>
                          <Type.Paragraph style={{ marginBottom: units(1) }}>
                            {resource.metadata.fileName}
                          </Type.Paragraph>

                          <Type.Small style={{ marginBottom: 0 }}>
                            {`${t(translationKeys.screens.knowledgeBases.resourceDatePrefix)} `}

                            <b>
                              {dayjs(resource.createdAt).local().fromNow()}
                            </b>
                          </Type.Small>
                        </ResourceInfo>

                        <ResourceActions>
                          <IconButton
                            onClick={handleDeleteResource(resource.id)}
                            sx={{ color: 'inherit' }}
                          >
                            {resourceRemoval.isLoading ? <CircularProgress size={25} /> : <DeleteOutlineIcon />}
                          </IconButton>
                        </ResourceActions>
                      </ResourceItem>
                    ))}
                </div>

                {isFetched && isEmpty(resources) && (
                  <Type.Paragraph>
                    {t(translationKeys.screens.knowledgeBase.noResourcesMessage)}
                  </Type.Paragraph>
                )}

                <div>
                  <StyledSimpleButton
                    filled
                    onClick={handleOpenAddResourceDialog}
                  >
                    {t(translationKeys.screens.knowledgeBase.addResourceButton)}
                  </StyledSimpleButton>
                </div>
              </ResourcesContainer>

              <Type.H4>
                {t(translationKeys.screens.knowledgeBase.actionsTitle)}
              </Type.H4>

              <div>
                <StyledSimpleButton
                  filled
                  onClick={handleOpenEditDialog}
                >
                  {t(translationKeys.screens.knowledgeBase.editName)}
                </StyledSimpleButton>

                <StyledSimpleButton
                  filled
                  loading={knowledgeBaseRemoval.isLoading}
                  onClick={handleDeleteKnowledgeBase}
                >
                  {t(translationKeys.screens.knowledgeBase.deleteKnowledgeBase)}
                </StyledSimpleButton>
              </div>

            </StyledStandardContentContainer>
          </Col>
        </Row>
      </StandardPage>

      <Dialog
        PaperComponent={DialogBodyContainer}
        fullWidth
        maxWidth={'xs'}
        onClose={handleCloseAddResourceDialog}
        open={addResourceDialogOpen}
      >
        <ResourceAdder onResourceAdded={handleCloseAddResourceDialog} />
      </Dialog>

      <Dialog
        PaperComponent={DialogBodyContainer}
        fullWidth
        maxWidth={'xs'}
        onClose={handleCloseEditDialog}
        open={editDialogOpen}
      >
        <KnowledgeBaseUpdater
          knowledgeBaseId={knowledgeBaseId}
          onKnowledgeBaseUpdated={handleCloseEditDialog}
        />
      </Dialog>
    </>
  );
}

export default React.memo(KnowledgeBaseScreen);
