
/*
 * Module dependencies.
 */

import { difference } from 'lodash';
import React from 'react';
import seedrandom from 'seedrandom';
import styled from 'styled-components';

/*
 * Styles.
 */

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

interface CircleProps extends React.HTMLAttributes<HTMLDivElement> {
  x: number;
  y: number;
  size: number;
  color: string;
}

const Circle = styled.div<CircleProps>`
  opacity: 0.7;
  position: absolute;
  width: ${props => props.size}%;
  padding-top: ${props => props.size}%;
  border-radius: 50%;
  background-color: ${props => props.color}};
  top: ${props => props.y}%;
  left: ${props => props.x}%;
  transform: translate(-50%, -50%)
`;

/*
 * Given a seed, returns a random position, size and color for the circle.
 */

function getPositionSizeAndColor(seed: string, usedColours: string[]) {
  const rng = seedrandom(seed);

  const colorPallete = difference(['#00235B', '#E21818', '#FFDD83', '#98DFD6'], usedColours);
  const x = 25 + Math.floor(rng() * 50);
  const y = 25 + Math.floor(rng() * 50);
  const size = 10 + Math.floor(rng() * 20);
  const color = colorPallete[Math.floor(rng() * colorPallete.length)];

  return { x, y, size, color };
}

/*
 * Knowledge base component.
 */

export default function Shapes(props: { knowledgeBaseId: string, numberOfShapes: number }) {
  const usedColours: string[] = [];
  const shapesToRender: React.ReactElement[] = [];

  Array(props.numberOfShapes).fill(0).forEach((_, index) => {
    const { color, size, x, y } = getPositionSizeAndColor(`${props.knowledgeBaseId}-${index}`, usedColours);

    usedColours.push(color);

    shapesToRender.push(
      <Circle
        color={color}
        key={index}
        size={size}
        x={x}
        y={y}
      />
    );
  });

  return (
    <Container>
      {shapesToRender}
    </Container>
  );
}
