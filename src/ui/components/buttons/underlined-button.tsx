
/*
 * Module dependencies.
 */

import { Link } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components';

/*
 * Styles.
 */

const StyledButton = styled.button<{ color: string }>`
  all: unset;
  appearance: none;
  border: none;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  outline: none;
  cursor: pointer;
  box-shadow: none;
  background-color: transparent;
  color: ${props => props.color};

  &:focus: {
    outline: none;
  }

  &::after {
    position: absolute;
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    background: ${props => props.color};
    transition: transform 0.2s ease-in-out;
    transform: scaleX(0);
    transform-origin: left;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

const StyledLink = StyledButton.withComponent(Link);

export default function UnderlinedButton(props: { color: string, isLink?: boolean, to?: string, [key: string]: any }) {
  const { className, isLink, to, ...restProps } = props;

  if (isLink) {
    if (to) {
      return (
        <div
          className={className}
          style={{ position: 'relative', display: 'inline-block' }}
        >
          <StyledLink
            to={to}
            {...restProps}
          />
        </div>
      );
    } else {
      console.warn('Missing "to" prop for React Router link');
    }
  }

  return (
    <div
      className={className}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <StyledButton {...restProps} />
    </div>
  );
}
