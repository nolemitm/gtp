/**
 * Global Technology Partners LLC
 * @author Sergio Sanchez
 *
 * @class Bank.ui.Dropdown
 *
 * Fixes Bootstrap issue when displaying a dropdown
 * inside of a smaller container than the dropdown list.
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

	bank.ui.Dropdown = $.extend( {}, ( function() {

		var listElementSelector = ".gtp-dropdown__menu li a";
		var dropdownSelector = ".gtp-dropdown";
		var dropupSelector = ".gtp-dropup";
		var menuSelector = ".gtp-dropdown__menu";
		var textElementSelector = ".gtp-dropdown__text";
		var toggleSelector = ".gtp-dropdown--toggle";
		var dataIdAttributeSelector = "data-id";
		var dropupClass = "gtp-dropup";

		/**
		 * Picks the text from the dropdown list
		 * @param	{jQuery Element}	the jQuery list element, that wrap an element like the below one
		 * 								<li><a href="#" tabindex="-1" data-id="0" data-lang-key="notifications.noNotification"></a></li>
		 */
		var pickText = function( $listElement ) {
			var text = $listElement.text();
			var $dropdownElement = $listElement.parents( dropupSelector )  || $listElement.parents( dropdownSelector );
			var $textElement = $dropdownElement.children( textElementSelector );

			$textElement.text( text );

			return $textElement;
		};

		/**
		 * Picks the dat-id attribute from the jQuery list element and set
		 * that attribute in the jQuery text element of the dropdown
		 */
		var setDataIdAttribute = function( $listElement, $textElement ) {
			var id = $listElement.attr( dataIdAttributeSelector );

			if ( id ) {
				$textElement.attr( dataIdAttributeSelector, id );
			}
		};

		/**
		 * Gets the height of the dropdown list based on Bootstrap definition:
		 * - item height is 20 for mobile devices and tablets, 27 for others
		 */
		// var getHeight = function( $dropdownMenu ) {
		// 	// TODO device detection
		// 	var itemHeight = 28.75;

	 //        return $dropdownMenu.children().length * itemHeight;
		// };

		/**
		 * Fixes the position of the dropdown list along with the text element
		 * @param	{jQuery Element}	the dropdown text
		 * @param	{jQuery Element}	the dropdown menu
		 * @param	{Boolean}			indicates where the dropdown list will be display
		 *								- true to place it over the text element
		 *								- false to place it under the text element
		 */
		// var dropdownFixPosition = function( $dropdownText, $dropdownMenu, isUp ) {
	 //        var dropdownTextPosition = $dropdownText.offset();
	 //        var dropdownTextPositionTop = dropdownTextPosition.top;

	 //        if (isUp) {
	 //            dropdownTextPositionTop -= getHeight($dropdownMenu);
	 //        } else {
	 //            dropdownTextPositionTop += $dropdownText.outerHeight();
	 //        }

	 //        $dropdownMenu.css('top', dropdownTextPositionTop + "px");
	 //        $dropdownMenu.css('left', dropdownTextPosition.left + "px");
	 //    };

	    var bindListElements = function() {
	    	$( listElementSelector ).on( "click", function() {
	    		var $listElement = $( this );
	    		var $textElement = pickText( $listElement );

	    		setDataIdAttribute( $listElement, $textElement );

				$textElement.trigger("focusout");
	    	} );
	    };

	    // var bindToggleButtons = function() {
	    // 	$( toggleSelector ).each( function( index, element ) {
	    // 		var $element = $( element );

	    // 		$element.on( "click", function() {
		   //  		var me = $( this );
			  //       var parent = me.parent();
			  //       var dropdownText = parent.children( textElementSelector );
			  //       var dropdownMenu = parent.children( menuSelector );
			  //       dropdownFixPosition(dropdownText, dropdownMenu, parent.hasClass( dropupClass ));
		   //  	} );
	    // 	});
	    // };

	    var bindDropdowns = function() {
	    	bindListElements();
	    	//bindToggleButtons();
	    };

	    return {
	    	bindDropdowns: bindDropdowns
	    };

	}( ) ) );
} ) );