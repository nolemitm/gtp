/**
 * Global Technology Partners, LLC
 * @author Sergio Sanchez
 *
 * initial.js
 * master page
 *
 */

( function( factory ) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define( ["jquery", "Bank", "Bank.CssLoader", "Bank.LocaleLoader", "Bank.Session", "Bank.SessionTimeout", "Bank.TimeoutDisplayer", "Bank.Translator"], factory );
	} else if (typeof exports === "object") {
		// Node/CommonJS
		factory( require( "jquery", "Bank", "Bank.CssLoader", "Bank.LocaleLoader", "Bank.Session", "Bank.SessionTimeout", "Bank.TimeoutDisplayer", "Bank.Translator" ) );
	} else {
		// Browser globals
		factory( jQuery, Bank, Bank.CssLoader, Bank.LocaleLoader, Bank.Session, Bank.SessionTimeout, Bank.TimeoutDisplayer, Bank.Translator );
	}
}( function( $, bank, cssLoader, localeLoader, session, sessionTimeout, TimeoutDisplayer, translator ) {

	$( function() {
		bank.Init.checkLogin();

		var isNewCredentialSettings = false;
		var bodyContainerID = "body-container";
		var bodyContainerSelector = "#" + bodyContainerID;
		var currentLangTag;
		var locale;
		var currentLocale;
		var preloaders;
		var timeoutDisplayer;
		onRender();

		function onRender() {
			cssLoader.loadBankStyleSheet();
			cssLoader.loadBankIcon(); // attach the icon link
			isNewCredentialSettings = session.setUpNewCredentials();
			currentLangTag = session.langTag();
            hideMenuOptions();
			addVirtualCardMenuOption();
			setServiceID();
			addMobileWalletAndCardTransferMenuOption();
			setTimeout();
			bindErrorModal();
			manageMobileMenu();
			manageVbv();
			bindLogout();			

			localeLoader.loadLanguage( currentLangTag );
			$( localeLoader ).on( "LocaleLoader.loadedScriptLanguage", onLoadedScriptLanguage );
		}

		function hideMenuOptions() {
			var menuOptionsToHide = session.menuOptionsToHide();

			for (var index in menuOptionsToHide ) {
				var optionName = menuOptionsToHide[ index ];

				$( '[data-nav-to=' + optionName + ']' ).detach();
			}

			if ( !session.pinChangeAllowed() ) {
				$( '[data-nav-to="change-pin"]' ).detach();
			}

			if ( !session.allowCustomerUpdates() ) {
				$( '[data-nav-to="manage-account"]' ).detach();
			}
        }

        /**
		 * Display Card will be shown if the Card is Virtual
		 * This menu option is available for all Banks and Programs
		 */
        function addVirtualCardMenuOption() {
			var $mainMenu = $("#cardholder-svcs-links"),
				$navMain = $("#nav-main"),
				menuItem = '<li><a href="#" data-nav-to="card" data-lang-key="menu.displayCard"></a></li>';

            if (session.virtual()) {
                $mainMenu.append($.parseHTML(menuItem));
            }
		}

		function addMobileWalletAndCardTransferMenuOption() {
			let $mainMenu = $("#cardholder-svcs-links"),
				menuItems = "",
				transferToCardMenuItem = '<li><a href="#" data-nav-to="load-card" data-lang-key="menu.loadCard"></a></li>',
				transferToMnoMenuItem = '<li><a href="#" data-nav-to="transfer-to-mobile-wallet" data-lang-key="menu.transferToMobileWallet"></a></li>';

			let cardService = bank.Init.getCardService();

			$.ajax({
				url: cardService.baseUrl + "checkMnoToCardStatus", //"CardService.svc/v2/checkMnoToCardStatus",
				method: "GET",
				async: false,
				headers: {
					From: cardService.header.id,
					Authorization: 'GTP ' + cardService.header.encodedKey,
					IEAuth: 'GTP ' + cardService.header.encodedKey
				}
			})
			.always(function (data, textStatus, jqXHR) {
				if (data) {
					if (data.CardToMnoSupported) {
						menuItems = transferToMnoMenuItem;
					}

					if (data.MnoToCardSupported) {
						menuItems += transferToCardMenuItem;
					}

					if (menuItems) {
						$mainMenu.append($.parseHTML(menuItems));
					}
				}
			});
        }

		function setServiceID() {
			bank.Init.setCardServiceID( session.serviceID() );
		}

		function setTimeout() {
			bank.Init.setTimeout( session.timeout() );
		}

		function detachLogout() {
			$( "#logout, #mobileLogout" ).detach();
		}

		function bindLogout() {
			$( "#logout, #mobileLogout" ).off( "click" );
			
			$( "#logout, #mobileLogout" ).on( "click", function() {

				bank.Init.logoff();

			} );
		}

		function bindKillSession() {
			$( "#logout, #mobileLogout" ).off( "click" );

			$( "#logout, #mobileLogout" ).on( "click", function() {

				bank.Init.killSession();

			} );
		}

		function bindErrorModal() {
	        // bind the error modal window to the element
	        modalError = $( "#error-modal" );
	        modalError.error();
	    }

	    function setPreloaders() {
	    	preloaders = {
	    		transferfunds: function( pageName ) {
	    			var cardService = bank.Init.getCardService();

					$.ajax({
						url: cardService.baseUrl + "c2cstatus", //"CardService.svc/v2/c2cstatus",
						headers: {
							From: cardService.header.id,
							Authorization: 'GTP ' + cardService.header.encodedKey,
							IEAuth: 'GTP ' + cardService.header.encodedKey
						}
					})
					.always( function( data, textStatus, jqXHR ) {

						if ( !data || data.DataLanguageKey !== "c2c.c2callowed" ) {
							session.setC2cStatus( data.DataLanguageKey );
							loadPage( "no-transfer" );
						} else {
							loadPage( pageName );
						}

					} );
	    		}
	    	};
	    }

	    function getPreloader( navTo ) {
	    	var preloaderName = null;

	    	if ( navTo ) {
	    		preloaderName = navTo.replace('-', '');
	    	}

	    	return preloaders[ preloaderName ];
	    }

	    function bindMenuLinks() {

	    	if ( !preloaders ) {
	    		setPreloaders();
	    	}

	    	$( "[data-nav-to]" ).on( "click", function() {
	    		var $link = $( this );

			    onMenuClick( $link );
	    	} );

	    }

	    /**
	     * Binds the anchor tag to the corresponding HTML page and JS resources,
	     * only for those who have data-nav-to attribute
	     */
	    function bindMenu( menuSelector ) {

	    	if ( !preloaders ) {
	    		setPreloaders();
	    	}

	    	$( menuSelector ).each( function( index, element ) {
	    		var $element = $( element );

	    		if ( $element.attr("data-nav-to") ) {
	    			$element.on( "click", function() {
			    		var $link = $( this );

			    		onMenuClick( $link );
			    	} );
	    		}
	    	} );
	    }

	    function onMenuClick( $link ) {

	    	var pageName = $link.attr( "data-nav-to" );

	    	if ( !pageName ) {
	    		return;
	    	}

    		var preloader = getPreloader( pageName );

    		if ( preloader ) {
    			preloader( pageName );
    		} else {
    			loadPage( pageName );
    		}

	    }

	    function displayUserName() {
	    	var userName = session.firstName() + " " + session.lastName(),
	    	    cardEnding = currentLocale.cardEnding.replace('{first4}', session.first4) + " - " + session.last4(),
				lastLogin = session.lastLoginDate(),
				lastLoginDate = lastLogin ? "<span class='last-login-date'>" + currentLocale.lastLoginDate + ": " + lastLogin + "</span>" : "",
				iBan = session.iBan() && session.iBan().toLowerCase() !== "null" ? `<br/><span>IBAN: ${session.iBan()}</span>` : "",
	    	    userCardHTML = $.parseHTML( "<strong>" + userName + "</strong><span> | " + cardEnding + "</span>" + iBan + lastLoginDate );

	    	$( "#firstLastName" ).append( userCardHTML );
	    }

	    function onLoadedScriptLanguage() {

	    	var firstPage = "activity-detail";

	    	locale = localeLoader.getLocale();
	    	currentLocale = locale.getCurrentLocale();
	    	bank.FeatureDetection.testFeatures();

	    	if ( session.vendor() ) {

	    		firstPage = "merchant-payment";

	    	}

	    	if ( isNewCredentialSettings ) {

	    		hideMenuItems();
	    		hideSidebar();
				loadPage( "new-credentials" );
				bindKillSession();

			} else if ( session.verifyDevice() || session.pageToLoadWithNoCredentials() ) {

				let pageToLoad = session.verifyDevice() ? "verify-device" : session.pageToLoadWithNoCredentials();

				hideMenuItems();
	    		hideSidebar();
				loadPage( pageToLoad );
				detachLogout();

			} else {

				manageTopUpBillPayOptions();				
				bindMenuLinks();
				bindMobileMenuClick();
				displayUserName();
				loadjqGridLocale();
				loadPage( firstPage );

			}

			setTimeoutDisplayer();
			//checkTLSVersion(); //this could be used in the future again
	    }

	    function bindMobileMenuClick() {
	    	$( "[data-toggle='mobile-menu-trigger']" ).on( "click", function() {

    			$("#nav-trigger span").trigger( "click" );

    		} );
	    }

	    function setTimeoutDisplayer() {
	    	var options = {
	    		$popover: $( "#firstLastName" ),
	    		title: translator.translationFor( "sessionTimeout.title" ),
	    		textContent: translator.translationFor( "sessionTimeout.textContent" ),
	    		noThanks: translator.translationFor( "sessionTimeout.noThanks" ),
	    		yes: translator.translationFor( "sessionTimeout.yes" )
	    	};

	    	timeoutDisplayer = new TimeoutDisplayer( options );

			sessionTimeout.init( timeoutDisplayer );
	    }

	    function loadPage( pageName ) {
	    	var htmlPath = "./" + pageName + ".html";
	    	var jsPath = "js/" + pageName + ".js";

			$( bodyContainerSelector ).load( htmlPath, function( responseText, textStatus, jqXHR ) {
				animate();
				$.getScript( jsPath, function( script, textStatus, jqxhr ) {
					loadConfigInitial();
				} );
			} );
	    }

	    function loadConfigInitial()  {

	    	$( bank.ConfigLoader ).on( "configInitial.loaded", function() {

	            applyCustomFeatures();
	            // remove listener, since, once the config is loaded, it will not be loaded again
	            $( bank.ConfigLoader ).off( "configInitial.loaded" );
	        } );

	        if ( !bank.ConfigInitial ) {

	            bank.ConfigLoader.loadConfigInitial();

	        }			
	    }

	/**
     * Attaches custome HTML elements
     */
    function applyCustomFeatures() {            

        if ( !bank.ConfigInitial || !bank.ConfigInitial.getCustomFeatures ) {
            return;
        }

        var features = bank.ConfigInitial.getCustomFeatures();

        for ( var featureName in features ) {
            var feature = features[ featureName ];
            
            feature.attach();

            var $element = $( "#" + feature.id );

            if ( feature.action ) {
                $element.on( "click", feature.action.bind( this ) );    
            }
        }
    }

	    function loadjqGridLocale() {
	    	var langTags = currentLangTag.split('-');
	    	var jqGridLoalePath = "js/jqgrid/locale/grid.locale-" + langTags[0] + ".min.js";

	    	$.getScript( jqGridLoalePath, function( script, textStatus, jqxhr ) {

	    	} );
	    }

	    function animate() {
	    	$('.page-header>h1').animate({
		        opacity: 1,
		        top: -10
		    }, 1000);

		    $('.bank-header--vertical-center>h1').animate({
		        opacity: 1
		    }, 1000);

		    $('h2').animate({
		        opacity: 1,
		        top: +10
		    }, 1000);

		    $('#content p').animate({
		        opacity: 1,
		        top: +5
		    }, 1000);
	    }

	    function manageMobileMenu() {
	    	if ( session.pageToLoadWithNoCredentials() ) {
	    		$("#nav-trigger > span").detach();
	    		return;
	    	}

	    	$("#nav-trigger > span").text("MENU");

	    	var mobileLogout = '<span class="sidebarmobile"><li><a id="mobileLogout" href="#" data-lang-key="logout"></a></li></span>';

	    	if ( isNewCredentialSettings ) {
	    		mobileLogout = '<ul id="cardholder-mobile-links">' + mobileLogout + '</ul>'
	    		$( $.parseHTML( mobileLogout ) ).appendTo( "#nav-mobile" );
	    	} else {
	    		var $cardholderMenu = $("#cardholder-svcs").clone();
	    		$cardholderMenu.children( "h2" ).detach();
	    		$cardholderMenu.children( "ul#cardholder-svcs-links" ).attr( "id", "cardholder-mobile-links" );
	    		$cardholderMenu.find( "ul>li>a" ).attr( "data-toggle", "mobile-menu-trigger" );
	    		$( "#nav-mobile" ).html( $cardholderMenu.html() );
	    		addLogoutToMobileMenu( $.parseHTML( mobileLogout ) );
	    	}

	    	$("#nav-trigger span").on( "click", function () {
		        if ($("#cardholder-mobile-links").hasClass("expanded")) {
		            $("#cardholder-mobile-links.expanded").removeClass("expanded").slideUp(250);
		            $(this).removeClass("open");
		        } else {
		            $("#cardholder-mobile-links").addClass("expanded").slideDown(250);
		            $(this).addClass("open");
		        }
		    });
	    }

	    function addLogoutToMobileMenu( mobileLogoutHTML ) {
	    	$( mobileLogoutHTML ).appendTo( "#nav-mobile ul" );
	    }

	    function hideMenuItems() {
	    	$( "#nav-main ul li a" ).addClass( "hidden" );
	    }

	    function hideSidebar() {
	    	$( "#sidebar" ).addClass( "hidden" );
	    }

	    function manageTopUpBillPayOptions() {

	    	if ( session.billPayEnabled() ) {
	    		addMainSvcsDiv();

	    		// <mainMenu>
	    		var payBills = $.parseHTML( '<div class="dropdown"><h2 class="paybills dropdown-submenu"><a id="payBillMenu" href="#" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">' +
	    									currentLocale.menu.payBills +'</a>' + getBillPayMenu() + '</h2></div>' );

	    		$( payBills ).appendTo( "#main-svcs" );
	    		// </mainMenu>

	    		// <mobileMenu>
	    		var mobilePayBills = '<li class="dropdown"><a id="mobilePayBillMenu" href="#" data-toggle="dropdown" aria-expanded="false">' + currentLocale.menu.payBills +'<span class="caret"></span></a>{dropdownMenu}</li>';
	    		var payBillsSidebarmobile = $.parseHTML( mobilePayBills.replace( "{dropdownMenu}", getMobileBillPayMenu() ) );
	    		var $mobileLogout = $( "#mobileLogout" ).parent();
	    		$( payBillsSidebarmobile ).insertBefore( $mobileLogout );
	    		// </mobileMenu>

	    		bank.ui.DropdownSubmenu.bindDropdownSubmenus();
	    	}

	    	if( session.topUpEnabled() ) {
	    		addMainSvcsDiv();

	    		var topUp = $.parseHTML( '<h2 class="paybills" data-nav-to="mobile-top-up"><a href="#">' + currentLocale.menu.mobileTopUp +'</a></h2>' );
	    		$( topUp ).appendTo( "#main-svcs" );

	    		var topUpSidebarmobile = $.parseHTML( '<li><a href="#" data-toggle="mobile-menu-trigger" data-nav-to="mobile-top-up">' + currentLocale.menu.mobileTopUp +'</a></li>' );
	    		var $mobileLogout = $( "#mobileLogout" ).parent();
	    		$( topUpSidebarmobile ).insertBefore( $mobileLogout );
	    	}
	    }

	    function getBillPayMenu() {
	    	var billPayMenu = '<ul class="dropdown-menu dropdown-submenu--border-color" aria-labelledby="payBillMenu" role="menu">{paymentVendorLinks}</ul>';
	    	var divider = '<li role="separator" class="divider"></li>';
	    	var paymentVendors = session.billPayMenu().split(",");
	    	var paymentVendorLinks = '';
	    	var i = paymentVendors.length;

	    	while ( --i > -1 )
	    	{
	    		var pamentVendorLink = paymentVendors[i];
	    		paymentVendorLinks += '<li><a class="dropdown-submenu--color" href="#" tabindex="-1" data-toggle="mobile-menu-trigger" data-id="' + i + '" data-nav-to="' + bank.formatForDataNavTo( pamentVendorLink ) + '">' + pamentVendorLink + '</a></li>';

	    		if ( i > 0 ) {
	    			paymentVendorLinks += divider;
	    		}
	    	}

	    	return billPayMenu.replace("{paymentVendorLinks}", paymentVendorLinks);
	    }

	    function getMobileBillPayMenu() {
	    	var billPayMenu = '<ul class="dropdown-menu" aria-labelledby="mobilePayBillMenu" role="menu">{paymentVendorLinks}</ul>';
	    	var paymentVendors = session.billPayMenu().split(",");
	    	var paymentVendorLinks = '';
	    	var i = paymentVendors.length;

	    	while ( --i > -1 )
	    	{
	    		var pamentVendorLink = paymentVendors[i];
	    		paymentVendorLinks += '<li><a href="#" tabindex="-1" data-toggle="mobile-menu-trigger" data-id="' + i + '" data-nav-to="' + bank.formatForDataNavTo( pamentVendorLink ) + '">' + pamentVendorLink + '</a></li>';
	    	}

	    	return billPayMenu.replace("{paymentVendorLinks}", paymentVendorLinks);
	    }

	    function addMainSvcsDiv() {
	    	if ( $( "#main-svcs" ).length == 0 ) {

				var mainsvcsDiv = $.parseHTML( '<div id="main-svcs"></div>' );
				$( mainsvcsDiv ).appendTo( "#sidebar" );

    		}
	    }

	    function manageVbv() {

	    	if ( session.vbvUrl() ) {
	    		var vbvUrlAttr = {
	    			href: session.vbvUrl(),
	    			target: "_blank"
	    		};

	    		addCtaDiv();

	    		var verifiedByVisaMobile = $.parseHTML( '<li><a id="verifiedByVisaMobile" data-toggle="mobile-menu-trigger" href="#"><img src="images/verifiedbyvisa.png" /></a></li>' );
	    		var $mobileLogout = $( "#mobileLogout" ).parent();
	    		$( verifiedByVisaMobile ).insertBefore( $mobileLogout );

	    		var verifiedByVisaMain = $.parseHTML( '<a id="verifiedByVisaMain" href="#"><img src="images/verifiedbyvisa.png" /></a>' );
	    		$( verifiedByVisaMain ).appendTo( "div.cta" );

	    		$( "#verifiedByVisaMain" ).attr( vbvUrlAttr );
	    		$( "#verifiedByVisaMobile" ).attr( vbvUrlAttr );
	    	}

	    }

	    function addCtaDiv() {
	    	if ( $( "#sidebar > .cta" ).length == 0 ) {

				var ctaDiv = $.parseHTML( '<div class="cta"></div>' );
				$( ctaDiv ).appendTo( "#sidebar" );

    		}
	    }

	    /**
	     * Checks if the browser is using the most secure TLS available up to March 2018
	     */
	    function checkTLSVersion() {
	    	$.ajax({
				url: "https://www.howsmyssl.com/a/check",
				error: function( jqXHR, textStatus, errorThrown ) {

        		},
        		success: function( data, textStatus, jqXHR ) {
        			var tlsVersion = data.tls_version.split(' ')[1];

					if ( tlsVersion <= 1.1 ) {
                     	displayTLSMessage();
                     	saveTlsVersion(tlsVersion);
                    }

        		},
        		complete: function( jqXHR, textStatus ) {
        		}
			});
	    }

	    function displayTLSMessage() {
	    	var tlsLastDate = new Date('03/31/2018'),
	    	    today = new Date(),
	    	    daysDiff = bank.getDiffInDays( tlsLastDate, today ),
	    	    message = currentLocale.tls.versionMessage.replace( '{days}', daysDiff );

	    	modalError.error( "display", {	    		
                modalTitle: currentLocale.tls.title,
                errorMessage: message,
                contactSupport: currentLocale.contactSupport,
                isHtml: true
            });
	    }

	    function saveTlsVersion(tlsVersion) {	    	
			var cardService = bank.Init.getCardService();

	    	$.ajax({
				url: cardService.baseUrl + 'tlsnotification/?tlsVersion=' + tlsVersion,
				headers: {
					From: cardService.header.id,
					Authorization: 'GTP ' + cardService.header.encodedKey,
					IEAuth: 'GTP ' + cardService.header.encodedKey
				},
				type: "POST",
        		error: function( jqXHR, textStatus, errorThrown ) {        			
        		},
        		success: function( data, textStatus, jqXHR ) {        			
        		},
        		complete: function( jqXHR, textStatus ) {
        		}
			});

	    }

	} );

} ) );