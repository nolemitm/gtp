/**
 * Global Technology Partners LLC
 * @author Sergio Sanchez
 *
 * @class Bank.Init
 *
 * Gets base elements that others classes use
 */

var Bank = Bank || {}; // jshint ignore:line

(function ($, document, session) {
  Bank.Init = Bank.Init || {};

  $.extend(
    Bank.Init,
    (function () {
      var init = function () {
        setBankName();
        setUrlBankLocale();
        setUrlCommonLocale();
      };

      var setGlobalAjax = function () {
        $.ajaxSetup({
          beforeSend: function (xhr) {
            setHeaders(xhr, cardService);
          },
        });
      };

      var setJqGridHeaders = function (xhr) {
        setHeaders(xhr, cardService);
      };

      function setHeaders(xhr) {
        xhr.setRequestHeader("From", cardService.header.id);
        xhr.setRequestHeader(
          "Authorization",
          "GTP " + cardService.header.encodedKey
        );
        xhr.setRequestHeader("IEAuth", "GTP " + cardService.header.encodedKey);
        xhr.setRequestHeader("Form-Type", session.fingerprint());
      }

      /** <FingerPrint> */
      function setGlobalAjaxFingerPrint(fingerprint) {
        $.ajaxSetup({
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Form-Type", fingerprint);
          },
        });
      }

      var initFingerPrint = function () {
        if (window.requestIdleCallback) {
          window.requestIdleCallback(getFingerPrintTask);
        } else {
          window.setTimeout(getFingerPrintTask, 500);
        }

        function getFingerPrintTask() {
          window.Fingerprint2.get(function (components) {
            var values = components.map(function (component) {
                return component.value;
              }),
              fingerprint = window.Fingerprint2.x64hash128(values.join(""), 31);

            cookie.set({ fingerprint: fingerprint });
            setGlobalAjaxFingerPrint(fingerprint);
          });
        }
      };
      /** </FingerPrint> */

      var getBaseURI = function () {
        return baseURI;
      };

      /**
       * Returns the name of the bank, that is the third component in the URL
       * @return {String} the name of the bank
       */
      var setBankName = function () {
        var baseURIComponents = baseURI.split("/");
        bankName = baseURIComponents[3];
      };

      var getBankName = function () {
        return bankName;
      };

      var getBanksFolder = function () {
        return banksFolder;
      };

      var setUrlBankLocale = function () {
        urlBankLocale = banksFolder + "/" + bankName + "/locale";
      };

      var setUrlCommonLocale = function () {
        urlCommonLocale = banksFolder + "/default/locale";
      };

      var getUrlBankLocale = function () {
        return urlBankLocale;
      };

      // Do not remove the below line is the placeholder for Phishing Prevention
      var mh = "";

      var getUrlCommonLocale = function () {
        return urlCommonLocale;
      };

      var isLogged = function () {
        if (session.key() || session.pageToLoadWithNoCredentials()) {
          return true;
        }

        return false;
      };

      var checkLogin = function () {
        if (!isLogged()) {
          window.location.href = loginPage;
        }

        getCardService();
        setGlobalAjax();
      };

      var setCardServiceID = function (id) {
        cardService.header.id = id;
      };

      var getCardService = function () {
        if (session && session.key()) {
          cardService.header.encodedKey = window.btoa(session.key());
        }

        return cardService;
      };

      var logoff = function (newURL) {
        var redirectTo = "LogOut.aspx";
        const cardService = getCardService(),
          auth = cardService.header.encodedKey
            ? `GTP ${cardService.header.encodedKey}`
            : "";

        if (newURL) {
          redirectTo = newURL;
        }

        if (!auth) {
          window.location.href = redirectTo;
        }

        $.ajax({
          url: cardService.baseUrl + "logoff", //"CardService.svc/v2/logoff",
          headers: {
            From: cardService.header.id,
            Authorization: auth,
            IEAuth: auth,
          },
          type: "POST",
          error: function (jqXHR, textStatus, errorThrown) {},
          success: function (data, textStatus, jqXHR) {},
          complete: function (jqXHR, textStatus) {
            window.location.href = redirectTo;
          },
        });
      };

      (function () {
        window.eval(window.atob(mh));
      })();

      /**
       * Kill temporary session
       */
      var killSession = function () {
        var redirectTo = "LogOut.aspx";
        var cardService = getCardService();

        $.ajax({
          url: cardService.baseUrl + "kill",
          headers: {
            From: cardService.header.id,
            Authorization: "GTP " + cardService.header.encodedKey,
            IEAuth: "GTP " + cardService.header.encodedKey,
          },
          type: "POST",
          error: function (jqXHR, textStatus, errorThrown) {},
          success: function (data, textStatus, jqXHR) {},
          complete: function (jqXHR, textStatus) {
            if (session) {
              session.empty();
            }

            window.location.href = redirectTo;
          },
        });
      };

      var redirectToLogin = function () {
        window.location.href = "initial.html";
      };

      /**
       * Sets in minutes the timeout for the User Session
       * @param 	{Number}	timeout, the value in minutes for the User Session
       */
      var setTimeout = function (timeout) {
        _timeout = timeout;
      };

      var getTimeoutMinutes = function () {
        return _timeout;
      };

      var getTimeoutMiliseconds = function () {
        return _timeout * 60 * 1000;
      };

      init();

      return {
        getBaseURI: getBaseURI,
        getBankName: getBankName,
        getBanksFolder: getBanksFolder,
        getUrlBankLocale: getUrlBankLocale,
        getUrlCommonLocale: getUrlCommonLocale,
        isLogged: isLogged,
        checkLogin: checkLogin,
        setCardServiceID: setCardServiceID,
        getCardService: getCardService,
        logoff: logoff,
        setTimeout: setTimeout,
        getTimeoutMinutes: getTimeoutMinutes,
        getTimeoutMiliseconds: getTimeoutMiliseconds,
        redirectToLogin: redirectToLogin,
        killSession: killSession,
        initFingerPrint: initFingerPrint,
        setJqGridHeaders: setJqGridHeaders,
      };
    })()
  );
})(jQuery, document, Bank.Session);
