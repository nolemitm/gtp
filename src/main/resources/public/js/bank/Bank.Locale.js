/**
 * Global Technology Partners LLC
 * @author Sergio Sanchez
 *
 * @class Bank.Locale
 *
 * Language subtag registry is based on IANA, see {@link http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry}
 */

var Bank = Bank || {};	// jshint ignore:line

(function($) {
    Bank.Locale = Bank.Locale || {};

    $.extend(Bank.Locale, (function() {

        // Subtag types are defined at https://www.w3.org/International/articles/language-tags/#rfc
       var	subtagTypes = ['language', 'extlang', 'script', 'region', 'variant', 'extension', 'privateuse'];

       /**
        * {Bank.Locale.langTag}	currentLocale	the locale object that contains a set of key value pairs
        *											with the translations for a specific language
        * @private
        */
        var currentLocale;

        var getSubtagTypes = function() {
            return subtagTypes;
        };

        var getCurrentLocale = function() {
           return currentLocale;
       };

       var setCurrentLocale = function(newLocale) {
           currentLocale = newLocale;
       };

        var getLanguageTag = function(locale) {
           var langTag = "";
           var length = subtagTypes.length;

           for (var i = 0; i < length; i++) {
               if (locale.iana[subtagTypes[i]]) {
                   langTag += locale.iana[subtagTypes[i]].subtag + "-";
               }
           }

           if (langTag.lastIndexOf("-") == langTag.length - 1) {
               langTag = langTag.substring(0, langTag.length - 1);
           }

           return langTag.toLowerCase();
       };

       var getLanguageTagWithNoDashes = function(locale) {
           var langTag = "";
           var length = subtagTypes.length;

           for (var i = 0; i < length; i++) {
               if (locale.iana[subtagTypes[i]]) {
                   langTag += locale.iana[subtagTypes[i]].subtag;
               }
           }

           return langTag.toLowerCase();
       };

       var getCurrentLanguageTagWithNoDashes = function() {
           if (!currentLocale) {
               return undefined;
           }

           return getLanguageTagWithNoDashes(currentLocale);
       };

       var getCurrentLanguageTag = function() {
           if (!currentLocale) {
               return undefined;
           }

           return getLanguageTag( currentLocale );
       };

       var removeDashes = function(langTag) {
           var regex = new RegExp("-", 'g');
           return langTag.replace(regex, '').toLowerCase();
       };

       return {
           /**
            * Subtag types in lowercase
            * @return {Array}		the subtag types as defined at {@link https://www.w3.org/International/articles/language-tags/#rfc}
            */
           getSubtagTypes: getSubtagTypes,
           /**
            * Returns tha language tag from the locale object with dashes, e.g. en-US
            * @param 	{Bank.Locale.langTag}	locale 	containing key value pairs with the specific translation
            * @return 	{String}						the string representation of the language tag with no dashes, e.g. enUS
            */

           /**
            * Gets current locale {Bank.Locale.langTag}
            * Current locale by default is en-US.
            */
           getCurrentLocale: getCurrentLocale,

           /**
            * Sets current locale {Bank.Locale.langTag}
            * Current locale by default is en-US.
            * @param 	{Bank.Locale.langTag}	newLocale	the locale object that contains a set of key value pairs
            *												with the translation to langTag language
            */
           setCurrentLocale: setCurrentLocale,

           /**
            * Returns the current language tag with no dashes in lowercase
            * @return 	{String}				the string representation of the current language tag with no dashes, e.g. enUS
            */
           getCurrentLanguageTagWithNoDashes: getCurrentLanguageTagWithNoDashes,

           /**
            * Returns the current language tag with dashes in lowercase
            * @return 	{String}				the string representation of the current language tag with dashes, e.g. en-US
            */
           getCurrentLanguageTag: getCurrentLanguageTag,

           /**
            * Returns the language tag in lowercase, e.g. en-us
            * @param 	{Bank.Locale.langTag}	newLocale	the locale object that contains a set of key value pairs
            *												with the translation to langTag language
            */
           getLanguageTag: getLanguageTag,

           /**
            * Returns tha language tag from the locale object with no dashes in lowercase, e.g. enus
            * @param 	{Bank.Locale.langTag}	locale 	containing key value pairs with the specific translation
            * @return 	{String}							the string representation of the language tag with no dashes, e.g. enUS
            */
           getLanguageTagWithNoDashes: getLanguageTagWithNoDashes,

           /**
            * Returns the language tag with no dashes
            * @param 	{String} 	langTag 	the string representation of the language tag, e.g. en-US
            * @return 	{String}				the string representation of the language tag with no dashes, e.g. enUS
            */

           /**
            * Returns the language tag with no dashes in lowercase
            * @param 	{String}	langTag 	the string representation of the language tag, e.g. en-US
            */
           removeDashes: removeDashes,
       };

    }()));


}(jQuery));