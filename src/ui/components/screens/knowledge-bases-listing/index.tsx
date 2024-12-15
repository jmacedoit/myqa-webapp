
/*
 * Module dependencies.
 */

import { CircularProgress } from '@mui/material';
import { Col, Row, useScreenClass } from 'react-grid-system';
import { StandardContentTitle } from 'src/ui/components/layout/standard-content-title';
import { WisdomLevel } from 'src/types/answer';
import { getKnowledgeBases } from 'src/services/backend/knowledge-bases';
import { halfSpacing } from './knowledge-base-container';
import { routes } from 'src/ui/routes';
import { selectActiveOrganizationKnowledgeBases, setKnowledgeBasesAction } from 'src/state/slices/data';
import { translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useAppDispatch, useAppSelector } from 'src/ui/hooks/redux';
import { useAuthenticationHandler } from 'src/ui/hooks/authentication';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import KnowledgeBaseAdder from './knowledge-base-adder';
import KnowledgeBaseDisplay from './knowledge-base-display';
import QuestionBar from 'src/ui/components/question-bar';
import React from 'react';
import StandardPage from 'src/ui/components/layout/standard-page';
import styled from 'styled-components';

/*
 * Styles.
 */

const KnowledgeBasesContainer = styled.div`
  margin-left: -${halfSpacing}px;
  margin-right: -${halfSpacing}px;
`;

/*
 * KnowledgeBases.
 */

function KnowledgeBasesListingScreen() {
  const { t } = useTranslation();
  const { handleAuthenticatedRequest } = useAuthenticationHandler();
  const dispatch = useAppDispatch();
  const knowledgeBases = useAppSelector(selectActiveOrganizationKnowledgeBases);
  const navigate = useNavigate();
  const { isLoading } = useQuery('knowledgeBases', async () => {
    const knowledgeBases = await handleAuthenticatedRequest(() => getKnowledgeBases());

    dispatch(setKnowledgeBasesAction(knowledgeBases));
  });

  const screenClass = useScreenClass();
  const gridForBreakpoints = {
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 3,
    xxl: 3
  };

  const renderedKnowledgeBases = knowledgeBases.map(knowledgeBase => (
    <KnowledgeBaseDisplay
      inGridOf={gridForBreakpoints[screenClass]}
      key={knowledgeBase.id}
      knowledgeBase={knowledgeBase}
    />
  ));

  return (
    <>
      <StandardPage>
        <Row>
          <Col xs={12}>
            <QuestionBar
              handleSubmit={(question: string, knowledgeBaseId: string, language: string | undefined, wisdomLevel: WisdomLevel) => {
                navigate(routes.answers, {
                  state: {
                    question,
                    knowledgeBaseId,
                    language,
                    wisdomLevel
                  }
                });
              }}
              titled
              topAligned
            />

            <StandardContentTitle>
              {t(translationKeys.screens.knowledgeBases.title)}
            </StandardContentTitle>

            <KnowledgeBasesContainer>
              {isLoading ? (
                <div style={{ padding: units(4), textAlign: 'center' }}>
                  <CircularProgress />
                </div>
              ) : [
                (
                  <KnowledgeBaseAdder
                    inGridOf={gridForBreakpoints[screenClass]}
                    key={'_ADDER_'}
                  />
                ),
                ...renderedKnowledgeBases
              ]}
            </KnowledgeBasesContainer>
          </Col>
        </Row>
      </StandardPage>
    </>
  );
}

export default React.memo(KnowledgeBasesListingScreen);
