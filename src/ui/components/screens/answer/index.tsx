
/*
 * Module dependencies.
 */

import { Col, Container, Row } from 'react-grid-system';
import { io } from 'socket.io-client';
import { requestAnswer } from 'src/services/backend/answers';
import { routes } from 'src/ui/routes';
import { units } from 'src/ui/styles/dimensions';
import { useMutation } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AnswerLoader from './answer-loader';
import React, { useEffect, useRef, useState } from 'react';
import Type from 'src/ui/styles/type';
import config from 'src/config';
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
  const [partialAnswer, setPartialAnswer] = useState('');
  const [currentQuestionReference, setCurrentQuestionReference] = useState('');
  const partialAnswerRef = useRef(partialAnswer);
  const currentQuestionReferenceRef = useRef(currentQuestionReference);
  const question = searchParams.get('question');
  const knowledgeBaseId = searchParams.get('knowledgeBaseId');
  const navigate = useNavigate();
  const answerRequest = useMutation('answerRequest', async (questionData: { question: string, knowledgeBaseId: string }) => {
    const randomString = Math.random().toString(36).substring(2);

    setCurrentQuestionReference(randomString);
    setPartialAnswer('');

    const answer = await requestAnswer(questionData.question, questionData.knowledgeBaseId, randomString);

    return answer;
  });

  if (!question || !knowledgeBaseId) {
    navigate(routes.knowledgeBasesListing);
  }

  React.useEffect(() => {
    partialAnswerRef.current = partialAnswer;
  }, [partialAnswer]);

  React.useEffect(() => {
    currentQuestionReferenceRef.current = currentQuestionReference;
  }, [currentQuestionReference]);

  useEffect(() => {
    const socket = io(config.backend.baseUri, {
      withCredentials: true
    });

    socket.on('answer_token', (data: { questionReference: string, token: string }) => {
      if (data.questionReference === currentQuestionReferenceRef.current) {
        setPartialAnswer(partialAnswerRef.current + data.token);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    answerRequest.mutate({ question: question as string, knowledgeBaseId: knowledgeBaseId as string });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledContainer>
      <Row>
        <Col xs={12}>
          <Type.H3>{question}</Type.H3>

          {answerRequest.isLoading && partialAnswer === '' ? (
            <AnswerLoader />
          ) : (
            <Type.Paragraph>
              {answerRequest?.data?.answer ?? partialAnswer}
            </Type.Paragraph>
          )}
        </Col>
      </Row>
    </StyledContainer>
  );
}

export default React.memo(AnswerScreen);
