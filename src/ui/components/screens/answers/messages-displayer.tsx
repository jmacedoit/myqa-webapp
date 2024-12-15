
/*
 * Module dependencies.
 */

import { AnswerSource } from 'src/types/answer';
import { Message, SenderType } from 'src/types/chat';
import { atelierEstuaryLight } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { getTreeById } from 'src/ui/utils/trees';
import { isNil, sortBy, uniq } from 'lodash';
import { palette } from 'src/ui/styles/colors';
import { selectActiveOrganizationKnowledgeBases } from 'src/state/slices/data';
import { staticUri } from 'src/utils/environment';
import { truncateFilename } from 'src/ui/utils';
import { units } from 'src/ui/styles/dimensions';
import { useAppSelector } from 'src/ui/hooks/redux';
import AnswerLoader from './answer-loader';
import React, { Suspense } from 'react';
import Type from 'src/ui/styles/type';
import breakpoints from 'src/ui/styles/breakpoints';
import styled from 'styled-components';

/*
 * Types.
 */

type QuestionAnswer = {
  question: MessageWithLoadingState,
  answer?: MessageWithLoadingState,
}

export type MessageWithLoadingState = Message & {
  isLoading?: boolean,
};

/*
 * Styles.
 */

const MessagesContainer = styled.div`
  background-color: ${palette.oliveGreen};
  border-radius: ${units(2)}px;
  box-shadow: 0px 4px 25px 5px rgba(4, 24, 18, 0.20), 0px 0px 75px 0px rgba(33, 47, 27, 0.20);
  flex: 1;
  padding: ${units(2)}px;
  overflow-y: auto;
  overscroll-behavior: contain;
`;

const MessageContainer = styled.div`
  background-color: ${palette.lightGreen};
  border-radius: ${units(2)}px;
  padding: ${units(3)}px;
`;

const TreeBackground = styled.div<{ color?: string }>`
  width: ${units(5)}px;
  justify-content: center;
  height: ${units(5)}px;
  display: flex;
  border-radius: 50%;
  background-color: ${props => props.color ?? palette.paleGreen};
  align-items: center;
`;

const Tree = styled.img`
  width: ${units(4)}px;
`;

const SourceTag = styled(Type.XSmall)`
  padding: ${units(0.5)}px ${units(1)}px;
  display: inline-block;
  background-color: ${palette.oliveGreen};
  border-radius: ${units(1)}px;
  margin: ${units(0.5)}px 0 ${units(0.5)}px ${units(1)}px;

  &:hover {
    cursor: pointer;
    background-color: ${palette.oliveGreenDark};
  }
`;

const SourceTagsContainer = styled.div`
  align-items: flex-end;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: flex-end;

  @media (min-width: ${breakpoints.sm}px) {
    flex-direction: row;
    align-items: center;
  }
`;

const Logo = styled.img`
  width: 120px;
`;

const AnswerContent = styled(Type.ParagraphSmall.withComponent('div'))`
  font-weight: 200;
  white-space: 'pre-line';

  table {
    border: 1px solid ${palette.oliveGreenDark};
    margin: auto;
    border-left: 0;
    border-collapse: separate;
    border-spacing: 0px;
    border-radius: ${units(2)}px;
  }

  thead {
    display: table-header-group;
    vertical-align: middle;
    border-color: inherit;
    border-collapse: separate;
  }

  tr {
    display:table-row;
    vertical-align: inherit;
    border-color: inherit;
  }

  th, td {
    padding: ${units(1)}px ${units(2)}px;
    vertical-align: top;
    border-left: 1px solid ${palette.oliveGreenDark};
  }

  td {
    border-top: 1px solid ${palette.oliveGreenDark};
  }

  thead:first-child tr:first-child th:first-child, tbody:first-child tr:first-child td:first-child {
    border-radius: ${units(2)}px 0 0 0;
  }

  thead:last-child tr:last-child th:first-child, tbody:last-child tr:last-child td:first-child {
    border-radius: 0 0 0 ${units(2)}px;
  }

  pre {
    padding: ${units(2)}px !important;
    border-radius: ${units(0.5)}px;
    background: ${palette.oliveGreenGrey} !important;
  }

  pre > code {
    font-family: Monaco, 'Roboto Mono', monospace;
    font-weight: 300;
    font-size: 0.8rem;
    line-height: 1;
  }

  code {
    font-family: Monaco, 'Roboto Mono', monospace;
    font-size: 0.8rem;
  }
`;

/*
 * Helpers.
 */

