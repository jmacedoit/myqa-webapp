
/*
 * Module dependencies.
 */

import { FieldProps, connectField, filterDOMProps } from 'uniforms';
import { Slider } from '@mui/material';
import { units } from 'src/ui/styles/dimensions';
import React, { useRef } from 'react';
import Type from 'src/ui/styles/type';

/*
 * Types.
 */

export type InputProps = FieldProps<string, {
  marks: { value: number, label: string }[]
}>;

/*
 * WisdomLevelSlider component.
 */

function WisdomLevelSlider({ ...props }: InputProps) {
  const { marks } = props;
  const sliderRef = useRef<HTMLInputElement>(null);

  return (
    <label>
      <Type.XSmall>
        {props.label}
      </Type.XSmall>

      <div style={{ padding: `0 ${units(3)}px` }}>
        <Slider
          {...filterDOMProps(props)}
          marks={props.marks}
          max={marks[marks.length - 1].value}
          min={marks[0].value}
          onChange={(_event, value) => {
            props.onChange(value as any);
          }}
          ref={sliderRef}
          step={null}
          value={props.value as any}
          valueLabelDisplay={'off'}
        />
      </div>
    </label>
  );
}

/*
 * Export `WisdomLevelSlider` component.
 */

export default connectField<InputProps>(WisdomLevelSlider, { kind: 'leaf' });
