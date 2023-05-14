
/*
 * Resource data type.
 */

export type ResourceType = 'FILE';

/*
 * Resource data type.
 */

export type Resource = {
  id: string,
  type: ResourceType,
  metadata: { fileName: string },
  createdAt: string
};
