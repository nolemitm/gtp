/**
 * Global Technology Partners LLC
 * @author 	Sergio Sanchez
 * @date	2017-04-05
 *
 * @class Bank.ConfigLoader
 *
 * Bank config loader
 */

( function( factory ) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define(["jquery", "Bank", "Bank.Init"], factory);
	} else if (typeof exports === "object") {
		// Node/CommonJS
		factory(require("jquery", "Bank", "Bank.Init"));
	} else {
		// Browser globals
		factory(jQuery, Bank, Bank.Init);
	}
} (function( $, bank, init ) {

	bank.ConfigLoader = $.extend( {}, ( function() {

		/**
		 * Events
		 *
		 * @event
		 * configLoader.loaded
		 * trigger after the config.js is loaded
		 */
		var onLoaded = "configLoader.loaded";

		/**
		 * @event
		 * configInitial.loaded
		 * triggered after the config-initial.js is loaded
		 */
		var onInitialLoaded = "configInitial.loaded";

		/**
		 * Loads the Bank config file
		 * @trigger {onLoaded} 	event after the file is loaded
		 */
		var loadConfig = function() {
			var configPath = init.getBanksFolder() + "/" + init.getBankName() + "/config.js";

			getConfig( configPath, onLoaded );
		};

		/**
		 * Loads the Bank config initial file only if the User is logged in
		 * @trigger {onLoaded} 	event after the file is loaded
		 */
		var loadConfigInitial = function() {
			var configPath = init.getBanksFolder() + "/" + init.getBankName() + "/config-initial.js";

			getConfig( configPath, onInitialLoaded );
		};

		/*var getConfig = function( configPath, successEvent ) {

			$.getScript( configPath, function( script, textStatus, jqxhr ) {

				$( bank.ConfigLoader ).triggerHandler( successEvent );

			} );

		};*/

		/**
		 * Loads a Bank config file and specify the content type, 
		 * since when the file does not exists the content type header is not set up
		 * @trigger {onLoaded} 	event after the file is loaded
		 */
		var getConfig = function( configPath, successEvent ) {

			$.ajax({
				url: configPath,
  				dataType: "script",
  				contentType: 'application/javascript;charset=UTF-8',
			}).done(function( data, textStatus, jqXHR) {

				$( bank.ConfigLoader ).triggerHandler( successEvent );

			});

		};

	    return {
	    	loadConfig: loadConfig,
	    	loadConfigInitial: loadConfigInitial
	    };

	}() ) );

} ) );