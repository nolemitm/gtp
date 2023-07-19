/**
 * Global Technology Partners LLC
 * @author 	Sergio Sanchez
 * @date	2017-03-29
 *
 * @class Bank.Session
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
		factory(jQuery, Bank, window.cookie);
	}
} (function( $, bank, cookie ) {

	bank = bank || {};

	bank.Session = $.extend( {}, ( function() {

		var session = {
			key: cookie.get( "Key" ),
            balance: cookie.get( "Balance" ),
            currencyAlpha: cookie.get( "CurrencyAlpha" ),
            currencyCode: cookie.get( "CurrencyCode" ),
            customerId: cookie.get( "CustomerId" ),
            last4: cookie.get( "Last4" ),
            expires: cookie.get( "Expires" ),
            billPayEnabled: ( cookie.get( "BillPayEnabled" ) ? cookie.get( "BillPayEnabled" ).toLowerCase() === "true" : false ),
            topUpEnabled: ( cookie.get( "TopUpEnabled" ) ? cookie.get( "TopUpEnabled" ).toLowerCase() === "true" : false ),
            c2CEnabled: cookie.get( "C2CEnabled" ),
            enhancedC2CRequired: cookie.get( "EnhancedC2CRequired" ),
            passwordChangeRequired: cookie.get( "PasswordChangeRequired" ),
            firstName: cookie.get( "FirstName" ),
            lastName: cookie.get( "LastName" ),
            vbvUrl: cookie.get( "VbvUrl" ),
            setUpNewCredentials: ( cookie.get( "setUpNewCredentials" ) ? cookie.get( "setUpNewCredentials" ).toLowerCase() === "true" : false ),
            langTag: cookie.get( "langTag" ),
            timeout: cookie.get( "timeout" ),
			passwordRecovery: ( cookie.get( "passwordRecovery" ) ? cookie.get( "passwordRecovery" ).toLowerCase() === "true" : false ),
			/** 
             * pageToLoadWithNoCredentials 
             * is used to display web pages from User interaction on login page, 
             * in these cases the User is not logged on.
             * e.g. Forgot User Name or Forgot Passcode pages             
             */
            pageToLoadWithNoCredentials: cookie.get( "pageToLoadWithNoCredentials" ),
            serviceID: cookie.get( "serviceID" ),
            menuOptionsToHide: cookie.get( "menuOptionsToHide" ),
            mobileProviders: cookie.get( "mobileProviders" ),
            billPayMenu: cookie.get( "billPayMenu" ),
            // <payment>
            vendor: cookie.get( "vendor" ),
            paymentAmount: cookie.get( "paymentAmount" ),
            reference: cookie.get( "reference" ),
            endUrl: cookie.get( "endUrl" ),
            decodedEndUrl: decodeURIComponent( cookie.get( "endUrl" ) ),
            // </payment>
            hideFees: ( cookie.get( "hideFees" ) ? cookie.get( "hideFees" ).toLowerCase() === "true" : false ),
            allowCustomerUpdates: ( cookie.get( "allowCustomerUpdates" ) ? cookie.get( "allowCustomerUpdates" ).toLowerCase() === "true" : false ),
            allowOtpOnCustomerUpdates: ( cookie.get( "allowOtpOnCustomerUpdates" ) ? cookie.get( "allowOtpOnCustomerUpdates" ).toLowerCase() === "true" : false ),
            pinChangeAllowed: ( cookie.get( "pinChangeAllowed" ) ? cookie.get( "pinChangeAllowed" ).toLowerCase() === "true" : false ),            
            lastLoginDate: cookie.get( "lastLoginDate" ),
            fingerprint: cookie.get("fingerprint"),
			virtual: (cookie.get("virtual") ? cookie.get("virtual").toLowerCase() === "true" : false),
			otpByEmail: (cookie.get("otpByEmail") ? cookie.get("otpByEmail").toLowerCase() === "true" : false),
			verifyDevice: (cookie.get("verifyDevice") ? cookie.get("verifyDevice").toLowerCase() === "true" : false),
			currencyDecimals: cookie.get("currencyDecimals") >> 0,
			first4: cookie.get("first4"),
			iBan: cookie.get("iBan"),
			mobilePhone: cookie.get("mobilePhone")
		};

		var init = function() {
			cookie.empty();
			cookie = null;

			validateVbvUrl();
			validateMenuOptionsToHide();
		};

		var validateVbvUrl = function() {
			var urlPattern = /^(https:\/\/){1}[a-zA-Z0-9-\.]+\.[a-z]{2,4}/;

			if ( !urlPattern.test( session.vbvUrl ) ) {
				session.vbvUrl = null;
			}
		};

		var validateMenuOptionsToHide = function() {
			if ( !session.menuOptionsToHide ) {
				return;
			}

			if ( session.menuOptionsToHide == "null" ) {
				session.menuOptionsToHide = null;
				return;
			}

			session.menuOptionsToHide = session.menuOptionsToHide.split(",");
		};

		var empty = function() {
			session = null;
		};

		var key = function() {
			session.key = session.key ? session.key : "";

			return session.key;
		};

		var balance = function() {
			return session.balance;
		};

        var currencyAlpha = function() {
            return session.currencyAlpha;
		};

        var currencyCode = function() {
            return session.currencyCode;
		};

        var customerId = function() {
            return session.customerId;
		};

        var last4 = function() {
            return session.last4;
		};

        var expires = function() {
            return session.expires;
		};

        var billPayEnabled = function() {
            return session.billPayEnabled;
		};

        var topUpEnabled = function() {
            return session.topUpEnabled;
		};

        var c2CEnabled = function() {
            return session.c2CEnabled;
		};

        var enhancedC2CRequired = function() {
            return session.enhancedC2CRequired;
		};

        var passwordChangeRequired = function() {
            return session.passwordChangeRequired;
		};

        var firstName = function() {
            return session.firstName;
		};

        var lastName = function() {
            return session.lastName;
		};

        var vbvUrl = function() {
            return session.vbvUrl;
		};

		var setUpNewCredentials = function() {
			return session.setUpNewCredentials;
		};

		var langTag = function() {
			return session.langTag;
		};

		var timeout = function() {
            return session.timeout;
		};

		var setC2cStatus = function( value ) {
			session.c2cStatus = value;
		};

		var getC2cStatus = function() {
			return session.c2cStatus;
		};

		var removeC2cStatus = function() {
			delete session.c2cStatus;
		};

		var pageToLoadWithNoCredentials = function() {
			return session.pageToLoadWithNoCredentials;
		};

		var serviceID = function() {
			return session.serviceID;
		};

		var menuOptionsToHide = function() {
			return session.menuOptionsToHide;
		};

		var mobileProviders = function() {
			return session.mobileProviders;
		};

		var billPayMenu = function() {
			return session.billPayMenu;
		};

		var vendor = function() {
			return session.vendor;
		};

		var paymentAmount = function() {
			return session.paymentAmount;
		};

		var reference = function() {
			return session.reference;
		};

		var endUrl = function() {
			return session.endUrl;
		};

		var decodedEndUrl = function() {
			return session.decodedEndUrl;
		};

		var hideFees = function() {
			return session.hideFees;
		};

		var allowCustomerUpdates = function() {
			return session.allowCustomerUpdates;
		};

		var allowOtpOnCustomerUpdates = function() {
			return session.allowOtpOnCustomerUpdates;
		};

		var pinChangeAllowed = function() {
			return session.pinChangeAllowed;
		};

		var lastLoginDate = function() {
			return session.lastLoginDate;
		};

		var fingerprint = function() {
			return session.fingerprint;
        };

        var virtual = function () {
            return session.virtual;
		};
		
		var otpByEmail = function() {
			return session.otpByEmail;
		};

		var verifyDevice = function() {
			return session.verifyDevice;
		};

		var currencyDecimals = function() {
			return session.currencyDecimals;
		};

		var first4 = function() {
			return session.first4;
		};

		var iBan = function () {
			return session.iBan;
		};

		var mobilePhone = function () {
			return session.mobilePhone;
		};

		init();

	    return {
	    	empty: empty,
	    	key: key,
	    	balance: balance,
            currencyAlpha: currencyAlpha,
            currencyCode: currencyCode,
            customerId: customerId,
            last4: last4,
            expires: expires,
            billPayEnabled: billPayEnabled,
            topUpEnabled: topUpEnabled,
            c2CEnabled: c2CEnabled,
            enhancedC2CRequired: enhancedC2CRequired,
            passwordChangeRequired: passwordChangeRequired,
            firstName: firstName,
            lastName: lastName,
            vbvUrl: vbvUrl,
	    	setUpNewCredentials: setUpNewCredentials,
	    	langTag: langTag,
	    	timeout: timeout,
	    	setC2cStatus: setC2cStatus,
	    	getC2cStatus: getC2cStatus,
	    	removeC2cStatus: removeC2cStatus,
	    	pageToLoadWithNoCredentials: pageToLoadWithNoCredentials,
	    	serviceID: serviceID,
	    	menuOptionsToHide: menuOptionsToHide,
	    	mobileProviders: mobileProviders,
	    	billPayMenu: billPayMenu,
	    	vendor: vendor,
	    	paymentAmount: paymentAmount,
	    	reference: reference,
	    	endUrl: endUrl,
	    	decodedEndUrl: decodedEndUrl,
	    	hideFees: hideFees,
	    	allowCustomerUpdates: allowCustomerUpdates,
	    	allowOtpOnCustomerUpdates: allowOtpOnCustomerUpdates,
	    	pinChangeAllowed: pinChangeAllowed,
	    	lastLoginDate: lastLoginDate,
            fingerprint: fingerprint,
			virtual: virtual,
			otpByEmail: otpByEmail,
			verifyDevice: verifyDevice,
			currencyDecimals: currencyDecimals,
			first4: first4,
			iBan: iBan,
			mobilePhone: mobilePhone
	    };

	}() ) );

} ) );