import deepEqualinAnyOrder from 'deep-equal-in-any-order';
import { expect, use } from 'chai';
import inputJson from './input.json';
import outputJson from './output.json';
import { annotationConversion, convertEntity, convertInput, sortAnnotations, sortEntities } from './todo';
import { Annotation, Entity, Input } from './types/input';

use(deepEqualinAnyOrder);

describe('Todo', () => {
  it('Should be able to convert the input (flat lists) to the output (nested) structure', () => {
    const output = convertInput(inputJson as Input);

    expect(output.documents.length).to.equal(1);
    expect(output.documents[0].entities.length).to.equal(14);
    expect(output.documents[0].annotations.length).to.equal(9);
    expect(output).to.deep.equal(outputJson);
  });

});

describe.skip('Conversion', () => {
  describe('convertEntity', () => {
    it('Should convert an input entity to a converted entity', () => {
      const entities = inputJson.documents[0].entities as Entity[];
      const convertedEntities = entities.map(convertEntity);

      expect(convertedEntities).to.deep.equalInAnyOrder(outputJson.documents[0].entities);
    });
  });
  describe('annotationConversion', () => {
    it('Should convert input annotations to converted annotations', () => {
      const annotations = inputJson.documents[0].annotations as Annotation[];
      const entities = inputJson.documents[0].entities as Entity[];
      const convertedAnnotations = annotationConversion(annotations, entities);

      expect(convertedAnnotations).to.deep.equalInAnyOrder(outputJson.documents[0].annotations);
    });
  });
});

describe.skip('Sorting', () => {
  describe('sortEntities', () => {
    it('Should sort converted entities (including nested children) by name', () => {
      const entities = inputJson.documents[0].entities as Entity[];
      const convertedEntities = entities.map(convertEntity);
      const sortedEntities = sortEntities(convertedEntities);

      expect(sortedEntities).to.deep.equal(outputJson.documents[0].entities);
    });
  });
  describe('sortAnnotations', () => {
    it('Should sort converted annotations (including nested children) by index', () => {
      const annotations = inputJson.documents[0].annotations as Annotation[];
      const entities = inputJson.documents[0].entities as Entity[];
      const convertedAnnotations = annotationConversion(annotations, entities);
      const sortedAnnotations = sortAnnotations(convertedAnnotations);
      expect(sortedAnnotations).to.deep.equal(outputJson.documents[0].annotations);
    });
  })
});
