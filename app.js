#!/bin/env node
'use strict';

var winston = require('winston'),
	path = require('path'),
    mcapi = require('mailchimp-api'),
    Parser = require('./lib/parser'),
    ApiWrapper = require('./lib/api-wrapper');

var date = new Date();
date = date.toJSON().replace(/(-|:)/g, '.');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { level: 'silly'});
winston.add(winston.transports.File, { 
    filename: path.join('./', 'logs', 'sxla' + date + '.log'),
    level: 'silly',
    timestamp: true
});

winston.info('*********** APPLICATION STARTED ***********');

var apiKey = process.env.MAILCHIMP_SXLA_API_KEY;
var listId = process.env.MAILCHIMP_SXLA_LIST_ID;
winston.debug('apiKey: ', apiKey);
winston.debug('listId: ', listId);

var api = new ApiWrapper(mcapi, apiKey, listId, winston);

var parser = new Parser(winston);
parser.parseCsv(__dirname + '/data/soci14-15.csv', function (data) {
	api.batchSubscribe(data);
});
