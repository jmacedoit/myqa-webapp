
/*
 * Module dependencies.
 */

import { AutoField } from 'uniforms-mui';
import { AutoForm } from 'uniforms';
import { Button } from '@mui/material';
import { FromSchema } from 'json-schema-to-ts';
import { JSONSchemaType } from 'ajv';
import { KnowledgeBase } from 'src/types/knowledge-bases';
import { createDefaultValidator } from 'src/ui/ajv';
import { palette } from 'src/ui/styles/colors';
import { routes } from 'src/ui/routes';
import { selectKnowledgeBases } from 'src/state/slices/data';
import { styled as styledMaterial } from '@mui/material/styles';
import { translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useAppSelector } from 'src/ui/hooks/redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import JSONSchemaBridge from 'uniforms-bridge-json-schema';
import KnowledgeBaseSelect from './knowledge-base-select';
import QuestionInput from './question-text-field';
import React from 'react';
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';
import Type from 'src/ui/styles/type';
import breakpoints from 'src/ui/styles/breakpoints';
import qs from 'qs';
import styled from 'styled-components';

/*
 * Styles.
 */

const Container = styled.div<{ topAligned: boolean }>`
  text-align: center;
  margin-bottom: ${units(6)}px;
  width: 100%;
  min-height: ${units(10)}px;
  padding: ${units(4)}px ${units(4)}px;
  border-radius: ${props => props.topAligned ? '0px 0px' : `${units(2)}px ${units(2)}px`} ${units(2)}px ${units(2)}px;
  background: ${palette.neonGreen};
  box-shadow: 0px 4px 14px -2px ${palette.mildGreenDark};

  > form {
    margin-bottom: 0;
  }
`;

const AutoFormsInnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InputsContainer = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  max-width: 960px;
  width: 100%;
  border-radius: ${units(2)}px;
  background: ${palette.mildGreen};
  min-height: ${units(10)}px;
`;

const InputsContainerShadow = styled.div`
  border-radius: ${units(2)}px;
  bottom: 0;
  box-shadow: inset 0px 0px 4px 0px rgba(0, 0, 0, 0.47);
  left: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 20;
`;

const SubmitButton = styledMaterial(Button)`
  align-items: center;
  background: ${palette.mildGreenDark};
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.47);
  color: ${palette.extraDarkGreen};
  display: flex;
  justify-content: center;
  padding: ${units(3)}px ${units(2)}px ${units(3)}px ${units(1.5)}px;
  z-index: 10;
  border-radius: 0;
  min-width: initial;

  &:focus {
    outline: none;
  };

  &:hover {
    background: ${palette.mildGreen};
  };
`;

const FieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  @media (min-width: ${breakpoints.sm}px) {
    flex-direction: row;
  }
`;

/*
 * Question schema.
 */

function createQuestionSchema(t: (key: string) => string, knowledgeBases: KnowledgeBase[]) {
  return {
    type: 'object',
    properties: {
      question: {
        type: 'string',
        maxLength: 512,
        title: '',
        placeholder: t(translationKeys.questionBar.placeholder),
        component: QuestionInput
      },
      knowledgeBase: {
        type: 'string',
        options: [
          ...knowledgeBases.map(knowledgeBase => ({
            label: knowledgeBase.name,
            value: knowledgeBase.id
          }))
        ],
        component: KnowledgeBaseSelect
      }
    },
    required: ['question', 'knowledgeBase'],
    additionalProperties: false
  } as const;
}

type QuestionData = FromSchema<ReturnType<typeof createQuestionSchema>>;

/*
 * Knowledge base component.
 */

export default function QuestionBar(props: { titled?: boolean, topAligned?: boolean }) {
  const knowledgeBases = useAppSelector(selectKnowledgeBases);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { titled, topAligned } = props;
  const [isValid, setIsValid] = React.useState(false);

  const questionSchema = createQuestionSchema(t, knowledgeBases);
  const schemaValidator = createDefaultValidator(questionSchema as unknown as JSONSchemaType<QuestionData>);
  const bridge = new JSONSchemaBridge(questionSchema, schemaValidator);
  const questionFormRef = React.useRef<any>(null);

  return (
    <Container topAligned={topAligned ?? false}>
      {titled && (
        <Type.H4 style={{ marginBottom: `${units(3)}px` }}>
          {t(translationKeys.questionBar.title)}
        </Type.H4>
      )}

      <AutoForm
        onChangeModel={(model: QuestionData) => {
          setIsValid((schemaValidator(model)?.details?.length ?? 0) === 0);
        }}
        onSubmit={(model: QuestionData) => {
          navigate(`${routes.answer}?${qs.stringify({ question: model.question, knowledgeBaseId: model.knowledgeBase })}`);
        }}
        ref={questionFormRef}
        schema={bridge}
      >
        <AutoFormsInnerContainer>
          <InputsContainer>
            <InputsContainerShadow />

            <FieldsWrapper>
              <AutoField
                name='question'
                placeholder
              />

              <AutoField name='knowledgeBase' />
            </FieldsWrapper>

            <SubmitButton
              disabled={!isValid}
              type='submit'
            >
              <SubdirectoryArrowLeftIcon />
            </SubmitButton>
          </InputsContainer>
        </AutoFormsInnerContainer>
      </AutoForm>
    </Container>
  );
}
