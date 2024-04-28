import { Annotation, Entity, Input } from './types/input';
import { ConvertedAnnotation, ConvertedEntity, Output } from './types/output';
import _ from 'lodash';

// TODO: Convert Input to the Output structure. Do this in an efficient and generic way.
// HINT: Make use of the helper library "lodash"
export const convertInput = (input: Input): Output => {
  const documents = input.documents.map((document) => {
    // TODO: map the entities to the new structure and sort them based on the property "name"
    // Make sure the nested children are also mapped and sorted
    const entities = sortEntities(document.entities.map(convertEntity));

    // TODO: map the annotations to the new structure and sort them based on the property "index"
    // Make sure the nested children are also mapped and sorted
    const annotations = sortAnnotations(annotationConversion(document.annotations, document.entities));

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

export const annotationConversion = (annotations: Annotation[], entities: Entity[]) => {
  const parentAnnotations = annotations.filter(annotation => annotation.refs.length === 0);
  const entitiesDictionary = _.keyBy(entities, "id");

  return annotations.map((annotation, index, annotations) => convertAnnotation(annotation, index, annotations, entitiesDictionary)).filter(convertedAnnotation => parentAnnotations.some(parentAnnotation => parentAnnotation.id === convertedAnnotation.id));
}

// HINT: you probably need to pass extra argument(s) to this function to make it performant.
export const convertAnnotation = (annotation: Annotation, index: number, annotations: Annotation[], entitiesDictionary: _.Dictionary<Entity>): ConvertedAnnotation => {
  let convertedAnnotation: ConvertedAnnotation = {
    id: annotation.id,
    entity: {id: annotation.entityId, name: entitiesDictionary[annotation.entityId].name},
    value: annotation.value,
    index: 0,
    children: [] as ConvertedAnnotation[]
  }

  const children = annotations.filter(childAnnotation => childAnnotation.refs.includes(annotation.id));
  if (children.length > 0) {
    convertedAnnotation.children = children.map(childAnnotation => convertAnnotation(childAnnotation, index, annotations, entitiesDictionary));
  }

  if (annotation.indices && annotation.indices.length > 0) {
    convertedAnnotation.index = annotation.indices[0].start;
  } else if (convertedAnnotation.children.length > 0) {
    convertedAnnotation.index = _.minBy(convertedAnnotation.children, (child) => child.index)?.index ?? 0;
  }

  return convertedAnnotation;
};

const sortEntitiesByName = (entityA: ConvertedEntity, entityB: ConvertedEntity) => entityA.name.localeCompare(entityB.name);

export const sortEntities = (entities: ConvertedEntity[]) => {
  entities.sort(sortEntitiesByName).forEach(entity => {
    if (entity.children) {
      sortEntities(entity.children);
    }
  });
  
  return entities;
}

const sortAnnotationsByIndex = (annotationA: ConvertedAnnotation, annotationB: ConvertedAnnotation) => annotationA.index - annotationB.index;

export const sortAnnotations = (annotations: ConvertedAnnotation[]) => {
  annotations.sort(sortAnnotationsByIndex).forEach(annotation => {
    if (annotation.children) {
      sortAnnotations(annotation.children);
    }
  });

  return annotations;
};

// BONUS: Create validation function that validates the result of "convertInput". Use yup as library to validate your result.
