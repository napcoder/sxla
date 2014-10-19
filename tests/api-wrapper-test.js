'use strict';
/*global describe, beforeEach, it*/
var chai = require('chai'),
    ApiWrapper = require('../lib/api-wrapper'),
    should = chai.should(),
    expect = chai.expect;
var logger = {
    log: function () {},
    debug: function () {},
    info: function () {},
    error: function () {}
};
var mcapi = {
    Mailchimp: function () { return; }
};
describe('ApiWrapper', function () {
    var apiWrapper = new ApiWrapper(mcapi, null, null, logger);

    describe('isValidElement', function() {
        it('should return true for valid element', function() {
            var element = {
                email: 'asd@asd.com'
            };

            apiWrapper.isValidElement(element).should.be.true;
        });
        it('should return false for undefined element', function () {
            apiWrapper.isValidElement(undefined).should.be.false;
        });
        it('should return false if email is not defined', function () {
            var element = {};
            apiWrapper.isValidElement(element).should.be.false;
        });
    });

    describe('toMcObject', function() {
        it('should return the complete mailchimp object', function() {
            var input = {
                email: 'asd@asd.com',
                name: 'myName',
                surname: 'mySurname'
            };

            var expected = {
                email: {email: 'asd@asd.com'},
                merge_vars: {FNAME: 'myName', LNAME: 'mySurname'}
            };

            var result = apiWrapper.toMcObject(input);

            expect(result).to.not.be.undefined;
            result.should.be.deep.equal(expected);
        });
        it('should return the mailchimp without merge_vars', function() {
            var input = {
                email: 'asd@asd.com'                
            };

            var expected = {
                email: {email: 'asd@asd.com'}
            };

            var result = apiWrapper.toMcObject(input);

            expect(result).to.not.be.undefined;
            result.should.be.deep.equal(expected);
        });
    });
});