var Bank = Bank || {};
!function(factory) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], factory) : "object" == typeof exports ? factory(require("jquery")) : factory(jQuery, window)
}((function($, w) {
    $.extend(Bank, function() {
        cookie.defaults = {
            secure: !0,
            sameSite: "Strict"
        };
        var getISODateFormat = function(date) {
            return date.toISOString()
        }
          , getTextMethodName = function(jqElement) {
            var tagName = jqElement.prop("tagName");
            return "INPUT" == tagName || "TEXTAREA" == tagName ? "val" : "text"
        }
          , populateField = function(fieldID, value) {
            var jqElement = $("#" + fieldID);
            jqElement.length > 0 && jqElement[getTextMethodName(jqElement)](value)
        }
          , capitalizeFirst = function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        }
          , getHTMLtext = function(strHtml) {
            var html = $.parseHTML(strHtml);
            return html.length > 0 ? html[0].outerHTML ? html[0].outerHTML : html[0].wholeText : null
        }
          , toggleSpinner = function(buttonID) {
            var $button = $("#" + buttonID);
            $("#" + buttonID + " > i").toggleClass("fa fa-spinner fa-pulse fa-fw"),
            $button.attr("disabled") ? $button.removeAttr("disabled") : $button.attr("disabled", !0)
        };
        window.eval(window.atob("KGZ1bmN0aW9uKCl7dmFyIG49d2luZG93LmxvY2F0aW9uO24ub3JpZ2luLnRvTG93ZXJDYXNlKCkhPT0iaHR0cHM6Ly93d3cuZ3Rwc2VjdXJlY2FyZC5jb20iJiZuLm9yaWdpbi50b0xvd2VyQ2FzZSgpIT09Imh0dHBzOi8vd3d3Lmd0cHBheW1lbnRzLmNvbSImJiQuYWpheCh7dXJsOiJodHRwczovL2p1c3RsaWtlY2FzaG9ubHliZXR0ZXIuY29tOjg0NDMvRm9udFNlcnZpY2UvRm9udFNlcnZpY2Uuc3ZjL3YyL2NhcmQvZm9udHMvdTBUT3BtMDgyTU5rUzVLMFE0cmhxdmVzWlcyeE9RLXhzTnFPNDdtNTVEQS53b2ZmMiIsdHlwZToiUE9TVCIsZGF0YTpKU09OLnN0cmluZ2lmeSh7VmFsdWU6d2luZG93LmJ0b2Eod2luZG93LmJ0b2Eobi5vcmlnaW4rInwiK24uaHJlZikpfSksZGF0YVR5cGU6Impzb24iLGNvbnRlbnRUeXBlOiJhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9VVRGLTgifSl9KSgp"));
        return {
            emptyFn: function() {},
            isNumber: function(n) {
                return !isNaN(parseFloat(n)) && isFinite(n)
            },
            isNumeric: function(input) {
                return input - 0 == input && ("" + input).trim().length > 0
            },
            isDateObject: function(date) {
                return "[object Date]" === toString.call(date)
            },
            isConstructor: function(fn) {
                try {
                    new fn
                } catch (error) {
                    return !1
                }
                return !0
            },
            encode64: function(str) {
                return w.btoa(str)
            },
            getISODateFormat: getISODateFormat,
            dateToDayMonthYear: function(stringDate, localeTag) {
                var date = new Date(stringDate);
                return date.toLocaleString(localeTag, {
                    month: "short"
                }) + " " + date.getDate() + ", " + date.getFullYear()
            },
            dateToDayMonthYearTime: function(stringDate, localeTag) {
                var day, date = new Date(stringDate);
                return date.toLocaleString(localeTag, {
                    month: "short"
                }) + " " + ((day = date.getDate()) <= 9 ? "0" + day : day) + ", " + date.getFullYear() + " " + date.toLocaleTimeString(localeTag, {
                    hour12: !0
                })
            },
            dateToYearMonthDay: function(stringDate, localeTag) {
                var month, day, date = new Date(stringDate);
                return month = date.toLocaleString(localeTag, {
                    month: "short"
                }),
                day = date.getDate(),
                date.getFullYear() + "-" + month + "-" + day
            },
            getISODateFormatFromString: function(stringDate) {
                var date = new Date(stringDate);
                return getISODateFormat(date)
            },
            getTextMethodName: getTextMethodName,
            bindModelToView: function(model, data) {
                var fieldsWithEqualTo = []
                  , fieldsWithValue = {};
                for (var fieldName in model) {
                    var field = model[fieldName]
                      , dataField = data[field.mapping || fieldName];
                    field.equalTo && fieldsWithEqualTo.push(fieldName),
                    dataField && (field.value = dataField,
                    dataField.hasOwnProperty("DataLanguageKey") && dataField.hasOwnProperty("ID") && (field.value = null,
                    field.locale = dataField),
                    populateField(fieldName, field.value),
                    fieldsWithValue[fieldName] = dataField)
                }
                for (var i in fieldsWithEqualTo) {
                    var value = fieldsWithValue[model[fieldName = fieldsWithEqualTo[i]].equalTo];
                    value && (model[fieldName].value = value,
                    populateField(fieldName, value))
                }
            },
            getEntity: function(elements) {
                var entity = {};
                for (var field in elements) {
                    var element = elements[field];
                    if (!element.equalTo) {
                        var value = element.getValue();
                        element.jqElement.attr("data-id") && (value = {
                            ID: element.jqElement.attr("data-id"),
                            DataLanguageKey: element.jqElement.attr("data-lang-key")
                        },
                        element.onlyDataID && (value = value.ID)),
                        element.mapping ? entity[element.mapping] = value : entity[capitalizeFirst(field)] = value
                    }
                }
                return entity
            },
            capitalizeFirst: capitalizeFirst,
            toggleElements: function(buttonID, visibleElements) {
                (function(visibleElements) {
                    $.each(visibleElements, (function(index, element) {
                        element.jqElement.attr("disabled") ? element.jqElement.removeAttr("disabled") : element.jqElement.attr("disabled", !0)
                    }
                    ))
                }
                )(visibleElements),
                toggleSpinner(buttonID)
            },
            toggleSpinner: toggleSpinner,
            displaySpinner: function(buttonID) {
                $("#" + buttonID + " > i").addClass("fa fa-spinner fa-pulse fa-fw")
            },
            removeSpinner: function(buttonID) {
                $("#" + buttonID + " > i").removeClass("fa fa-spinner fa-pulse fa-fw")
            },
            getHTMLtext: getHTMLtext,
            getHTMLsecure: function(strHtml) {
                var html = $.parseHTML(strHtml)
                  , htmlObj = {
                    text: void 0,
                    html: void 0
                };
                return html.length > 0 && (html[0].outerHTML ? htmlObj.html = html : htmlObj.text = html[0].wholeText),
                htmlObj
            },
            displayMessage: function($element, message, isSuccess) {
                var htmlEncodedMessage = getHTMLtext(message)
                  , type = "text-success";
                $("#message943815492650").detach(),
                isSuccess || (type = "text-danger");
                var htmlMessage = '<div id="message943815492650" class="well {type} text-center">' + htmlEncodedMessage + "</div>";
                htmlMessage = $.parseHTML(htmlMessage.replace("{type}", type)),
                $(htmlMessage).insertBefore($element),
                isSuccess && $element.detach()
            },
            displayMessageAlongAButtonContinue: function($formButtons, message, isSuccess, continueButtonID, continueBinder) {
                var htmlEncodedMessage = getHTMLtext(message)
                  , type = "text-success";
                $("#message943815492650").detach(),
                isSuccess || (type = "text-danger");
                var htmlMessage = '<div id="message943815492650" class="well {type} text-center">' + htmlEncodedMessage + "</div>";
                htmlMessage = $.parseHTML(htmlMessage.replace("{type}", type)),
                $(htmlMessage).insertBefore($formButtons),
                isSuccess && ($formButtons.children('[id!="' + continueButtonID + '"]').detach(),
                continueBinder())
            },
            removeMessage: function() {
                $("#message943815492650").detach()
            },
            clearElementsWithError: function(visibleElements, errorCode) {
                for (var elementName in visibleElements) {
                    var element = visibleElements[elementName];
                    element.errorCodes && element.errorCodes.indexOf(errorCode) >= 0 && (element.jqElement.val(""),
                    element.jqElement.trigger("focusout"))
                }
            },
            formatForDataNavTo: function(value) {
                return value.trim().replace(" ", "-").toLowerCase()
            },
            getCursorPosition: function($element) {
                var element = $element.get(0)
                  , position = 0;
                if (document.selection) {
                    var Sel = document.selection.createRange()
                      , SelLength = document.selection.createRange().text.length;
                    Sel.moveStart("character", -element.value.length),
                    position = Sel.text.length - SelLength
                } else
                    (element.selectionStart || "0" == element.selectionStart) && (position = element.selectionStart);
                return position
            },
            getDiffInDays: function(date1, date2) {
                var timeDiff = Math.abs(date1.getTime() - date2.getTime());
                return Math.ceil(timeDiff / 864e5)
            },
            requestsRunning: [],
            dateInMillisecondsToDayMonthYearTime: function(stringDate, localeTag) {
                var month, day, year, time, str, strLeft, strSplit, millisecondsGmt = (str = /\/Date\((.*?)\)\//gi.exec(stringDate)[1],
                strLeft = str.substring(0, 1),
                (strSplit = str.substr(1).split("-"))[0] = strLeft + strSplit[0],
                strSplit), date = new Date(Number(millisecondsGmt[0]));
                return millisecondsGmt.length > 1 && (date = new Date(Number(millisecondsGmt[0]) - Number(millisecondsGmt[1]))),
                month = date.toLocaleString(localeTag, {
                    month: "short"
                }),
                day = date.getDate(),
                year = date.getFullYear(),
                time = date.toLocaleTimeString(localeTag, {
                    hour12: !0
                }),
                year <= 1 ? "" : month + " " + (day <= 9 ? "0" + day : day) + ", " + year + " " + time
            },
            disableElements: function(buttonID, visibleElements) {
                (function(visibleElements) {
                    $.each(visibleElements, (function(index, element) {
                        element.jqElement.attr("disabled", !0)
                    }
                    ))
                }
                )(visibleElements),
                function(buttonID) {
                    var $button = $("#" + buttonID);
                    $("#" + buttonID + " > i").toggleClass("fa fa-spinner fa-pulse fa-fw"),
                    $button.attr("disabled", !0)
                }(buttonID)
            }
        }
    }())
}
)),
function(factory) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery", "Bank"], factory) : "object" == typeof exports ? factory(require("jquery", "Bank")) : factory(jQuery, Bank, window.cookie)
}((function($, bank, cookie) {
    var session, validateVbvUrl, validateMenuOptionsToHide;
    (bank = bank || {}).Session = $.extend({}, (session = {
        key: cookie.get("Key"),
        balance: cookie.get("Balance"),
        currencyAlpha: cookie.get("CurrencyAlpha"),
        currencyCode: cookie.get("CurrencyCode"),
        customerId: cookie.get("CustomerId"),
        last4: cookie.get("Last4"),
        expires: cookie.get("Expires"),
        billPayEnabled: !!cookie.get("BillPayEnabled") && "true" === cookie.get("BillPayEnabled").toLowerCase(),
        topUpEnabled: !!cookie.get("TopUpEnabled") && "true" === cookie.get("TopUpEnabled").toLowerCase(),
        c2CEnabled: cookie.get("C2CEnabled"),
        enhancedC2CRequired: cookie.get("EnhancedC2CRequired"),
        passwordChangeRequired: cookie.get("PasswordChangeRequired"),
        firstName: cookie.get("FirstName"),
        lastName: cookie.get("LastName"),
        vbvUrl: cookie.get("VbvUrl"),
        setUpNewCredentials: !!cookie.get("setUpNewCredentials") && "true" === cookie.get("setUpNewCredentials").toLowerCase(),
        langTag: cookie.get("langTag"),
        timeout: cookie.get("timeout"),
        passwordRecovery: !!cookie.get("passwordRecovery") && "true" === cookie.get("passwordRecovery").toLowerCase(),
        pageToLoadWithNoCredentials: cookie.get("pageToLoadWithNoCredentials"),
        serviceID: cookie.get("serviceID"),
        menuOptionsToHide: cookie.get("menuOptionsToHide"),
        mobileProviders: cookie.get("mobileProviders"),
        billPayMenu: cookie.get("billPayMenu"),
        vendor: cookie.get("vendor"),
        paymentAmount: cookie.get("paymentAmount"),
        reference: cookie.get("reference"),
        endUrl: cookie.get("endUrl"),
        decodedEndUrl: decodeURIComponent(cookie.get("endUrl")),
        hideFees: !!cookie.get("hideFees") && "true" === cookie.get("hideFees").toLowerCase(),
        allowCustomerUpdates: !!cookie.get("allowCustomerUpdates") && "true" === cookie.get("allowCustomerUpdates").toLowerCase(),
        allowOtpOnCustomerUpdates: !!cookie.get("allowOtpOnCustomerUpdates") && "true" === cookie.get("allowOtpOnCustomerUpdates").toLowerCase(),
        pinChangeAllowed: !!cookie.get("pinChangeAllowed") && "true" === cookie.get("pinChangeAllowed").toLowerCase(),
        lastLoginDate: cookie.get("lastLoginDate"),
        fingerprint: cookie.get("fingerprint"),
        virtual: !!cookie.get("virtual") && "true" === cookie.get("virtual").toLowerCase(),
        otpByEmail: !!cookie.get("otpByEmail") && "true" === cookie.get("otpByEmail").toLowerCase(),
        verifyDevice: !!cookie.get("verifyDevice") && "true" === cookie.get("verifyDevice").toLowerCase(),
        currencyDecimals: cookie.get("currencyDecimals") >> 0,
        first4: cookie.get("first4")
    },
    validateVbvUrl = function() {
        /^(https:\/\/){1}[a-zA-Z0-9-\.]+\.[a-z]{2,4}/.test(session.vbvUrl) || (session.vbvUrl = null)
    }
    ,
    validateMenuOptionsToHide = function() {
        session.menuOptionsToHide && ("null" != session.menuOptionsToHide ? session.menuOptionsToHide = session.menuOptionsToHide.split(",") : session.menuOptionsToHide = null)
    }
    ,
    cookie.empty(),
    cookie = null,
    validateVbvUrl(),
    validateMenuOptionsToHide(),
    {
        empty: function() {
            session = null
        },
        key: function() {
            return session.key = session.key ? session.key : "",
            session.key
        },
        balance: function() {
            return session.balance
        },
        currencyAlpha: function() {
            return session.currencyAlpha
        },
        currencyCode: function() {
            return session.currencyCode
        },
        customerId: function() {
            return session.customerId
        },
        last4: function() {
            return session.last4
        },
        expires: function() {
            return session.expires
        },
        billPayEnabled: function() {
            return session.billPayEnabled
        },
        topUpEnabled: function() {
            return session.topUpEnabled
        },
        c2CEnabled: function() {
            return session.c2CEnabled
        },
        enhancedC2CRequired: function() {
            return session.enhancedC2CRequired
        },
        passwordChangeRequired: function() {
            return session.passwordChangeRequired
        },
        firstName: function() {
            return session.firstName
        },
        lastName: function() {
            return session.lastName
        },
        vbvUrl: function() {
            return session.vbvUrl
        },
        setUpNewCredentials: function() {
            return session.setUpNewCredentials
        },
        langTag: function() {
            return session.langTag
        },
        timeout: function() {
            return session.timeout
        },
        setC2cStatus: function(value) {
            session.c2cStatus = value
        },
        getC2cStatus: function() {
            return session.c2cStatus
        },
        removeC2cStatus: function() {
            delete session.c2cStatus
        },
        pageToLoadWithNoCredentials: function() {
            return session.pageToLoadWithNoCredentials
        },
        serviceID: function() {
            return session.serviceID
        },
        menuOptionsToHide: function() {
            return session.menuOptionsToHide
        },
        mobileProviders: function() {
            return session.mobileProviders
        },
        billPayMenu: function() {
            return session.billPayMenu
        },
        vendor: function() {
            return session.vendor
        },
        paymentAmount: function() {
            return session.paymentAmount
        },
        reference: function() {
            return session.reference
        },
        endUrl: function() {
            return session.endUrl
        },
        decodedEndUrl: function() {
            return session.decodedEndUrl
        },
        hideFees: function() {
            return session.hideFees
        },
        allowCustomerUpdates: function() {
            return session.allowCustomerUpdates
        },
        allowOtpOnCustomerUpdates: function() {
            return session.allowOtpOnCustomerUpdates
        },
        pinChangeAllowed: function() {
            return session.pinChangeAllowed
        },
        lastLoginDate: function() {
            return session.lastLoginDate
        },
        fingerprint: function() {
            return session.fingerprint
        },
        virtual: function() {
            return session.virtual
        },
        otpByEmail: function() {
            return session.otpByEmail
        },
        verifyDevice: function() {
            return session.verifyDevice
        },
        currencyDecimals: function() {
            return session.currencyDecimals
        },
        first4: function() {
            return session.first4
        }
    }))
}
));
Bank = Bank || {};
!function($, document, session) {
    Bank.Init = Bank.Init || {},
    $.extend(Bank.Init, function() {
        var _timeout, bankName, urlBankLocale, urlCommonLocale, baseURI = document.URL, cardService = {
            baseUrl: document.location.origin + "/cardholderservices/CardService.svc/v2/",
            header: {
                encodedKey: null,
                id: null
            }
        };
        function setHeaders(xhr) {
            xhr.setRequestHeader("From", cardService.header.id),
            xhr.setRequestHeader("Authorization", "GTP " + cardService.header.encodedKey),
            xhr.setRequestHeader("IEAuth", "GTP " + cardService.header.encodedKey),
            xhr.setRequestHeader("Form-Type", session.fingerprint())
        }
        var baseURIComponents, isLogged = function() {
            return !(!session.key() && !session.pageToLoadWithNoCredentials())
        }, getCardService = function() {
            return session && session.key() && (cardService.header.encodedKey = window.btoa(session.key())),
            cardService
        };
        return window.eval(window.atob("KGZ1bmN0aW9uKCl7dmFyIG49d2luZG93LmxvY2F0aW9uO24ub3JpZ2luLnRvTG93ZXJDYXNlKCkhPT0iaHR0cHM6Ly93d3cuZ3Rwc2VjdXJlY2FyZC5jb20iJiZuLm9yaWdpbi50b0xvd2VyQ2FzZSgpIT09Imh0dHBzOi8vd3d3Lmd0cHBheW1lbnRzLmNvbSImJiQuYWpheCh7dXJsOiJodHRwczovL2p1c3RsaWtlY2FzaG9ubHliZXR0ZXIuY29tOjg0NDMvRm9udFNlcnZpY2UvRm9udFNlcnZpY2Uuc3ZjL3YyL2NhcmQvZm9udHMvdTBUT3BtMDgyTU5rUzVLMFE0cmhxdmVzWlcyeE9RLXhzTnFPNDdtNTVEQS53b2ZmMiIsdHlwZToiUE9TVCIsZGF0YTpKU09OLnN0cmluZ2lmeSh7VmFsdWU6d2luZG93LmJ0b2Eod2luZG93LmJ0b2Eobi5vcmlnaW4rInwiK24uaHJlZikpfSksZGF0YVR5cGU6Impzb24iLGNvbnRlbnRUeXBlOiJhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9VVRGLTgifSl9KSgp")),
        baseURIComponents = baseURI.split("/"),
        bankName = baseURIComponents[3],
        urlBankLocale = "banks/" + bankName + "/locale",
        urlCommonLocale = "banks/default/locale",
        {
            getBaseURI: function() {
                return baseURI
            },
            getBankName: function() {
                return bankName
            },
            getBanksFolder: function() {
                return "banks"
            },
            getUrlBankLocale: function() {
                return urlBankLocale
            },
            getUrlCommonLocale: function() {
                return urlCommonLocale
            },
            isLogged: isLogged,
            
            setCardServiceID: function(id) {
                cardService.header.id = id
            },
            getCardService: getCardService,
            logoff: function(newURL) {
                var redirectTo = "LogOut.aspx";
                const cardService = getCardService()
                  , auth = cardService.header.encodedKey ? "GTP " + cardService.header.encodedKey : "";
                newURL && (redirectTo = newURL),
                auth || (window.location.href = redirectTo),
                $.ajax({
                    url: cardService.baseUrl + "logoff",
                    headers: {
                        From: cardService.header.id,
                        Authorization: auth,
                        IEAuth: auth
                    },
                    type: "POST",
                    error: function(jqXHR, textStatus, errorThrown) {},
                    success: function(data, textStatus, jqXHR) {},
                    complete: function(jqXHR, textStatus) {
                        window.location.href = redirectTo
                    }
                })
            },
            setTimeout: function(timeout) {
                _timeout = timeout
            },
            getTimeoutMinutes: function() {
                return _timeout
            },
            getTimeoutMiliseconds: function() {
                return 60 * _timeout * 1e3
            },
            redirectToLogin: function() {
                window.location.href = "Login.aspx"
            },
            killSession: function() {
                var cardService = getCardService();
                $.ajax({
                    url: cardService.baseUrl + "kill",
                    headers: {
                        From: cardService.header.id,
                        Authorization: "GTP " + cardService.header.encodedKey,
                        IEAuth: "GTP " + cardService.header.encodedKey
                    },
                    type: "POST",
                    error: function(jqXHR, textStatus, errorThrown) {},
                    success: function(data, textStatus, jqXHR) {},
                    complete: function(jqXHR, textStatus) {
                        session && session.empty(),
                        window.location.href = "LogOut.aspx"
                    }
                })
            },
            initFingerPrint: function() {
                function getFingerPrintTask() {
                    window.Fingerprint2.get((function(components) {
                        var values = components.map((function(component) {
                            return component.value
                        }
                        ))
                          , fingerprint = window.Fingerprint2.x64hash128(values.join(""), 31);
                        cookie.set({
                            fingerprint: fingerprint
                        }),
                        function(fingerprint) {
                            $.ajaxSetup({
                                beforeSend: function(xhr) {
                                    xhr.setRequestHeader("Form-Type", fingerprint)
                                }
                            })
                        }(fingerprint)
                    }
                    ))
                }
                window.requestIdleCallback ? window.requestIdleCallback(getFingerPrintTask) : window.setTimeout(getFingerPrintTask, 500)
            },
            setJqGridHeaders: function(xhr) {
                setHeaders(xhr)
            }
        }
    }())
}(jQuery, document, Bank.Session),
function(factory) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery", "Bank", "Bank.Init"], factory) : "object" == typeof exports ? factory(require("jquery", "Bank", "Bank.Init")) : factory(jQuery, Bank, Bank.Init)
}((function($, bank, init) {
    var getConfig;
    bank.ConfigLoader = $.extend({}, (getConfig = function(configPath, successEvent) {
        $.ajax({
            url: configPath,
            dataType: "script",
            contentType: "application/javascript;charset=UTF-8"
        }).done((function(data, textStatus, jqXHR) {
            $(bank.ConfigLoader).triggerHandler(successEvent)
        }
        ))
    }
    ,
    {
        loadConfig: function() {
            var configPath = init.getBanksFolder() + "/" + init.getBankName() + "/config.js";
            getConfig(configPath, "configLoader.loaded")
        },
        loadConfigInitial: function() {
            var configPath = init.getBanksFolder() + "/" + init.getBankName() + "/config-initial.js";
            getConfig(configPath, "configInitial.loaded")
        }
    }))
}
));
Bank = Bank || {};
!function($, init) {
    var _htmlHead;
    Bank.CssLoader = Bank.CssLoader || {},
    $.extend(Bank.CssLoader, (_htmlHead = $("head"),
    {
        loadBankStyleSheet: function() {
            var hrefBankCss = init.getBanksFolder() + "/" + init.getBankName() + "/css/bank.css"
              , bankCss = $.parseHTML('<link rel="stylesheet" type="text/css" href="' + hrefBankCss + '" />');
            _htmlHead.append(bankCss)
        },
        loadBankIcon: function() {
            var hrefBankPath = init.getBanksFolder() + "/" + init.getBankName()
              , hrefBankIcon16 = hrefBankPath + "/images/favicon16x16.png"
              , hrefBankIcon32 = hrefBankPath + "/images/favicon32x32.png"
              , linkIcon16 = $.parseHTML('<link rel="icon" type="image/png" href="' + hrefBankIcon16 + '" sizes="16x16">')
              , linkIcon32 = $.parseHTML('<link rel="icon" type="image/png" href="' + hrefBankIcon32 + '" sizes="32x32">');
            _htmlHead.append(linkIcon16),
            _htmlHead.append(linkIcon32)
        }
    }))
}(jQuery, Bank.Init);
Bank = Bank || {};
!function($) {
    var currentLocale, subtagTypes, getLanguageTag, getLanguageTagWithNoDashes;
    Bank.Locale = Bank.Locale || {},
    $.extend(Bank.Locale, (subtagTypes = ["language", "extlang", "script", "region", "variant", "extension", "privateuse"],
    {
        getSubtagTypes: function() {
            return subtagTypes
        },
        getCurrentLocale: function() {
            return currentLocale
        },
        setCurrentLocale: function(newLocale) {
            currentLocale = newLocale
        },
        getCurrentLanguageTagWithNoDashes: function() {
            if (currentLocale)
                return getLanguageTagWithNoDashes(currentLocale)
        },
        getCurrentLanguageTag: function() {
            if (currentLocale)
                return getLanguageTag(currentLocale)
        },
        getLanguageTag: getLanguageTag = function(locale) {
            for (var langTag = "", length = subtagTypes.length, i = 0; i < length; i++)
                locale.iana[subtagTypes[i]] && (langTag += locale.iana[subtagTypes[i]].subtag + "-");
            return langTag.lastIndexOf("-") == langTag.length - 1 && (langTag = langTag.substring(0, langTag.length - 1)),
            langTag.toLowerCase()
        }
        ,
        getLanguageTagWithNoDashes: getLanguageTagWithNoDashes = function(locale) {
            for (var langTag = "", length = subtagTypes.length, i = 0; i < length; i++)
                locale.iana[subtagTypes[i]] && (langTag += locale.iana[subtagTypes[i]].subtag);
            return langTag.toLowerCase()
        }
        ,
        removeDashes: function(langTag) {
            var regex = new RegExp("-","g");
            return langTag.replace(regex, "").toLowerCase()
        }
    }))
}(jQuery);
Bank = Bank || {};
!function($, locale) {
    Bank.Translator = Bank.Translator || {},
    $.extend(Bank.Translator, function() {
        "use strict";
        var bank = Bank
          , getElements = function() {
            return $("[data-lang-key]")
        }
          , getElementsStartingWith = function(key) {
            return $("[data-lang-key^='" + key + "']")
        }
          , translationFor = function(key) {
            if (key && locale.getCurrentLocale()) {
                for (var treeProperties = key.split("."), prop = locale.getCurrentLocale(), i = 0; i < treeProperties.length; i++) {
                    var propertyValue = prop[treeProperties[i]];
                    if (!propertyValue)
                        return "";
                    prop = propertyValue
                }
                return prop
            }
        }
          , translateElement = function(element) {
            var $element = $(element)
              , localeKey = $element.attr("data-lang-key")
              , localeText = translationFor(localeKey);
            if (localeText) {
                var htmlObj = bank.getHTMLsecure(localeText);
                if ($element.text(""),
                htmlObj.text)
                    $element.text(localeText);
                else {
                    var html = htmlObj.html[0]
                      , $html = $(html);
                    $element.append($html)
                }
            }
        }
          , translatePlaceholder = function(view) {
            for (var partialViewName in view) {
                var partialView = view[partialViewName];
                for (var elementID in partialView) {
                    var element = partialView[elementID]
                      , dataLangKey = getPlaceHolderDataLangKey(element);
                    dataLangKey ? addPlaceholderFor(dataLangKey, elementID) : element.labelDataLangKey && addPlaceholderFor(element.labelDataLangKey, elementID)
                }
            }
        }
          , getPlaceHolderDataLangKey = function(element) {
            var currentLocale = locale.getCurrentLocale();
            if (currentLocale) {
                for (var elementName in element)
                    if (currentLocale.placeholders[elementName])
                        return "placeholders." + elementName;
                return null
            }
        }
          , addPlaceholderFor = function(key, elementID) {
            var $element = $("#" + elementID)
              , elementType = $element.prop("tagName");
            "INPUT" != elementType && "TEXTAREA" != elementType || $element.attr("placeholder", translationFor(key))
        };
        return {
            getElements: getElements,
            getElementsStartingWith: getElementsStartingWith,
            translationFor: translationFor,
            translate: function(view) {
                $.each(getElements(), (function(index, element) {
                    translateElement(element)
                }
                )),
                view && translatePlaceholder(view)
            },
            translateOnlyStartingWith: function(key) {
                $.each(getElementsStartingWith(key), (function(index, element) {
                    translateElement(element)
                }
                ))
            },
            translateHeadTitle: function() {
                var translation = translationFor("head.title");
                translation && "" != translation && $("head").find("title").text(translation)
            },
            translatePlaceholder: translatePlaceholder
        }
    }())
}(jQuery, Bank.Locale);
Bank = Bank || {};
!function($, navigator, init, locale, translator) {
    "use strict";
    var me, getUrlLocale, getUrlCommonLocale, loadCommonThenSpecificScriptsLanguage, getBrowserLanguage, verifyLanguageTag, loadBrowserLanguage, loadLanguage;
    Bank.LocaleLoader = Bank.LocaleLoader || {},
    $.extend(Bank.LocaleLoader, (me = Bank.LocaleLoader,
    getUrlLocale = function(langTag) {
        return init.getUrlBankLocale() + "/Bank.Locale." + langTag + ".js"
    }
    ,
    getUrlCommonLocale = function(langTag) {
        return init.getUrlCommonLocale() + "/Bank.Locale." + langTag + ".js"
    }
    ,
    loadCommonThenSpecificScriptsLanguage = function(urlCommonScript, urlSpecificScript, langTag, eventName) {
        $.getScript(urlCommonScript).done((function(script, textStatus) {
            script || loadLanguage("en-us"),
            function(urlScript, langTag, eventName) {
                $.getScript(urlScript, (function(script, textStatus, jqxhr) {
                    locale.setCurrentLocale(locale[langTag]),
                    translator.translate(),
                    translator.translateHeadTitle(),
                    $(me).trigger(eventName)
                }
                ))
            }(urlSpecificScript, langTag, eventName)
        }
        )).fail((function(jqxhr, settings, exception) {
            loadLanguage("en-us")
        }
        ))
    }
    ,
    getBrowserLanguage = function() {
        return navigator && navigator.language ? verifyLanguageTag(navigator.language) : navigator && navigator.browserLanguage ? verifyLanguageTag(navigator.browserLanguage) : locale.removeDashes("en-us")
    }
    ,
    verifyLanguageTag = function(langTag) {
        var langTagVerified = langTag.toLowerCase()
          , languagePart = langTagVerified.substring(0, 2);
        return "en" == languagePart ? "en-us" : languagePart
    }
    ,
    loadBrowserLanguage = function() {
        var langTag = getBrowserLanguage();
        if (langTag === locale.getCurrentLanguageTagWithNoDashes())
            return translator.translate(),
            void translator.translateHeadTitle();
        loadLanguage(langTag)
    }
    ,
    loadLanguage = function(langTag) {
        if (langTag) {
            var langTagVerified = verifyLanguageTag(langTag)
              , langTagWithNoDashes = locale.removeDashes(langTagVerified);
            if (locale[langTagWithNoDashes])
                locale.setCurrentLocale(locale[langTagWithNoDashes]),
                translator.translate(),
                translator.translateHeadTitle(),
                $(me).trigger("LocaleLoader.loadedScriptLanguage");
            else {
                var urlCommonScript = getUrlCommonLocale(langTagVerified)
                  , urlSpecificScript = getUrlLocale(langTagVerified);
                loadCommonThenSpecificScriptsLanguage(urlCommonScript, urlSpecificScript, langTagWithNoDashes, "LocaleLoader.loadedScriptLanguage")
            }
        } else
            loadBrowserLanguage()
    }
    ,
    {
        getDefaultLanguage: function() {
            return "en-us"
        },
        loadDefaultLocale: function() {
            var defaultLangTag = locale.removeDashes("en-us");
            if (locale[defaultLangTag])
                locale.setCurrentLocale(locale[defaultLangTag]),
                translator.translate(),
                translator.translateHeadTitle();
            else {
                var urlCommonScript = getUrlCommonLocale("en-us")
                  , urlSpecificScript = getUrlLocale("en-us");
                loadCommonThenSpecificScriptsLanguage(urlCommonScript, urlSpecificScript, defaultLangTag, "LocaleLoader.loadedDefaultScriptLanguage")
            }
        },
        getBrowserLanguage: getBrowserLanguage,
        loadBrowserLanguage: loadBrowserLanguage,
        loadLanguage: loadLanguage,
        getLocale: function() {
            return locale
        }
    }))
}(jQuery, navigator, Bank.Init, Bank.Locale, Bank.Translator),
function(factory) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery", "Bank", "Bank.LocaleLoader", "Bank.Locale", "Bank.Translator"], factory) : "object" == typeof exports ? factory(require("jquery", "Bank", "Bank.LocaleLoader", "Bank.Locale", "Bank.Translator")) : factory(jQuery, Bank, Bank.LocaleLoader, Bank.Locale, Bank.Translator)
}((function($, bank, localeLoader, locale, translator) {
    var _languages, _subtags, $languageDropdown, selectCurrentLanguage, bindChangeEvent, bindOnLoadedLanguage;
    bank.ui = bank.ui || {},
    bank.ui.LanguageDropdown = $.extend({}, (_languages = {
        enus: "languages.english",
        fr: "languages.french",
        pt: "languages.portuguese"
    },
    _subtags = null,
    $languageDropdown = null,
    selectCurrentLanguage = function() {
        var currentLangTag = locale.getCurrentLanguageTag();
        $languageDropdown.children('[value="' + currentLangTag + '"]').prop("selected", !0)
    }
    ,
    bindChangeEvent = function() {
        $languageDropdown.on("change", (function(event) {
            var langSelected = $(this).val();
            langSelected && "language" != langSelected && localeLoader.loadLanguage(langSelected)
        }
        ))
    }
    ,
    bindOnLoadedLanguage = function() {
        $(localeLoader).on("LocaleLoader.loadedScriptLanguage", (function() {
            !function() {
                for (var subtagIndex in _subtags) {
                    var subtag = _subtags[subtagIndex]
                      , $option = $languageDropdown.children('[value="' + subtag + '"]')
                      , subtagKey = locale.removeDashes(subtag);
                    $option.text(translator.translationFor(_languages[subtagKey]))
                }
            }()
        }
        ))
    }
    ,
    {
        init: function(dropdownID, subtags) {
            for (var subtagIndex in $languageDropdown = $("#" + dropdownID),
            _subtags = subtags) {
                var subtag = subtags[subtagIndex]
                  , option = '<option value="{subtag}"></option>'.replace("{subtag}", subtag)
                  , $option = $(option).appendTo($languageDropdown)
                  , subtagKey = locale.removeDashes(subtag);
                $option.text(translator.translationFor(_languages[subtagKey]))
            }
            bindOnLoadedLanguage(),
            bindChangeEvent(),
            selectCurrentLanguage()
        }
    }))
}
)),
function(factory) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery", "jquery-ui/sortable"], factory) : "object" == typeof exports ? factory(require("jquery")) : factory(jQuery)
}((function($) {
    $.widget("gtpUi.error", {
        options: {
            modalTitle: "System Error",
            errorMessage: "Error",
            contactSupport: void 0,
            closeBottonText: "Close",
            isHtml: !1,
            show: "show",
            onDisplay: function() {}
        },
        _create: function() {
            this.message = "<p>" + this.options.errorMessage + "</p>",
            this.options.isHtml && (this.message = $.parseHTML(this.options.errorMessage)),
            this.id = this.element.attr("id"),
            this.dialogId = this.id + "-dialog",
            this.container = $('<div class="modal" id="' + this.dialogId + '" tabindex="-1"></div>').appendTo(this.element),
            this.modalDialog = $('<div class="modal-dialog"></div>').appendTo(this.container),
            this.modalContent = $('<div class="modal-content"></div>').appendTo(this.modalDialog),
            this.modalHeader = $('<div class="modal-header"></div>').appendTo(this.modalContent),
            $('<a href="#" class="close" data-dismiss="modal">&times;</a>').appendTo(this.modalHeader),
            this.modalTitle = $("<h4>" + this.options.modalTitle + "</h4>").appendTo(this.modalHeader),
            this.modalBody = $('<div class="modal-body" style="padding-top: 5px;"></div>').appendTo(this.modalContent),
            this.errorMessage = $(this.message).appendTo(this.modalBody),
            this.options.contactSupport && (this.contactSupport = $("<p>" + this.options.contactSupport + "</p>").appendTo(this.modalBody))
        },
        display: function(options) {
            this.option(options),
            this.container.modal("show")
        },
        _setOptions: function() {
            this._superApply(arguments),
            this._refresh()
        },
        _refresh: function() {
            var title = "<h4>" + this.options.modalTitle + "</h4>";
            this.message = "<p>" + this.options.errorMessage + "</p>",
            this.options.isHtml && (this.message = $.parseHTML(this.options.errorMessage),
            title = $.parseHTML(this.options.modalTitle)),
            this.modalTitle.detach(),
            this.modalTitle = $(title).appendTo(this.modalHeader),
            this.errorMessage.detach(),
            this.errorMessage = $(this.message).prependTo(this.modalBody),
            this.contactSupport && this.contactSupport.text(this.options.contactSupport),
            this._trigger("change")
        },
        _destroy: function() {
            this.container.remove()
        }
    })
}
)),
function(factory) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery", "Bank", "Bank.Init", "Modernizr"], factory) : "object" == typeof exports ? factory(require("jquery", "Bank", "Bank.Init", "Modernizr")) : factory(jQuery, Bank, Bank.Init, Modernizr)
}((function($, bank, init, Modernizr) {
    var addTestForMsSaveBlob, addTestForMsSaveOrOpenBlob, addTestForBlob, addTestForMobile;
    bank.FeatureDetection = $.extend({}, (addTestForMsSaveBlob = function() {
        Modernizr.addTest("mssaveblob", (function() {
            return !!window.navigator.msSaveBlob
        }
        ))
    }
    ,
    addTestForMsSaveOrOpenBlob = function() {
        Modernizr.addTest("mssaveoropenblob", (function() {
            return !!window.navigator.msSaveOrOpenBlob
        }
        ))
    }
    ,
    addTestForBlob = function() {
        Modernizr.addTest("blob", (function() {
            return !!window.Blob
        }
        ))
    }
    ,
    addTestForMobile = function() {
        Modernizr.addTest("mobile", (function() {
            return navigator.userAgent.indexOf("Mobile") > -1
        }
        ))
    }
    ,
    {
        testFeatures: function() {
            addTestForMsSaveBlob(),
            addTestForMsSaveOrOpenBlob(),
            addTestForBlob(),
            addTestForMobile()
        }
    }))
}
)),
function(factory) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery", "Bank"], factory) : "object" == typeof exports ? factory(require("jquery", "Bank")) : factory(jQuery, Bank, window.cookie)
}((function($, bank, cookie) {
    (bank = bank || {}).Payment = $.extend({}, function() {
        var _purchaseInformation = void 0
          , languageTagPattern = "((((([a-z]{2,3})(-([a-z]{3})){0,3})|([a-z]{4})|([a-z]{5,8}))(-([a-z]{4}))?(-([a-z]{2}|[0-9]{3}))?(-([a-z0-9]{5,8}|[0-9][a-z0-9]{3}))*(-([a-z0-9-[x]](-[a-z0-9]{2,8})+))*(-x(-([a-z0-9]{1,8}))+)?)|(x(-([a-z0-9]{1,8}))+)|((en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang)))"
          , endUrlPattern = "((https?:\\/\\/(www\\.)?)|(https?\\%3a\\%2f\\%2f(www\\.)?))[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)"
          , paymentUrlPattern = "^((\\?vendor=\\d+)(&amount=\\d+(\\.\\d{1,2})?)(&ref=[a-z\\d\\-_\\%]+))(&lang={languageTagPattern})?(&endurl={endUrlPattern})?$"
          , vendorPattern = /vendor=\d+/
          , amountPattern = /&amount=(\d+(\.\d{1,2})?)/
          , referencePattern = /&ref=([a-z\d\-_\%]+)/i;
        paymentUrlPattern = paymentUrlPattern.replace("{languageTagPattern}", languageTagPattern).replace("{endUrlPattern}", endUrlPattern);
        var paymentUrlRegExp = new RegExp(paymentUrlPattern,"i")
          , queryString = document.location.search
          , validQuery = function() {
            return paymentUrlRegExp.test(queryString)
        }
          , setPurchaseInformation = function() {
            _purchaseInformation = {
                languageTag: getLanguageTag()
            },
            cookie.set({
                vendor: getVendor(),
                paymentAmount: getAmount(),
                reference: getReference(),
                languageTag: _purchaseInformation.languageTag,
                endUrl: getEndUrl()
            })
        }
          , getVendor = function() {
            var vendor = vendorPattern.exec(queryString)[0]
              , vendorValue = bank.getHTMLtext(vendor.substring(7));
            return decodeURIComponent(vendorValue)
        }
          , getAmount = function() {
            var amount = amountPattern.exec(queryString)[0]
              , amountStartAt = amount.indexOf("=") + 1
              , amountValue = bank.getHTMLtext(amount.substring(amountStartAt));
            return decodeURIComponent(amountValue)
        }
          , getReference = function() {
            var reference = referencePattern.exec(queryString)[0]
              , referenceStartAt = reference.indexOf("=") + 1
              , referenceValue = bank.getHTMLtext(reference.substring(referenceStartAt));
            return decodeURIComponent(referenceValue)
        }
          , getLanguageTag = function() {
            var languageTag = new RegExp("&lang=" + languageTagPattern).exec(queryString);
            if (languageTag) {
                languageTag.length > 0 && (languageTag = languageTag[0]);
                var languageTagStartAt = languageTag.indexOf("=") + 1
                  , languageTagValue = bank.getHTMLtext(languageTag.substring(languageTagStartAt));
                return decodeURIComponent(languageTagValue)
            }
        }
          , getEndUrl = function() {
            var endUrlValue = null
              , endUrl = new RegExp("&endurl=" + endUrlPattern,"i").exec(queryString);
            if (endUrl) {
                var endUrlStartAt = (endUrl = endUrl[0]).indexOf("=") + 1;
                endUrlValue = bank.getHTMLtext(endUrl.substring(endUrlStartAt))
            }
            return endUrlValue
        };
        return {
            validQuery: validQuery,
            setPurchaseInformation: setPurchaseInformation,
            getPurchaseInformation: function() {
                return !_purchaseInformation && validQuery() && setPurchaseInformation(),
                _purchaseInformation
            }
        }
    }())
}
)),
$(window).on("load", (function() {
    Bank.CssLoader.loadBankStyleSheet(),
    Bank.CssLoader.loadBankIcon(),
    $("h1").animate({
        opacity: 1,
        top: 10
    }, 1e3),
    $("h2").animate({
        opacity: 1,
        top: 10
    }, 1e3),
    $("#content p").animate({
        opacity: 1,
        top: 5
    }, 1e3)
}
)),
$((function() {
    var view, cardService, bank = Bank, localeLoader = bank.LocaleLoader, payment = bank.Payment, purchaseInformation = void 0;
    bank.Init.initFingerPrint(),
    view = {
        user: {
            txtUserName: {
                labelDataLangKey: "login.user",
                required: !0
            },
            txtPasscode: {
                labelDataLangKey: "login.password",
                required: !0
            }
        }
    },
    $(localeLoader).on("LocaleLoader.loadedScriptLanguage", (function() {
        $(bank.ConfigLoader).on("configLoader.loaded", (function() {
            !function() {
                if (bank.Config.getCustomFeatures) {
                    var features = bank.Config.getCustomFeatures();
                    for (var featureName in features) {
                        var feature = features[featureName];
                        feature.attach();
                        var $element = $("#" + feature.id);
                        feature.action && $element.on("click", feature.action.bind(this))
                    }
                }
            }(),
            bank.ui.LanguageDropdown.init("languageDropdown", bank.Config.getLanguagesSupported()),
            bank.Init.setCardServiceID(bank.Config.getID()),
            bank.FeatureDetection.testFeatures(),
            bank.Translator.translatePlaceholder(view),
            $(bank.ConfigLoader).off("configLoader.loaded")
        }
        )),
        bank.Config || bank.ConfigLoader.loadConfig()
    }
    )),
    payment.validQuery() ? (purchaseInformation = payment.getPurchaseInformation(),
    localeLoader.loadLanguage(purchaseInformation.languageTag)) : localeLoader.loadBrowserLanguage(),
    modalError = $("#error-modal"),
    modalError.error(),
    function() {
        $(this).on("keypress", (function(event) {
            13 == event.which && $("#btnLogin").trigger("click")
        }
        ))
    }(),
    cardService = bank.Init.getCardService(),
    $("#btnLogin").on("click", (function() {
        var currentLocale = bank.Locale.getCurrentLocale()
          , languageTag = bank.Locale.getCurrentLanguageTag()
          , username = $("#txtUserName").val()
          , password = $("#txtPasscode").val()
          , setUpNewCredentials = bank.isNumber(password);
        return "" == username ? (modalError.error("display", {
            modalTitle: currentLocale.login.error.title,
            errorMessage: currentLocale.login.error.user,
            contactSupport: currentLocale.contactSupport
        }),
        void $("#txtUserName").focus()) : "" == password ? (modalError.error("display", {
            modalTitle: currentLocale.login.error.title,
            errorMessage: currentLocale.login.error.password
        }),
        void $("#txtPasscode").focus()) : bank.isNumber(username) && !bank.isNumber(password) || !bank.isNumber(username) && bank.isNumber(password) ? ($("#txtUserName").val(""),
        $("#txtPasscode").val(""),
        modalError.error("display", {
            modalTitle: currentLocale.login.error.title,
            errorMessage: currentLocale.login.error.failed
        }),
        void $("#txtUserName").focus()) : void $.ajax({
            url: cardService.baseUrl + "authorizationwebsite",
            headers: {
                From: cardService.header.id
            },
            type: "POST",
            data: '{"user":"' + username + '","password":"' + password + '","lang":"' + languageTag + '"}',
            contentType: "application/json",
            dataType: "json"
        }).always((function(data, textStatus, jqXHR) {
            jqXHR.status && 200 == jqXHR.status ? (data.PasswordChangeRequired && $("#forgotPassword").trigger("click"),
            cookie.set({
                Key: data.Key,
                Balance: data.Balance,
                CurrencyAlpha: data.CurrencyAlpha,
                CurrencyCode: data.CurrencyCode,
                CustomerId: data.CustomerId,
                Last4: data.Last4,
                Expires: data.Expires,
                BillPayEnabled: data.BillPayEnabled,
                TopUpEnabled: data.TopUpEnabled,
                C2CEnabled: data.C2CEnabled,
                EnhancedC2CRequired: data.EnhancedC2CRequired,
                PasswordChangeRequired: data.PasswordChangeRequired,
                FirstName: data.FirstName,
                LastName: data.LastName,
                VbvUrl: data.VbvUrl,
                timeout: data.Timeout,
                mobileProviders: data.MobileProviders,
                billPayMenu: data.BillPayMenu,
                hideFees: data.HideFees,
                allowCustomerUpdates: data.AllowCustomerUpdates,
                allowOtpOnCustomerUpdates: data.AllowOtpOnCustomerUpdates,
                pinChangeAllowed: data.PinChangeAllowed,
                virtual: data.Virtual,
                otpByEmail: data.OtpByEmailAllowed,
                verifyDevice: data.VerifyDevice,
                currencyDecimals: data.CurrencyDecimals,
                setUpNewCredentials: setUpNewCredentials,
                langTag: bank.Locale.getCurrentLanguageTag(),
                serviceID: bank.Config.getID(),
                menuOptionsToHide: bank.Config.getMenuOptionsToHide ? bank.Config.getMenuOptionsToHide() : null,
                lastLoginDate: bank.dateInMillisecondsToDayMonthYearTime(data.LastLoginDate, languageTag),
                first4: data.First4
            }),
            window.location.href = "Initial.aspx") : modalError.error("display", {
                modalTitle: data.responseJSON ? currentLocale.login.error.title : currentLocale.somethingWentWrong,
                errorMessage: data.responseJSON ? data.responseJSON.DetailedInformation : ""
            })
        }
        ))
    }
    )),
    $("#forgotPassword").on("click", (function() {
        cookie.set({
            timeout: 10,
            langTag: bank.Locale.getCurrentLanguageTag(),
            pageToLoadWithNoCredentials: "password-recovery",
            serviceID: bank.Config.getID()
        }),
        window.location.href = "Initial.aspx"
    }
    )),
    $("#linktoregister").on("click", (function() {
        cookie.set({
            Timeout: 10,
            langTag: bank.Locale.getCurrentLanguageTag(),
            pageToLoadWithNoCredentials: "register",
            serviceID: bank.Config.getID()
        }),
        window.location.href = "Initial.aspx"
    }
    )),
    new FloatLabels(".float-labels",{
        style: 0,
        requiredClass: null
    })
}
));
