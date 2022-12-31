/*
 Platform.js <https://mths.be/platform>
 Copyright 2014-2018 Benjamin Tan <https://bnjmnt4n.now.sh/>
 Copyright 2011-2013 John-David Dalton
 Available under MIT license <https://mths.be/mit>
*/
"undefined" == typeof _pio && (_pio = {});
(function() {
    _pio.channel = function() {}
    ;
    _pio.channel.prototype.call = function(a, c, b, e, d) {
        var f = "undefined" != typeof PLAYERIO_API_HOST ? PLAYERIO_API_HOST : (PlayerIO.useSecureApiRequests ? "https" : "http") + "://api.playerio.com/json/"
          , g = new XMLHttpRequest;
        "withCredentials"in g ? g.open("post", f, !0) : "undefined" != typeof XDomainRequest ? (g = new XDomainRequest,
        g.open("post", f)) : g = new _pio.flashWebRequest("post",f);
        var h = Error();
        null != g ? (g.send("[" + a + "|" + (this.token || "") + "]" + JSON.stringify(c)),
        g.onload = function() {
            var l = null;
            try {
                var k = g.response || g.responseText;
                if ("[" == k[0]) {
                    var m = k.indexOf("]");
                    this.token = k.substring(1, m);
                    k = k.substring(m + 1)
                }
                l = JSON.parse(k)
            } catch (n) {
                _pio.handleError(h, e, PlayerIOErrorCode.GeneralError, "Error decoding response from webservice: " + n);
                return
            }
            if ("undefined" == typeof l.errorcode && "undefined" == typeof l.message) {
                k = l;
                if (d)
                    try {
                        k = d(l)
                    } catch (n) {
                        _pio.handleError(h, e, PlayerIOErrorCode.GeneralError, n.message)
                    }
                b && b(k)
            } else
                _pio.handleError(h, e, l.errorcode, l.message)
        }
        ,
        g.onerror = function(l) {
            _pio.handleError(h, e, PlayerIOErrorCode.GeneralError, "Error talking to webservice: " + JSON.stringify(l))
        }
        ) : _pio.handleError(h, e, PlayerIOErrorCode.GeneralError, "Need to implement flash calling")
    }
    ;
    _pio.runCallback = function(a, c, b) {
        try {
            a && a(c)
        } catch (e) {
            a = "Unhandled error in callback: " + e.message,
            a = a + "\nStack:\n" + (e.stack || e.stacktrace || e.StackTrace),
            b && (a = a + "\nCallsite stack:\n" + (b.stack || b.stacktrace || b.StackTrace)),
            console.log(a)
        }
    }
    ;
    _pio.handleError = function(a, c, b, e) {
        b = _pio.error(b, e);
        a && (a.stack && (b.stack = a.stack),
        a.stacktrace && (b.stacktrace = a.stacktrace),
        a.StackTrace && (b.StackTrace = a.StackTrace));
        c ? _pio.runCallback(c, b, a) : "undefined" != typeof console ? console.log("No error callback specified for: " + b.code + ": " + b.message + "\n" + (b.stack || b.stacktrace || b.StackTrace)) : alert("No error callback specified for: " + b.code + ": " + b.message + "\n" + (b.stack || b.stacktrace || b.StackTrace))
    }
    ;
    _pio.error = function(a, c) {
        1 == arguments.length && (c = a,
        a = PlayerIOErrorCode.GeneralError);
        "number" == typeof a && (a = PlayerIOErrorCode.codes[a]);
        if ("string" != typeof a)
            throw console.log(a, c, Error().stack),
            "Code must be a string!";
        var b = Error();
        return new PlayerIOError(a,c,b.stack || b.stacktrace || b.StackTrace)
    }
    ;
    _pio.debugLog = function(a) {
        "undefined" != typeof console && console.log(a)
    }
    ;
    _pio.convertToKVArray = function(a) {
        var c = [];
        if (a)
            for (var b in a)
                c.push({
                    key: "" + b,
                    value: "" + a[b]
                });
        return c
    }
    ;
    _pio.convertFromKVArray = function(a) {
        var c = {};
        if (a && a.length)
            for (var b in a)
                c[a[b].key] = a[b].value;
        return c
    }
    ;
    _pio.convertToSegmentArray = function(a) {
        var c = [];
        if (a)
            for (var b in a)
                c.push(b + ":" + a[b]);
        return c
    }
}
)();
PlayerIO = {
    useSecureApiRequests: !1,
    authenticate: function(a, c, b, e, d, f) {
        if ("auto" == b.publishingnetworklogin)
            "undefined" == typeof window.PublishingNetwork ? f(new PlayerIOError(PlayerIOErrorCode.GeneralError,"Could not find the PublishingNetwork object on the current page. Did you include the PublishingNetwork.js script?")) : PublishingNetwork.dialog("login", {
                gameId: a,
                connectionId: c,
                __use_usertoken__: !0
            }, function(h) {
                h.error ? f(new PlayerIOError(PlayerIOErrorCode.GeneralError,h.error)) : "undefined" == typeof h.userToken ? f(new PlayerIOError(PlayerIOErrorCode.GeneralError,"Missing userToken value in result, but no error message given.")) : PlayerIO.authenticate(a, c, {
                    userToken: h.userToken
                }, e, d, f)
            });
        else {
            var g = new _pio.channel;
            g.authenticate(a, c, _pio.convertToKVArray(b), _pio.convertToSegmentArray(e), "javascript", _pio.convertToKVArray({}), null, d, f, function(h) {
                g.token = h.token;
                return new _pio.client(g,a,h.gamefsredirectmap,h.userid)
            })
        }
    },
    quickConnect: null,
    gameFS: function(a) {
        return new _pio.gameFS(a)
    }
};
var JSON;
JSON || (JSON = {});
(function() {
    function a(k) {
        return 10 > k ? "0" + k : k
    }
    function c(k) {
        d.lastIndex = 0;
        return d.test(k) ? '"' + k.replace(d, function(m) {
            var n = h[m];
            return "string" === typeof n ? n : "\\u" + ("0000" + m.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + k + '"'
    }
    function b(k, m) {
        var n, p = f, r = m[k];
        r && "object" === typeof r && "function" === typeof r.toJSON && (r = r.toJSON(k));
        "function" === typeof l && (r = l.call(m, k, r));
        switch (typeof r) {
        case "string":
            return c(r);
        case "number":
            return isFinite(r) ? String(r) : "null";
        case "boolean":
        case "null":
            return String(r);
        case "object":
            if (!r)
                return "null";
            f += g;
            var z = [];
            if ("[object Array]" === Object.prototype.toString.apply(r)) {
                var v = r.length;
                for (n = 0; n < v; n += 1)
                    z[n] = b(n, r) || "null";
                var t = 0 === z.length ? "[]" : f ? "[\n" + f + z.join(",\n" + f) + "\n" + p + "]" : "[" + z.join(",") + "]";
                f = p;
                return t
            }
            if (l && "object" === typeof l)
                for (v = l.length,
                n = 0; n < v; n += 1) {
                    if ("string" === typeof l[n]) {
                        var B = l[n];
                        (t = b(B, r)) && z.push(c(B) + (f ? ": " : ":") + t)
                    }
                }
            else
                for (B in r)
                    Object.prototype.hasOwnProperty.call(r, B) && (t = b(B, r)) && z.push(c(B) + (f ? ": " : ":") + t);
            t = 0 === z.length ? "{}" : f ? "{\n" + f + z.join(",\n" + f) + "\n" + p + "}" : "{" + z.join(",") + "}";
            f = p;
            return t
        }
    }
    "function" !== typeof Date.prototype.toJSON && (Date.prototype.toJSON = function(k) {
        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + a(this.getUTCMonth() + 1) + "-" + a(this.getUTCDate()) + "T" + a(this.getUTCHours()) + ":" + a(this.getUTCMinutes()) + ":" + a(this.getUTCSeconds()) + "Z" : null
    }
    ,
    String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(k) {
        return this.valueOf()
    }
    );
    var e = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, d = /[\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, f, g, h = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    }, l;
    "function" !== typeof JSON.stringify && (JSON.stringify = function(k, m, n) {
        var p;
        g = f = "";
        if ("number" === typeof n)
            for (p = 0; p < n; p += 1)
                g += " ";
        else
            "string" === typeof n && (g = n);
        if ((l = m) && "function" !== typeof m && ("object" !== typeof m || "number" !== typeof m.length))
            throw Error("JSON.stringify");
        return b("", {
            "": k
        })
    }
    );
    "function" !== typeof JSON.parse && (JSON.parse = function(k, m) {
        function n(r, z) {
            var v, t = r[z];
            if (t && "object" === typeof t)
                for (v in t)
                    if (Object.prototype.hasOwnProperty.call(t, v)) {
                        var B = n(t, v);
                        void 0 !== B ? t[v] = B : delete t[v]
                    }
            return m.call(r, z, t)
        }
        k = String(k);
        e.lastIndex = 0;
        e.test(k) && (k = k.replace(e, function(r) {
            return "\\u" + ("0000" + r.charCodeAt(0).toString(16)).slice(-4)
        }));
        if (/^[\],:{}\s]*$/.test(k.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
            var p = eval("(" + k + ")");
            return "function" === typeof m ? n({
                "": p
            }, "") : p
        }
        throw new SyntaxError("JSON.parse");
    }
    )
}
)();
(function() {
    function a(h) {
        if (null != d)
            h(d);
        else if (f)
            h(null);
        else if (null == g) {
            g = [h];
            var l = setInterval(function() {
                var m = c();
                null != m && k(m)
            }, 50);
            setTimeout(function() {
                null == d && k(null)
            }, 3E4);
            var k = function(m) {
                d = m;
                f = null == m;
                clearInterval(l);
                for (var n = 0; n != g.length; n++)
                    g[n](m)
            }
        } else
            g.push(h)
    }
    function c() {
        var h = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="10" height="10" style="$style$" id="$id$">\t<param name="movie" value="$src$" />\t<param name="allowNetworking" value="all" />\t<param name="allowScriptAccess" value="always" />\t\x3c!--[if !IE]>--\x3e\t<object type="application/x-shockwave-flash" data="$src$" width="10" height="10" style="$style$">\t\t<param name="allowNetworking" value="all" />\t\t<param name="allowScriptAccess" value="always" />\t</object>\t\x3c!--<![endif]--\x3e</object>'.replace(/\$id\$/gi, "__pio_flashfallback__");
        h = h.replace(/\$src\$/gi, "http://192.168.30.154/html5client/FlashFallback/bin-debug/FlashFallback.swf");
        h = h.replace(/\$style\$/gi, "width:10px;height:10px");
        var l = document.getElementById("containerId");
        if (!l) {
            var k = document.createElement("div");
            k.setAttribute("id", l);
            k.setAttribute("style", "position:absolute;top:-20px;left:-20px");
            k.innerHTML = h;
            try {
                document.body.appendChild(k)
            } catch (m) {}
        }
        h = function(m) {
            m = document.getElementsByTagName(m);
            for (var n = 0; n != m.length; n++)
                if (m[n].ping && "pong" == m[n].ping())
                    return m[n]
        }
        ;
        return h("embed") || h("object")
    }
    var b = {}
      , e = 0;
    __pio_flashfallback_callback__ = function() {
        var h = b[arguments[0]];
        if (h) {
            for (var l = [], k = 1; k != arguments.length; k++)
                l[k - 1] = arguments[k];
            h.apply(null, l)
        }
    }
    ;
    _pio.flashWebRequest = function(h, l) {
        var k = this;
        this.response = null;
        this.onload = function() {}
        ;
        this.onerror = function() {}
        ;
        this.send = function(m) {
            a(function(n) {
                if (null == n)
                    k.onerror("Browser does not support Cross-Origin (CORS) webrequest or Flash as a fallback method");
                else {
                    var p = "cb" + e++;
                    b[p] = function(r, z) {
                        delete b[p];
                        if (r)
                            k.response = z,
                            k.onload();
                        else
                            k.onerror(z)
                    }
                    ;
                    n.webrequest(p, h, l, m)
                }
            })
        }
    }
    ;
    _pio.flashSocketConnection = function(h, l, k, m, n) {
        var p = "cb" + e++
          , r = this
          , z = new _pio.messageSerializer
          , v = !1
          , t = !1
          , B = setTimeout(function() {
            v || (v = !0,
            k(!1, "Connect attempt timed out"))
        }, l);
        this.disconnect = function() {
            console.log("... this shouldn't happen")
        }
        ;
        this.sendMessage = function(w) {
            console.log("... send msg. this shouldn't happen")
        }
        ;
        a(function(w) {
            null == w ? (v = !0,
            k(!1, "Browser does not support WebSocket connections and the Flash fallback failed.")) : (b[p] = function(y, q) {
                switch (y) {
                case "onopen":
                    v || (clearTimeout(B),
                    t = v = !0,
                    w.socketSend(p, [0]),
                    k(t));
                    break;
                case "onclose":
                    r.disconnect();
                    break;
                case "onerror":
                    r.disconnect();
                    break;
                case "onmessage":
                    n(z.deserializeMessage(q, 0, q.length))
                }
            }
            ,
            r.disconnect = function() {
                if (t) {
                    t = !1;
                    m();
                    try {
                        w.socketClose(p)
                    } catch (y) {
                        _pio.debugLog(y)
                    }
                }
            }
            ,
            r.sendMessage = function(y) {
                y = z.serializeMessage(y);
                w.socketSend(p, y)
            }
            ,
            w.socketConnection(p, h))
        })
    }
    ;
    _pio.isFlashFallbackEnabled = function(h) {
        a(function(l) {
            h(null != l)
        })
    }
    ;
    var d = null
      , f = !1
      , g = null
}
)();
(function() {
    var a = _pio.channel.prototype;
    a.connect = function(c, b, e, d, f, g, h, l, k, m, n) {
        this.call(10, {
            gameid: c,
            connectionid: b,
            userid: e,
            auth: d,
            partnerid: f,
            playerinsightsegments: g,
            clientapi: h,
            clientinfo: l
        }, k, m, n)
    }
    ;
    _pio.ApiSecurityRule = {
        RespectClientSetting: 0,
        UseHttp: 1,
        UseHttps: 2
    };
    a.authenticate = function(c, b, e, d, f, g, h, l, k, m) {
        this.call(13, {
            gameid: c,
            connectionid: b,
            authenticationarguments: e,
            playerinsightsegments: d,
            clientapi: f,
            clientinfo: g,
            playcodes: h
        }, l, k, m)
    }
    ;
    a.createRoom = function(c, b, e, d, f, g, h, l) {
        this.call(21, {
            roomid: c,
            roomtype: b,
            visible: e,
            roomdata: d,
            isdevroom: f
        }, g, h, l)
    }
    ;
    a.joinRoom = function(c, b, e, d, f, g, h) {
        this.call(24, {
            roomid: c,
            joindata: b,
            isdevroom: e,
            serverdomainnameneeded: d
        }, f, g, h)
    }
    ;
    a.createJoinRoom = function(c, b, e, d, f, g, h, l, k, m) {
        this.call(27, {
            roomid: c,
            roomtype: b,
            visible: e,
            roomdata: d,
            joindata: f,
            isdevroom: g,
            serverdomainnameneeded: h
        }, l, k, m)
    }
    ;
    a.listRooms = function(c, b, e, d, f, g, h, l) {
        this.call(30, {
            roomtype: c,
            searchcriteria: b,
            resultlimit: e,
            resultoffset: d,
            onlydevrooms: f
        }, g, h, l)
    }
    ;
    a.userLeftRoom = function(c, b, e, d, f, g) {
        this.call(40, {
            extendedroomid: c,
            newplayercount: b,
            closed: e
        }, d, f, g)
    }
    ;
    a.writeError = function(c, b, e, d, f, g, h, l) {
        this.call(50, {
            source: c,
            error: b,
            details: e,
            stacktrace: d,
            extradata: f
        }, g, h, l)
    }
    ;
    a.updateRoom = function(c, b, e, d, f, g) {
        this.call(53, {
            extendedroomid: c,
            visible: b,
            roomdata: e
        }, d, f, g)
    }
    ;
    _pio.ValueType = {
        String: 0,
        Int: 1,
        UInt: 2,
        Long: 3,
        Bool: 4,
        Float: 5,
        Double: 6,
        ByteArray: 7,
        DateTime: 8,
        Array: 9,
        Obj: 10
    };
    a.createObjects = function(c, b, e, d, f) {
        this.call(82, {
            objects: c,
            loadexisting: b
        }, e, d, f)
    }
    ;
    a.loadObjects = function(c, b, e, d) {
        this.call(85, {
            objectids: c
        }, b, e, d)
    }
    ;
    _pio.LockType = {
        NoLocks: 0,
        LockIndividual: 1,
        LockAll: 2
    };
    a.saveObjectChanges = function(c, b, e, d, f, g) {
        this.call(88, {
            locktype: c,
            changesets: b,
            createifmissing: e
        }, d, f, g)
    }
    ;
    a.deleteObjects = function(c, b, e, d) {
        this.call(91, {
            objectids: c
        }, b, e, d)
    }
    ;
    a.loadMatchingObjects = function(c, b, e, d, f, g, h) {
        this.call(94, {
            table: c,
            index: b,
            indexvalue: e,
            limit: d
        }, f, g, h)
    }
    ;
    a.loadIndexRange = function(c, b, e, d, f, g, h, l) {
        this.call(97, {
            table: c,
            index: b,
            startindexvalue: e,
            stopindexvalue: d,
            limit: f
        }, g, h, l)
    }
    ;
    a.deleteIndexRange = function(c, b, e, d, f, g, h) {
        this.call(100, {
            table: c,
            index: b,
            startindexvalue: e,
            stopindexvalue: d
        }, f, g, h)
    }
    ;
    a.loadMyPlayerObject = function(c, b, e) {
        this.call(103, {}, c, b, e)
    }
    ;
    a.payVaultReadHistory = function(c, b, e, d, f, g) {
        this.call(160, {
            page: c,
            pagesize: b,
            targetuserid: e
        }, d, f, g)
    }
    ;
    a.payVaultRefresh = function(c, b, e, d, f) {
        this.call(163, {
            lastversion: c,
            targetuserid: b
        }, e, d, f)
    }
    ;
    a.payVaultConsume = function(c, b, e, d, f) {
        this.call(166, {
            ids: c,
            targetuserid: b
        }, e, d, f)
    }
    ;
    a.payVaultCredit = function(c, b, e, d, f, g) {
        this.call(169, {
            amount: c,
            reason: b,
            targetuserid: e
        }, d, f, g)
    }
    ;
    a.payVaultDebit = function(c, b, e, d, f, g) {
        this.call(172, {
            amount: c,
            reason: b,
            targetuserid: e
        }, d, f, g)
    }
    ;
    a.payVaultBuy = function(c, b, e, d, f, g) {
        this.call(175, {
            items: c,
            storeitems: b,
            targetuserid: e
        }, d, f, g)
    }
    ;
    a.payVaultGive = function(c, b, e, d, f) {
        this.call(178, {
            items: c,
            targetuserid: b
        }, e, d, f)
    }
    ;
    a.payVaultPaymentInfo = function(c, b, e, d, f, g) {
        this.call(181, {
            provider: c,
            purchasearguments: b,
            items: e
        }, d, f, g)
    }
    ;
    a.payVaultUsePaymentInfo = function(c, b, e, d, f) {
        this.call(184, {
            provider: c,
            providerarguments: b
        }, e, d, f)
    }
    ;
    a.partnerPayTrigger = function(c, b, e, d, f) {
        this.call(200, {
            key: c,
            count: b
        }, e, d, f)
    }
    ;
    a.partnerPaySetTag = function(c, b, e, d) {
        this.call(203, {
            partnerid: c
        }, b, e, d)
    }
    ;
    a.notificationsRefresh = function(c, b, e, d) {
        this.call(213, {
            lastversion: c
        }, b, e, d)
    }
    ;
    a.notificationsRegisterEndpoints = function(c, b, e, d, f) {
        this.call(216, {
            lastversion: c,
            endpoints: b
        }, e, d, f)
    }
    ;
    a.notificationsSend = function(c, b, e, d) {
        this.call(219, {
            notifications: c
        }, b, e, d)
    }
    ;
    a.notificationsToggleEndpoints = function(c, b, e, d, f, g) {
        this.call(222, {
            lastversion: c,
            endpoints: b,
            enabled: e
        }, d, f, g)
    }
    ;
    a.notificationsDeleteEndpoints = function(c, b, e, d, f) {
        this.call(225, {
            lastversion: c,
            endpoints: b
        }, e, d, f)
    }
    ;
    a.gameRequestsSend = function(c, b, e, d, f, g) {
        this.call(241, {
            requesttype: c,
            requestdata: b,
            requestrecipients: e
        }, d, f, g)
    }
    ;
    a.gameRequestsRefresh = function(c, b, e, d) {
        this.call(244, {
            playcodes: c
        }, b, e, d)
    }
    ;
    a.gameRequestsDelete = function(c, b, e, d) {
        this.call(247, {
            requestids: c
        }, b, e, d)
    }
    ;
    a.achievementsRefresh = function(c, b, e, d) {
        this.call(271, {
            lastversion: c
        }, b, e, d)
    }
    ;
    a.achievementsLoad = function(c, b, e, d) {
        this.call(274, {
            userids: c
        }, b, e, d)
    }
    ;
    a.achievementsProgressSet = function(c, b, e, d, f) {
        this.call(277, {
            achievementid: c,
            progress: b
        }, e, d, f)
    }
    ;
    a.achievementsProgressAdd = function(c, b, e, d, f) {
        this.call(280, {
            achievementid: c,
            progressdelta: b
        }, e, d, f)
    }
    ;
    a.achievementsProgressMax = function(c, b, e, d, f) {
        this.call(283, {
            achievementid: c,
            progress: b
        }, e, d, f)
    }
    ;
    a.achievementsProgressComplete = function(c, b, e, d) {
        this.call(286, {
            achievementid: c
        }, b, e, d)
    }
    ;
    a.playerInsightRefresh = function(c, b, e) {
        this.call(301, {}, c, b, e)
    }
    ;
    a.playerInsightSetSegments = function(c, b, e, d) {
        this.call(304, {
            segments: c
        }, b, e, d)
    }
    ;
    a.playerInsightTrackInvitedBy = function(c, b, e, d, f) {
        this.call(307, {
            invitinguserid: c,
            invitationchannel: b
        }, e, d, f)
    }
    ;
    a.playerInsightTrackEvents = function(c, b, e, d) {
        this.call(311, {
            events: c
        }, b, e, d)
    }
    ;
    a.playerInsightTrackExternalPayment = function(c, b, e, d, f) {
        this.call(314, {
            currency: c,
            amount: b
        }, e, d, f)
    }
    ;
    a.playerInsightSessionKeepAlive = function(c, b, e) {
        this.call(317, {}, c, b, e)
    }
    ;
    a.playerInsightSessionStop = function(c, b, e) {
        this.call(320, {}, c, b, e)
    }
    ;
    a.oneScoreLoad = function(c, b, e, d) {
        this.call(351, {
            userids: c
        }, b, e, d)
    }
    ;
    a.oneScoreSet = function(c, b, e, d) {
        this.call(354, {
            score: c
        }, b, e, d)
    }
    ;
    a.oneScoreAdd = function(c, b, e, d) {
        this.call(357, {
            score: c
        }, b, e, d)
    }
    ;
    a.oneScoreRefresh = function(c, b, e) {
        this.call(360, {}, c, b, e)
    }
    ;
    a.simpleConnect = function(c, b, e, d, f, g, h, l, k) {
        this.call(400, {
            gameid: c,
            usernameoremail: b,
            password: e,
            playerinsightsegments: d,
            clientapi: f,
            clientinfo: g
        }, h, l, k)
    }
    ;
    a.simpleRegister = function(c, b, e, d, f, g, h, l, k, m, n, p, r, z) {
        this.call(403, {
            gameid: c,
            username: b,
            password: e,
            email: d,
            captchakey: f,
            captchavalue: g,
            extradata: h,
            partnerid: l,
            playerinsightsegments: k,
            clientapi: m,
            clientinfo: n
        }, p, r, z)
    }
    ;
    a.simpleRecoverPassword = function(c, b, e, d, f) {
        this.call(406, {
            gameid: c,
            usernameoremail: b
        }, e, d, f)
    }
    ;
    a.kongregateConnect = function(c, b, e, d, f, g, h, l, k) {
        this.call(412, {
            gameid: c,
            userid: b,
            gameauthtoken: e,
            playerinsightsegments: d,
            clientapi: f,
            clientinfo: g
        }, h, l, k)
    }
    ;
    a.simpleGetCaptcha = function(c, b, e, d, f, g) {
        this.call(415, {
            gameid: c,
            width: b,
            height: e
        }, d, f, g)
    }
    ;
    a.facebookOAuthConnect = function(c, b, e, d, f, g, h, l, k) {
        this.call(418, {
            gameid: c,
            accesstoken: b,
            partnerid: e,
            playerinsightsegments: d,
            clientapi: f,
            clientinfo: g
        }, h, l, k)
    }
    ;
    a.steamConnect = function(c, b, e, d, f, g, h, l, k) {
        this.call(421, {
            gameid: c,
            steamappid: b,
            steamsessionticket: e,
            playerinsightsegments: d,
            clientapi: f,
            clientinfo: g
        }, h, l, k)
    }
    ;
    a.simpleUserGetSecureLoginInfo = function(c, b, e) {
        this.call(424, {}, c, b, e)
    }
    ;
    a.leaderboardsGet = function(c, b, e, d, f, g, h, l, k) {
        this.call(431, {
            group: c,
            leaderboard: b,
            index: e,
            count: d,
            neighbouruserid: f,
            filteruserids: g
        }, h, l, k)
    }
    ;
    a.leaderboardsSet = function(c, b, e, d, f, g) {
        this.call(434, {
            group: c,
            leaderboard: b,
            score: e
        }, d, f, g)
    }
    ;
    a.leaderboardsCount = function(c, b, e, d, f) {
        this.call(437, {
            group: c,
            leaderboard: b
        }, e, d, f)
    }
    ;
    a.joinCluster = function(c, b, e, d, f, g, h, l, k, m, n, p, r, z, v, t, B) {
        this.call(504, {
            clusteraccesskey: c,
            isdevelopmentserver: b,
            ports: e,
            machinename: d,
            version: f,
            machineid: g,
            os: h,
            cpu: l,
            cpucores: k,
            cpulogicalcores: m,
            cpuaddresswidth: n,
            cpumaxclockspeed: p,
            rammegabytes: r,
            ramspeed: z
        }, v, t, B)
    }
    ;
    a.serverHeartbeat = function(c, b, e, d, f, g, h, l, k, m, n, p, r, z, v, t, B, w, y, q) {
        this.call(510, {
            serverid: c,
            appdomains: b,
            servertypes: e,
            machinecpu: d,
            processcpu: f,
            memoryusage: g,
            avaliablememory: h,
            freememory: l,
            runningrooms: k,
            usedresources: m,
            apirequests: n,
            apirequestserror: p,
            apirequestsfailed: r,
            apirequestsexecuting: z,
            apirequestsqueued: v,
            apirequeststime: t,
            serverunixtimeutc: B
        }, w, y, q)
    }
    ;
    a.getGameAssemblyUrl = function(c, b, e, d, f, g) {
        this.call(513, {
            clusteraccesskey: c,
            gamecodeid: b,
            machineid: e
        }, d, f, g)
    }
    ;
    a.devServerLogin = function(c, b, e, d, f) {
        this.call(524, {
            username: c,
            password: b
        }, e, d, f)
    }
    ;
    a.webserviceOnlineTest = function(c, b, e) {
        this.call(533, {}, c, b, e)
    }
    ;
    a.getServerInfo = function(c, b, e, d) {
        this.call(540, {
            machineid: c
        }, b, e, d)
    }
    ;
    a.socialRefresh = function(c, b, e) {
        this.call(601, {}, c, b, e)
    }
    ;
    a.socialLoadProfiles = function(c, b, e, d) {
        this.call(604, {
            userids: c
        }, b, e, d)
    }
}
)();
PlayerIOError = function(a, c, b) {
    this.code = a;
    this.message = c;
    this.stack = b;
    this.stack || (b = Error(),
    this.stack = b.stack || b.stacktrace || b.StackTrace);
    this.toString = function() {
        return "PlayerIOError[" + a + "]: " + c
    }
}
;
PlayerIOError.prototype = Error();
PlayerIOErrorCode = {
    UnsupportedMethod: "UnsupportedMethod",
    GeneralError: "GeneralError",
    InternalError: "InternalError",
    AccessDenied: "AccessDenied",
    InvalidMessageFormat: "InvalidMessageFormat",
    MissingValue: "MissingValue",
    GameRequired: "GameRequired",
    ExternalError: "ExternalError",
    ArgumentOutOfRange: "ArgumentOutOfRange",
    GameDisabled: "GameDisabled",
    UnknownGame: "UnknownGame",
    UnknownConnection: "UnknownConnection",
    InvalidAuth: "InvalidAuth",
    NoServersAvailable: "NoServersAvailable",
    RoomDataTooLarge: "RoomDataTooLarge",
    RoomAlreadyExists: "RoomAlreadyExists",
    UnknownRoomType: "UnknownRoomType",
    UnknownRoom: "UnknownRoom",
    MissingRoomId: "MissingRoomId",
    RoomIsFull: "RoomIsFull",
    NotASearchColumn: "NotASearchColumn",
    QuickConnectMethodNotEnabled: "QuickConnectMethodNotEnabled",
    UnknownUser: "UnknownUser",
    InvalidPassword: "InvalidPassword",
    InvalidRegistrationData: "InvalidRegistrationData",
    InvalidBigDBKey: "InvalidBigDBKey",
    BigDBObjectTooLarge: "BigDBObjectTooLarge",
    BigDBObjectDoesNotExist: "BigDBObjectDoesNotExist",
    UnknownTable: "UnknownTable",
    UnknownIndex: "UnknownIndex",
    InvalidIndexValue: "InvalidIndexValue",
    NotObjectCreator: "NotObjectCreator",
    KeyAlreadyUsed: "KeyAlreadyUsed",
    StaleVersion: "StaleVersion",
    CircularReference: "CircularReference",
    HeartbeatFailed: "HeartbeatFailed",
    InvalidGameCode: "InvalidGameCode",
    VaultNotLoaded: "VaultNotLoaded",
    UnknownPayVaultProvider: "UnknownPayVaultProvider",
    DirectPurchaseNotSupportedByProvider: "DirectPurchaseNotSupportedByProvider",
    BuyingCoinsNotSupportedByProvider: "BuyingCoinsNotSupportedByProvider",
    NotEnoughCoins: "NotEnoughCoins",
    ItemNotInVault: "ItemNotInVault",
    InvalidPurchaseArguments: "InvalidPurchaseArguments",
    InvalidPayVaultProviderSetup: "InvalidPayVaultProviderSetup",
    UnknownPartnerPayAction: "UnknownPartnerPayAction",
    InvalidType: "InvalidType",
    IndexOutOfBounds: "IndexOutOfBounds",
    InvalidIdentifier: "InvalidIdentifier",
    InvalidArgument: "InvalidArgument",
    LoggedOut: "LoggedOut",
    InvalidSegment: "InvalidSegment",
    GameRequestsNotLoaded: "GameRequestsNotLoaded",
    AchievementsNotLoaded: "AchievementsNotLoaded",
    UnknownAchievement: "UnknownAchievement",
    NotificationsNotLoaded: "NotificationsNotLoaded",
    InvalidNotificationsEndpoint: "InvalidNotificationsEndpoint",
    NetworkIssue: "NetworkIssue",
    OneScoreNotLoaded: "OneScoreNotLoaded",
    PublishingNetworkNotAvailable: "PublishingNetworkNotAvailable",
    PublishingNetworkNotLoaded: "PublishingNetworkNotLoaded",
    DialogClosed: "DialogClosed",
    AdTrackCheckCookie: "AdTrackCheckCookie",
    codes: {
        0: "UnsupportedMethod",
        1: "GeneralError",
        2: "InternalError",
        3: "AccessDenied",
        4: "InvalidMessageFormat",
        5: "MissingValue",
        6: "GameRequired",
        7: "ExternalError",
        8: "ArgumentOutOfRange",
        9: "GameDisabled",
        10: "UnknownGame",
        11: "UnknownConnection",
        12: "InvalidAuth",
        13: "NoServersAvailable",
        14: "RoomDataTooLarge",
        15: "RoomAlreadyExists",
        16: "UnknownRoomType",
        17: "UnknownRoom",
        18: "MissingRoomId",
        19: "RoomIsFull",
        20: "NotASearchColumn",
        21: "QuickConnectMethodNotEnabled",
        22: "UnknownUser",
        23: "InvalidPassword",
        24: "InvalidRegistrationData",
        25: "InvalidBigDBKey",
        26: "BigDBObjectTooLarge",
        27: "BigDBObjectDoesNotExist",
        28: "UnknownTable",
        29: "UnknownIndex",
        30: "InvalidIndexValue",
        31: "NotObjectCreator",
        32: "KeyAlreadyUsed",
        33: "StaleVersion",
        34: "CircularReference",
        40: "HeartbeatFailed",
        41: "InvalidGameCode",
        50: "VaultNotLoaded",
        51: "UnknownPayVaultProvider",
        52: "DirectPurchaseNotSupportedByProvider",
        54: "BuyingCoinsNotSupportedByProvider",
        55: "NotEnoughCoins",
        56: "ItemNotInVault",
        57: "InvalidPurchaseArguments",
        58: "InvalidPayVaultProviderSetup",
        70: "UnknownPartnerPayAction",
        80: "InvalidType",
        81: "IndexOutOfBounds",
        82: "InvalidIdentifier",
        83: "InvalidArgument",
        84: "LoggedOut",
        90: "InvalidSegment",
        100: "GameRequestsNotLoaded",
        110: "AchievementsNotLoaded",
        111: "UnknownAchievement",
        120: "NotificationsNotLoaded",
        121: "InvalidNotificationsEndpoint",
        130: "NetworkIssue",
        131: "OneScoreNotLoaded",
        200: "PublishingNetworkNotAvailable",
        201: "PublishingNetworkNotLoaded",
        301: "DialogClosed",
        302: "AdTrackCheckCookie"
    }
};
(function() {
    _pio.client = function(a, c, b, e) {
        this.connectUserId = e;
        this.gameId = c;
        this.gameFS = new _pio.gameFS(c,b);
        this.errorLog = new _pio.errorLog(a);
        this.payVault = new _pio.payVault(a);
        this.bigDB = new _pio.bigDB(a);
        this.multiplayer = new _pio.multiplayer(a);
        this.gameRequests = new _pio.gameRequests(a);
        this.achievements = new _pio.achievements(a);
        this.playerInsight = new _pio.playerInsight(a);
        this.oneScore = new _pio.oneScore(a);
        this.leaderboards = new _pio.leaderboards(a,this.connectUserId);
        this.notifications = new _pio.notifications(a);
        this.publishingNetwork = new _pio.publishingNetwork(a,this.connectUserId)
    }
}
)();
(function() {
    var a = {};
    _pio.gameFS = function(c, b) {
        if ("string" == typeof b && 0 < b.length) {
            var e = (b || "").split("|");
            if (1 <= e.length)
                for (var d = a[c.toLowerCase()] = {}, f = 0; f != e.length; f++) {
                    var g = e[f];
                    "alltoredirect" == g || "cdnmap" == g ? d.baseUrl = e[f + 1] : "alltoredirectsecure" == g || "cdnmapsecure" == g ? d.secureBaseUrl = e[f + 1] : d["." + g] = e[f + 1]
                }
        }
        this.getUrl = function(h, l) {
            if ("/" == !h[0])
                throw _pio.error("The path given to getUrl must start with a slash, like: '/myfile.swf' or '/folder/file.jpg'");
            var k = a[c];
            return k ? (l ? k.secureBaseUrl : k.baseUrl) + (k["." + h] || h) : (l ? "https" : "http") + "://r.playerio.com/r/" + c + h
        }
    }
}
)();
(function() {
    _pio.gameRequests = function(a) {
        function c(d) {
            if (null == d || 0 == d.length)
                return [];
            for (var f = [], g = 0; g != d.length; g++) {
                var h = d[g];
                f.push(new _pio.gameRequest(h.id,h.type,h.senderuserid,h.created,h.data))
            }
            return f
        }
        var b = [];
        this.waitingRequests = "[ERROR: You tried to access gameRequests.waitingRequests before loading waiting requests. You have to call the refresh method first.]";
        var e = this;
        this.send = function(d, f, g, h, l) {
            a.gameRequestsSend(d, _pio.convertToKVArray(f), g, h, l, function(k) {})
        }
        ;
        this.refresh = function(d, f) {
            a.gameRequestsRefresh(b, d, f, function(g) {
                e._playCodes = g.newplaycodes;
                e.waitingRequests = c(g.requests)
            })
        }
        ;
        this["delete"] = function(d, f, g) {
            if ("object" == typeof d || d.length) {
                for (var h = [], l = 0; l != d.length; l++) {
                    var k = d[l].id;
                    if (k)
                        h.push(k);
                    else {
                        d = _pio.error("No GameRequest id found on item#" + l + ". You have to use requests from the gameRequests.waitingRequests array. For instance: client.gameRequests.delete(client.gameRequests.waitingRequests, ...)");
                        _pio.handleError(d, g, d.code, d.message);
                        return
                    }
                }
                a.gameRequestsDelete(h, f, g, function(m) {
                    e.waitingRequests = c(m.requests)
                })
            } else
                d = _pio.error("The first argument to delete should be an array: client.gameRequests.delete([requests], ...)"),
                _pio.handleError(d, g, d.code, d.message)
        }
    }
    ;
    _pio.gameRequest = function(a, c, b, e, d) {
        this.id = a;
        this.type = c;
        this.senderUserId = b;
        this.created = new Date(e);
        this.data = _pio.convertFromKVArray(d)
    }
}
)();
(function() {
    _pio.errorLog = function(a) {
        this.writeError = function(c, b, e, d) {
            a.writeError("Javascript", c, b, e, _pio.convertToKVArray(d))
        }
    }
}
)();
(function() {
    _pio.quickConnect = function() {
        this.simpleGetCaptcha = function(a, c, b, e, d) {
            (new _pio.channel).simpleGetCaptcha(a, c, b, e, d, function(f) {
                return new _pio.simpleGetCaptchaOutput(f.captchakey,f.captchaimageurl)
            })
        }
        ;
        this.simpleRecoverPassword = function(a, c, b, e) {
            (new _pio.channel).simpleRecoverPassword(a, c, b, e, function(d) {})
        }
    }
    ;
    _pio.simpleGetCaptchaOutput = function(a, c) {
        this.captchaKey = a;
        this.captchaImageUrl = c
    }
    ;
    PlayerIO.quickConnect = new _pio.quickConnect
}
)();
(function() {
    _pio.payVault = function(a) {
        function c(d) {
            if (null != d && (b = d.version,
            e.coins = d.coins || 0,
            e.items = [],
            d.items && d.items.length))
                for (var f = 0; f != d.items.length; f++) {
                    var g = d.items[f]
                      , h = e.items[f] = new _pio.vaultItem(g.id,g.itemkey,(new Date).setTime(g.purchasedate));
                    _pio.bigDBDeserialize(g.properties, h, !0)
                }
        }
        var b = null;
        this.coins = "[ERROR: you tried to access payVault.coins before the vault was loaded. You have to refresh the vault before the .coins property is set to the right value]";
        this.items = "[ERROR: you tried to access payVault.items before the vault was loaded. You have to refresh the vault before the .items property is set to the right value]";
        this.has = function(d) {
            if (null == b)
                throw new PlayerIOError(PlayerIOErrorCode.VaultNotLoaded,"Cannot access items before vault has been loaded. Please refresh the vault first");
            for (var f = 0; f != this.items.length; f++)
                if (this.items[f].itemKey == d)
                    return !0;
            return !1
        }
        ;
        this.first = function(d) {
            if (null == b)
                throw new PlayerIOError(PlayerIOErrorCode.VaultNotLoaded,"Cannot access items before vault has been loaded. Please refresh the vault first");
            for (var f = 0; f != this.items.length; f++)
                if (this.items[f].itemKey == d)
                    return this.items[f];
            return null
        }
        ;
        this.count = function(d) {
            if (null == b)
                throw new PlayerIOError(PlayerIOErrorCode.VaultNotLoaded,"Cannot access items before vault has been loaded. Please refresh the vault first");
            for (var f = 0, g = 0; g != this.items.length; g++)
                this.items[g].itemKey == d && f++;
            return f
        }
        ;
        this.refresh = function(d, f) {
            a.payVaultRefresh(b, null, d, f, function(g) {
                c(g.vaultcontents)
            })
        }
        ;
        this.readHistory = function(d, f, g, h) {
            a.payVaultReadHistory(d, f, null, g, h, function(l) {
                for (var k = [], m = 0; m != l.entries.length; m++) {
                    var n = l.entries[m];
                    k.push(new _pio.payVaultHistoryEntry(n.type,n.amount,n.timestamp,n.itemkeys || [],n.reason,n.providertransactionid,n.providerprice))
                }
                return k
            })
        }
        ;
        this.credit = function(d, f, g, h) {
            a.payVaultCredit(d, f, null, g, h, function(l) {
                c(l.vaultcontents)
            })
        }
        ;
        this.debit = function(d, f, g, h) {
            a.payVaultDebit(d, f, null, g, h, function(l) {
                c(l.vaultcontents)
            })
        }
        ;
        this.consume = function(d, f, g) {
            if ("object" == typeof d || d.length) {
                for (var h = [], l = 0; l != d.length; l++) {
                    var k = d[l].id;
                    if (k)
                        h.push(k);
                    else {
                        d = _pio.error("No PayVault item id found on item#" + l + ". You have to use items from the payVault.items array. For instance: client.payVault.consume([client.payVault.first('sportscar')], ...)");
                        _pio.handleError(d, g, d.code, d.message);
                        return
                    }
                }
                a.payVaultConsume(h, null, f, g, function(m) {
                    c(m.vaultcontents)
                })
            } else
                d = _pio.error("The first argument to consume should be an array: client.payVault.consume([item], ...)"),
                _pio.handleError(d, g, d.code, d.message)
        }
        ;
        this.buy = function(d, f, g, h) {
            a.payVaultBuy(_pio.convertBuyItems(d), f, null, g, h, function(l) {
                c(l.vaultcontents)
            })
        }
        ;
        this.give = function(d, f, g) {
            a.payVaultGive(_pio.convertBuyItems(d), null, f, g, function(h) {
                c(h.vaultcontents)
            })
        }
        ;
        this.getBuyCoinsInfo = function(d, f, g, h) {
            a.payVaultPaymentInfo(d, _pio.convertToKVArray(f), null, g, h, function(l) {
                return _pio.convertFromKVArray(l.providerarguments)
            })
        }
        ;
        this.getBuyDirectInfo = function(d, f, g, h, l) {
            a.payVaultPaymentInfo(d, _pio.convertToKVArray(f), _pio.convertBuyItems(g), h, l, function(k) {
                return _pio.convertFromKVArray(k.providerarguments)
            })
        }
        ;
        var e = this
    }
    ;
    _pio.convertBuyItems = function(a) {
        if (null == a)
            return [];
        for (var c = [], b = 0; b != a.length; b++) {
            var e = a[b].itemkey;
            if (!e)
                throw _pio.error("You have to specify an itemkey for the payvault item. Example:  {itemkey:'car'}");
            c.push({
                itemkey: e,
                payload: _pio.compareForChanges({
                    itemkey: e
                }, a[b], !0, !0)
            })
        }
        return c
    }
    ;
    _pio.vaultItem = function(a, c, b) {
        this.id = a;
        this.itemKey = c;
        this.purchaseDate = b
    }
    ;
    _pio.payVaultHistoryEntry = function(a, c, b, e, d, f, g) {
        this.type = a;
        this.amount = c;
        this.timestamp = (new Date).setTime(b);
        this.itemKeys = e;
        this.reason = d;
        this.providerTransactionId = f;
        this.providerPrice = g
    }
}
)();
(function() {
    _pio.bigDB = function(a) {
        function c() {
            for (var f = 0; f < d.length; f++) {
                var g = d[f], h = !0, l;
                for (l in g.objects)
                    if (g.objects[l]._internal_("get-is-saving")) {
                        h = !1;
                        break
                    }
                if (h) {
                    for (l in g.objects)
                        for (h = f + 1; h < d.length; h++) {
                            futureSave = d[h];
                            for (var k = 0; k < futureSave.objects.length; k++)
                                futureSave.objects[k] == g.objects[l] && futureSave.fullOverwrite == g.fullOverwrite && futureSave.useOptimisticLock == g.useOptimisticLock && (g.changesets[l] = futureSave.changesets[k],
                                g.futureSaves.push(futureSave))
                        }
                    d.splice(f, 1);
                    f--;
                    g.execute()
                }
            }
        }
        function b(f, g) {
            null == f ? f = [] : f instanceof Array || (f = [f]);
            null != g && (f = f.concat([g]));
            for (var h = [], l = 0; l != f.length; l++) {
                var k = f[l];
                switch (typeof k) {
                case "boolean":
                    h.push({
                        valuetype: _pio.ValueType.Bool,
                        bool: k
                    });
                    break;
                case "string":
                    h.push({
                        valuetype: _pio.ValueType.String,
                        string: k
                    });
                    break;
                case "number":
                    0 != k % 1 ? h.push({
                        valuetype: _pio.ValueType.Double,
                        "double": k
                    }) : -2147483648 < k && 2147483647 > k ? h.push({
                        valuetype: _pio.ValueType.Int,
                        "int": k
                    }) : 0 < k && 4294967295 > k ? h.push({
                        valuetype: _pio.ValueType.UInt,
                        uint: k
                    }) : h.push({
                        valuetype: _pio.ValueType.Long,
                        "long": k
                    });
                    break;
                case "object":
                    if (k.getTime && k.getMilliseconds)
                        h.push({
                            valuetype: _pio.ValueType.DateTime,
                            datetime: k.getTime()
                        });
                    else
                        throw Error("Don't know how to serialize type '" + typeof k + "' for BigDB");
                    break;
                default:
                    throw Error("Don't know how to serialize type '" + typeof k + "' for BigDB");
                }
            }
            return h
        }
        var e = this
          , d = [];
        this.createObject = function(f, g, h, l, k) {
            var m = _pio.compareForChanges({}, h || {}, !0, !0);
            a.createObjects([{
                key: g,
                table: f,
                properties: m
            }], !1, l, k, function(n) {
                if (1 == n.objects.length)
                    return new _pio.databaseobject(e,f,n.objects[0].key,n.objects[0].version,!1,m);
                throw new PlayerIOError(PlayerIOErrorCode.GeneralError,"Error creating object");
            })
        }
        ;
        this.loadMyPlayerObject = function(f, g) {
            a.loadMyPlayerObject(f, g, function(h) {
                return new _pio.databaseobject(e,"PlayerObjects",h.playerobject.key,h.playerobject.version,!0,h.playerobject.properties)
            })
        }
        ;
        this.load = function(f, g, h, l) {
            a.loadObjects([{
                table: f,
                keys: [g]
            }], h, l, function(k) {
                if (1 == k.objects.length)
                    return null == k.objects[0] ? null : new _pio.databaseobject(e,f,k.objects[0].key,k.objects[0].version,!1,k.objects[0].properties);
                throw new PlayerIOError(PlayerIOErrorCode.GeneralError,"Error loading object");
            })
        }
        ;
        this.loadKeys = function(f, g, h, l) {
            a.loadObjects([{
                table: f,
                keys: g
            }], h, l, function(k) {
                for (var m = [], n = 0; n != k.objects.length; n++) {
                    var p = k.objects[n];
                    m[n] = null == p ? null : new _pio.databaseobject(e,f,p.key,p.version,!1,p.properties)
                }
                return m
            })
        }
        ;
        this.loadOrCreate = function(f, g, h, l) {
            a.createObjects([{
                key: g,
                table: f,
                properties: []
            }], !0, h, l, function(k) {
                if (1 == k.objects.length)
                    return new _pio.databaseobject(e,f,k.objects[0].key,k.objects[0].version,!1,k.objects[0].properties);
                throw new PlayerIOError(PlayerIOErrorCode.GeneralError,"Error creating object");
            })
        }
        ;
        this.deleteKeys = function(f, g, h, l) {
            a.deleteObjects([{
                table: f,
                keys: g
            }], h, l, function(k) {
                return null
            })
        }
        ;
        this.loadKeysOrCreate = function(f, g, h, l) {
            for (var k = [], m = 0; m != g.length; m++)
                k.push({
                    key: g[m],
                    table: f,
                    properties: []
                });
            a.createObjects(k, !0, h, l, function(n) {
                for (var p = [], r = 0; r != n.objects.length; r++) {
                    var z = n.objects[r];
                    p[r] = new _pio.databaseobject(e,f,z.key,z.version,!1,z.properties)
                }
                return p
            })
        }
        ;
        this.loadSingle = function(f, g, h, l, k) {
            a.loadMatchingObjects(f, g, b(h), 1, l, k, function(m) {
                return 0 == m.objects.length ? null : new _pio.databaseobject(e,f,m.objects[0].key,m.objects[0].version,!1,m.objects[0].properties)
            })
        }
        ;
        this.loadRange = function(f, g, h, l, k, m, n, p) {
            a.loadIndexRange(f, g, b(h, l), b(h, k), m, n, p, function(r) {
                for (var z = [], v = 0; v != r.objects.length; v++) {
                    var t = r.objects[v];
                    z[v] = null == t ? null : new _pio.databaseobject(e,f,t.key,t.version,!1,t.properties)
                }
                return z
            })
        }
        ;
        this.deleteRange = function(f, g, h, l, k, m, n) {
            a.deleteIndexRange(f, g, b(h, l), b(h, k), m, n, function() {})
        }
        ;
        this.saveChanges = function(f, g, h, l, k, m) {
            var n = 1 == m;
            m = [];
            for (var p in h) {
                var r = h[p];
                if (!(r.existsInDatabase && r.key && r.table && r._internal_ && r.save)) {
                    f = _pio.error("You can only save database objects that exist in the database");
                    _pio.handleError(f, k, f.code, f.message);
                    return
                }
                var z = _pio.compareForChanges(g ? {} : r._internal_("get-dbCurrent"), r, !0, !0);
                (g || 0 < z.length) && m.push({
                    key: r._internal_("get-key"),
                    table: r._internal_("get-table"),
                    fulloverwrite: g,
                    onlyifversion: f ? r._internal_("get-version") : null,
                    changes: z
                })
            }
            d.push({
                objects: h,
                changesets: m,
                fullOverwrite: g,
                useOptimisticLock: f,
                futureSaves: [],
                setIsSavingOnAll: function(v) {
                    for (var t = 0; t != this.objects.length; t++)
                        this.objects[t]._internal_("set-is-saving", v)
                },
                done: function() {
                    this.setIsSavingOnAll(!1);
                    c()
                },
                execute: function() {
                    var v = this;
                    v.setIsSavingOnAll(!0);
                    0 < v.changesets.length ? a.saveObjectChanges(_pio.LockType.LockAll, v.changesets, n, l, function(t) {
                        v.done();
                        _pio.handleError(t, k, t.code, t.message)
                    }, function(t) {
                        for (var B = 0; B != v.objects.length; B++) {
                            var w = v.objects[B];
                            w._internal_("set-version", t.versions[B]);
                            w._internal_("change-dbCurrent", v.changesets[B].changes);
                            for (var y = 0; y != v.futureSaves.length; y++)
                                for (var q = v.futureSaves[y], u = 0; u < q.objects.length; u++)
                                    q.objects[u] == w && (q.changesets.splice(u, 1),
                                    q.objects.splice(u, 1),
                                    u--)
                        }
                        v.done()
                    }) : (v.done(),
                    setTimeout(l, 1))
                }
            });
            c()
        }
    }
    ;
    _pio.databaseobject = function(a, c, b, e, d, f) {
        var g = {}
          , h = !1;
        _pio.bigDBDeserialize(f, g, !0);
        this.table = c;
        this.key = b;
        this.existsInDatabase = !0;
        this.save = function(l, k, m, n) {
            a.saveChanges(l, k, [this], m, n, d)
        }
        ;
        this._internal_ = function(l, k) {
            switch (l) {
            case "get-table":
                return c;
            case "get-key":
                return b;
            case "set-is-saving":
                h = k;
            case "get-is-saving":
                return h;
            case "get-version":
                return e;
            case "set-version":
                e = k;
            case "get-dbCurrent":
                return g;
            case "change-dbCurrent":
                _pio.bigDBDeserialize(k, g, !0)
            }
        }
        ;
        _pio.bigDBDeserialize(f, this, !0)
    }
    ;
    _pio.compareForChanges = function(a, c, b, e) {
        var d = [], f;
        for (f in c) {
            var g = c[f]
              , h = a ? a[f] : null;
            switch (f) {
            case "table":
                if (e)
                    continue;
            case "key":
                if (e)
                    continue;
            case "save":
                if (e)
                    continue;
            case "existsInDatabase":
                if (e)
                    continue;
            case "_internal_":
                if (e)
                    continue;
            case "_circular_reference_finder_":
                continue
            }
            if (null != g) {
                var l = b ? {
                    name: f
                } : {
                    index: parseInt(f)
                };
                switch (typeof g) {
                case "boolean":
                    g != h && (l.value = {
                        valuetype: _pio.ValueType.Bool,
                        bool: g
                    },
                    d.push(l));
                    break;
                case "number":
                    g != h && (isFinite(g) && Math.floor(g) === g ? l.value = -2147483648 <= g && 2147483647 >= g ? {
                        valuetype: _pio.ValueType.Int,
                        "int": g
                    } : 0 < g && 4294967295 >= g ? {
                        valuetype: _pio.ValueType.UInt,
                        uint: g
                    } : -0x7ffffffffffffc00 <= g && 0x7ffffffffffffc00 >= g ? {
                        valuetype: _pio.ValueType.Long,
                        "long": g
                    } : 0 < g && 1.844674407370955E19 >= g ? {
                        valuetype: _pio.ValueType.ULong,
                        ulong: g
                    } : {
                        valuetype: _pio.ValueType.Double,
                        "double": g
                    } : l.value = {
                        valuetype: _pio.ValueType.Double,
                        "double": g
                    },
                    d.push(l));
                    break;
                case "string":
                    g != h && (l.value = {
                        valuetype: _pio.ValueType.String,
                        string: g
                    },
                    d.push(l));
                    break;
                case "object":
                    if (g.getTime && g.getMilliseconds)
                        g + "" != h + "" && (l.value = {
                            valuetype: _pio.ValueType.DateTime,
                            datetime: g.getTime()
                        },
                        d.push(l));
                    else {
                        if (g._circular_reference_finder_)
                            throw new PlayerIOError(PlayerIOErrorCode.CircularReference,"The object you're trying to save contains a circular reference for " + (b ? "a property named" : "the array entry") + "): " + f);
                        g._circular_reference_finder_ = !0;
                        var k = g instanceof Array;
                        if (k && g.bytearray) {
                            k = Array(g.length);
                            for (h = 0; h != k.length; h++) {
                                var m = g[h];
                                if (0 <= m && 255 >= m)
                                    k[h] = m;
                                else
                                    throw new PlayerIOError(PlayerIOErrorCode.GeneralError,"The bytearray property '" + f + "' was supposed to only contain byte (0-255) values, but contained the value: " + m);
                            }
                            l.value = {
                                valuetype: _pio.ValueType.ByteArray,
                                bytearray: k
                            }
                        } else
                            h = _pio.compareForChanges(h, g, !k, !1),
                            l.value = k ? {
                                valuetype: _pio.ValueType.Array,
                                arrayproperties: h
                            } : {
                                valuetype: _pio.ValueType.Obj,
                                objectproperties: h
                            };
                        d.push(l);
                        delete g._circular_reference_finder_
                    }
                    break;
                case "undefined":
                    break;
                case "function":
                    break;
                default:
                    throw Error("Don't know how to serialize type '" + typeof g + "' for BigDB");
                }
            }
        }
        for (f in a)
            null != c[f] && "undefined" != typeof c[f] || d.push(b ? {
                name: f
            } : {
                index: parseInt(f)
            });
        return d
    }
    ;
    _pio.bigDBDeserialize = function(a, c, b) {
        for (var e in a) {
            var d = a[e]
              , f = b ? d.name : d.index || 0;
            if (d = d.value)
                switch (d.valuetype || 0) {
                case _pio.ValueType.String:
                    c[f] = d.string || "";
                    break;
                case _pio.ValueType.Int:
                    c[f] = d["int"] || 0;
                    break;
                case _pio.ValueType.UInt:
                    c[f] = d.uint || 0;
                    break;
                case _pio.ValueType.Long:
                    c[f] = d["long"] || 0;
                    break;
                case _pio.ValueType.Bool:
                    c[f] = d.bool || 0;
                    break;
                case _pio.ValueType.Float:
                    c[f] = d["float"] || 0;
                    break;
                case _pio.ValueType.Double:
                    c[f] = d["double"] || 0;
                    break;
                case _pio.ValueType.ByteArray:
                    c[f] = d.bytearray;
                    c[f].bytearray = !0;
                    break;
                case _pio.ValueType.DateTime:
                    c[f] = new Date(d.datetime || 0);
                    break;
                case _pio.ValueType.Array:
                    var g = c[f]instanceof Array ? c[f] : [];
                    _pio.bigDBDeserialize(d.arrayproperties, g, !1);
                    c[f] = g;
                    break;
                case _pio.ValueType.Obj:
                    g = "object" == typeof c[f] ? c[f] : {},
                    _pio.bigDBDeserialize(d.objectproperties, g, !0),
                    c[f] = g
                }
            else
                delete c[f]
        }
    }
}
)();
(function() {
    _pio.multiplayer = function(b) {
        var e = this;
        this.developmentServer = null;
        this.useSecureConnections = !1;
        this.createRoom = function(d, f, g, h, l, k) {
            b.createRoom(d, f, g, _pio.convertToKVArray(h), null != e.developmentServer, l, k, function(m) {
                return m.roomid
            })
        }
        ;
        this.joinRoom = function(d, f, g, h) {
            clearTimeout(setTimeout(function() {
                g(new _pio.connection)
            }, 1E4));
            var l = Error();
            b.joinRoom(d, _pio.convertToKVArray(f), null != e.developmentServer, e.useSecureConnections, function() {}, h, function(k) {
                return new _pio.connection(l,e.developmentServer,e.useSecureConnections,k.endpoints,k.joinkey,f || {},g,h)
            })
        }
        ;
        this.createJoinRoom = function(d, f, g, h, l, k, m) {
            clearTimeout(setTimeout(function() {
                k(new _pio.connection)
            }, 1E4));
            var n = Error();
            b.createJoinRoom(d, f, g, _pio.convertToKVArray(h), _pio.convertToKVArray(l), null != e.developmentServer, e.useSecureConnections, function() {}, m, function(p) {
                return new _pio.connection(n,e.developmentServer,e.useSecureConnections,p.endpoints,p.joinkey,l || {},k,m)
            })
        }
        ;
        this.listRooms = function(d, f, g, h, l, k) {
            b.listRooms(d, _pio.convertToKVArray(f), g, h, null != e.developmentServer, l, k, function(m) {
                var n = [];
                if (m.rooms && 0 < m.rooms.length)
                    for (var p = 0; p != m.rooms.length; p++) {
                        var r = m.rooms[p];
                        n.push(new _pio.roomInfo(r.id,r.roomtype,r.onlineusers,_pio.convertFromKVArray(r.roomdata)))
                    }
                return n
            })
        }
    }
    ;
    _pio.websocketConnection = function(b, e, d, f, g, h, l) {
        var k = this
          , m = !1
          , n = new _pio.messageSerializer
          , p = !1
          , r = null;
        e = (e ? "wss://" : "ws://") + d + "/";
        try {
            r = "undefined" != typeof MozWebSocket ? new MozWebSocket(e) : new WebSocket(e)
        } catch (v) {
            g(!1, "" + v);
            return
        }
        var z = setTimeout(function() {
            m || (m = !0,
            g(!1, "Connect attempt timed out"))
        }, f);
        r.onopen = function() {
            m || (clearTimeout(z),
            p = m = !0,
            g(p))
        }
        ;
        r.onclose = function(v) {
            k.disconnect()
        }
        ;
        r.onerror = function(v) {
            k.disconnect()
        }
        ;
        r.onmessage = function(v) {
            if (p)
                if (b) {
                    var t = new FileReader;
                    t.onloadend = function() {
                        for (var B = new Uint8Array(t.result), w = Array(B.length), y = 0; y != B.length; y++)
                            w[y] = B[y];
                        l(n.deserializeMessage(w, 0, w.length))
                    }
                    ;
                    t.readAsArrayBuffer(v.data)
                } else
                    v = _pio.base64decode(v.data),
                    l(n.deserializeMessage(v, 0, v.length))
        }
        ;
        this.disconnect = function() {
            if (p) {
                p = !1;
                h();
                try {
                    r.close()
                } catch (v) {
                    _pio.debugLog(v)
                }
            }
        }
        ;
        this.sendMessage = function(v) {
            v = n.serializeMessage(v);
            if (b) {
                for (var t = new Uint8Array(v.length), B = 0; B < v.length; B++)
                    t[B] = v[B];
                r.send(t.buffer)
            } else
                v = _pio.base64encode(v),
                r.send(v)
        }
    }
    ;
    _pio.connection = function(b, e, d, f, g, h, l, k) {
        function m(y) {
            function q() {
                if (0 < A.length) {
                    var C = A[0];
                    A.splice(0, 1);
                    var L = y(d, C, 4E3, function(J, M) {
                        if (J) {
                            t = L;
                            n.connected = !0;
                            var O = n.createMessage("join");
                            O.addString(g);
                            if (null != h)
                                for (var U in h)
                                    O.addString(U),
                                    O.addString("" + h[U]);
                            n.sendMessage(O)
                        } else
                            _pio.debugLog("Unable to connect to endpoint: " + C + '. reason: "' + M + (0 < A.length ? '". Trying next endpoint.' : '". No more endpoints to try.')),
                            q()
                    }, function(J) {
                        n.connected && (n.connected = !1,
                        setTimeout(function() {
                            for (var M = 0; M != r.length; M++)
                                _pio.runCallback(r[M].callback, n, r[M].stackSource)
                        }, 100))
                    }, function(J) {
                        p ? "playerio.joinresult" == J.type ? (p = !1,
                        J.getBoolean(0) ? _pio.runCallback(l, n, null) : _pio.handleError(b, k, J.getInt(1), J.getString(2))) : _pio.handleError(b, k, PlayerIOErrorCode.GeneralError, "The expected inital messagetype is: playerio.joinresult, received: " + joinResult.getType()) : (u(J.type, J),
                        u("*", J))
                    })
                } else
                    _pio.handleError(b, k, PlayerIOErrorCode.GeneralError, "Could not establish a socket connection to any of the given endpoints for the room")
            }
            function u(C, L) {
                var J = z[C];
                if (J)
                    for (var M = 0; M < J.length; M++)
                        _pio.runCallback(J[M].callback, L, J[M].stackSource)
            }
            var A = [];
            if (e)
                A.push(e);
            else
                for (var F = 0; F != f.length; F++)
                    A.push(f[F].address + ":" + f[F].port);
            q()
        }
        var n = this
          , p = !0
          , r = []
          , z = {}
          , v = []
          , t = null
          , B = /(WebKit|Firefox|Trident)\/([0-9]+)/gi.exec(navigator.userAgent)
          , w = B && 3 <= B.length ? B[1] : null;
        B = B && 3 <= B.length ? parseInt(B[2]) : null;
        window.FileReader && "WebKit" == w && 535 <= B || "Firefox" == w && 11 <= B || "Trident" == w && 6 <= B ? m(function(y, q, u, A, F, C) {
            return new _pio.websocketConnection(!0,y,q,u,A,F,C)
        }) : _pio.isFlashFallbackEnabled(function(y) {
            y ? m(function(q, u, A, F, C, L) {
                return new _pio.flashSocketConnection(u,A,F,C,L)
            }) : m(function(q, u, A, F, C, L) {
                return new _pio.websocketConnection(!1,q,u,A,F,C,L)
            })
        });
        this.connected = !1;
        this.addDisconnectCallback = function(y) {
            r.push({
                callback: y,
                stackSourc: Error()
            })
        }
        ;
        this.addMessageCallback = function(y, q) {
            null == y && (y = "*");
            var u = z[y];
            u || (z[y] = u = []);
            u.push({
                callback: q,
                stackSource: Error()
            })
        }
        ;
        this.removeDisconnectCallback = function(y) {
            for (var q = 0; q < r.length; q++)
                r[q].callback == y && (r.splice(q, 1),
                q--)
        }
        ;
        this.removeMessageCallback = function(y) {
            for (var q in z)
                for (var u = z[q], A = 0; A < u.length; A++)
                    u[A].callback == y && (u.splice(A, 1),
                    A--)
        }
        ;
        this.createMessage = function(y) {
            for (var q = new _pio.message(y), u = 1; u < arguments.length; u++)
                q.add(arguments[u]);
            return q
        }
        ;
        this.send = function(y) {
            var q = this.createMessage.apply(this, arguments);
            this.sendMessage(q)
        }
        ;
        this.sendMessage = function(y) {
            n.connected ? t.sendMessage(y) : v.push(y)
        }
        ;
        this.disconnect = function() {
            n.connected && t.disconnect()
        }
    }
    ;
    _pio.message = function(b) {
        function e(m, n, p, r) {
            if (m)
                k.push(n),
                l.push(p),
                h.length = k.length;
            else
                throw _pio.error("The given value (" + n + ") is not " + r);
        }
        function d(m, n) {
            if (m > k.length)
                throw _pio.error("this message (" + h.type + ") only has " + k.length + " entries");
            if (l[m] == n)
                return k[m];
            throw _pio.error("Value at index:" + m + " is a " + f(l[m]) + " and not a " + f(n) + " as requested. The value is: " + k[m]);
        }
        function f(m) {
            return {
                0: "Integer",
                1: "Unsigned Integer",
                2: "Long",
                3: "Unsigned Long",
                4: "Double",
                5: "Float",
                6: "String",
                7: "ByteArray",
                8: "Boolean"
            }[m]
        }
        function g(m) {
            var n = "object" == typeof m && "undefined" != typeof m.length;
            if (n)
                for (var p = 0; p != m.length; p++)
                    if (255 < m[p] || 0 > m[p]) {
                        n = !1;
                        break
                    }
            return n
        }
        var h = this
          , l = []
          , k = [];
        this.type = b;
        this.length = 0;
        this.add = function() {
            for (var m = 0; m < arguments.length; m++) {
                var n = arguments[m];
                switch (typeof n) {
                case "string":
                    h.addString(n);
                    break;
                case "boolean":
                    h.addBoolean(n);
                    break;
                case "number":
                    if (isFinite(n) && Math.floor(n) === n)
                        if (-2147483648 <= n && 2147483647 >= n) {
                            h.addInt(n);
                            break
                        } else if (0 < n && 4294967295 >= n) {
                            h.addUInt(n);
                            break
                        } else if (-0x7ffffffffffffc00 <= n && 0x7ffffffffffffc00 >= n) {
                            h.addLong(n);
                            break
                        } else if (0 < n && 1.844674407370955E19 >= n) {
                            h.addULong(n);
                            break
                        }
                    h.addDouble(n);
                    break;
                case "object":
                    if (g(n)) {
                        this.addByteArray(n);
                        break
                    }
                default:
                    throw _pio.error("The type of the value (" + n + ") cannot be inferred");
                }
            }
        }
        ;
        this.addInt = function(m) {
            e(-2147483648 <= m && 2147483647 >= m, Math.trunc(m), 0, "an integer (32bit)")
        }
        ;
        this.addUInt = function(m) {
            e(0 <= m && 4294967295 >= m, Math.trunc(m), 1, "an unsigned integer (32bit)")
        }
        ;
        this.addLong = function(m) {
            e(-0x7ffffffffffffc00 <= m && 0x7ffffffffffffc00 >= m, Math.trunc(m), 2, "a long (64bit)")
        }
        ;
        this.addULong = function(m) {
            e(0 <= m && 1.844674407370955E19 >= m, m, 3, "an unsigned long (64bit)")
        }
        ;
        this.addBoolean = function(m) {
            e(!0, m ? !0 : !1, 8, "a boolean value")
        }
        ;
        this.addFloat = function(m) {
            e(!0, Number(m), 5, "a floating point value (32bit)")
        }
        ;
        this.addDouble = function(m) {
            e(!0, Number(m), 4, "a double floating point value (64bit)")
        }
        ;
        this.addByteArray = function(m) {
            e(g(m), m, 7, "a bytearray")
        }
        ;
        this.addString = function(m) {
            e(!0, m + "", 6, "a string")
        }
        ;
        this.getInt = function(m) {
            return d(m, 0)
        }
        ;
        this.getUInt = function(m) {
            return d(m, 1)
        }
        ;
        this.getLong = function(m) {
            return d(m, 2)
        }
        ;
        this.getULong = function(m) {
            return d(m, 3)
        }
        ;
        this.getBoolean = function(m) {
            return d(m, 8)
        }
        ;
        this.getDouble = function(m) {
            return d(m, 4)
        }
        ;
        this.getFloat = function(m) {
            return d(m, 5)
        }
        ;
        this.getByteArray = function(m) {
            return d(m, 7)
        }
        ;
        this.getString = function(m) {
            return d(m, 6)
        }
        ;
        this.toString = function() {
            for (var m = "msg.Type = " + this.type, n = 0; n != this.length; n++)
                m += ", msg[" + n + "] = " + k[n] + " (" + f(l[n]) + ")";
            return m
        }
        ;
        this._internal_ = function(m, n) {
            switch (m) {
            case "get-objects":
                return k;
            case "get-types":
                return l
            }
        }
    }
    ;
    _pio.roomInfo = function(b, e, d, f) {
        this.id = b;
        this.roomType = e;
        this.onlineUsers = d;
        this.roomData = f
    }
    ;
    _pio.byteWriter = function() {
        this.bytes = [];
        this.writeByte = function(b) {
            if (0 <= b && 255 >= b)
                this.bytes.push(b);
            else
                throw Error("This is not a byte value: " + b);
        }
        ;
        this.writeBytes = function(b) {
            for (var e = 0; e != b.length; e++)
                this.writeByte(b[e])
        }
        ;
        this.writeTagWithLength = function(b, e, d) {
            63 < b || 0 > b ? this.writeBottomPatternAndBytes(d, _pio.binaryserializer.bytesFromInt(b)) : this.writeByte(e | b)
        }
        ;
        this.writeBottomPatternAndBytes = function(b, e) {
            var d = 0;
            0 != e[0] ? d = 3 : 0 != e[1] ? d = 2 : 0 != e[2] && (d = 1);
            this.writeByte(b | d);
            for (d = e.length - d - 1; d != e.length; d++)
                this.writeByte(e[d])
        }
        ;
        this.writeLongPattern = function(b, e, d) {
            for (var f = 0, g = 0; 7 != g; g++)
                if (0 != d[g]) {
                    f = 7 - g;
                    break
                }
            3 < f ? this.writeByte(e | f - 4) : this.writeByte(b | f);
            for (g = d.length - f - 1; g != d.length; g++)
                this.writeByte(d[g])
        }
    }
    ;
    _pio.messageSerializer = function() {
        this.serializeMessage = function(b) {
            var e = new _pio.byteWriter;
            e.writeTagWithLength(b.length, 128, 4);
            var d = _pio.binaryserializer.bytesFromString(b.type);
            e.writeTagWithLength(d.length, 192, 12);
            e.writeBytes(d);
            for (var f = 0; f != b.length; f++)
                switch (d = b._internal_("get-objects")[f],
                b._internal_("get-types")[f]) {
                case 6:
                    d = _pio.binaryserializer.bytesFromString(d);
                    e.writeTagWithLength(d.length, 192, 12);
                    e.writeBytes(d);
                    break;
                case 0:
                    e.writeTagWithLength(d, 128, 4);
                    break;
                case 1:
                    e.writeBottomPatternAndBytes(8, _pio.binaryserializer.bytesFromUInt(d));
                    break;
                case 2:
                    e.writeLongPattern(48, 52, _pio.binaryserializer.bytesFromLong(d));
                    break;
                case 3:
                    e.writeLongPattern(56, 60, _pio.binaryserializer.bytesFromULong(d));
                    break;
                case 7:
                    e.writeTagWithLength(d.length, 64, 16);
                    e.writeBytes(d);
                    break;
                case 4:
                    e.writeByte(3);
                    e.writeBytes(_pio.binaryserializer.bytesFromDouble(d));
                    break;
                case 5:
                    e.writeByte(2);
                    d = _pio.binaryserializer.bytesFromFloat(d);
                    e.writeBytes(d);
                    break;
                case 8:
                    e.writeByte(d ? 1 : 0)
                }
            return e.bytes
        }
        ;
        this.deserializeMessage = function(b, e, d) {
            var f = e;
            e += d;
            d = null;
            for (var g = 0; f < e; ) {
                var h = 0
                  , l = 0
                  , k = b[f];
                f++;
                var m = k & 192;
                0 == m && (m = k & 60,
                0 == m && (m = k));
                switch (m) {
                case 12:
                case 16:
                    h = (k & 3) + 1;
                    if (f + h > e)
                        throw Error("Unexpected: Unfinished message");
                    k = h;
                    h = _pio.binaryserializer.intFromBytes(b, f, h);
                    f += k;
                    break;
                case 192:
                    h = k & 63;
                    break;
                case 128:
                    l = k & 63;
                    break;
                case 64:
                    h = k & 63;
                    break;
                case 4:
                case 8:
                case 48:
                case 56:
                    h = (k & 3) + 1;
                    break;
                case 52:
                case 60:
                    h = (k & 3) + 5;
                    break;
                case 3:
                    h = 8;
                    break;
                case 2:
                    h = 4
                }
                if (f + h > e)
                    throw Error("Unexpected: Unfinished message");
                switch (m) {
                case 12:
                case 192:
                    null == d ? (d = new _pio.message(_pio.binaryserializer.stringFromBytes(b, f, h)),
                    g++) : d.addString(_pio.binaryserializer.stringFromBytes(b, f, h));
                    break;
                case 4:
                    l = _pio.binaryserializer.intFromBytes(b, f, h);
                case 128:
                    0 == g ? g = l : d.addInt(l);
                    break;
                case 16:
                case 64:
                    d.addByteArray(b.slice(f, f + h));
                    break;
                case 8:
                    d.addUInt(_pio.binaryserializer.uintFromBytes(b, f, h));
                    break;
                case 48:
                case 52:
                    d.addLong(_pio.binaryserializer.longFromBytes(b, f, h));
                    break;
                case 56:
                case 60:
                    d.addULong(_pio.binaryserializer.ulongFromBytes(b, f, h));
                    break;
                case 3:
                    d.addDouble(_pio.binaryserializer.doubleFromBytes(b, f, h));
                    break;
                case 2:
                    d.addFloat(_pio.binaryserializer.floatFromBytes(b, f, h));
                    break;
                case 1:
                    d.addBoolean(!0);
                    break;
                case 0:
                    d.addBoolean(!1)
                }
                f += h;
                if (null != d && 0 == --g)
                    return d
            }
            throw Error("Unexpected: Misaligned message");
        }
    }
    ;
    _pio.binaryserializer = {
        pow2: function(b) {
            return 0 <= b && 31 > b ? 1 << b : this.pow2[b] || (this.pow2[b] = Math.pow(2, b))
        },
        _intEncode: function(b, e) {
            if (4 == e)
                var d = [b >>> 24 & 255, b >>> 16 & 255, b >>> 8 & 255, b & 255];
            else {
                if (0 <= b) {
                    d = Math.floor(b / this.pow2(32));
                    var f = b - d * this.pow2(32)
                } else
                    d = Math.floor(b / this.pow2(32)),
                    f = b - d * this.pow2(32),
                    d += this.pow2(32);
                d = [d >>> 24 & 255, d >>> 16 & 255, d >>> 8 & 255, d & 255, f >>> 24 & 255, f >>> 16 & 255, f >>> 8 & 255, f & 255]
            }
            return d
        },
        _floatEncode: function(b, e, d) {
            var f = 0 > b ? 1 : 0, g, h = ~(-1 << d - 1), l = 1 - h;
            0 > b && (b = -b);
            0 === b ? b = g = 0 : isNaN(b) ? (g = 2 * h + 1,
            b = 1) : Infinity === b ? (g = 2 * h + 1,
            b = 0) : (g = Math.floor(Math.log(b) / Math.LN2),
            g >= l && g <= h ? (b = Math.floor((b * this.pow2(-g) - 1) * this.pow2(e)),
            g += h) : (b = Math.floor(b / this.pow2(l - e)),
            g = 0));
            for (h = []; 8 <= e; )
                h.push(b % 256),
                b = Math.floor(b / 256),
                e -= 8;
            g = g << e | b;
            for (d += e; 8 <= d; )
                h.push(g & 255),
                g >>>= 8,
                d -= 8;
            h.push(f << d | g);
            h.reverse();
            return h
        },
        bytesFromString: function(b) {
            for (var e = [], d = 0; d < b.length; d++)
                if (127 >= b.charCodeAt(d))
                    e.push(b.charCodeAt(d));
                else
                    for (var f = encodeURIComponent(b.charAt(d)).substr(1).split("%"), g = 0; g < f.length; g++)
                        e.push(parseInt(f[g], 16));
            return e
        },
        bytesFromInt: function(b) {
            return this._intEncode(b, 4)
        },
        bytesFromUInt: function(b) {
            return this._intEncode(b, 4)
        },
        bytesFromLong: function(b) {
            return this._intEncode(b, 8)
        },
        bytesFromULong: function(b) {
            return this._intEncode(b, 8)
        },
        bytesFromFloat: function(b) {
            return this._floatEncode(b, 23, 8)
        },
        bytesFromDouble: function(b) {
            return this._floatEncode(b, 52, 11)
        },
        _intDecode: function(b, e, d, f, g) {
            var h = e + d - 1;
            e = g && d == f && b[e] & 128;
            f = 0;
            g = 1;
            for (var l = 0; l < d; l++) {
                var k = b[h - l];
                e && (k = (k ^ 255) + g,
                g = k >> 8,
                k &= 255);
                f += k * this.pow2(8 * l)
            }
            return e ? -f : f
        },
        _float32Decode: function(b, e) {
            var d = b.slice(e, e + 4).reverse()
              , f = 1 - 2 * (d[3] >> 7)
              , g = (d[3] << 1 & 255 | d[2] >> 7) - 127;
            d = (d[2] & 127) << 16 | d[1] << 8 | d[0];
            return 128 === g ? 0 !== d ? NaN : Infinity * f : -127 === g ? f * d * this.pow2(-149) : f * (1 + d * this.pow2(-23)) * this.pow2(g)
        },
        _float64Decode: function(b, e) {
            var d = b.slice(e, e + 8).reverse()
              , f = 1 - 2 * (d[7] >> 7)
              , g = ((d[7] << 1 & 255) << 3 | d[6] >> 4) - 1023;
            d = (d[6] & 15) * this.pow2(48) + d[5] * this.pow2(40) + d[4] * this.pow2(32) + d[3] * this.pow2(24) + d[2] * this.pow2(16) + d[1] * this.pow2(8) + d[0];
            return 1024 === g ? 0 !== d ? NaN : Infinity * f : -1023 === g ? f * d * this.pow2(-1074) : f * (1 + d * this.pow2(-52)) * this.pow2(g)
        },
        stringFromBytes: function(b, e, d) {
            for (var f = "", g = e; g < e + d; g++)
                f += 127 >= b[g] ? 37 === b[g] ? "%25" : String.fromCharCode(b[g]) : "%" + b[g].toString(16).toUpperCase();
            return decodeURIComponent(f)
        },
        intFromBytes: function(b, e, d) {
            return this._intDecode(b, e, d, 4, !0)
        },
        uintFromBytes: function(b, e, d) {
            return this._intDecode(b, e, d, 4, !1)
        },
        longFromBytes: function(b, e, d) {
            return this._intDecode(b, e, d, 8, !0)
        },
        ulongFromBytes: function(b, e, d) {
            return this._intDecode(b, e, d, 8, !1)
        },
        floatFromBytes: function(b, e, d) {
            return 4 == d ? this._float32Decode(b, e) : NaN
        },
        doubleFromBytes: function(b, e, d) {
            return 8 == d ? this._float64Decode(b, e) : NaN
        }
    };
    for (var a = [], c = 0; 65 != c; c++)
        a["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charCodeAt(c)] = c;
    _pio.base64encode = function(b) {
        for (var e = [], d = 0; d < b.length; d++) {
            var f = b[d]
              , g = ++d <= b.length ? b[d] : NaN
              , h = ++d <= b.length ? b[d] : NaN
              , l = f >> 2;
            f = (f & 3) << 4 | g >> 4;
            var k = (g & 15) << 2 | h >> 6
              , m = h & 63;
            isNaN(g) ? k = m = 64 : isNaN(h) && (m = 64);
            e.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(l));
            e.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(f));
            e.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(k));
            e.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(m))
        }
        return e.join("")
    }
    ;
    _pio.base64decode = function(b) {
        for (var e = [], d = 0; d < b.length; d++) {
            var f = a[b.charCodeAt(d)]
              , g = ++d < b.length ? a[b.charCodeAt(d)] : 64
              , h = ++d < b.length ? a[b.charCodeAt(d)] : 64
              , l = ++d < b.length ? a[b.charCodeAt(d)] : 64
              , k = (g & 15) << 4 | h >> 2
              , m = (h & 3) << 6 | l;
            e.push(f << 2 | g >> 4);
            64 != h && (e.push(k),
            64 != l && e.push(m))
        }
        return e
    }
}
)();
(function() {
    _pio.achievements = function(a) {
        function c(d, f) {
            var g = new _pio.achievement(d.identifier,d.title,d.description,d.imageurl,d.progress,d.progressgoal,d.lastupdated);
            if ("string" !== typeof e.myAchievements)
                for (var h = 0; h < e.myAchievements.length; h++)
                    e.myAchievements[h].id == g.id && (e.myAchievements[h] = g,
                    e.currentVersion = null);
            if (f)
                for (h = 0; h < e.onCompleteHandlers.length; h++)
                    (0,
                    e.onCompleteHandlers[h])(g);
            return g
        }
        var b = null;
        this.myAchievements = "[ERROR: You tried to access achievements.myAchievements before loading them. You have to call the refresh method first.]";
        this.onCompleteHandlers = [];
        var e = this;
        this.addOnComplete = function(d) {
            if ("function" === typeof d && 1 == d.length)
                e.onCompleteHandlers.push(d);
            else
                throw new PlayerIOError(PlayerIOErrorCode.InvalidArgument,"Expects argument to be a function that takes an achievement as an argument.");
        }
        ;
        this.get = function(d) {
            if ("string" === typeof e.myAchievements)
                return null;
            for (var f = 0; f < e.myAchievements.length; f++)
                if (e.myAchievements[f].id == d)
                    return e.myAchievements[f];
            return null
        }
        ;
        this.refresh = function(d, f) {
            a.achievementsRefresh(b, d, f, function(g) {
                if (b != g.version)
                    if (b = g.version,
                    null == g.achievements || 0 == g.achievements.length)
                        e.myAchievements = [];
                    else {
                        for (var h = [], l = 0; l < g.achievements.length; l++) {
                            var k = g.achievements[l];
                            h.push(new _pio.achievement(k.identifier,k.title,k.description,k.imageurl,k.progress,k.progressgoal,k.lastupdated))
                        }
                        e.myAchievements = h
                    }
            })
        }
        ;
        this.load = function(d, f, g) {
            "object" == typeof d || requests.length ? a.achievementsLoad(d, f, g, function(h) {
                if (null == h || 0 == h.length)
                    return {};
                for (var l = {}, k = 0; k < h.userachievements.length; k++) {
                    for (var m = h.userachievements[k], n = [], p = 0; p < m.achievements.length; p++) {
                        var r = m.achievements[p];
                        n.push(new _pio.achievement(r.identifier,r.title,r.description,r.imageurl,r.progress,r.progressgoal,r.lastupdated))
                    }
                    l[m.userid] = n
                }
                return l
            }) : (d = _pio.error("The first argument to load should be an array: client.achievements.load(['user1', 'user2', ...], ...)"),
            _pio.handleError(d, g, d.code, d.message))
        }
        ;
        this.progressSet = function(d, f, g, h) {
            a.achievementsProgressSet(d, f, g, h, function(l) {
                return c(l.achievement, l.completednow)
            })
        }
        ;
        this.progressAdd = function(d, f, g, h) {
            a.achievementsProgressAdd(d, f, g, h, function(l) {
                return c(l.achievement, l.completednow)
            })
        }
        ;
        this.progressMax = function(d, f, g, h) {
            a.achievementsProgressMax(d, f, g, h, function(l) {
                return c(l.achievement, l.completednow)
            })
        }
        ;
        this.progressComplete = function(d, f, g) {
            a.achievementsProgressComplete(d, f, g, function(h) {
                return c(h.achievement, h.completednow)
            })
        }
    }
    ;
    _pio.achievement = function(a, c, b, e, d, f, g) {
        this.id = a;
        this.title = c;
        this.description = b;
        this.imageUrl = e;
        this.progress = "undefined" === typeof d ? 0 : d;
        this.progressGoal = f;
        this.lastUpdated = new Date(1E3 * g);
        this.progressRatio = this.progress / this.progressGoal;
        this.completed = this.progress == this.progressGoal
    }
}
)();
(function() {
    _pio.playerInsight = function(a) {
        function c(e) {
            b.playersOnline = -1 == e.playersonline ? "[ERROR: The current connection does not have the rights required to read the playersonline variable.]" : e.playersonline;
            b.segments = _pio.convertFromKVArray(e.segments)
        }
        this.playersOnline = "[ERROR: You tried to access playerInsight.playersOnline before loading it. You have to call the refresh method first.]";
        this.segments = {};
        var b = this;
        this.refresh = function(e, d) {
            a.playerInsightRefresh(e, d, function(f) {
                c(f.state)
            })
        }
        ;
        this.setSegments = function(e, d, f) {
            a.playerInsightSetSegments(_pio.convertToSegmentArray(e), d, f, function(g) {
                c(g.state)
            })
        }
        ;
        this.trackInvitedBy = function(e, d, f, g) {
            a.playerInsightTrackInvitedBy(e, d, f, g, function(h) {})
        }
        ;
        this.trackEvent = function(e, d, f, g) {
            a.playerInsightTrackEvents([{
                eventtype: e,
                value: d
            }], f, g, function(h) {})
        }
        ;
        this.trackExternalPayment = function(e, d, f, g) {
            a.playerInsightTrackExternalPayment(e, d, f, g, function(h) {})
        }
        ;
        this.sessionKeepAlive = function(e, d) {
            a.playerInsightSessionKeepAlive(e, d, function(f) {})
        }
    }
}
)();
(function() {
    _pio.leaderboards = function(a, c) {
        this.set = function(b, e, d, f, g) {
            a.leaderboardsSet(b, e, d, f, g, function(h) {
                return new _pio.leaderboardEntry(h.leaderboardentry.userid,h.leaderboardentry.rank,h.leaderboardentry.score)
            })
        }
        ;
        this.count = function(b, e, d, f) {
            a.leaderboardsCount(b, e, d, f, function(g) {
                return g.count
            })
        }
        ;
        this.getTop = function(b, e, d, f, g, h, l) {
            a.leaderboardsGet(b, e, d, f, null, g, h, l, function(k) {
                if (null == k || null == k.leaderboardentry || 0 == k.leaderboardentry.length)
                    return [];
                for (var m = [], n = 0; n < k.leaderboardentry.length; n++)
                    m.push(new _pio.leaderboardEntry(k.leaderboardentry[n].userid,k.leaderboardentry[n].rank,k.leaderboardentry[n].score));
                return m
            })
        }
        ;
        this.getNeighbourhood = function(b, e, d, f, g, h, l) {
            a.leaderboardsGet(b, e, d, f, c, g, h, l, function(k) {
                if (null == k || null == k.leaderboardentry || 0 == k.leaderboardentry.length)
                    return [];
                for (var m = [], n = 0; n < k.leaderboardentry.length; n++)
                    m.push(new _pio.leaderboardEntry(k.leaderboardentry[n].userid,k.leaderboardentry[n].rank,k.leaderboardentry[n].score));
                return m
            })
        }
    }
    ;
    _pio.leaderboardEntry = function(a, c, b) {
        this.userId = a;
        this.rank = c;
        this.score = b
    }
}
)();
(function() {
    _pio.oneScore = function(a) {
        this.percentile = "[ERROR: You tried to access oneScore.percentile before loading the OneScore. You have to call the refresh method first.]";
        this.score = "[ERROR: You tried to access oneScore.score before loading the OneScore. You have to call the refresh method first.]";
        this.topRank = "[ERROR: You tried to access oneScore.topRank before loading the OneScore. You have to call the refresh method first.]";
        var c = this;
        this.refresh = function(b, e) {
            a.oneScoreRefresh(b, e, function(d) {
                d = new _pio.oneScoreValue(d.onescore.percentile,d.onescore.score,d.onescore.toprank);
                c.percentile = d.percentile;
                c.score = d.score;
                c.topRank = d.toprank
            })
        }
        ;
        this.set = function(b, e, d) {
            a.oneScoreSet(b, e, d, function(f) {
                f = new _pio.oneScoreValue(f.onescore.percentile,f.onescore.score,f.onescore.toprank);
                c.percentile = f.percentile;
                c.score = f.score;
                c.topRank = f.toprank;
                return f
            })
        }
        ;
        this.add = function(b, e, d) {
            a.oneScoreAdd(b, e, d, function(f) {
                f = new _pio.oneScoreValue(f.onescore.percentile,f.onescore.score,f.onescore.toprank);
                c.percentile = f.percentile;
                c.score = f.score;
                c.topRank = f.toprank;
                return f
            })
        }
        ;
        this.load = function(b, e, d) {
            if ("object" == typeof b || requests.length)
                a.oneScoreLoad(b, e, d, function(f) {
                    if (null == f || null == f.onescores || 0 == f.onescores.length)
                        return [];
                    for (var g = [], h = 0, l = 0; l < b.length; l++) {
                        var k = f.onescores[h];
                        k && b[l] == k.userid ? (g.push(new _pio.oneScoreValue(k.percentile,k.score,k.toprank)),
                        h++) : g.push(null)
                    }
                    return g
                });
            else
                e = _pio.error("The first argument to load should be an array: client.oneScore.load(['user1', 'user2', ...], ...)"),
                _pio.handleError(e, d, e.code, e.message)
        }
    }
    ;
    _pio.oneScoreValue = function(a, c, b) {
        this.percentile = "undefined" === typeof a ? 0 : a;
        this.score = "undefined" === typeof c ? 0 : c;
        this.topRank = "undefined" === typeof b ? 0 : b
    }
}
)();
(function() {
    _pio.notifications = function(a) {
        function c(f) {
            if (f.version != d) {
                var g = [];
                if (f.endpoints)
                    for (var h = 0; h != f.endpoints.length; h++) {
                        var l = f.endpoints[h];
                        g[h] = new _pio.notificationEndpoint(l.type,l.identifier,_pio.convertFromKVArray(l.configuration),l.enabled ? !0 : !1)
                    }
                d = f.version;
                e.myEndpoints = g
            }
        }
        function b(f) {
            var g = [];
            if (f && 0 < f.length)
                for (var h = 0; h != f.length; h++) {
                    var l = f[h];
                    l.type && l.identifier && g.push({
                        type: l.type,
                        identifier: l.identifier
                    })
                }
            return g
        }
        this.myEndpoints = "[ERROR: You tried to access notifications.myEndpoints before calling refresh.]";
        var e = this
          , d = "";
        this.refresh = function(f, g) {
            a.notificationsRefresh(d, f, g, c)
        }
        ;
        this.registerEndpoint = function(f, g, h, l, k, m) {
            var n;
            a: {
                if ("" != d)
                    for (n = 0; n != e.myEndpoints.length; n++) {
                        var p = e.myEndpoints[n];
                        if (p.type == f && p.identifier == g) {
                            n = p;
                            break a
                        }
                    }
                n = null
            }
            (p = null == n || n.enabled != l) || (p = JSON.stringify(n.configuration) != JSON.stringify(h));
            p ? a.notificationsRegisterEndpoints(d, [{
                type: f,
                identifier: g,
                configuration: _pio.convertToKVArray(h),
                enabled: l
            }], k, m, c) : k && k()
        }
        ;
        this.toggleEndpoints = function(f, g, h, l) {
            f = b(f);
            0 < f.length ? a.notificationsToggleEndpoints(d, f, g ? !0 : !1, h, l, c) : h && h()
        }
        ;
        this.deleteEndpoints = function(f, g, h) {
            f = b(f);
            0 < f.length ? a.notificationsDeleteEndpoints(d, f, g, h, c) : g && g()
        }
        ;
        this.send = function(f, g, h) {
            for (var l = [], k = 0; k != f.length; k++) {
                var m = f[k]
                  , n = {
                    recipient: m.recipientUserId,
                    endpointtype: m.endpointType,
                    data: {}
                };
                0 != (n.recipient + "").length && 0 != (n.endpointtype + "").length || console.log("error");
                for (var p in m)
                    "recipientUserId" != p && "endpointType" != p && (n.data[p] = m[p]);
                l[k] = n
            }
            0 < l.length ? a.notificationsSend(l, g, h, null) : g && g()
        }
    }
    ;
    _pio.notificationEndpoint = function(a, c, b, e) {
        this.type = a;
        this.identifier = c;
        this.configuration = b;
        this.enabled = e
    }
}
)();
(function() {
    _pio.publishingNetwork = function(a, c) {
        var b = this;
        this.profiles = new _pio.publishingNetworkProfiles(a);
        this.payments = new _pio.publishingNetworkPayments(a);
        this.relations = new _pio.publishingNetworkRelations(a,c,this);
        this.userToken = "[ERROR: you tried to access publishingNetwork.userToken before calling publishingNetwork.refresh(callback)]";
        this.refresh = function(e, d) {
            a.socialRefresh(e, d, function(f) {
                b.userToken = f.myprofile.usertoken;
                b.profiles.myProfile = new _pio.publishingNetworkProfile(f.myprofile);
                "undefined" == typeof _pio.friendLookup && (_pio.friendLookup = {},
                _pio.blockedLookup = {});
                var g = _pio.friendLookup[b.profiles.myProfile.userId]
                  , h = _pio.blockedLookup[b.profiles.myProfile.userId];
                g || h || (g = _pio.friendLookup[b.profiles.myProfile.userId] = {},
                h = _pio.blockedLookup[b.profiles.myProfile.userId] = {});
                b.relations.friends = [];
                for (var l = 0; l != f.friends.length; l++) {
                    var k = new _pio.publishingNetworkProfile(f.friends[l]);
                    b.relations.friends.push(k);
                    g[k.userId] = !0
                }
                for (l = 0; l != f.blocked.length; l++)
                    h[f.blocked[l]] = !0
            })
        }
    }
    ;
    _pio.showDialog = function(a, c, b, e) {
        if ("undefined" == typeof window.PublishingNetwork)
            throw new PlayerIOError(PlayerIOErrorCode.PublishingNetworkNotAvailable,"PublishingNetwork.js was not found on the current page. You have to include the 'piocdn.com/publishingnetwork.js' on the containing page to show dialogs. See http://playerio.com/documentation/ for more information.");
        b.__apitoken__ = c.token;
        window.PublishingNetwork.dialog(a, b, e)
    }
}
)();
(function() {
    _pio.publishingNetworkPayments = function(a) {
        this.showBuyCoinsDialog = function(c, b, e, d) {
            b || (b = {});
            b.coinamount = c;
            a.payVaultPaymentInfo("publishingnetwork", _pio.convertToKVArray(b), null, function(f) {
                _pio.showDialog("buy", a, f, function(g) {
                    g.error ? d(new PlayerIOError(PlayerIOErrorCode.GeneralError,g.error)) : e(g)
                })
            }, d, function(f) {
                return _pio.convertFromKVArray(f.providerarguments)
            })
        }
        ;
        this.showBuyItemsDialog = function(c, b, e, d) {
            a.payVaultPaymentInfo("publishingnetwork", _pio.convertToKVArray(b || {}), _pio.convertBuyItems(c), function(f) {
                _pio.showDialog("buy", a, f, function(g) {
                    g.error ? d(new PlayerIOError(PlayerIOErrorCode.GeneralError,g.error)) : e(g)
                })
            }, d, function(f) {
                return _pio.convertFromKVArray(f.providerarguments)
            })
        }
    }
}
)();
(function() {
    _pio.publishingNetworkProfiles = function(a) {
        this.myProfile = "[ERROR: you tried to access publishingNetworkProfiles.myProfile before calling publishingNetwork.refresh(callback)]";
        this.showProfile = function(c, b) {
            _pio.showDialog("profile", a, {
                userId: c
            }, b)
        }
        ;
        this.loadProfiles = function(c, b, e) {
            a.socialLoadProfiles(c, b, e, function(d) {
                for (var f = [], g = 0; g != c.length; g++) {
                    var h = c[g];
                    f[g] = null;
                    for (var l = 0; l != d.profiles.length; l++) {
                        var k = d.profiles[l];
                        if (k && k.userid == h) {
                            f[g] = new _pio.publishingNetworkProfile(d.profiles[l]);
                            break
                        }
                    }
                }
                return f
            })
        }
    }
    ;
    _pio.publishingNetworkProfile = function(a) {
        this.userId = a.userid;
        this.displayName = a.displayname;
        this.avatarUrl = a.avatarurl;
        this.lastOnline = new Date(a.lastonline);
        this.countryCode = a.countrycode
    }
}
)();
(function() {
    _pio.publishingNetworkRelations = function(a, c, b) {
        this.friends = "[ERROR: you tried to access publishingNetworkRelations.friends before calling publishingNetwork.refresh(callback)]";
        this.isFriend = function(e) {
            if ("undefined" != typeof _pio.friendLookup && "undefined" != typeof _pio.friendLookup[c])
                return _pio.friendLookup[c][e] || !1;
            throw new PlayerIOError(PlayerIOErrorCode.PublishingNetworkNotLoaded,"Cannot access profile, friends, ignored before Publishing Network has been loaded. Please refresh Publishing Network first");
        }
        ;
        this.isBlocked = function(e) {
            if ("undefined" != typeof _pio.blockedLookup && "undefined" != typeof _pio.blockedLookup[c])
                return _pio.blockedLookup[c][e] || !1;
            throw new PlayerIOError(PlayerIOErrorCode.PublishingNetworkNotLoaded,"Cannot access profile, friends, ignored before Publishing Network has been loaded. Please refresh Publishing Network first");
        }
        ;
        this.showRequestFriendshipDialog = function(e, d) {
            _pio.showDialog("requestfriendship", a, {
                userId: e
            }, d)
        }
        ;
        this.showRequestBlockUserDialog = function(e, d) {
            _pio.showDialog("requestblockuser", a, {
                userId: e
            }, function() {
                b.refresh(function() {
                    d && d()
                }, function() {
                    d && d()
                })
            })
        }
        ;
        this.showFriendsManager = function(e) {
            _pio.showDialog("friendsmanager", a, {}, function(d) {
                d.updated ? b.refresh(function() {
                    e && e()
                }, function() {
                    e && e()
                }) : e && e()
            })
        }
        ;
        this.showBlockedUsersManager = function(e) {
            _pio.showDialog("blockedusersmanager", a, {}, function(d) {
                d.updated ? b.refresh(function() {
                    e && e()
                }, function() {
                    e && e()
                }) : e && e()
            })
        }
    }
}
)();
(function() {
    function a(w) {
        w = String(w);
        return w.charAt(0).toUpperCase() + w.slice(1)
    }
    function c(w, y) {
        var q = -1
          , u = w ? w.length : 0;
        if ("number" == typeof u && -1 < u && u <= r)
            for (; ++q < u; )
                y(w[q], q, w);
        else
            e(w, y)
    }
    function b(w) {
        w = String(w).replace(/^ +| +$/g, "");
        return /^(?:webOS|i(?:OS|P))/.test(w) ? w : a(w)
    }
    function e(w, y) {
        for (var q in w)
            v.call(w, q) && y(w[q], q, w)
    }
    function d(w) {
        return null == w ? a(w) : t.call(w).slice(8, -1)
    }
    function f(w, y) {
        var q = null != w ? typeof w[y] : "number";
        return !/^(?:boolean|number|string|undefined)$/.test(q) && ("object" == q ? !!w[y] : !0)
    }
    function g(w) {
        return String(w).replace(/([ -])(?!$)/g, "$1?")
    }
    function h(w, y) {
        var q = null;
        c(w, function(u, A) {
            q = y(q, u, A, w)
        });
        return q
    }
    function l(w) {
        function y(N) {
            return h(N, function(K, I) {
                var P = I.pattern || g(I);
                !K && (K = RegExp("\\b" + P + " *\\d+[.\\w_]*", "i").exec(w) || RegExp("\\b" + P + " *\\w+-[\\w]*", "i").exec(w) || RegExp("\\b" + P + "(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)", "i").exec(w)) && ((K = String(I.label && !RegExp(P, "i").test(I.label) ? I.label : K).split("/"))[1] && !/[\d.]+/.test(K[0]) && (K[0] += " " + K[1]),
                I = I.label || I,
                K = b(K[0].replace(RegExp(P, "i"), I).replace(RegExp("; *(?:" + I + "[_-])?", "i"), " ").replace(RegExp("(" + I + ")[-_.]?(\\w)", "i"), "$1 $2")));
                return K
            })
        }
        function q(N) {
            return h(N, function(K, I) {
                return K || (RegExp(I + "(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)", "i").exec(w) || 0)[1] || null
            })
        }
        var u = m
          , A = w && "object" == typeof w && "String" != d(w);
        A && (u = w,
        w = null);
        var F = u.navigator || {}
          , C = F.userAgent || "";
        w || (w = C);
        var L = A ? !!F.likeChrome : /\bChrome\b/.test(w) && !/internal|\n/i.test(t.toString())
          , J = A ? "Object" : "ScriptBridgingProxyObject"
          , M = A ? "Object" : "Environment"
          , O = A && u.java ? "JavaPackage" : d(u.java)
          , U = A ? "Object" : "RuntimeObject";
        M = (O = /\bJava/.test(O) && u.java) && d(u.environment) == M;
        var ca = O ? "a" : "\u03b1", da = O ? "b" : "\u03b2", Y = u.document || {}, S = u.operamini || u.opera, V = z.test(V = A && S ? S["[[Class]]"] : d(S)) ? V : S = null, x, W = w;
        A = [];
        var X = null
          , T = w == C;
        C = T && S && "function" == typeof S.version && S.version();
        var G = function(N) {
            return h(N, function(K, I) {
                return K || RegExp("\\b" + (I.pattern || g(I)) + "\\b", "i").exec(w) && (I.label || I)
            })
        }([{
            label: "EdgeHTML",
            pattern: "Edge"
        }, "Trident", {
            label: "WebKit",
            pattern: "AppleWebKit"
        }, "iCab", "Presto", "NetFront", "Tasman", "KHTML", "Gecko"])
          , D = function(N) {
            return h(N, function(K, I) {
                return K || RegExp("\\b" + (I.pattern || g(I)) + "\\b", "i").exec(w) && (I.label || I)
            })
        }(["Adobe AIR", "Arora", "Avant Browser", "Breach", "Camino", "Electron", "Epiphany", "Fennec", "Flock", "Galeon", "GreenBrowser", "iCab", "Iceweasel", "K-Meleon", "Konqueror", "Lunascape", "Maxthon", {
            label: "Microsoft Edge",
            pattern: "Edge"
        }, "Midori", "Nook Browser", "PaleMoon", "PhantomJS", "Raven", "Rekonq", "RockMelt", {
            label: "Samsung Internet",
            pattern: "SamsungBrowser"
        }, "SeaMonkey", {
            label: "Silk",
            pattern: "(?:Cloud9|Silk-Accelerated)"
        }, "Sleipnir", "SlimBrowser", {
            label: "SRWare Iron",
            pattern: "Iron"
        }, "Sunrise", "Swiftfox", "Waterfox", "WebPositive", "Opera Mini", {
            label: "Opera Mini",
            pattern: "OPiOS"
        }, "Opera", {
            label: "Opera",
            pattern: "OPR"
        }, "Chrome", {
            label: "Chrome Mobile",
            pattern: "(?:CriOS|CrMo)"
        }, {
            label: "Firefox",
            pattern: "(?:Firefox|Minefield)"
        }, {
            label: "Firefox for iOS",
            pattern: "FxiOS"
        }, {
            label: "IE",
            pattern: "IEMobile"
        }, {
            label: "IE",
            pattern: "MSIE"
        }, "Safari"])
          , H = y([{
            label: "BlackBerry",
            pattern: "BB10"
        }, "BlackBerry", {
            label: "Galaxy S",
            pattern: "GT-I9000"
        }, {
            label: "Galaxy S2",
            pattern: "GT-I9100"
        }, {
            label: "Galaxy S3",
            pattern: "GT-I9300"
        }, {
            label: "Galaxy S4",
            pattern: "GT-I9500"
        }, {
            label: "Galaxy S5",
            pattern: "SM-G900"
        }, {
            label: "Galaxy S6",
            pattern: "SM-G920"
        }, {
            label: "Galaxy S6 Edge",
            pattern: "SM-G925"
        }, {
            label: "Galaxy S7",
            pattern: "SM-G930"
        }, {
            label: "Galaxy S7 Edge",
            pattern: "SM-G935"
        }, "Google TV", "Lumia", "iPad", "iPod", "iPhone", "Kindle", {
            label: "Kindle Fire",
            pattern: "(?:Cloud9|Silk-Accelerated)"
        }, "Nexus", "Nook", "PlayBook", "PlayStation Vita", "PlayStation", "TouchPad", "Transformer", {
            label: "Wii U",
            pattern: "WiiU"
        }, "Wii", "Xbox One", {
            label: "Xbox 360",
            pattern: "Xbox"
        }, "Xoom"])
          , Q = function(N) {
            return h(N, function(K, I, P) {
                return K || (I[H] || I[/^[a-z]+(?: +[a-z]+\b)*/i.exec(H)] || RegExp("\\b" + g(P) + "(?:\\b|\\w*\\d)", "i").exec(w)) && P
            })
        }({
            Apple: {
                iPad: 1,
                iPhone: 1,
                iPod: 1
            },
            Archos: {},
            Amazon: {
                Kindle: 1,
                "Kindle Fire": 1
            },
            Asus: {
                Transformer: 1
            },
            "Barnes & Noble": {
                Nook: 1
            },
            BlackBerry: {
                PlayBook: 1
            },
            Google: {
                "Google TV": 1,
                Nexus: 1
            },
            HP: {
                TouchPad: 1
            },
            HTC: {},
            LG: {},
            Microsoft: {
                Xbox: 1,
                "Xbox One": 1
            },
            Motorola: {
                Xoom: 1
            },
            Nintendo: {
                "Wii U": 1,
                Wii: 1
            },
            Nokia: {
                Lumia: 1
            },
            Samsung: {
                "Galaxy S": 1,
                "Galaxy S2": 1,
                "Galaxy S3": 1,
                "Galaxy S4": 1
            },
            Sony: {
                PlayStation: 1,
                "PlayStation Vita": 1
            }
        })
          , E = function(N) {
            return h(N, function(K, I) {
                var P = I.pattern || g(I);
                if (!K && (K = RegExp("\\b" + P + "(?:/[\\d.]+|[ \\w.]*)", "i").exec(w))) {
                    var R = K
                      , Z = I.label || I
                      , aa = {
                        "10.0": "10",
                        "6.4": "10 Technical Preview",
                        "6.3": "8.1",
                        "6.2": "8",
                        "6.1": "Server 2008 R2 / 7",
                        "6.0": "Server 2008 / Vista",
                        "5.2": "Server 2003 / XP 64-bit",
                        "5.1": "XP",
                        "5.01": "2000 SP1",
                        "5.0": "2000",
                        "4.0": "NT",
                        "4.90": "ME"
                    };
                    P && Z && /^Win/i.test(R) && !/^Windows Phone /i.test(R) && (aa = aa[/[\d.]+$/.exec(R)]) && (R = "Windows " + aa);
                    R = String(R);
                    P && Z && (R = R.replace(RegExp(P, "i"), Z));
                    K = R = b(R.replace(/ ce$/i, " CE").replace(/\bhpw/i, "web").replace(/\bMacintosh\b/, "Mac OS").replace(/_PowerPC\b/i, " OS").replace(/\b(OS X) [^ \d]+/i, "$1").replace(/\bMac (OS X)\b/, "$1").replace(/\/(\d)/, " $1").replace(/_/g, ".").replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, "").replace(/\bx86\.64\b/gi, "x86_64").replace(/\b(Windows Phone) OS\b/, "$1").replace(/\b(Chrome OS \w+) [\d.]+\b/, "$1").split(" on ")[0])
                }
                return K
            })
        }(["Windows Phone", "Android", "CentOS", {
            label: "Chrome OS",
            pattern: "CrOS"
        }, "Debian", "Fedora", "FreeBSD", "Gentoo", "Haiku", "Kubuntu", "Linux Mint", "OpenBSD", "Red Hat", "SuSE", "Ubuntu", "Xubuntu", "Cygwin", "Symbian OS", "hpwOS", "webOS ", "webOS", "Tablet OS", "Tizen", "Linux", "Mac OS X", "Macintosh", "Mac", "Windows 98;", "Windows "]);
        G && (G = [G]);
        Q && !H && (H = y([Q]));
        if (x = /\bGoogle TV\b/.exec(H))
            H = x[0];
        /\bSimulator\b/i.test(w) && (H = (H ? H + " " : "") + "Simulator");
        "Opera Mini" == D && /\bOPiOS\b/.test(w) && A.push("running in Turbo/Uncompressed mode");
        "IE" == D && /\blike iPhone OS\b/.test(w) ? (x = l(w.replace(/like iPhone OS/, "")),
        Q = x.manufacturer,
        H = x.product) : /^iP/.test(H) ? (D || (D = "Safari"),
        E = "iOS" + ((x = / OS ([\d_]+)/i.exec(w)) ? " " + x[1].replace(/_/g, ".") : "")) : "Konqueror" != D || /buntu/i.test(E) ? Q && "Google" != Q && (/Chrome/.test(D) && !/\bMobile Safari\b/i.test(w) || /\bVita\b/.test(H)) || /\bAndroid\b/.test(E) && /^Chrome/.test(D) && /\bVersion\//i.test(w) ? (D = "Android Browser",
        E = /\bAndroid\b/.test(E) ? E : "Android") : "Silk" == D ? (/\bMobi/i.test(w) || (E = "Android",
        A.unshift("desktop mode")),
        /Accelerated *= *true/i.test(w) && A.unshift("accelerated")) : "PaleMoon" == D && (x = /\bFirefox\/([\d.]+)\b/.exec(w)) ? A.push("identifying as Firefox " + x[1]) : "Firefox" == D && (x = /\b(Mobile|Tablet|TV)\b/i.exec(w)) ? (E || (E = "Firefox OS"),
        H || (H = x[1])) : !D || (x = !/\bMinefield\b/i.test(w) && /\b(?:Firefox|Safari)\b/.exec(D)) ? (D && !H && /[\/,]|^[^(]+?\)/.test(w.slice(w.indexOf(x + "/") + 8)) && (D = null),
        (x = H || Q || E) && (H || Q || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(E)) && (D = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(E) ? E : x) + " Browser")) : "Electron" == D && (x = (/\bChrome\/([\d.]+)\b/.exec(w) || 0)[1]) && A.push("Chromium " + x) : E = "Kubuntu";
        C || (C = q(["(?:Cloud9|CriOS|CrMo|Edge|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$))", "Version", g(D), "(?:Firefox|Minefield|NetFront)"]));
        if (x = "iCab" == G && 3 < parseFloat(C) && "WebKit" || /\bOpera\b/.test(D) && (/\bOPR\b/.test(w) ? "Blink" : "Presto") || /\b(?:Midori|Nook|Safari)\b/i.test(w) && !/^(?:Trident|EdgeHTML)$/.test(G) && "WebKit" || !G && /\bMSIE\b/i.test(w) && ("Mac OS" == E ? "Tasman" : "Trident") || "WebKit" == G && /\bPlayStation\b(?! Vita\b)/i.test(D) && "NetFront")
            G = [x];
        "IE" == D && (x = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(w) || 0)[1]) ? (D += " Mobile",
        E = "Windows Phone " + (/\+$/.test(x) ? x : x + ".x"),
        A.unshift("desktop mode")) : /\bWPDesktop\b/i.test(w) ? (D = "IE Mobile",
        E = "Windows Phone 8.x",
        A.unshift("desktop mode"),
        C || (C = (/\brv:([\d.]+)/.exec(w) || 0)[1])) : "IE" != D && "Trident" == G && (x = /\brv:([\d.]+)/.exec(w)) && (D && A.push("identifying as " + D + (C ? " " + C : "")),
        D = "IE",
        C = x[1]);
        if (T) {
            if (f(u, "global"))
                if (O && (x = O.lang.System,
                W = x.getProperty("os.arch"),
                E = E || x.getProperty("os.name") + " " + x.getProperty("os.version")),
                M) {
                    try {
                        C = u.require("ringo/engine").version.join("."),
                        D = "RingoJS"
                    } catch (N) {
                        (x = u.system) && x.global.system == u.system && (D = "Narwhal",
                        E || (E = x[0].os || null))
                    }
                    D || (D = "Rhino")
                } else
                    "object" == typeof u.process && !u.process.browser && (x = u.process) && ("object" == typeof x.versions && ("string" == typeof x.versions.electron ? (A.push("Node " + x.versions.node),
                    D = "Electron",
                    C = x.versions.electron) : "string" == typeof x.versions.nw && (A.push("Chromium " + C, "Node " + x.versions.node),
                    D = "NW.js",
                    C = x.versions.nw)),
                    D || (D = "Node.js",
                    W = x.arch,
                    E = x.platform,
                    C = (C = /[\d.]+/.exec(x.version)) ? C[0] : null));
            else
                d(x = u.runtime) == J ? (D = "Adobe AIR",
                E = x.flash.system.Capabilities.os) : d(x = u.phantom) == U ? (D = "PhantomJS",
                C = (x = x.version || null) && x.major + "." + x.minor + "." + x.patch) : "number" == typeof Y.documentMode && (x = /\bTrident\/(\d+)/i.exec(w)) ? (C = [C, Y.documentMode],
                (x = +x[1] + 4) != C[1] && (A.push("IE " + C[1] + " mode"),
                G && (G[1] = ""),
                C[1] = x),
                C = "IE" == D ? String(C[1].toFixed(1)) : C[0]) : "number" == typeof Y.documentMode && /^(?:Chrome|Firefox)\b/.test(D) && (A.push("masking as " + D + " " + C),
                D = "IE",
                C = "11.0",
                G = ["Trident"],
                E = "Windows");
            E = E && b(E)
        }
        C && (x = /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(C) || /(?:alpha|beta)(?: ?\d)?/i.exec(w + ";" + (T && F.appMinorVersion)) || /\bMinefield\b/i.test(w) && "a") && (X = /b/i.test(x) ? "beta" : "alpha",
        C = C.replace(RegExp(x + "\\+?$"), "") + ("beta" == X ? da : ca) + (/\d+\+?/.exec(x) || ""));
        if ("Fennec" == D || "Firefox" == D && /\b(?:Android|Firefox OS)\b/.test(E))
            D = "Firefox Mobile";
        else if ("Maxthon" == D && C)
            C = C.replace(/\.[\d.]+/, ".x");
        else if (/\bXbox\b/i.test(H))
            "Xbox 360" == H && (E = null),
            "Xbox 360" == H && /\bIEMobile\b/.test(w) && A.unshift("mobile mode");
        else if (!/^(?:Chrome|IE|Opera)$/.test(D) && (!D || H || /Browser|Mobi/.test(D)) || "Windows CE" != E && !/Mobi/i.test(w))
            if ("IE" == D && T)
                try {
                    null === u.external && A.unshift("platform preview")
                } catch (N) {
                    A.unshift("embedded")
                }
            else
                (/\bBlackBerry\b/.test(H) || /\bBB10\b/.test(w)) && (x = (RegExp(H.replace(/ +/g, " *") + "/([.\\d]+)", "i").exec(w) || 0)[1] || C) ? (x = [x, /BB10/.test(w)],
                E = (x[1] ? (H = null,
                Q = "BlackBerry") : "Device Software") + " " + x[0],
                C = null) : this != e && "Wii" != H && (T && S || /Opera/.test(D) && /\b(?:MSIE|Firefox)\b/i.test(w) || "Firefox" == D && /\bOS X (?:\d+\.){2,}/.test(E) || "IE" == D && (E && !/^Win/.test(E) && 5.5 < C || /\bWindows XP\b/.test(E) && 8 < C || 8 == C && !/\bTrident\b/.test(w))) && !z.test(x = l.call(e, w.replace(z, "") + ";")) && x.name && (x = "ing as " + x.name + ((x = x.version) ? " " + x : ""),
                z.test(D) ? (/\bIE\b/.test(x) && "Mac OS" == E && (E = null),
                x = "identify" + x) : (x = "mask" + x,
                D = V ? b(V.replace(/([a-z])([A-Z])/g, "$1 $2")) : "Opera",
                /\bIE\b/.test(x) && (E = null),
                T || (C = null)),
                G = ["Presto"],
                A.push(x));
        else
            D += " Mobile";
        if (x = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(w) || 0)[1]) {
            x = [parseFloat(x.replace(/\.(\d)$/, ".0$1")), x];
            if ("Safari" == D && "+" == x[1].slice(-1))
                D = "WebKit Nightly",
                X = "alpha",
                C = x[1].slice(0, -1);
            else if (C == x[1] || C == (x[2] = (/\bSafari\/([\d.]+\+?)/i.exec(w) || 0)[1]))
                C = null;
            x[1] = (/\bChrome\/([\d.]+)/i.exec(w) || 0)[1];
            537.36 == x[0] && 537.36 == x[2] && 28 <= parseFloat(x[1]) && "WebKit" == G && (G = ["Blink"]);
            T && (L || x[1]) ? (G && (G[1] = "like Chrome"),
            x = x[1] || (x = x[0],
            530 > x ? 1 : 532 > x ? 2 : 532.05 > x ? 3 : 533 > x ? 4 : 534.03 > x ? 5 : 534.07 > x ? 6 : 534.1 > x ? 7 : 534.13 > x ? 8 : 534.16 > x ? 9 : 534.24 > x ? 10 : 534.3 > x ? 11 : 535.01 > x ? 12 : 535.02 > x ? "13+" : 535.07 > x ? 15 : 535.11 > x ? 16 : 535.19 > x ? 17 : 536.05 > x ? 18 : 536.1 > x ? 19 : 537.01 > x ? 20 : 537.11 > x ? "21+" : 537.13 > x ? 23 : 537.18 > x ? 24 : 537.24 > x ? 25 : 537.36 > x ? 26 : "Blink" != G ? "27" : "28")) : (G && (G[1] = "like Safari"),
            x = (x = x[0],
            400 > x ? 1 : 500 > x ? 2 : 526 > x ? 3 : 533 > x ? 4 : 534 > x ? "4+" : 535 > x ? 5 : 537 > x ? 6 : 538 > x ? 7 : 601 > x ? 8 : "8"));
            G && (G[1] += " " + (x += "number" == typeof x ? ".x" : /[.+]/.test(x) ? "" : "+"));
            "Safari" == D && (!C || 45 < parseInt(C)) && (C = x)
        }
        "Opera" == D && (x = /\bzbov|zvav$/.exec(E)) ? (D += " ",
        A.unshift("desktop mode"),
        "zvav" == x ? (D += "Mini",
        C = null) : D += "Mobile",
        E = E.replace(RegExp(" *" + x + "$"), "")) : "Safari" == D && /\bChrome\b/.exec(G && G[1]) && (A.unshift("desktop mode"),
        D = "Chrome Mobile",
        C = null,
        /\bOS X\b/.test(E) ? (Q = "Apple",
        E = "iOS 4.3+") : E = null);
        C && 0 == C.indexOf(x = /[\d.]+$/.exec(E)) && -1 < w.indexOf("/" + x + "-") && (E = String(E.replace(x, "")).replace(/^ +| +$/g, ""));
        G && !/\b(?:Avant|Nook)\b/.test(D) && (/Browser|Lunascape|Maxthon/.test(D) || "Safari" != D && /^iOS/.test(E) && /\bSafari\b/.test(G[1]) || /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|Web)/.test(D) && G[1]) && (x = G[G.length - 1]) && A.push(x);
        A.length && (A = ["(" + A.join("; ") + ")"]);
        Q && H && 0 > H.indexOf(Q) && A.push("on " + Q);
        H && A.push((/^on /.test(A[A.length - 1]) ? "" : "on ") + H);
        if (E) {
            var ba = (x = / ([\d.+]+)$/.exec(E)) && "/" == E.charAt(E.length - x[0].length - 1);
            E = {
                architecture: 32,
                family: x && !ba ? E.replace(x[0], "") : E,
                version: x ? x[1] : null,
                toString: function() {
                    var N = this.version;
                    return this.family + (N && !ba ? " " + N : "") + (64 == this.architecture ? " 64-bit" : "")
                }
            }
        }
        (x = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(W)) && !/\bi686\b/i.test(W) ? (E && (E.architecture = 64,
        E.family = E.family.replace(RegExp(" *" + x), "")),
        D && (/\bWOW64\b/i.test(w) || T && /\w(?:86|32)$/.test(F.cpuClass || F.platform) && !/\bWin64; x64\b/i.test(w)) && A.unshift("32-bit")) : E && /^OS X/.test(E.family) && "Chrome" == D && 39 <= parseFloat(C) && (E.architecture = 64);
        w || (w = null);
        u = {};
        u.description = w;
        u.layout = G && G[0];
        u.manufacturer = Q;
        u.name = D;
        u.prerelease = X;
        u.product = H;
        u.ua = w;
        u.version = D && C;
        u.os = E || {
            architecture: null,
            family: null,
            version: null,
            toString: function() {
                return "null"
            }
        };
        u.parse = l;
        u.toString = function() {
            return this.description || ""
        }
        ;
        u.version && A.unshift(C);
        u.name && A.unshift(D);
        E && D && (E != String(E).split(" ")[0] || E != D.split(" ")[0] && !H) && A.push(H ? "(" + E + ")" : "on " + E);
        A.length && (u.description = A.join(" "));
        return u
    }
    var k = {
        "function": !0,
        object: !0
    }
      , m = k[typeof window] && window || this
      , n = k[typeof exports] && exports;
    k = k[typeof module] && module && !module.nodeType && module;
    var p = n && k && "object" == typeof global && global;
    !p || p.global !== p && p.window !== p && p.self !== p || (m = p);
    var r = Math.pow(2, 53) - 1
      , z = /\bOpera/;
    p = Object.prototype;
    var v = p.hasOwnProperty
      , t = p.toString
      , B = l();
    "function" == typeof define && "object" == typeof define.amd && define.amd ? (m.platform = B,
    define(function() {
        return B
    })) : n && k ? e(B, function(w, y) {
        n[y] = w
    }) : m.platform = B
}
).call(this);
function buildIOSMeta() {
    for (var a = [{
        name: "viewport",
        content: "width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
    }, {
        name: "apple-mobile-web-app-capable",
        content: "yes"
    }, {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black"
    }], c = 0; c < a.length; c++) {
        var b = document.createElement("meta");
        b.name = a[c].name;
        b.content = a[c].content;
        var e = window.document.head.querySelector('meta[name="' + b.name + '"]');
        e && e.parentNode.removeChild(e);
        window.document.head.appendChild(b)
    }
}
function hideIOSFullscreenPanel() {
    jQuery(".xxx-ios-fullscreen-message").css("display", "none");
    jQuery(".xxx-ios-fullscreen-scroll").css("display", "none");
    jQuery(".xxx-game-iframe-full").removeClass("xxx-game-iframe-iphone-se")
}
function buildIOSFullscreenPanel() {
    jQuery("body").append('<div class="xxx-ios-fullscreen-message"><div class="xxx-ios-fullscreen-swipe"></div></div><div class="xxx-ios-fullscreen-scroll"></div>')
}
function showIOSFullscreenPanel() {
    jQuery(".xxx-ios-fullscreen-message").css("display", "block");
    jQuery(".xxx-ios-fullscreen-scroll").css("display", "block")
}
function __iosResize() {
    window.scrollTo(0, 0);
    console.log(window.devicePixelRatio);
    console.log(window.innerWidth);
    console.log(window.innerHeight);
    if ("iPhone" === platform.product)
        switch (window.devicePixelRatio) {
        case 2:
            switch (window.innerWidth) {
            case 568:
                320 !== window.innerHeight && jQuery(".xxx-game-iframe-full").addClass("xxx-game-iframe-iphone-se");
                break;
            case 667:
                375 === window.innerHeight ? hideIOSFullscreenPanel() : showIOSFullscreenPanel();
                break;
            case 808:
                414 === window.innerHeight ? hideIOSFullscreenPanel() : showIOSFullscreenPanel();
                break;
            default:
                hideIOSFullscreenPanel()
            }
            break;
        case 3:
            switch (window.innerWidth) {
            case 736:
                414 === window.innerHeight ? hideIOSFullscreenPanel() : showIOSFullscreenPanel();
                break;
            case 724:
                375 === window.innerHeight ? hideIOSFullscreenPanel() : showIOSFullscreenPanel();
                break;
            case 808:
                414 === window.innerHeight ? hideIOSFullscreenPanel() : showIOSFullscreenPanel();
                break;
            default:
                hideIOSFullscreenPanel()
            }
            break;
        default:
            hideIOSFullscreenPanel()
        }
}
function iosResize() {
    __iosResize();
    setTimeout(function() {
        __iosResize()
    }, 500)
}
function iosInIframe() {
    try {
        return window.self !== window.top
    } catch (a) {
        return !0
    }
}
function isIOSLessThen13() {
    var a = platform.os
      , c = a.family.toLowerCase();
    a = parseFloat(a.version);
    return "ios" === c && 13 > a ? !0 : !1
}
$(document).ready(function() {
    platform && "iPhone" === platform.product && "safari" === platform.name.toLowerCase() && isIOSLessThen13() && !iosInIframe() && (buildIOSFullscreenPanel(),
    buildIOSMeta())
});
jQuery(window).resize(function() {
    platform && "iPhone" === platform.product && "safari" === platform.name.toLowerCase() && isIOSLessThen13() && !iosInIframe() && iosResize()
});
(function() {
    var a = "undefined" !== typeof window && "undefined" !== typeof window.document ? window.document : {}
      , c = "undefined" !== typeof module && module.exports
      , b = function() {
        for (var f, g = ["requestFullscreen exitFullscreen fullscreenElement fullscreenEnabled fullscreenchange fullscreenerror".split(" "), "webkitRequestFullscreen webkitExitFullscreen webkitFullscreenElement webkitFullscreenEnabled webkitfullscreenchange webkitfullscreenerror".split(" "), "webkitRequestFullScreen webkitCancelFullScreen webkitCurrentFullScreenElement webkitCancelFullScreen webkitfullscreenchange webkitfullscreenerror".split(" "), "mozRequestFullScreen mozCancelFullScreen mozFullScreenElement mozFullScreenEnabled mozfullscreenchange mozfullscreenerror".split(" "), "msRequestFullscreen msExitFullscreen msFullscreenElement msFullscreenEnabled MSFullscreenChange MSFullscreenError".split(" ")], h = 0, l = g.length, k = {}; h < l; h++)
            if ((f = g[h]) && f[1]in a) {
                for (h = 0; h < f.length; h++)
                    k[g[0][h]] = f[h];
                return k
            }
        return !1
    }()
      , e = {
        change: b.fullscreenchange,
        error: b.fullscreenerror
    }
      , d = {
        request: function(f) {
            return new Promise(function(g, h) {
                var l = function() {
                    this.off("change", l);
                    g()
                }
                .bind(this);
                this.on("change", l);
                f = f || a.documentElement;
                Promise.resolve(f[b.requestFullscreen]())["catch"](h)
            }
            .bind(this))
        },
        exit: function() {
            return new Promise(function(f, g) {
                if (this.isFullscreen) {
                    var h = function() {
                        this.off("change", h);
                        f()
                    }
                    .bind(this);
                    this.on("change", h);
                    Promise.resolve(a[b.exitFullscreen]())["catch"](g)
                } else
                    f()
            }
            .bind(this))
        },
        toggle: function(f) {
            return this.isFullscreen ? this.exit() : this.request(f)
        },
        onchange: function(f) {
            this.on("change", f)
        },
        onerror: function(f) {
            this.on("error", f)
        },
        on: function(f, g) {
            var h = e[f];
            h && a.addEventListener(h, g, !1)
        },
        off: function(f, g) {
            var h = e[f];
            h && a.removeEventListener(h, g, !1)
        },
        raw: b
    };
    b ? (Object.defineProperties(d, {
        isFullscreen: {
            get: function() {
                return !!a[b.fullscreenElement]
            }
        },
        element: {
            enumerable: !0,
            get: function() {
                return a[b.fullscreenElement]
            }
        },
        isEnabled: {
            enumerable: !0,
            get: function() {
                return !!a[b.fullscreenEnabled]
            }
        }
    }),
    c ? module.exports = d : window.screenfull = d) : c ? module.exports = {
        isEnabled: !1
    } : window.screenfull = {
        isEnabled: !1
    }
}
)();
var s_iScaleFactor = 1, s_bIsIphone = !1, s_iOffsetX, s_iOffsetY, s_bFocus = !0;
(function(a) {
    (jQuery.browser = jQuery.browser || {}).mobile = /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|tablet|treo|up\.(browser|link)|vodafone|wap|webos|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
}
)(navigator.userAgent || navigator.vendor || window.opera);
$(window).resize(function() {
    sizeHandler()
});
function trace(a) {
    console.log(a)
}
function getSize(a) {
    var c = a.toLowerCase()
      , b = window.document
      , e = b.documentElement;
    if (void 0 === window["inner" + a])
        a = e["client" + a];
    else if (window["inner" + a] != e["client" + a]) {
        var d = b.createElement("body");
        d.id = "vpw-test-b";
        d.style.cssText = "overflow:scroll";
        var f = b.createElement("div");
        f.id = "vpw-test-d";
        f.style.cssText = "position:absolute;top:-1000px";
        f.innerHTML = "<style>@media(" + c + ":" + e["client" + a] + "px){body#vpw-test-b div#vpw-test-d{" + c + ":7px!important}}</style>";
        d.appendChild(f);
        e.insertBefore(d, b.head);
        a = 7 == f["offset" + a] ? e["client" + a] : window["inner" + a];
        e.removeChild(d)
    } else
        a = window["inner" + a];
    return a
}
window.addEventListener("orientationchange", onOrientationChange);
function onOrientationChange() {
    window.matchMedia("(orientation: portrait)").matches && sizeHandler();
    window.matchMedia("(orientation: landscape)").matches && sizeHandler()
}
function isChrome() {
    return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
}
function isMobile() {
    return isIpad() ? !0 : jQuery.browser.mobile
}
function isIpad() {
    var a = -1 !== navigator.userAgent.toLowerCase().indexOf("ipad");
    return !a && navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && 2 < navigator.maxTouchPoints ? !0 : a
}
function isIOS() {
    for (var a = "iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod".split(";"); a.length; )
        if (navigator.platform === a.pop())
            return s_bIsIphone = !0;
    return s_bIsIphone = !1
}
function getIOSWindowHeight() {
    return document.documentElement.clientWidth / window.innerWidth * window.innerHeight
}
function getHeightOfIOSToolbars() {
    var a = (0 === window.orientation ? screen.height : screen.width) - getIOSWindowHeight();
    return 1 < a ? a : 0
}
function sizeHandler() {
    window.scrollTo(0, 1);
    if ($("#canvas")) {
        var a = null !== platform.name && "safari" === platform.name.toLowerCase() ? getIOSWindowHeight() : getSize("Height");
        var c = getSize("Width");
        s_bFocus && _checkOrientation(c, a);
        var b = Math.min(a / CANVAS_HEIGHT, c / CANVAS_WIDTH)
          , e = Math.round(CANVAS_WIDTH * b);
        b = Math.round(CANVAS_HEIGHT * b);
        if (b < a) {
            var d = a - b;
            b += d;
            e += CANVAS_WIDTH / CANVAS_HEIGHT * d
        } else
            e < c && (d = c - e,
            e += d,
            b += CANVAS_HEIGHT / CANVAS_WIDTH * d);
        d = a / 2 - b / 2;
        var f = c / 2 - e / 2
          , g = CANVAS_WIDTH / e;
        if (f * g < -EDGEBOARD_X || d * g < -EDGEBOARD_Y)
            b = Math.min(a / (CANVAS_HEIGHT - 2 * EDGEBOARD_Y), c / (CANVAS_WIDTH - 2 * EDGEBOARD_X)),
            e = Math.round(CANVAS_WIDTH * b),
            b = Math.round(CANVAS_HEIGHT * b),
            d = (a - b) / 2,
            f = (c - e) / 2,
            g = CANVAS_WIDTH / e;
        s_iOffsetX = -1 * f * g;
        s_iOffsetY = -1 * d * g;
        0 <= d && (s_iOffsetY = 0);
        0 <= f && (s_iOffsetX = 0);
        null !== s_oInterface && s_oInterface.refreshButtonPos();
        null !== s_oMenu && s_oMenu.refreshButtonPos();
        null !== s_oSelectPlayers && s_oSelectPlayers.refreshButtonPos();
        s_bIsIphone ? (canvas = document.getElementById("canvas"),
        s_oStage.canvas.width = 2 * e,
        s_oStage.canvas.height = 2 * b,
        canvas.style.width = e + "px",
        canvas.style.height = b + "px",
        s_oStage.scaleX = s_oStage.scaleY = 2 * Math.min(e / CANVAS_WIDTH, b / CANVAS_HEIGHT)) : s_bMobile || isChrome() ? ($("#canvas").css("width", e + "px"),
        $("#canvas").css("height", b + "px")) : (s_oStage.canvas.width = e,
        s_oStage.canvas.height = b,
        s_iScaleFactor = Math.min(e / CANVAS_WIDTH, b / CANVAS_HEIGHT),
        s_oStage.scaleX = s_oStage.scaleY = s_iScaleFactor);
        0 > d || (d = (a - b) / 2);
        $("#canvas").css("top", d + "px");
        $("#canvas").css("left", f + "px");
        fullscreenHandler()
    }
}
function _checkOrientation(a, c) {
    s_bMobile && ENABLE_CHECK_ORIENTATION && (a > c ? "landscape" === $(".orientation-msg-container").attr("data-orientation") ? ($(".orientation-msg-container").css("display", "none"),
    s_oMain.startUpdate()) : ($(".orientation-msg-container").css("display", "block"),
    s_oMain.stopUpdate()) : "portrait" === $(".orientation-msg-container").attr("data-orientation") ? ($(".orientation-msg-container").css("display", "none"),
    s_oMain.startUpdate()) : ($(".orientation-msg-container").css("display", "block"),
    s_oMain.stopUpdate()))
}
function playSound(a, c, b) {
    return !1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile ? (s_aSounds[a].play(),
    s_aSounds[a].volume(c),
    s_aSounds[a].loop(b),
    s_aSounds[a]) : null
}
function stopSound(a) {
    !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || s_aSounds[a].stop()
}
function setVolume(a, c) {
    !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || s_aSounds[a].volume(c)
}
function setMute(a, c) {
    !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || s_aSounds[a].mute(c)
}
function createBitmap(a, c, b) {
    var e = new createjs.Bitmap(a)
      , d = new createjs.Shape;
    c && b ? d.graphics.beginFill("#fff").drawRect(0, 0, c, b) : d.graphics.beginFill("#ff0").drawRect(0, 0, a.width, a.height);
    e.hitArea = d;
    return e
}
function createSprite(a, c, b, e, d, f) {
    a = null !== c ? new createjs.Sprite(a,c) : new createjs.Sprite(a);
    c = new createjs.Shape;
    c.graphics.beginFill("#000000").drawRect(-b, -e, d, f);
    a.hitArea = c;
    return a
}
function pad(a, c, b) {
    a += "";
    return a.length >= c ? a : Array(c - a.length + 1).join(b || "0") + a
}
function randomFloatBetween(a, c, b) {
    "undefined" === typeof b && (b = 2);
    return parseFloat(Math.min(a + Math.random() * (c - a), c).toFixed(b))
}
function rotateVector2D(a, c) {
    var b = c.getX() * Math.cos(a) + c.getY() * Math.sin(a)
      , e = c.getX() * -Math.sin(a) + c.getY() * Math.cos(a);
    c.set(b, e)
}
function tweenVectorsOnX(a, c, b) {
    return a + b * (c - a)
}
function shuffle(a) {
    for (var c = a.length, b, e; 0 !== c; )
        e = Math.floor(Math.random() * c),
        --c,
        b = a[c],
        a[c] = a[e],
        a[e] = b;
    return a
}
function bubbleSort(a) {
    do {
        var c = !1;
        for (var b = 0; b < a.length - 1; b++)
            a[b] > a[b + 1] && (c = a[b],
            a[b] = a[b + 1],
            a[b + 1] = c,
            c = !0)
    } while (c)
}
function compare(a, c) {
    return a.index > c.index ? -1 : a.index < c.index ? 1 : 0
}
function easeLinear(a, c, b, e) {
    return b * a / e + c
}
function easeInQuad(a, c, b, e) {
    return b * (a /= e) * a + c
}
function easeInSine(a, c, b, e) {
    return -b * Math.cos(a / e * (Math.PI / 2)) + b + c
}
function easeInCubic(a, c, b, e) {
    return b * (a /= e) * a * a + c
}
function getTrajectoryPoint(a, c) {
    var b = new createjs.Point
      , e = (1 - a) * (1 - a)
      , d = a * a;
    b.x = e * c.start.x + 2 * (1 - a) * a * c.traj.x + d * c.end.x;
    b.y = e * c.start.y + 2 * (1 - a) * a * c.traj.y + d * c.end.y;
    return b
}
function formatTime(a) {
    a /= 1E3;
    var c = Math.floor(a / 60);
    a = parseFloat(a - 60 * c).toFixed(1);
    var b = "";
    b = 10 > c ? b + ("0" + c + ":") : b + (c + ":");
    return 10 > a ? b + ("0" + a) : b + a
}
function degreesToRadians(a) {
    return a * Math.PI / 180
}
function checkRectCollision(a, c) {
    var b = getBounds(a, .9);
    var e = getBounds(c, .98);
    return calculateIntersection(b, e)
}
function calculateIntersection(a, c) {
    var b, e, d, f;
    var g = a.x + (b = a.width / 2);
    var h = a.y + (e = a.height / 2);
    var l = c.x + (d = c.width / 2);
    var k = c.y + (f = c.height / 2);
    g = Math.abs(g - l) - (b + d);
    h = Math.abs(h - k) - (e + f);
    return 0 > g && 0 > h ? (g = Math.min(Math.min(a.width, c.width), -g),
    h = Math.min(Math.min(a.height, c.height), -h),
    {
        x: Math.max(a.x, c.x),
        y: Math.max(a.y, c.y),
        width: g,
        height: h,
        rect1: a,
        rect2: c
    }) : null
}
function getBounds(a, c) {
    var b = {
        x: Infinity,
        y: Infinity,
        width: 0,
        height: 0
    };
    if (a instanceof createjs.Container) {
        b.x2 = -Infinity;
        b.y2 = -Infinity;
        var e = a.children, d = e.length, f;
        for (f = 0; f < d; f++) {
            var g = getBounds(e[f], 1);
            g.x < b.x && (b.x = g.x);
            g.y < b.y && (b.y = g.y);
            g.x + g.width > b.x2 && (b.x2 = g.x + g.width);
            g.y + g.height > b.y2 && (b.y2 = g.y + g.height)
        }
        Infinity == b.x && (b.x = 0);
        Infinity == b.y && (b.y = 0);
        Infinity == b.x2 && (b.x2 = 0);
        Infinity == b.y2 && (b.y2 = 0);
        b.width = b.x2 - b.x;
        b.height = b.y2 - b.y;
        delete b.x2;
        delete b.y2
    } else {
        if (a instanceof createjs.Bitmap) {
            d = a.sourceRect || a.image;
            f = d.width * c;
            var h = d.height * c
        } else if (a instanceof createjs.Sprite)
            if (a.spriteSheet._frames && a.spriteSheet._frames[a.currentFrame] && a.spriteSheet._frames[a.currentFrame].image) {
                d = a.spriteSheet.getFrame(a.currentFrame);
                f = d.rect.width;
                h = d.rect.height;
                e = d.regX;
                var l = d.regY
            } else
                b.x = a.x || 0,
                b.y = a.y || 0;
        else
            b.x = a.x || 0,
            b.y = a.y || 0;
        e = e || 0;
        f = f || 0;
        l = l || 0;
        h = h || 0;
        b.regX = e;
        b.regY = l;
        d = a.localToGlobal(0 - e, 0 - l);
        g = a.localToGlobal(f - e, h - l);
        f = a.localToGlobal(f - e, 0 - l);
        e = a.localToGlobal(0 - e, h - l);
        b.x = Math.min(Math.min(Math.min(d.x, g.x), f.x), e.x);
        b.y = Math.min(Math.min(Math.min(d.y, g.y), f.y), e.y);
        b.width = Math.max(Math.max(Math.max(d.x, g.x), f.x), e.x) - b.x;
        b.height = Math.max(Math.max(Math.max(d.y, g.y), f.y), e.y) - b.y
    }
    return b
}
function NoClickDelay(a) {
    this.element = a;
    window.Touch && this.element.addEventListener("touchstart", this, !1)
}
function shuffle(a) {
    for (var c = a.length, b, e; 0 < c; )
        e = Math.floor(Math.random() * c),
        c--,
        b = a[c],
        a[c] = a[e],
        a[e] = b;
    return a
}
NoClickDelay.prototype = {
    handleEvent: function(a) {
        switch (a.type) {
        case "touchstart":
            this.onTouchStart(a);
            break;
        case "touchmove":
            this.onTouchMove(a);
            break;
        case "touchend":
            this.onTouchEnd(a)
        }
    },
    onTouchStart: function(a) {
        a.preventDefault();
        this.moved = !1;
        this.element.addEventListener("touchmove", this, !1);
        this.element.addEventListener("touchend", this, !1)
    },
    onTouchMove: function(a) {
        this.moved = !0
    },
    onTouchEnd: function(a) {
        this.element.removeEventListener("touchmove", this, !1);
        this.element.removeEventListener("touchend", this, !1);
        if (!this.moved) {
            a = document.elementFromPoint(a.changedTouches[0].clientX, a.changedTouches[0].clientY);
            3 == a.nodeType && (a = a.parentNode);
            var c = document.createEvent("MouseEvents");
            c.initEvent("click", !0, !0);
            a.dispatchEvent(c)
        }
    }
};
(function() {
    function a(b) {
        var e = {
            focus: "visible",
            focusin: "visible",
            pageshow: "visible",
            blur: "hidden",
            focusout: "hidden",
            pagehide: "hidden"
        };
        b = b || window.event;
        b.type in e ? document.body.className = e[b.type] : (document.body.className = this[c] ? "hidden" : "visible",
        "hidden" === document.body.className ? (s_oMain.stopUpdate(),
        s_bFocus = !1) : (s_oMain.startUpdate(),
        s_bFocus = !0))
    }
    var c = "hidden";
    c in document ? document.addEventListener("visibilitychange", a) : (c = "mozHidden")in document ? document.addEventListener("mozvisibilitychange", a) : (c = "webkitHidden")in document ? document.addEventListener("webkitvisibilitychange", a) : (c = "msHidden")in document ? document.addEventListener("msvisibilitychange", a) : "onfocusin"in document ? document.onfocusin = document.onfocusout = a : window.onpageshow = window.onpagehide = window.onfocus = window.onblur = a
}
)();
function ctlArcadeResume() {
    null !== s_oMain && s_oMain.startUpdate()
}
function ctlArcadePause() {
    null !== s_oMain && s_oMain.stopUpdate()
}
function getParamValue(a) {
    for (var c = window.location.search.substring(1).split("&"), b = 0; b < c.length; b++) {
        var e = c[b].split("=");
        if (e[0] == a)
            return e[1]
    }
}
function fullscreenHandler() {
    ENABLE_FULLSCREEN && screenfull.isEnabled && (s_bFullscreen = screenfull.isFullscreen,
    null !== s_oInterface && s_oInterface.resetFullscreenBut(),
    null !== s_oMenu && s_oMenu.resetFullscreenBut(),
    null !== s_oSelectPlayers && s_oSelectPlayers.resetFullscreenBut())
}
if (screenfull.isEnabled)
    screenfull.on("change", function() {
        s_bFullscreen = screenfull.isFullscreen;
        null !== s_oInterface && s_oInterface.resetFullscreenBut();
        null !== s_oMenu && s_oMenu.resetFullscreenBut();
        null !== s_oSelectPlayers && s_oSelectPlayers.resetFullscreenBut()
    });
var s_szGameID = "f2520bae00624e93a4f4614732fa259e";
window.GD_OPTIONS = {
    gameId: s_szGameID,
    onEvent: function(a) {
        switch (a.name) {
        case "SDK_READY":
            s_bMobile || ($("#div_display_id").css("display", "block"),
            "undefined" !== typeof gdsdk && "undefined" !== gdsdk.showAd && gdsdk.showAd(gdsdk.AdType.Display, {
                containerId: "div_display_id"
            }).then(function() {
                return console.info("showAd(gdsdk.AdType.Display) resolved.")
            })["catch"](function(c) {
                return console.info(c)
            }));
            break;
        case "SDK_GAME_START":
            s_bAdShown = !1;
            s_oMain && s_oMain.startUpdate();
            break;
        case "SDK_GAME_PAUSE":
            s_bAdShown = !0,
            s_oMain && s_oMain.stopUpdate()
        }
    }
};
(function(a, c, b) {
    var e = a.getElementsByTagName(c)[0];
    a.getElementById(b) || (a = a.createElement(c),
    a.id = b,
    a.src = "main.min.js",
    e.parentNode.insertBefore(a, e))
}
)(document, "script", "gamedistribution-jssdk");
var s_bAdShown = !1;
function CSpriteLibrary() {
    var a = {}, c, b, e, d, f, g;
    this.init = function(h, l, k) {
        c = {};
        e = b = 0;
        d = h;
        f = l;
        g = k
    }
    ;
    this.addSprite = function(h, l) {
        if (!a.hasOwnProperty(h)) {
            var k = new Image;
            a[h] = c[h] = {
                szPath: l,
                oSprite: k,
                bLoaded: !1
            };
            b++
        }
    }
    ;
    this.getSprite = function(h) {
        return a.hasOwnProperty(h) ? a[h].oSprite : null
    }
    ;
    this._onSpritesLoaded = function() {
        b = 0;
        f.call(g)
    }
    ;
    this._onSpriteLoaded = function() {
        d.call(g);
        ++e === b && this._onSpritesLoaded()
    }
    ;
    this.loadSprites = function() {
        for (var h in c)
            c[h].oSprite.oSpriteLibrary = this,
            c[h].oSprite.szKey = h,
            c[h].oSprite.onload = function() {
                this.oSpriteLibrary.setLoaded(this.szKey);
                this.oSpriteLibrary._onSpriteLoaded(this.szKey)
            }
            ,
            c[h].oSprite.onerror = function(l) {
                var k = l.currentTarget;
                setTimeout(function() {
                    c[k.szKey].oSprite.src = c[k.szKey].szPath
                }, 500)
            }
            ,
            c[h].oSprite.src = c[h].szPath
    }
    ;
    this.setLoaded = function(h) {
        a[h].bLoaded = !0
    }
    ;
    this.isLoaded = function(h) {
        return a[h].bLoaded
    }
    ;
    this.getNumSprites = function() {
        return b
    }
}
function CTextButton(a, c, b, e, d, f, g, h) {
    var l, k, m, n, p, r, z, v, t, B, w, y;
    this._init = function(q, u, A, F, C, L, J, M) {
        l = !1;
        n = [];
        p = [];
        y = createBitmap(A);
        k = A.width;
        m = A.height;
        var O = Math.ceil(J / 20);
        B = new createjs.Text(F,J + "px " + C,"#000000");
        var U = B.getBounds();
        B.textAlign = "center";
        B.lineWidth = .9 * k;
        B.textBaseline = "alphabetic";
        B.x = A.width / 2 + O;
        B.y = Math.floor(A.height / 2) + U.height / 3 + O;
        w = new createjs.Text(F,J + "px " + C,L);
        w.textAlign = "center";
        w.textBaseline = "alphabetic";
        w.lineWidth = .9 * k;
        w.x = A.width / 2;
        w.y = Math.floor(A.height / 2) + U.height / 3;
        t = new createjs.Container;
        t.x = q;
        t.y = u;
        t.regX = A.width / 2;
        t.regY = A.height / 2;
        s_bMobile || (t.cursor = "pointer");
        t.addChild(y, B, w);
        !1 !== M && s_oStage.addChild(t);
        this._initListener()
    }
    ;
    this.unload = function() {
        t.off("mousedown", z);
        t.off("pressup", v);
        s_oStage.removeChild(t)
    }
    ;
    this.setVisible = function(q) {
        t.visible = q
    }
    ;
    this.setAlign = function(q) {
        w.textAlign = q;
        B.textAlign = q
    }
    ;
    this.enable = function() {
        l = !1;
        y.filters = [];
        y.cache(0, 0, k, m)
    }
    ;
    this.disable = function() {
        l = !0;
        var q = (new createjs.ColorMatrix).adjustSaturation(-100).adjustBrightness(40);
        y.filters = [new createjs.ColorMatrixFilter(q)];
        y.cache(0, 0, k, m)
    }
    ;
    this._initListener = function() {
        z = t.on("mousedown", this.buttonDown);
        v = t.on("pressup", this.buttonRelease)
    }
    ;
    this.addEventListener = function(q, u, A) {
        n[q] = u;
        p[q] = A
    }
    ;
    this.addEventListenerWithParams = function(q, u, A, F) {
        n[q] = u;
        p[q] = A;
        r = F
    }
    ;
    this.buttonRelease = function() {
        l || (playSound("click", 1, !1),
        t.scaleX = 1,
        t.scaleY = 1,
        n[ON_MOUSE_UP] && n[ON_MOUSE_UP].call(p[ON_MOUSE_UP], r))
    }
    ;
    this.buttonDown = function() {
        l || (t.scaleX = .9,
        t.scaleY = .9,
        n[ON_MOUSE_DOWN] && n[ON_MOUSE_DOWN].call(p[ON_MOUSE_DOWN]))
    }
    ;
    this.setPosition = function(q, u) {
        t.x = q;
        t.y = u
    }
    ;
    this.changeText = function(q) {
        w.text = q;
        B.text = q
    }
    ;
    this.setX = function(q) {
        t.x = q
    }
    ;
    this.setY = function(q) {
        t.y = q
    }
    ;
    this.getButtonImage = function() {
        return t
    }
    ;
    this.getX = function() {
        return t.x
    }
    ;
    this.getY = function() {
        return t.y
    }
    ;
    this.getSprite = function() {
        return t
    }
    ;
    this._init(a, c, b, e, d, f, g, h);
    return this
}
function CToggle(a, c, b, e, d) {
    var f, g, h, l, k, m;
    this._init = function(n, p, r, z, v) {
        g = [];
        h = [];
        var t = new createjs.SpriteSheet({
            images: [r],
            frames: {
                width: r.width / 2,
                height: r.height,
                regX: r.width / 2 / 2,
                regY: r.height / 2
            },
            animations: {
                state_true: [0],
                state_false: [1]
            }
        });
        f = z;
        m = createSprite(t, "state_" + f, r.width / 2 / 2, r.height / 2, r.width / 2, r.height);
        m.x = n;
        m.y = p;
        m.stop();
        m.cursor = "pointer";
        v.addChild(m);
        this._initListener()
    }
    ;
    this.unload = function() {
        m.off("mousedown", l);
        m.off("pressup", k);
        d.removeChild(m)
    }
    ;
    this._initListener = function() {
        l = m.on("mousedown", this.buttonDown);
        k = m.on("pressup", this.buttonRelease)
    }
    ;
    this.addEventListener = function(n, p, r) {
        g[n] = p;
        h[n] = r
    }
    ;
    this.setActive = function(n) {
        f = n;
        m.gotoAndStop("state_" + f)
    }
    ;
    this.buttonRelease = function() {
        m.scaleX = 1;
        m.scaleY = 1;
        playSound("click", 1, !1);
        f = !f;
        m.gotoAndStop("state_" + f);
        g[ON_MOUSE_UP] && g[ON_MOUSE_UP].call(h[ON_MOUSE_UP], f)
    }
    ;
    this.buttonDown = function() {
        m.scaleX = .9;
        m.scaleY = .9;
        g[ON_MOUSE_DOWN] && g[ON_MOUSE_DOWN].call(h[ON_MOUSE_DOWN])
    }
    ;
    this.setPosition = function(n, p) {
        m.x = n;
        m.y = p
    }
    ;
    this._init(a, c, b, e, d)
}
function CGfxButton(a, c, b, e) {
    var d, f, g, h, l, k, m;
    this._init = function(p, r, z, v) {
        d = !1;
        f = 1;
        g = [];
        h = [];
        m = createBitmap(z);
        m.x = p;
        m.y = r;
        m.scaleX = m.scaleY = f;
        m.regX = z.width / 2;
        m.regY = z.height / 2;
        m.cursor = "pointer";
        v.addChild(m);
        this._initListener()
    }
    ;
    this.unload = function() {
        m.off("mousedown", l);
        m.off("pressup", k);
        e.removeChild(m)
    }
    ;
    this.setVisible = function(p) {
        m.visible = p
    }
    ;
    this.setClickable = function(p) {
        d = !p
    }
    ;
    this._initListener = function() {
        l = m.on("mousedown", this.buttonDown);
        k = m.on("pressup", this.buttonRelease)
    }
    ;
    this.addEventListener = function(p, r, z) {
        g[p] = r;
        h[p] = z
    }
    ;
    this.buttonRelease = function() {
        d || (m.scaleX = f,
        m.scaleY = f,
        g[ON_MOUSE_UP] && g[ON_MOUSE_UP].call(h[ON_MOUSE_UP]))
    }
    ;
    this.buttonDown = function() {
        d || (m.scaleX = .9 * f,
        m.scaleY = .9 * f,
        playSound("click", 1, !1),
        g[ON_MOUSE_DOWN] && g[ON_MOUSE_DOWN].call(h[ON_MOUSE_DOWN]))
    }
    ;
    this.pulseAnimation = function() {
        createjs.Tween.get(m).to({
            scaleX: .9 * f,
            scaleY: .9 * f
        }, 850, createjs.Ease.quadOut).to({
            scaleX: f,
            scaleY: f
        }, 650, createjs.Ease.quadIn).call(function() {
            n.pulseAnimation()
        })
    }
    ;
    this.trembleAnimation = function() {
        createjs.Tween.get(m).to({
            rotation: 10
        }, 75, createjs.Ease.quadOut).to({
            rotation: -10
        }, 140, createjs.Ease.quadIn).to({
            rotation: 0
        }, 75, createjs.Ease.quadIn).call(function() {
            n.trembleAnimation()
        })
    }
    ;
    this.removeAnimation = function() {
        m.scale = f;
        m.rotation = 0;
        createjs.Tween.removeTweens(m)
    }
    ;
    this.setPosition = function(p, r) {
        m.x = p;
        m.y = r
    }
    ;
    this.setX = function(p) {
        m.x = p
    }
    ;
    this.setY = function(p) {
        m.y = p
    }
    ;
    this.setImage = function(p) {
        m.image = p
    }
    ;
    this.getButtonImage = function() {
        return m
    }
    ;
    this.getX = function() {
        return m.x
    }
    ;
    this.getY = function() {
        return m.y
    }
    ;
    var n = this;
    this._init(a, c, b, e);
    return this
}
CTLText.prototype = {
    constructor: CTLText,
    __autofit: function() {
        if (this._bFitText) {
            for (var a = this._iFontSize; (this._oText.getBounds().height > this._iHeight - 2 * this._iPaddingV || this._oText.getBounds().width > this._iWidth - 2 * this._iPaddingH) && !(a--,
            this._oText.font = a + "px " + this._szFont,
            this._oText.lineHeight = Math.round(a * this._fLineHeightFactor),
            this.__updateY(),
            this.__verticalAlign(),
            8 > a); )
                ;
            this._iFontSize = a
        }
    },
    __verticalAlign: function() {
        if (this._bVerticalAlign) {
            var a = this._oText.getBounds().height;
            this._oText.y -= (a - this._iHeight) / 2 + this._iPaddingV
        }
    },
    __updateY: function() {
        this._oText.y = this._y + this._iPaddingV;
        switch (this._oText.textBaseline) {
        case "middle":
            this._oText.y += this._oText.lineHeight / 2 + (this._iFontSize * this._fLineHeightFactor - this._iFontSize)
        }
    },
    __createText: function(a) {
        this._bDebug && (this._oDebugShape = new createjs.Shape,
        this._oDebugShape.graphics.beginFill("rgba(255,0,0,0.5)").drawRect(0, 0, this._iWidth, this._iHeight),
        this._oDebugShape.x = this._x,
        this._oDebugShape.y = this._y,
        this._oContainer.addChild(this._oDebugShape));
        this._oText = new createjs.Text(a,this._iFontSize + "px " + this._szFont,this._szColor);
        this._oText.textBaseline = "middle";
        this._oText.lineHeight = Math.round(this._iFontSize * this._fLineHeightFactor);
        this._oText.textAlign = this._szAlign;
        this._oText.lineWidth = this._bMultiline ? this._iWidth - 2 * this._iPaddingH : null;
        switch (this._szAlign) {
        case "center":
            this._oText.x = this._x + this._iWidth / 2;
            break;
        case "left":
            this._oText.x = this._x + this._iPaddingH;
            break;
        case "right":
            this._oText.x = this._x + this._iWidth - this._iPaddingH
        }
        this._oContainer.addChild(this._oText);
        this.refreshText(a)
    },
    setVerticalAlign: function(a) {
        this._bVerticalAlign = a
    },
    setOutline: function(a) {
        null !== this._oText && (this._oText.outline = a)
    },
    setShadow: function(a, c, b, e) {
        null !== this._oText && (this._oText.shadow = new createjs.Shadow(a,c,b,e))
    },
    setColor: function(a) {
        this._oText.color = a
    },
    setAlpha: function(a) {
        this._oText.alpha = a
    },
    setAlign: function(a) {
        this._oText.textAlign = a
    },
    removeTweens: function() {
        createjs.Tween.removeTweens(this._oText)
    },
    getText: function() {
        return this._oText
    },
    getX: function() {
        return this._x
    },
    getY: function() {
        return this._y
    },
    getFontSize: function() {
        return this._iFontSize
    },
    setY: function(a) {
        this._y = a;
        this._oText.y = this._y
    },
    setPos: function(a, c) {
        this._x = a;
        this._y = c;
        this._oText.x = this._x;
        this._oText.y = this._y;
        if (this._bDebug) {
            this._oContainer.removeChild(this._oDebugShape);
            var b = "left" === this._oText.textAlign ? 0 : -this._iWidth;
            this._oDebugShape = new createjs.Shape;
            this._oDebugShape.graphics.beginFill("rgba(255,0,0,0.5)").drawRect(b, 0, this._iWidth, this._iHeight);
            this._oDebugShape.x = this._x;
            this._oDebugShape.y = this._y;
            this._oContainer.addChild(this._oDebugShape)
        }
        this.__autofit();
        this.__updateY();
        this.__verticalAlign()
    },
    refreshText: function(a) {
        "" === a && (a = " ");
        null === this._oText && this.__createText(a);
        this._oText.text = a;
        this._oText.font = this._iFontSize + "px " + this._szFont;
        this._oText.lineHeight = Math.round(this._iFontSize * this._fLineHeightFactor);
        this.__autofit();
        this.__updateY();
        this.__verticalAlign()
    }
};
function CTLText(a, c, b, e, d, f, g, h, l, k, m, n, p, r, z, v, t) {
    this._oContainer = a;
    this._x = c;
    this._y = b;
    this._iWidth = e;
    this._iHeight = d;
    this._bMultiline = v;
    this._iFontSize = f;
    this._szAlign = g;
    this._szColor = h;
    this._szFont = l;
    this._iPaddingH = m;
    this._iPaddingV = n;
    this._bVerticalAlign = z;
    this._bFitText = r;
    this._bDebug = t;
    this._oDebugShape = null;
    this._fLineHeightFactor = k;
    this._oText = null;
    p && this.__createText(p)
}
!function() {
    function a(d) {
        var f = d;
        if (e[f])
            f = e[f];
        else {
            for (var g = f, h, l = [], k = 0; g; ) {
                if (null !== (h = b.text.exec(g)))
                    l.push(h[0]);
                else if (null !== (h = b.modulo.exec(g)))
                    l.push("%");
                else if (null !== (h = b.placeholder.exec(g))) {
                    if (h[2]) {
                        k |= 1;
                        var m = [], n = h[2], p;
                        if (null !== (p = b.key.exec(n)))
                            for (m.push(p[1]); "" !== (n = n.substring(p[0].length)); )
                                if (null !== (p = b.key_access.exec(n)))
                                    m.push(p[1]);
                                else if (null !== (p = b.index_access.exec(n)))
                                    m.push(p[1]);
                                else
                                    throw new SyntaxError("[sprintf] failed to parse named argument key");
                        else
                            throw new SyntaxError("[sprintf] failed to parse named argument key");
                        h[2] = m
                    } else
                        k |= 2;
                    if (3 === k)
                        throw Error("[sprintf] mixing positional and named placeholders is not (yet) supported");
                    l.push({
                        placeholder: h[0],
                        param_no: h[1],
                        keys: h[2],
                        sign: h[3],
                        pad_char: h[4],
                        align: h[5],
                        width: h[6],
                        precision: h[7],
                        type: h[8]
                    })
                } else
                    throw new SyntaxError("[sprintf] unexpected placeholder");
                g = g.substring(h[0].length)
            }
            f = e[f] = l
        }
        g = arguments;
        h = 1;
        l = f.length;
        m = "";
        var r, z;
        for (n = 0; n < l; n++)
            if ("string" === typeof f[n])
                m += f[n];
            else if ("object" === typeof f[n]) {
                p = f[n];
                if (p.keys)
                    for (k = g[h],
                    r = 0; r < p.keys.length; r++) {
                        if (void 0 == k)
                            throw Error(a('[sprintf] Cannot access property "%s" of undefined value "%s"', p.keys[r], p.keys[r - 1]));
                        k = k[p.keys[r]]
                    }
                else
                    k = p.param_no ? g[p.param_no] : g[h++];
                b.not_type.test(p.type) && b.not_primitive.test(p.type) && k instanceof Function && (k = k());
                if (b.numeric_arg.test(p.type) && "number" !== typeof k && isNaN(k))
                    throw new TypeError(a("[sprintf] expecting number but found %T", k));
                b.number.test(p.type) && (z = 0 <= k);
                switch (p.type) {
                case "b":
                    k = parseInt(k, 10).toString(2);
                    break;
                case "c":
                    k = String.fromCharCode(parseInt(k, 10));
                    break;
                case "d":
                case "i":
                    k = parseInt(k, 10);
                    break;
                case "j":
                    k = JSON.stringify(k, null, p.width ? parseInt(p.width) : 0);
                    break;
                case "e":
                    k = p.precision ? parseFloat(k).toExponential(p.precision) : parseFloat(k).toExponential();
                    break;
                case "f":
                    k = p.precision ? parseFloat(k).toFixed(p.precision) : parseFloat(k);
                    break;
                case "g":
                    k = p.precision ? String(Number(k.toPrecision(p.precision))) : parseFloat(k);
                    break;
                case "o":
                    k = (parseInt(k, 10) >>> 0).toString(8);
                    break;
                case "s":
                    k = String(k);
                    k = p.precision ? k.substring(0, p.precision) : k;
                    break;
                case "t":
                    k = String(!!k);
                    k = p.precision ? k.substring(0, p.precision) : k;
                    break;
                case "T":
                    k = Object.prototype.toString.call(k).slice(8, -1).toLowerCase();
                    k = p.precision ? k.substring(0, p.precision) : k;
                    break;
                case "u":
                    k = parseInt(k, 10) >>> 0;
                    break;
                case "v":
                    k = k.valueOf();
                    k = p.precision ? k.substring(0, p.precision) : k;
                    break;
                case "x":
                    k = (parseInt(k, 10) >>> 0).toString(16);
                    break;
                case "X":
                    k = (parseInt(k, 10) >>> 0).toString(16).toUpperCase()
                }
                if (b.json.test(p.type))
                    m += k;
                else {
                    if (!b.number.test(p.type) || z && !p.sign)
                        var v = "";
                    else
                        v = z ? "+" : "-",
                        k = k.toString().replace(b.sign, "");
                    r = p.pad_char ? "0" === p.pad_char ? "0" : p.pad_char.charAt(1) : " ";
                    var t = p.width - (v + k).length;
                    t = p.width ? 0 < t ? r.repeat(t) : "" : "";
                    m += p.align ? v + k + t : "0" === r ? v + t + k : t + v + k
                }
            }
        return m
    }
    function c(d, f) {
        return a.apply(null, [d].concat(f || []))
    }
    var b = {
        not_string: /[^s]/,
        not_bool: /[^t]/,
        not_type: /[^T]/,
        not_primitive: /[^v]/,
        number: /[diefg]/,
        numeric_arg: /[bcdiefguxX]/,
        json: /[j]/,
        not_json: /[^j]/,
        text: /^[^\x25]+/,
        modulo: /^\x25{2}/,
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        key_access: /^\.([a-z_][a-z_\d]*)/i,
        index_access: /^\[(\d+)\]/,
        sign: /^[+-]/
    }
      , e = Object.create(null);
    "undefined" !== typeof exports && (exports.sprintf = a,
    exports.vsprintf = c);
    "undefined" !== typeof window && (window.sprintf = a,
    window.vsprintf = c,
    "function" === typeof define && define.amd && define(function() {
        return {
            sprintf: a,
            vsprintf: c
        }
    }))
}();
var CCTLMultiplayerGui = function() {
    this._cssClassDomain = "ctl-multiplayer-";
    this._idCurDialog;
    this._idLoadingDialog;
    this._iMaxPlayersInRoom = 2;
    this._iStartNumPlayers = 3;
    var a = localStorage.getItem("nickname");
    this._szNickName = null === a || void 0 === a ? "" : a;
    jQuery(document).on("click", "." + this._cssClassDomain + "room-list li", function() {
        var c = jQuery(this).find("." + g_oCTLMultiplayer._cssClassDomain + "room-name").text()
          , b = jQuery(this).attr("data-accessible")
          , e = jQuery(this).attr("data-private");
        "false" !== b && (g_oCTLMultiplayer.closeCurrentDialog(),
        "true" === e ? g_oCTLMultiplayer.showTypeRoomPassword(c) : (g_oCTLMultiplayer.showLoading(TEXT_NETWORK_CONNECTING),
        on_ctl_multiplayer_join_room(c)))
    })
};
CCTLMultiplayerGui.prototype.refreshRoomList = function(a) {
    for (var c = "", b = 0; b < a.length; b++)
        c += '<li data-private="' + a[b]["private"] + '" data-accessible="' + a[b].accessible + '">',
        c += '<span class="' + this._cssClassDomain + 'room-name">',
        c += a[b].name,
        c += "</span>",
        c += '<span class="' + this._cssClassDomain + 'current-users">',
        c += a[b].curusers + "/" + a[b].maxusers,
        c += "</span>",
        c = !0 === a[b]["private"] ? c + ('<i class="' + this._cssClassDomain + 'icons-lock"></i>') : !1 === a[b].accessible ? c + ('<i class="' + this._cssClassDomain + 'icons-block"></i>') : c + ('<i class="' + this._cssClassDomain + 'icons-login"></i>'),
        c += "</li>";
    jQuery("." + this._cssClassDomain + "room-list").html(c)
}
;
CCTLMultiplayerGui.prototype.showRoomList = function(a) {
    var c = '<ul class="' + this._cssClassDomain + "list " + this._cssClassDomain + 'room-list">';
    c = c + '</ul><button onclick="on_ctl_multiplayer_refresh_room_list()" type="button" class="' + (this._cssClassDomain + "update " + this._cssClassDomain + 'btn-gray">');
    c += '<i class="' + this._cssClassDomain + 'icons-arrows-cw"></i>';
    c += "<span>" + TEXT_SYS_UPDATE + "</span>";
    this._idCurDialog = this.showDialog(TEXT_SYS_MATCH_LIST, c + "</button>", [{
        txt: TEXT_SYS_QUICKMATCH,
        cb: "on_ctl_multiplayer_join_quick_match",
        classes: ""
    }, {
        txt: TEXT_SYS_CREATEMATCH,
        cb: "on_ctl_multiplayer_show_create_match",
        classes: ""
    }, {
        txt: TEXT_SYS_BACK,
        cb: "g_oCTLMultiplayer.closeCurrentDialog",
        classes: ""
    }]);
    this.refreshRoomList(a)
}
;
CCTLMultiplayerGui.prototype.showTypeRoomPassword = function(a) {
    var c = '<div class="' + this._cssClassDomain + 'form-group">';
    c += "<label>" + TEXT_SYS_TYPEROOMPASS + "</label>";
    this._idCurDialog = this.showDialog(TEXT_SYS_TYPEROOMPASS, c + ('<input type="password" name="password" data-room-name="' + a + '"></div>'), [{
        txt: TEXT_SYS_OK,
        cb: "on_ctl_multiplayer_send_password",
        classes: ""
    }, {
        txt: TEXT_SYS_BACK,
        cb: "on_ctl_multiplayer_close_type_room_password",
        classes: ""
    }])
}
;
CCTLMultiplayerGui.prototype.showCreateRoom = function() {
    var a = '<div class="' + this._cssClassDomain + 'form-group">';
    a += "<label>" + TEXT_SYS_NAMEROOM + "</label>";
    a += '<input type="text" name="roomname" value="' + this._szNickName + "'s room\">";
    a = a + '</div><div class="' + (this._cssClassDomain + 'form-group">');
    a += "<label>" + TEXT_SYS_PASSWORD + "</label>";
    a = a + '<input type="password" name="password"><p>' + (TEXT_SYS_INFOPASS + "</p>");
    a = a + '</div><div class="' + (this._cssClassDomain + "form-group" + (2 === this._iMaxPlayersInRoom ? " " + this._cssClassDomain + "display-none" : "") + '">');
    a += "<label>" + TEXT_SYS_MAXPLAYERS + "</label>";
    a += '<ul class="' + this._cssClassDomain + 'inline-list">';
    if (2 < this._iMaxPlayersInRoom)
        for (var c = 2; c < this._iMaxPlayersInRoom + 1; c++)
            a = this._iStartNumPlayers === c ? a + ('<li><input type="radio" name="maxplayers" value="' + c + '" checked="checked"><span>' + c + "</span></li>") : a + ('<li><input type="radio" name="maxplayers" value="' + c + '"><span>' + c + "</span></li>");
    a += "<p>" + TEXT_SYS_CHOOSEMAXNUMPLAYERS + "</p>";
    this._idCurDialog = this.showDialog("Create room", a + "</div>", [{
        txt: TEXT_SYS_CREATE,
        cb: "on_ctl_multiplayer_create_room",
        classes: ""
    }, {
        txt: TEXT_SYS_BACK,
        cb: "on_ctl_multiplayer_close_create_room",
        classes: ""
    }])
}
;
CCTLMultiplayerGui.prototype.showChooseNickName = function() {
    this._idCurDialog = this.showDialog(TEXT_SYS_CHOOSENICK, '<input type="text" name="nickname" maxlength="20" value="' + this._szNickName + '">', [{
        txt: TEXT_SYS_OK,
        cb: "on_ctl_multiplayer_send_nickname",
        classes: ""
    }, {
        txt: TEXT_SYS_CLOSE,
        cb: "g_oCTLMultiplayer.closeCurrentDialog",
        classes: ""
    }])
}
;
CCTLMultiplayerGui.prototype.showGeneralDialog = function(a, c) {
    this._idCurDialog = this.showDialog(a, "", [{
        txt: TEXT_SYS_BACK,
        cb: c,
        classes: ""
    }])
}
;
CCTLMultiplayerGui.prototype.closeLoadingDialog = function() {
    this.closeDlg(this._idLoadingDialog)
}
;
CCTLMultiplayerGui.prototype.closeCurrentDialog = function() {
    this.closeDlg(this._idCurDialog)
}
;
CCTLMultiplayerGui.prototype.makeCode = function() {
    for (var a = "", c = 0; 32 > c; c++)
        a += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(62 * Math.random()));
    return a
}
;
CCTLMultiplayerGui.prototype.showDialog = function(a, c, b, e) {
    var d = "";
    e || (e = this.makeCode());
    d += "<div id='" + e + "' class='" + this._cssClassDomain + "dlg-wrapper'>";
    d += "<div class='" + this._cssClassDomain + "dlg-block'></div>";
    d += "<div class='" + this._cssClassDomain + "dlg-content'>";
    d += "<div class='" + this._cssClassDomain + "dlg-header'>";
    d = d + ("<h1>" + a + "</h1></div><div class='") + (this._cssClassDomain + "dlg-content-body'>");
    d += c;
    d += "</div>";
    if (b && 0 < b.length) {
        d += "<div class='" + this._cssClassDomain + "dlg-footer'>";
        for (a = 0; a < b.length; a++)
            d += "<button type='button' onclick='" + b[a].cb + '("' + e + "\");' class='" + this._cssClassDomain + "mini " + b[a].classes + "'>" + b[a].txt + "</button>";
        d += this.buildExtraFooter();
        d += "</div>"
    }
    d += "</div>";
    d += "</div>";
    jQuery("body").append(d);
    return e
}
;
CCTLMultiplayerGui.prototype.buildExtraFooter = function() {
    return ""
}
;
CCTLMultiplayerGui.prototype.showLoading = function(a, c) {
    var b = "";
    this._idLoadingDialog = this.makeCode();
    a || (a = TEXT_SYS_LOADING);
    b += "<div id='" + this._idLoadingDialog + "' class='" + this._cssClassDomain + "dlg-wrapper " + this._cssClassDomain + "fixed'>";
    b += "<div class='" + this._cssClassDomain + "dlg-block'></div>";
    b += "<div class='" + this._cssClassDomain + "dlg-content'>";
    b += "<div class='" + this._cssClassDomain + "dlg-header'>";
    b = b + ("<h1>" + a + "</h1></div><div class='") + (this._cssClassDomain + "dlg-content-body " + this._cssClassDomain + "align-center'>");
    b += '<i class="' + this._cssClassDomain + 'icons-spin5 animate-spin"></i>';
    b += "</div>";
    c && (b += "<div class='" + this._cssClassDomain + "dlg-footer " + this._cssClassDomain + "center'>",
    b += "<button type='button' onclick='" + c + '("' + this._idLoadingDialog + "\");' class='" + this._cssClassDomain + "mini '>" + TEXT_SYS_BACK + "</button>",
    b += this.buildExtraFooter(),
    b += "</div>");
    b += "</div>";
    b += "</div>";
    jQuery("body").append(b)
}
;
CCTLMultiplayerGui.prototype.updateRoomUserList = function(a, c) {
    var b = jQuery("." + this._cssClassDomain + "user-list");
    if (0 < b.length) {
        b.html("");
        for (var e = 0; e < a.length; e++)
            b.append("<li>" + a[e] + "</li>");
        b = TEXT_WAITING_ROOM_MESSAGE.replace("%d", c);
        jQuery("." + this._cssClassDomain + "room-info").text(b);
        0 < jQuery("." + this._cssClassDomain + "room-play-now").length && (1 === a.length ? jQuery("." + this._cssClassDomain + "room-play-now").addClass(this._cssClassDomain + "display-none") : jQuery("." + this._cssClassDomain + "room-play-now").removeClass(this._cssClassDomain + "display-none"))
    }
}
;
CCTLMultiplayerGui.prototype.showWaitingPlayersInRoom = function(a, c, b) {
    var e = "";
    this._idLoadingDialog = this.makeCode();
    a || (a = TEXT_SYS_LOADING);
    e += "<div id='" + this._idLoadingDialog + "' class='" + this._cssClassDomain + "dlg-wrapper " + this._cssClassDomain + "fixed'>";
    e += "<div class='" + this._cssClassDomain + "dlg-block'></div>";
    e += "<div class='" + this._cssClassDomain + "dlg-content'>";
    e += "<div class='" + this._cssClassDomain + "dlg-header'>";
    e = e + ("<h1>" + a + "</h1></div><div class='") + (this._cssClassDomain + "dlg-content-body " + this._cssClassDomain + "align-center'>");
    e += "<ul class='" + this._cssClassDomain + "list " + this._cssClassDomain + "user-list'>";
    for (a = 0; a < c.length; a++)
        e += "<li>" + c[a] + "</li>";
    e += "</ul>";
    e += "<p class='" + this._cssClassDomain + "room-info'></p>";
    e += '<i class="' + this._cssClassDomain + 'icons-spin5 animate-spin"></i>';
    e += "</div>";
    if (b) {
        e += "<div class='" + this._cssClassDomain + "dlg-footer " + this._cssClassDomain + "center'>";
        for (a = 0; a < b.length; a++)
            c = b[a],
            e += "<button type='button' onclick='" + c.func + '("' + this._idLoadingDialog + "\");' class='" + this._cssClassDomain + "mini" + (c.classes ? " " + c.classes : "") + " '>" + c.label + "</button>";
        e += this.buildExtraFooter();
        e += "</div>"
    }
    e += "</div>";
    e += "</div>";
    jQuery("body").append(e)
}
;
CCTLMultiplayerGui.prototype.closeDlg = function(a) {
    jQuery("#" + a).remove()
}
;
CCTLMultiplayerGui.prototype.closeAllDialog = function() {
    g_oCTLMultiplayer.closeLoadingDialog();
    g_oCTLMultiplayer.closeCurrentDialog()
}
;
CCTLMultiplayerGui.prototype.setNickName = function(a) {
    this._szNickName = null === a || void 0 === a ? "" : a;
    localStorage.setItem("nickname", this._szNickName)
}
;
CCTLMultiplayerGui.prototype.getNickname = function() {
    return this._szNickName
}
;
CCTLMultiplayerGui.prototype.setMaxPlayersInRoom = function(a) {
    2 > a || 4 < a || (this._iMaxPlayersInRoom = a)
}
;
var g_oCTLMultiplayer = new CCTLMultiplayerGui;
g_oCTLMultiplayer.setMaxPlayersInRoom(4);
var ON_CONNECTION_ERROR = 0
  , ON_DISCONNECTION = 1
  , ON_DISCONNECTION_FROM_MATCH = 2
  , ON_LOGIN_SUCCESS = 3
  , ON_MATCHMAKING_CONNECTION_SUCCESS = 4
  , ON_GAMEROOM_CONNECTION_SUCCESS = 5
  , ON_USEROWNERROOM_CREATE_SUCCESS = 6
  , ON_USEROWNERROOM_JOIN_SUCCESS = 7
  , ON_ROOM_INFO_RETURNED = 8
  , ON_BACK_FROM_A_ROOM = 9
  , ERROR_CODE_UNKNOWNROOM = "UnknownRoom"
  , ON_STATUS_ONLINE = "online"
  , ON_STATUS_OFFLINE = "offline"
  , ROOM_TYPE_MATCHMAKING = "MatchmakingRoom"
  , ROOM_TYPE_USEROWNER = "UserOwnerRoom"
  , ROOM_TYPE_GAME = "GameRoom"
  , WAITING_PLAYERS_TIMEOUT = 1E4;
function CNetworkManager() {
    var a, c, b, e, d, f, g, h, l, k, m, n, p, r, z, v, t, B, w, y;
    this._init = function() {
        a = navigator.onLine;
        c = [];
        b = [];
        e = [];
        d = [];
        n = 0;
        window.addEventListener("online", this._onConnectionChangeStatusOnline);
        window.addEventListener("offline", this._onConnectionChangeStatusOffline);
        h = new CNetworkMessageForwarder;
        y = this
    }
    ;
    this.unload = function() {
        s_oNetworkManager = null
    }
    ;
    this.disconnectFromSystem = function() {
        g_oCTLMultiplayer.closeAllDialog();
        y.disconnectFromCurRoom()
    }
    ;
    this.connectToSystem = function() {
        a ? (y.addEventListener(ON_LOGIN_SUCCESS, y.gotoLobby, y),
        g_oCTLMultiplayer.showChooseNickName()) : y.showErrorMessage(TEXT_NO_CONNECTION)
    }
    ;
    this.login = function(q) {
        r = q;
        q = y._setValidNick(q);
        PlayerIO.useSecureApiRequests = !MULTIPLAYER_TEST_LOCAL;
        PlayerIO.authenticate(GAME_PLAYERIO_ID, "public", {
            userId: q
        }, {}, function(u) {
            g = u;
            g.multiplayer.useSecureConnections = !MULTIPLAYER_TEST_LOCAL;
            MULTIPLAYER_TEST_LOCAL && (g.multiplayer.developmentServer = "localhost:8184");
            c[ON_LOGIN_SUCCESS] && c[ON_LOGIN_SUCCESS].call(b[ON_LOGIN_SUCCESS])
        }, y.callbackError)
    }
    ;
    this._setValidNick = function(q) {
        var u = y._getRandomCodeNumber();
        "" === q ? r = q = "guest-" + u : q = q + "-" + u;
        return q
    }
    ;
    this._getRandomCodeNumber = function() {
        return Math.floor(1E3 * Math.random())
    }
    ;
    this.generateRandomName = function() {
        var q = "xmariox alex max mahuro biajus rob idah fabrix seth ikillyou commander admiral general seasalt emperorofthesea Aspect Kraken Dragon Shiver Dracula Doom Scar Roadkill Cobra Psycho Ranger Ripley Clink Bruise Bowser Creep Cannon Daemon Steel Tempest Hurricane Titanium Tito Lightning IronHeart Sabotage Rex Hydra Terminator Agrippa Gash Blade Katana Gladius Angon Claymore Pike Hammer Club Heart Gauntlet Montante Longbow bow Dagger".split(" ")
          , u = Math.floor(Math.random() * q.length);
        q = q[u];
        if (.5 < Math.random()) {
            var A = Math.floor(100 * Math.random());
            if (.5 < Math.random()) {
                var F = ["-", "_"];
                u = Math.floor(Math.random() * F.length);
                q += F[u]
            }
            q += A
        }
        return w = q
    }
    ;
    this.getBotName = function() {
        return w
    }
    ;
    this._onConnectionChangeStatusOnline = function(q) {
        a = !0;
        c[ON_STATUS_ONLINE] && c[ON_STATUS_ONLINE].call(b[ON_STATUS_ONLINE]);
        0 < jQuery(".ctl-multiplayer-dlg-content").length && y._onReconnection()
    }
    ;
    this._onConnectionChangeStatusOffline = function() {
        a = !1;
        c[ON_STATUS_OFFLINE] && c[ON_STATUS_OFFLINE].call(b[ON_STATUS_OFFLINE]);
        0 < jQuery(".ctl-multiplayer-dlg-content").length && (y.showErrorMessage(TEXT_NO_CONNECTION),
        y.disconnect())
    }
    ;
    this._onReconnection = function() {
        null === r || void 0 === r ? (g_oCTLMultiplayer.closeAllDialog(),
        y.connectToSystem()) : (g_oCTLMultiplayer.closeAllDialog(),
        y.gotoLobby())
    }
    ;
    this.showErrorMessage = function(q) {
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showGeneralDialog(q, "g_oCTLMultiplayer.closeAllDialog")
    }
    ;
    this.addEventListener = function(q, u, A) {
        c[q] = u;
        b[q] = A
    }
    ;
    this.callbackError = function(q) {
        console.log("Error: " + q.code + " - " + q.message);
        c[ON_CONNECTION_ERROR] && c[ON_CONNECTION_ERROR].call(b[ON_CONNECTION_ERROR], q);
        y.showErrorMessage(q)
    }
    ;
    this.callbackDisconnect = function(q) {
        console.log("Disconnected From Menu");
        c[ON_DISCONNECTION] && c[ON_DISCONNECTION].call(b[ON_DISCONNECTION], q)
    }
    ;
    this.callbackDisconnectFromMatch = function(q) {
        console.log("Disconnected From Match");
        c[ON_DISCONNECTION_FROM_MATCH] && c[ON_DISCONNECTION_FROM_MATCH].call(b[ON_DISCONNECTION_FROM_MATCH], q)
    }
    ;
    this.sendMsg = function(q, u) {
        f && f.send(q, u)
    }
    ;
    this.disconnect = function() {
        f && (f.disconnect(),
        f = null)
    }
    ;
    this.isUserA = function() {
        return 0 === parseInt(l) ? !0 : !1
    }
    ;
    this.getPlayerOrderID = function() {
        return l
    }
    ;
    this.getPlayerNickname = function() {
        return r
    }
    ;
    this.getNicknameByID = function(q) {
        return z[q]
    }
    ;
    this.getNicknameList = function() {
        return z
    }
    ;
    this.getAvatarByID = function(q) {
        return v[q]
    }
    ;
    this.getAvatarList = function() {
        return v
    }
    ;
    this.createRoom = function(q, u, A) {
        y.addEventListener(ON_USEROWNERROOM_CREATE_SUCCESS, y._onRoomCreated);
        MULTIPLAYER_TEST_LOCAL && (g.multiplayer.developmentServer = "localhost:8184");
        console.log("maxusers:" + A);
        g.multiplayer.createJoinRoom(q, ROOM_TYPE_USEROWNER, !0, {
            id: q,
            pass: u,
            curusers: 1,
            maxusers: A
        }, {
            nickname: r,
            avatar: ""
        }, function(F) {
            f = F;
            F.addMessageCallback("*", h.messageHandler);
            F.addDisconnectCallback(y.callbackDisconnect);
            c[ON_USEROWNERROOM_CREATE_SUCCESS] && c[ON_USEROWNERROOM_CREATE_SUCCESS].call(b[ON_USEROWNERROOM_CREATE_SUCCESS])
        }, y.callbackError)
    }
    ;
    this.joinRoom = function(q) {
        y.addEventListener(ON_CONNECTION_ERROR, y._onRoomJoinedFailed);
        y.addEventListener(ON_USEROWNERROOM_JOIN_SUCCESS, y._onRoomJoined);
        t = q;
        MULTIPLAYER_TEST_LOCAL && (g.multiplayer.developmentServer = "localhost:8184");
        g.multiplayer.joinRoom(q, {
            nickname: r,
            avatar: ""
        }, function(u) {
            f = u;
            u.addMessageCallback("*", h.messageHandler);
            u.addDisconnectCallback(y.callbackDisconnect);
            c[ON_USEROWNERROOM_JOIN_SUCCESS] && c[ON_USEROWNERROOM_JOIN_SUCCESS].call(b[ON_USEROWNERROOM_JOIN_SUCCESS])
        }, y.callbackError)
    }
    ;
    this.gotoGameRoom = function(q) {
        MULTIPLAYER_TEST_LOCAL && (g.multiplayer.developmentServer = "localhost:8184");
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showLoading(TEXT_MATCH_FOUND.toUpperCase());
        var u = q.getString(0);
        l = q.getInt(1);
        q = q.getString(2);
        var A = JSON.parse(q);
        A = Object.values(A);
        z = [];
        v = [];
        for (var F = 0; F < A.length; F++)
            z[F] = A[F].nickname,
            v[F] = A[F].avatar;
        m = A.length;
        g.multiplayer.createJoinRoom(u, ROOM_TYPE_GAME, !0, {
            pass: "",
            maxusers: m,
            playersinfo: q
        }, {
            ingameid: l
        }, function(C) {
            y.disconnectFromCurRoom();
            f = C;
            C.addMessageCallback("*", h.messageHandler);
            C.addDisconnectCallback(y.callbackDisconnectFromMatch);
            c[ON_GAMEROOM_CONNECTION_SUCCESS] && c[ON_GAMEROOM_CONNECTION_SUCCESS].call(b[ON_GAMEROOM_CONNECTION_SUCCESS], m);
            y._onGameRoomEntered()
        }, y.callbackError)
    }
    ;
    this.gotoGameRoomWithBot = function() {
        MULTIPLAYER_TEST_LOCAL && (g.multiplayer.developmentServer = "localhost:8184");
        var q = randomFloatBetween(1E6, 2E6, 0) + "";
        l = 0;
        z = [];
        z[0] = r;
        z[1] = w;
        v = ["", ""];
        g.multiplayer.createJoinRoom(q, ROOM_TYPE_GAME, !0, {
            pass: "",
            maxusers: 2,
            bot: !0
        }, {
            ingameid: l
        }, function(u) {
            y.disconnectFromCurRoom();
            f = u;
            u.addMessageCallback("*", h.messageHandler);
            u.addDisconnectCallback(y.callbackDisconnectFromMatch);
            g_oCTLMultiplayer.closeAllDialog()
        }, y.callbackError)
    }
    ;
    this.gotoMatchMakingRoom = function() {
        MULTIPLAYER_TEST_LOCAL && (g.multiplayer.developmentServer = "localhost:8184");
        g.multiplayer.createJoinRoom("matchmakingroom1", ROOM_TYPE_MATCHMAKING, !0, null, {
            nickname: r,
            avatar: ""
        }, function(q) {
            f = q;
            q.addMessageCallback("*", h.messageHandler);
            q.addDisconnectCallback(y.callbackDisconnect);
            c[ON_MATCHMAKING_CONNECTION_SUCCESS] && c[ON_MATCHMAKING_CONNECTION_SUCCESS].call(b[ON_MATCHMAKING_CONNECTION_SUCCESS]);
            g_oCTLMultiplayer.closeAllDialog();
            g_oCTLMultiplayer.showLoading(TEXT_FIND_OPPONENT, "s_oNetworkManager._onDisconnectFromARoom")
        }, y.callbackError)
    }
    ;
    this._onGameRoomEntered = function() {
        p = setTimeout(function() {
            g_oCTLMultiplayer.closeAllDialog();
            g_oCTLMultiplayer.showGeneralDialog(TEXT_OPPONENT_LEFT, "s_oNetworkManager.gotoLobby");
            y.disconnect()
        }, WAITING_PLAYERS_TIMEOUT)
    }
    ;
    this.onGameStarted = function() {
        g_oCTLMultiplayer.closeAllDialog();
        clearTimeout(p)
    }
    ;
    this.tryCreateUniqueRoom = function(q, u, A) {
        t = q;
        B = u;
        k = A;
        g.multiplayer.listRooms(ROOM_TYPE_USEROWNER, {
            id: q
        }, 0, 0, y._onUniqueListRoomSearch, y.callbackError)
    }
    ;
    this._onUniqueListRoomSearch = function(q) {
        0 < q.length && (t += "-" + y._getRandomCodeNumber());
        y.createRoom(t, B, k)
    }
    ;
    this._onPlayNow = function() {
        y.sendMsg(MSG_PLAYNOW, "")
    }
    ;
    this._addBotInRoom = function() {
        COMBINED_PLAYERS_MODE && (y.sendMsg(MSG_ADDBOT, y.generateRandomName() + "-bot"),
        jQuery(".ctl-multiplayer-room-add-bot").addClass("ctl-multiplayer-display-none"),
        jQuery(".ctl-multiplayer-room-remove-bot").addClass("ctl-multiplayer-display-none"))
    }
    ;
    this._removeBotInRoom = function() {
        COMBINED_PLAYERS_MODE && (y.sendMsg(MSG_REMOVEBOT, ""),
        jQuery(".ctl-multiplayer-room-add-bot").addClass("ctl-multiplayer-display-none"),
        jQuery(".ctl-multiplayer-room-remove-bot").addClass("ctl-multiplayer-display-none"))
    }
    ;
    this.onBotAdded = function(q) {
        COMBINED_PLAYERS_MODE && (jQuery(".ctl-multiplayer-room-add-bot").removeClass("ctl-multiplayer-display-none"),
        jQuery(".ctl-multiplayer-room-remove-bot").removeClass("ctl-multiplayer-display-none"))
    }
    ;
    this.onBotRemoved = function(q) {
        COMBINED_PLAYERS_MODE && (0 < q ? (jQuery(".ctl-multiplayer-room-add-bot").removeClass("ctl-multiplayer-display-none"),
        jQuery(".ctl-multiplayer-room-remove-bot").removeClass("ctl-multiplayer-display-none")) : (jQuery(".ctl-multiplayer-room-add-bot").removeClass("ctl-multiplayer-display-none"),
        jQuery(".ctl-multiplayer-room-remove-bot").addClass("ctl-multiplayer-display-none")))
    }
    ;
    this.disconnectFromCurRoom = function() {
        f && (console.log("TEST"),
        f.removeDisconnectCallback(y.callbackDisconnect),
        f.disconnect())
    }
    ;
    this._onDisconnectFromARoom = function() {
        c[ON_BACK_FROM_A_ROOM] && c[ON_BACK_FROM_A_ROOM].call(b[ON_BACK_FROM_A_ROOM]);
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showLoading(TEXT_CONNECT_TO_LOBBY);
        y.disconnectFromCurRoom();
        setTimeout(function() {
            y.gotoLobby()
        }, 500)
    }
    ;
    this._onRoomCreated = function() {
        var q = {
            func: "s_oNetworkManager._addBotInRoom",
            label: TEXT_SYS_ADD_BOT,
            classes: "ctl-multiplayer-room-add-bot ctl-multiplayer-display-block"
        }
          , u = {
            func: "s_oNetworkManager._removeBotInRoom",
            label: TEXT_SYS_REMOVE_BOT,
            classes: "ctl-multiplayer-room-remove-bot ctl-multiplayer-display-none"
        }
          , A = [{
            func: "s_oNetworkManager._onPlayNow",
            label: TEXT_PLAY_NOW,
            classes: "ctl-multiplayer-room-play-now ctl-multiplayer-display-none"
        }, {
            func: "s_oNetworkManager._onDisconnectFromARoom",
            label: TEXT_SYS_BACK
        }];
        COMBINED_PLAYERS_MODE && A.push(q, u);
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showWaitingPlayersInRoom(TEXT_WAITING_FOR_PLAYERS_IN_ROOM + t, [r], A)
    }
    ;
    this._onRoomJoined = function() {
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showWaitingPlayersInRoom(TEXT_WAITING_FOR_PLAYERS_IN_ROOM + t, [], [{
            func: "s_oNetworkManager._onDisconnectFromARoom",
            label: TEXT_SYS_BACK
        }])
    }
    ;
    this._onRoomJoinedFailed = function(q) {
        y.addEventListener(ON_CONNECTION_ERROR, function() {});
        switch (q.code) {
        case ERROR_CODE_UNKNOWNROOM:
            g_oCTLMultiplayer.closeAllDialog(),
            g_oCTLMultiplayer.showGeneralDialog(TEXT_ROOM_DOESNT_EXIST, "s_oNetworkManager.gotoLobby")
        }
    }
    ;
    this.gotoLobby = function() {
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showLoading(TEXT_CONNECT_TO_LOBBY);
        y.refreshRooms()
    }
    ;
    this.refreshRooms = function() {
        g.multiplayer.listRooms(ROOM_TYPE_USEROWNER, null, 0, 0, y._onFillWithOwnerRoom, y.callbackError);
        g.multiplayer.listRooms(ROOM_TYPE_GAME, null, 0, 0, y._onFillWithGameRoom, y.callbackError)
    }
    ;
    this._onFillWithOwnerRoom = function(q) {
        n++;
        y._extractOwnerRoomInfo(q);
        2 <= n && y._onFinalUpdateRoomList()
    }
    ;
    this._onFillWithGameRoom = function(q) {
        n++;
        y._extractGameRoomInfo(q);
        2 <= n && y._onFinalUpdateRoomList()
    }
    ;
    this._onFinalUpdateRoomList = function() {
        var q = y._getCombinedRoomsLists();
        0 < jQuery(".ctl-multiplayer-room-list").length ? g_oCTLMultiplayer.refreshRoomList(q) : this._showLobby(q)
    }
    ;
    this._showLobby = function(q) {
        n = 0;
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showRoomList(q)
    }
    ;
    this._extractOwnerRoomInfo = function(q) {
        e = [];
        for (var u = 0; u < q.length; u++)
            e[u] = {
                name: q[u].id,
                "private": 0 === q[u].roomData.pass.length ? !1 : !0,
                accessible: !0,
                curusers: q[u].roomData.curusers,
                maxusers: q[u].roomData.maxusers
            };
        return e
    }
    ;
    this._extractGameRoomInfo = function(q) {
        d = [];
        for (var u = 0; u < q.length; u++)
            d[u] = {
                name: "game-" + q[u].id,
                "private": 0 === q[u].roomData.pass.length ? !1 : !0,
                accessible: !1,
                curusers: q[u].roomData.curusers,
                maxusers: q[u].roomData.maxusers
            };
        return d
    }
    ;
    this._getCombinedRoomsLists = function() {
        for (var q = [], u = 0; u < e.length; u++)
            q.push(e[u]);
        for (u = 0; u < d.length; u++)
            q.push(d[u]);
        return q
    }
    ;
    this.joinQuickMatch = function() {
        g_oCTLMultiplayer.showLoading(TEXT_NETWORK_CONNECTING);
        y.gotoMatchMakingRoom()
    }
    ;
    this.tryJoinRoomWithPass = function(q, u) {
        t = q;
        B = u;
        y.addEventListener(ON_ROOM_INFO_RETURNED, y._checkUserPermissionToJoin);
        y.getRoomInfo(q, u)
    }
    ;
    this._checkUserPermissionToJoin = function(q) {
        0 < q.length ? y.joinRoom(q[0].roomData.id, q[0].roomData.pass) : (g_oCTLMultiplayer.closeAllDialog(),
        g_oCTLMultiplayer.showGeneralDialog(TEXT_WRONG_PASSWORD, "s_oNetworkManager._onPasswordFailed"))
    }
    ;
    this._onPasswordFailed = function() {
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showTypeRoomPassword(t)
    }
    ;
    this.getRoomInfo = function(q, u) {
        g.multiplayer.listRooms(ROOM_TYPE_USEROWNER, {
            id: q,
            pass: u
        }, 0, 0, y._onRoomInfoReturned, y.callbackError)
    }
    ;
    this._onRoomInfoReturned = function(q) {
        c[ON_ROOM_INFO_RETURNED] && c[ON_ROOM_INFO_RETURNED].call(b[ON_ROOM_INFO_RETURNED], q)
    }
    ;
    this._init()
}
var MSG_ROOM_UPDATE = "room_update"
  , MSG_ROOM_IS_FULL = "room_is_full"
  , MSG_ROOM_EXPIRED = "room_expired"
  , MSG_GAME_FOUND = "game_found"
  , MSG_PLAYER_LEFT_GAME = "player_left_game"
  , MSG_REMATCH_PANEL = "rematch_panel"
  , MSG_REMATCH_ANSWER_RESULTS = "rematch_answer_results"
  , MSG_NEXTMATCH_ANSWER_RESULTS = "next_match_answer_results"
  , MSG_OPPONENT_MOVES = "opponent_moves"
  , MSG_PIECES_RECEIVED = "pieces_received"
  , MSG_START_THE_GAME = "start_the_game"
  , MSG_BOT_ADDED = "bot_added"
  , MSG_BOT_REMOVED = "bot_removed"
  , MSG_END_MATCH = "end_match"
  , MSG_END_GAME = "end_game"
  , MSG_ACCEPT_REMATCH = "accept_rematch"
  , MSG_ACCEPT_NEXTMATCH = "accept_next_match"
  , MSG_DISCONNECTION = "disconnection"
  , MSG_MOVE = "move"
  , MSG_REQUEST_PIECES = "request_pieces"
  , MSG_PLAYNOW = "play_now"
  , MSG_ADDBOT = "add_bot"
  , MSG_REMOVEBOT = "remove_bot";
function CNetworkMessageForwarder() {
    this._init = function() {}
    ;
    this.messageHandler = function(c) {
        switch (c.type) {
        case MSG_ROOM_UPDATE:
            a._onUpdateRoom(c);
            break;
        case MSG_ROOM_IS_FULL:
            a._onFullRoom(c);
            break;
        case MSG_ROOM_EXPIRED:
            a._onExpiredRoom(c);
            break;
        case MSG_GAME_FOUND:
            a._onGameFound(c);
            break;
        case MSG_PLAYER_LEFT_GAME:
            a._onOpponentLeftTheGame(c);
            break;
        case MSG_REMATCH_PANEL:
            a._onRematchPanel(c);
            break;
        case MSG_REMATCH_ANSWER_RESULTS:
            a._onRematchResults(c);
            break;
        case MSG_NEXTMATCH_ANSWER_RESULTS:
            a._onNextMatchResults(c);
            break;
        case MSG_OPPONENT_MOVES:
            a._onEnemyMoves(c);
            break;
        case MSG_PIECES_RECEIVED:
            a._onPiecesReceived(c);
            break;
        case MSG_START_THE_GAME:
            a._onGameStart(c);
            break;
        case MSG_BOT_ADDED:
            a._onBotAdded(c);
            break;
        case MSG_BOT_REMOVED:
            a._onBotRemoved(c)
        }
    }
    ;
    this._onUpdateRoom = function(c) {
        c = c.getString(0);
        var b = JSON.parse(c);
        c = b.nicknamelist;
        b = parseInt(b.maxnumplayers);
        g_oCTLMultiplayer.updateRoomUserList(c, b)
    }
    ;
    this._onFullRoom = function() {
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showGeneralDialog(TEXT_ROOM_IS_FULL, "s_oNetworkManager.gotoLobby")
    }
    ;
    this._onExpiredRoom = function() {
        s_oNetworkManager.disconnectFromCurRoom();
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showGeneralDialog(TEXT_ROOM_IS_EXPIRED, "s_oNetworkManager.gotoLobby")
    }
    ;
    this._onGameFound = function(c) {
        s_oNetworkManager.gotoGameRoom(c)
    }
    ;
    this._onGameStart = function(c) {
        c = c.getString(0);
        var b = JSON.parse(c);
        b = parseInt(b.maxusers);
        console.log(c);
        if (s_oMenu)
            s_oMenu.onRemoteGameStart(b);
        s_oNetworkManager.onGameStarted()
    }
    ;
    this._onBotAdded = function(c) {
        c = c.getInt(0);
        c = parseInt(JSON.parse(c));
        s_oNetworkManager.onBotAdded(c)
    }
    ;
    this._onBotRemoved = function(c) {
        c = c.getInt(0);
        c = parseInt(JSON.parse(c));
        s_oNetworkManager.onBotRemoved(c)
    }
    ;
    this._onOpponentLeftTheGame = function(c) {
        c = parseInt(c.getInt(0));
        console.log("_onOpponentLeftTheGame:" + c);
        s_oGame.opponentLeftTheGame(c)
    }
    ;
    this._onRematchPanel = function() {
        s_oGame.showRematchQuestion()
    }
    ;
    this._onNextMatchResults = function(c) {
        if (c.getBoolean(0))
            s_oGame.onOpponentAcceptNextMatch();
        else
            s_oGame.onOpponentRefuseNextMatch()
    }
    ;
    this._onRematchResults = function(c) {
        if (c.getBoolean(0))
            s_oGame.onOpponentAcceptRematch();
        else
            s_oGame.onOpponentRefuseRematch()
    }
    ;
    this._onPiecesReceived = function(c) {
        c = c.getString(0);
        c = JSON.parse(c);
        s_oGame._onPiecesReceived(c)
    }
    ;
    this._onEnemyMoves = function(c) {
        c = c.getString(0);
        c = JSON.parse(c);
        s_oGame.onActionReceived(c)
    }
    ;
    var a = this;
    this._init()
}
var CANVAS_WIDTH = 1920, CANVAS_HEIGHT = 1080, EDGEBOARD_X = 256, EDGEBOARD_Y = 84, PRIMARY_FONT = "comfortaabold", FPS = 30, FPS_TIME = 1E3 / FPS, DISABLE_SOUND_MOBILE = !1, ENABLE_FULLSCREEN = !0, GAME_PLAYERIO_ID = "four-colors-o2yb5hcxu2o4lkmfuuykw", GAME_NAME = "four_colors", MULTIPLAYER_TEST_LOCAL = !1, COMBINED_PLAYERS_MODE = !1, STATE_LOADING = 0, STATE_MENU = 1, STATE_HELP = 1, STATE_GAME = 3, STATE_SELECT_PLAYERS = 4, ON_MOUSE_DOWN = 0, ON_MOUSE_UP = 1, ON_MOUSE_OVER = 2, ON_MOUSE_OUT = 3, ON_DRAG_START = 4, ON_DRAG_END = 5, ON_CARD_DEALED = 6, ON_HOME = 7, ON_CHECK = 8, ON_NEXT = 9, ENABLE_CHECK_ORIENTATION, AD_SHOW_COUNTER, NUM_PLAYERS, STARTING_NUM_CARDS, CARD_WIDTH = 156, CARD_HEIGHT = 242, SOUNDTRACK_VOLUME_IN_GAME = .4, DEBUG_SHOW_CARDS = !1, CARD_SCORE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 20, 20, 20, 50, 50], NUM_PENALTY_CARDS = 2, GAME_SCORE_WIN = 250, BOTTOM = 0, TOP = 1, LEFT = 2, RIGHT = 3, HAND_POS = [];
HAND_POS.num_player_2 = [{
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2 + 350,
    side: BOTTOM
}, {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2 - 350,
    side: TOP
}];
HAND_POS.num_player_3 = [{
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2 + 350,
    side: BOTTOM
}, {
    x: CANVAS_WIDTH / 2 - 650,
    y: CANVAS_HEIGHT / 2 - 40,
    side: LEFT
}, {
    x: CANVAS_WIDTH / 2 + 650,
    y: CANVAS_HEIGHT / 2,
    side: RIGHT
}];
HAND_POS.num_player_4 = [{
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2 + 350,
    side: BOTTOM
}, {
    x: CANVAS_WIDTH / 2 - 650,
    y: CANVAS_HEIGHT / 2 - 40,
    side: LEFT
}, {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2 - 350,
    side: TOP
}, {
    x: CANVAS_WIDTH / 2 + 650,
    y: CANVAS_HEIGHT / 2 - 40,
    side: RIGHT
}];
var FOTOGRAM_COLOR = 52
  , FOTOGRAM_DRAW_FOUR = 53
  , ON_COLOR_SELECTED = 0
  , ACTION_NEXT_TURN = 0
  , ACTION_USE_CARD = 1
  , ACTION_ON_SHUFFLECARDS = 2
  , ACTION_ON_DRAWCARDS = 3
  , ACTION_ON_UNO_CLICK = 4
  , ACTION_SELECT_COLOR = 5
  , ACTION_DRAW_FOUR = 6
  , ACTION_BLOCK_TURN = 7
  , ACTION_INVERT_TURN = 8
  , ACTION_DRAW_TWO_COLORED = 9
  , EFFECT_SELECT_COLOR = 0
  , EFFECT_DRAW_FOUR = 1
  , EFFECT_STOP = 2
  , EFFECT_INVERT_TURN = 3
  , EFFECT_DRAW_TWO_COLORED = 4
  , EFFECT_NORMAL_CARD = 5
  , ON_APPLY_EFFECT = 0
  , ON_APPLY_PENALITY = 1
  , ON_UNO_CLICK = 2
  , DRAW_TYPE_NORMAL = 0
  , DRAW_TYPE_PENALITY = 1
  , DRAW_TYPE_DRAW2_COLORED = 2
  , DRAW_TYPE_DRAW3 = 3;
function CPreloader() {
    var a, c, b, e, d, f, g, h, l, k;
    this._init = function() {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
        s_oSpriteLibrary.addSprite("progress_bar", "./sprites/progress_bar.png");
        s_oSpriteLibrary.addSprite("200x200", "./sprites/200x200.jpg");
        s_oSpriteLibrary.addSprite("but_start", "./sprites/but_start.png");
        s_oSpriteLibrary.loadSprites();
        k = new createjs.Container;
        s_oStage.addChild(k)
    }
    ;
    this.unload = function() {
        k.removeAllChildren();
        l.unload()
    }
    ;
    this._onImagesLoaded = function() {}
    ;
    this._onAllImagesLoaded = function() {
        this.attachSprites();
        s_oMain.preloaderReady()
    }
    ;
    this.attachSprites = function() {
        var m = new createjs.Shape;
        m.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        k.addChild(m);
        m = s_oSpriteLibrary.getSprite("200x200");
        g = createBitmap(m);
        g.regX = .5 * m.width;
        g.regY = .5 * m.height;
        g.x = CANVAS_WIDTH / 2;
        g.y = CANVAS_HEIGHT / 2 - 180;
        k.addChild(g);
        h = new createjs.Shape;
        h.graphics.beginFill("rgba(0,0,0,0.01)").drawRoundRect(g.x - 100, g.y - 100, 200, 200, 10);
        k.addChild(h);
        g.mask = h;
        m = s_oSpriteLibrary.getSprite("progress_bar");
        e = createBitmap(m);
        e.x = CANVAS_WIDTH / 2 - m.width / 2;
        e.y = CANVAS_HEIGHT / 2 + 50;
        k.addChild(e);
        a = m.width;
        c = m.height;
        d = new createjs.Shape;
        d.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(e.x, e.y, 1, c);
        k.addChild(d);
        e.mask = d;
        b = new createjs.Text("","30px " + PRIMARY_FONT,"#fff");
        b.x = CANVAS_WIDTH / 2;
        b.y = CANVAS_HEIGHT / 2 + 100;
        b.textBaseline = "alphabetic";
        b.textAlign = "center";
        k.addChild(b);
        m = s_oSpriteLibrary.getSprite("but_start");
        l = new CTextButton(CANVAS_WIDTH / 2,CANVAS_HEIGHT / 2,m,TEXT_PRELOADER_CONTINUE,"Arial","#000","bold 50",k);
        l.addEventListener(ON_MOUSE_UP, this._onButStartRelease, this);
        l.setVisible(!1);
        f = new createjs.Shape;
        f.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        k.addChild(f);
        createjs.Tween.get(f).to({
            alpha: 0
        }, 500).call(function() {
            createjs.Tween.removeTweens(f);
            k.removeChild(f)
        })
    }
    ;
    this._onButStartRelease = function() {
        s_oMain.onRemovePreloader()
    }
    ;
    this.refreshLoader = function(m) {
        b.text = m + "%";
        100 === m && (s_oMain.onRemovePreloader(),
        b.visible = !1,
        e.visible = !1);
        d.graphics.clear();
        m = Math.floor(m * a / 100);
        d.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(e.x, e.y, m, c)
    }
    ;
    this._init()
}
function CMain(a) {
    var c, b = 0, e = 0, d = STATE_LOADING, f, g;
    this.initContainer = function() {
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
        s_oStage.preventSelection = !0;
        createjs.Touch.enable(s_oStage, !0);
        s_bMobile = isMobile();
        !1 === s_bMobile && s_oStage.enableMouseOver(FPS);
        s_iPrevTime = (new Date).getTime();
        createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.framerate = FPS;
        navigator.userAgent.match(/Windows Phone/i) && (DISABLE_SOUND_MOBILE = !0);
        s_oSpriteLibrary = new CSpriteLibrary;
        s_oNetworkManager = new CNetworkManager;
        f = new CPreloader
    }
    ;
    this.preloaderReady = function() {
        this._loadImages();
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || this._initSounds();
        c = !0
    }
    ;
    this.soundLoaded = function() {
        b++;
        f.refreshLoader(Math.floor(b / e * 100))
    }
    ;
    this._initSounds = function() {
        Howler.mute(!s_bAudioActive);
        s_aSoundsInfo = [];
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "soundtrack",
            loop: !0,
            volume: 1,
            ingamename: "soundtrack"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "click",
            loop: !1,
            volume: 1,
            ingamename: "click"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "game_over",
            loop: !1,
            volume: 1,
            ingamename: "game_over"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "card_dealing",
            loop: !1,
            volume: 1,
            ingamename: "card_dealing"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "snap",
            loop: !1,
            volume: 1,
            ingamename: "snap"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "card",
            loop: !1,
            volume: 1,
            ingamename: "card"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "special_card",
            loop: !1,
            volume: 1,
            ingamename: "special_card"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "change_color",
            loop: !1,
            volume: 1,
            ingamename: "change_color"
        });
        e += s_aSoundsInfo.length;
        s_aSounds = [];
        for (var l = 0; l < s_aSoundsInfo.length; l++)
            this.tryToLoadSound(s_aSoundsInfo[l], !1)
    }
    ;
    this.tryToLoadSound = function(l, k) {
        setTimeout(function() {
            s_aSounds[l.ingamename] = new Howl({
                src: [l.path + l.filename + ".mp3"],
                autoplay: !1,
                preload: !0,
                loop: l.loop,
                volume: l.volume,
                onload: s_oMain.soundLoaded,
                onloaderror: function(m, n) {
                    for (var p = 0; p < s_aSoundsInfo.length; p++)
                        if (m === s_aSounds[s_aSoundsInfo[p].ingamename]._sounds[0]._id) {
                            s_oMain.tryToLoadSound(s_aSoundsInfo[p], !0);
                            break
                        }
                },
                onplayerror: function(m) {
                    for (var n = 0; n < s_aSoundsInfo.length; n++)
                        if (m === s_aSounds[s_aSoundsInfo[n].ingamename]._sounds[0]._id) {
                            s_aSounds[s_aSoundsInfo[n].ingamename].once("unlock", function() {
                                s_aSounds[s_aSoundsInfo[n].ingamename].play();
                                "soundtrack" === s_aSoundsInfo[n].ingamename && null !== s_oGame && setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME)
                            });
                            break
                        }
                }
            })
        }, k ? 200 : 0)
    }
    ;
    this._loadImages = function() {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
        s_oSpriteLibrary.addSprite("msg_box", "./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("credits_panel", "./sprites/credits_panel.png");
        s_oSpriteLibrary.addSprite("select_color_panel", "./sprites/select_color_panel.png");
        s_oSpriteLibrary.addSprite("ctl_logo", "./sprites/ctl_logo.png");
        s_oSpriteLibrary.addSprite("but_info", "./sprites/but_info.png");
        s_oSpriteLibrary.addSprite("but_yes_big", "./sprites/but_yes_big.png");
        s_oSpriteLibrary.addSprite("but_exit_big", "./sprites/but_exit_big.png");
        s_oSpriteLibrary.addSprite("but_restart", "./sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("but_home", "./sprites/but_home.png");
        s_oSpriteLibrary.addSprite("but_uno", "./sprites/but_uno.png");
        s_oSpriteLibrary.addSprite("but_p2", "./sprites/but_p2.png");
        s_oSpriteLibrary.addSprite("but_p3", "./sprites/but_p3.png");
        s_oSpriteLibrary.addSprite("but_p4", "./sprites/but_p4.png");
        s_oSpriteLibrary.addSprite("but_red", "./sprites/oButRed.png");
        s_oSpriteLibrary.addSprite("but_green", "./sprites/oButGreen.png");
        s_oSpriteLibrary.addSprite("but_blue", "./sprites/oButBlue.png");
        s_oSpriteLibrary.addSprite("but_yellow", "./sprites/oButYellow.png");
        s_oSpriteLibrary.addSprite("stop_turn", "./sprites/stop_turn.png");
        s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_game", "./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("bg_select_players", "./sprites/bg_select_players.jpg");
        s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_fullscreen", "./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("but_arrow", "./sprites/arrow.png");
        s_oSpriteLibrary.addSprite("but_skip", "./sprites/but_skip.png");
        s_oSpriteLibrary.addSprite("line_player", "./sprites/line_players.png");
        s_oSpriteLibrary.addSprite("cards", "./sprites/cards.png");
        s_oSpriteLibrary.addSprite("colors", "./sprites/colors.png");
        s_oSpriteLibrary.addSprite("draw_3", "./sprites/draw_3.png");
        s_oSpriteLibrary.addSprite("draw_two_anim", "./sprites/draw_2.png");
        s_oSpriteLibrary.addSprite("stop_turn_anim", "./sprites/stop_turn.png");
        s_oSpriteLibrary.addSprite("clock_wise_anim", "./sprites/change_clockwise.png");
        s_oSpriteLibrary.addSprite("change_color", "./sprites/change_color.png");
        s_oSpriteLibrary.addSprite("cloud_uno", "./sprites/cloud.png");
        s_oSpriteLibrary.addSprite("finger", "./sprites/finger.png");
        s_oSpriteLibrary.addSprite("shuffle_anim", "./sprites/shuffle_anim.png");
        s_oSpriteLibrary.addSprite("local_but", "./sprites/local_but.png");
        s_oSpriteLibrary.addSprite("multiplayer_but", "./sprites/multiplayer_but.png");
        s_oSpriteLibrary.addSprite("but_next", "./sprites/but_next.png");
        s_oSpriteLibrary.addSprite("but_show", "./sprites/but_show.png");
        s_oSpriteLibrary.addSprite("score_icon", "./sprites/score_icon.png");
        s_oSpriteLibrary.addSprite("info_label", "./sprites/info_label.png");
        s_oSpriteLibrary.addSprite("cup_icon", "./sprites/cup_icon.png");
        e += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites()
    }
    ;
    this._onImagesLoaded = function() {
        b++;
        f.refreshLoader(Math.floor(b / e * 100))
    }
    ;
    this._onAllImagesLoaded = function() {}
    ;
    this.onRemovePreloader = function() {
        try {
            checkMoreGames(s_szGameID, "middle-left", ["cards", "board", "multiplayer"], [], -1, "blue")
        } catch (l) {}
        f.unload();
        s_oSoundtrack = playSound("soundtrack", 1, !0);
        this.gotoMenu()
    }
    ;
    this.gotoMenu = function() {
        try {
            showMoreGames()
        } catch (l) {}
        new CMenu;
        d = STATE_MENU
    }
    ;
    this.gotoSelectPlayers = function() {
        new CSelectPlayers;
        d = STATE_SELECT_PLAYERS
    }
    ;
    this.gotoGame = function(l) {
        s_bFirstGame = !1 === l ? !1 : !0;
        s_oGame = g = new CGameSingle(h);
        d = STATE_GAME
    }
    ;
    this.gotoGameMulti = function(l) {
        s_bFirstGame = !1;
        NUM_PLAYERS = l;
        s_oGame = g = new CGameMulti(h);
        d = STATE_GAME
    }
    ;
    this.gotoGameWithBot = function() {
        s_bFirstGame = !1;
        NUM_PLAYERS = 2;
        s_oGame = g = new CGameSingleWithBot(h);
        d = STATE_GAME
    }
    ;
    this.gotoHelp = function() {
        new CHelp;
        d = STATE_HELP
    }
    ;
    this.stopUpdate = function() {
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || Howler.mute(!0)
    }
    ;
    this.startUpdate = function() {
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || !s_bAudioActive || s_bAdShown || Howler.mute(!1)
    }
    ;
    this._update = function(l) {
        if (!1 !== c) {
            var k = (new Date).getTime();
            s_iTimeElaps = k - s_iPrevTime;
            s_iCntTime += s_iTimeElaps;
            s_iCntFps++;
            s_iPrevTime = k;
            1E3 <= s_iCntTime && (s_iCurFps = s_iCntFps,
            s_iCntTime -= 1E3,
            s_iCntFps = 0);
            d === STATE_GAME && g.update();
            s_oStage.update(l)
        }
    }
    ;
    s_oMain = this;
    var h = a;
    ENABLE_FULLSCREEN = ENABLE_CHECK_ORIENTATION = !0;
    STARTING_NUM_CARDS = 7;
    s_bAudioActive = !0;
    this.initContainer()
}
var s_bMobile, s_bAudioActive = !0, s_iCntTime = 0, s_iTimeElaps = 0, s_iPrevTime = 0, s_iCntFps = 0, s_iCurFps = 0, s_bFullscreen = !1, s_oDrawLayer, s_oStage, s_oMain, s_oSpriteLibrary, s_oSoundtrack = null, s_oCanvas, s_bFirstGame = !1, s_aSounds, s_aSoundsInfo, s_oNetworkManager, s_bMultiplayer, s_bPlayWithBot, s_oGame;
function CPanelTutorial() {
    var a, c, b, e, d, f, g;
    this.init = function() {
        g = new createjs.Container;
        f = 0;
        a = new createjs.Container;
        a.x = CANVAS_WIDTH / 2;
        a.y = CANVAS_HEIGHT / 2;
        c = new createBitmap(s_oSpriteLibrary.getSprite("msg_box"));
        c.regX = 398;
        c.regY = 258.5;
        c.alpha = .8;
        a.addChild(c);
        s_oStage.addChild(a);
        b = new CGfxButton(a.getBounds().width / 2 - 50,0,s_oSpriteLibrary.getSprite("but_arrow"),a);
        b.addEventListener(ON_MOUSE_DOWN, this.onButNext, this);
        var h = s_oSpriteLibrary.getSprite("but_arrow");
        e = new CGfxButton(-(a.getBounds().width / 2 - 50),0,h,a);
        e.addEventListener(ON_MOUSE_DOWN, this.onButBack, this);
        e.getButtonImage().rotation = 180;
        d = new CGfxButton(a.getBounds().width / 2 - 53,a.getBounds().height / 2 - 53,s_oSpriteLibrary.getSprite("but_skip"),a);
        d.addEventListener(ON_MOUSE_DOWN, this.onButSkip, this);
        this.loadPage(f)
    }
    ;
    this.loadPage = function(h) {
        switch (h) {
        case 0:
            e.setVisible(!1);
            new CTLText(g,-300,-200,600,50,50,"center","#fff",PRIMARY_FONT,1,0,0,TEXT_WELCOME,!0,!0,!0,!1);
            new CTLText(g,-80,-120,300,240,50,"center","#fff",PRIMARY_FONT,1,0,0,sprintf(TEXT_TUTORIAL1, GAME_SCORE_WIN),!0,!0,!0,!1);
            h = new CCard(-215,0,g,"card_1_7",0,0);
            h.setAnimTutorial("tutorial");
            a.addChild(g);
            break;
        case 1:
            e.setVisible(!0);
            new CTLText(g,-80,-120,300,240,50,"center","#fff",PRIMARY_FONT,1,0,0,sprintf(TEXT_TUTORIAL2, CARD_SCORE[12]),!0,!0,!0,!1);
            h = new CCard(-215,0,g,"card_0_12",0,0);
            h.setAnimTutorial("draw2tutorial");
            break;
        case 2:
            new CTLText(g,-80,-105,300,210,50,"center","#fff",PRIMARY_FONT,1,0,0,sprintf(TEXT_TUTORIAL3, CARD_SCORE[10]),!0,!0,!0,!1);
            h = new CCard(-215,0,g,"card_1_7",0,0);
            h.setAnimTutorial("stopTurnTutorial");
            break;
        case 3:
            new CTLText(g,-80,-105,300,210,50,"center","#fff",PRIMARY_FONT,1,0,0,sprintf(TEXT_TUTORIAL4, CARD_SCORE[11]),!0,!0,!0,!1);
            h = new CCard(-215,0,g,"card_1_7",0,0);
            h.setAnimTutorial("changeClockWiseTutorial");
            break;
        case 4:
            new CTLText(g,-80,-120,300,240,50,"center","#fff",PRIMARY_FONT,1,0,0,sprintf(TEXT_TUTORIAL5, CARD_SCORE[13]),!0,!0,!0,!1);
            h = new CCard(-215,0,g,FOTOGRAM_COLOR,0,0);
            h.instantShow();
            break;
        case 5:
            b.setVisible(!0);
            new CTLText(g,-80,-120,300,240,50,"center","#fff",PRIMARY_FONT,1,0,0,sprintf(TEXT_TUTORIAL6, CARD_SCORE[14]),!0,!0,!0,!1);
            h = new CCard(-215,0,g,FOTOGRAM_DRAW_FOUR,0,0);
            h.instantShow();
            break;
        case 6:
            b.setVisible(!1),
            new CTLText(g,-80,-120,300,240,50,"center","#fff",PRIMARY_FONT,1,0,0,sprintf(TEXT_TUTORIAL7, NUM_PENALTY_CARDS),!0,!0,!0,!1),
            h = new createBitmap(s_oSpriteLibrary.getSprite("but_uno")),
            h.regX = 50,
            h.regY = 50.5,
            h.x = -215,
            h.scaleX = 1.5,
            h.scaleY = 1.5,
            g.addChild(h)
        }
    }
    ;
    this.onButNext = function() {
        f++;
        g.removeAllChildren();
        this.loadPage(f)
    }
    ;
    this.onButBack = function() {
        f--;
        g.removeAllChildren();
        this.loadPage(f)
    }
    ;
    this.onButSkip = function() {
        s_oStage.removeChild(a);
        s_oGame._startGame()
    }
    ;
    this.init()
}
function CTurnManager() {
    var a, c, b, e;
    this.init = function() {
        a = !0;
        b = e = 0;
        c = b + 1;
        s_oTurnManager = this
    }
    ;
    this.changeClockWise = function() {
        a = !0 === a ? !1 : !0
    }
    ;
    this.nextTurn = function() {
        !0 === a ? (b++,
        b === NUM_PLAYERS && (b = 0),
        c = b + 1,
        c === NUM_PLAYERS && (c = 0)) : (b--,
        0 > b && (b = NUM_PLAYERS - 1),
        c = b - 1,
        0 > c && (c = NUM_PLAYERS - 1))
    }
    ;
    this.prevTurn = function() {
        !0 === a ? (b--,
        c = b + 1,
        0 > b && (b = NUM_PLAYERS - 1,
        c = 0)) : (b++,
        c = b - 1,
        b === NUM_PLAYERS && (b = 0,
        c = NUM_PLAYERS - 1))
    }
    ;
    this.setTurn = function(d) {
        b = d;
        c = !0 === a ? b === NUM_PLAYERS - 1 ? 0 : b + 1 : 0 === b ? NUM_PLAYERS - 1 : b - 1
    }
    ;
    this.setFirstPlayerToBegin = function() {
        this.setTurn(e);
        e++;
        e === NUM_PLAYERS && (e = 0)
    }
    ;
    this.resetClockWise = function() {
        a = !0
    }
    ;
    this.resetFirstPlayer = function() {
        e = 0
    }
    ;
    this.getTurn = function() {
        return b
    }
    ;
    this.getNextPlayer = function() {
        return c
    }
    ;
    this.getClockWise = function() {
        return a
    }
    ;
    this.init()
}
s_oTurnManager = null;
function CAnimation() {
    var a, c, b, e, d, f, g;
    this.init = function() {
        f = !1;
        var h = s_oSpriteLibrary.getSprite("draw_3");
        h = {
            images: [h],
            frames: {
                width: 292,
                height: 290,
                regX: 146,
                regY: 145
            },
            animations: {
                anim: {
                    frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                    next: "stop",
                    speed: .8
                },
                reverse: {
                    frames: [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
                    next: [0],
                    speed: .8
                },
                stop: [13]
            }
        };
        h = new createjs.SpriteSheet(h);
        a = new createjs.Sprite(h,0);
        h = s_oSpriteLibrary.getSprite("draw_two_anim");
        h = {
            images: [h],
            frames: {
                width: 292,
                height: 322,
                regX: 146,
                regY: 161
            },
            animations: {
                anim: {
                    frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                    next: "stop",
                    speed: .8
                },
                reverse: {
                    frames: [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
                    next: [0],
                    speed: .8
                },
                stop: [13]
            }
        };
        h = new createjs.SpriteSheet(h);
        c = new createjs.Sprite(h,0);
        h = s_oSpriteLibrary.getSprite("stop_turn_anim");
        b = new createBitmap(h,292,300);
        h = s_oSpriteLibrary.getSprite("clock_wise_anim");
        e = new createBitmap(h,292,300);
        h = s_oSpriteLibrary.getSprite("change_color");
        h = {
            images: [h],
            frames: {
                width: 328,
                height: 315,
                regX: 164,
                regY: 157.5
            },
            animations: {
                anim: {
                    frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
                    next: "anim",
                    speed: .8
                },
                stop: [16],
                color_0: {
                    frames: [0, 1, 2, 3, 4, 5, 6],
                    speed: .8
                },
                color_1: {
                    frames: [0, 1, 2],
                    speed: .8
                },
                color_2: {
                    frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
                    speed: .8
                },
                color_3: {
                    frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    speed: .8
                }
            }
        };
        h = new createjs.SpriteSheet(h);
        d = new createjs.Sprite(h,0);
        h = s_oSpriteLibrary.getSprite("shuffle_anim");
        h = {
            images: [h],
            frames: {
                width: 403,
                height: 386,
                regX: 201.5,
                regY: 193
            },
            animations: {
                anim: {
                    frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
                    next: "anim"
                },
                idle: [17]
            }
        };
        h = new createjs.SpriteSheet(h);
        g = new createjs.Sprite(h,"idle")
    }
    ;
    this.drawThreeAnim = function(h, l, k, m) {
        a.alpha = 0;
        a.x = CANVAS_WIDTH / 2;
        a.y = CANVAS_HEIGHT / 2;
        a.scaleX = .01;
        a.scaleY = .01;
        s_oStage.addChild(a);
        a.stop();
        playSound("special_card", .5, !1);
        (new createjs.Tween.get(a)).to({
            alpha: 1,
            scaleX: 1.4,
            scaleY: 1.4
        }, 200, createjs.Ease.cubicOut).wait(200).call(function() {
            a.gotoAndPlay("anim")
        }).wait(1E3).call(function() {
            a.gotoAndPlay("reverse")
        }).wait(200).to({
            alpha: 0,
            scaleX: .01,
            scaleY: .01
        }, 200, createjs.Ease.cubicIn).call(function() {
            s_oStage.removeChild(a);
            s_oGame.drawCardsTween(h, l, k, m)
        })
    }
    ;
    this.drawTwoAnim = function(h, l, k, m) {
        c.alpha = 0;
        c.x = CANVAS_WIDTH / 2;
        c.y = CANVAS_HEIGHT / 2;
        c.scaleX = .01;
        c.scaleY = .01;
        s_oStage.addChild(c);
        c.stop();
        playSound("special_card", .5, !1);
        (new createjs.Tween.get(c)).to({
            alpha: 1,
            scaleX: 1.4,
            scaleY: 1.4
        }, 200, createjs.Ease.cubicOut).wait(200).call(function() {
            c.gotoAndPlay("anim");
            setVolume("special_card", .2)
        }).wait(1E3).call(function() {
            c.gotoAndPlay("reverse");
            setVolume("special_card", .1)
        }).wait(200).to({
            alpha: 0,
            scaleX: .01,
            scaleY: .01
        }, 200, createjs.Ease.cubicIn).call(function() {
            s_oStage.removeChild(c);
            s_oGame.drawCardsTween(h, l, k, m)
        })
    }
    ;
    this.stopTurn = function() {
        return new Promise(function(h, l) {
            b.alpha = 0;
            b.regX = 146;
            b.regY = 150;
            b.x = CANVAS_WIDTH / 2;
            b.y = CANVAS_HEIGHT / 2;
            b.scaleX = .01;
            b.scaleY = .01;
            s_oStage.addChild(b);
            playSound("game_over", 1, !1);
            (new createjs.Tween.get(b)).to({
                alpha: 1,
                scaleX: 2,
                scaleY: 2
            }, 200, createjs.Ease.cubicOut).to({
                scaleX: 1.6,
                scaleY: 1.6
            }, 200).to({
                scaleX: 2,
                scaleY: 2
            }, 200).to({
                scaleX: 1.6,
                scaleY: 1.6
            }, 200).to({
                scaleX: 2,
                scaleY: 2
            }, 200).to({
                alpha: 0,
                scaleX: .01,
                scaleY: .01
            }, 200, createjs.Ease.cubicIn).call(function() {
                s_oStage.removeChild(b);
                h()
            })
        }
        )
    }
    ;
    this.changeClockWise = function(h) {
        return new Promise(function(l, k) {
            e.alpha = 0;
            e.rotation = 0;
            e.regX = 146;
            e.regY = 150;
            e.x = CANVAS_WIDTH / 2;
            e.y = CANVAS_HEIGHT / 2;
            e.scaleX = .01;
            e.scaleY = .01;
            s_oStage.addChild(e);
            playSound("special_card", .5, !1);
            !1 === h ? (new createjs.Tween.get(e)).to({
                alpha: 1,
                scaleX: 2,
                scaleY: 2
            }, 200, createjs.Ease.cubicOut).to({
                rotation: 360
            }, 500).wait(500).to({
                rotation: -360
            }, 500).wait(500).to({
                alpha: 0,
                scaleX: .01,
                scaleY: .01
            }, 200, createjs.Ease.cubicIn).call(function() {
                s_oStage.removeChild(e);
                l()
            }) : (new createjs.Tween.get(e)).to({
                alpha: 1,
                scaleX: 2,
                scaleY: 2
            }, 200, createjs.Ease.cubicOut).to({
                rotation: -360
            }, 500).wait(500).to({
                rotation: 360
            }, 500).wait(500).to({
                alpha: 0,
                scaleX: .01,
                scaleY: .01
            }, 200, createjs.Ease.cubicIn).call(function() {
                s_oStage.removeChild(e);
                l()
            })
        }
        )
    }
    ;
    this.changeColor = function(h) {
        return new Promise(function(l, k) {
            d.alpha = 0;
            d.x = CANVAS_WIDTH / 2;
            d.y = CANVAS_HEIGHT / 2;
            d.scaleX = .01;
            d.scaleY = .01;
            s_oStage.addChild(d);
            d.stop();
            playSound("change_color", .5, !1);
            (new createjs.Tween.get(d)).to({
                alpha: 1,
                scaleX: 1.4,
                scaleY: 1.4
            }, 200, createjs.Ease.cubicOut).call(function() {
                d.gotoAndPlay("anim")
            }).wait(1300).call(function() {
                f = !0;
                d.on("animationend", s_oCAnimation.endAnimation, s_oCAnimation, !1, l);
                d.gotoAndStop(16);
                d.gotoAndPlay("color_" + h)
            })
        }
        )
    }
    ;
    this.endAnimation = function(h, l) {
        !0 === f && (stopSound("change_color"),
        playSound("special_card", 1, !1),
        f = !1,
        d.removeAllEventListeners(),
        d.stop(),
        l(),
        (new createjs.Tween.get(d)).to({
            scaleX: 2,
            scaleY: 2
        }, 250).to({
            scaleX: 1.4,
            scaleY: 1.4
        }, 250).to({
            scaleX: 2,
            scaleY: 2
        }, 250).to({
            scaleX: 1.4,
            scaleY: 1.4
        }, 250).to({
            alpha: 0,
            scaleX: .1,
            scaleY: .1
        }, 200, createjs.Ease.cubicIn).call(function() {
            s_oStage.removeChild(d);
            d.gotoAndStop(0)
        }))
    }
    ;
    this.shuffleAnimation = function() {
        return new Promise(function(h, l) {
            g.alpha = 0;
            g.x = CANVAS_WIDTH / 2;
            g.y = CANVAS_HEIGHT / 2;
            g.scaleX = .01;
            g.scaleY = .01;
            s_oStage.addChild(g);
            g.stop();
            (new createjs.Tween.get(g)).to({
                alpha: 1,
                scaleX: 1.6,
                scaleY: 1.6
            }, 400, createjs.Ease.cubicOut).call(function() {
                g.gotoAndPlay("anim");
                playSound("card_dealing", 1, !0)
            }).wait(1700).call(function() {
                g.gotoAndStop("idle");
                stopSound("change_color")
            }).to({
                alpha: 0,
                scaleX: .01,
                scaleY: .01
            }, 300, createjs.Ease.cubicIn).call(function() {
                s_oStage.removeChild(g);
                stopSound("card_dealing");
                h()
            })
        }
        )
    }
    ;
    this.init();
    s_oCAnimation = this
}
s_oCAnimation = null;
function CMenu() {
    var a, c, b, e, d, f, g, h, l, k, m, n = null, p = null, r, z, v;
    this._init = function() {
        s_bMobile || $("#div_display_id").css("display", "block");
        g = createBitmap(s_oSpriteLibrary.getSprite("bg_menu"));
        s_oStage.addChild(g);
        var t = CANVAS_WIDTH / 2 - 300
          , B = CANVAS_HEIGHT - 400
          , w = s_oSpriteLibrary.getSprite("local_but");
        r = new CGfxButton(t,B,w,s_oStage);
        r.addEventListener(ON_MOUSE_UP, this._onButLocalRelease, this);
        t = CANVAS_WIDTH / 2 + 300;
        B = CANVAS_HEIGHT - 400;
        w = s_oSpriteLibrary.getSprite("multiplayer_but");
        z = new CGfxButton(t,B,w,s_oStage);
        z.addEventListener(ON_MOUSE_UP, this._onButMultiplayerRelease, this);
        w = s_oSpriteLibrary.getSprite("but_info");
        d = w.width / 2 + 10;
        f = w.height / 2 + 10;
        k = new CGfxButton(CANVAS_WIDTH / 2,CANVAS_HEIGHT - 240,w,s_oStage);
        k.addEventListener(ON_MOUSE_UP, this._onCreditsBut, this);
        if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile)
            w = s_oSpriteLibrary.getSprite("audio_icon"),
            b = CANVAS_WIDTH - w.height / 2 - 10,
            e = w.height / 2 + 10,
            l = new CToggle(b,e,w,s_bAudioActive,s_oStage),
            l.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        w = window.document;
        t = w.documentElement;
        n = t.requestFullscreen || t.mozRequestFullScreen || t.webkitRequestFullScreen || t.msRequestFullscreen;
        p = w.exitFullscreen || w.mozCancelFullScreen || w.webkitExitFullscreen || w.msExitFullscreen;
        !1 === ENABLE_FULLSCREEN && (n = !1);
        n && screenfull.isEnabled && (w = s_oSpriteLibrary.getSprite("but_fullscreen"),
        a = d + w.width / 2 + 10,
        c = f,
        m = new CToggle(a,c,w,s_bFullscreen,s_oStage),
        m.addEventListener(ON_MOUSE_UP, this._onFullscreen, this));
        h = new createjs.Shape;
        h.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        s_oStage.addChild(h);
        createjs.Tween.get(h).to({
            alpha: 0
        }, 1E3).call(function() {
            h.visible = !1
        });
        null !== s_oSoundtrack && setVolume("soundtrack", 1);
        this.refreshButtonPos()
    }
    ;
    this.unload = function() {
        r.unload();
        z.unload();
        h.visible = !1;
        k.unload();
        if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile)
            l.unload(),
            l = null;
        n && screenfull.isEnabled && m.unload();
        s_oStage.removeAllChildren();
        s_oMenu = null
    }
    ;
    this.refreshButtonPos = function() {
        k.setPosition(d + s_iOffsetX, s_iOffsetY + f);
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || l.setPosition(b - s_iOffsetX, s_iOffsetY + e);
        n && screenfull.isEnabled && m.setPosition(a + s_iOffsetX, c + s_iOffsetY)
    }
    ;
    this.resetFullscreenBut = function() {
        n && screenfull.isEnabled && m.setActive(s_bFullscreen)
    }
    ;
    this._onFullscreen = function() {
        s_bFullscreen ? p.call(window.document) : n.call(window.document.documentElement);
        sizeHandler()
    }
    ;
    this._onAudioToggle = function() {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive
    }
    ;
    this._onCreditsBut = function() {
        new CCreditsPanel
    }
    ;
    this._onButLocalRelease = function() {
        "undefined" !== typeof gdsdk && "undefined" !== gdsdk.showAd && gdsdk.showAd();
        try {
            hideMoreGames()
        } catch (t) {}
        $("#div_display_id").css("display", "none");
        s_bPlayWithBot = s_bMultiplayer = !1;
        s_oMenu.unload();
        $(s_oMain).trigger("start_session");
        s_oMain.gotoSelectPlayers()
    }
    ;
    this._onButMultiplayerRelease = function() {
        "undefined" !== typeof gdsdk && "undefined" !== gdsdk.showAd && gdsdk.showAd();
        try {
            hideMoreGames()
        } catch (t) {}
        $("#div_display_id").css("display", "none");
        $(s_oMain).trigger("start_session");
        s_bMultiplayer = !0;
        s_bPlayWithBot = !1;
        s_oNetworkManager.addEventListener(ON_MATCHMAKING_CONNECTION_SUCCESS, this._onMatchmakingConnected);
        s_oNetworkManager.addEventListener(ON_GAMEROOM_CONNECTION_SUCCESS, this.clearBotCheck);
        s_oNetworkManager.addEventListener(ON_BACK_FROM_A_ROOM, this.clearBotCheck);
        s_oNetworkManager.connectToSystem()
    }
    ;
    this.onRemoteGameStart = function(t) {
        s_oMenu.clearBotCheck();
        s_bMultiplayer = !0;
        s_bPlayWithBot = !1;
        s_oMenu.unload();
        s_oMain.gotoGameMulti(t)
    }
    ;
    this._onMatchmakingConnected = function() {
        s_oMenu._checkMatchWithBot()
    }
    ;
    this._checkMatchWithBot = function() {
        var t = randomFloatBetween(18E3, 26E3);
        v = setTimeout(function() {
            s_bPlayWithBot = s_bMultiplayer = !0;
            g_oCTLMultiplayer.closeAllDialog();
            s_oNetworkManager.disconnect();
            s_oNetworkManager.generateRandomName();
            s_oMenu.unload();
            s_oMain.gotoGameWithBot()
        }, t)
    }
    ;
    this.clearBotCheck = function() {
        clearTimeout(v)
    }
    ;
    s_oMenu = this;
    this._init()
}
var s_oMenu = null;
function CSelectPlayers() {
    var a, c, b, e, d, f, g, h, l = null, k = null, m;
    this._init = function() {
        var n = createBitmap(s_oSpriteLibrary.getSprite("bg_select_players"));
        s_oStage.addChild(n);
        n = s_oSpriteLibrary.getSprite("but_p2");
        d = new CGfxButton(CANVAS_WIDTH / 2 - 450,CANVAS_HEIGHT - 500,n,s_oStage);
        d.addEventListener(ON_MOUSE_UP, this._onButP2, this);
        n = s_oSpriteLibrary.getSprite("but_p3");
        f = new CGfxButton(CANVAS_WIDTH / 2 + 10,CANVAS_HEIGHT - 500,n,s_oStage);
        f.addEventListener(ON_MOUSE_UP, this._onButP3, this);
        n = s_oSpriteLibrary.getSprite("but_p4");
        g = new CGfxButton(CANVAS_WIDTH / 2 + 450,CANVAS_HEIGHT - 500,n,s_oStage);
        g.addEventListener(ON_MOUSE_UP, this._onButP4, this);
        new CTLText(s_oStage,CANVAS_WIDTH / 2 - 500,300,1E3,150,50,"center","#fff",PRIMARY_FONT,1,0,0,TEXT_SELECT_PLAYERS,!0,!0,!0,!1);
        if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile)
            n = s_oSpriteLibrary.getSprite("audio_icon"),
            b = CANVAS_WIDTH - n.height / 2 - 10,
            e = n.height / 2 + 10,
            m = new CToggle(b,e,n,s_bAudioActive,s_oStage),
            m.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        n = window.document;
        var p = n.documentElement;
        l = p.requestFullscreen || p.mozRequestFullScreen || p.webkitRequestFullScreen || p.msRequestFullscreen;
        k = n.exitFullscreen || n.mozCancelFullScreen || n.webkitExitFullscreen || n.msExitFullscreen;
        !1 === ENABLE_FULLSCREEN && (l = !1);
        l && screenfull.isEnabled && (n = s_oSpriteLibrary.getSprite("but_fullscreen"),
        a = n.width / 4 + 10,
        c = n.height / 2 + 10,
        h = new CToggle(a,c,n,s_bFullscreen,s_oStage),
        h.addEventListener(ON_MOUSE_UP, this._onFullscreen, this));
        this.refreshButtonPos()
    }
    ;
    this._onButP2 = function() {
        NUM_PLAYERS = 2;
        this.unload();
        $(s_oMain).trigger("select_players", 2);
        s_oMain.gotoGame()
    }
    ;
    this._onButP3 = function() {
        NUM_PLAYERS = 3;
        this.unload();
        $(s_oMain).trigger("select_players", 3);
        s_oMain.gotoGame()
    }
    ;
    this._onButP4 = function() {
        NUM_PLAYERS = 4;
        this.unload();
        $(s_oMain).trigger("select_players", 4);
        s_oMain.gotoGame()
    }
    ;
    this.unload = function() {
        if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile)
            m.unload(),
            m = null;
        l && screenfull.isEnabled && h.unload();
        d.unload();
        f.unload();
        g.unload();
        s_oStage.removeAllChildren();
        s_oSelectPlayers = null
    }
    ;
    this.refreshButtonPos = function() {
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || m.setPosition(b - s_iOffsetX, s_iOffsetY + e);
        l && screenfull.isEnabled && h.setPosition(a + s_iOffsetX, c + s_iOffsetY)
    }
    ;
    this.resetFullscreenBut = function() {
        l && screenfull.isEnabled && h.setActive(s_bFullscreen)
    }
    ;
    this._onFullscreen = function() {
        s_bFullscreen ? k.call(window.document) : l.call(window.document.documentElement);
        sizeHandler()
    }
    ;
    this._onAudioToggle = function() {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive
    }
    ;
    s_oSelectPlayers = this;
    this._init()
}
var s_oSelectPlayers = null;
function CCard(a, c, b, e, d, f, g) {
    var h, l, k, m, n, p, r, z, v, t, B, w;
    this._init = function(q, u, A, F, C, L, J) {
        B = A;
        m = C;
        n = L;
        k = F;
        this.setEffect(F);
        h = !1;
        w = J;
        l = 0 === n || 2 === n ? "red" : "black";
        t = new createjs.Container;
        t.x = q;
        t.y = u;
        B.addChild(t);
        q = {
            images: [s_oSpriteLibrary.getSprite("cards")],
            frames: {
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                regX: CARD_WIDTH / 2,
                regY: CARD_HEIGHT / 2
            },
            animations: {
                card_0_0: [0],
                card_0_1: [1],
                card_0_2: [2],
                card_0_3: [3],
                card_0_4: [4],
                card_0_5: [5],
                card_0_6: [6],
                card_0_7: [7],
                card_0_8: [8],
                card_0_9: [9],
                card_0_10: [10],
                card_0_11: [11],
                card_0_12: [12],
                card_1_0: [13],
                card_1_1: [14],
                card_1_2: [15],
                card_1_3: [16],
                card_1_4: [17],
                card_1_5: [18],
                card_1_6: [19],
                card_1_7: [20],
                card_1_8: [21],
                card_1_9: [22],
                card_1_10: [23],
                card_1_11: [24],
                card_1_12: [25],
                card_2_0: [26],
                card_2_1: [27],
                card_2_2: [28],
                card_2_3: [29],
                card_2_4: [30],
                card_2_5: [31],
                card_2_6: [32],
                card_2_7: [33],
                card_2_8: [34],
                card_2_9: [35],
                card_2_10: [36],
                card_2_11: [37],
                card_2_12: [38],
                card_3_0: [39],
                card_3_1: [40],
                card_3_2: [41],
                card_3_3: [42],
                card_3_4: [43],
                card_3_5: [44],
                card_3_6: [45],
                card_3_7: [46],
                card_3_8: [47],
                card_3_9: [48],
                card_3_10: [49],
                card_3_11: [50],
                card_3_12: [51],
                color: [52],
                draw_four: [53],
                back: [54],
                tutorial: {
                    frames: [20, 5, 47, 31],
                    speed: .1
                },
                draw2tutorial: {
                    frames: [12, 25, 38, 51],
                    speed: .1
                },
                stopTurnTutorial: {
                    frames: [10, 23, 36, 49],
                    speed: .1
                },
                changeClockWiseTutorial: {
                    frames: [11, 24, 37, 50],
                    speed: .1
                }
            }
        };
        q = new createjs.SpriteSheet(q);
        v = createSprite(q, "back", CARD_WIDTH / 2, CARD_HEIGHT / 2, CARD_WIDTH, CARD_HEIGHT);
        v.stop();
        t.addChild(v);
        v.on("mousedown", this._mouseDown);
        r = [];
        z = []
    }
    ;
    this.getCardSprite = function() {
        return v
    }
    ;
    this.setEffect = function(q) {
        switch (q) {
        case 52:
            p = EFFECT_SELECT_COLOR;
            break;
        case 53:
            p = EFFECT_DRAW_FOUR;
            break;
        default:
            switch (m) {
            case 10:
                p = EFFECT_STOP;
                break;
            case 11:
                p = EFFECT_INVERT_TURN;
                break;
            case 12:
                p = EFFECT_DRAW_TWO_COLORED;
                break;
            default:
                p = q === FOTOGRAM_COLOR ? EFFECT_SELECT_COLOR : q === FOTOGRAM_DRAW_FOUR ? EFFECT_DRAW_FOUR : EFFECT_NORMAL_CARD
            }
        }
    }
    ;
    this.setAnimTutorial = function(q) {
        v.gotoAndPlay(q)
    }
    ;
    this.unload = function() {
        v.off("mousedown", this._mouseDown);
        B.removeChild(t)
    }
    ;
    this.unloadEvent = function() {
        v.off("mousedown", this._mouseDown)
    }
    ;
    this.saveInfo = function() {
        return {
            szFotogram: k,
            iRank: m,
            iSuit: n,
            bValue: !0
        }
    }
    ;
    this.instantShow = function() {
        v.gotoAndStop(k)
    }
    ;
    this.setValue = function() {
        v.gotoAndStop(k);
        playSound("card", 1, !1);
        createjs.Tween.get(t).to({
            scaleX: 1
        }, 200)
    }
    ;
    this.setActive = function(q) {
        q ? t.addChild(void 0) : t.removeChild(void 0)
    }
    ;
    this.setVisible = function(q) {
        t.visible = !0 === q ? !0 : !1
    }
    ;
    this.onSetTurned = function() {
        h = !0
    }
    ;
    this.offSetTurned = function() {
        h = !1
    }
    ;
    this.moveCard = function(q, u, A, F) {
        var C = this;
        createjs.Tween.get(t).wait(F).to({
            x: q,
            y: u
        }, A, createjs.Ease.linear).call(function() {
            s_oGame.playedCard(C)
        })
    }
    ;
    this.moveCardFirstHand = function(q, u, A, F) {
        var C = this;
        createjs.Tween.get(t).wait(F).to({
            x: q,
            y: u
        }, A, createjs.Ease.cubicOut).call(function() {
            playSound("card_dealing", 1, !1);
            s_oGame.onCardDealed(C)
        })
    }
    ;
    this.moveFirstLastCard = function(q, u, A, F) {
        var C = this;
        createjs.Tween.get(t).wait(F).to({
            x: q,
            y: u
        }, A, createjs.Ease.linear).call(function() {
            s_oGame.onFirstLastCardDealed(C)
        })
    }
    ;
    this.setOnTop = function() {
        B.addChildAt(t, B.numChildren)
    }
    ;
    this.stackAndDeactive = function(q, u, A) {
        createjs.Tween.get(t).to({
            x: q,
            y: u
        }, A, createjs.Ease.cubicOut)
    }
    ;
    this._mouseDown = function(q) {
        !1 !== h && s_oGame.playCard(y, q)
    }
    ;
    this.showCard = function(q, u) {
        var A = this;
        createjs.Tween.get(t).wait(q).to({
            scaleX: .1
        }, 200).call(function() {
            A.setValue(u)
        }).call(function() {})
    }
    ;
    this.showCardNoInput = function(q, u) {
        var A = this;
        createjs.Tween.get(t).wait(q).to({
            scaleX: .1
        }, 200).call(function() {
            A.setValue(u)
        }).call(function() {
            h = !1
        })
    }
    ;
    this.hideCard = function() {
        var q = this;
        createjs.Tween.get(t).to({
            scaleX: .1
        }, 200).call(function() {
            q.setBack()
        })
    }
    ;
    this.setPos = function(q, u) {
        t.x = q;
        t.y = u
    }
    ;
    this.setBack = function() {
        h = !1;
        v.gotoAndStop("back");
        var q = this;
        createjs.Tween.get(t).to({
            scaleX: 1
        }, 200).call(function() {
            q.cardHidden()
        })
    }
    ;
    this.cardHidden = function() {
        r[ON_CARD_HIDE] && r[ON_CARD_HIDE].call(z[ON_CARD_HIDE], this)
    }
    ;
    this.getEffect = function() {
        return p
    }
    ;
    this.getRank = function() {
        return m
    }
    ;
    this.getSuit = function() {
        return n
    }
    ;
    this.getColor = function() {
        return l
    }
    ;
    this.getFotogram = function() {
        return k
    }
    ;
    this.getPos = function() {
        return {
            x: t.x,
            y: t.y
        }
    }
    ;
    this.getSprite = function() {
        return t
    }
    ;
    this.getLogicRect = function() {
        return new createjs.Rectangle(t.x - CARD_WIDTH / 2,t.y - CARD_HEIGHT / 2,CARD_WIDTH,CARD_HEIGHT)
    }
    ;
    this.getTurned = function() {
        return h
    }
    ;
    this.getGlobalToLocal = function(q, u) {
        return v.globalToLocal(q / s_oStage.scaleX, u / s_oStage.scaleY)
    }
    ;
    this.getUniqueID = function() {
        return w
    }
    ;
    var y = this;
    this._init(a, c, b, e, d, f, g)
}
function CDeckDisplayer(a, c, b, e) {
    var d, f, g, h, l, k, m;
    this._init = function() {
        l = b;
        d = [];
        f = new createjs.Container;
        f.x = a;
        f.y = c;
        f.on("mousedown", this.onDraw, this);
        l.addChild(f);
        if (e) {
            h = new createjs.Container;
            h.x = a;
            h.y = c;
            h.visible = !1;
            l.addChild(h);
            var n = s_oSpriteLibrary.getSprite("finger")
              , p = n.width / 5
              , r = n.height / 2;
            n = new createjs.SpriteSheet({
                images: [n],
                frames: {
                    width: p,
                    height: r,
                    regX: p / 2,
                    regY: r / 2
                },
                animations: {
                    idle: {
                        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        speed: .9
                    }
                }
            });
            k = createSprite(n, "idle", p / 2, r / 2, p, r);
            k.scaleX = .5;
            k.scaleY = .5;
            k.x = -100;
            k.y = -100;
            h.addChild(k)
        }
        g = !1
    }
    ;
    this.initializeDeck = function() {
        for (var n, p = 0, r = 0; 4 > r; r++)
            for (var z = 0; 10 > z; z++)
                n = z,
                d.push(new CCard(0,0,f,"card_" + r + "_" + z,n,r,p++));
        for (r = 0; 4 > r; r++)
            for (z = 0; 9 > z; z++)
                n = z + 1,
                d.push(new CCard(0,0,f,"card_" + r + "_" + n,n,r,p++));
        for (r = 0; 4 > r; r++)
            for (z = 0; 2 > z; z++)
                d.push(new CCard(0,0,f,"card_" + r + "_10",10,r,p++)),
                d.push(new CCard(0,0,f,"card_" + r + "_11",11,r,p++)),
                d.push(new CCard(0,0,f,"card_" + r + "_12",12,r,p++));
        for (r = 0; 4 > r; r++)
            d.push(new CCard(0,0,f,FOTOGRAM_COLOR,13,4,p++)),
            d.push(new CCard(0,0,f,FOTOGRAM_DRAW_FOUR,14,4,p++))
    }
    ;
    this.initializeFromData = function(n) {
        for (var p, r, z = 0, v = 0; v < n.length; v++) {
            switch (n[v]) {
            case FOTOGRAM_COLOR:
                p = 13;
                r = 4;
                break;
            case FOTOGRAM_DRAW_FOUR:
                p = 14;
                r = 4;
                break;
            default:
                p = n[v] % 13,
                r = Math.floor(n[v] / 13)
            }
            d.push(new CCard(0,0,f,n[v],p,r,z++))
        }
    }
    ;
    this.shuffle = function() {
        var n;
        for (n = d.length; n; n--) {
            var p = Math.floor(Math.random() * n);
            var r = d[n - 1];
            d[n - 1] = d[p];
            d[p] = r
        }
    }
    ;
    this.clearCards = function() {
        for (var n = 0; n < d.length; n++)
            d[n].unload();
        d = []
    }
    ;
    this.moveContainer = function(n, p, r, z) {
        createjs.Tween.get(f).wait(z).to({
            x: n,
            y: p
        }, r, createjs.Ease.linear)
    }
    ;
    this.takeFirstLastCard = function() {
        return d.pop()
    }
    ;
    this.takeLastCard = function() {
        return d.pop()
    }
    ;
    this.getLastCard = function() {
        return d[d.length - 1]
    }
    ;
    this.getCardByIndex = function(n) {
        return d[n]
    }
    ;
    this.removeCardByIndex = function(n) {
        return d.splice(n, 1)
    }
    ;
    this.pushCard = function(n) {
        d.push(n)
    }
    ;
    this.getContainer = function() {
        return f
    }
    ;
    this.getLength = function() {
        return d.length
    }
    ;
    this.onDraw = function() {
        if (!1 === g)
            s_oGame.onDraw()
    }
    ;
    this.disableInputUsedCards = function() {
        d[d.length - 1].offSetTurned()
    }
    ;
    this.disableInputDraw = function() {
        g = !0
    }
    ;
    this.enableInputDraw = function() {
        g = !1
    }
    ;
    this.getIndexChild = function() {
        return s_oStage.getChildIndex(f)
    }
    ;
    this.setChildDepth = function(n) {
        s_oStage.addChildAt(f, n)
    }
    ;
    this.getGlobalPosition = function() {
        return {
            x: f.x,
            y: f.y
        }
    }
    ;
    this.setOnTop = function() {
        l.addChildAt(f, l.numChildren)
    }
    ;
    this.setHelp = function() {
        l.setChildIndex(h, l.numChildren - 1);
        this.setPointer(!0);
        m = setTimeout(function() {
            h.visible = !0
        }, 5E3)
    }
    ;
    this.hideHelp = function() {
        clearTimeout(m);
        h.visible = !1;
        this.setPointer(!1)
    }
    ;
    this.setPointer = function(n) {
        f.cursor = n ? "pointer" : "default"
    }
    ;
    this.addNewCardUnderTheDeck = function(n) {
        for (var p = 0; p < n.length; p++)
            d.push(n[p])
    }
    ;
    this.removeAllCardUnderTheDeck = function() {
        for (var n = [], p = 0; p < d.length - 1; p++)
            d[p].unload(),
            n.push(d.shift()),
            p--;
        return n
    }
    ;
    this._init()
}
function CHandDisplayer(a, c, b, e, d, f, g, h) {
    var l, k, m, n, p, r, z, v, t, B, w, y;
    this.init = function() {
        w = g;
        B = 0;
        y = d;
        n = [];
        p = new createjs.Container;
        t = f;
        t.addChild(p);
        r = new CPlayerInfo(b,e,t,g);
        z = new CInfoLabel(b,e,t);
        z.setVisible(!1);
        var q = {
            images: [s_oSpriteLibrary.getSprite("cloud_uno")],
            frames: {
                width: 261,
                height: 194,
                regX: 130.5,
                regY: 97
            },
            animations: {
                cloud1: [0],
                cloud2: [1]
            }
        };
        q = new createjs.SpriteSheet(q);
        v = new createjs.Sprite(q,"cloud1");
        v.alpha = 0;
        v.scaleX = .1;
        v.scaleY = .1;
        this.setPosition(a, c, b, e, h)
    }
    ;
    this.setPosition = function(q, u, A, F, C) {
        l = q;
        k = u;
        p.x = A;
        p.y = F;
        m = C;
        z.setPosition(p.x, p.y, m);
        switch (C) {
        case BOTTOM:
            var L = p.x;
            var J = p.y - 140;
            break;
        case TOP:
            L = p.x;
            J = p.y + 140;
            break;
        case LEFT:
            L = p.x + 110;
            J = p.y;
            z.setPosition(p.x + 20, p.y, m);
            break;
        case RIGHT:
            L = p.x - 110,
            J = p.y,
            z.setPosition(p.x - 20, p.y, m)
        }
        r.setPosition(L, J, m)
    }
    ;
    this.clearCards = function() {
        for (var q = 0; q < n.length; q++)
            n[q].unload();
        n = []
    }
    ;
    this.getGlobalPosition = function() {
        for (var q = 0, u = 0, A = 0; A < n.length; A++)
            0 !== l ? q += CARD_WIDTH / 2 : u += CARD_HEIGHT / 2;
        return {
            x: p.x + q,
            y: p.y + u
        }
    }
    ;
    this.getContainerPos = function() {
        return {
            x: p.x,
            y: p.y
        }
    }
    ;
    this.getCardPositionByIndex = function(q) {
        q = n[q].getPos();
        return {
            x: q.x,
            y: q.y
        }
    }
    ;
    this.searchIndexCard = function(q) {
        for (var u = 0; u < n.length; u++)
            if (q === n[u])
                return u
    }
    ;
    this.removeCardByIndex = function(q) {
        return n.splice(q, 1)
    }
    ;
    this.getPosNewCard = function() {
        return {
            x: n.length * l,
            y: n.length * k
        }
    }
    ;
    this.pushCard = function(q) {
        n.push(q);
        if (0 === k && p.y > CANVAS_HEIGHT / 2)
            n[n.length - 1].getCardSprite().on("mouseover", this.onMouseOver)
    }
    ;
    this.getContainer = function() {
        return p
    }
    ;
    this.getLastCard = function() {
        return n[n.length - 1]
    }
    ;
    this.getLength = function() {
        return n.length
    }
    ;
    this.centerContainer = function() {
        var q = p.getBounds();
        0 !== l ? createjs.Tween.get(p).to({
            x: CANVAS_WIDTH / 2 - q.width / 2 + CARD_WIDTH / 2
        }, 300, createjs.Ease.linear) : createjs.Tween.get(p).to({
            y: CANVAS_HEIGHT / 2 - q.height / 2 + CARD_HEIGHT / 1.5 - 40
        }, 300, createjs.Ease.linear)
    }
    ;
    this.setOnTop = function() {
        t.addChildAt(p, t.numChildren)
    }
    ;
    this.setChildDepth = function(q) {
        q > p.s_oStage.numChild - 1 && (q = p.s_oStage.numChild - 1);
        s_oStage.addChildAt(q)
    }
    ;
    this.getContainerInfo = function() {
        return p.getBounds()
    }
    ;
    this.getCardByIndex = function(q) {
        return n[q]
    }
    ;
    this.organizeHand = function(q) {
        var u = this;
        if (0 !== l)
            for (var A = 0; A < n.length; A++)
                q = l * A,
                createjs.Tween.get(n[A].getSprite()).to({
                    x: q
                }, 300, createjs.Ease.linear).call(u.centerContainer);
        else
            for (A = 0; A < n.length; A++)
                q = k * A,
                createjs.Tween.get(n[A].getSprite()).to({
                    y: q
                }, 300, createjs.Ease.linear).call(function() {
                    u.centerContainer()
                })
    }
    ;
    this.setOnTurn = function() {
        r.highlight()
    }
    ;
    this.setOffTurn = function() {
        r.disable()
    }
    ;
    this.checkUno = function() {
        1 === n.length && (this.setOnTop(),
        0 !== l ? p.y < CANVAS_HEIGHT / 2 ? (v.gotoAndStop("cloud2"),
        v.x = CANVAS_WIDTH / 2 - 270,
        v.y = CANVAS_HEIGHT / 2 - 300) : (v.gotoAndStop("cloud1"),
        v.x = CANVAS_WIDTH / 2 + 300,
        v.y = CANVAS_HEIGHT / 2 + 100) : p.x < CANVAS_WIDTH / 2 ? (v.gotoAndStop("cloud1"),
        v.x = CANVAS_WIDTH / 2 - 350,
        v.y = CANVAS_HEIGHT / 2 - 30) : (v.gotoAndStop("cloud2"),
        v.x = CANVAS_WIDTH / 2 + 350,
        v.y = CANVAS_HEIGHT / 2 - 200),
        s_oStage.addChild(v),
        (new createjs.Tween.get(v)).to({
            alpha: 1,
            scaleX: 1,
            scaleY: 1
        }, 300, createjs.Ease.bounceOut).wait(1500).to({
            scaleX: .1,
            scaleY: .1
        }, 300, createjs.Ease.cubicIn).to({
            alpha: 0
        }, 20).call(function() {
            s_oStage.removeChild(v)
        }))
    }
    ;
    this.onMouseOver = function(q) {
        s_bMobile || (q.target.cursor = "pointer")
    }
    ;
    this.showAllCards = function() {
        for (var q = 0; q < n.length; q++)
            n[q].showCard()
    }
    ;
    this.changeName = function(q) {
        w = q;
        r.setName(q)
    }
    ;
    this.refreshScore = function() {
        r.setScore(B);
        z.setVisible(!1)
    }
    ;
    this.getCardByUniqueID = function(q) {
        for (var u = 0; u < n.length; u++)
            if (n[u].getUniqueID() === q)
                return n[u]
    }
    ;
    this.getPlayerID = function() {
        return y
    }
    ;
    this.getName = function() {
        return w
    }
    ;
    this.getSide = function() {
        return m
    }
    ;
    this.getScore = function() {
        return B
    }
    ;
    this.setScore = function(q) {
        B = q
    }
    ;
    this.showHandScore = function(q) {
        z.setVisible(!0);
        z.setTextScore(q);
        z.setOnTop()
    }
    ;
    this.calculateHandScore = function() {
        for (var q = 0, u = 0; u < n.length; u++) {
            var A = n[u].getRank();
            q += CARD_SCORE[A]
        }
        return q
    }
    ;
    this.init()
}
var CGameBase = function(a) {
    this._iCounterDraw;
    this._oInterface;
    this._oParent;
    this._oDeck;
    this._aPlayersHand;
    this._oUsedCards;
    this._oTurnManager;
    this._iCurrentColor;
    this._bUNO;
    this._bEndGame;
    this._oAnimation;
    this._iCurPlayer;
    this._iNextPlayer;
    this._oFinger;
    this._oFade;
    this._oDecksContainer;
    this._oHandsContainer;
    this._oCardsContainer;
    this._oAIManager;
    this._oUnoController;
    this._oSummaryPanel
};
CGameBase.prototype._init = function() {
    this._bEndGame = this._bUNO = !1;
    this._iCounterDraw = 0;
    this._oTurnManager = new CTurnManager;
    this._oAnimation = new CAnimation;
    var a = createBitmap(s_oSpriteLibrary.getSprite("bg_game"));
    s_oStage.addChild(a);
    this._oUnoController = new CUnoController;
    this._oInterface = new CInterface;
    this._oCardsContainer = new createjs.Container;
    this._oHandsContainer = new createjs.Container;
    this._oPanelContainer = new createjs.Container;
    this._oDecksContainer = new createjs.Container;
    a = [];
    a[0] = TEXT_PLAYER_1;
    a[1] = TEXT_PLAYER_2;
    a[2] = TEXT_PLAYER_3;
    a[3] = TEXT_PLAYER_4;
    this._aPlayersHand = [];
    for (var c = 0; c < NUM_PLAYERS; c++) {
        var b = 0
          , e = 0;
        HAND_POS["num_player_" + NUM_PLAYERS][c].x === CANVAS_WIDTH / 2 ? b = CARD_WIDTH / 2 : e = CARD_HEIGHT / 4;
        this._aPlayersHand[c] = new CHandDisplayer(b,e,HAND_POS["num_player_" + NUM_PLAYERS][c].x,HAND_POS["num_player_" + NUM_PLAYERS][c].y,c,this._oHandsContainer,a[c],HAND_POS["num_player_" + NUM_PLAYERS][c].side)
    }
    this._oCardsContainer.addChild(this._oDecksContainer);
    this._oCardsContainer.addChild(this._oHandsContainer);
    s_oStage.addChild(this._oCardsContainer);
    s_oStage.addChild(this._oPanelContainer);
    this._oSummaryPanel = new CSummaryPanel(this._oPanelContainer);
    this._oSummaryPanel.addEventListener(ON_CHECK, this._onCheck, this);
    this._oMsgBox = new CMsgBox(this._oPanelContainer);
    this._oDeck = new CDeckDisplayer(CANVAS_WIDTH / 2,CANVAS_HEIGHT / 2,this._oDecksContainer,!0);
    this._oUsedCards = new CDeckDisplayer(CANVAS_WIDTH / 2 + CARD_WIDTH,CANVAS_HEIGHT / 2,this._oDecksContainer,!1);
    this._oUsedCards.disableInputDraw();
    this.setOffTurn();
    this._oAIManager = new CAIManager;
    setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME)
}
;
CGameBase.prototype.reset = function() {
    this._iCounterDraw = 0;
    this._oTurnManager.resetClockWise();
    this._oDeck.clearCards();
    this._oUsedCards.clearCards();
    this._oUsedCards.disableInputDraw();
    for (var a = 0; a < this._aPlayersHand.length; a++)
        this._aPlayersHand[a].clearCards(),
        this._aPlayersHand[a].refreshScore();
    this._oSummaryPanel.reset();
    this.setOffTurn()
}
;
CGameBase.prototype.getFirstHand = function() {
    var a = this._oDeck.takeLastCard()
      , c = this._oTurnManager.getTurn()
      , b = this._aPlayersHand[c].getContainerPos();
    c = this._aPlayersHand[c].getPosNewCard();
    var e = this._oDeck.getGlobalPosition();
    a.setOnTop();
    this._oCardsContainer.addChildAt(this._oDecksContainer, this._oCardsContainer.numChildren);
    this._oDeck.setOnTop();
    a.moveCardFirstHand(b.x + c.x - e.x, b.y + c.y - e.y, 250)
}
;
CGameBase.prototype.onCardDealed = function(a) {
    var c = this._oTurnManager.getTurn();
    this._aPlayersHand[c].pushCard(new CCard(this._aPlayersHand[c].getPosNewCard().x,this._aPlayersHand[c].getPosNewCard().y,this._aPlayersHand[c].getContainer(),a.getFotogram(),a.getRank(),a.getSuit(),a.getUniqueID()));
    a.unload();
    a = this._aPlayersHand[c].getLastCard();
    this._aPlayersHand[c].centerContainer();
    this.canCardBeShown(c) && a.showCard();
    this._oTurnManager.nextTurn();
    this.matchCanStart() ? (this._oCardsContainer.addChildAt(this._oDecksContainer, this._oCardsContainer),
    this._oDeck.setOnTop(),
    a = this._oDeck.takeFirstLastCard(),
    a.moveFirstLastCard(CARD_WIDTH, 0, 600)) : this.getFirstHand()
}
;
CGameBase.prototype.onFirstLastCardDealed = function(a) {
    this._oUsedCards.pushCard(new CCard(0,0,this._oUsedCards.getContainer(),a.getFotogram(),a.getRank(),a.getSuit(),a.getUniqueID()));
    a.unload();
    this._oUsedCards.getLastCard().showCardNoInput();
    this._oDeck.moveContainer(CANVAS_WIDTH / 2 - CARD_WIDTH / 2, CANVAS_HEIGHT / 2, 400);
    this._oUsedCards.moveContainer(CANVAS_WIDTH / 2 + CARD_WIDTH / 2, CANVAS_HEIGHT / 2, 400);
    this._iCurrentColor = this._oUsedCards.getLastCard().getSuit();
    this._oInterface.refreshColor(this._iCurrentColor);
    this._oTurnManager.setFirstPlayerToBegin();
    this._iCurPlayer = this._oTurnManager.getTurn();
    this._iNextPlayer = this._oTurnManager.getNextPlayer();
    this._aPlayersHand[this._iCurPlayer].setOnTurn();
    this._oUsedCards.disableInputUsedCards();
    this._onFirstTurnStart()
}
;
CGameBase.prototype._onFirstTurnStart = function() {
    this._oTurnManager.prevTurn();
    this._iCurPlayer = this._oTurnManager.getTurn();
    this._iNextPlayer = this._oTurnManager.getNextPlayer();
    this.setOffTurn();
    var a = this._oUsedCards.getLastCard();
    this._checkFirstCardEffect(a.getEffect())
}
;
CGameBase.prototype.cpuPlayCard = function(a) {
    var c = this._iCurPlayer
      , b = this._aPlayersHand[c].getContainerPos()
      , e = this._oUsedCards.getGlobalPosition();
    this._oCardsContainer.addChildAt(this._oHandsContainer, this._oCardsContainer.numChildren);
    this._aPlayersHand[c].setOnTop();
    a.moveCard(e.x - b.x, e.y - b.y, 400, 1E3);
    this._oDeck.setChildDepth(2);
    this._oUsedCards.setChildDepth(2);
    a.showCard(1E3)
}
;
CGameBase.prototype.checkUno = function(a) {
    var c = this._oTurnManager.getTurn();
    1 === this._aPlayersHand[c].getLength() && (this._bUNO = !0);
    this._oUnoController.check(a)
}
;
CGameBase.prototype.setUNO = function(a) {
    this._bUNO = a
}
;
CGameBase.prototype.applyPenality = function() {
    this._bUNO = !1;
    this.drawCards(this._iCurPlayer, NUM_PENALTY_CARDS, 0, DRAW_TYPE_PENALITY)
}
;
CGameBase.prototype._checkEffect = function(a) {
    switch (a) {
    case EFFECT_SELECT_COLOR:
        this._applySelectColor();
        break;
    case EFFECT_DRAW_FOUR:
        this._applyDrawThreeEffect();
        break;
    case EFFECT_STOP:
        this._applyStopTurn();
        break;
    case EFFECT_INVERT_TURN:
        this._applyInvertTurn();
        break;
    case EFFECT_DRAW_TWO_COLORED:
        this._applyDrawTwoColored();
        break;
    default:
        this._applyNormalCardEffect()
    }
}
;
CGameBase.prototype.onDraw = function() {
    var a = !0
      , c = 0;
    s_bMultiplayer && !s_bPlayWithBot && (c = s_oNetworkManager.getPlayerOrderID());
    if (0 !== this._oUsedCards.getLength() && this._iCurPlayer === c) {
        for (var b = 0; b < this._aPlayersHand[c].getLength(); b++) {
            var e = this._aPlayersHand[c].getCardByIndex(b);
            this.cardMatchTheWaste(e) && (a = !1)
        }
        !0 === a && (this._oDeck.disableInputDraw(),
        this._oDeck.hideHelp(),
        this.drawCards(c, 1, 0, DRAW_TYPE_NORMAL))
    }
}
;
CGameBase.prototype._checkNumberCardsToDraw = function(a, c, b, e) {
    this._iCounterDraw = c;
    switch (e) {
    case DRAW_TYPE_PENALITY:
        this.drawCardsTween(a, c, b, e);
        break;
    case DRAW_TYPE_DRAW2_COLORED:
        s_oCAnimation.drawTwoAnim(a, c, b, e);
        break;
    case DRAW_TYPE_DRAW3:
        s_oCAnimation.drawThreeAnim(a, c, b, e);
        break;
    default:
        this.drawCardsTween(a, c, b, e)
    }
}
;
CGameBase.prototype.drawCardsTween = function(a, c, b, e) {
    this._oCardsContainer.addChildAt(this._oDecksContainer, this._oCardsContainer.numChildren);
    this._oDeck.setOnTop();
    var d = this._aPlayersHand[a].getContainerPos()
      , f = this._aPlayersHand[a].getPosNewCard()
      , g = this._oDeck.getGlobalPosition()
      , h = this
      , l = this._oDeck.takeLastCard();
    l.setOnTop();
    var k = d.x + f.x - g.x;
    d = d.y + f.y - g.y;
    createjs.Tween.get(l.getSprite()).wait(b).to({
        x: k,
        y: d
    }, 400, createjs.Ease.cubicOut).call(function() {
        h._aPlayersHand[a].pushCard(new CCard(h._aPlayersHand[a].getPosNewCard().x,h._aPlayersHand[a].getPosNewCard().y,h._aPlayersHand[a].getContainer(),l.getFotogram(),l.getRank(),l.getSuit(),l.getUniqueID()));
        l.unload();
        var m = h._aPlayersHand[a].getLastCard();
        h.canCardBeShown(a) ? m.showCard() : playSound("card", 1, !1);
        h._aPlayersHand[a].centerContainer();
        h.checkForMoreDraws(a, c, b, e)
    })
}
;
CGameBase.prototype.checkForMoreDraws = function(a, c, b, e) {
    0 === this._oDeck.getLength() ? this.shuffleCards(a, c, b, e) : (this._iCounterDraw--,
    0 < this._iCounterDraw ? this.drawCardsTween(a, c, b, e) : this._onAllCardsDrawCompleted(a, e))
}
;
CGameBase.prototype._checkEffectAfterDrawCompleted = function(a, c) {
    switch (c) {
    case DRAW_TYPE_PENALITY:
        this.applyEffectOnCard(this._oUsedCards.getLastCard().getEffect());
        break;
    case DRAW_TYPE_DRAW2_COLORED:
        this._oTurnManager.nextTurn();
        this._notifyChangeTurn();
        break;
    case DRAW_TYPE_DRAW3:
        this._oTurnManager.nextTurn();
        this._notifyChangeTurn();
        break;
    default:
        this._checkIfCanStillPlayTheTurn(a)
    }
}
;
CGameBase.prototype.onInputPlayer = function(a) {
    for (var c = 0; c < this._aPlayersHand[a].getLength(); c++)
        this._aPlayersHand[a].getCardByIndex(c).onSetTurned()
}
;
CGameBase.prototype.offInputPlayer = function(a) {
    for (var c = 0; c < this._aPlayersHand[a].getLength(); c++)
        this._aPlayersHand[a].getCardByIndex(c).offSetTurned()
}
;
CGameBase.prototype.setOffTurn = function() {
    for (var a = 0; a < NUM_PLAYERS; a++)
        this._aPlayersHand[a].setOffTurn(a),
        this.offInputPlayer(a)
}
;
CGameBase.prototype.prevTurn = function() {
    this._oTurnManager.prevTurn()
}
;
CGameBase.prototype.getPlayerTurn = function() {
    return this._iCurPlayer
}
;
CGameBase.prototype.getbUNO = function() {
    return this._bUNO
}
;
CGameBase.prototype.cardCanBePlayed = function(a, c) {
    if (a.getFotogram() === FOTOGRAM_DRAW_FOUR) {
        var b = !1;
        for (var e = 0; e < this._aPlayersHand[c].getLength(); e++) {
            var d = this._aPlayersHand[c].getCardByIndex(e);
            if (d.getFotogram() !== FOTOGRAM_DRAW_FOUR && (d.getRank() === this._oUsedCards.getLastCard().getRank() || d.getSuit() === this._iCurrentColor || d.getFotogram() === FOTOGRAM_COLOR)) {
                b = !0;
                break
            }
        }
        b = !b
    } else
        b = a.getFotogram() === FOTOGRAM_COLOR ? !0 : this.cardMatchTheWaste(a);
    return b
}
;
CGameBase.prototype.cardMatchTheWaste = function(a) {
    var c = !1;
    if (a.getRank() === this._oUsedCards.getLastCard().getRank() || a.getSuit() === this._iCurrentColor || a.getFotogram() === FOTOGRAM_COLOR || a.getFotogram() === FOTOGRAM_DRAW_FOUR)
        c = !0;
    return c
}
;
CGameBase.prototype.playerCanPlay = function(a) {
    for (var c = !1, b = 0; b < this._aPlayersHand[a].getLength(); b++) {
        var e = this._aPlayersHand[a].getCardByIndex(b);
        if (this.cardMatchTheWaste(e)) {
            c = !0;
            break
        }
    }
    return c
}
;
CGameBase.prototype.shuffle = function(a) {
    var c;
    for (c = a.length; c; c--) {
        var b = Math.floor(Math.random() * c);
        var e = a[c - 1];
        a[c - 1] = a[b];
        a[b] = e
    }
}
;
CGameBase.prototype.unload = function() {
    this._oUnoController.unload();
    this._oInterface.unload();
    this._oSummaryPanel.unload();
    this._oMsgBox.unload();
    createjs.Tween.removeAllTweens();
    s_oStage.removeAllChildren()
}
;
CGameBase.prototype.gameOver = function(a) {
    this.setOffTurn();
    this._showAllPlayersCards();
    this._showAllPlayersMatchScore();
    var c = this._calculateMatchScore()
      , b = this._aPlayersHand[a].getScore() + c;
    this._aPlayersHand[a].setOnTurn();
    this._aPlayersHand[a].setScore(b);
    var e = this._getPlayersRank();
    this._oSummaryPanel.setAndShow(e, a, c);
    b >= GAME_SCORE_WIN && (this._bEndGame = !0,
    this._oSummaryPanel.endMode(sprintf(TEXT_PLAYER_WON, this._aPlayersHand[a].getName())),
    $(s_oMain).trigger("share_event", b))
}
;
CGameBase.prototype.checkWinner = function() {
    for (var a = null, c = 0; c < this._aPlayersHand.length; c++)
        if (0 === this._aPlayersHand[c].getLength()) {
            a = c;
            break
        }
    return a
}
;
CGameBase.prototype._calculateMatchScore = function() {
    for (var a = 0, c = 0; c < this._aPlayersHand.length; c++)
        a += this._aPlayersHand[c].calculateHandScore();
    return a
}
;
CGameBase.prototype._showAllPlayersCards = function() {
    for (var a = 0; a < this._aPlayersHand.length; a++)
        this._aPlayersHand[a].getSide() !== BOTTOM && this._aPlayersHand[a].showAllCards()
}
;
CGameBase.prototype._showAllPlayersMatchScore = function() {
    for (var a = 0; a < this._aPlayersHand.length; a++) {
        var c = this._aPlayersHand[a].calculateHandScore();
        0 < this._aPlayersHand[a].getLength() ? this._aPlayersHand[a].showHandScore(sprintf(TEXT_PTS_TO_WINNER, c)) : this._aPlayersHand[a].showHandScore(TEXT_WINNER)
    }
}
;
CGameBase.prototype._getPlayersRank = function() {
    for (var a = [], c = 0; c < this._aPlayersHand.length; c++) {
        var b = this._aPlayersHand[c].getName()
          , e = this._aPlayersHand[c].getScore();
        a.push({
            name: b,
            score: e,
            index: c
        })
    }
    a.sort(function(d, f) {
        return d.score > f.score ? -1 : 1
    });
    return a
}
;
CGameBase.prototype.matchCanStart = function() {
    for (var a = !1, c = 0, b = 0; b < this._aPlayersHand.length; b++)
        this._aPlayersHand[b].getLength() === STARTING_NUM_CARDS && c++;
    c === NUM_PLAYERS && (a = !0);
    return a
}
;
CGameBase.prototype._checkUnoNotify = function(a, c, b) {
    a && (b === c ? (a = sprintf(TEXT_ALERT_1, NUM_PENALTY_CARDS),
    this._oUnoController.unoAnimation()) : (a = this._aPlayersHand[b].getName().toUpperCase(),
    a = sprintf(TEXT_ALERT_2, a, NUM_PENALTY_CARDS)),
    this._oUnoController.showAlertMsg(a))
}
;
CGameBase.prototype.canCardBeShown = function(a) {
    return this._aPlayersHand[a].getSide() === BOTTOM || DEBUG_SHOW_CARDS
}
;
CGameBase.prototype.getPlayersHand = function(a) {
    return this._aPlayersHand[a]
}
;
CGameBase.prototype.getCurColor = function(a) {
    return this._iCurrentColor
}
;
CGameBase.prototype.getLastCard = function(a) {
    return this._oUsedCards.getLastCard()
}
;
CGameBase.prototype.update = function() {}
;
CGameBase.prototype._onCheck = function() {
    this._oSummaryPanel.hide()
}
;
var CGameSingle = function(a) {
    CGameBase.call(this, a);
    this._init()
};
CGameSingle.prototype = Object.create(CGameBase.prototype);
CGameSingle.prototype._init = function() {
    CGameBase.prototype._init();
    !0 === s_bFirstGame ? new CPanelTutorial : this._startGame()
}
;
CGameSingle.prototype._startGame = function() {
    this._oUnoController.setVisible(!0);
    this._oUnoController.addEventListener(ON_APPLY_EFFECT, this.applyEffectOnCard, this);
    this._oUnoController.addEventListener(ON_APPLY_PENALITY, this.applyPenality, this);
    this._oUnoController.addEventListener(ON_UNO_CLICK, this._onUnoClick, this);
    this._oSummaryPanel.addEventListener(ON_NEXT, this._onConfirmNextMatch, this);
    this._oSummaryPanel.addEventListener(ON_HOME, this.onExit, this);
    this._oMsgBox.addEventListener(ON_HOME, this.onExit, this);
    this._setPieces()
}
;
CGameSingle.prototype._setPieces = function() {
    this._oDeck.initializeDeck();
    this._oDeck.shuffle();
    this.getFirstHand()
}
;
CGameSingle.prototype.setNewGame = function() {
    for (var a = 0; a < this._aPlayersHand.length; a++)
        this._aPlayersHand[a].setScore(0);
    this._oTurnManager.resetFirstPlayer()
}
;
CGameSingle.prototype.restart = function() {
    this.reset();
    this._setPieces()
}
;
CGameSingle.prototype._checkFirstCardEffect = function(a) {
    switch (a) {
    case EFFECT_SELECT_COLOR:
        this._oTurnManager.nextTurn();
        this._iCurPlayer = this._oTurnManager.getTurn();
        this._iNextPlayer = this._oTurnManager.getNextPlayer();
        this._applySelectColor();
        this._oTurnManager.prevTurn();
        break;
    case EFFECT_DRAW_FOUR:
        this._oTurnManager.nextTurn();
        this._iCurPlayer = this._oTurnManager.getTurn();
        this._iNextPlayer = this._oTurnManager.getNextPlayer();
        this._iNextPlayer = this._iCurPlayer = this._oTurnManager.getTurn();
        this._applyDrawThreeEffect();
        this._oTurnManager.prevTurn();
        break;
    case EFFECT_STOP:
        this._applyStopTurn();
        break;
    case EFFECT_INVERT_TURN:
        2 !== NUM_PLAYERS && this._oTurnManager.nextTurn();
        this._applyInvertTurn();
        break;
    case EFFECT_DRAW_TWO_COLORED:
        this._applyDrawTwoColored();
        break;
    default:
        this._oTurnManager.nextTurn(),
        this._iCurPlayer = this._oTurnManager.getTurn(),
        this._iNextPlayer = this._oTurnManager.getNextPlayer(),
        0 === this._iCurPlayer ? (this.onInputPlayer(this._iCurPlayer),
        this._oDeck.enableInputDraw()) : this._oAIManager.selectACard(this._iCurPlayer),
        this._aPlayersHand[this._iCurPlayer].setOnTurn()
    }
}
;
CGameSingle.prototype.onNextTurn = function() {
    this._bUNO = !1;
    var a = this.checkWinner();
    null !== a ? (this.gameOver(a),
    0 === a && $(s_oMain).trigger("save_score", this._calculateMatchScore())) : (this.setOffTurn(),
    this._oDeck.enableInputDraw(),
    this._oTurnManager.nextTurn(),
    this._iCurPlayer = a = this._oTurnManager.getTurn(),
    this._iNextPlayer = this._oTurnManager.getNextPlayer(),
    this._aPlayersHand[a].setOnTurn(),
    0 === a ? (this.onInputPlayer(a),
    this.playerCanPlay(a) || this._oDeck.setHelp()) : this._oAIManager.selectACard(a))
}
;
CGameSingle.prototype.playCard = function(a, c) {
    var b = this._oTurnManager.getTurn()
      , e = !1;
    0 === b && (e = this.cardCanBePlayed(a, b));
    e && (this._oCardsContainer.addChildAt(this._oHandsContainer, this._oCardsContainer.numChildren),
    this._aPlayersHand[b].setOnTop(),
    this._oDeck.disableInputDraw(),
    this.offInputPlayer(0),
    b = this._aPlayersHand[b].getContainerPos(),
    e = this._oUsedCards.getGlobalPosition(),
    playSound("card", 1, !1),
    a.moveCard(e.x - b.x, e.y - b.y, 300),
    a.showCard(),
    this._oUsedCards.setChildDepth(2))
}
;
CGameSingle.prototype.playedCard = function(a) {
    var c = this._oTurnManager.getTurn()
      , b = this._aPlayersHand[c].searchIndexCard(a);
    this._oUsedCards.pushCard(new CCard(0,0,this._oUsedCards.getContainer(),a.getFotogram(),a.getRank(),a.getSuit(),a.getUniqueID()));
    this._oUsedCards.disableInputUsedCards();
    this._oUsedCards.getLastCard().instantShow();
    this._aPlayersHand[c].removeCardByIndex(b);
    a.unload();
    4 !== this._oUsedCards.getLastCard().getSuit() && (this._iCurrentColor = this._oUsedCards.getLastCard().getSuit(),
    this._oInterface.refreshColor(this._iCurrentColor));
    this._aPlayersHand[c].organizeHand(b);
    this.checkUno(a.getEffect());
    0 !== c && this._onUnoClick()
}
;
CGameSingle.prototype._onUnoClick = function() {
    !0 === this._bUNO && (this._bUNO = !1,
    this._aPlayersHand[this._iCurPlayer].checkUno())
}
;
CGameSingle.prototype.applyEffectOnCard = function(a) {
    this._checkEffect(a)
}
;
CGameSingle.prototype._applySelectColor = function() {
    if (0 === this._iCurPlayer)
        (new CSelectColorPanel(EFFECT_SELECT_COLOR)).addEventListener(ON_COLOR_SELECTED, function(c) {
            this._onActionSelectColor({
                colorindex: c
            })
        }, this);
    else {
        var a = {
            colorindex: this._oAIManager.onSelectColorCpu(this._iCurPlayer)
        };
        this._onActionSelectColor(a)
    }
}
;
CGameSingle.prototype._applyDrawThreeEffect = function() {
    if (0 === this._iCurPlayer)
        (new CSelectColorPanel(EFFECT_DRAW_FOUR)).addEventListener(ON_COLOR_SELECTED, function(c) {
            this._onActionDrawThree({
                playerindex: this._iNextPlayer,
                colorindex: c
            })
        }, this);
    else {
        var a = this._oAIManager.onSelectColorCpu(this._iCurPlayer);
        this._onActionDrawThree({
            playerindex: this._iNextPlayer,
            colorindex: a
        })
    }
}
;
CGameSingle.prototype._applyStopTurn = function() {
    var a = this;
    this._oAnimation.stopTurn().then(function() {
        a._oTurnManager.nextTurn();
        a._notifyChangeTurn()
    })
}
;
CGameSingle.prototype._applyInvertTurn = function() {
    var a = this;
    this._oTurnManager.changeClockWise();
    2 === NUM_PLAYERS && this._oTurnManager.nextTurn();
    this._oAnimation.changeClockWise(s_oGame._oTurnManager.getClockWise()).then(function() {
        a._notifyChangeTurn()
    })
}
;
CGameSingle.prototype._applyDrawTwoColored = function() {
    this.drawCards(this._iNextPlayer, 2, 0, DRAW_TYPE_DRAW2_COLORED)
}
;
CGameSingle.prototype._applyNormalCardEffect = function() {
    this._notifyChangeTurn()
}
;
CGameSingle.prototype.drawCards = function(a, c, b, e) {
    this._checkUnoNotify(e === DRAW_TYPE_PENALITY ? !0 : !1, 0, a);
    this._checkNumberCardsToDraw(a, c, b, e)
}
;
CGameSingle.prototype._notifyChangeTurn = function() {
    s_oGame.onNextTurn()
}
;
CGameSingle.prototype.shuffleCards = function(a, c, b, e) {
    for (var d = this, f = this._oUsedCards.removeAllCardUnderTheDeck(), g = [], h = 0; h < f.length; h++)
        g.push(f[h].getFotogram());
    this._oAnimation.shuffleAnimation().then(function() {
        shuffle(g);
        d._oDeck.clearCards();
        d._oDeck.initializeFromData(g);
        d.checkForMoreDraws(a, c, b, e)
    })
}
;
CGameSingle.prototype._onAllCardsDrawCompleted = function(a, c) {
    this._checkEffectAfterDrawCompleted(a, c)
}
;
CGameSingle.prototype._checkIfCanStillPlayTheTurn = function(a) {
    this.playerCanPlay(a) ? (this.onInputPlayer(a),
    0 !== this._iCurPlayer && this._oAIManager.selectACard(this._iCurPlayer)) : (this._aPlayersHand[a].centerContainer(),
    this._notifyChangeTurn())
}
;
CGameSingle.prototype._onActionDrawThree = function(a) {
    var c = this;
    this._iCurrentColor = a.colorindex;
    this._oAnimation.changeColor(this._iCurrentColor).then(function() {
        c._oInterface.refreshColor(c._iCurrentColor);
        c.drawCards(a.playerindex, 3, 0, DRAW_TYPE_DRAW3)
    })
}
;
CGameSingle.prototype._onActionSelectColor = function(a) {
    var c = this;
    this._iCurrentColor = a.colorindex;
    this._oAnimation.changeColor(this._iCurrentColor).then(function() {
        c._oInterface.refreshColor(c._iCurrentColor);
        c._notifyChangeTurn()
    })
}
;
CGameSingle.prototype._onConfirmNextMatch = function() {
    $(s_oMain).trigger("show_interlevel_ad");
    this._bEndGame && (this._bEndGame = !1,
    this.setNewGame());
    this.restart()
}
;
CGameSingle.prototype.onExit = function() {
    s_oGame.unload();
    s_oMain.gotoMenu();
    $(s_oMain).trigger("end_session");
    $(s_oMain).trigger("show_interlevel_ad")
}
;
var CGameSingleWithBot = function(a) {
    CGameSingle.call(this, a)
};
CGameSingleWithBot.prototype = Object.create(CGameSingle.prototype);
CGameSingleWithBot.prototype._startGame = function() {
    this._oUnoController.setVisible(!0);
    this._oUnoController.addEventListener(ON_APPLY_EFFECT, this.applyEffectOnCard, this);
    this._oUnoController.addEventListener(ON_APPLY_PENALITY, this.applyPenality, this);
    this._oUnoController.addEventListener(ON_UNO_CLICK, this._onUnoClick, this);
    this._oSummaryPanel.addEventListener(ON_NEXT, this._onConfirmNextMatch, this);
    this._oSummaryPanel.addEventListener(ON_HOME, this.onExit, this);
    this._oMsgBox.addEventListener(ON_HOME, this.onExit, this);
    this._setPieces();
    this._aPlayersHand[0].changeName(s_oNetworkManager.getPlayerNickname());
    this._aPlayersHand[1].changeName(s_oNetworkManager.getBotName())
}
;
CGameSingleWithBot.prototype._onConfirmNextMatch = function() {
    $(s_oMain).trigger("show_interlevel_ad");
    s_oGame._oSummaryPanel.waitingMode();
    var a = randomFloatBetween(200, 2E3);
    setTimeout(function() {
        if (s_oGame._bEndGame)
            if (.4 < Math.random())
                s_oGame.onOpponentAcceptNextMatch();
            else
                s_oGame.opponentLeftTheGame();
        else
            s_oGame.onOpponentAcceptNextMatch()
    }, a)
}
;
CGameSingleWithBot.prototype.onOpponentAcceptNextMatch = function() {
    this._bEndGame && (this._bEndGame = !1,
    this.setNewGame());
    this.restart()
}
;
CGameSingleWithBot.prototype.opponentLeftTheGame = function() {
    var a = s_oNetworkManager.getBotName();
    this._oSummaryPanel.isShown() ? this._oSummaryPanel.playerQuitMode(sprintf(TEXT_QUIT_FROM_GAME, a)) : this._oMsgBox.isShown() || (this._oSummaryPanel.hide(),
    this._oMsgBox.show(sprintf(TEXT_QUIT_FROM_GAME, a)))
}
;
var CGameMulti = function(a) {
    CGameBase.call(this, a);
    this._bActionInProgress;
    this._aMessageQueue;
    this._init()
};
CGameMulti.prototype = Object.create(CGameBase.prototype);
CGameMulti.prototype._init = function() {
    CGameBase.prototype._init();
    this._startGame()
}
;
CGameMulti.prototype._startGame = function() {
    this._bActionInProgress = !0;
    this._aMessageQueue = [];
    this._oUnoController.addEventListener(ON_APPLY_EFFECT, this.applyEffectOnCard, this);
    this._oUnoController.addEventListener(ON_APPLY_PENALITY, this.applyPenality, this);
    this._oUnoController.addEventListener(ON_UNO_CLICK, this._onUnoClick, this);
    this._oSummaryPanel.addEventListener(ON_NEXT, this._onConfirmNextMatch, this);
    this._oSummaryPanel.addEventListener(ON_HOME, this.onExit, this);
    this._oMsgBox.addEventListener(ON_HOME, this.onExit, this);
    this._initHandPlayers();
    s_oNetworkManager.addEventListener(ON_STATUS_OFFLINE, this._onConnectionCrashed, this);
    s_oNetworkManager.sendMsg(MSG_REQUEST_PIECES, "")
}
;
CGameMulti.prototype.setNewGame = function() {
    for (var a = 0; a < this._aPlayersHand.length; a++)
        this._aPlayersHand[a].setScore(0);
    this._oTurnManager.resetFirstPlayer()
}
;
CGameMulti.prototype.restart = function() {
    this.reset();
    s_oNetworkManager.sendMsg(MSG_REQUEST_PIECES, "")
}
;
CGameMulti.prototype._initHandPlayers = function() {
    for (var a = HAND_POS["num_player_" + NUM_PLAYERS], c = [], b = 0; b < a.length; b++) {
        var e = a[b];
        c.push({
            x: e.x,
            y: e.y,
            side: e.side
        })
    }
    e = s_oNetworkManager.getPlayerOrderID();
    for (b = 0; b < e; b++)
        a = c.pop(),
        c.splice(0, 0, a);
    for (b = 0; b < NUM_PLAYERS; b++) {
        e = c[b];
        var d = a = 0;
        e.x === CANVAS_WIDTH / 2 ? a = CARD_WIDTH / 2 : d = CARD_HEIGHT / 4;
        this._aPlayersHand[b].setPosition(a, d, c[b].x, c[b].y, c[b].side);
        this._aPlayersHand[b].changeName(s_oNetworkManager.getNicknameByID(b))
    }
}
;
CGameMulti.prototype._onPiecesReceived = function(a) {
    this._oUnoController.setVisible(!0);
    this._oDeck.initializeFromData(a);
    this.getFirstHand()
}
;
CGameMulti.prototype._checkFirstCardEffect = function(a) {
    switch (a) {
    case EFFECT_SELECT_COLOR:
        this.onActionStop();
        this._oTurnManager.nextTurn();
        this._iCurPlayer = this._oTurnManager.getTurn();
        this._iNextPlayer = this._oTurnManager.getNextPlayer();
        this._iCurPlayer === s_oNetworkManager.getPlayerOrderID() && this._applySelectColor();
        this._oTurnManager.prevTurn();
        break;
    case EFFECT_DRAW_FOUR:
        this.onActionStop();
        this._oTurnManager.nextTurn();
        this._iCurPlayer = this._oTurnManager.getTurn();
        this._iNextPlayer = this._oTurnManager.getNextPlayer();
        this._iCurPlayer === s_oNetworkManager.getPlayerOrderID() && (this._applyDrawThreeEffect(),
        this._iNextPlayer = this._iCurPlayer = this._oTurnManager.getTurn());
        this._oTurnManager.prevTurn();
        break;
    case EFFECT_STOP:
        this._onActionBlockTurn();
        break;
    case EFFECT_INVERT_TURN:
        2 !== NUM_PLAYERS && this._oTurnManager.nextTurn();
        this._onActionInvertTurn();
        break;
    case EFFECT_DRAW_TWO_COLORED:
        this._onActionDrawTwoColored({
            playerindex: this._iNextPlayer
        });
        break;
    default:
        this._oTurnManager.nextTurn(),
        this._iCurPlayer = this._oTurnManager.getTurn(),
        this._iNextPlayer = this._oTurnManager.getNextPlayer(),
        this._iCurPlayer === s_oNetworkManager.getPlayerOrderID() && (this.onInputPlayer(this._iCurPlayer),
        this._oDeck.enableInputDraw()),
        this._aPlayersHand[this._iCurPlayer].setOnTurn(),
        this.onActionStop()
    }
}
;
CGameMulti.prototype.onNextTurn = function() {
    this._bUNO = !1;
    var a = this.checkWinner();
    null !== a ? this.gameOver(a) : (this.setOffTurn(),
    this._oDeck.enableInputDraw(),
    this._oTurnManager.nextTurn(),
    this._iCurPlayer = a = this._oTurnManager.getTurn(),
    this._iNextPlayer = this._oTurnManager.getNextPlayer(),
    this._aPlayersHand[a].setOnTurn(),
    a === s_oNetworkManager.getPlayerOrderID() && (this.onInputPlayer(a),
    this.playerCanPlay(a) || this._oDeck.setHelp()));
    this.onActionStop()
}
;
CGameMulti.prototype.playCard = function(a, c) {
    var b = this._oTurnManager.getTurn()
      , e = !1
      , d = s_oNetworkManager.getPlayerOrderID();
    b === d && (e = this.cardCanBePlayed(a, b));
    e && (this._oCardsContainer.addChildAt(this._oHandsContainer, this._oCardsContainer.numChildren),
    this._aPlayersHand[b].setOnTop(),
    this._oDeck.disableInputDraw(),
    this.offInputPlayer(d),
    b = a.getUniqueID(),
    s_oNetworkManager.sendMsg(MSG_MOVE, JSON.stringify({
        action: ACTION_USE_CARD,
        playerindex: d,
        cardindex: b
    })))
}
;
CGameMulti.prototype.playedCard = function(a) {
    var c = this._oTurnManager.getTurn()
      , b = this._aPlayersHand[c].searchIndexCard(a);
    this._oUsedCards.pushCard(new CCard(0,0,this._oUsedCards.getContainer(),a.getFotogram(),a.getRank(),a.getSuit(),a.getUniqueID()));
    this._oUsedCards.disableInputUsedCards();
    this._oUsedCards.getLastCard().instantShow();
    this._aPlayersHand[c].removeCardByIndex(b);
    a.unload();
    4 !== this._oUsedCards.getLastCard().getSuit() && (this._iCurrentColor = this._oUsedCards.getLastCard().getSuit(),
    this._oInterface.refreshColor(this._iCurrentColor));
    this._aPlayersHand[c].organizeHand(b);
    this.onActionStop();
    c === s_oNetworkManager.getPlayerOrderID() && this.checkUno(a.getEffect())
}
;
CGameMulti.prototype._onUnoClick = function() {
    !0 === this._bUNO && (this._bUNO = !1,
    this._aPlayersHand[this._iCurPlayer].checkUno(),
    s_oNetworkManager.sendMsg(MSG_MOVE, JSON.stringify({
        action: ACTION_ON_UNO_CLICK,
        playerindex: this._iCurPlayer
    })))
}
;
CGameMulti.prototype.applyEffectOnCard = function(a) {
    this._iCurPlayer === s_oNetworkManager.getPlayerOrderID() && this._checkEffect(a)
}
;
CGameMulti.prototype._applySelectColor = function() {
    (new CSelectColorPanel(EFFECT_SELECT_COLOR)).addEventListener(ON_COLOR_SELECTED, function(a) {
        a = {
            action: ACTION_SELECT_COLOR,
            playerindex: s_oNetworkManager.getPlayerOrderID(),
            colorindex: a
        };
        s_oNetworkManager.sendMsg(MSG_MOVE, JSON.stringify(a))
    }, this)
}
;
CGameMulti.prototype._applyDrawThreeEffect = function() {
    (new CSelectColorPanel(EFFECT_DRAW_FOUR)).addEventListener(ON_COLOR_SELECTED, function(a) {
        s_oNetworkManager.sendMsg(MSG_MOVE, JSON.stringify({
            action: ACTION_DRAW_FOUR,
            playerindex: this._iNextPlayer,
            colorindex: a
        }))
    }, this)
}
;
CGameMulti.prototype._applyStopTurn = function() {
    s_oNetworkManager.sendMsg(MSG_MOVE, JSON.stringify({
        action: ACTION_BLOCK_TURN
    }))
}
;
CGameMulti.prototype._applyInvertTurn = function() {
    s_oNetworkManager.sendMsg(MSG_MOVE, JSON.stringify({
        action: ACTION_INVERT_TURN
    }))
}
;
CGameMulti.prototype._applyDrawTwoColored = function() {
    s_oNetworkManager.sendMsg(MSG_MOVE, JSON.stringify({
        action: ACTION_DRAW_TWO_COLORED,
        playerindex: this._iNextPlayer
    }))
}
;
CGameMulti.prototype._applyNormalCardEffect = function() {
    this._notifyChangeTurn()
}
;
CGameMulti.prototype._notifyChangeTurn = function() {
    if (this._iCurPlayer === s_oNetworkManager.getPlayerOrderID()) {
        var a = {
            action: ACTION_NEXT_TURN,
            playerindex: s_oNetworkManager.getPlayerOrderID()
        };
        s_oNetworkManager.sendMsg(MSG_MOVE, JSON.stringify(a))
    }
}
;
CGameMulti.prototype.shuffleCards = function(a, c, b, e) {
    for (var d = this, f = this._oUsedCards.removeAllCardUnderTheDeck(), g = [], h = 0; h < f.length; h++)
        g.push(f[h].getFotogram());
    this._oAnimation.shuffleAnimation().then(function() {
        d.onActionStop();
        d._iCurPlayer === s_oNetworkManager.getPlayerOrderID() && (shuffle(g),
        s_oNetworkManager.sendMsg(MSG_MOVE, JSON.stringify({
            action: ACTION_ON_SHUFFLECARDS,
            playerindex: a,
            numberofcards: c,
            delay: b,
            drawtype: e,
            cards: g
        })))
    })
}
;
CGameMulti.prototype.drawCards = function(a, c, b, e) {
    s_oNetworkManager.sendMsg(MSG_MOVE, JSON.stringify({
        action: ACTION_ON_DRAWCARDS,
        playerindex: a,
        numberofcards: c,
        delay: b,
        drawtype: e
    }))
}
;
CGameMulti.prototype._onAllCardsDrawCompleted = function(a, c) {
    this._checkEffectAfterDrawCompleted(a, c);
    this.onActionStop()
}
;
CGameMulti.prototype._checkIfCanStillPlayTheTurn = function(a) {
    if (this.playerCanPlay(a))
        this.onInputPlayer(a);
    else
        this._aPlayersHand[a].centerContainer(),
        this._notifyChangeTurn()
}
;
CGameMulti.prototype.onActionReceived = function(a) {
    this._aMessageQueue.push(a);
    this._evaluateMessageQueue()
}
;
CGameMulti.prototype.onActionStop = function() {
    this._bActionInProgress = !1;
    this._evaluateMessageQueue()
}
;
CGameMulti.prototype._evaluateMessageQueue = function() {
    if (0 !== this._aMessageQueue.length && !this._bActionInProgress) {
        this._bActionInProgress = !0;
        var a = this._aMessageQueue.shift();
        switch (a.action) {
        case ACTION_NEXT_TURN:
            this.onNextTurn();
            break;
        case ACTION_USE_CARD:
            this._onActionPlayCard(a);
            break;
        case ACTION_ON_SHUFFLECARDS:
            this._onActionShuffleCard(a);
            break;
        case ACTION_ON_DRAWCARDS:
            this._onActionDrawCards(a);
            break;
        case ACTION_ON_UNO_CLICK:
            this._onActionUnoClick(a);
            break;
        case ACTION_SELECT_COLOR:
            this._onActionSelectColor(a);
            break;
        case ACTION_DRAW_FOUR:
            this._onActionDrawThree(a);
            break;
        case ACTION_BLOCK_TURN:
            this._onActionBlockTurn(a);
            break;
        case ACTION_INVERT_TURN:
            this._onActionInvertTurn(a);
            break;
        case ACTION_DRAW_TWO_COLORED:
            this._onActionDrawTwoColored(a)
        }
    }
}
;
CGameMulti.prototype._onActionPlayCard = function(a) {
    var c = a.playerindex
      , b = this._aPlayersHand[c].getContainerPos()
      , e = this._oUsedCards.getGlobalPosition();
    a = this._aPlayersHand[c].getCardByUniqueID(a.cardindex);
    playSound("card", 1, !1);
    a.moveCard(e.x - b.x, e.y - b.y, 300);
    a.showCard();
    this._oUsedCards.setChildDepth(2)
}
;
CGameMulti.prototype._onActionShuffleCard = function(a) {
    var c = a.playerindex
      , b = a.numberofcards
      , e = a.delay
      , d = a.drawtype;
    a = a.cards;
    this._oDeck.clearCards();
    this._oDeck.initializeFromData(a);
    this.checkForMoreDraws(c, b, e, d)
}
;
CGameMulti.prototype._onActionDrawCards = function(a) {
    var c = a.drawtype
      , b = a.numberofcards
      , e = a.delay;
    a = a.playerindex;
    this._checkUnoNotify(c === DRAW_TYPE_PENALITY ? !0 : !1, s_oNetworkManager.getPlayerOrderID(), a);
    this._checkNumberCardsToDraw(a, b, e, c)
}
;
CGameMulti.prototype._onActionUnoClick = function(a) {
    this._aPlayersHand[a.playerindex].checkUno();
    this.onActionStop()
}
;
CGameMulti.prototype._onActionSelectColor = function(a) {
    var c = this;
    this._iCurrentColor = a.colorindex;
    this._oAnimation.changeColor(this._iCurrentColor).then(function() {
        c._oInterface.refreshColor(c._iCurrentColor);
        c._notifyChangeTurn();
        c.onActionStop()
    })
}
;
CGameMulti.prototype._onActionDrawThree = function(a) {
    var c = this;
    this._iCurrentColor = a.colorindex;
    this._oAnimation.changeColor(this._iCurrentColor).then(function() {
        c._oInterface.refreshColor(c._iCurrentColor);
        a = {
            playerindex: a.playerindex,
            numberofcards: 3,
            delay: 0,
            drawtype: DRAW_TYPE_DRAW3
        };
        c._onActionDrawCards(a)
    })
}
;
CGameMulti.prototype._onActionBlockTurn = function(a) {
    var c = this;
    this._oAnimation.stopTurn().then(function() {
        c._oTurnManager.nextTurn();
        c._notifyChangeTurn();
        c.onActionStop()
    })
}
;
CGameMulti.prototype._onActionInvertTurn = function(a) {
    var c = this;
    this._oTurnManager.changeClockWise();
    2 === NUM_PLAYERS && this._oTurnManager.nextTurn();
    this._oAnimation.changeClockWise(s_oGame._oTurnManager.getClockWise()).then(function() {
        c._notifyChangeTurn();
        c.onActionStop()
    })
}
;
CGameMulti.prototype._onActionDrawTwoColored = function(a) {
    a = {
        playerindex: a.playerindex,
        numberofcards: 2,
        delay: 0,
        drawtype: DRAW_TYPE_DRAW2_COLORED
    };
    this._onActionDrawCards(a)
}
;
CGameMulti.prototype.onExit = function() {
    s_oGame.unload();
    s_oMain.gotoMenu();
    $(s_oMain).trigger("end_session");
    $(s_oMain).trigger("show_interlevel_ad");
    s_oNetworkManager.disconnect()
}
;
CGameMulti.prototype._onConfirmNextMatch = function() {
    $(s_oMain).trigger("show_interlevel_ad");
    this._oSummaryPanel.waitingMode();
    s_oNetworkManager.sendMsg(MSG_ACCEPT_NEXTMATCH, "")
}
;
CGameMulti.prototype.onOpponentAcceptNextMatch = function() {
    this._bEndGame && (this._bEndGame = !1,
    this.setNewGame());
    this.restart()
}
;
CGameMulti.prototype.opponentLeftTheGame = function(a) {
    a = s_oNetworkManager.getNicknameByID(a);
    this._oSummaryPanel.isShown() ? this._oSummaryPanel.playerQuitMode(sprintf(TEXT_QUIT_FROM_GAME, a)) : this._oMsgBox.isShown() || (this._oSummaryPanel.hide(),
    this._oMsgBox.show(sprintf(TEXT_QUIT_FROM_GAME, a)))
}
;
CGameMulti.prototype._onConnectionCrashed = function() {
    this._oSummaryPanel.hide();
    this._oMsgBox.show(TEXT_SOMETHING_WENT_WRONG)
}
;
function CInterface() {
    var a, c, b, e, d, f, g, h, l, k, m, n, p = null, r = null, z;
    this._init = function() {
        z = new createjs.Container;
        var v = s_oSpriteLibrary.getSprite("but_exit");
        d = CANVAS_WIDTH - v.height / 2 - 10;
        f = v.height / 2 + 10;
        k = new CGfxButton(d,f,v,z);
        k.addEventListener(ON_MOUSE_UP, this._onExit, this);
        b = CANVAS_WIDTH - v.width / 2 - 100;
        e = v.height / 2 + 10;
        if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile)
            v = s_oSpriteLibrary.getSprite("audio_icon"),
            l = new CToggle(b,e,v,s_bAudioActive,z),
            l.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        v = window.document;
        var t = v.documentElement;
        p = t.requestFullscreen || t.mozRequestFullScreen || t.webkitRequestFullScreen || t.msRequestFullscreen;
        r = v.exitFullscreen || v.mozCancelFullScreen || v.webkitExitFullscreen || v.msExitFullscreen;
        !1 === ENABLE_FULLSCREEN && (p = !1);
        p && screenfull.isEnabled && (v = s_oSpriteLibrary.getSprite("but_fullscreen"),
        a = v.width / 4 + 10,
        c = v.height / 2 + 10,
        m = new CToggle(a,c,v,s_bFullscreen,z),
        m.addEventListener(ON_MOUSE_UP, this._onFullscreen, this));
        v = s_oSpriteLibrary.getSprite("colors");
        v = new createjs.SpriteSheet({
            images: [v],
            frames: {
                width: 103,
                height: 102,
                regX: 51.5,
                regY: 51
            },
            animations: {
                red: [0],
                green: [1],
                blue: [2],
                yellow: [3]
            }
        });
        g = CANVAS_WIDTH / 2 + 220;
        h = CANVAS_HEIGHT / 2 - 60;
        n = new createjs.Sprite(v,0);
        n.stop();
        n.x = g;
        n.y = h;
        s_oStage.addChild(z);
        this.refreshButtonPos()
    }
    ;
    this.refreshColor = function(v) {
        n.gotoAndStop(v);
        s_oStage.addChildAt(n, 1)
    }
    ;
    this.unload = function() {
        if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile)
            l.unload(),
            l = null;
        k.unload();
        p && screenfull.isEnabled && m.unload();
        s_oInterface = null
    }
    ;
    this.refreshButtonPos = function() {
        k.setPosition(d - s_iOffsetX, s_iOffsetY + f);
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || l.setPosition(b - s_iOffsetX, s_iOffsetY + e);
        p && screenfull.isEnabled && m.setPosition(a + s_iOffsetX, c + s_iOffsetY)
    }
    ;
    this.setOnTop = function() {
        s_oStage.addChildAt(z, s_oStage.numChildren)
    }
    ;
    this._onAudioToggle = function() {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive
    }
    ;
    this._onExit = function() {
        new CAreYouSurePanel(s_oGame.onExit)
    }
    ;
    this._onRestart = function() {
        s_oGame.restart()
    }
    ;
    this.resetFullscreenBut = function() {
        p && screenfull.isEnabled && m.setActive(s_bFullscreen)
    }
    ;
    this._onFullscreen = function() {
        s_bFullscreen ? r.call(window.document) : p.call(window.document.documentElement);
        sizeHandler()
    }
    ;
    s_oInterface = this;
    this._init();
    return this
}
var s_oInterface = null;
function CCreditsPanel() {
    var a, c, b, e, d;
    this._init = function() {
        c = new createjs.Shape;
        c.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        c.alpha = 0;
        c.on("mousedown", function() {});
        s_oStage.addChild(c);
        (new createjs.Tween.get(c)).to({
            alpha: .7
        }, 500);
        b = new createjs.Container;
        s_oStage.addChild(b);
        var f = s_oSpriteLibrary.getSprite("credits_panel")
          , g = createBitmap(f);
        g.regX = f.width / 2;
        g.regY = f.height / 2;
        b.addChild(g);
        b.x = CANVAS_WIDTH / 2;
        b.y = CANVAS_HEIGHT + f.height / 2;
        a = b.y;
        (new createjs.Tween.get(b)).to({
            y: CANVAS_HEIGHT / 2 - 40
        }, 500, createjs.Ease.quartIn);
        g = new createjs.Text(TEXT_DEVELOPED,"20px " + PRIMARY_FONT,"#ffffff");
        g.y = -f.height / 2 + 80;
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.lineWidth = 300;
        b.addChild(g);
        f = new createjs.Text("www.codethislab.com","30px " + PRIMARY_FONT,"#ffffff");
        f.y = 80;
        f.textAlign = "center";
        f.textBaseline = "middle";
        f.lineWidth = 500;
        b.addChild(f);
        f = s_oSpriteLibrary.getSprite("ctl_logo");
        d = createBitmap(f);
        d.regX = f.width / 2;
        d.regY = f.height / 2;
        b.addChild(d);
        f = s_oSpriteLibrary.getSprite("but_exit");
        e = new CGfxButton(230,-107,f,b);
        e.addEventListener(ON_MOUSE_UP, this.unload, this)
    }
    ;
    this.unload = function() {
        e.setClickable(!1);
        (new createjs.Tween.get(c)).to({
            alpha: 0
        }, 500);
        (new createjs.Tween.get(b)).to({
            y: a
        }, 400, createjs.Ease.backIn).call(function() {
            s_oStage.removeChild(c);
            s_oStage.removeChild(b);
            e.unload()
        });
        c.off("mousedown", function() {})
    }
    ;
    this._init()
}
function CSelectColorPanel(a) {
    var c, b, e, d, f, g, h = this, l, k, m, n;
    this._init = function() {
        b = [];
        e = [];
        a === EFFECT_SELECT_COLOR && playSound("special_card", .5, !1);
        d = new createjs.Shape;
        d.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        d.alpha = 0;
        d.on("mousedown", function() {});
        s_oStage.addChild(d);
        (new createjs.Tween.get(d,{
            override: !0
        })).to({
            alpha: .7
        }, 500);
        f = new createjs.Container;
        s_oStage.addChild(f);
        g = new createjs.Container;
        f.addChild(g);
        var p = s_oSpriteLibrary.getSprite("select_color_panel")
          , r = createBitmap(p);
        r.regX = p.width / 2;
        r.regY = p.height / 2;
        f.addChildAt(r, 0);
        f.x = CANVAS_WIDTH / 2;
        f.y = CANVAS_HEIGHT + p.height / 2;
        c = f.y;
        (new createjs.Tween.get(f,{
            override: !0
        })).to({
            y: CANVAS_HEIGHT / 2 - 40
        }, 600, createjs.Ease.backOut);
        new CTLText(f,-250,-p.height / 2 + 10,500,110,50,"center","#fff",PRIMARY_FONT,1,0,0,TEXT_SELECT_COLOR,!0,!0,!0,!1);
        g.y = f.getBounds().height / 5;
        p = s_oSpriteLibrary.getSprite("but_red");
        l = new CGfxButton(-190,-20,p,g);
        l.addEventListener(ON_MOUSE_UP, function() {
            h.onSelectColor(0);
            g
        });
        p = s_oSpriteLibrary.getSprite("but_green");
        k = new CGfxButton(-65,-20,p,g);
        k.addEventListener(ON_MOUSE_UP, function() {
            h.onSelectColor(1);
            g
        });
        p = s_oSpriteLibrary.getSprite("but_blue");
        m = new CGfxButton(65,-20,p,g);
        m.addEventListener(ON_MOUSE_UP, function() {
            h.onSelectColor(2);
            g
        });
        p = s_oSpriteLibrary.getSprite("but_yellow");
        n = new CGfxButton(190,-20,p,g);
        n.addEventListener(ON_MOUSE_UP, function() {
            h.onSelectColor(3);
            g
        })
    }
    ;
    this.unload = function() {
        s_oStage.removeChild(d);
        s_oStage.removeChild(f);
        l.unload();
        k.unload();
        m.unload();
        n.unload();
        d.off("mousedown", function() {})
    }
    ;
    this.disableButtons = function() {
        l.setClickable(!1);
        k.setClickable(!1);
        m.setClickable(!1);
        n.setClickable(!1)
    }
    ;
    this.addEventListener = function(p, r, z) {
        b[p] = r;
        e[p] = z
    }
    ;
    this.onSelectColor = function(p) {
        (new createjs.Tween.get(d,{
            override: !0
        })).to({
            alpha: 0
        }, 500);
        (new createjs.Tween.get(f,{
            override: !0
        })).to({
            y: c
        }, 400, createjs.Ease.backIn);
        h.disableButtons();
        b[ON_COLOR_SELECTED] && b[ON_COLOR_SELECTED].call(e[ON_COLOR_SELECTED], p, a)
    }
    ;
    h = this;
    this._init()
}
function CAreYouSurePanel(a) {
    var c, b, e, d, f;
    this._init = function(h) {
        d = new createjs.Shape;
        d.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        d.alpha = 0;
        d.on("mousedown", function() {});
        s_oStage.addChild(d);
        (new createjs.Tween.get(d)).to({
            alpha: .7
        }, 500);
        f = new createjs.Container;
        s_oStage.addChildAt(f, s_oStage.numChildren);
        h = s_oSpriteLibrary.getSprite("credits_panel");
        var l = createBitmap(h);
        l.regX = h.width / 2;
        l.regY = h.height / 2;
        f.addChild(l);
        f.x = CANVAS_WIDTH / 2;
        f.y = CANVAS_HEIGHT + h.height / 2;
        c = f.y;
        (new createjs.Tween.get(f)).to({
            y: CANVAS_HEIGHT / 2 - 40
        }, 500, createjs.Ease.quartIn).call(function() {});
        (new CTLText(f,-250,-130,500,150,50,"center","#000000",PRIMARY_FONT,1,0,0,TEXT_ARE_SURE,!0,!0,!0,!1)).setOutline(5);
        new CTLText(f,-250,-130,500,150,50,"center","#fff",PRIMARY_FONT,1,0,0,TEXT_ARE_SURE,!0,!0,!0,!1);
        b = new CGfxButton(110,80,s_oSpriteLibrary.getSprite("but_yes_big"),f);
        b.addEventListener(ON_MOUSE_UP, this._onButYes, this);
        e = new CGfxButton(-110,80,s_oSpriteLibrary.getSprite("but_exit_big"),f);
        e.addEventListener(ON_MOUSE_UP, this._onButNo, this)
    }
    ;
    this._onButYes = function() {
        e.setClickable(!1);
        b.setClickable(!1);
        (new createjs.Tween.get(d)).to({
            alpha: 0
        }, 500);
        (new createjs.Tween.get(f)).to({
            y: c
        }, 400, createjs.Ease.backIn).call(function() {
            a();
            g.unload()
        })
    }
    ;
    this._onButNo = function() {
        e.setClickable(!1);
        b.setClickable(!1);
        (new createjs.Tween.get(d)).to({
            alpha: 0
        }, 500);
        (new createjs.Tween.get(f)).to({
            y: c
        }, 400, createjs.Ease.backIn).call(function() {
            g.unload()
        })
    }
    ;
    this.unload = function() {
        e.unload();
        b.unload();
        s_oStage.removeChild(d);
        s_oStage.removeChild(f);
        d.off("mousedown", function() {})
    }
    ;
    var g = this;
    this._init(a)
}
function CAIManager() {
    this._init = function() {}
    ;
    this.unload = function() {}
    ;
    this.onSelectColorCpu = function(a) {
        a = s_oGame.getPlayersHand(a);
        for (var c, b = [{
            iColor: 0,
            iPoints: 0
        }, {
            iColor: 1,
            iPoints: 0
        }, {
            iColor: 2,
            iPoints: 0
        }, {
            iColor: 3,
            iPoints: 0
        }], e = 0; e < a.getLength(); e++) {
            c = a.getCardByIndex(e);
            for (var d = 0; d < b.length; d++)
                c.getSuit() === d && b[d].iPoints++
        }
        b.sort(function(f, g) {
            return parseFloat(g.iPoints) - parseFloat(f.iPoints)
        });
        return b[0].iColor
    }
    ;
    this.selectACard = function(a) {
        for (var c = s_oGame.getPlayersHand(a), b = s_oGame.getCurColor(), e = s_oGame.getLastCard(), d = [], f = 0; f < c.getLength(); f++)
            4 === c.getCardByIndex(f).getSuit() || c.getCardByIndex(f).getRank() !== e.getRank() && c.getCardByIndex(f).getSuit() !== b ? c.getCardByIndex(f).getFotogram() === FOTOGRAM_COLOR ? d.push({
                oCard: c.getCardByIndex(f),
                iValue: 2
            }) : c.getCardByIndex(f).getFotogram() === FOTOGRAM_DRAW_FOUR && d.push({
                oCard: c.getCardByIndex(f),
                iValue: 1
            }) : 12 === c.getCardByIndex(f).getRank() ? d.push({
                oCard: c.getCardByIndex(f),
                iValue: 6
            }) : 10 === c.getCardByIndex(f).getRank() ? d.push({
                oCard: c.getCardByIndex(f),
                iValue: 5
            }) : 11 === c.getCardByIndex(f).getRank() ? d.push({
                oCard: c.getCardByIndex(f),
                iValue: 4
            }) : d.push({
                oCard: c.getCardByIndex(f),
                iValue: 3
            });
        0 === d.length ? s_oGame.drawCards(a, 1, 1E3, DRAW_TYPE_NORMAL) : (d.sort(function(g, h) {
            return parseFloat(h.iValue) - parseFloat(g.iValue)
        }),
        s_oGame.cpuPlayCard(d[0].oCard))
    }
    ;
    this._init()
}
function CUnoController() {
    var a, c, b, e, d;
    this._init = function() {
        a = [];
        c = [];
        e = new createjs.Container;
        e.visible = !1;
        s_oStage.addChild(e);
        var g = s_oSpriteLibrary.getSprite("but_uno");
        d = new CGfxButton(CANVAS_WIDTH / 2 + 222,CANVAS_HEIGHT / 2 + 70,g,e);
        d.addEventListener(ON_MOUSE_UP, this._onButUno, this);
        b = new CTLText(e,CANVAS_WIDTH / 2 + 280,CANVAS_HEIGHT / 2,200,150,50,"center","#fff",PRIMARY_FONT,1,0,0,sprintf(TEXT_ALERT_1, NUM_PENALTY_CARDS),!0,!0,!0,!1);
        b.setAlpha(0)
    }
    ;
    this.unload = function() {
        d.unload()
    }
    ;
    this.addEventListener = function(g, h, l) {
        a[g] = h;
        c[g] = l
    }
    ;
    this.setVisible = function(g) {
        e.visible = g
    }
    ;
    this.check = function(g) {
        !0 === s_oGame.getbUNO() ? setTimeout(function() {
            !0 === s_oGame.getbUNO() ? f._triggerPenality() : f._triggerEffect(g)
        }, 2E3) : f._triggerEffect(g)
    }
    ;
    this._triggerPenality = function() {
        a[ON_APPLY_PENALITY] && a[ON_APPLY_PENALITY].call(c[ON_APPLY_PENALITY])
    }
    ;
    this._triggerEffect = function(g) {
        a[ON_APPLY_EFFECT] && a[ON_APPLY_EFFECT].call(c[ON_APPLY_EFFECT], g)
    }
    ;
    this._onButUno = function() {
        a[ON_UNO_CLICK] && a[ON_UNO_CLICK].call(c[ON_UNO_CLICK])
    }
    ;
    this.showAlertMsg = function(g) {
        b.refreshText(g);
        createjs.Tween.get(b.getText()).to({
            alpha: 1
        }, 400).wait(4E3).to({
            alpha: 0
        }, 400).call(function() {
            d.removeAnimation()
        })
    }
    ;
    this.unoAnimation = function() {
        d.trembleAnimation()
    }
    ;
    var f = this;
    this._init()
}
function CSummaryPanel(a) {
    var c, b, e, d, f, g, h, l, k, m, n, p, r, z;
    this._init = function() {
        c = [];
        b = [];
        f = new createjs.Shape;
        f.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        f.alpha = 0;
        f.on("mousedown", function() {});
        a.addChild(f);
        h = new createjs.Container;
        h.alpha = 0;
        h.visible = !1;
        a.addChild(h);
        var t = s_oSpriteLibrary.getSprite("msg_box");
        g = createBitmap(t);
        t = g.getBounds();
        g.regX = t.width / 2;
        g.regY = t.height / 2;
        g.x = CANVAS_WIDTH / 2;
        g.y = CANVAS_HEIGHT / 2;
        h.addChild(g);
        m = new createjs.Container;
        m.x = g.x;
        m.y = g.y - 10;
        h.addChild(m);
        var B = NUM_PLAYERS;
        t = 40 * B;
        d = [];
        for (var w = 0; w < B; w++)
            d[w] = new CPlayerInfo(0,0,m,"szPlayerName"),
            d[w].setPosition(0, -t / 2 + t / (B - 1) * w, BOTTOM);
        e = "#35bd1b";
        k = new createjs.Text(0," 30px " + PRIMARY_FONT,e);
        k.textBaseline = "middle";
        m.addChild(k);
        B = CANVAS_WIDTH / 2;
        w = CANVAS_HEIGHT / 2 - 185;
        t = 150;
        l = new CTLText(h,B - 250,w - t / 2,500,t,50,"center","#fff",PRIMARY_FONT,1,0,0,TEXT_SUMMARY,!0,!0,!0,!1);
        t = s_oSpriteLibrary.getSprite("cup_icon");
        n = createBitmap(t);
        n.regX = t.width / 2;
        n.regY = t.height / 2;
        n.x = -300;
        n.y = d[0].getTextScorePos().y;
        n.visible = !1;
        m.addChild(n);
        t = s_oSpriteLibrary.getSprite("but_home");
        p = new CGfxButton(CANVAS_WIDTH / 2 - 180,CANVAS_HEIGHT / 2 + 170,t,h);
        p.addEventListener(ON_MOUSE_DOWN, this._onExit, this);
        t = s_oSpriteLibrary.getSprite("but_show");
        r = new CGfxButton(CANVAS_WIDTH / 2,CANVAS_HEIGHT / 2 + 170,t,h);
        r.addEventListener(ON_MOUSE_DOWN, this._onShow, this);
        t = s_oSpriteLibrary.getSprite("but_next");
        z = new CGfxButton(CANVAS_WIDTH / 2 + 180,CANVAS_HEIGHT / 2 + 170,t,h);
        z.addEventListener(ON_MOUSE_DOWN, this._onNext, this);
        z.pulseAnimation()
    }
    ;
    this.unload = function() {
        z.unload();
        r.unload();
        p.unload();
        f.removeAllEventListeners();
        h.removeAllEventListeners();
        a.removeChild(f);
        a.removeChild(h)
    }
    ;
    this.addEventListener = function(t, B, w) {
        c[t] = B;
        b[t] = w
    }
    ;
    this.setAndShow = function(t, B, w) {
        s_bMobile || $("#div_display_id").css("display", "block");
        for (var y = 0; y < d.length; y++)
            if (d[y].setName(t[y].name),
            d[y].setScore(t[y].score + " /" + GAME_SCORE_WIN),
            t[y].index === B) {
                var q = d[y].getTextScorePos();
                k.x = q.x + 46;
                k.y = q.y + 18;
                k.text = "(+" + w + ")";
                d[y].highlight()
            }
        playSound("game_over", 1, !1);
        h.visible = !0;
        createjs.Tween.get(f).to({
            alpha: .7
        }, 500);
        createjs.Tween.get(h).to({
            alpha: 1
        }, 500)
    }
    ;
    this.reset = function() {
        h.visible = !1;
        f.alpha = 0;
        f.on("mousedown", function() {});
        n.visible = !1;
        l.setY(CANVAS_HEIGHT / 2 - 185 - 75);
        l.refreshText(TEXT_SUMMARY);
        m.visible = !0;
        p.setX(CANVAS_WIDTH / 2 - 180);
        r.setX(CANVAS_WIDTH / 2);
        z.setX(CANVAS_WIDTH / 2 + 180);
        p.setVisible(!0);
        r.setVisible(!0);
        z.setVisible(!0);
        var t = s_oSpriteLibrary.getSprite("but_next");
        z.setImage(t);
        for (t = 0; t < d.length; t++)
            d[t].enable(),
            d[t].setNameColor("#FFF")
    }
    ;
    this.show = function() {
        h.visible = !0;
        f.alpha = .7;
        f.removeAllEventListeners();
        f.on("mousedown", function() {})
    }
    ;
    this.hide = function() {
        h.visible = !1;
        f.alpha = .01;
        f.removeAllEventListeners();
        f.on("mousedown", this.show, this)
    }
    ;
    this.waitingMode = function() {
        h.visible = !0;
        h.alpha = 1;
        f.alpha = .7;
        m.visible = !1;
        l.refreshText(TEXT_WAIT_OPPONENT);
        l.setY(CANVAS_HEIGHT / 2 - 50 - 75);
        p.setX(CANVAS_WIDTH / 2 - 100);
        z.setVisible(!1);
        r.setX(CANVAS_WIDTH / 2 + 100)
    }
    ;
    this.playerQuitMode = function(t) {
        h.visible = !0;
        h.alpha = 1;
        f.alpha = .7;
        l.refreshText(t.toUpperCase());
        p.setX(CANVAS_WIDTH / 2 - 100);
        z.setVisible(!1);
        r.setX(CANVAS_WIDTH / 2 + 100)
    }
    ;
    this.endMode = function(t) {
        s_bMobile || $("#div_display_id").css("display", "block");
        l.refreshText(t.toUpperCase());
        t = s_oSpriteLibrary.getSprite("but_restart");
        z.setImage(t);
        d[0].setNameColor(e);
        n.visible = !0
    }
    ;
    this.isShown = function() {
        return h.visible
    }
    ;
    this.stopTweens = function() {
        $("#div_display_id").css("display", "none");
        createjs.Tween.removeTweens(f);
        createjs.Tween.removeTweens(h)
    }
    ;
    this._onExit = function() {
        v.stopTweens();
        c[ON_HOME] && c[ON_HOME].call(b[ON_HOME])
    }
    ;
    this._onShow = function() {
        v.stopTweens();
        c[ON_CHECK] && c[ON_CHECK].call(b[ON_CHECK])
    }
    ;
    this._onNext = function() {
        v.stopTweens();
        c[ON_NEXT] && c[ON_NEXT].call(b[ON_NEXT])
    }
    ;
    this._init();
    var v = this;
    return this
}
function CPlayerInfo(a, c, b, e) {
    var d, f, g, h, l, k, m, n, p, r, z;
    this._init = function(v, t, B, w) {
        d = w;
        f = 10;
        k = new createjs.Container;
        k.x = v;
        k.y = t;
        B.addChild(k);
        m = new createjs.Container;
        k.addChild(m);
        v = s_oSpriteLibrary.getSprite("line_player");
        g = v.width / 2;
        h = v.height;
        v = new createjs.SpriteSheet({
            images: [v],
            frames: {
                width: g,
                height: h,
                regX: g / 2,
                regY: h / 2
            },
            animations: {
                off: [0],
                on: [1],
                idle: {
                    frames: [0, 1],
                    speed: .1
                }
            }
        });
        n = createSprite(v, "off", g / 2, h / 2, g, h);
        n.stop();
        k.addChild(n);
        l = 40;
        p = new CTLText(m,0,0,340,l,30,"left","#fff",PRIMARY_FONT,1,0,0,d,!0,!0,!1,!1);
        v = s_oSpriteLibrary.getSprite("score_icon");
        z = createBitmap(v);
        z.regX = v.width / 2;
        z.regY = v.height / 2;
        m.addChild(z);
        r = new CTLText(m,0,0,100,l,30,"left","#fff",PRIMARY_FONT,1,0,0,"0",!0,!0,!1,!1)
    }
    ;
    this.unload = function() {
        b.removeChild(k)
    }
    ;
    this.highlight = function() {
        n.gotoAndStop("on");
        m.alpha = 1;
        createjs.Tween.get(p.getText(), {
            override: !0,
            loop: !0
        }).to({
            alpha: 0
        }, 500, createjs.Ease.cubicIn).to({
            alpha: 1
        }, 500, createjs.Ease.cubicOut).wait(500)
    }
    ;
    this.enable = function() {
        n.gotoAndStop("on");
        p.setAlpha(1);
        m.alpha = 1;
        createjs.Tween.removeTweens(p.getText())
    }
    ;
    this.disable = function() {
        n.gotoAndStop("off");
        p.setAlpha(1);
        m.alpha = .15;
        createjs.Tween.removeTweens(p.getText())
    }
    ;
    this.setScore = function(v) {
        r.refreshText(v)
    }
    ;
    this.setName = function(v) {
        p.refreshText(v)
    }
    ;
    this.setPosition = function(v, t, B) {
        k.x = v;
        k.y = t;
        switch (B) {
        case BOTTOM:
            this._setBottom();
            break;
        case TOP:
            this._setTop();
            break;
        case LEFT:
            this._setLeft();
            break;
        case RIGHT:
            this._setRight()
        }
    }
    ;
    this._setBottom = function() {
        this._setNormalDir();
        k.rotation = 0
    }
    ;
    this._setTop = function() {
        this._setInverseDir();
        k.rotation = 0
    }
    ;
    this._setLeft = function() {
        this._setNormalDir();
        k.rotation = 90
    }
    ;
    this._setRight = function() {
        this._setInverseDir();
        k.rotation = 90
    }
    ;
    this._setNormalDir = function() {
        p.setAlign("left");
        p.setPos(-g / 2 + f, -l);
        z.x = g / 2 - f - z.getBounds().width / 2;
        z.y = p.getY() + l / 2 - 2;
        r.setAlign("right");
        r.setPos(z.x - z.getBounds().width / 2 - 2, p.getY())
    }
    ;
    this._setInverseDir = function() {
        p.setAlign("right");
        p.setPos(g / 2 - f, 4);
        z.x = -g / 2 + f + z.getBounds().width / 2;
        z.y = p.getY() + l / 2 - 2;
        r.setAlign("left");
        r.setPos(z.x + z.getBounds().width / 2 + 2, p.getY())
    }
    ;
    this.getTextScorePos = function() {
        return {
            x: k.x + r.getX(),
            y: k.y + r.getY()
        }
    }
    ;
    this.setNameColor = function(v) {
        p.setColor(v)
    }
    ;
    this._init(a, c, b, e)
}
function CInfoLabel(a, c, b) {
    var e, d;
    this._init = function(f, g, h) {
        e = new createjs.Container;
        e.x = f;
        e.y = g;
        h.addChild(e);
        f = s_oSpriteLibrary.getSprite("info_label");
        g = createBitmap(f);
        g.regX = f.width / 2;
        g.regY = f.height / 2;
        e.addChild(g);
        f = f.width - 20;
        d = new CTLText(e,-(f / 2),-40,f,80,30,"center","#fff",PRIMARY_FONT,1.2,0,0,sprintf(TEXT_PTS_TO_WINNER, 0),!0,!0,!0,!1);
        this.pulseAnimation()
    }
    ;
    this.setOnTop = function() {
        b.setChildIndex(e, b.numChildren - 1)
    }
    ;
    this.setPosition = function(f, g, h) {
        e.x = f;
        e.y = g
    }
    ;
    this.setTextScore = function(f) {
        d.refreshText(f)
    }
    ;
    this.setVisible = function(f) {
        e.visible = f
    }
    ;
    this.pulseAnimation = function() {
        createjs.Tween.get(e, {
            loop: !0
        }).to({
            scaleX: .9,
            scaleY: .9
        }, 850, createjs.Ease.quadOut).to({
            scaleX: 1,
            scaleY: 1
        }, 650, createjs.Ease.quadIn)
    }
    ;
    this._init(a, c, b)
}
function CMsgBox(a) {
    var c, b, e, d, f, g, h;
    this._init = function(l) {
        c = [];
        b = [];
        e = new createjs.Shape;
        e.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        e.alpha = 0;
        e.on("mousedown", function() {});
        l.addChild(e);
        d = new createjs.Container;
        d.alpha = 0;
        d.visible = !1;
        l.addChild(d);
        l = s_oSpriteLibrary.getSprite("msg_box");
        f = createBitmap(l);
        l = f.getBounds();
        f.regX = l.width / 2;
        f.regY = l.height / 2;
        f.x = CANVAS_WIDTH / 2;
        f.y = CANVAS_HEIGHT / 2;
        d.addChild(f);
        g = new CTLText(d,CANVAS_WIDTH / 2 - 250,CANVAS_HEIGHT / 2 - 50 - 75,500,150,50,"center","#fff",PRIMARY_FONT,1,0,0," ",!0,!0,!0,!1);
        l = s_oSpriteLibrary.getSprite("but_home");
        h = new CGfxButton(CANVAS_WIDTH / 2,CANVAS_HEIGHT / 2 + 170,l,d);
        h.addEventListener(ON_MOUSE_DOWN, this._onExit, this)
    }
    ;
    this.unload = function() {
        h.unload();
        e.removeAllEventListeners();
        d.removeAllEventListeners();
        a.removeChild(e);
        a.removeChild(d)
    }
    ;
    this.addEventListener = function(l, k, m) {
        c[l] = k;
        b[l] = m
    }
    ;
    this.show = function(l) {
        playSound("game_over", 1, !1);
        d.visible = !0;
        g.refreshText(l.toUpperCase());
        createjs.Tween.get(e).to({
            alpha: .7
        }, 500);
        createjs.Tween.get(d).to({
            alpha: 1
        }, 500)
    }
    ;
    this._onExit = function() {
        c[ON_HOME] && c[ON_HOME].call(b[ON_HOME])
    }
    ;
    this.isShown = function() {
        return d.visible
    }
    ;
    this._init(a)
}
;