
/*
 * Module dependencies.
 */

import React from 'react';
import styled from 'styled-components';

/*
 * Styles.
 */

const StyledButton = styled.button`
  appearance: none;
  border: none;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  outline: none;
  cursor: pointer;
  box-shadow: 'none';
  background-color: transparent;
  color: ${props => props.color};

  '&:focus': {
    outline: 'none'
  }

  &::after{
    position: absolute;
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    background: ${props => props.color};
    transition: transform 0.2s ease-in-out;
    transform: scaleX(0);
  }

  &:hover::after{
    transform: scaleX(1);
  }
`;

export default function UnderlinedButton(props: { color: string, [key: string]: any }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <StyledButton {...props} />
    </div>
  );
}
