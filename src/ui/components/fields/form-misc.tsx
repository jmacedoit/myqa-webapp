
/*
 * Module dependencies.
 */

import { ErrorField } from 'uniforms-mui';
import { units } from 'src/ui/styles/dimensions';
import styled from 'styled-components';

/**
 * Export styled form misc components.
 */

export const FieldWrapper = styled.div`
  margin-bottom: ${units(2)}px;
`;

export const StyledErrorField = styled(ErrorField)`
  text-align: left;
`;
