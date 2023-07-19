/**
 * Global Technology Partners LLC
 * @author 	Sergio Sanchez
 * @date	2017-03-02
 *
 * @class Bank.TimeoutDisplayer.js
 *
 * Displays an alert to the User in order to keep the session alive
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

	bank = bank || {};

	var btnKillSessionID = "keepSessionNoThanks";
	var btnKeepSessionID = "keepSessionYes";

	var _options = {
		/**
		 * jqElement to attach the popover
		 */
		$popover: null,
		/**
		 * Popover title
		 */
		title: null,
		/**
		 * Position of the Popover with respect to the $popover element
		 * bottom by default
		 */
		placement: "bottom",
		/**
		 * HTML content for the Popover
		 */
		htmlContent: null,
		/**
		 * Data HTML true by default,
		 * false if content is only text.
		 */
		dataHTML: true,
		/**
		 * Principal text content
		 * it is displayed at the center of the Popover
		 */
		textContent: null,
		/**
		 * Text for the "No Thanks" button
		 */
		noThanks: null,
		/**
		 * Text for the "Yes" button
		 */
		yes: null
	};

	function TimeoutDisplayer( options ) {

		options.htmlContent = getHTMLContent( options.htmlContent );

		$.extend( _options, options );

		if ( !_options.htmlContent ) {
			setDefaultHTMLContent();
		}

	}

	TimeoutDisplayer.prototype.show = function() {

		_options.$popover.attr( "data-toggle", "popover" )
			.attr( "title", _options.title )
			.attr( "data-content", _options.htmlContent )
			.attr( "data-placement", _options.placement )
			.attr( "data-html", _options.dataHTML );

		// Initializes Bootstrap popover
		_options.$popover.popover();

		onPopoverShown();

		_options.$popover.popover( "show" );

	};

	TimeoutDisplayer.prototype.destroy = function() {

		destroy();

	};

	/**
	 * Attaches jQuery $popover.on() method to TimeoutDisplayer on() method
	 */
	TimeoutDisplayer.prototype.on = function( eventName, handler ) {

		_options.$popover.on( eventName, handler );

	};

	var getHTMLContent = function( htmlContent ) {

		return bank.getHTMLtext( htmlContent );

	};

	var setDefaultHTMLContent = function() {
		// note: I changed button to span tag because for some wierd reason the buttons were removed, 
		// but span tags are not removed, something related to the popover plugin
		var htmlContent = '<div id="timeoutAlert"  class="tab-content">' +
		    '<div class="well">' +
		      '<span>' + _options.textContent + '</span>' +
		    '</div>' +
		    '<hr>' +
			  '<div class="blockquote-reverse">' +
		        '<span id="keepSessionNoThanks" type="button" class="btn btn-default">' +
		          _options.noThanks +
		        '</span> ' +
		        '<span id="keepSessionYes" type="button" class="btn btn-default">' +
		          _options.yes +
		        '</span>' +
		      '</div>' +
		    '<hr>' +
		  '</div>';

		_options.htmlContent = bank.getHTMLtext( htmlContent );
	};

	var destroy = function() {

		_options.$popover.popover( "destroy" );

	};

	var onPopoverShown = function() {

		_options.$popover.on( "shown.bs.popover", function() {
			bindKillSession();
			bindKeepSession();
			_options.$popover.off( "click" );
		} );

	}

	function bindKillSession() {

		$( "#" + btnKillSessionID ).on( "click", function() {
			_options.$popover.trigger( "timeoutDisplayer.killSession" );
			destroy();
		} );

	}

	function bindKeepSession() {

		$( "#" + btnKeepSessionID ).on( "click", keepSession );

	}

	function keepSession() {
		_options.$popover.trigger( "timeoutDisplayer.keepSession" );
		destroy();
	}

	bank.TimeoutDisplayer = TimeoutDisplayer;

} ) );