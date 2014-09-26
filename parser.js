#!/bin/env node
var fs = require('fs');
var parse = require('csv-parse');
var transform = require('stream-transform');

var app = function() {
	var surnameStarts = ['DI', 'DE', 'DEL'];
	var surnameDouble = ['CONTI BORBONE', 'MANCINI CILLA', 'TOR MASSONI', 'PALA NORCINI', 'COCCI GRIFONI'];
	var nameDouble = ['MARIA', 'ANNA', 'PAULA', 'PIO', 'ENRICO', 'GIAN', 'NAZARIO', 'ANDREA', 'MARCO', 'GIULIO', 'GIANLUCA', 'P.'];

	var misunderstood = [];
	var corrected = [];

	var parseName = function (name) {
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

	fs.readFile(__dirname + '/data/Soci14-15.csv', {encoding: 'utf8'}, function (err, data) {
		parse(data, {columns: true, delimiter: ';'}, function (err, parsed) {
			transform(parsed, function (record) {
				if (record && record['COGNOME E NOME'] !== ''){
					var names = parseName(record['COGNOME E NOME']);
					if (!names || names.length < 2)
						misunderstood.push(record);
					else
						return names.concat(record['posta elettronica']);
				}
			}, function (err, output) {
				if (output)
					console.log(output);
				console.log('--------------------------------------------');
				console.log('corrected:');
				console.log(corrected);
				console.log('--------------------------------------------');
				console.log('misunderstood:');
				console.log(misunderstood);
			});			
		});
	});

	
};

app();