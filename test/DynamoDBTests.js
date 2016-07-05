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
  before(() => {
    db = DynamoDB.create(Region);
  });

  const wrapInPromise = data => ({promise: async () => ({ data: data }) });

  describe('#listTablesAsync', () => {
    let tableNames = { TableNames: [ 'table1', 'table2', 'table3' ] };
    beforeEach(() => {
      const stubbedTables = { Items: tableNames };
      sinon.stub(db._db, "listTables", () => wrapInPromise(stubbedTables));
    });

    it("should return a list of tables to scale.", async function(){
      let result = await db.listTablesAsync();
      result.Items.should.equal(tableNames);
    });
  });
});
