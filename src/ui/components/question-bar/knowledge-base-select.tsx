
/*
 * Module dependencies.
 */

import { Button, Dialog } from '@mui/material';
import { DialogBodyContainer } from 'src/ui/components/layout/dialog-body-container';
import { FieldProps, connectField } from 'uniforms';
import { getTreeById } from 'src/ui/utils/trees';
import { palette } from 'src/ui/styles/colors';
import { staticUri } from 'src/utils/environment';
import { styled as styledMaterial } from '@mui/material/styles';
import { translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useTranslation } from 'react-i18next';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import React, { useState } from 'react';
import Type from 'src/ui/styles/type';
import breakpoints from 'src/ui/styles/breakpoints';
import styled from 'styled-components';

/*
 * Types.
 */

export type InputProps = FieldProps<string, {}> & { options: { label: string, value: string }[] };

/*
 * Styles.
 */

const PickButton = styledMaterial(Button)`
  align-items: center;
  background-color: ${palette.mildGreenDark};
  border-radius: 0;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.47);
  box-sizing: border-box;
  color: ${palette.extraDarkGreen};
  cursor: pointer;
  display: flex;
  justify-content: center;
  margin: 0;
  min-height: ${units(8)}px;
  outline: none;
  padding: ${units(1)}px;
  text-transform: none;

  &:focus {
    outline: none;
  };

  &:hover {
    background: ${palette.mildGreen};
  };

  @media (min-width: ${breakpoints.sm}px) {
    flex-direction: row;
    min-width: ${units(20)}px;
    max-width: ${units(26)}px;
  }
`;

const ButtonTextContainer = styled.div`
  padding: 0 ${units(2)}px;
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
`;

const KnowledgeBaseOption = styledMaterial(Button)`
  background-color: ${palette.lightGreen};
  border-radius: ${units(2)}px;
  cursor: pointer;
  padding: ${units(2)}px;
  text-transform: none;
  transition: background-color 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  &:hover {
    background: ${palette.mildGreen};
  }
`;

const TreeBackground = styled.div<{ color?: string }>`
  width: ${units(6)}px;
  justify-content: center;
  height: ${units(6)}px;
  display: flex;
  border-radius: 50%;
  background-color: ${props => props.color ?? palette.paleGreen};
  align-items: center;
`;

const Tree = styled.img`
  width: ${units(5)}px;
`;

/*
 * KnowledgeBaseSelect component.
 */

function KnowledgeBaseSelect({ ...props }: InputProps) {
  const { t } = useTranslation();
  const [selectPopupOpen, setSelectPopupOpen] = useState(false);
  const selectedOption = props.options.find(option => option.value === props.value);
  const { options } = props;

  return (
    <>
      <PickButton onClick={() => { setSelectPopupOpen(true); }}>
        {selectedOption?.label && (
          <div style={{ paddingLeft: `${units(1)}px` }}>
            <TreeBackground>
              <Tree src={staticUri(`assets/images/tree${getTreeById(selectedOption.value, 3)}-mini.png`)} />
            </TreeBackground>
          </div>
        )}

        <ButtonTextContainer>
          <Type.SmallStrong style={{ margin: 0 }}>
            {selectedOption?.label ?? t(translationKeys.questionBar.emptyKnowledgeBaseLabel)}
          </Type.SmallStrong>

          <ArrowDropDownIcon />
        </ButtonTextContainer>

      </PickButton>

      <Dialog
        PaperComponent={DialogBodyContainer}
        fullWidth
        maxWidth={'xs'}
        onClose={() => setSelectPopupOpen(false)}
        open={selectPopupOpen}
      >
        <Type.H5>
          {t(translationKeys.questionBar.emptyKnowledgeBaseLabel)}
        </Type.H5>

        {options.map((option, index) => {
          return (
            <KnowledgeBaseOption
              key={option.value}
              onClick={() => {
                props.onChange(option.value);

                setSelectPopupOpen(false);
              }}
              style={{ marginBottom: `${units(index === options.length - 1 ? 0 : 1)}Px` }}
            >
              <div style={{ paddingRight: `${units(2)}px` }}>
                <TreeBackground>
                  <Tree src={staticUri(`assets/images/tree${getTreeById(option.value, 3)}-mini.png`)} />
                </TreeBackground>
              </div>

              <div style={{ flex: 1 }}>
                <Type.SmallStrong style={{ margin: 0 }}>
                  {option.label}
                </Type.SmallStrong>
              </div>
            </KnowledgeBaseOption>
          );
        })}
      </Dialog>
    </>
  );
}

/*
 * Export `KnowledgeBaseSelect` component.
 */

export default connectField<InputProps>(KnowledgeBaseSelect, { kind: 'leaf' });
