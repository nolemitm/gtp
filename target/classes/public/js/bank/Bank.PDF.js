/**
 * Global Technology Partners LLC
 * @author 	Sergio Sanchez
 * @date	2019-01-22
 *
 * @class Bank.PDF
 *
 * Keeps session values
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
} ( function($, bank) {

	bank = bank || {};

	bank.PDF = $.extend( {}, ( function() {

		const LOGO_RATIO = 0.7;

		var margins = {
			left: 15,
			interSpace: 15
		};

		var header = {
			top: {
				color: undefined,
				height: 0
			},
			bottom: {
				color: undefined,
				height: 3
			},
			logo: {
				x: undefined,
				y: undefined,
				height: undefined,
				width: undefined
			}
		};

		var body = {
			tableTitle: {
				x: margins.left,
				y: undefined
			},
			autoTable: {
				headStyles: undefined
			}
		};

		var getRgbColors = function(rgb) {
			var rgbColors = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

			return {
				r: Number(rgbColors[1]),
				g: Number(rgbColors[2]),
				b: Number(rgbColors[3])
			};
		}

		var setHeader = function() {
			var $head = $( "#masthead-dash" ),
				$logo = $( "div.bank-logo" ),
				$logout = $( ".button.logout" ),
				logoHeight = LOGO_RATIO * $logo.height(),
				headHeight = logoHeight * 1.4;

			header = $.extend( true, header, {
				top: {
					color: getRgbColors( $head.css("background-color") ),
					height: headHeight
				},
				bottom: {
					color: getRgbColors( $logout.css("background-color") ),
					y: headHeight
				},
				logo: {
					height: logoHeight,
					width: LOGO_RATIO * $logo.width(),
					x: margins.left,
					y: ( headHeight - logoHeight ) / 2					
				}
			} );
		};

		var setBody = function() {
			var headColor = getRgbColors( $("#sidebar").css("background-color") ),
			    customerInfoY = header.top.height + header.bottom.height + margins.interSpace;
			    tableTitleY = customerInfoY + margins.interSpace;

			body = $.extend( true, body, {
				customerInfo: {
					y: customerInfoY 
				},
				tableTitle: {
					y: tableTitleY 
				},
				autoTable: {					
					headStyles: {
						fillColor: [headColor.r, headColor.g, headColor.b]
					},
					y: tableTitleY + margins.interSpace
				}
			});
		};

		var getDimensions = function() {
			setHeader();
			setBody();

			return {
				margins: margins,
				header: header,
				body: body
			}
		}

		return {
			getDimensions: getDimensions
		};

	}() ) );

} ) );