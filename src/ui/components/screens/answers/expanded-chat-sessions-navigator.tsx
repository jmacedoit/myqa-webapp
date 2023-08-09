
/*
 * Module dependencies.
 */

import { ButtonBase, CircularProgress, IconButton } from '@mui/material';
import { ChatSession } from 'src/types/chat';
import { DialogBodyContainer } from '../../layout/dialog-body-container';
import { palette } from 'src/ui/styles/colors';
import { styled as styledMaterial } from '@mui/material/styles';
import { translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { useTranslation } from 'react-i18next';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import React from 'react';
import Type from 'src/ui/styles/type';

/*
 * Types.
 */

/*
 * Styles.
 */

const ChatSessionItem = styledMaterial(ButtonBase)`
  justify-content: flex-start;
  width: 100%;
  align-items: center;
  color: ${palette.extraDarkGreen};
  background-color: ${palette.lightGreen};
  border-radius: ${units(2)}px;
  display: flex;
  margin-bottom: ${units(1)}px;
  padding: ${units(2)}px;

  &:hover {
    background-color: ${palette.oliveGreenDark};
  }
`;

/*
 * Utils.
 */

function groupChatSessionsByMonthAndYear(chatSessions: ChatSession[]): { [monthYear: string]: ChatSession[] } {
  const chatSessionsByMonthAndYear: { [monthYear: string]: ChatSession[] } = {};

  for (const chatSession of chatSessions) {
    const updatedAtDate = new Date(chatSession.updatedAt);
    const monthYear = new Date(updatedAtDate.getFullYear(), updatedAtDate.getMonth());

    if (!chatSessionsByMonthAndYear[monthYear.toISOString()]) {
      chatSessionsByMonthAndYear[monthYear.toISOString()] = [];
    }

    chatSessionsByMonthAndYear[monthYear.toISOString()].push(chatSession);
  }

  return chatSessionsByMonthAndYear;
}

/*
 * Export SourcesDisplayer.
 */

function ExpandedChatSessionsNavigator(props: {
  activeChatSessionId: string | null,
  chatSessions: ChatSession[],
  loadingMore: boolean,
  onLoadMoreChatSessions: () => void,
  onSelectChatSession: (chatSessionId: string) => void,
  onRemoveChatSession: (chatSessionId: string) => void
}) {
  const { i18n, t } = useTranslation();
  const chatSessionsByMonthAndYear = groupChatSessionsByMonthAndYear(props.chatSessions);
  const currentLanguage = i18n.language;
  const lastUpdatedFormater = new Intl.DateTimeFormat(currentLanguage, {
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: 'numeric'
  });

  const scrollRef: React.RefObject<HTMLDivElement> = useBottomScrollListener(props.onLoadMoreChatSessions);

  return (
    <DialogBodyContainer ref={scrollRef}>
      <Type.H4>
        {t(translationKeys.screens.chatSessions.title)}
      </Type.H4>

      {Object.keys(chatSessionsByMonthAndYear).map(monthYear => (
        <div key={monthYear}>
          <Type.Paragraph style={{ fontWeight: 500 }}>
            {new Date(monthYear).toLocaleDateString(currentLanguage, { month: 'long', year: 'numeric' })}
          </Type.Paragraph>

          {chatSessionsByMonthAndYear[monthYear].map((chatSession, index) => (
            <ChatSessionItem
              key={chatSession.id}
              onClick={() => props.onSelectChatSession(chatSession.id)}
              style={index !== chatSessionsByMonthAndYear[monthYear].length - 1 ? {} : { marginBottom: units(4) }}
            >
              <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                <Type.Paragraph style={{ flex: 1, textAlign: 'left', marginBottom: units(1) }}>
                  {chatSession.metadata.lastUserMessage ? chatSession.metadata.lastUserMessage.content : t(translationKeys.chatSessionNavigator.emptyChatLabel)}
                </Type.Paragraph>

                <Type.XSmall style={{ flex: 1, textAlign: 'left', margin: 0 }}>
                  {lastUpdatedFormater.format(new Date(chatSession.updatedAt))}
                </Type.XSmall>
              </div>

              <IconButton
                onClick={event => {
                  event.stopPropagation();

                  props.onRemoveChatSession(chatSession.id);
                }}
                sx={{ color: 'inherit' }}
              >
                <PlaylistRemoveIcon sx={{ fontSize: '1.2rem' }} />
              </IconButton>
            </ChatSessionItem>
          ))}

          {props.loadingMore && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: units(2) }}>
              <CircularProgress />
            </div>
          )}
        </div>
      ))}
    </DialogBodyContainer>
  );
}

export default React.memo(ExpandedChatSessionsNavigator);
