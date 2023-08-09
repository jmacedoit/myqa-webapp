
/*
 * Module dependencies.
 */

import { AnswerSource, AnswerSourceData } from 'src/types/answer';
import { CircularProgress } from '@mui/material';
import { getAnswerSourcesData } from 'src/services/backend/answers';
import { isNil, sortBy } from 'lodash';
import { palette } from 'src/ui/styles/colors';
import { translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useAuthenticationHandler } from 'src/ui/hooks/authentication';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import React from 'react';
import Type from 'src/ui/styles/type';
import styled from 'styled-components';

/*
 * Types.
 */

type AnswerSourceDataWithHighlights = AnswerSourceData & {
  highlightsSplitString: string[]
};

type SubstringTracker = {
  substring: string,
  start: number,
  end: number
}

/*
 * Styles.
 */

const SourceContainer = styled.div`
  border-radius: ${units(2)}px;
  background-color: ${palette.oliveGreenDark};
  padding: ${units(2)}px;
  margin-bottom: ${units(2)}px;
`;

/*
 * Utils.
 */

function findCommonSubstrings(s1: string, s2: string, minimumIntersectionSize: number, minimumWords: number): SubstringTracker[] {
  const substringsS1: { substring: string, start: number, end: number }[] = [];
  const substringsS2: Set<string> = new Set();

  let currentIndex = 0;
  const wordsS1 = s1.split(/[^A-Za-zÀ-ÖØ-öø-ÿ0-9]/).map(word => {
    const start = currentIndex;

    currentIndex += word.length + 1;

    return { word, start };
  });

  const wordsS2 = s2.split(/[^A-Za-zÀ-ÖØ-öø-ÿ0-9]/);

  const maxPossibleLength = Math.min(6, Math.min(wordsS1.length, wordsS2.length));

  for (let i = 0; i < wordsS1.length; i++) {
    for (let j = i + 1; j <= Math.min(i + maxPossibleLength, wordsS1.length); j++) {
      const substring = wordsS1.slice(i, j).map(wordObject => wordObject.word).join(' ');

      if (substring.length > minimumIntersectionSize && j - i >= minimumWords) {
        const start = wordsS1[i].start;
        const end = start + substring.length - 1;

        substringsS1.push({ substring, start, end });
      }
    }
  }

  for (let i = 0; i < wordsS2.length; i++) {
    for (let j = i + 1; j <= Math.min(i + maxPossibleLength, wordsS2.length); j++) {
      const substring = wordsS2.slice(i, j).join(' ');

      if (substring.length > minimumIntersectionSize && j - i >= minimumWords) {
        substringsS2.add(substring);
      }
    }
  }

  const commonSubstrings = substringsS1.filter(({ substring }) => substringsS2.has(substring));

  return commonSubstrings;
}

function collapseSubstrings(substrings: SubstringTracker[]): SubstringTracker[] {
  const substringsCopy: SubstringTracker[] = substrings.map(s => ({ ...s }));

  substringsCopy.sort((a, b) => a.start - b.start);

  let i = 0;

  while (i < substringsCopy.length - 1) {
    const current = substringsCopy[i];
    const next = substringsCopy[i + 1];

    if (current.start <= next.start && current.end >= next.end) {
      substringsCopy.splice(i + 1, 1);
    } else {
      i++;
    }
  }

  i = 0;
  while (i < substringsCopy.length - 1) {
    const current = substringsCopy[i];
    const next = substringsCopy[i + 1];

    if (current.end >= next.start) {
      // Merge the next substring into the current one
      substringsCopy[i] = {
        substring: current.substring + next.substring.slice(current.end - next.start + 1),
        start: current.start,
        end: Math.max(current.end, next.end)
      };
      substringsCopy.splice(i + 1, 1);
    } else {
      i++;
    }
  }

  return substringsCopy;
}

