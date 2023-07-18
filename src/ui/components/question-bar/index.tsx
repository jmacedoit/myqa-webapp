
/*
 * Module dependencies.
 */

import { AutoField } from 'uniforms-mui';
import { AutoForm } from 'uniforms';
import { Button, Dialog } from '@mui/material';
import { DialogBodyContainer } from '../layout/dialog-body-container';
import { FromSchema } from 'json-schema-to-ts';
import { JSONSchemaType } from 'ajv';
import { KnowledgeBase } from 'src/types/knowledge-bases';
import { WisdomLevel } from 'src/types/answer';
import { createDefaultValidator } from 'src/ui/ajv';
import { isEmpty, isNil, trim } from 'lodash';
import { palette } from 'src/ui/styles/colors';
import { properties } from 'src/utils/types';
import { selectKnowledgeBases } from 'src/state/slices/data';
import { styled as styledMaterial } from '@mui/material/styles';
import { translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useAppSelector } from 'src/ui/hooks/redux';
import { useTranslation } from 'react-i18next';
import ButtonBase from 'src/ui/components/buttons/button-base';
import JSONSchemaBridge from 'uniforms-bridge-json-schema';
import KnowledgeBaseSelect from './knowledge-base-select';
import QuestionInput from './question-text-field';
import React, { useEffect } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';
import Type from 'src/ui/styles/type';
import WisdomLevelSlider from './wisdom-level-slider';
import breakpoints from 'src/ui/styles/breakpoints';
import styled from 'styled-components';

/*
 * Styles.
 */

const Container = styled.div<{ topAligned: boolean }>`
  text-align: center;
  margin-bottom: ${props => props.topAligned ? units(6) : 0}px;
  width: 100%;
  min-height: ${units(10)}px;
  padding: ${units(4)}px ${units(4)}px ${units(2)}px ${units(4)}px;
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

const SettingsButton = styledMaterial(ButtonBase)`
  color: ${palette.darkGreen};
  border-radius: 50%;
  height: ${units(3)}px;
  width: ${units(3)}px;
`;

const QuestionFieldWrapper = styled.div`
  display: flex;
  overflow: hidden;
  position: relative;
  flex: 1;
`;

const SettingsStateWrapper = styled.div`
  color: ${palette.darkGreen};
  text-align: center;
