/* @flow */
/* eslint-disable */
// $FlowIgnore
import DynamoDB from '../src/aws/DynamoDB';
import * as chai from 'chai';
import { Region } from '../src/configuration/Region';

let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;

console.log('runnng tests');

describe('dynamodb', () => {
  describe('#listTablesToScaleAsync', () => {
    beforeEach(function(done) {
      this.timeout(10000); // A very long environment setup.
      setTimeout(done, 2500);
    });

    let db = DynamoDB.create(Region);
    it("should return a list of tables to scale.", async function(){
      let testPromise = db.listTablesToScaleAsync();
      let result = await testPromise;
      expect(result.TableNames).to.have.length.above(0);
    });
  });
});
