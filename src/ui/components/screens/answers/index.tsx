
/*
 * Module dependencies.
 */

import { AnswerSource, WisdomLevel } from 'src/types/answer';
import { Col, Row } from 'react-grid-system';
import { Dialog } from '@mui/material';
import { DialogBodyContainer } from 'src/ui/components/layout/dialog-body-container';
import { SenderType } from 'src/types/chat';
import { addChatSessionsAction, createChatSessionAction, deleteChatSessionAction, selectChatSession, selectChatSessions, setKnowledgeBasesAction } from 'src/state/slices/data';
import { createChatSession, deleteChatSession, getChatSessionWithMessages, getChatSessions } from 'src/services/backend/chat';
import { getKnowledgeBases } from 'src/services/backend/knowledge-bases';
import { io } from 'socket.io-client';
import { isEmpty, isNil, last, sortBy } from 'lodash';
import { requestAnswer } from 'src/services/backend/answers';
import { units } from 'src/ui/styles/dimensions';
import { useAppSelector } from 'src/ui/hooks/redux';
import { useAuthenticationHandler } from 'src/ui/hooks/authentication';
import { useDispatch } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { v4 as uuidv4 } from 'uuid';
import ChatSessionsNavigator from './chat-sessions-navigator';
import ExpandedChatSessionsNavigator from './expanded-chat-sessions-navigator';
import MessagesDisplayer, { MessageWithLoadingState } from './messages-displayer';
import QuestionBar from 'src/ui/components/question-bar';
import React, { useEffect, useRef, useState } from 'react';
import SourcesDisplayer from './sources-displayer';
import StandardPage from 'src/ui/components/layout/standard-page';
import config from 'src/config';
import qs from 'qs';
import styled from 'styled-components';
import useDimensions from 'react-cool-dimensions';

/*
 * Styles.
 */

const MessagesDisplayerContainer = styled.div<{ questionBarHeight: number }>`
  display: flex;
  flex-direction: column;
  min-height: 540px;
  height: calc(100vh - ${props => props.questionBarHeight}px - ${units(3)}px);
  padding: ${units(3)}px 0 ${units(0)}px 0;
`;

const DummyDialogContainer = styled.div``;

/*
 * Export Answer  .
 */

