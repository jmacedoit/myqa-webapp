
/*
 * Module dependencies.
 */

import { Button, CircularProgress, Dialog, IconButton, Paper } from '@mui/material';
import { Col, Container, Row } from 'react-grid-system';
import { Delete } from '@mui/icons-material';
import { deleteKnowledgeBaseResource, getKnowledgeBaseResources } from 'src/services/backend/resources';
import { deleteKnowledgeBaseResourceAction as deleteKnowledgeBaseResourceAction, selectKnowledgeBases, selectResources, setKnowledgeBaseResourcesAction, setKnowledgeBasesAction } from 'src/state/slices/data';
import { getKnowledgeBases } from 'src/services/backend/knowledge-bases';
import { isNil } from 'lodash';
import { translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useAppDispatch, useAppSelector } from 'src/ui/hooks/redux';
import { useAuthenticationHandler } from 'src/ui/hooks/authentication';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import QuestionBar from 'src/ui/components/question-bar';
import React, { useState } from 'react';
import ResourceAdder from './resource-adder';
import Shapes from './shapes';
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

const StyledContainer = styled(Container)`
`;

const ResourcesContainer = styled.div`
`;

const ResourceItem = styled.div`
  display: flex;
  padding: ${units(2)}px;
`;

const ResourceInfo = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const ResourceActions = styled.div`
`;

const ImageContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
`;

/*
 * Export KnowledgeBaseScreen.
 */

function KnowledgeBaseScreen() {
  const { t } = useTranslation();
  const { handleAuthenticatedRequest } = useAuthenticationHandler();
  const [addResourceDialogOpen, setAddResourceDialogOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { knowledgeBaseId } = useParams();
  const knowledgeBase = useAppSelector(selectKnowledgeBases).find(knowledgeBase => knowledgeBase.id === knowledgeBaseId);
  const resources = useAppSelector(selectResources(knowledgeBaseId as string));
  const { isLoading } = useQuery('knowledgeBaseResources', async () => {
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

  const handleDeleteResource = (resourceId: string) => async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();

    if (isNil(knowledgeBaseId)) {
      return;
    }

    await resourceRemoval.mutateAsync({ knowledgeBaseId, resourceId });
  };

  const handleCloseAddResourceDialog = () => {
    setAddResourceDialogOpen(false);
  };

  const handleOpeAddResourceDialog = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();

    setAddResourceDialogOpen(true);
  };

  return (
    <>
      <StyledContainer>
        <Row>
          <Col xs={12}>
            <QuestionBar />

            <Type.H3>
              {knowledgeBase?.name}
            </Type.H3>

            {
              !isNil(knowledgeBase) && (
                <ImageContainer>
                  <Shapes
                    knowledgeBaseId={knowledgeBase.id}
                    numberOfShapes={3}
                  />
                </ImageContainer>
              )
            }

            <Type.H4>
              {t(translationKeys.screens.knowledgeBase.resourcesTitle)}
            </Type.H4>

            <ResourcesContainer>
              {isLoading ?
                <CircularProgress /> :
                (
                  <Paper>
                    {(resources || []).map(resource => (
                      <ResourceItem key={resource.id}>
                        <ResourceInfo>
                          <div>{resource.metadata.fileName}</div>

                          <div>
                            <Type.Small>{`  ${t(translationKeys.screens.knowledgeBases.resourceDatePrefix)} ${dayjs(resource.createdAt).local().fromNow()}`} </Type.Small>
                          </div>
                        </ResourceInfo>

                        <ResourceActions>
                          <IconButton onClick={handleDeleteResource(resource.id)}>
                            {resourceRemoval.isLoading ? <CircularProgress size={25} /> : <Delete />}
                          </IconButton>
                        </ResourceActions>
                      </ResourceItem>
                    ))}
                  </Paper>
                )
              }
            </ResourcesContainer>

            <div style={{ marginTop: units(2) }}>
              <Button
                onClick={handleOpeAddResourceDialog}
                variant='contained'
              >
                {t(translationKeys.screens.knowledgeBase.addResourceButton)}
              </Button>
            </div>
          </Col>
        </Row>
      </StyledContainer>

      <Dialog
        fullWidth
        maxWidth={'lg'}
        onClose={handleCloseAddResourceDialog}
        open={addResourceDialogOpen}
      >
        <ResourceAdder onResourceAdded={handleCloseAddResourceDialog} />
      </Dialog>
    </>
  );
}

export default React.memo(KnowledgeBaseScreen);
