'use strict';
/*global describe, beforeEach, it*/
var chai = require('chai'),
    Parser = require('../lib/parser'),
    should = chai.should(),
    expect = chai.expect;
var logger = {
    log: function () {},
    debug: function () {},
    info: function () {},
    error: function () {}
};
describe('Parser', function () {
    var parser = new Parser(logger);

    describe('parseName', function () {
        [undefined, null, '', '  ', 'asd', '1 2 3 4 5', 'Rocchio Quaranta Sette'].forEach(function (element) {
            it('should return empty array when invalid name is given: "' + element + '"', function () {
                var result = parser.parseName(element);
                result.should.be.empty;
                expect(result).to.not.be.undefined;
            });
        });

        ['DI', 'DE', 'DEL'].forEach(function (element) {            
            it('should concatenate pre-surname to surname: "' + element + '"', function() {
                var result = parser.parseName(element + ' SURNAME NAME');
                expect(result).to.not.be.undefined;
                result.should.be.deep.equal(['NAME', element + ' SURNAME']);
            });
        });

        ['CONTI BORBONE', 'MANCINI CILLA', 'TOR MASSONI', 'PALA NORCINI', 'COCCI GRIFONI'].forEach(function (element) {
            it('should concatenate double surname: "' + element + '"', function() {
                var result = parser.parseName(element + ' NAME');
                expect(result).to.not.be.undefined;
                result.should.be.deep.equal(['NAME', element]); 
            })
        });

        ['MARIA', 'ANNA', 'PAULA', 'PIO', 'ENRICO', 'GIAN', 'NAZARIO', 'ANDREA', 'MARCO', 'GIULIO', 'GIANLUCA', 'P.'].forEach(function (firstName) {
            it('should concatenate first and second name: "' + firstName + '"', function() {
                var result = parser.parseName('SURNAME ' + firstName + ' SECONDNAME');
                expect(result).to.not.be.undefined;
                result.should.be.deep.equal([firstName + ' SECONDNAME', 'SURNAME']);   
            })
        })

        it('should parse very long name', function() {
            var result = parser.parseName('DI LODOVICO MARIA RITA');
            expect(result).to.not.be.undefined;
            result.should.be.deep.equal(['MARIA RITA', 'DI LODOVICO']);   
        })
    });
});