function AnswerScreen() {
  const [activeChatSessionId, setActiveChatSessionId] = useState<string | null>(null);
  const [placeholderQuestion, setPlaceholderQuestion] = useState<{ chatSessionId: string, message: MessageWithLoadingState } | null>(null);
  const [currentQuestionReference, setCurrentQuestionReference] = useState<string | null>(null);
  const [partialAnswer, setPartialAnswer] = useState('');
  const [messageIdToDisplaySources, setMessageIdToDisplaySources] = useState(null as string | null);
  const [sourcesToDisplay, setSourcesToDisplay] = useState([] as AnswerSource[]);
  const [answerForSourcesToDisplay, setAnswerForSourcesToDisplay] = useState(undefined as string | undefined);
  const [historyDialogIsOpen, setHistoryDialogIsOpen] = useState(false);
  const partialAnswerRef = useRef(partialAnswer);
  const currentQuestionReferenceRef = useRef(currentQuestionReference);
  const { state } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const knowledgeBaseIdFromState = state?.knowledgeBaseId as string;
  const questionFromState = state?.question;
  const languageFromState = state?.language;
  const wisdomLevelFromState = state?.wisdomLevel;
  const queryChatSessionId = searchParams.get('chatSessionId');
  const activeChatSession = useAppSelector(selectChatSession(activeChatSessionId ?? ''));
  const chatSessions = useAppSelector(state => selectChatSessions(state));
  const dispatch = useDispatch();

  const { handleAuthenticatedRequest } = useAuthenticationHandler();

  useQuery('knowledgeBases', async () => {
    const knowledgeBases = await handleAuthenticatedRequest(() => getKnowledgeBases());

    dispatch(setKnowledgeBasesAction(knowledgeBases));
  });

  const lastChatSessionDate = last(chatSessions)?.updatedAt;
  const chatSessionsRetrieval = useQuery(['chatSessions', lastChatSessionDate], async ({ queryKey }) => {
    const [, chatSessionBeforeDateToQuery] = queryKey as [string, string];

    const chatSessions = await handleAuthenticatedRequest(() => getChatSessions(chatSessionBeforeDateToQuery));

    dispatch(addChatSessionsAction(chatSessions));
  }, { enabled: false });

  const chatSessionRetrieval = useQuery(['chatSessionRetrieval', activeChatSessionId], async ({ queryKey }) => {
    const [, chatSessionIdToQuery] = queryKey as [string, string];

    if (chatSessionIdToQuery) {
      const chatSession = await getChatSessionWithMessages(chatSessionIdToQuery);

      dispatch(createChatSessionAction(chatSession));
    }
  }, { enabled: false });

  const chatSessionCreation = useMutation('chatSessionCreation', async () => {
    const response = await createChatSession();

    dispatch(createChatSessionAction(response));

    setActiveChatSessionId(response.id);

    await chatSessionRetrieval.refetch();

    return response;
  });

  const chatSessionRemoval = useMutation('chatSessionRemoval', async (chatSessionId: string) => {
    await handleAuthenticatedRequest(() => deleteChatSession(chatSessionId));

    if (activeChatSessionId === chatSessionId) {
      setActiveChatSessionId(chatSessions?.find(chatSession => chatSession.id !== chatSessionId)?.id ?? null);
    }

    dispatch(deleteChatSessionAction(chatSessionId));
  });

  const answerRequest = useMutation(
    'answerRequest',
    async (questionData: {
      question: string,
      knowledgeBaseId: string,
      chatSessionId: string,
      language?: string,
      wisdomLevel: WisdomLevel
    }) => {
      const generatedQuestionReference = Math.random().toString(36).substring(2);

      setCurrentQuestionReference(generatedQuestionReference);
      setPartialAnswer('');

      const answer = await requestAnswer({
        question: questionData.question,
        knowledgeBaseId: questionData.knowledgeBaseId,
        chatSessionId: questionData.chatSessionId,
        questionReference: generatedQuestionReference,
        language: questionData.language,
        wisdomLevel: questionData.wisdomLevel
      });

      return answer;
    }
  );

  React.useEffect(() => {
    chatSessionsRetrieval.refetch();
  }, []);

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
    if (!isNil(activeChatSessionId) && !isEmpty(activeChatSession)) {
      setSearchParams(qs.stringify({ chatSessionId: activeChatSessionId }), { replace: true });
    }

    async function refetchAndScroll() {
      await chatSessionRetrieval.refetch();

      setTimeout(() => {
        document.getElementById('last-message')?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }, 100);
    }

    refetchAndScroll();
  }, [activeChatSessionId]);

  useEffect(() => {
    const prepareData = async () => {
      if (queryChatSessionId) {
        setActiveChatSessionId(queryChatSessionId);
      } else if (questionFromState && knowledgeBaseIdFromState) {
        const chatSessionCreationResult = await chatSessionCreation.mutateAsync();

        setPlaceholderQuestion({
          chatSessionId: chatSessionCreationResult.id,
          message: {
            content: questionFromState,
            createdAt: new Date().toISOString(),
            id: uuidv4(),
            payload: {
              knowledgeBaseId: knowledgeBaseIdFromState
            },
            sender: SenderType.User,
            updatedAt: new Date().toISOString()
          }
        });

        await answerRequest.mutateAsync({
          question: questionFromState,
          knowledgeBaseId: knowledgeBaseIdFromState,
          chatSessionId: chatSessionCreationResult.id,
          language: languageFromState,
          wisdomLevel: wisdomLevelFromState
        });

        await chatSessionRetrieval.refetch();

        setPlaceholderQuestion(null);
      }
    };

    prepareData();
  }, []);

  useEffect(() => {
    if (!activeChatSessionId && !questionFromState && chatSessions.length > 0) {
      setActiveChatSessionId(chatSessions[0].id);
    }
  }, [chatSessions]);

  const handleNewChatSession = async () => {
    const chatSessionCreationResult = await chatSessionCreation.mutateAsync();

    setActiveChatSessionId(chatSessionCreationResult.id);
  };

  const handleRemoveChatSession = async (chatSessionId: string) => {
    await chatSessionRemoval.mutateAsync(chatSessionId);
  };

  const handleSubmitQuestion = async (question: string, knowledgeBaseId: string, language: string | undefined, wisdomLevel: WisdomLevel) => {
    setPlaceholderQuestion({
      chatSessionId: activeChatSession.id,
      message: {
        content: question,
        createdAt: new Date().toISOString(),
        id: uuidv4(),
        payload: {
          knowledgeBaseId
        },
        sender: SenderType.User,
        updatedAt: new Date().toISOString()
      }
    });

    setTimeout(() => {
      document.getElementById('last-message')?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 100);

    await answerRequest.mutateAsync({
      question,
      knowledgeBaseId,
      chatSessionId: activeChatSession.id,
      language,
      wisdomLevel
    });

    await chatSessionRetrieval.refetch();

    setPlaceholderQuestion(null);
  };

  const handleShowSources = (answer: string | undefined, messageId: string, sources: AnswerSource[]) => {
    setMessageIdToDisplaySources(messageId);
    setSourcesToDisplay(sources);
    setAnswerForSourcesToDisplay(answer);
  };

  const handleCloseSourcesDialog = () => {
    setMessageIdToDisplaySources(null);
    setSourcesToDisplay([]);
  };

  const handleSelectChatSession = (chatSessionId: string) => {
    setActiveChatSessionId(chatSessionId);

    setHistoryDialogIsOpen(false);
  };

  const handleCloseHistoryDialog = () => {
    setHistoryDialogIsOpen(false);
  };

  const handleLoadMoreChatSessions = async () => {
    await chatSessionsRetrieval.refetch();
  };

  const { height: questionBarHeight, observe: observeRef } = useDimensions({
    onResize: ({ observe, unobserve }) => {
      unobserve();
      observe();
    }
  });

  const chatMessagesToDisplay = [
    ...sortBy(activeChatSession?.chatMessages, message => message.createdAt) ?? []
  ] as MessageWithLoadingState[];

  if (!isNil(placeholderQuestion) && placeholderQuestion.chatSessionId === activeChatSessionId) {
    const placeholderAnswerMessage = {
      content: partialAnswer,
      createdAt: new Date().toISOString(),
      id: uuidv4(),
      payload: {
        knowledgeBaseId: knowledgeBaseIdFromState,
        questionMessageId: placeholderQuestion?.message.id
      },
      sender: SenderType.AiEngine,
      updatedAt: new Date().toISOString(),
      isLoading: partialAnswer === ''
    };

    chatMessagesToDisplay.push(placeholderQuestion.message);
    chatMessagesToDisplay.push(placeholderAnswerMessage);
  }

  return (
    <>
      <StandardPage>
        <Row>
          <Col xs={12}>
            <MessagesDisplayerContainer questionBarHeight={questionBarHeight}>
              <MessagesDisplayer
                messages={chatMessagesToDisplay}
                onDisplaySources={handleShowSources}
              />

              <ChatSessionsNavigator
                activeChatSessionId={activeChatSessionId}
                chatSessions={chatSessions}
                onCreateChatSession={handleNewChatSession}
                onOpenHistory={() => setHistoryDialogIsOpen(true)}
                onRemoveChatSession={handleRemoveChatSession}
                onSelectChatSession={chatSessionId => setActiveChatSessionId(chatSessionId)}
              />
            </MessagesDisplayerContainer>

            <div ref={observeRef}>
              <QuestionBar
                defaultKnowledgeBaseId={knowledgeBaseIdFromState ?? last(chatMessagesToDisplay)?.payload?.knowledgeBaseId}
                handleSubmit={handleSubmitQuestion}
              />
            </div>
          </Col>
        </Row>
      </StandardPage>

      <Dialog
        PaperComponent={DialogBodyContainer}
        fullWidth
        maxWidth={'lg'}
        onClose={handleCloseSourcesDialog}
        open={!!messageIdToDisplaySources}
      >
        <SourcesDisplayer
          answer={answerForSourcesToDisplay}
          messageId={messageIdToDisplaySources}
          sources={sourcesToDisplay}
        />
      </Dialog>

      <Dialog
        PaperComponent={DummyDialogContainer}
        fullWidth
        maxWidth={'sm'}
        onClose={handleCloseHistoryDialog}
        open={historyDialogIsOpen}
      >
        <ExpandedChatSessionsNavigator
          activeChatSessionId={activeChatSessionId}
          chatSessions={chatSessions}
          loadingMore={chatSessionsRetrieval.isLoading}
          onLoadMoreChatSessions={handleLoadMoreChatSessions}
          onRemoveChatSession={handleRemoveChatSession}
          onSelectChatSession={handleSelectChatSession}
        />
      </Dialog>
    </>
  );
}

export default React.memo(AnswerScreen);
