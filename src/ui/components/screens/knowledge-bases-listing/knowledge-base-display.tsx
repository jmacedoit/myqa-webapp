
/*
 * Module dependencies.
 */

import { KnowledgeBase } from 'src/types/knowledge-bases';
import { getTree } from 'src/ui/utils/trees';
import { routes } from 'src/ui/routes';
import { staticUri } from 'src/utils/environment';
import { translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import KnowledgeBaseContainer from './knowledge-base-container';
import React from 'react';
import Type from 'src/ui/styles/type';
import breakpoints from 'src/ui/styles/breakpoints';
import styled from 'styled-components';

/*
 * Styles.
 */

const HeightDummy = styled.div`
  padding-top: 100%;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${units(2)}px ${units(4)}px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Name = styled(Type.H5)`
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: ${units(1)}px;
  overflow-x: clip;
`;

const ImageContainer = styled.div`
  flex: 1;
  margin-bottom: 10%;
  position: relative;
`;

const InfoContainer = styled.div`
  padding-bottom: ${units(3)}px;
`;

const Tree = styled.img`
  width: 65%;

  @media (min-width: ${breakpoints.sm}px) {
    width: 55%;
  }

  @media (min-width: ${breakpoints.xl}px) {
    width: 65%;
  }
`;

const ImageSpacer = styled.div`
  padding-top: 61.22%;
`;

const TreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

/*
 * Knowledge base component.
 */

export default function KnowledgeBaseDisplay({ inGridOf, knowledgeBase }: { inGridOf: number, knowledgeBase: KnowledgeBase }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <KnowledgeBaseContainer
        inGridOf={inGridOf}
        onClick={() => {
          navigate(routes.getKnowledgeBase(knowledgeBase.id));
        }}
      >
        <HeightDummy />

        <InnerContainer>
          <ImageContainer>
            <ImageSpacer />

            <TreeContainer>
              <Tree src={staticUri(`assets/images/tree${getTree(knowledgeBase, 3)}.png`)} />
            </TreeContainer>
          </ImageContainer>

          <InfoContainer>
            <Name>
              {knowledgeBase.name}
            </Name>

            <Type.Paragraph style={{ marginBottom: 0 }}>
              {knowledgeBase.resourcesCount > 0 ? (
                <>
                  <b>{`${knowledgeBase.resourcesCount} `}</b>

                  {t(translationKeys.screens.knowledgeBases.resourcesCountSufix)}
                </>
              ) : t(translationKeys.screens.knowledgeBases.noResources)}
            </Type.Paragraph>
          </InfoContainer>
        </InnerContainer>
      </KnowledgeBaseContainer>
    </>
  );
}
