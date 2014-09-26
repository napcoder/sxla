#!/bin/env node
'use strict';

var Parser = require('./lib/parser');

var app = new Parser();
app.parseCsv(__dirname + '/data/Soci14-15.csv');