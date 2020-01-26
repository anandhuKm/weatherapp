var request = require('supertest');
var config = require('../config.js')
// var app = require('../server.js');
var port = config.apps.port
var url = 'localhost:'+port

describe('GET /test',function(){
    it('respond with Stockholm',function(done){
        request(url).get('/test').expect('Stockholm',done);
    });
});

// var assert = require('assert');
// describe('Array', function() {
//   describe('#indexOf()', function() {
//     it('should return -1 when the value is not present', function() {
//       assert.equal([1, 2, 3].indexOf(4), -1);
//     });
//   });
// });