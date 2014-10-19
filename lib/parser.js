'use strict';
var fs = require('fs'),
    parse = require('csv-parse'),
    transform = require('stream-transform');

var Parser = function(logger) {
    logger = logger || require('winston');
    
    var that = this,
        surnameStarts = ['DI', 'DE', 'DEL'],
        surnameDouble = ['CONTI BORBONE', 'MANCINI CILLA', 'TOR MASSONI', 'PALA NORCINI', 'COCCI GRIFONI'],
        nameDouble = ['MARIA', 'ANNA', 'PAULA', 'PIO', 'ENRICO', 'GIAN', 'NAZARIO', 'ANDREA', 'MARCO', 'GIULIO', 'GIANLUCA', 'P.'],
        misunderstood = [],
        corrected = [],
        noemail = [];

    this.parseName = function (name) {
        if (!name)
            return [];
        var tokens = name.split(' ');
        if (!tokens || tokens.length < 2)
            return [];

        var result = [];
        var toLog = false;

        var zeroOne = tokens[0] + ' ' + tokens[1];
        if (surnameStarts.indexOf(tokens[0].toUpperCase()) >= 0 || 
                surnameDouble.indexOf(zeroOne.toUpperCase()) >= 0) {
            toLog = true;
            tokens[1] = zeroOne;
            tokens.shift();
        }
        if (tokens.length === 2)
            result = [tokens[1], tokens[0]]

        if (tokens.length === 3 && nameDouble.indexOf(tokens[1].toUpperCase()) >= 0) {
            toLog = true;
            result = [tokens[1] + ' ' + tokens[2], tokens[0]]
        }

        if (toLog) {
            corrected.push([name].concat(result));
        }

        return result;
    };

    this.parseCsv = function (filePath, cb) {
        fs.readFile(filePath, {encoding: 'utf8'}, function (err, data) {
            parse(data, {columns: true, delimiter: ';'}, function (err, parsed) {
                transform(parsed, function (record) {
                    if (record && record['COGNOME E NOME'] !== ''){
                        var names = that.parseName(record['COGNOME E NOME']);
                        if (!names || names.length < 2)
                            misunderstood.push(record);
                        else if (!record['posta elettronica'] || (record['posta elettronica'].indexOf('@') === -1))
                            noemail.push(record);
                        else
                            return {
                                name: names[0],
                                surname: names[1],
                                email: record['posta elettronica']
                            };
                    }
                }, function (err, output) {
                    logAll(output);
                    cb(output);
                });         
            });
        });
    };

    var logAll = function (output) {
        if (output)
            for (var i = 0; i <= output.length - 1; i++) {
                logger.info('insert n.%d: ', i, output[i]);
            };
        logger.info('--------------------------------------------');
        for (var i = 0; i <= corrected.length - 1; i++) {
            logger.info('corrected n.%d: ', i, corrected[i]);
        };
        logger.info('--------------------------------------------');
        for (var i = 0; i <= misunderstood.length - 1; i++) {
            logger.warn('misunderstood n.%d: ', i, misunderstood[i]);
        };
        logger.info('--------------------------------------------');
        for (var i = 0; i <= noemail.length - 1; i++) {
            logger.info('noemail n.%d: ', i, noemail[i]);
        };
    };
};

module.exports = Parser;
