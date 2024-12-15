
/*
 * Answer related types.
 */

export type Answer = {
  answer: string,
};

export type AnswerSource = {
  chunkId: string,
  fileName: string,
  pageIndex?: number,
  chunkNumber: number,
  percentageIn: number,
  resourceName: string,
  resourceMimetype: string
}

export type AnswerSourceData = {
  chunkId: string,
  data: string
}

export enum WisdomLevel {
  Medium = 'MEDIUM',
  High = 'HIGH',
  VeryHigh = 'VERY_HIGH'
}
