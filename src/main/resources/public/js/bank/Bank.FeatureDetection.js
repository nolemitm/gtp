/**
 * Global Technology Partners LLC
 * @author 	Sergio Sanchez
 * @date	2017-04-11
 *
 * @class Bank.FeatureDetection
 *
 * Conditionally check to see if a specific feature is available in a browser
 */

( function( factory ) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define(["jquery", "Bank", "Bank.Init", "Modernizr"], factory);
	} else if (typeof exports === "object") {
		// Node/CommonJS
		factory(require("jquery", "Bank", "Bank.Init", "Modernizr"));
	} else {
		// Browser globals
		factory(jQuery, Bank, Bank.Init, Modernizr);
	}
} (function( $, bank, init, Modernizr ) {

	bank.FeatureDetection = $.extend( {}, ( function() {
		var imageFolder = "images/"; //init.getBanksFolder() + "/" + init.getBankName() + "/images/";
		var logoPath = imageFolder + "icon-select.png"; //"logo.png";
		var styleBankLogo = '#modernizr { content: url(' + logoPath + '); }';

		var testFeatures = function() {
			addTestForMsSaveBlob();
			addTestForMsSaveOrOpenBlob();
			addTestForBlob();
			addTestForMobile();
		};

	    var addTestForMsSaveBlob = function() {
	    	Modernizr.addTest( "mssaveblob", function() {

	    		if ( window.navigator[ 'msSaveBlob' ] ) {
	    			return true;
	    		}

	    		return false;

	    	} );
	    };

	    var addTestForMsSaveOrOpenBlob = function() {
	    	Modernizr.addTest( "mssaveoropenblob", function() {

	    		if ( window.navigator[ 'msSaveOrOpenBlob' ] ) {
	    			return true;
	    		}

	    		return false;

	    	} );
	    };

	    var addTestForBlob = function() {
	    	Modernizr.addTest( "blob", function() {

	    		if ( window.Blob ) {
	    			return true;
	    		}

	    		return false;

	    	} );
	    };

	    var addTestForMobile = function() {
	    	Modernizr.addTest( "mobile", function() {

	    		if( navigator.userAgent.indexOf("Mobile") > -1 ) {
	    			return true;
	    		}

	    		return false;
	    	} );
	    };

	    return {
	    	testFeatures: testFeatures
	    };

	} ( ) ) );
} ) );