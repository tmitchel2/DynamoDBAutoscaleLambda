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
  beforeEach(() => {
    db = DynamoDB.create(Region);
  });

  const wrapInPromise = data => ({promise: async () => ({ data: data }) });
  describe('#listTablesToScaleAsync', () => {
    let tableName = 'table1';
    beforeEach(() => {
      db = DynamoDB.create(Region);
      const stubbedTables = { Items: [ { TableName:{ S: tableName } } ] } ;
      sinon.stub(db._db, "scan", () => wrapInPromise(stubbedTables));
    });

    it("should return a list of tables to scale.", async function(){
      let result = await db.listTablesToScaleAsync();
      result.TableNames[0].should.equal(tableName);
    });
  });
});
