import { Annotation, Entity, Input } from './types/input';
import { ConvertedAnnotation, ConvertedEntity, Output } from './types/output';

// TODO: Convert Input to the Output structure. Do this in an efficient and generic way.
// HINT: Make use of the helper library "lodash"
export const convertInput = (input: Input): Output => {
  const documents = input.documents.map((document) => {
    // TODO: map the entities to the new structure and sort them based on the property "name"
    // Make sure the nested children are also mapped and sorted
    const entities = document.entities.map(convertEntity).sort(sortEntities);

    // TODO: map the annotations to the new structure and sort them based on the property "index"
    // Make sure the nested children are also mapped and sorted
    const annotations = document.annotations.map(convertAnnotation).sort(sortAnnotations);
    return { id: document.id, entities, annotations };
  });

  return { documents };
};

// HINT: you probably need to pass extra argument(s) to this function to make it performant.
export const convertEntity = (entity: Entity, index: number, entities: Entity[]): ConvertedEntity => {
  let convertedEntity = {
    id: entity.id,
    name: entity.name,
    type: entity.type,
    class: entity.class,
    children: [] as ConvertedEntity[]
  }

  const children = entities.filter(childEntity => childEntity.refs.includes(entity.id));
  if (children.length > 0) {
    convertedEntity.children = children.map(childEntity => convertEntity(childEntity, index, entities));
  }

  return convertedEntity;

};

// HINT: you probably need to pass extra argument(s) to this function to make it performant.
const convertAnnotation = (annotation: Annotation): ConvertedAnnotation => {
  throw new Error('Not implemented');
};

const sortEntities = (entityA: ConvertedEntity, entityB: ConvertedEntity) => {
  throw new Error('Not implemented');
};

const sortAnnotations = (annotationA: ConvertedAnnotation, annotationB: ConvertedAnnotation) => {
  throw new Error('Not implemented');
};

// BONUS: Create validation function that validates the result of "convertInput". Use yup as library to validate your result.
