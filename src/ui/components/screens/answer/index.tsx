
/*
 * Module dependencies.
 */

import { Col, Container, Row } from 'react-grid-system';
import { requestAnswer } from 'src/services/backend/answers';
import { routes } from 'src/ui/routes';
import { units } from 'src/ui/styles/dimensions';
import { useMutation } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AnswerLoader from './answer-loader';
import React, { useEffect } from 'react';
import Type from 'src/ui/styles/type';
import styled from 'styled-components';

/*
 * Styles.
 */

const StyledContainer = styled(Container)`
  padding-top: ${units(10)}px;
`;

/*
 * Export Answer.
 */

function AnswerScreen() {
  const [searchParams] = useSearchParams();
  const question = searchParams.get('question');
  const knowledgeBaseId = searchParams.get('knowledgeBaseId');
  const navigate = useNavigate();
  const answerRequest = useMutation('answerRequest', async (questionData: { question: string, knowledgeBaseId: string }) => {
    const answer = await requestAnswer(questionData.question, questionData.knowledgeBaseId);

    return answer;
  });

  if (!question || !knowledgeBaseId) {
    navigate(routes.knowledgeBasesListing);
  }

  useEffect(() => {
    answerRequest.mutate({ question: question as string, knowledgeBaseId: knowledgeBaseId as string });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledContainer>
      <Row>
        <Col xs={12}>
          <Type.H3>{question}</Type.H3>

          {answerRequest.isLoading ? (
            <AnswerLoader />
          ) : (
            <Type.Paragraph>
              {answerRequest.data?.answer}
            </Type.Paragraph>
          )}
        </Col>
      </Row>
    </StyledContainer>
  );
}

export default React.memo(AnswerScreen);
