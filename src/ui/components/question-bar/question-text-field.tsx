
/*
 * Module dependencies.
 */

import { FieldProps, connectField, filterDOMProps } from 'uniforms';
import { palette } from 'src/ui/styles/colors';
import { units } from 'src/ui/styles/dimensions';
import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import styled from 'styled-components';

/*
 * Types.
 */

export type InputProps = FieldProps<string, {
  submit: () => void;
  innerRef: React.RefObject<HTMLTextAreaElement>;
}>;

/*
 * Styles.
 */

const StyledInput = styled(TextareaAutosize)`
  background-color: transparent;
  border: none;
  color: ${palette.extraDarkGreen};
  flex: 1;
  font-family: inherit;
  font-size: inherit;
  height: 100%;
  line-height: inherit;
  margin: 0;
  min-height: ${units(10)}px;
  outline: none;
  padding: ${units(2)}px;
  resize: vertical;
  width: 100%;

  &::placeholder {
    color: ${palette.extraDarkGreen};
    opacity: 0.7;
  }

  &::scrollbar {
    display: none;
  }
`;

/*
 * QuestionInput component.
 */

function QuestionInput({ ...props }: InputProps) {
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      props.submit();
    }
  };

  return (
    <StyledInput
      {...filterDOMProps(props)}
      onChange={event => props.onChange(event.target.value)}
      onKeyDown={onKeyDown}
      placeholder={props.placeholder}
      ref={props.innerRef}
    />
  );
}

/*
 * Export `QuestionInput` component.
 */

export default connectField<InputProps>(QuestionInput, { kind: 'leaf' });
