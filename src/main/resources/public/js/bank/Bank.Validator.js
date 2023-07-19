/**
 * Global Technology Partners LLC
 * @author 	Sergio Sanchez
 * @date 	2017-02-24
 *
 * @class Bank.Validator
 *
 * Implements validation Bootstrap compatible.
 * Since the messages to validate are defined in a locale object,
 * it is required the current locale is already loaded
 * otherwise the Validator does nothing
 */

( function( factory ) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define(["jquery", "Bank", "Bank.Translator"], factory);
	} else if (typeof exports === "object") {
		// Node/CommonJS
		factory(require("jquery", "Bank", "Bank.Translator"));
	} else {
		// Browser globals
		factory(jQuery, Bank, Bank.Translator);
	}
} ( function( $, bank, translator) {

	$.fn.extend({
        /**
         * gets the value of the property 'checked'
         */
        chkVal: function() {
        	return this.prop('checked');
        }
	});

	bank.Validator = $.extend( {}, ( function() {

		/**
		 * @event
		 * validator.afterValidation
		 * triggered after a validation has been completed @see #bindElements
		 */
		var _onAfterValidation = "validator.afterValidation";

		/**
		 * @event
		 * validator.beforeSubmit
		 * triggered after a form-button is clicked
		 */
		var _onBeforeSubmit = "validator.beforeSubmit";

		/**
		 * Bootstrap style classes
		 */
		var errorTextStyle = "text-danger";
		var warningTextStyle = "text-warning";
		var validatorMessagesStyle = "validator-messages";

		/**
		 * Minimum Valid ID
		 */
		var _minValidID = 0;

		/**
		 * {@link #viewDescriptor}
		 *  Set of partial view descriptors, each partial view descriptor is a set of elements
		 *  {
		 *		partialViewDescriptorName: {
		 *							{ setOfElements }
		 *		},
		 *		...,
		 *		...,
		 *		...,
		 *	};
		 *
		 *	An example of a viewDescriptor would be:
		 *
		 *	{
		 *		transfer: {
		 * 				recipientLastName: {
		 *					labelDataLangKey: "transferFunds.recipientLastName",
		 *					required: true
		 *				},
		 *				customerID: {
		 *					labelDataLangKey: "transferFunds.customerID",
		 *					required: true
		 *				},
		 *				amount: {
		 *					labelDataLangKey: "transferFunds.amount",
		 *					required: true,
		 *					preventer: "preventNonNumeric"
		 *				}
	     *			},
	 	 *  	code: {
	 	 *				transferCode: {
	 	 *					labelDataLangKey: "transferFunds.pinCode.transferCode",
	 	 *					required: true
	 	 *			}
	 	 *		}
		 *	}
		 *
		 * {@link #setOfElements}
		 *  Set of elements. It is an Object array like, below are the properties allowed
		 *	 {
		 *		// the elementID matches with the id in the HTML mark-up
		 *		// e.g. <input id="elementID" type="text"></input>
		 *		// {@link #elementID}
		 *		elementID: {
		 *			// the data lang key associated with this field @see #Bank.locale.en-US
		 *			// this is required, e.g. newCredentials.newUserName
		 *			// @required
		 *			labelDataLangKey: {String},
		 *
		 *			required: {Boolean},		// true | false
		 *			minlength: {Number},
		 *			maxlength: {Number},
		 *
		 *			// type should be in the mark-up: "date", "number", etc.
		 *			// more info at: https://www.w3.org/TR/html5/forms.html#attr-input-min
		 *			type: String,
		 *
		 *			// range depends on the attribute "type"
		 *			// some examples:
		 *			// <input name=bday type=date max="1979-12-31">
		 *			// <input name=quantity required="" type="number" min="1" value="1">
		 *			// <input name="sleepStart" type=time min="21:00" max="06:00" step="60" value="00:00">
		 *			min: {Object},
		 *			max: {Object},
		 *
		 *			// email
		 *			// validates a valid email
		 *			email: {Boolean},
		 *
		 *			// phone
		 *			// validates a valid phone
		 *			phone: {Boolean},
		 *
		 *			// one uppercase required
		 *			// validates if the value contains at least one Upper case
		 *			oneUpperCaseRequired: {Boolean},
		 *
		 *			// one lowercase required
		 *			// validates if the value contains at least one Lower case
		 *			oneLowerCaseRequired: {Boolean},
		 *
		 *			// one number required
		 *			// validates if the value contains at least one Number
		 *			oneNumberRequired: {Boolean}
		 *
		 *			// four consecutive numbers are not allowed
		 *			// validates if the value contains 4 consecutive numbers
		 *			fourConsecutiveNumbersAreNotAllowed: {Boolean}
		 *
		 *			// four sequencial numbers are not allowed
		 *			// validates if the value contains 4 sequencial numbers
		 *			fourSequentialNumbersAreNotAllowed: {Boolean}
		 *
		 *			// Minimum valid ID
		 *			// validates if the ID for the element is Greater or equal than _minValidID
		 *			selectValidID: {Boolean}
		 *
		 *			// consecutive numbers are not allowed
		 *			// validates if the value contains consecutive numbers
		 *			consecutiveNumbersAreNotAllowed: {Boolean}
		 *
		 *			// UserID format
		 *			// - must starts with a letter
		 *			// - special symbols can be used after the first 6 characters
		 *			// - "-" and "_" are valid
		 *			// - numbers are valid
		 *			userIDFormatRequired: {Boolean}
		 *
		 *			// Multiple of 100
		 *			multipleOf100: {Boolean}
		 *
		 *			// Decimal
		 *			// validates if the value is a decimal with a precision (p) and scale (s), where 0 <= s <= p
		 *			// e.g. decimal: "5, 2" would be a number that has at most 3 digits before the decimal and at most 2 digits after the decimal
		 *			// #decimal
		 *			decimal: {String}
		 *
		 *(?=.*[_\W])        // use positive look ahead to see if at least one underscore or non-word character exists
.+                 // gobble up the entire string
$                  // the end of the string
		 *
		 *			// contains the id of the element to compare
		 *			// for example if you have the two below elements in the mark-up
		 *			//
		 *			// <input id="password" type="password" />
		 *			// <input id="repeatPassword" type="password" />
		 *			//
		 *			// you should define the element as follow:
		 *			//
		 *			// 		repeatPassword: {
		 *			//			equalTo: "password"
		 *			//		}
		 *			//
		 *			equalTo: {equalToElementID}
		 *
		 *			***********************************************************************************************************
		 *			******************************     properties created dinamically     *************************************
		 *			***********************************************************************************************************
		 *
		 *			// the label property is created based on labelDataLangKey
		 *			label: {String},
		 *
		 *			// the label property is created based on labelDataLangKey from equalToElementID
		 *			equalToLabel: {String},
		 *
		 *			// jQuery object is created based on elementID, equal to $( "elementID" )
		 *			// @see #generatejqElement
		 *			jqElement: {jQuery Object},
		 *
		 *			// the valid state
		 *			valid: {Object},
		 *
		 *			// { [ String ] } the array of validation messages
		 *			messages: [],
		 *
		 *			// gets the inner text on the element
		 *			// uses jqElement to get this value
		 *			getValue: {Object}
		 *		}
		 *	};
		 */
		var _view;

		/**
		 * {@link #validators}
		 * Rules to create the validator:
		 * 1.- The name of the validator must match to the name of the rule in the view, i.e. required, minlength, etc.
		 * 2.- The only parameter allowed for the validator function is the element @see #elementID
		 * 3.- In some cases it is needed to validate the field only when it has a value (e.g. empty string is not a value)
		 */
		var _validators = {
			selectValid: function( element ) {
				let id = element.jqElement.attr( "data-id" );

				if ( id != -1 ) {
					return true;
				}

				return false;
			},
			required: function( element ) {
				if ( element.getValue().length > 0 ) {
					return true;
				}

				return false;
			},
			minlength: function( element ) {
				var value = element.getValue();

				if ( !value ) {
					return true;
				}

				if ( value.length >= element.minlength ) {
					return true;
				}

				return false;
			},
			maxlength: function( element ) {
				var value = element.getValue();

				if ( !value ) {
					return true;
				}

				if ( value.length <= element.maxlength ) {
					return true;
				}

				return false;
			},
			min: function( element ) {
				var value = element.getValue();

				if ( !value ) {
					return true;
				}

				if ( value >= element.min ) {
					return true;
				}

				return false;
			},
			max: function( element ) {
				var value = element.getValue();

				if ( !value ) {
					return true;
				}

				if ( value <= element.max ) {
					return true;
				}

				return false;
			},
			equalTo: function( element ) {

				var elementEqualTo = getElement( element.equalTo );

				if ( !elementEqualTo ) {
					throw new ReferenceError("if equalTo is defined for an element, the equalTo object has to exists with a valid labelDataLangKey, element: " + element);
				}

				if ( element.getValue() === elementEqualTo.getValue() ) {
					return true
				}

				return false;
			},
			email: function( element ) {
				var emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,10}$/i;
				var value = element.getValue();

				if ( value ) {
					return emailPattern.test( value );
				}

				return true;
			},
			phone: function( element ) {
				var phonePattern = /^[0-9]*$/;
				var value = element.getValue();

				if ( value ) {
					return phonePattern.test( value );
				}

				return true;
			},
			blanksAreNotAllowed: function( element ) {
				var value = element.getValue();

				if (value) {
					return value.indexOf(" ") == -1;
				}

				return true;
			},
			oneUppercaseRequired: function( element ) {
				var oneUppercasePattern = /(?=.*[A-Z])/;
				var value = element.getValue();

				if (value) {
					return oneUppercasePattern.test( value );
				}

				return true;
			},
			oneLowercaseRequired: function( element ) {
				var oneLowercasePattern = /(?=.*[a-z])/;
				var value = element.getValue();

				if (value) {
					return oneLowercasePattern.test( value );
				}

				return true;
			},
			oneNumberRequired: function( element ) {
				var oneNumberPattern = /(?=.*\d)/;
				var value = element.getValue();

				if (value) {
					return oneNumberPattern.test( value );
				}

				return true;
			},
			fourConsecutiveNumbersAreNotAllowed: function( element ) {
				var consecutiveNumbersPattern = /(^|(.)(?!\2))(\d)\3{3}(?!\3)/;
				var value = element.getValue();

				if (value) {
					return !consecutiveNumbersPattern.test( value );
				}

				return true;
			},
			fourSequentialNumbersAreNotAllowed: function( element ) {
				var sequencialNumbersPattern = /^(0123|1234|2345|3456|4567|5678|6789|3210|4321|5432|6543|7654|8765|9876)$/;

				var value = element.getValue();

				if (value) {
					return !sequencialNumbersPattern.test( value );
				}

				return true;
			},
			consecutiveNumbersAreNotAllowed: function( element ) {
				var consecutiveNumbersPattern = /(\d)\1{3}/;		// any number of consecutive numbers
				var value = element.getValue();

				if (value) {
					return !consecutiveNumbersPattern.test( value );
				}

				return true;
			},
			selectValidID: function( element ) {
				var id = element.jqElement.attr( "data-id" );

				if (id) {
					return id >= _minValidID;
				}

				return true;
			},
			userIDFormatRequired: function( element ) {
				var userIDPattern = /^[a-zA-Z][\w_-]{5,}/;	// must start with a letter, special symbols can be used after six characters
				var value = element.getValue();

				if (value) {
					return userIDPattern.test( value );
				}

				return true;
			},
			multipleOf100: function( element ) {
				var multipleOf100Pattern = /^[1-9]+[0-9]*00$/;
				var value = element.getValue();

				if (value) {
					return multipleOf100Pattern.test( value );
				}

				return true;
			},
			decimal: function( element ) {
				var value = element.getValue();

				if ( value ) {
					return decimalValid( value, element.decimal );
				}

				return true;
			},
			onlyLettersAndSymbols: function( element ) {
				var value = element.getValue(),
					validCharactes = /[a-zA-Z0-9!@#$%&=\?_.,:;\-\^]/g,
				    charactersNotValid;

				if ( value ) {
					charactersNotValid = value.replace( validCharactes, '' );

					return charactersNotValid.length == 0;
				}

				return true;
			},
			backslashNotAllowed: function( element ) {
				var value = element.getValue();

				if ( value ) {
					return value.indexOf('\\') == -1;
				}

				return true;
			},
			alphaNumeric: function( element ) {
				var value = element.getValue();

				if ( value ) {
					return alphaNumericValid( value );
				}

				return true;
			},
			alphaNumericAndBlanks: function( element ) {
				var value = element.getValue();

				if ( value ) {
					return alphaNumericAndBlanksValid( value );
				}

				return true;
			},
			selected: function( element ) {
				return element.jqElement.prop("checked");
			}
		};

		/**
		 * Warnings
		 * Contains functions to allow displaying warning messages
		 */
		var _warnings = {
			empty: function( element ) {
				if ( element.getValue().length == 0 ) {
					return true;
				}

				return false;
			}
		};

		/**
		 * Preventers
		 * Contains functions to prevent User inputs
		 */
		var _preventers = {
			/**
			 * Prevents the User enter non numeric values
			 * Example of how to use it:
			 * 		elementID: {
			 *			preventer: "preventNonNumeric"
			 * 		}
			 */
			preventNonNumeric: function( event ) {
				var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;				

				if ( key < 48 || key > 57 ) {					
					// chack for special keys
					if ( 
		                key != 8 /* backspace */ &&
		                key != 9 /* tab */ &&
		                key != 13 /* enter */ &&
		                key != 35 /* end */ &&
		                key != 36 /* home */ &&
		                key != 37 /* left */ &&
		                key != 39 /* right */	                
		            ) {
		                return false;
		            } 
				}

				return true;
			},
			/*
			 * Prevents the User enter a non decimal value
			 * This preventer can be used in combination with "decimal" validator, so, if the element is define as follow
			 * 		elementID: {
			 *			....
			 *			decimal: "5,2",
			 *			preventer: "preventNonDecimal"
			 *		}
			 *
			 * The User can only enter decimals like 12.45 but not 12.456 neither 1234, see #decimal
			 */
			preventNonDecimal: function( event ) {
				var $self = $( this ),
				    prevValue = $self.val(),
				    element = event.data.element,
				    key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0,
				    allow = true;

				if ( key < 48 || key > 57 ) {

					if ( 
						( key == 46 && hasDecimalPoint( $self ) ) || // if there is decimal point already, disallow to enter it again
		                key != 8 /* backspace */ &&
		                key != 9 /* tab */ &&
		                key != 13 /* enter */ &&
		                key != 35 /* end */ &&
		                key != 36 /* home */ &&
		                key != 37 /* left */ &&
		                key != 39 /* right */ &&
		                key != 46 /* del */
		            ) {
		                allow = false;
		            } 

				} else if ( element && element.decimal ) {

					var position = bank.getCursorPosition( $self );
					var posibleDecimal = insertString( prevValue, event.key, position );

					if ( !decimalValid( posibleDecimal, element.decimal ) ) {
						allow = false;
					}
				}

				return allow;
			}
		};

		/**
		 * Inserts a new value in a string at the position given
		 * @param 	{String}	value, the string where the new value will be inserted
		 * @param 	{String}	newValue, the new value to be inserted
		 * @param 	{Number}	position, the position wher the new value will be inserted at
		 */
		var insertString = function( value, newValue, position ) {
			var leftValue = value.substring( 0, position );
			var rightValue = value.substring( position );

			return leftValue + newValue + rightValue;
		};

		/**
		 * Initializes the validation for the elements passed as view paramenter
		 * @param  {Object} 	the View descriptor @see #viewDescriptor
		 */
		var validate = function( view, validators, preventers, warnings ) {
			_view = view;
			$.extend( _validators, validators );
			$.extend( _preventers, preventers );
			$.extend( _warnings, warnings );
			bind();
			validateBeforeSubmit();
		};

		/**
		 * {@link #bind}
		 * Binds "focusout" event for each element in the view descriptor
		 */
		var bind = function() {
			for ( var partialViewName in _view ) {
				bindElements( _view[ partialViewName ], partialViewName );
			}
		};

		/**
		 * {@link #bindElements}
		 * Binds "focusout" event for each element in the view parameter
		 * @param 	{Object} 	the Partial View Descriptor @see #partialViewDescriptor
		 */
		var bindElements = function( partialViewDescriptor, partialViewName ) {
			for (var elementID in partialViewDescriptor ) {

				// element is {Object} e.g. _partialViewDescriptor.elementId
				var element = partialViewDescriptor[elementID];

				// labelDataLangKey is required
				if ( !element.labelDataLangKey ) {
					continue;
				}

				generateLabel( element );
				generateEqualToLabel( element, partialViewName );
				generatejqElment( element, elementID );

				if ( element.jqElement ) {

                    generateGetValue(element);

                    // elements type hidden are valid, they are not validated
                    if (element.jqElement.attr("type") === "hidden") {
                        element.valid = true;
                        continue;
                    }

					generateValidators( element );
					generateWarning( element );

					if ( element.jqElement.prop( "type" ) == "checkbox" ) {

						// validation for checkbox is triggered on click and on focusout
						element.jqElement.on( "click", function( event ) {

							setElement( this );

						} );	
						
					}

					element.jqElement.on( "focusout", function( event ) {

						setElement( this );

					} );

					if ( element.preventer && _preventers[ element.preventer ] ) {
						element.jqElement.on( "keypress", { element: element }, _preventers[ element.preventer ] );
					}
				}
			}

			for (var elementID in partialViewDescriptor ) {
				var element = partialViewDescriptor[elementID];

				if ( element.jqElement ) {
					setElementValid( element );	
				}				
			}
		};

		// @private
		var setElement = function( element ) {

			var $element = $( element );
			var selfElement = getElement( $element.attr( "id" ) );

			setElementValid( selfElement );
			setElementHasWarning( selfElement );
			toggleErrorMessages( selfElement );

			$element.trigger( _onAfterValidation, [ selfElement ] );	

		};

		/**
		 * Binds ".form-buttons" to "click" event,
		 * validates visible HTML elements on click and
		 * triggers "validator.beforeSubmit" event along with the validation result and
		 * the set of visible elements whose type is {element} @see #elementID
		 */
		var validateBeforeSubmit = function() {
			 var $buttons = getButtons();

			 $buttons.on( "click", function( event ) {
			 	var $button = $( this );
			 	var partialView = getPartialView();

			 	$button.trigger( _onBeforeSubmit, partialView );

			 } );
		};

		/**
		 * Defines if the view is valid
		 * @param 	{Object}	set of elements  @see #elementID
		 * @returns {Boolean}	true if the view is valid, false otherwise
		 */
		var isValid = function( view ) {
			for( var element in view ) {
				if ( !view[ element ].valid ) {
					return false;
				}
			}

			return true;
		};

		/**
		 * Gets the partial view whose elements are visible
		 * @returns 	{}
		 */
		var getPartialView = function() {
			var partialView = {
				// is the entire view valid?, only true if visible and no visible elements are valid, true by default
				// valid property has impact on wizards
			 	valid: true,
			 	// are the visible elements valid?, true by default
			 	// visibleValid property has impact on wizards
			 	visibleValid: true,
			 	// name of the partialView,
			 	// it is used as the virtual path on GET and POST requests
			 	name: null,
                visibleElements: null,
                // Elements that are defined in the Partial View and in the web page but they are not visible
                // are considered hidden
                hiddenElements: null,
			 	elements: null
			};

            // look for visible elements to determine which is the partialView
			for ( var partialViewName in _view ) {
				setVisibleElements( _view[ partialViewName ], partialView );

				if ( partialView.visibleElements ) {
					partialView.name = partialViewName;
					partialView.elements = _view[ partialViewName ];
					setPartialViewValid( partialView );
					break;
				}
			}

            // If visible elements were found, the name of the partialView has been defined
            if (partialView.name) {
                // set hidden elements if there are any
                setHiddenElements(_view[partialView.name], partialView);
            } else {
                // look for hidden elements to determine which is the partialView
                for (var partialViewName in _view) {
                    setHiddenElements(_view[partialViewName], partialView);

                    if (partialView.hiddenElements) {
                        partialView.name = partialViewName;
                        partialView.elements = _view[partialViewName];
                        break;
                    }
                }
            }

			if ( !partialView.visibleElements && !partialView.hiddenElements ) {
				partialView.valid = undefined;
			}

			return partialView;
		};

		/**
		 * Sets visibleElements property of the partialView object
		 * @param 	{PartialViewDescriptor}		view, @see #partialViewDescriptor
		 * @param 	{PartialView}				partialView, @see #partialView
		 */
		var setVisibleElements = function( view, partialView ) {
            for (element in view) {

		 		if ( view[ element ].jqElement.is( ":visible" ) ) {
		 			var objElement = {};
		 			objElement[ element ] = view[ element ];

		 			partialView.visibleElements = $.extend( {}, partialView.visibleElements, objElement );
		 			partialView.visibleElements[ element ].jqElement.trigger( "focusout" );
		 		}
		 	}
        };

        /**
		 * Sets hiddenElements property of the partialView object
		 * @param 	{PartialViewDescriptor}		view, @see #partialViewDescriptor
		 * @param 	{PartialView}				partialView, @see #partialView
		 */
		var setHiddenElements = function( view, partialView ) {
			for( element in view ) {
				
		 		if ( view[ element ].jqElement.attr( "type" ) === "hidden" ) {
		 			var objElement = {};
		 			objElement[ element ] = view[ element ];

		 			partialView.hiddenElements = $.extend( {}, partialView.hiddenElements, objElement );
		 		}
		 	}
		};

		/**
		 * Sets valid and visibleValid properties of the partialView object
		 * @param 	{PartialView}				@see #partialView
		 */
		var setPartialViewValid = function( partialView ) {
			var elements = partialView.elements;
			var visibleElements = partialView.visibleElements;

            for (var elementName in elements) {

                if (partialView.hiddenElements && (elementName in partialView.hiddenElements)) {
                    continue;
                }

				var element = visibleElements[ elementName ];

				if ( element ) {
					if ( !element.valid ) {
						partialView.valid = false;
						partialView.visibleValid = false;
						break;
					}
				} else {
					element = elements[ elementName ];

					if ( element ) {
						setElementValid( element );

						if ( !element.valid ) {
							partialView.valid = false;
						}
					}
				}
			}
		};

		/**
		 * Sets valid property of the element
		 * @param 	{Object}	the elementID object @see #elementID
		 */
		var setElementValid = function( element ) {
			element.messages = getMessages( element );

			if ( !element.messages || element.messages.length == 0 ) {
				element.valid = true;
			} else {
				element.valid = false;
			}
		};

		var setElementHasWarning = function( element ) {
			if ( !element.valid ) {
				return;
			}

			element.warningMessage = getWarningMessage( element );

			if ( element.warningMessage ) {
				element.hasWarning = true;
			} else {
				element.hasWarning = false;
			}
		};

		/**
		 * Gets buttons that validate the form
		 * Buttons should be under "form-buttons" style class
		 * If there are more than one button, at least one of them must have the attribute "validateBeforeSubmit",
		 * e.g. <button id="updateContactInfoConfirm" type="button" class="btn btn-default" data-lang-key="updateContactInfo.confirm" validateBeforeSubmit></button>
		 */
		var getButtons = function() {
			var $formButtons = $( ".form-buttons" );
			var $buttons = $formButtons.children();

			if ( $buttons.length == 1 ) {
				return $buttons;
			}

			return $formButtons.children( "[validateBeforeSubmit]" );
		};

		/**
		 * Toggles the error messages list
		 * @param 	{Object}	the elementID object @see #elementID
		 */
		var toggleErrorMessages = function( element ) {
			var $formGroup = element.jqElement.formGroup;
          	var $inputGroup = element.jqElement.inputGroup;
			var $inputGroupParent = element.jqElement.inputGroupParent;

			var srOnlyErrorID = element.jqElement.srOnlyErrorID;
			var srOnlySuccessID = element.jqElement.srOnlySuccessID;
			var spanErrorMark = element.jqElement.spanErrorMark;
			var spanSuccesMark = element.jqElement.spanSuccesMark;

			if ( !element.valid ) {
	            // <removeSuccessElements>
	            $formGroup.removeClass( "has-success" );
	            $( "#" + srOnlySuccessID ).detach();
	            $( "#" + spanSuccesMark ).detach();
	            // </removeSuccessElements>

	            // <addErrorElements>
	            $formGroup.addClass( "has-error has-feedback" );

	            if ( $( "#" + spanErrorMark ).length == 0 ) {
	              $( '<span id=\"' + spanErrorMark + '\" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' ).appendTo( $inputGroupParent );
	            }

	            if ( $( "#" + srOnlyErrorID ).length == 0 ) {
	              $( '<span id=\"' + srOnlyErrorID + '\" class="sr-only">(error)</span>' ).appendTo( $inputGroupParent );
	            }

	            element.jqElement.attr( "aria-describedby", srOnlyErrorID );
	            attachErrorMessages( element );
	            // </addErrorElements>
	          } else {

	          	if ( element.hasWarning ) {
	          		displayWarningMessage( element );
	          		return;
	          	}

	          	// <removeSuccessElements>
	            element.jqElement.formGroup.removeClass( "has-warning" );
	            $( "#" + element.jqElement.srOnlyWarningID ).detach();
	            $( "#" + element.jqElement.spanWarningMark ).detach();
	            // </removeSuccessElements>

	            // <removeErrorElements>
	            $formGroup.removeClass( "has-error" );
	            $( "#" + srOnlyErrorID ).detach();
	            $( "#" + spanErrorMark ).detach();
	            detachErrorMessages( element );
	            // </removeErrorElements>

	            // <addSuccessElements>
	            $formGroup.addClass( "has-success has-feedback" );

	            if ( $( "#" + spanSuccesMark ).length == 0 ) {
	              $( '<span id=\"' + spanSuccesMark + '\" class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>' ).appendTo( $inputGroupParent );
	            }

	            if ( $( "#" + srOnlySuccessID ).length == 0 ) {
	              $( '<span id=\"' + srOnlySuccessID + '\" class="sr-only">(success)</span>' ).appendTo( $inputGroupParent );
	            }

	            element.jqElement.attr( "aria-describedby", srOnlySuccessID );
	            // </addSuccessElements>
	        }
		};

		/**
		 * Displays warning messages
		 * A warning message is only attached to a valid field
		 * @param 	{Object}	the elementID object @see #elementID
		 */
		var displayWarningMessage = function( element ) {
			detachErrorMessages( element );

			if ( element.valid ) {
				// <removeSuccessElements>
	            element.jqElement.formGroup.removeClass( "has-success" );
	            $( "#" + element.jqElement.srOnlySuccessID ).detach();
	            $( "#" + element.jqElement.spanSuccesMark ).detach();
	            // </removeSuccessElements>
			} else {
				// <removeErrorElements>
	            element.jqElement.formGroup.removeClass( "has-error" );
	            $( "#" + element.jqElement.srOnlyErrorID ).detach();
	            $( "#" + element.jqElement.spanErrorMark ).detach();
	            // </removeErrorElements>
			}

			// <addWarningElements>
            element.jqElement.formGroup.addClass( "has-warning has-feedback" );

            if ( $( "#" + element.jqElement.spanWarningMark ).length == 0 ) {
              $( '<span id=\"' + element.jqElement.spanWarningMark + '\" class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true"></span>' ).appendTo( element.jqElement.inputGroupParent );
            }

            if ( $( "#" + element.jqElement.srOnlyWarningID ).length == 0 ) {
              $( '<span id=\"' + element.jqElement.srOnlyWarningID + '\" class="sr-only">(warning)</span>' ).appendTo( element.jqElement.inputGroupParent );
            }

            element.jqElement.attr( "aria-describedby", element.jqElement.srOnlyWarningID );
            attachWarningMessage( element );
            // </addWarningElements>
		};

		var detachErrorMessages = function( element ) {
			element.jqElement.inputGroupParent.children( "." + validatorMessagesStyle ).detach();
		};

		var attachErrorMessages = function( element ) {
			detachErrorMessages( element );

			if (element.valid) {
				return;
			}

			var length = element.messages.length;

			var ulElement = $( '<ul class=\"' + validatorMessagesStyle + '\"></ul>' ).appendTo( element.jqElement.inputGroupParent );

			for(var i = 0; i < length; i++) {
				$( '<li class=\"' + errorTextStyle + '\">' + element.messages[ i ] + '</li>' ).appendTo( ulElement );
			}
		};

		/**
		 * Attaches the warning message for the element
		 * Warning message only is displayed if the element is valid
		 * @param 	{Object}	the elementID object @see #elementID
		 */
		var attachWarningMessage = function( element ) {
			if ( !element.valid ) {
				return;
			}

			if ( element.warningMessage ) {
				var ulElement = $( '<ul class=\"' + validatorMessagesStyle + '\"></ul>' ).appendTo( element.jqElement.inputGroupParent );

				$( '<li class=\"' + warningTextStyle + '\">' + element.warningMessage + '</li>' ).appendTo( ulElement );
			}
		};

		/**
		 * Generates the label {String} property
		 * labelDataLangKey is required in order to get the translation for the label generated.
		 * @param 	{Object}	the elementID object @see #elementID
		 */
		var generateLabel = function( element ) {
			if ( !element.labelDataLangKey ) {
				throw new ReferenceError("it is needed to define a valid labelDataLangKey property for the element: " + element);
			}

			element[ "label" ] = translator.translationFor( element.labelDataLangKey );
		};

		/**
		 * Generates the equalToLabel {String} property if it is needed
		 * @param 	{Object}	the elementID object @see #elementID
		 */
		var generateEqualToLabel = function( element, partialViewName ) {
			if ( element.equalTo ) {
				var elementEqualTo = _view[ partialViewName ][ element.equalTo ];

				if ( !elementEqualTo ) {
					throw new ReferenceError("if equalTo is defined for an element, the equalTo object has to exists with a valid labelDataLangKey, element: " + element);
				}

				element[ "equalToLabel" ] = translator.translationFor( elementEqualTo.labelDataLangKey );
			}
		};

		/**
		 * Generates the jQuery object for the element and
		 * attaches the formGroup, inputGroup, parent of inputGroup and ids for
		 * srOnlyError, Success, ErrorMark, SuccessMarks
		 * {@link #generatejqElement}
		 */
		var generatejqElment = function( element, elementID ) {
			element[ "jqElement" ] = $( "#" + elementID );

			element.jqElement.formGroup = element.jqElement.parents( ".form-group" );
			element.jqElement.inputGroup = element.jqElement.parents( ".input-group" );
			element.jqElement.inputGroupParent = element.jqElement.inputGroup.parent();
			element.jqElement.srOnlyErrorID = element.jqElement.attr("id") + "srOnlyError";
          	element.jqElement.srOnlySuccessID = element.jqElement.attr("id") + "Success";
          	element.jqElement.spanErrorMark = element.jqElement.attr("id") + "ErrorMark";
          	element.jqElement.spanSuccesMark = element.jqElement.attr("id") + "SuccessMark";
          	element.jqElement.srOnlyWarningID = element.jqElement.attr("id") + "srOnlyWarning";
          	element.jqElement.spanWarningMark = element.jqElement.attr("id") + "WarningMark";
		};

		/**
		 * Attaches validator functions to the element,
		 * each validator function will have the same name than the element property,
		 * e.g. required, min, maxlength, etc.
		 * @param 	{Object}	the elementID object @see #elementID
		 */
		var generateValidators = function( element ) {
			for ( var validation in element ) {
				var elementValue = element[ validation ];
				var validator = _validators[ validation ];

				if( elementValue && validator ) {
					element[ "validators" ] = $.extend( {}, element[ "validators" ] );
					element[ "validators" ][ validation ] = validator;
				}
			}
		};

		/**
		 * Attaches the warning function to the element,
		 * each warning function will have the name as the warning property in the element
		 * e.g. empty
		 */
		var generateWarning = function( element ) {
			var warningName = element.warning;

			if ( warningName && _warnings[ warningName ] ) {
				element[ "warningfn" ] = $.extend( {}, element[ "warningfn" ] );
				element[ "warningfn" ][ warningName ] = _warnings[ warningName ];
			}
		};

		/**
		 * Gets the error messages to display
		 * @param 	{Object}	the elementID object @see #elementID
		 */
		var getMessages = function( element ) {
			var messages = [];

			if( !element.validators ) {
				return;
			}

			for ( var validatorName in element.validators ) {
				var validatorfn = element.validators[ validatorName ];

				if ( !validatorfn( element ) ) {
					var message = formatMessage( element, validatorName, "validator.messages" );
					messages.push( message );
				}
			}

			return messages;
		};

		/**
		 * Gets the warning message to display
		 * @param 	{Object}	the elementID object @see #elementID
		 */
		var getWarningMessage = function( element ) {
			var message = null;
			var warningName = element.warning;

			if ( !warningName ) {
				return;
			}

			if ( element.warningfn[ warningName ]( element ) ) {
				message = formatMessage( element, element.warning, "validator.warnings" );
			}

			return message;
		};

		/**
		 * Returns the message to display
		 * @param 	{Object}	the elementID object @see #elementID
		 * @param 	{String}	the property, e.g. "required", "minlength", "equalTo", etc.
		 *						it must be defined in currentLocale.validator[messageType]
		 *						e.g. Bank.Locale.enus.validator.messages.equalTo
		 * @param 	{String}	the message type, e.g. validator.messages, validator.warnings, and so on
		 */
		var formatMessage = function( element, property, messageType ) {
			var keyToReplacePattern = /{[a-zA-Z]*}/g;
			// the message has a format like: "{label} is required."
			var message = translator.translationFor( messageType + "." + property );

			if ( !message ) {
				throw new ReferenceError("the message must be defined in the current locale for: " + property );
			}

			var keysToReplace = message.match( keyToReplacePattern ) || [];

			for( var i = 0; i < keysToReplace.length; i++ ) {
				var key = keysToReplace[i];
				var validationName = key.replace( "{", "" );
				validationName = validationName.replace( "}", "" );

				message = message.replace( key, element[ validationName ] );
			}

			return message;
		};

		var generateGetValue = function( element ) {
			var textMethod = getTextMethodName( element.jqElement );

			element.getValue = function() {
				return element.jqElement[ textMethod ]();
			};
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

		var getElement = function( id ) {
			for ( var partialViewName in _view ) {
				if ( _view[ partialViewName ][ id ] ) {
					return _view[ partialViewName ][ id ];
				}
			}

			return null;
		};

		var hasDecimalPoint = function( $element ) {
			var value = $element.val();

			return value.indexOf( "." ) > -1;
		};

		/**
		 * Validates if a value meet the decimal constraint
		 * @param 	{String}	the value to verify
		 * @param 	{String}	a decimal constraint given by "p, s", where 'p' is the precision and 's' is the scale
		 *						e.g. "5,2" would mean that the 'value' has at most 3 digits before the decimal and at most 2 digits after the decimal
		 */
		var decimalValid = function( value, decimalConstraint ) {
			var numerical = decimalConstraint.split(","),
				precision = numerical[0],
				scale = numerical[1],
				digits = precision - scale,
				decimalPattern = new RegExp("^\\d{0," + digits + "}(\\.\\d{1," + scale + "})?$");

			return decimalPattern.test( value );
		};

		return {
			validate: validate
		};

	}() ) );

} ) );