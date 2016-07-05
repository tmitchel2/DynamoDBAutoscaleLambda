/* @flow */
/* eslint-disable */
// $FlowIgnore
import DynamoDB from '../src/aws/DynamoDB';
import * as chai from 'chai';
import { Region } from '../src/configuration/Region';
import sinon from 'sinon';
import AWS from 'aws-sdk-promise';

let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;

console.log('runnng tests');
let db;
describe('dynamodb', () => {
  it('test', async () => {
    db = DynamoDB.create(Region);
    let x = sinon.stub(db._db, "listTables", () => [ 'test-table' ]);
    let y = await db.listTablesAsync();
    expect(x).to.equal([ 'test-table' ]);
  });

  describe('#listTablesToScaleAsync', () => {
    it("should return a list of tables to scale.", async function(){
      let testPromise = db.listTablesAsync();
      let result = await testPromise;
      expect(result.TableNames).to.have.length.above(0);
    });
  });

  describe('#listTablesToScaleAsync', () => {
    it("should return a list of tables to scale.", async function(){
      let testPromise = db.listTablesToScaleAsync();
      let result = await testPromise;
      expect(result.TableNames).to.have.length.above(0);
    });
  });
});
