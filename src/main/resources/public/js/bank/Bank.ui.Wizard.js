/**
 * Global Technology Partners LLC
 * @author 	Sergio Sanchez
 * @date	2017-03-02
 *
 * @class Bank.ui.Wizard
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

	/**
	 * @events
	 */
	var onLastTab = "wizard.lastTab";
	var onMiddleTabs = "wizard.middleTabs";
	var onFirstTab = "wizard.firstTab";
	var onValidatorBeforeSubmit = "validator.beforeSubmit";
	var onServiceSuccessResponse = "service.success";

	/**
	 * Index of the tab container
	 */
	var _activeTab = 0;

	/**
	 * Config options
	 *
	 */
	var _options = {
		// the ID for each "tab-pane"
		tabIDs: [],
		// the ID for each "tab-pane" that must no change until the service response seccessfully
		displayNextOnlyOnServiceSuccess: [],
		// the last button on the wizard
		confirmButtonID: null
	};
	var _tabsLength = 0;

	/**
	 * keeps the indexes for tabs that must wait
	 * a success response from the service to
	 * display the next tab
	 */
	var _successIndexes = [];

	function Wizard( options ) {
		_activeTab = 0;
		_options = options;
		_tabsLength = options.tabIDs.length;
		_successIndexes = [];
		setServiceSucessIndexes();
		bindEvents();
	};

	function setServiceSucessIndexes() {

		for ( var i in _options.displayNextOnlyOnServiceSuccess ) {
			var tabID = _options.displayNextOnlyOnServiceSuccess[ i ];

			for ( var j in _options.tabIDs ) {
				if ( tabID == _options.tabIDs[ j ] ) {
					_successIndexes.push( j );
					break;
				}
			}
		}

	}

	function bindEvents() {

		bindValidationEvents();

		$( "#" + _options.confirmButtonID ).on( onLastTab, function() {
			$( this ).attr( "hidden", false );
			$( this ).attr( "disabled", false );
		} );

		$( "#" + _options.confirmButtonID ).on( onMiddleTabs, function() {
			$( this ).attr( "hidden", true );
		} );

		$( "#" + _options.confirmButtonID ).on( onFirstTab, function() {
			$( this ).attr( "hidden", true );
		} );
	};

	function bindValidationEvents() {
		var $validateNext = $( "#next[validateBeforeSubmit]" );
		var $validateBack = $( "#back[validateBeforeSubmit]" );

		if ( $validateNext.length > 0 ) {

			$( "#next" ).on( "validator.beforeSubmit", function( event, partialView ) {
				if( partialView.visibleValid && !displayNextOnlyOnServiceSuccess() ) {
					displayNextTab();
				}
			} );

			$( "#next" ).on( onServiceSuccessResponse, function( event, partialView ) {
				if( partialView.visibleValid ) {
					displayNextTab();
				}
			} );

		} else {
			$( "#next" ).on( "click", function() {
				displayNextTab();
			} );
		}

		if ( $validateBack.length > 0 ) {
			$( "#back" ).on( "validator.beforeSubmit", function( event, partialView ) {
				if( partialView.visibleValid ) {
					displayPreviousTab();
				}
			} );
		} else {
			$( "#back" ).on( "click", function() {
				displayPreviousTab();
			} );
		}
	}

    function getNextTabIndex() {
		if ( _activeTab == _tabsLength - 1 ) {
			return _activeTab;
		}

		return _activeTab + 1;
	}

	function getPreviousTabIndex() {
		if ( _activeTab == 0 ) {
			return _activeTab;
		}

		return _activeTab - 1;
	}

	function displayNextTab() {
		var nextTabIndex = getNextTabIndex();
		var nextTabID = _options.tabIDs[ nextTabIndex ];

		$( "#" + _options.tabIDs[ _activeTab ] ).removeClass( "active" );
		$( "#" + _options.tabIDs[ nextTabIndex ] ).addClass( "active" );

		_activeTab = nextTabIndex;

		$( "#back" ).attr( "hidden", false );

		// hide button "next" when the active tab is the last one
		if (_activeTab == _tabsLength - 1) {
			$( "#next" ).attr( "hidden", true );
			$( "#" + _options.confirmButtonID ).trigger( onLastTab );
		} else {
			$( "#next" ).attr( "hidden", false );
			$( "#" + _options.confirmButtonID ).trigger( onMiddleTabs );
		}
	}

	function displayPreviousTab() {
		var previousTabIndex = getPreviousTabIndex();
		var previousTabID = _options.tabIDs[ previousTabIndex ];

		$( "#" + _options.tabIDs[ _activeTab ] ).removeClass( "active" );
		$( "#" + _options.tabIDs[ previousTabIndex ] ).addClass( "active" );

		_activeTab = previousTabIndex;

		$( "#next" ).attr( "hidden", false );

		// hide button "back" when the active tab is the first one
		if (_activeTab == 0) {
			$( "#back" ).attr( "hidden", true );
			$( "#" + _options.confirmButtonID ).trigger( onFirstTab );
		} else {
			$( "#back" ).attr( "hidden", false );
			$( "#" + _options.confirmButtonID ).trigger( onMiddleTabs );
		}
	}

	function displayNextOnlyOnServiceSuccess() {
		var i = _successIndexes.length - 1;

		while ( i >= 0 ) {
			if ( _activeTab == _successIndexes[ i-- ] ) {
				return true;
			}
		}

		return false;

	}

    bank.ui.Wizard = Wizard;

} ) );