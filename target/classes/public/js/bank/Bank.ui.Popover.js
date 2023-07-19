/**
 * Global Technology Partners, LLC
 * @author 	Sergio Sanchez
 * @date	2017-03-15
 *
 * Bank.ui.Popover.js
 *
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

	bank.ui = bank.ui || {};

	var _timeToDestroy = 3000;
	var _success = {
		textClass: "text-success",
		glyphicon: "glyphicon-ok"
	};
	var _error = {
		textClass: "text-danger",
		glyphicon: "glyphicon-remove"
	};

	/**
	 * Constructor for a Popover next to an element
	 * @param 	{jqElement}		$element: 	a jQuery element, the popover will be placed next to this "HTML element"
	 * @param	{String}		title: 		the title for the popover
	 * @param	{String}		content: 	the message to display inside of the popover
	 * @param	{Boolean}		success: 	indicates if the popover will show up in success or error mode.
	 */
	function Popover( $element, title, content, success ) {
		var textClass = _success.textClass;
		var glyphicon = _success.glyphicon;

		if ( !success ) {
			textClass = _error.textClass;
			glyphicon = _error.glyphicon;
		}

		var glyphiconHTML = '<span class="' + textClass + '"><span class="glyphicon ' + glyphicon + '"></span></span>';
		var buttonElement = $.parseHTML( '<button type="button" class="btn btn-default">' + glyphiconHTML + '</button>' );

		this.$popover = $(buttonElement).insertBefore($element);

		if (!success) {
			this.$popover.on("click", this.destroy.bind(this));
		}

		this.$popover.attr( "data-toggle", "popover" )
			.attr( "title", title )
			.attr( "data-content", content )
			.attr("data-placement", "top");

		// Initializes Bootstrap popover
		this.$popover.popover();
	}

	Popover.prototype.show = function() {
		//this.$popover.trigger("click");
		this.$popover.popover('show');
	};

	/*
	 * Shows and destroys a popover after _timeToDestroy has passed
	 * @param 	{function}	fn, a function to execute when the _timeToDestroy has passed
	 */
	Popover.prototype.showAndDestroy = function( fn ) {
		this.show();
		setTimeout(this.destroy.bind(this, fn), _timeToDestroy);
	}

	Popover.prototype.destroy = function( fn ) {
		this.$popover.removeAttr("data-toggle")
			.removeAttr("title")
			.removeAttr("data-content")
			.removeAttr("data-placement")
			.popover('hide');

		this.$popover.detach();

		if ( typeof fn == "function" ) {
			fn();
		}
	}

	bank.ui.Popover = Popover;

} ) );