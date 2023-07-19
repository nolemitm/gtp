/**
 * Global Technology Partners LLC
 * @author Sergio Sanchez
 *
 * @class Bank.CssLoader
 * 
 * Gets the specific stylesheet for the Bank 
 */

var Bank = Bank || {};	// jshint ignore:line

(function($, init) {
	Bank.CssLoader = Bank.CssLoader || {};

	$.extend(Bank.CssLoader, (function(){

		var _htmlHead = $('head');

		var loadBankStyleSheet = function() {			
			var hrefBankCss = init.getBanksFolder() + "/" + init.getBankName() + "/css/bank.css";
			var bankCss = $.parseHTML('<link rel="stylesheet" type="text/css" href="' + hrefBankCss + '" />');
			
			_htmlHead.append(bankCss);
		};

		var loadBankIcon = function() {
			var hrefBankPath = init.getBanksFolder() + "/" + init.getBankName(),
                hrefBankIcon16 = hrefBankPath + "/images/favicon16x16.png",
                hrefBankIcon32 = hrefBankPath + "/images/favicon32x32.png",
                linkIcon16 = $.parseHTML( '<link rel="icon" type="image/png" href="' + hrefBankIcon16 + '" sizes="16x16">' ),
                linkIcon32 = $.parseHTML( '<link rel="icon" type="image/png" href="' + hrefBankIcon32 + '" sizes="32x32">' );

                _htmlHead.append( linkIcon16 );
                _htmlHead.append( linkIcon32 );
		};

		return {
			/**
			 * Loads the specific stylesheet for the bank
			 */
			loadBankStyleSheet: loadBankStyleSheet,
			/**
			 * Loads the specific Bank icon for the bank
			 */
			loadBankIcon: loadBankIcon
		}
	}()));
}(jQuery, Bank.Init));
