import { Annotation, Entity, Input } from './types/input';
import { ConvertedAnnotation, ConvertedEntity, Output } from './types/output';
import _ from 'lodash';

export const convertInput = (input: Input): Output => {
  const documents = input.documents.map((document) => {
    const entities = sortEntities(document.entities.map(convertEntity));
    const annotations = sortAnnotations(annotationConversion(document.annotations, document.entities));

    return { id: document.id, entities, annotations };
  });

  return { documents };
};

export const convertEntity = (entity: Entity, index: number, entities: Entity[]): ConvertedEntity => {
  const convertedEntity = {..._.pick(entity, ['id', 'name', 'type', 'class']), children: [] as ConvertedEntity[]};
  const children = entities.filter(childEntity => childEntity.refs.includes(entity.id));
  if (children.length > 0) {
    convertedEntity.children = children.map(childEntity => convertEntity(childEntity, index, entities));
  }

  return convertedEntity;

};

export const annotationConversion = (annotations: Annotation[], entities: Entity[]) => {
  const parentAnnotations = annotations.filter(annotation => annotation.refs.length === 0);
  const entitiesDictionary = _.keyBy(entities, "id");

  return annotations.map((annotation, index, annotations) => convertAnnotation(annotation, index, annotations, entitiesDictionary))
  .filter(convertedAnnotation => parentAnnotations.some(parentAnnotation => parentAnnotation.id === convertedAnnotation.id));
}

export const convertAnnotation = (annotation: Annotation, index: number, annotations: Annotation[], entitiesDictionary: _.Dictionary<Entity>): ConvertedAnnotation => {
  const convertedAnnotation = {
    ..._.pick(annotation, ['id', 'entity', 'value']), 
    entity: {id: annotation.entityId, name: entitiesDictionary[annotation.entityId].name},
   index: 0, children: [] as ConvertedAnnotation[]
  } as ConvertedAnnotation;

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
