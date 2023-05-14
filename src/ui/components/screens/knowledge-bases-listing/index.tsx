
/*
 * Module dependencies.
 */

import { CircularProgress } from '@mui/material';
import { Col, Container, Row } from 'react-grid-system';
import { getKnowledgeBases } from 'src/services/backend/knowledge-bases';
import { selectActiveOrganizationKnowledgeBases, setKnowledgeBasesAction } from 'src/state/slices/data';
import { translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useAppDispatch, useAppSelector } from 'src/ui/hooks/redux';
import { useAuthenticationHandler } from 'src/ui/hooks/authentication';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import KnowledgeBaseAdder from './knowledge-base-adder';
import KnowledgeBaseComponent from './knowledge-base';
import QuestionBar from 'src/ui/components/question-bar';
import React from 'react';
import Type from 'src/ui/styles/type';
import styled from 'styled-components';

/*
 * Styles.
 */

const StyledContainer = styled(Container)`
`;

const KnowledgeBasesContainer = styled.div`
  margin-left: -${units(1)}px;
  margin-right: -${units(1)}px;
`;

/*
 * KnowledgeBases.
 */

function KnowledgeBasesListingScreen() {
  const { t } = useTranslation();
  const { handleAuthenticatedRequest } = useAuthenticationHandler();
  const dispatch = useAppDispatch();
  const knowledgeBases = useAppSelector(selectActiveOrganizationKnowledgeBases);
  const { isLoading } = useQuery('knowledgeBases', async () => {
    const knowledgeBases = await handleAuthenticatedRequest(() => getKnowledgeBases());

    dispatch(setKnowledgeBasesAction(knowledgeBases));
  });

  const renderedKnowledgeBases = knowledgeBases.map(knowledgeBase => (
    <KnowledgeBaseComponent
      key={knowledgeBase.id}
      knowledgeBase={knowledgeBase}
    />
  ));

  return (
    <>
      <StyledContainer>
        <Row>
          <Col xs={12}>
            <QuestionBar />

            <Type.H3>
              {t(translationKeys.screens.knowledgeBases.title)}
            </Type.H3>

            <KnowledgeBasesContainer>
              {isLoading ?
                <CircularProgress /> :
                [...renderedKnowledgeBases, <KnowledgeBaseAdder key={'_ADDER_'} />]
              }
            </KnowledgeBasesContainer>
          </Col>
        </Row>
      </StyledContainer>
    </>
  );
}

export default React.memo(KnowledgeBasesListingScreen);
