
/*
 * Module dependencies.
 */

import { ButtonProps } from '@mui/material';
import { ChatSession } from 'src/types/chat';
import { ScreenClass, useScreenClass } from 'react-grid-system';
import { palette } from 'src/ui/styles/colors';
import { properties } from 'src/utils/types';
import { styled as styledMaterial } from '@mui/material/styles';
import { translationKeys } from 'src/translations';
import { truncate } from 'lodash';
import { units } from 'src/ui/styles/dimensions';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import ButtonBase from 'src/ui/components/buttons/button-base';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import React from 'react';
import Type from 'src/ui/styles/type';
import breakpoints from 'src/ui/styles/breakpoints';
import styled from 'styled-components';

/*
 * Styles.
 */

const Container = styled.div`
  padding: ${units(1)}px 0;
  display: flex;
  flex-direction: row;
`;

const ChatSessionButtonsContainer = styled.div`
  display: flex;
  flex: 1;
  overflow-x: auto;
  white-space: nowrap;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const ChatSessionButton = styledMaterial(ButtonBase)<ButtonProps & { isActive?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;
  background-color: ${props => props.isActive ? palette.neonGreen : 'transparent'};
  border-radius: ${units(3)}px;
  color: ${props => props.isActive ? palette.extraDarkGreen : palette.neonGreen};
  font-size: 1rem;
  font-style: normal;
  font-weight: normal;
  letter-spacing: -0.05em;
  line-height: 1.3333
  padding-left: ${units(1)}px ${units(2)}px;

  &:hover {
    background-color: ${props => props.isActive ? palette.neonGreen : 'transparent'};
  }
`;

const HistoryButton = styledMaterial(ChatSessionButton)`
  background-color: ${palette.oliveGreenDark};
  color: ${palette.extraDarkGreen};

  &:hover {
    background-color: ${palette.oliveGreen};
  }
`;

const AddChatSessionButton = styledMaterial(ChatSessionButton)`
  align-items: center;
  background-color: ${palette.oliveGreenDark};
  border-radius: 50%;
  color: ${palette.extraDarkGreen};
  display: inline-flex;
  height: ${units(4)}px;
  justify-content: center;
  margin-right: ${units(1.25)}px;
  padding: 0;
  width: ${units(4)}px;

  &:hover {
    background-color: ${palette.oliveGreen};
  }
`;

const RemoveButtonContainer = styled.div`
  position: relative;
  display: inline-flex;
  position: relative;
  width: ${units(2.5)}px;
  height: ${units(2.5)}px;
  margin-left: ${units(1)}px;
`;

const RemoveButton = styledMaterial(ButtonBase)`
  position: absolute;
  top: -3px;
  right: -3px;
  left: -3px;
  bottom: -3px;
  border-radius: 50%;
  padding: 2px;

  &:hover {
    background-color: ${palette.lightNeonGreen};
  }
`;

/*
 * Export ChatSessionsNavigator.
 */

function ChatSessionsNavigator(props: {
  chatSessions: ChatSession[],
  activeChatSessionId: string | null,
  onSelectChatSession: (chatSessionId: string) => void,
  onCreateChatSession: () => void,
  onRemoveChatSession: (chatSessionId: string) => void,
  onOpenHistory: () => void
}) {
  const { t } = useTranslation();
  const screenClass = useScreenClass();
  const chatSessionButtonsForScreenClass = {
    [properties<typeof breakpoints>(breakpoints).xs as ScreenClass]: 0,
    [properties<typeof breakpoints>(breakpoints).sm as ScreenClass]: 0,
    [properties<typeof breakpoints>(breakpoints).md as ScreenClass]: 3,
    [properties<typeof breakpoints>(breakpoints).lg as ScreenClass]: 6,
    [properties<typeof breakpoints>(breakpoints).xl as ScreenClass]: 8,
    [properties<typeof breakpoints>(breakpoints).xxl as ScreenClass]: 10
  };
  const chatSessionButtonsToShow = chatSessionButtonsForScreenClass[screenClass];

  return (
    <Container>
      <ChatSessionButtonsContainer>
        <AddChatSessionButton onClick={props.onCreateChatSession}>
          <AddIcon />
        </AddChatSessionButton>

        <div style={{ flex: 1 }}>
          {props.chatSessions.slice(0, chatSessionButtonsToShow).map(chatSession => (
            <ChatSessionButton
              isActive={props.activeChatSessionId === chatSession.id}
              key={chatSession.id}
              onClick={() => props.onSelectChatSession(chatSession.id)}
            >
              <Type.Small style={{ flex: 1, margin: 0 }}>
                {
                  chatSession.metadata.lastUserMessage ?
                    truncate(chatSession.metadata.lastUserMessage.content, { length: 20 }) :
                    t(translationKeys.chatSessionNavigator.emptyChatLabel)
                }
              </Type.Small>

              {props.activeChatSessionId === chatSession.id && (
                <RemoveButtonContainer>
                  <RemoveButton
                    onClick={event => {
                      event.stopPropagation();

                      props.onRemoveChatSession(chatSession.id);
                    }}
                  >
                    <PlaylistRemoveIcon sx={{ fontSize: '1.2rem' }} />
                  </RemoveButton>
                </RemoveButtonContainer>)}
            </ChatSessionButton>
          ))}
        </div>

        <div>
          <HistoryButton onClick={() => props.onOpenHistory()}>
            <Type.Small style={{ flex: 1, margin: 0 }}>
              {t(translationKeys.chatSessionNavigator.historyButton)}
            </Type.Small>
          </HistoryButton>
        </div>
      </ChatSessionButtonsContainer>
    </Container>
  );
}

export default React.memo(ChatSessionsNavigator);
