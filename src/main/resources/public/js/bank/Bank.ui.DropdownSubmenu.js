/**
 * Global Technology Partners LLC
 * @author			Sergio Sanchez
 * @date			2017-06-23
 *
 * @class 			Bank.ui.DropdownSubmenu
 *
 * @description		Allows to create dropdown submenu
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
} ( function( $, bank ) {

	bank.ui = bank.ui || {};

	bank.ui.DropdownSubmenu = $.extend( {}, ( function() {

		var bindDropdownSubmenus = function() {

			$('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
				event.preventDefault();
				event.stopPropagation();
				$(this).parent().siblings().removeClass('open');
				$(this).parent().toggleClass('open');
			});

		};

		return {
			bindDropdownSubmenus: bindDropdownSubmenus
		};

	}( ) ) );
} ) );
