'use strict';

require('es6-promise').polyfill();
require('isomorphic-fetch');

var fs = require('fs');
var sut = require('../lib');
var expect = require('chai').expect;
var fetchMock = require('fetch-mock');

var input = fs.readFileSync(__dirname + '/input.json', 'utf-8').replace(/\r\n/g, '\n');
var output = fs.readFileSync(__dirname + '/output.md', 'utf-8').replace(/\r\n/g, '\n');

fetchMock.registerRoute([{
  name: 'bamboo',
  matcher: 'http://bamboo.mydomain.com:8085/rest/api/latest/result/PLAN-KEY/123?os_authType=basic&expand=changes.change.files',
  response: { body: input }
}]);

describe('bamboo-release-notes', function () {
  beforeEach(function () {
    fetchMock.mock({ greed: 'bad' });
  });
  afterEach(function () {
    fetchMock.reset();
    fetchMock.restore();
  });
  it('should call the correct bamboo API', function (done) {
    sut({
      bambooServer: 'http://bamboo.mydomain.com:8085',
      bambooUserName: 'john.doe',
      bambooPassword: 'password',
      buildPlan: 'PLAN-KEY',
      buildNumber: '123'
    }).then(function (result) {
      expect(fetchMock.called('bamboo')).to.equal(true);
    }).then(done, done);
  });
  it('should create the expected output document', function (done) {
    sut({
      bambooServer: 'http://bamboo.mydomain.com:8085',
      bambooUserName: 'john.doe',
      bambooPassword: 'password',
      buildPlan: 'PLAN-KEY',
      buildNumber: '123'
    }).then(function (result) {
      expect(result).to.equal(output);
    }).then(done, done);
  });
});
