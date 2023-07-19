/**
 * Global Technology Partners, LLC
 * Sergio Sanchez
 *
 * @class Bank.LocaleLoader
 * Loads the preferred user's language.
 * At the very first request the language is set to the browser language.
 */

var Bank = Bank || {};	// jshint ignore:line

(function($, navigator, init, locale, translator) {
	"use strict";

	Bank.LocaleLoader = Bank.LocaleLoader || {};

	$.extend(Bank.LocaleLoader, (function() {
		/**
		 * @event LocaleLoader.loadedDefaultScriptLanguage
		 * Fires after the Default Locale is loaded
		 * see loadDefaultLocale()
		 */
		var onLoadedDefaultScriptLanguage = "LocaleLoader.loadedDefaultScriptLanguage";
		/**
		 * @event LocaleLoader.loadedScriptLanguage
		 * Fires after a new Locale is loaded
		 * see loadScriptLanguage()
		 */
		var onLoadedScriptLanguage = "LocaleLoader.loadedScriptLanguage";

		var me = Bank.LocaleLoader;
		var defaultLanguage = "en-us";
		var prefixLocaleFile = "Bank.Locale.";

		/**
		 * This variable allows you to use IANA standard tags, when its value is true, in that case, each locale must exists for any IANA tags in use,
		 * for example if the browser is using "en-UK" then must exist Bank.Locale.enuk, or it is "enm" then must scist Bank.Locale.enm (middle English)
		 *
		 * Keeping this variable to false will behave as follow:
		 * 1.- Any en-[extlang]-[script]-[region]-[variant]-[extension]-[privateuse] will be replaced by "en-us"
		 * 2.- Any [language]-[extlang]-[script]-[region]-[variant]-[extension]-[privateuse] where [language] is not [en] will be replaced by [language] only,
		 *     for example "pt-BR" will be replaced by "pt"
		 *
		 */
		var useIANAStandard = false;

		var getDefaultLanguage = function() {
 			return defaultLanguage;
 		};

 		var loadDefaultLocale = function() {
 			var defaultLangTag = locale.removeDashes(defaultLanguage);

 			if (locale[defaultLangTag]) {
 				locale.setCurrentLocale(locale[defaultLangTag]);
 				translator.translate();
 				translator.translateHeadTitle();
 			} else {
 				var urlCommonScript = getUrlCommonLocale(defaultLanguage);
 				var urlSpecificScript = getUrlLocale(defaultLanguage);
 				loadCommonThenSpecificScriptsLanguage( urlCommonScript, urlSpecificScript, defaultLangTag, onLoadedDefaultScriptLanguage );
 			}
 		}

 		/**
 		 * Returns the URL of the Bank Locale specific script
 		 * @param {String} 	langTag 	the string representation of the language tag with dashes, i.e. en-US
 		 */
 		var getUrlLocale = function( langTag ) {
 			return init.getUrlBankLocale() + "/" + prefixLocaleFile + langTag + ".js";
 		};

 		/**
 		 * Returns the URL of the common Locale script
 		 * this function should be call before to load the specific locale for the Bank
 		 * @param {String} 	langTag 	the string representation of the language tag with dashes, i.e. en-US
 		 */
 		var getUrlCommonLocale = function( langTag ) {
 			return init.getUrlCommonLocale() + "/" + prefixLocaleFile + langTag + ".js";
 		};

 		/**
 		 * Loads the requested language script
 		 * @param {String}	urlScript		the URL for the script requested
 		 * @param {String}	langTag 	 	the language tag with no dashes, i.e. enUS
 		 * @param {String}	eventName		the name of the event to trigger
 		 */
 		var loadScriptLanguage = function( urlScript, langTag, eventName ) {
 			$.getScript( urlScript, function( script, textStatus, jqxhr ) {
				locale.setCurrentLocale( locale[langTag] );
				translator.translate();
				translator.translateHeadTitle();
				$( me ).trigger( eventName );
			});
 		};

 		/**
 		 * Loads the requested language script,
 		 * this methos loads first the common language script then the Bank specific language script
 		 * @param {String}	urlCommonScript			the URL for the common language script
 		 * @param {String}	urlSpecificScript		the URL for the Bank specific language script
 		 * @param {String}	langTag 	 			the language tag with no dashes, i.e. enUS
 		 * @param {String}	eventName				the name of the event to trigger
 		 * @fail  									loads the default language
 		 */
 		var loadCommonThenSpecificScriptsLanguage = function( urlCommonScript, urlSpecificScript, langTag, eventName ) {
 			$.getScript( urlCommonScript )
 				.done( function( script, textStatus ) {

 					if ( !script ) {
 						loadLanguage( defaultLanguage );
 					}

 					loadScriptLanguage( urlSpecificScript, langTag, eventName );

 				} )
 				.fail( function( jqxhr, settings, exception ) {
 					loadLanguage( defaultLanguage );
 				} );
 		};

 		/**
 		 * Gets the Browser Language tag.
 		 * @returns 	{String} 	the Browser language tag, or the default language tag If the Browser has no navigator.language nor navigator.browserLanguage
 		 */
 		var getBrowserLanguage = function() { 			
			if (navigator && navigator.language) {
				return verifyLanguageTag( navigator.language );
			} else if (navigator && navigator.browserLanguage) {
				return verifyLanguageTag( navigator.browserLanguage );
			}			

			return locale.removeDashes(defaultLanguage);
		};

		/**
		 * Verifies whether the language tag follows IANA standars or not
		 * @param	langTag 	the standard language tag in lowercase, e.g. en-us
		 * @return 	langTag  	the lowercase IANA standard language tag if useIANAStandard is true,
		 *						otherwise it will return the first 2 characters of the language part,
		 *						except for English, it will return en-us for this case
		 */
		var verifyLanguageTag = function( langTag ) {
			var langTagVerified = langTag.toLowerCase();

			if ( !useIANAStandard ) {

				var languagePart = langTagVerified.substring(0, 2);

				if ( languagePart == "en" ) {
					langTagVerified = "en-us";
				} else {
					langTagVerified = languagePart;
				}

			}

			return langTagVerified;
		};

		var loadBrowserLanguage = function() {
			var langTag = getBrowserLanguage();
			var currentLang = locale.getCurrentLanguageTagWithNoDashes();

			if (langTag === currentLang) {
				translator.translate();
				translator.translateHeadTitle();
				return;
			}

			loadLanguage(langTag);
		};

		/**
		 * loads the language defined by langTag parameter.
		 * If langTag is undefined, it loads the Browser Language
		 * @param	{String}	langTag 	the language tag with dashes, i.e. en-US
		 */
		var loadLanguage = function( langTag ) {

			if ( !langTag ) {
				loadBrowserLanguage();
				return;
			}

			var langTagVerified = verifyLanguageTag( langTag );
			var langTagWithNoDashes = locale.removeDashes( langTagVerified );

			if ( locale[ langTagWithNoDashes ] ) {
				locale.setCurrentLocale( locale[ langTagWithNoDashes ] );
				translator.translate();
				translator.translateHeadTitle();
				$( me ).trigger( onLoadedScriptLanguage );
			} else {
				var urlCommonScript = getUrlCommonLocale( langTagVerified );
 				var urlSpecificScript = getUrlLocale( langTagVerified );
				loadCommonThenSpecificScriptsLanguage( urlCommonScript, urlSpecificScript, langTagWithNoDashes, onLoadedScriptLanguage );
			}
		};

		var getLocale = function() {
			return locale;
		};

		return {
			/**
	 		 * Default language.
	 		 * @return {String}		the string representation of the language tag, i.e. en-US
	 		 */
			getDefaultLanguage: getDefaultLanguage,

			/**
			 * Loads the default {Bank.Locale.langTag}	that is Bank.Locale.enus
			 */
			loadDefaultLocale: loadDefaultLocale,

			/**
			 * Returns the language tag from the browser with dashes, i.e. en-US
			 * @return 	{String}	the string representation of the language tag with no dashes, i.e. enUS
			 *						if the browser language is not found, returns the default value, defined
			 *						in locale.default {@link Bank.Locale#default}
			 */
			getBrowserLanguage: getBrowserLanguage,

			/**
			 * Loads the browser locale {Bank.Locale.langTag}
			 * gets the browser language tag and gets the corresponding locale
			 */
			loadBrowserLanguage: loadBrowserLanguage,

			/**
			 * Loads the requested language (async)
			 * @param {String}	langTag 	the string representation of the language tag, i.e. en-US
			 */
			loadLanguage: loadLanguage,

			/**
			 * Gets the Locale object
			 * @returns 	{Bank.Locale}
			 */
			getLocale: getLocale
		};

	}()));

}(jQuery, navigator, Bank.Init, Bank.Locale, Bank.Translator));