function getQuestionAnswers(messages: MessageWithLoadingState[]): QuestionAnswer[] {
  const questionAnswers: QuestionAnswer[] = messages
    .filter(message => message.sender === SenderType.User)
    .map(userMessage => {
      return {
        question: userMessage,
        answer: messages.find(message => message.sender === SenderType.AiEngine && message.payload?.questionMessageId === userMessage.id)
      };
    });

  return questionAnswers;
}

/*
 * MessagesDisplayer.
 */

const LazyMarkdown = React.lazy(() => import('markdown-to-jsx'));
const LazySyntaxHighlighter = React.lazy(() => import('react-syntax-highlighter'));

function MessagesDisplayer(props: {
  messages: Message[],
  lastMessageRef?: React.RefObject<HTMLDivElement>,
  onDisplaySources: (answer: string | undefined, messageId: string | undefined, sources: AnswerSource[]) => void
}) {
  const knowledgeBases = useAppSelector(selectActiveOrganizationKnowledgeBases);

  if (!props.messages) {
    return null;
  }

  const questionAnswers = getQuestionAnswers(props.messages);

  return (
    <MessagesContainer>
      {questionAnswers.length === 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Logo src={staticUri(`assets/images/myqa-logo-olive.png`)} />
        </div>
      )}

      {questionAnswers.map((questionAnswer, index) => {
        const knowledgeBase = knowledgeBases.find(knowledgeBase => knowledgeBase.id === questionAnswer.question?.payload.knowledgeBaseId);
        const sourcesWithGroupedPages: { fileName: string, pages: number[] }[] = [];

        for (const source of questionAnswer.answer?.payload.sources ?? []) {
          const sourceWithGroupedPages = sourcesWithGroupedPages.find(sourceWithGroupedPages => sourceWithGroupedPages.fileName === source.fileName);

          if (sourceWithGroupedPages) {
            if (!isNil(source.pageIndex)) {
              sourceWithGroupedPages.pages.push(source.pageIndex);

              sourceWithGroupedPages.pages = sortBy(uniq(sourceWithGroupedPages.pages), x => x);
            }
          } else {
            sourcesWithGroupedPages.push({
              fileName: source.fileName,
              pages: source.pageIndex ? [source.pageIndex] : []
            });
          }
        }

        return (
          <MessageContainer
            {...index === questionAnswers.length - 1 && { id: 'last-message' }}
            key={questionAnswer.question.id}
            style={{ marginBottom: index !== questionAnswers.length - 1 ? units(2) : 0 }}
          >
            <Type.ParagraphLarge style={{ marginBottom: units(2) }}>
              {questionAnswer.question.content}
            </Type.ParagraphLarge>

            {questionAnswer.answer?.isLoading && (
              <AnswerLoader />
            )}

            {!questionAnswer.answer?.isLoading && (
              <AnswerContent>
                <Suspense fallback={<div />}>
                  <LazyMarkdown
                    options={{
                      overrides: {
                        pre: {
                          component: props => {
                            return (
                              <LazySyntaxHighlighter style={atelierEstuaryLight}>
                                {props.children.props.children}
                              </LazySyntaxHighlighter>
                            );
                          }
                        }
                      }
                    }}
                  >
                    {questionAnswer.answer?.content ?? ''}
                  </LazyMarkdown>
                </Suspense>
              </AnswerContent>
            )}

            <div style={{ display: 'flex' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ paddingRight: `${units(1)}px` }}>
                  <TreeBackground>
                    <Tree src={staticUri(`assets/images/tree${getTreeById(knowledgeBase?.id as string)}-mini.png`)} />
                  </TreeBackground>
                </div>

                <Type.XSmall style={{ margin: 0, fontWeight: 400 }}>
                  {knowledgeBase?.name}
                </Type.XSmall>
              </div>

              <SourceTagsContainer>
                {sourcesWithGroupedPages.map(source => {
                  // trim source filename but leave extension
                  return (
                    <SourceTag
                      key={source.fileName}
                      onClick={() => props.onDisplaySources(questionAnswer?.answer?.content, questionAnswer?.answer?.id, questionAnswer.answer?.payload.sources ?? [])}
                    >
                      {truncateFilename(source.fileName, 24)}

                      {source.pages.length > 0 ? ` - ${source.pages.join(', ')}` : ''}
                    </SourceTag>
                  );
                })}
              </SourceTagsContainer>
            </div>
          </MessageContainer>
        );
      }
      )}
    </MessagesContainer>
  );
}

export default React.memo(MessagesDisplayer);
