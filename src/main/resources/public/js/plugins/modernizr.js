/*! modernizr 3.6.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-addtest-atrule-hasevent-mq-printshiv-setclasses-testallprops-testprop-teststyles !*/
 !function(e, t, n) {
    function r(e) {
        var t = _.className
          , n = Modernizr._config.classPrefix || "";
        if (w && (t = t.baseVal),
        Modernizr._config.enableJSClass) {
            var r = new RegExp("(^|\\s)" + n + "no-js(\\s|$)");
            t = t.replace(r, "$1" + n + "js$2")
        }
        Modernizr._config.enableClasses && (t += " " + n + e.join(" " + n),
        w ? _.className.baseVal = t : _.className = t)
    }
    function o() {
        return "function" != typeof t.createElement ? t.createElement(arguments[0]) : w ? t.createElementNS.call(t, "http://www.w3.org/2000/svg", arguments[0]) : t.createElement.apply(t, arguments)
    }
    function i(e, t) {
        return typeof e === t
    }
    function a() {
        var e, t, n, r, o, a, s;
        for (var l in C)
            if (C.hasOwnProperty(l)) {
                if (e = [],
                t = C[l],
                t.name && (e.push(t.name.toLowerCase()),
                t.options && t.options.aliases && t.options.aliases.length))
                    for (n = 0; n < t.options.aliases.length; n++)
                        e.push(t.options.aliases[n].toLowerCase());
                for (r = i(t.fn, "function") ? t.fn() : t.fn,
                o = 0; o < e.length; o++)
                    a = e[o],
                    s = a.split("."),
                    1 === s.length ? Modernizr[s[0]] = r : (!Modernizr[s[0]] || Modernizr[s[0]]instanceof Boolean || (Modernizr[s[0]] = new Boolean(Modernizr[s[0]])),
                    Modernizr[s[0]][s[1]] = r),
                    S.push((r ? "" : "no-") + s.join("-"))
            }
    }
    function s(e, t) {
        if ("object" == typeof e)
            for (var n in e)
                N(e, n) && s(n, e[n]);
        else {
            e = e.toLowerCase();
            var o = e.split(".")
              , i = Modernizr[o[0]];
            if (2 == o.length && (i = i[o[1]]),
            "undefined" != typeof i)
                return Modernizr;
            t = "function" == typeof t ? t() : t,
            1 == o.length ? Modernizr[o[0]] = t : (!Modernizr[o[0]] || Modernizr[o[0]]instanceof Boolean || (Modernizr[o[0]] = new Boolean(Modernizr[o[0]])),
            Modernizr[o[0]][o[1]] = t),
            r([(t && 0 != t ? "" : "no-") + o.join("-")]),
            Modernizr._trigger(e, t)
        }
        return Modernizr
    }
    function l() {
        var e = t.body;
        return e || (e = o(w ? "svg" : "body"),
        e.fake = !0),
        e
    }
    function u(e, n, r, i) {
        var a, s, u, f, c = "modernizr", d = o("div"), p = l();
        if (parseInt(r, 10))
            for (; r--; )
                u = o("div"),
                u.id = i ? i[r] : c + (r + 1),
                d.appendChild(u);
        return a = o("style"),
        a.type = "text/css",
        a.id = "s" + c,
        (p.fake ? p : d).appendChild(a),
        p.appendChild(d),
        a.styleSheet ? a.styleSheet.cssText = e : a.appendChild(t.createTextNode(e)),
        d.id = c,
        p.fake && (p.style.background = "",
        p.style.overflow = "hidden",
        f = _.style.overflow,
        _.style.overflow = "hidden",
        _.appendChild(p)),
        s = n(d, e),
        p.fake ? (p.parentNode.removeChild(p),
        _.style.overflow = f,
        _.offsetHeight) : d.parentNode.removeChild(d),
        !!s
    }
    function f(e, t) {
        return !!~("" + e).indexOf(t)
    }
    function c(e) {
        return e.replace(/([a-z])-([a-z])/g, function(e, t, n) {
            return t + n.toUpperCase()
        }).replace(/^-/, "")
    }
    function d(e, t) {
        return function() {
            return e.apply(t, arguments)
        }
    }
    function p(e, t, n) {
        var r;
        for (var o in e)
            if (e[o]in t)
                return n === !1 ? e[o] : (r = t[e[o]],
                i(r, "function") ? d(r, n || t) : r);
        return !1
    }
    function m(t, n, r) {
        var o;
        if ("getComputedStyle"in e) {
            o = getComputedStyle.call(e, t, n);
            var i = e.console;
            if (null !== o)
                r && (o = o.getPropertyValue(r));
            else if (i) {
                var a = i.error ? "error" : "log";
                i[a].call(i, "getComputedStyle returning null, its possible modernizr test results are inaccurate")
            }
        } else
            o = !n && t.currentStyle && t.currentStyle[r];
        return o
    }
    function h(e) {
        return e.replace(/([A-Z])/g, function(e, t) {
            return "-" + t.toLowerCase()
        }).replace(/^ms-/, "-ms-")
    }
    function v(t, r) {
        var o = t.length;
        if ("CSS"in e && "supports"in e.CSS) {
            for (; o--; )
                if (e.CSS.supports(h(t[o]), r))
                    return !0;
            return !1
        }
        if ("CSSSupportsRule"in e) {
            for (var i = []; o--; )
                i.push("(" + h(t[o]) + ":" + r + ")");
            return i = i.join(" or "),
            u("@supports (" + i + ") { #modernizr { position: absolute; } }", function(e) {
                return "absolute" == m(e, null, "position")
            })
        }
        return n
    }
    function g(e, t, r, a) {
        function s() {
            u && (delete F.style,
            delete F.modElem)
        }
        if (a = i(a, "undefined") ? !1 : a,
        !i(r, "undefined")) {
            var l = v(e, r);
            if (!i(l, "undefined"))
                return l
        }
        for (var u, d, p, m, h, g = ["modernizr", "tspan", "samp"]; !F.style && g.length; )
            u = !0,
            F.modElem = o(g.shift()),
            F.style = F.modElem.style;
        for (p = e.length,
        d = 0; p > d; d++)
            if (m = e[d],
            h = F.style[m],
            f(m, "-") && (m = c(m)),
            F.style[m] !== n) {
                if (a || i(r, "undefined"))
                    return s(),
                    "pfx" == t ? m : !0;
                try {
                    F.style[m] = r
                } catch (y) {}
                if (F.style[m] != h)
                    return s(),
                    "pfx" == t ? m : !0
            }
        return s(),
        !1
    }
    function y(e, t, n, r, o) {
        var a = e.charAt(0).toUpperCase() + e.slice(1)
          , s = (e + " " + P.join(a + " ") + a).split(" ");
        return i(t, "string") || i(t, "undefined") ? g(s, t, r, o) : (s = (e + " " + k.join(a + " ") + a).split(" "),
        p(s, t, n))
    }
    function E(e, t, r) {
        return y(e, n, n, t, r)
    }
    var S = []
      , C = []
      , b = {
        _version: "3.6.0",
        _config: {
            classPrefix: "",
            enableClasses: !0,
            enableJSClass: !0,
            usePrefixes: !0
        },
        _q: [],
        on: function(e, t) {
            var n = this;
            setTimeout(function() {
                t(n[e])
            }, 0)
        },
        addTest: function(e, t, n) {
            C.push({
                name: e,
                fn: t,
                options: n
            })
        },
        addAsyncTest: function(e) {
            C.push({
                name: null,
                fn: e
            })
        }
    }
      , Modernizr = function() {};
    Modernizr.prototype = b,
    Modernizr = new Modernizr;
    var _ = t.documentElement
      , w = "svg" === _.nodeName.toLowerCase()
      , x = function() {
        function e(e, t) {
            var i;
            return e ? (t && "string" != typeof t || (t = o(t || "div")),
            e = "on" + e,
            i = e in t,
            !i && r && (t.setAttribute || (t = o("div")),
            t.setAttribute(e, ""),
            i = "function" == typeof t[e],
            t[e] !== n && (t[e] = n),
            t.removeAttribute(e)),
            i) : !1
        }
        var r = !("onblur"in t.documentElement);
        return e
    }();
    b.hasEvent = x;
    var N;
    !function() {
        var e = {}.hasOwnProperty;
        N = i(e, "undefined") || i(e.call, "undefined") ? function(e, t) {
            return t in e && i(e.constructor.prototype[t], "undefined")
        }
        : function(t, n) {
            return e.call(t, n)
        }
    }(),
    b._l = {},
    b.on = function(e, t) {
        this._l[e] || (this._l[e] = []),
        this._l[e].push(t),
        Modernizr.hasOwnProperty(e) && setTimeout(function() {
            Modernizr._trigger(e, Modernizr[e])
        }, 0)
    }
    ,
    b._trigger = function(e, t) {
        if (this._l[e]) {
            var n = this._l[e];
            setTimeout(function() {
                var e, r;
                for (e = 0; e < n.length; e++)
                    (r = n[e])(t)
            }, 0),
            delete this._l[e]
        }
    }
    ,
    Modernizr._q.push(function() {
        b.addTest = s
    });
    w || !function(e, t) {
        function n(e, t) {
            var n = e.createElement("p")
              , r = e.getElementsByTagName("head")[0] || e.documentElement;
            return n.innerHTML = "x<style>" + t + "</style>",
            r.insertBefore(n.lastChild, r.firstChild)
        }
        function r() {
            var e = w.elements;
            return "string" == typeof e ? e.split(" ") : e
        }
        function o(e, t) {
            var n = w.elements;
            "string" != typeof n && (n = n.join(" ")),
            "string" != typeof e && (e = e.join(" ")),
            w.elements = n + " " + e,
            u(t)
        }
        function i(e) {
            var t = _[e[C]];
            return t || (t = {},
            b++,
            e[C] = b,
            _[b] = t),
            t
        }
        function a(e, n, r) {
            if (n || (n = t),
            v)
                return n.createElement(e);
            r || (r = i(n));
            var o;
            return o = r.cache[e] ? r.cache[e].cloneNode() : S.test(e) ? (r.cache[e] = r.createElem(e)).cloneNode() : r.createElem(e),
            !o.canHaveChildren || E.test(e) || o.tagUrn ? o : r.frag.appendChild(o)
        }
        function s(e, n) {
            if (e || (e = t),
            v)
                return e.createDocumentFragment();
            n = n || i(e);
            for (var o = n.frag.cloneNode(), a = 0, s = r(), l = s.length; l > a; a++)
                o.createElement(s[a]);
            return o
        }
        function l(e, t) {
            t.cache || (t.cache = {},
            t.createElem = e.createElement,
            t.createFrag = e.createDocumentFragment,
            t.frag = t.createFrag()),
            e.createElement = function(n) {
                return w.shivMethods ? a(n, e, t) : t.createElem(n)
            }
            ,
            e.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + r().join().replace(/[\w\-:]+/g, function(e) {
                return t.createElem(e),
                t.frag.createElement(e),
                'c("' + e + '")'
            }) + ");return n}")(w, t.frag)
        }
        function u(e) {
            e || (e = t);
            var r = i(e);
            return !w.shivCSS || h || r.hasCSS || (r.hasCSS = !!n(e, "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),
            v || l(e, r),
            e
        }
        function f(e) {
            for (var t, n = e.getElementsByTagName("*"), o = n.length, i = RegExp("^(?:" + r().join("|") + ")$", "i"), a = []; o--; )
                t = n[o],
                i.test(t.nodeName) && a.push(t.applyElement(c(t)));
            return a
        }
        function c(e) {
            for (var t, n = e.attributes, r = n.length, o = e.ownerDocument.createElement(N + ":" + e.nodeName); r--; )
                t = n[r],
                t.specified && o.setAttribute(t.nodeName, t.nodeValue);
            return o.style.cssText = e.style.cssText,
            o
        }
        function d(e) {
            for (var t, n = e.split("{"), o = n.length, i = RegExp("(^|[\\s,>+~])(" + r().join("|") + ")(?=[[\\s,>+~#.:]|$)", "gi"), a = "$1" + N + "\\:$2"; o--; )
                t = n[o] = n[o].split("}"),
                t[t.length - 1] = t[t.length - 1].replace(i, a),
                n[o] = t.join("}");
            return n.join("{")
        }
        function p(e) {
            for (var t = e.length; t--; )
                e[t].removeNode()
        }
        function m(e) {
            function t() {
                clearTimeout(a._removeSheetTimer),
                r && r.removeNode(!0),
                r = null
            }
            var r, o, a = i(e), s = e.namespaces, l = e.parentWindow;
            return !T || e.printShived ? e : ("undefined" == typeof s[N] && s.add(N),
            l.attachEvent("onbeforeprint", function() {
                t();
                for (var i, a, s, l = e.styleSheets, u = [], c = l.length, p = Array(c); c--; )
                    p[c] = l[c];
                for (; s = p.pop(); )
                    if (!s.disabled && x.test(s.media)) {
                        try {
                            i = s.imports,
                            a = i.length
                        } catch (m) {
                            a = 0
                        }
                        for (c = 0; a > c; c++)
                            p.push(i[c]);
                        try {
                            u.push(s.cssText)
                        } catch (m) {}
                    }
                u = d(u.reverse().join("")),
                o = f(e),
                r = n(e, u)
            }),
            l.attachEvent("onafterprint", function() {
                p(o),
                clearTimeout(a._removeSheetTimer),
                a._removeSheetTimer = setTimeout(t, 500)
            }),
            e.printShived = !0,
            e)
        }
        var h, v, g = "3.7.3", y = e.html5 || {}, E = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i, S = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i, C = "_html5shiv", b = 0, _ = {};
        !function() {
            try {
                var e = t.createElement("a");
                e.innerHTML = "<xyz></xyz>",
                h = "hidden"in e,
                v = 1 == e.childNodes.length || function() {
                    t.createElement("a");
                    var e = t.createDocumentFragment();
                    return "undefined" == typeof e.cloneNode || "undefined" == typeof e.createDocumentFragment || "undefined" == typeof e.createElement
                }()
            } catch (n) {
                h = !0,
                v = !0
            }
        }();
        var w = {
            elements: y.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",
            version: g,
            shivCSS: y.shivCSS !== !1,
            supportsUnknownElements: v,
            shivMethods: y.shivMethods !== !1,
            type: "default",
            shivDocument: u,
            createElement: a,
            createDocumentFragment: s,
            addElements: o
        };
        e.html5 = w,
        u(t);
        var x = /^$|\b(?:all|print)\b/
          , N = "html5shiv"
          , T = !v && function() {
            var n = t.documentElement;
            return !("undefined" == typeof t.namespaces || "undefined" == typeof t.parentWindow || "undefined" == typeof n.applyElement || "undefined" == typeof n.removeNode || "undefined" == typeof e.attachEvent)
        }();
        w.type += " print",
        w.shivPrint = m,
        m(t),
        "object" == typeof module && module.exports && (module.exports = w)
    }("undefined" != typeof e ? e : this, t);
    var T = function() {
        var t = e.matchMedia || e.msMatchMedia;
        return t ? function(e) {
            var n = t(e);
            return n && n.matches || !1
        }
        : function(t) {
            var n = !1;
            return u("@media " + t + " { #modernizr { position: absolute; } }", function(t) {
                n = "absolute" == (e.getComputedStyle ? e.getComputedStyle(t, null) : t.currentStyle).position
            }),
            n
        }
    }();
    b.mq = T;
    var j = (b.testStyles = u,
    "Moz O ms Webkit")
      , P = b._config.usePrefixes ? j.split(" ") : [];
    b._cssomPrefixes = P;
    var z = function(t) {
        var r, o = prefixes.length, i = e.CSSRule;
        if ("undefined" == typeof i)
            return n;
        if (!t)
            return !1;
        if (t = t.replace(/^@/, ""),
        r = t.replace(/-/g, "_").toUpperCase() + "_RULE",
        r in i)
            return "@" + t;
        for (var a = 0; o > a; a++) {
            var s = prefixes[a]
              , l = s.toUpperCase() + "_" + r;
            if (l in i)
                return "@-" + s.toLowerCase() + "-" + t
        }
        return !1
    };
    b.atRule = z;
    var k = b._config.usePrefixes ? j.toLowerCase().split(" ") : [];
    b._domPrefixes = k;
    var A = {
        elem: o("modernizr")
    };
    Modernizr._q.push(function() {
        delete A.elem
    });
    var F = {
        style: A.elem.style
    };
    Modernizr._q.unshift(function() {
        delete F.style
    }),
    b.testAllProps = y,
    b.testAllProps = E;
    b.testProp = function(e, t, r) {
        return g([e], n, t, r)
    }
    ;
    a(),
    r(S),
    delete b.addTest,
    delete b.addAsyncTest;
    for (var M = 0; M < Modernizr._q.length; M++)
        Modernizr._q[M]();
    e.Modernizr = Modernizr
}(window, document);
