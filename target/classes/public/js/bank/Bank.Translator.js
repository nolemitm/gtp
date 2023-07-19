/**
 * {@see #Bank.Translator}
 * Bank.Translator
 * Translates the web page through the following process.
 * 1.- Gets html elements that contain the attribute <strong>data-lang-key</strong>
 * 2.- Uses the current locale to set the text value for those html elements (by default current locale is en-US).
 * @param {jQuery} $ jQuery framework
 * @param {Bank.Locale.languageTag} object containing key value pairs with the specific translation,
 *		  			  {languageTag} is the formal language tag with no dash, for more info see {@link https://www.w3.org/International/articles/language-tags}
 */

 var Bank = Bank || {};	// jshint ignore:line

(function($, locale) {
	Bank.Translator = Bank.Translator || {};

	$.extend(Bank.Translator, (function() {
		"use strict";

		var bank = Bank;
		var localeAttr = "data-lang-key";
		var localeSelector = '[' + localeAttr + ']';

		var getElements = function() {
			return $( localeSelector );
		};

		/**
		 * Gets all the elements where "data-lang-key" match with key.
		 * @param	{String}			the key, stored in "data-lang-key" tag, e.g. login.title, etc.
		 * @returns {jQuery Object}		the jQuery elements that match with key
		 */
		var getElementsStartingWith = function( key ) {
			var multipleSelector = "[" + localeAttr + "^=" + "'" + key + "'" + "]";
			return $( multipleSelector );
		};

		/**
		 * Gets the specific value for a specific key, e.g. login.title
		 * @param	{String}			the key in the locale, e.g. login.title, etc.
		 */
		var translationFor = function( key ) {
			if (!key || !locale.getCurrentLocale()) {
				return undefined;
			}

			var treeProperties = key.split('.');
			var prop = locale.getCurrentLocale();

			for (var i = 0; i < treeProperties.length; i++) {
				var propertyValue = prop[treeProperties[i]];

				if (!propertyValue) {
					return "";
				}

				prop = propertyValue;
			}

			return prop;
		};

		/**
		 * Translates specific element
		 * @param	{html} 	html element with "data-lang-key" attribute.
		 *					The value of data-lang-key can be either pure text or HTML string,
		 *					Pure text is assigned to the text of the element,
		 *					Html string is appended to the element.
		 */
		var translateElement = function( element )	{
			var $element = $(element);
			var localeKey = $element.attr(localeAttr);
			var localeText = translationFor(localeKey);

			if (localeText) {

				var htmlObj = bank.getHTMLsecure( localeText );
				$element.text("");

				if ( htmlObj.text ) {
					$element.text( localeText) ;
				} else {
					var html = htmlObj.html[0];
					var $html = $( html );

					$element.append( $html );
				}

			}
		};

		/**
		 * Translates all elements that have the "data-lang-key" attribute
		 */
		var translate = function( view ) {
			$.each(getElements(), function(index, element) {
				translateElement( element );
			});

			if ( view ) {
				translatePlaceholder( view );
			}
		};

		/**
		 * Adds a placeholder to each input element based on a view descriptor
		 * @param  {Object} 	the View descriptor @see Bank.Validator#viewDescriptor
		 */
		var translatePlaceholder = function( view ) {
			for ( var partialViewName in view ) {

				var partialView = view[ partialViewName ];

				for ( var elementID in partialView ) {

					var element = partialView[ elementID ];
					var dataLangKey = getPlaceHolderDataLangKey( element );

					if ( dataLangKey ) {
						addPlaceholderFor( dataLangKey, elementID );
					} else if ( element.labelDataLangKey ) {
						addPlaceholderFor( element.labelDataLangKey, elementID );
					}
				}

			}
		};

		/**
		 * Gets the placeholder data language key, e.g placeholders.email
		 * @param 	{object}	element, a JavaScript object
		 * @Returns {String}	dataLangKey, the data language key if the element has a property
		 *						that match with one of the properties of placeholders object in the current locale
		 */
		var getPlaceHolderDataLangKey = function( element ) {
			var currentLocale = locale.getCurrentLocale();

			if ( !currentLocale ) {
				return;
			}

			for ( var elementName in element ) {
				if ( currentLocale.placeholders[ elementName ] ) {
					return "placeholders." + elementName;
				}
			}

			return null;
		};

		/**
		 * Adds a placeholder for an input element
		 * @param	{String}	key,		the key in the locale, e.g. login.title, etc.
		 * @param 	{String}	elementID, 	the ID of the Html element
		 */
		var addPlaceholderFor = function( key, elementID ) {
			var $element = $( "#" + elementID );
			var elementType = $element.prop( "tagName" );

			if ( elementType == "INPUT" || elementType == "TEXTAREA" ) {
				$element.attr( "placeholder", translationFor( key ) );
			}
		};

		/**
		 * Translates all elements that have the "data-lang-key" attribute
		 * @param	{String}	the key, stored in "data-lang-key" tag, i.e. newCredentials, login.title, etc.
		 */
		var translateOnlyStartingWith = function( key ) {
			$.each(getElementsStartingWith( key ), function(index, element) {
				translateElement( element );
			});
		};

		var translateHeadTitle = function() {
			var translation = translationFor("head.title");

			if (translation && translation != "") {
				$("head").find("title").text(translation);
			}
		};

		return {
			/**
			 * Gets all the elements that contains the attrribute "data-lang-key"
			 * @returns 	{[jQuery Object]}	an array of jQuery elements
			 */
			getElements: getElements,

			/**
			 * Gets all the elements where "data-lang-key" match with key.
			 * @param	{String}			the key, stored in "data-lang-key" tag, e.g. login.title, etc.
			 * @returns {jQuery Object}		the jQuery elements that match with key
			 */
			getElementsStartingWith: getElementsStartingWith,

			/**
			 * Returns the translated string
			 * for the composed key
			 * @param 	{String} key The object notation string that represent the property that contains the translation (i.e. user.password).
			 * @return 	{String} returns The translated text that correspond to the key.
			 */
			translationFor: translationFor,

			/**
			 * Makes the translation to the current locale for all the elements {@link #elements}
			 * does nothing if the translation for the elements is not defined
			 */
			translate: translate,

			/**
			 * Makes the translation to the current locale for elements {@link #elements}
			 * that start with a key. Does nothing if the translation for the elements is not defined.
			 * @param	{String}	the key, stored in "data-lang-key" tag, i.e. newCredentials, login.title, etc.
			 */
			translateOnlyStartingWith: translateOnlyStartingWith,

			/**
			 * Makes the translation to the current locale for the title in the HTML head element
			 * does nothing if the translation for the elements is not defined
			 */
			translateHeadTitle: translateHeadTitle,

			/**
			 * Adds the placeholder attribute to the element
			 * @param  {Object} 	the View descriptor @see Bank.Validator#viewDescriptor
			 */
			translatePlaceholder: translatePlaceholder
		};
	}()));
}(jQuery, Bank.Locale));