`;

/*
 * Question schema.
 */

enum WisdomSliderLevel {
  Medium = 1,
  High = 2,
  VeryHigh = 3
}

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
      },
      wisdomLevel: {
        type: 'number',
        label: t(translationKeys.questionBar.wisdomLevel.label),
        marks: [
          {
            value: WisdomSliderLevel.Medium,
            label: t(translationKeys.questionBar.wisdomLevel.marks.medium)
          },
          {
            value: WisdomSliderLevel.High,
            label: t(translationKeys.questionBar.wisdomLevel.marks.high)
          },
          {
            value: WisdomSliderLevel.VeryHigh,
            label: t(translationKeys.questionBar.wisdomLevel.marks.veryHigh)
          }
        ],
        component: WisdomLevelSlider
      },
      language: {
        type: 'string',
        label: t(translationKeys.questionBar.language.label),
        options: [
          {
            label: t(translationKeys.questionBar.language.inferredOptionLabel),
            value: ' '
          },
          {
            label: t(translationKeys.languages.en),
            value: 'en'
          },
          {
            label: t(translationKeys.languages.es),
            value: 'es'
          },
          {
            label: t(translationKeys.languages.fr),
            value: 'fr'
          },
          {
            label: t(translationKeys.languages['pt-PT']),
            value: 'pt-PT'
          },
          {
            label: t(translationKeys.languages['pt-BR']),
            value: 'pt-BR'
          },
          {
            label: t(translationKeys.languages.de),
            value: 'de'
          },
          {
            label: t(translationKeys.languages.it),
            value: 'it'
          }
        ]
      }
    },
    required: ['question', 'knowledgeBase', 'wisdomLevel', 'language'],
    additionalProperties: false
  } as const;
}

type QuestionData = FromSchema<ReturnType<typeof createQuestionSchema>>;

/*
 * Helpers.
 */

function convertFormWisdomLevelToApiWisdomLevel(wisdomLevel: WisdomSliderLevel) {
  switch (wisdomLevel) {
    case WisdomSliderLevel.Medium:
      return WisdomLevel.Medium;

    case WisdomSliderLevel.High:
      return WisdomLevel.High;

    case WisdomSliderLevel.VeryHigh:
      return WisdomLevel.VeryHigh;

    default:
      return WisdomLevel.Medium;
  }
}

const defaultWisdomLevel = WisdomSliderLevel.Medium;
const defaultLanguage = ' ';

/*
 * Knowledge base component.
 */

export default function QuestionBar(props: {
  titled?: boolean,
  topAligned?: boolean,
  defaultKnowledgeBaseId?: string,
  handleSubmit: (question: string, knowledgeBaseId: string, language: string | undefined, wisdomLevel: WisdomLevel) => void
}) {
  const knowledgeBases = useAppSelector(selectKnowledgeBases);
  const { t } = useTranslation();
  const { handleSubmit, titled, topAligned } = props;
  const [isValid, setIsValid] = React.useState(false);
  const [currentModel, setCurrentModel] = React.useState<QuestionData>();
  const [settingsDialogOpen, setSettingsDialogOpen] = React.useState(false);
  const questionSchema = createQuestionSchema(t, knowledgeBases);
  const schemaValidator = createDefaultValidator(questionSchema as unknown as JSONSchemaType<QuestionData>);
  const bridge = new JSONSchemaBridge(questionSchema, schemaValidator);
  const questionFormRef: any = React.useRef<any>(null);
  const textFieldRef: any = React.useRef<any>(null);

  useEffect(() => {
    if (!isNil(questionFormRef) && !isNil(props.defaultKnowledgeBaseId)) {
      questionFormRef.current.change(properties<QuestionData>().knowledgeBase, props.defaultKnowledgeBaseId);
    }
  }, [props.defaultKnowledgeBaseId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isNil(questionFormRef)) {
      questionFormRef.current.change(properties<QuestionData>().language, defaultLanguage);
      questionFormRef.current.change(properties<QuestionData>().wisdomLevel, defaultWisdomLevel);
    }
  }, []);

  const wisdomValueToTranslation = (wisdomLevel: WisdomSliderLevel) => {
    switch (wisdomLevel) {
      case WisdomSliderLevel.Medium:
        return t(translationKeys.questionBar.wisdomLevel.marks.medium);

      case WisdomSliderLevel.High:
        return t(translationKeys.questionBar.wisdomLevel.marks.high);

      case WisdomSliderLevel.VeryHigh:
        return t(translationKeys.questionBar.wisdomLevel.marks.veryHigh);

      default:
        return t(translationKeys.questionBar.wisdomLevel.marks.medium);
    }
  };

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

          setCurrentModel(model);
        }}
        onSubmit={(model: QuestionData) => {
          handleSubmit(
            model.question,
            model.knowledgeBase,
            isEmpty(trim(model.language)) ? undefined : model.language,
            convertFormWisdomLevelToApiWisdomLevel(model.wisdomLevel)
          );

          questionFormRef.current.reset();
          questionFormRef.current.change(properties<QuestionData>().knowledgeBase, model.knowledgeBase);
          questionFormRef.current.change(properties<QuestionData>().language, model.language);
          questionFormRef.current.change(properties<QuestionData>().wisdomLevel, model.wisdomLevel);

          setTimeout(() => {
            textFieldRef.current.focus();
          }, 1500);
        }}
        ref={questionFormRef}
        schema={bridge}
      >
        <AutoFormsInnerContainer>
          <InputsContainer>
            <InputsContainerShadow />

            <FieldsWrapper>
              <QuestionFieldWrapper>
                <AutoField
                  innerRef={textFieldRef}
                  name={properties<QuestionData>().question}
                  placeholder
                  submit={() => questionFormRef.current.submit()}
                />
              </QuestionFieldWrapper>

              <Dialog
                PaperComponent={DialogBodyContainer}
                fullWidth
                maxWidth={'sm'}
                onClose={() => { setSettingsDialogOpen(false); }}
                open={settingsDialogOpen}
              >
                <Type.H4>
                  {t(translationKeys.questionBar.questionSettingsTitle)}
                </Type.H4>

                <div style={{ marginBottom: `${units(3)}px` }}>
                  <AutoField name={properties<QuestionData>().wisdomLevel} />
                </div>

                <AutoField name={properties<QuestionData>().language || ''} />
              </Dialog>

              <AutoField name={properties<QuestionData>().knowledgeBase} />
            </FieldsWrapper>

            <SubmitButton
              disabled={!isValid}
              type='submit'
            >
              <SubdirectoryArrowLeftIcon />
            </SubmitButton>
          </InputsContainer>
        </AutoFormsInnerContainer>

        <SettingsStateWrapper>
          <SettingsButton onClick={() => { setSettingsDialogOpen(true); }}>
            <SettingsIcon
              sx={{ fontSize: '1em' }}
            />
          </SettingsButton>

          <Type.XSmall style={{ margin: `0 ${units(2)}px 0 0` }}>
            {t(translationKeys.questionBar.settingsState.wisdomLevelLabel)}

            {': '}

            {wisdomValueToTranslation(currentModel?.wisdomLevel ?? defaultWisdomLevel)}
          </Type.XSmall>

          <Type.XSmall style={{ margin: `0 ${units(2)} 0 0` }}>
            {t(translationKeys.questionBar.settingsState.languageLabel)}

            {': '}

            {isEmpty(trim(currentModel?.language ?? '')) ? t(translationKeys.questionBar.settingsState.autoLanguage) : t(translationKeys.languages[currentModel?.language ?? defaultLanguage])}
          </Type.XSmall>
        </SettingsStateWrapper>
      </AutoForm>
    </Container>
  );
}
