/**
 * Global Technology Partners LLC
 * @author 	Sergio Sanchez
 * @date	2017-03-24
 *
 * @class Bank.SessionTimeout
 *
 * Manages session time out
 * - Displays a message 1 minute before the session expires.
 * - Gives the option to the User to keep the session alive.
 */

( function( factory ) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define(["jquery", "Bank"], factory);
	} else if (typeof exports === "object") {
		// Node/CommonJS
		factory(require("jquery", "Bank"));
	} else {
		// Browser globals
		factory(jQuery, Bank);
	}
} (function( $, bank ) {

	bank.SessionTimeout = $.extend( {}, ( function() {

		var _timeoutDisplayer;

		var _sessionTimeout = {
			timeout: null,
			alert: {
				/*
				 * if timeout - lastActionTime <= displyAt
				 * an alert will be display to the user
				 */
				displayAt: null
			},
			watcher: null,
			watcherInterval: null,
			sessionKiller: null,
			lastActionTime: null
		};



		var init = function( timeoutDisplayer ) {
			_timeoutDisplayer = timeoutDisplayer;

			_sessionTimeout.timeout = bank.Init.getTimeoutMiliseconds();
			_sessionTimeout.alert.displayAt = 0.9 * _sessionTimeout.timeout;
			_sessionTimeout.watcherInterval = 0.1 * _sessionTimeout.timeout;

			registerAjaxStop();
			watcher();
			bindLogout();
			bindCancelLogout();
		};

		/**
		 * Updates last action time property of _sessionTimeout object
		 */
		var updateLastActionTime = function() {

			_sessionTimeout.lastActionTime = new Date();

		};

		var registerAjaxStop = function() {

			$( document ).ajaxStop( function() {
				updateLastActionTime();
			} );

		};

		var displayAlert = function() {
			var currentTime = new Date();

			if ( ( currentTime - _sessionTimeout.lastActionTime ) >= _sessionTimeout.alert.displayAt ) {
				clearInterval( _sessionTimeout.watcher );
				_sessionTimeout.watcher = null;

				_timeoutDisplayer.show();

				scheduleLogout();
			}

		};

		var watcher = function() {
			_sessionTimeout.watcher = window.setInterval( displayAlert, _sessionTimeout.watcherInterval );

		};

		var scheduleLogout = function() {
			var currentTime = new Date();
			var remainingTime = _sessionTimeout.timeout - ( currentTime - _sessionTimeout.lastActionTime );

			_sessionTimeout.sessionKiller = window.setTimeout( bank.Init.logoff, remainingTime );
		};

		var cancelLogout = function() {

			clearTimeout( _sessionTimeout.sessionKiller );
			_sessionTimeout.sessionKiller = null;
			resetSession();

		};

		var bindCancelLogout = function() {

			_timeoutDisplayer.on( "timeoutDisplayer.keepSession", function() {
				cancelLogout();
			} );

		};

		var bindLogout = function() {

			_timeoutDisplayer.on( "timeoutDisplayer.killSession", function() {
				bank.Init.logoff();
			} );

		};

		var resetSession = function() {

			var cardService = bank.Init.getCardService();

			$.ajax({
				url: cardService.baseUrl + "session", //"CardService.svc/v2/session",
				headers: {
					From: cardService.header.id,
					Authorization: 'GTP ' + cardService.header.encodedKey,
					IEAuth: 'GTP ' + cardService.header.encodedKey
				},
				type: "POST",
				contentType: 'application/json',
        		error: function( jqXHR, textStatus, errorThrown ) {
        			bank.Init.logoff();
        		},
        		success: function( data, textStatus, jqXHR ) {
        			watcher();
					updateLastActionTime();
        		},
        		complete: function( jqXHR, textStatus ) {

        		}
			});

		};

		return {
			init: init
		};

	}() ) );

} ) );