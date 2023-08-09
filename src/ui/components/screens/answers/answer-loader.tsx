
/*
 * Module dependencies.
 */

import { palette } from 'src/ui/styles/colors';
import ContentLoader from 'react-content-loader';
import React from 'react';

/*
 * Types.
 */

interface Segment {
  width: number;
  separation: number;
}

/*
 * Utils.
 */

function generateLineSegments(total: number, numberOfSegments: number, separation: number): Segment[] {
  let sum = total - (numberOfSegments - 1) * separation;

  if (sum < 0) {
    throw new Error('Invalid input: Sum is negative');
  }

  const segments: Segment[] = new Array(numberOfSegments).fill({ width: 0, separation: 0 });

  for (let i = 0; i < numberOfSegments - 1; i++) {
    const avg = sum / (numberOfSegments - i);
    const width = avg - avg / 2 + Math.random() * avg;

    segments[i] = { width, separation };
    sum -= width;
  }
  segments[numberOfSegments - 1] = { width: sum, separation };

  // shuffle the array to make it random
  for (let i = numberOfSegments - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [segments[i], segments[j]] = [segments[j], segments[i]];
  }

  return segments;
}

function getRandomInt(a: number, b: number): number {
  const min = Math.ceil(a);
  const max = Math.floor(b);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
 * Export Answer Loader.
 */

function AnswerLoader(props: any) {
  const totalWidth = 800;
  const segmentSeparation = 10;
  const nLines = 5;
  const lineHeight = 10;
  const lineSeparation = 8;
  // eslint-disable-next-line no-unused-vars

  const lineSegments = new Array(nLines).fill(0).map(() => {
    return generateLineSegments(totalWidth, getRandomInt(4, 7), segmentSeparation);
  });

  const linesY = Array.from({ length: nLines }, (_, i) => i * (lineHeight + lineSeparation));

  return (
    <ContentLoader
      backgroundColor={palette.oliveGreenDark}
      foregroundColor={palette.oliveGreen}
      viewBox='0 0 800 100'
      width={'100%'}
      {...props}
    >
      {linesY.map((lineY, lineIndex) => {
        let currentX = 0;

        return lineSegments[lineIndex].map((segment, segmentIndex) => {
          const rect = (
            <rect
              height='10'
              key={`${lineIndex}-${segmentIndex}`}
              rx='5'
              ry='5'
              width={segment.width}
              x={currentX}
              y={lineY}
            />
          );

          currentX += segment.width + segment.separation;

          return rect;
        });
      })}
    </ContentLoader>
  );
}

export default React.memo(AnswerLoader);
