
/*
 * Module dependencies.
 */

import { AutoField } from 'uniforms-mui';
import { AutoForm } from 'uniforms';
import { Button } from '@mui/material';
import { Col, Row } from 'react-grid-system';
import { FromSchema } from 'json-schema-to-ts';
import { JSONSchemaType } from 'ajv';
import { KnowledgeBase } from 'src/types/knowledge-bases';
import { createDefaultValidator } from 'src/ui/ajv';
import { routes } from 'src/ui/routes';
import { selectKnowledgeBases } from 'src/state/slices/data';
import { units } from 'src/ui/styles/dimensions';
import { useAppSelector } from '../hooks/redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import JSONSchemaBridge from 'uniforms-bridge-json-schema';
import React from 'react';
import Type from 'src/ui/styles/type';
import qs from 'qs';
import styled from 'styled-components';

/*
 * Styles.
 */

const Container = styled.div`
  text-align: center;
  margin-top: ${units(2)}px;
  margin-bottom: ${units(4)}px;
  width: 100%;
  min-height: ${units(10)}px;
  padding: ${units(4)}px ${units(2)}px;
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
        minLength: 12,
        maxLength: 256,
        title: ''
      },
      knowledgeBase: {
        type: 'string',
        options: [
          ...knowledgeBases.map(knowledgeBase => ({
            label: knowledgeBase.name,
            value: knowledgeBase.id
          }))
        ]
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

export default function QuestionBar() {
  const knowledgeBases = useAppSelector(selectKnowledgeBases);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const questionSchema = createQuestionSchema(t, knowledgeBases);
  const schemaValidator = createDefaultValidator(questionSchema as unknown as JSONSchemaType<QuestionData>);
  const bridge = new JSONSchemaBridge(questionSchema, schemaValidator);
  const questionFormRef = React.useRef<any>(null);

  return (
    <Container>
      <Type.H4>
        {'What do you want to ask your data?'}
      </Type.H4>

      <AutoForm
        onSubmit={(model: QuestionData) => {
          navigate(`${routes.answer}?${qs.stringify({ question: model.question, knowledgeBaseId: model.knowledgeBase })}`);
        }}
        ref={questionFormRef}
        schema={bridge}
      >
        <Row>
          <Col xs={8}>
            <AutoField name={'question'} />

            <Button
              onClick={event => {
                event.preventDefault();

                questionFormRef.current?.submit();
              }}
              sx={{
                position: 'absolute',
                right: units(3.5),
                top: 'calc(50% + 2px)',
                transform: 'translateY(-50%)'
              }}
              variant='contained'
            >
              {'Ask'}
            </Button>
          </Col>

          <Col xs={4}>
            <AutoField name={'knowledgeBase'} />
          </Col>
        </Row>
      </AutoForm>
    </Container>
  );
}
