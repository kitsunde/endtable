/**
 * A Simple mapper built on top of CouchDB designed to
 * store validation and other semantic information within the
 * couch documents themselves.
 */

require.paths.unshift(__dirname);
var sys = require('sys');
var simpleInheritance = require('../dep/simple-inheritance');
var arrayHelpers = require('array-helpers');

exports.Endtable = Class.extend({
	
	defaults: {
		port: 5984,
		host: 'localhost',
		user: '',
		password: '',
		database: 'development',
		connectorClass: 'couch-connector',
	},
	
	init: function( params ) {
		arrayHelpers.extend(this, this.defaults, params);
		this.initConnection();
		this.connect();
	},
	
	initConnection: function() {
		var connectorClass = require(this.connectorClass);
		this.connector = new connectorClass.connector({
			port: this.port,
			host: this.host,
			user: this.user,
			password: this.password,
			database: this.database
		});
	},
	
	connect: function() {
		this.connector.connect();
	},
	
	loadDocument: function(params, callback) {
		var _this = this;

		this.connector.loadDocument(params, function(error, doc) {
			if (error && error.error == 'not_found') {
				_this.connector.createView(params, function(error, doc) {
					
				});
			}
		});
	}
});