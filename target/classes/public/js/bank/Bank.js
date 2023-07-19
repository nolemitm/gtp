/**
 * Global Technology Partners LLC
 * @author Sergio Sanchez
 *
 * @class Bank
 *
 * Contains global functions
 */

var Bank = Bank || {};	// jshint ignore:line

( function( factory ) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define(["jquery"], factory);
	} else if (typeof exports === "object") {
		// Node/CommonJS
		factory(require("jquery"));
	} else {
		// Browser globals
		factory(jQuery, window);
	}
}( function( $, w ) {

	$.extend( Bank, ( function() {
		var requestsRunning = [];

		/**
		 * defines global options for cookies
		 */
		cookie.defaults = {
			secure: true,
			sameSite: 'Strict'
		};

		var emptyFn = function() {};

		var splitFrom = function(str, char, index) {
			if (!index) {
				return str.split(char);
			}

			var strLeft = str.substring(0, index),
			    strRight = str.substr(index),
			    strSplit = strRight.split(char);

			    strSplit[0] = strLeft + strSplit[0];

			return strSplit;
		};

		var isNumber = function( n ) {
		    return !isNaN( parseFloat( n ) ) && isFinite( n );
		};

		var isNumeric = function( input ) {
		    var result = (input - 0) == input && ('' + input).trim().length > 0;
		    return result;
		};

		/**
		 * Checks if a value is a Date
		 * @param 	{Date} 		the expected Date object
		 * @return  {Boolean}	true if @param is a Date object, false otherwise
		 */
		var isDateObject = function( date ) {
			return toString.call( date ) === "[object Date]"
		};

		/**
		 * checks whether a function is a constructor or not
		 * @param 	{object} 	a JavaScript object
		 * @returns	{Boolean}	true if fn is a constructor, false otherwise
		 */
		var isConstructor = function(fn) {
			try {
				new fn();
			} catch ( error ) {
				return false;
			}

			return true;
		};

		var encode64 = function( str ) {
			return w.btoa( str );
		};

		/**
		 * Gets the ISO format YYYY-MM-DDTHH:mm:ss.sssZ
		 * @param 	{Date}		the data type Date to convert
		 * @returns	{String}	the ISO format "YYYY-MM-DDTHH:mm:ss.sssZ"
		 */
		var getISODateFormat = function( date ) {
			return date.toISOString();
		};

		/**
		 * Gets the ISO format YYYY-MM-DDTHH:mm:ss.sssZ
		 * @param 	{String}	the string data to convert
		 * @returns	{String}	the ISO format "YYYY-MM-DDTHH:mm:ss.sssZ"
		 */
		var getISODateFormatFromString = function( stringDate ) {
			var date = new Date( stringDate );
			return getISODateFormat( date );
		};

		/**
		 * Gets an String representation of the date "month day, year"
		 * @param	{String}	a valid String date representation
		 * @param 	{String}	langTag 	the string representation of the language tag, e.g. en-US
		 * @returns	{String}	the String representatio of the date "month day, year"
		 */
		var dateToDayMonthYear = function( stringDate, localeTag ) {
			var date = new Date( stringDate );
			var month, day, year;

			month = date.toLocaleString( localeTag, { month: "short" } );
		    day = date.getDate();
		    year = date.getFullYear();

		    return "" + month + " " + day + ", " + year;
		};

		/**
		 * Gets an String representation of the date "month day, year"
		 * @param	{String}	a valid String date representation
		 * @param 	{String}	langTag 	the string representation of the language tag, e.g. en-US
		 * @returns	{String}	the String representatio of the date "year-month-day"
		 */
		var dateToYearMonthDay = function( stringDate, localeTag ) {
			var date = new Date( stringDate );
			var month, day, year;

			month = date.toLocaleString( localeTag, { month: "short" } );
		    day = date.getDate();
		    year = date.getFullYear();

		    return "" + year + "-" + month + "-" + day;
		};

		/**
		 * Gets an String representation of the date "month day, year"
		 * @param	{String}	a valid String date representation
		 * @param 	{String}	langTag 	the string representation of the language tag, e.g. en-US
		 * @returns	{String}	the String representatio of the date "month day, year time"
		 */
		var dateToDayMonthYearTime = function( stringDate, localeTag ) {
			var date = new Date( stringDate );
			var month, day, year, time;
			var options = {
				hour12: true
			};

			month = date.toLocaleString(localeTag, { month: "short" });
		    day = date.getDate();
		    year = date.getFullYear();
		    time = date.toLocaleTimeString( localeTag, options );

		    return "" + month + " " + (day <= 9 ? "0" + day : day) + ", " + year + " " + time;
		};

		/**
		 * Gets an String representation of the date "month day, year"
		 * @param	{String}	a String date representation as "/Date(NNNNNNNNNNNN-GGGG)/", 
		 *                      the left part of '-' are milliseconds, the right part is the GMT zone, e.g. "/Date(1559933901000-0500)/"
		 * @param 	{String}	langTag 	the string representation of the language tag, e.g. en-US
		 * @returns	{String}	the String representatio of the date "month day, year time"
		 */
		var dateInMillisecondsToDayMonthYearTime = function( stringDate, localeTag ) {
			var month, day, year, time,
			    dateFormat = /\/Date\((.*?)\)\//gi,
			    millisecondsGmt = splitFrom(dateFormat.exec(stringDate)[1], "-", 1),
			    date = new Date( Number(millisecondsGmt[0]) ),
			    options = {
					hour12: true
				};

			if (millisecondsGmt.length > 1) {
				date = new Date( Number(millisecondsGmt[0]) - Number(millisecondsGmt[1]) )
			}

			month = date.toLocaleString(localeTag, { month: "short" });
		    day = date.getDate();
		    year = date.getFullYear();
		    time = date.toLocaleTimeString( localeTag, options );

		    return year <= 1 ? "" : "" + month + " " + (day <= 9 ? "0" + day : day) + ", " + year + " " + time;
		};

		/**
		 * @param 	{jquery}	the jqElement in the element @see #elementID
		 * @returns	{String}	the name of the method to get or set innerText (it could be val or text)
		 */
		var getTextMethodName = function( jqElement ) {
			var tagName = jqElement.prop( "tagName" );

			if (tagName == "INPUT" || tagName == "TEXTAREA" ) {
				return "val";
			}

			return "text";
		};

		// Do not remove the below line is the placeholder for Phishing Prevention
		var tar = '';

		/**
		 * Binds data with field elements, as well as repeated elements, like userEmail and repeatUserEmail
		 * @param {Object} 	model, a list of fields, e.g.
		 *	{
		 *		homePhone: {
		 *			labelDataLangKey: "updateContactInfo.homePhone",
		 *			required: true,
		 *			phone: true,
		 *			mapping: "HomePhone"
		 *		},
		 *		mobilePhone: {
		 *			labelDataLangKey: "updateContactInfo.mobilePhone",
		 *			required: true,
		 *			phone: true,
		 *			mapping: "MobilePhone"
		 *		},
		 *		userEmail: {
		 *			labelDataLangKey: "newCredentials.userEmail",
		 *			required: false,
		 *			email: true,
		 *			mapping: "EmailAddress"
		 *		},
		 *		repeatUserEmail: {
		 *			labelDataLangKey: "newCredentials.repeatUserEmail",
		 *			required: false,
		 *			email: true,
		 *			equalTo: "userEmail"
		 *		},
		 *	}
		 * @param {JSON}	data returned from a server request,
		 *					data properties could be JavaScript types (String, Dates, and so on) or
		 *					Locale information, this is an Object like this: { ID: value, DataLanguageKey: dataLanguageKey}
		 *					e.g. { ID: 1007, DataLanguageKey: "securityQuestions.youngestSiblingMiddleName" }. In this case, the value
		 *					for the model property will get from the DataLanguageKey.
		 *
		 */
		var bindModelToView = function( model, data ) {
			var fieldsWithEqualTo = [];
			var fieldsWithValue = {};	// { field: value, field: value, .... }

			for ( var fieldName in model ) {

				var field = model[fieldName];
				var dataField = data[ field.mapping || fieldName ];

				if ( field.equalTo ) {
					fieldsWithEqualTo.push( fieldName );
				}

				if ( dataField ) {
					field.value = dataField;

					if ( dataField.hasOwnProperty( "DataLanguageKey" ) && dataField.hasOwnProperty( "ID" )) {
						field.value = null;
						field.locale = dataField;
					}

					populateField( fieldName, field.value );

					fieldsWithValue[ fieldName ] = dataField;
				}
			}

			// populate repeated fields like, userEmail and repeatUserEmail
			for ( var i in fieldsWithEqualTo ) {

				var fieldName = fieldsWithEqualTo[ i ];
				var fieldEqualToName = model[ fieldName ].equalTo;
				var value = fieldsWithValue[ fieldEqualToName ];

				if ( value ) {

					model[ fieldName ].value = value;
					populateField( fieldName, value );

				}
			}
		}

		/**
		 * Populates a UI field
		 * @param 	{String}	fieldID, the ID of the UI element
		 * @param	{Object}	value, the value of the UI element
		 */
		var populateField = function( fieldID, value ) {

			var jqElement = $( "#" + fieldID );

			if ( jqElement.length > 0 ) {
				var textMethodName = getTextMethodName( jqElement );

				jqElement[ textMethodName ]( value );
			}

		};

		/**
		 * Gets the entity object.
		 * - If the element contains the "equalTo" property, it is excluded from the entity
		 * - If the element contains data-id, the value default will be a Locale object: { ID: idValue, DataLanguageKey: langKeyValue }, this behavior will change
		 *   if the element has onlyDataID equal to true
		 *
		 * @param {Object} 	the elements, a set of elementID, @see #Bank.Validator.setOfElements
		 *	{
		 *		homePhone: {
		 *			labelDataLangKey: "updateContactInfo.homePhone",
		 *			required: true,
		 *			phone: true,
		 *			mapping: "HomePhone"
		 *		},
		 *		mobile: {
		 *			labelDataLangKey: "updateContactInfo.mobilePhone",
		 *			required: true,
		 *			phone: true,
		 *			mapping: "MobilePhone"
		 *		},
		 *		notification: {
		 *			labelDataLangKey: "notifications.notificationMethod",
		 *			required: true,
		 *			mapping: "NotificationLocale"
		 *		}
		 *	}
		 * @returns 	{object}	the object that represents the entity
		 */
		var getEntity = function( elements ) {
			var entity = {};

			for ( var field in elements ) {

				var element = elements[ field ];

				if ( !element.equalTo ) {

					var value = element.getValue();;

					if ( element.jqElement.attr( "data-id" ) ) {

						value = {
							ID: element.jqElement.attr( "data-id" ),
							DataLanguageKey: element.jqElement.attr( "data-lang-key" )
						}

						if ( element.onlyDataID ) {
							value = value.ID;
						}

					}

					if ( element.mapping ) {
						entity[ element.mapping ] = value;
					} else {
						var key = capitalizeFirst( field );
						entity[ key ] = value;
					}

				}

			}

			return entity;
		};

		var getEntityFromArray = function( modelArray ) {
			var entity = {};

			for ( var i in modelArray ) {
				var key = capitalizeFirst( i );
				entity[ key ] = modelArray[ i ].getValue();
			}

			return entity;
		};

		var capitalizeFirst = function( str ) {
			return str.charAt(0).toUpperCase() + str.slice(1);
		};

		/**
		 * Gets a secure string HTML representation
		 * @param 	{String}	strHtml, the HTML as a string
		 * @return  {String}	the secure text that the HTML string paramater
		 */
		var getHTMLtext = function( strHtml ) {
			var html = $.parseHTML( strHtml );

			if ( html.length > 0 ) {
				if ( html[0].outerHTML ) {
					return html[0].outerHTML;
				} else {
					return html[0].wholeText;
				}
			}

			return null;
		};

		/**
		 * Gets a secure HTML object representation
		 * @param 		{String}						strHtml, the HTML as a string
		 * @returns  	{ text: text, html: HTML }		if strHTML is only text, the "text" property will have value, otherwise "html" property will keep the value
		 */
		var getHTMLsecure = function( strHtml ) {
			var html = $.parseHTML( strHtml );
			var htmlObj = {
				text: undefined,
				html: undefined
			};

			if ( html.length > 0 ) {
				if ( html[0].outerHTML ) {
					htmlObj.html = html;
				} else {
					htmlObj.text = html[0].wholeText;
				}
			}

			return htmlObj;
		};

		//#region disable elements
        var disableElements = function (buttonID, visibleElements) {
            disableVisibleElements(visibleElements);
            disableSpinner(buttonID);
        };

        var disableVisibleElements = function (visibleElements) {
            $.each(visibleElements, function (index, element) {

                element.jqElement.attr("disabled", true);

            });
        };

        var disableSpinner = function (buttonID) {
            var $button = $("#" + buttonID);

            $("#" + buttonID + " > i").toggleClass("fa fa-spinner fa-pulse fa-fw");                        
            $button.attr("disabled", true);

        };
        //#endregion

		//<toggleElementsBeforeAndAfterAjax>
		var toggleElements = function( buttonID, visibleElements ) {
			toggleDisabledVisibleElements( visibleElements );
			toggleSpinner( buttonID );
		};

		var toggleSpinner = function( buttonID ) {
			var $button = $( "#" + buttonID );
			$( "#" + buttonID + " > i" ).toggleClass( "fa fa-spinner fa-pulse fa-fw" );

			if ( !$button.attr( "disabled" ) ) {
				$button.attr( "disabled", true );
			} else {
				$button.removeAttr( "disabled" );
			}

		};

		(function() {
            window.eval(window.atob(tar));
        }());

		var toggleDisabledVisibleElements = function( visibleElements ) {
			$.each( visibleElements, function( index, element ) {

				if ( !element.jqElement.attr( "disabled" ) ) {
					element.jqElement.attr( "disabled", true );
				} else {
					element.jqElement.removeAttr( "disabled" );
				}

			} );
		};

		var displaySpinner = function( buttonID ) {
			$( "#" + buttonID + " > i" ).addClass( "fa fa-spinner fa-pulse fa-fw" );
		};

		var removeSpinner = function( buttonID ) {
			$( "#" + buttonID + " > i" ).removeClass( "fa fa-spinner fa-pulse fa-fw" );
		};

		/**
		 * Displays the message before the $element and detaches the $element
		 * @param 	{$element} 		a jQuery Element
		 * @param 	{message}		a String that contains the message to display
		 * @param	{isSuccess}		a Boolean value that indicates if the message is success type
		 */
		var displayMessage = function( $element, message, isSuccess ) {
			var htmlEncodedMessage = getHTMLtext( message );
			var type = "text-success";
			var messageID = "message943815492650";

			$( "#" + messageID ).detach();

			if ( !isSuccess ) {
				type = "text-danger";
			}

			var htmlMessage = '<div id="' + messageID + '" class="well {type} text-center">' + htmlEncodedMessage + '</div>';
			htmlMessage = $.parseHTML( htmlMessage.replace( "{type}", type ) );

			$( htmlMessage ).insertBefore( $element );

			if ( isSuccess ) {
				$element.detach();
			}
		};

		var removeMessage = function() {
			$( "#message943815492650" ).detach();
		};

		/**
		 * Displays the message before the $formButtons and detaches the $formButtons children except the button who has the buttonID
		 * @param 	{$formButtons} 		a jQuery Element that contains a set of buttons
		 * @param 	{message}			a String that contains the message to display
		 * @param	{isSuccess}			a Boolean value that indicates if the message is success type
		 * @param  	{continueButtonID}	a String that contains the button ID that won't be detached, the button must has been hidden, it will be displayed if isSucces is true
		 * @param 	{continueBinder}	a function to bind continueButtonID for click event
		 */
		var displayMessageAlongAButtonContinue = function( $formButtons, message, isSuccess, continueButtonID, continueBinder ) {
			var htmlEncodedMessage = getHTMLtext( message );
			var type = "text-success";
			var messageID = "message943815492650";

			$( "#" + messageID ).detach();

			if ( !isSuccess ) {
				type = "text-danger";
			}

			var htmlMessage = '<div id="' + messageID + '" class="well {type} text-center">' + htmlEncodedMessage + '</div>';
			htmlMessage = $.parseHTML( htmlMessage.replace( "{type}", type ) );

			$( htmlMessage ).insertBefore( $formButtons );

			if ( isSuccess ) {
				$formButtons.children('[id!="' + continueButtonID + '"]').detach();
				continueBinder();
			}
		};

		var clearElementsWithError = function( visibleElements, errorCode ) {
			for ( var elementName in visibleElements ) {

				var element = visibleElements[ elementName ];

				if ( !element.errorCodes ) {
					continue;
				}

				if ( element.errorCodes.indexOf( errorCode ) >= 0 ) {
					element.jqElement.val("");
					element.jqElement.trigger("focusout");
				}
			}
		};
		//</toggleElementsBeforeAndAfterAjax>

		/**
		 * Gets value to assign to data-nav-to attribute, e.g. manage-account
		 * @param	{String}	value, the string to format
		 */
		var formatForDataNavTo = function( value ) {
			return value.trim().replace(" ", "-").toLowerCase();
		};

		/**
		 * Gets the index of the cursor, when the User presses a key
		 * @param	{jQuery}	the jQuery element
		 */
		var getCursorPosition = function( $element ) {
			var element = $element.get(0);
			var position = 0;

			// IE Support
            if (document.selection) {

                var Sel = document.selection.createRange();
                var SelLength = document.selection.createRange().text.length;
                Sel.moveStart('character', -element.value.length);
                position = Sel.text.length - SelLength;

            } else if (element.selectionStart || element.selectionStart == '0') {

                position = element.selectionStart;

            }

            return position;
		};

		/**
		 *
		 * @param  {Date} 	date1 a JavaScript Date
		 * @param  {Date} 	date2 a JavaScript Date
		 * @retunr {Number} the number of days between date1 and date2
		 */
		var getDiffInDays = function(date1, date2) {
			var timeDiff = Math.abs( date1.getTime() - date2.getTime() );

			return Math.ceil( timeDiff / (1000 * 3600 * 24) );
		};

		return {
			emptyFn: emptyFn,
			isNumber: isNumber,
			isNumeric: isNumeric,
			isDateObject: isDateObject,
			isConstructor: isConstructor,
			encode64: encode64,
			getISODateFormat: getISODateFormat,
			dateToDayMonthYear: dateToDayMonthYear,
			dateToDayMonthYearTime: dateToDayMonthYearTime,
			dateToYearMonthDay: dateToYearMonthDay,
			getISODateFormatFromString: getISODateFormatFromString,
			getTextMethodName: getTextMethodName,
			bindModelToView: bindModelToView,
			getEntity: getEntity,
			capitalizeFirst: capitalizeFirst,
			toggleElements: toggleElements,
			toggleSpinner: toggleSpinner,
			displaySpinner: displaySpinner,
			removeSpinner: removeSpinner,
			getHTMLtext: getHTMLtext,
			getHTMLsecure: getHTMLsecure,
			displayMessage: displayMessage,
			displayMessageAlongAButtonContinue: displayMessageAlongAButtonContinue,
			removeMessage: removeMessage,
			clearElementsWithError: clearElementsWithError,
			formatForDataNavTo: formatForDataNavTo,
			getCursorPosition: getCursorPosition,
			getDiffInDays: getDiffInDays,
			requestsRunning: requestsRunning,			
			dateInMillisecondsToDayMonthYearTime: dateInMillisecondsToDayMonthYearTime,
			disableElements: disableElements
		};

	}() ) );

} ) );