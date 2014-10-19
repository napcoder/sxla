#!/bin/env node
'use strict';

var winston = require('winston'),
    Parser = require('./lib/parser'),
    ApiWrapper = require('./lib/api-wrapper'),
    mcapi = require('mailchimp-api');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { level: 'silly'});
winston.add(winston.transports.File, { 
    filename: path.join('./', 'logs', 'sxla.log'),
    level: 'silly',
    timestamp: true
});

var apiKey = process.env.MAILCHIMP_SXLA_API_KEY;
var listId = process.env.MAILCHIMP_SXLA_LIST_ID;
logger.debug('apiKey: ', apiKey);
logger.debug('listId: ', listId);

var api = new ApiWrapper(mcapi, apiKey, listId, winston);

var parser = new Parser(winston);
parser.parseCsv(__dirname + '/data/Soci14-15.csv');
