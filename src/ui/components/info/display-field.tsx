
/*
 * Module dependencies.
 */

import React from 'react';
import Type from 'src/ui/styles/type';
import styled from 'styled-components';

/*
 * Styles.
 */

const Label = styled(Type.XSmall.withComponent('label'))`
  margin: 0;
`;

/*
 * DisplayField.
 */

function DisplayField(props: { label: string, value: string }) {
  return (
    <div>
      <Label>
        {props.label}
      </Label>

      <Type.Paragraph>
        {props.value}
      </Type.Paragraph>
    </div>
  );
}

export default React.memo(DisplayField);
