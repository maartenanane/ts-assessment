import deepEqualinAnyOrder from 'deep-equal-in-any-order';
import { expect, use } from 'chai';
import inputJson from './input.json';
import outputJson from './output.json';
import { convertEntity, convertInput } from './todo';
import { Entity, Input } from './types/input';

describe('Todo', () => {
  // TODO: make sure this test passes
  it('Should be able to convert the input (flat lists) to the output (nested) structure', () => {
    const output = convertInput(inputJson as Input);

    expect(output.documents.length).to.equal(1);
    expect(output.documents[0].entities.length).to.equal(14);
    expect(output.documents[0].annotations.length).to.equal(9);
    expect(output).to.deep.equal(outputJson);
  });

  // BONUS: Write tests that validates the output json. Use the function you have written in "src/todo.ts".
});

describe('Conversion', () => {
  describe('convertEntity', () => {
    it('Should convert an input entity to a converted entity', () => {
      use(deepEqualinAnyOrder);
      const entities = inputJson.documents[0].entities as Entity[];
      const convertedEntities = entities.map(convertEntity);

      expect(convertedEntities).to.deep.equalInAnyOrder(outputJson.documents[0].entities);
    });
  });
});