function findCommonDistinctiveSubstrings(s1: string, s2: string, minimumIntersectionSize: number, minimumWords: number): SubstringTracker[] {
  const commonSubstrings = findCommonSubstrings(s1.toLowerCase(), s2.toLowerCase(), minimumIntersectionSize, minimumWords);

  return collapseSubstrings(commonSubstrings);
}

function splitByIndexes(input: string, indexes: number[]): string[] {
  let lastIndex = 0;
  const result: string[] = [];

  indexes.sort((a, b) => a - b);

  for (let i = 0; i < indexes.length; i++) {
    if (indexes[i] > input.length || indexes[i] <= lastIndex) {
      continue;
    }

    result.push(input.substring(lastIndex, indexes[i]));
    lastIndex = indexes[i];
  }

  result.push(input.substring(lastIndex));

  if (indexes[0] === 0) {
    result.unshift('');
  }

  return result;
}

/*
 * Export SourcesDisplayer.
 */

function SourcesDisplayer(props: { answer: string | undefined, sources: AnswerSource[], messageId: string | null }) {
  const { handleAuthenticatedRequest } = useAuthenticationHandler();
  const { t } = useTranslation();
  const sourcesDataRetrieval = useQuery(['sources', props.messageId], async ({ queryKey }) => {
    const [, messageIdToQuery] = queryKey as [string, string];

    if (!messageIdToQuery) {
      return;
    }

    const response = await handleAuthenticatedRequest(() => getAnswerSourcesData(messageIdToQuery));

    return response.sources;
  });

  const sourcesData = sourcesDataRetrieval.data ?? [];
  const sortedSources = sortBy(props.sources, source => source.chunkNumber);
  const sourcesByFileName = sortedSources.reduce((accumulator, source) => {
    const sourceData = sourcesData.find(sourceData => sourceData.chunkId === source.chunkId);

    if (!sourceData) {
      return accumulator;
    }

    const fileName = source.fileName;

    if (!accumulator[fileName]) {
      accumulator[fileName] = [];
    }

    const intersectionWithAnswer = isNil(props.answer) ? [] : findCommonDistinctiveSubstrings(sourceData.data, props.answer, 10, 2);
    const allIndexesToSplit = intersectionWithAnswer.map(({ end, start }) => [start, end + 1]).flat().sort();

    accumulator[fileName].push({
      ...sourceData,
      highlightsSplitString: splitByIndexes(sourceData.data, allIndexesToSplit)
    });

    return accumulator;
  }, {} as { [fileName: string]: AnswerSourceDataWithHighlights[] });

  return (
    <>
      <Type.H4>
        {t(translationKeys.screens.sources.title)}
      </Type.H4>

      {sourcesDataRetrieval.isLoading && (
        <CircularProgress />
      )}

      {Object.keys(sourcesByFileName).map((fileName, index) => {
        const sources = sourcesByFileName[fileName];

        return (
          <div
            key={index}
            style={{
              whiteSpace: 'pre-line',
              marginBottom: `${units(4)}px`
            }}
          >
            <Type.ParagraphLarge style={{ fontWeight: 500 }}>
              {fileName}
            </Type.ParagraphLarge>

            <SourceContainer>
              {sources.map((source, index) => {
                return (
                  <>
                    {index > 0 && index < sources.length - 1 && (
                      <Type.Paragraph
                        key={index}
                        style={{
                          display: 'block',
                          fontStyle: 'italic',
                          fontWeight: 500,
                          marginTop: `${units(2)}px`
                        }}
                      >
                        {'[...]'}
                      </Type.Paragraph>
                    )}

                    <Type.Small
                      key={index}
                      style={{ fontStyle: 'italic' }}
                    >
                      {source.highlightsSplitString.map((highlight, index) => {
                        return (
                          <span
                            key={index}
                            style={{ backgroundColor: index % 2 === 1 ? palette.lightBlue : 'transparent' }}
                          >
                            {highlight}
                          </span>
                        );
                      })}
                    </Type.Small>
                  </>
                );
              })}
            </SourceContainer>
          </div>
        );
      })}
    </>
  );
}

export default React.memo(SourcesDisplayer);
