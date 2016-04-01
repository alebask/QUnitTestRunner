var QUnitTestRunner;
(function (QUnitTestRunner) {
    var Config;
    (function (Config) {
        Config.attachToKeyCode = 86;
        Config.stateCookieName = "qunit-enabled";
        Config.stateCookieDuration = 3600 * 24 * 1000;
        Config.qunitCssUrl = "qunit/qunit_1.22.0.css";
        Config.qunitJsUrl = "qunit/qunit_1.22.0.js";
        Config.qunitDivStyle = "height:80%;width:50%;top:0px;right:50px;position:absolute;background-color:gray;z-index:100;overflow-y:auto";
        Config.webResourceMonitorEnabled = true;
        Config.webResourceMonitorInterval = 1000;
    })(Config = QUnitTestRunner.Config || (QUnitTestRunner.Config = {}));
})(QUnitTestRunner || (QUnitTestRunner = {}));
var QUnitTestRunner;
(function (QUnitTestRunner) {
    var CookieState = (function () {
        function CookieState(cookieName, cookieDuration) {
            this.cookieName = cookieName;
            this.cookieDuration = cookieDuration;
        }
        CookieState.prototype.getEnabled = function () {
            var q = this.getCookie(this.cookieName);
            if (q == null)
                return false;
            var enabled = (parseInt(q) === 1);
            return enabled;
        };
        CookieState.prototype.setEnabled = function (enabled) {
            this.setCookie(this.cookieName, enabled ? 1 : 0);
        };
        CookieState.prototype.getCookie = function (key) {
            var keyValue = QUnitTestRunner.document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
            return keyValue ? keyValue[2] : null;
        };
        CookieState.prototype.setCookie = function (key, value) {
            var expires = new Date();
            expires.setTime(expires.getTime() + this.cookieDuration);
            QUnitTestRunner.document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
        };
        return CookieState;
    }());
    QUnitTestRunner.CookieState = CookieState;
})(QUnitTestRunner || (QUnitTestRunner = {}));
var QUnitTestRunner;
(function (QUnitTestRunner) {
    var ScriptLoader = (function () {
        function ScriptLoader(onload, onerror) {
            this.loading = 0;
            this.async = false;
            this.onload = onload;
            this.onerror = onerror;
        }
        ScriptLoader.prototype.load = function (url) {
            var _this = this;
            var head = QUnitTestRunner.document.getElementsByTagName('head')[0] || QUnitTestRunner.document.documentElement;
            var script = QUnitTestRunner.document.getElementById(url);
            if (script) {
                head.removeChild(script);
            }
            script = QUnitTestRunner.document.createElement("script");
            script.id = url;
            script.type = "text/javascript";
            script.src = url;
            script.async = this.async;
            script.onload = function () {
                if (--_this.loading) {
                    return;
                }
                if (_this.onload) {
                    _this.onload();
                }
            };
            script.onerror = function (e) {
                if (_this.onerror) {
                    _this.onerror(e);
                }
            };
            head.appendChild(script);
            this.loading++;
        };
        return ScriptLoader;
    }());
    QUnitTestRunner.ScriptLoader = ScriptLoader;
})(QUnitTestRunner || (QUnitTestRunner = {}));
var QUnitTestRunner;
(function (QUnitTestRunner) {
    var QUnitLib = (function () {
        function QUnitLib(qunitJsUrl, qunitCssUrl, qunitDivStyle, testUrls) {
            this.testUrls = new Array();
            this.qunitJsUrl = qunitJsUrl;
            this.qunitCssUrl = qunitCssUrl;
            this.qunitDivStyle = qunitDivStyle;
            if (testUrls) {
                this.addTests(testUrls);
            }
        }
        QUnitLib.prototype.addTests = function (urls) {
            var _this = this;
            urls.forEach(function (url) {
                if (_this.testUrls.indexOf(url) === -1) {
                    _this.testUrls.push(url);
                }
            });
        };
        QUnitLib.prototype.load = function () {
            var _this = this;
            this.createQUnitDiv();
            this.createQUnitFixtureDiv();
            this.loadQUnitCss();
            this.loadQUnitJs(function () {
                _this.loadTests();
                QUnitTestRunner.window.QUnit.begin(function () {
                    _this.cleanupQUnitInterface();
                    _this.setQUnitHeader();
                });
            });
        };
        QUnitLib.prototype.unload = function () {
            this.removeQUnitCss();
            this.removeQUnitJs();
            this.removeQUnitDiv();
            this.removeQUnitFixtureDiv();
        };
        QUnitLib.prototype.createQUnitDiv = function () {
            var qdiv = QUnitTestRunner.document.getElementById("qunit");
            if (qdiv == null) {
                qdiv = QUnitTestRunner.document.createElement("div");
                qdiv.id = "qunit";
                qdiv.style.cssText = this.qunitDivStyle;
            }
            QUnitTestRunner.document.body.appendChild(qdiv);
            return qdiv;
        };
        QUnitLib.prototype.removeQUnitDiv = function () {
            var qdiv = QUnitTestRunner.document.getElementById("qunit");
            if (qdiv != null) {
                qdiv.parentElement.removeChild(qdiv);
            }
        };
        QUnitLib.prototype.createQUnitFixtureDiv = function () {
            var qdiv_fix = QUnitTestRunner.document.getElementById("qunit-fixture");
            if (qdiv_fix == null) {
                qdiv_fix = QUnitTestRunner.document.createElement("div");
                qdiv_fix.id = "qunit-fixture";
            }
            QUnitTestRunner.document.body.appendChild(qdiv_fix);
            return qdiv_fix;
        };
        QUnitLib.prototype.removeQUnitFixtureDiv = function () {
            var qdiv = QUnitTestRunner.document.getElementById("qunit-fixture");
            if (qdiv != null) {
                qdiv.parentElement.removeChild(qdiv);
            }
        };
        QUnitLib.prototype.loadQUnitCss = function () {
            var link = QUnitTestRunner.document.getElementById(this.qunitCssUrl);
            if (link == null) {
                link = QUnitTestRunner.document.createElement("link");
                link.id = this.qunitCssUrl;
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = this.qunitCssUrl;
                QUnitTestRunner.document.getElementsByTagName('head')[0].appendChild(link);
            }
        };
        QUnitLib.prototype.removeQUnitCss = function () {
            var link = QUnitTestRunner.document.getElementById(this.qunitCssUrl);
            if (link) {
                link.parentElement.removeChild(link);
            }
        };
        QUnitLib.prototype.loadQUnitJs = function (onload) {
            var loader = new QUnitTestRunner.ScriptLoader(onload);
            loader.load(this.qunitJsUrl);
        };
        QUnitLib.prototype.removeQUnitJs = function () {
            var script = QUnitTestRunner.document.getElementById(this.qunitJsUrl);
            if (script) {
                script.parentElement.removeChild(script);
            }
            if (typeof QUnitTestRunner.window.QUnit != undefined) {
                QUnitTestRunner.window.QUnit = undefined;
            }
        };
        QUnitLib.prototype.loadTests = function () {
            var urls = this.testUrls;
            if (urls.length > 0) {
                var l = new QUnitTestRunner.ScriptLoader(QUnitTestRunner.window.QUnit.load);
                for (var i = 0; i < urls.length; i++) {
                    l.load(urls[i]);
                }
            }
            else {
                QUnitTestRunner.window.QUnit.load();
            }
        };
        QUnitLib.prototype.cleanupQUnitInterface = function () {
            var toolbar = QUnitTestRunner.document.getElementById("qunit-testrunner-toolbar");
            if (toolbar) {
                toolbar.style.display = "none";
            }
            var links = this.createQUnitDiv().getElementsByTagName("a") || [];
            for (var i = 0; i < links.length; i++) {
                links[i].style.display = "none";
            }
        };
        QUnitLib.prototype.setQUnitHeader = function () {
            var header = QUnitTestRunner.document.getElementById("qunit-header");
            if (header) {
                header.innerHTML = this.testUrls.join("<br>");
            }
        };
        return QUnitLib;
    }());
    QUnitTestRunner.QUnitLib = QUnitLib;
})(QUnitTestRunner || (QUnitTestRunner = {}));
var QUnitTestRunner;
(function (QUnitTestRunner) {
    var XrmQuery = (function () {
        function XrmQuery() {
        }
        XrmQuery.prototype.getXrmPage = function () {
            if (QUnitTestRunner.window.Xrm && QUnitTestRunner.window.Xrm.Page) {
                return QUnitTestRunner.window.Xrm.Page;
            }
            return undefined;
        };
        XrmQuery.prototype.getClientUrl = function () {
            return this.getXrmPage().context.getClientUrl();
        };
        XrmQuery.prototype.getOrganizationServiceUrl = function () {
            return this.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/";
        };
        XrmQuery.prototype.getCurrentFormId = function () {
            return this.getXrmPage().ui.formSelector.getCurrentItem().getId();
        };
        XrmQuery.prototype.retrieveCurrentFormWebResources = function () {
            var names = new Array();
            var query = "SystemFormSet(guid'" + this.getCurrentFormId() + "')?$select=FormXml";
            this.sendRequest(query, false, function (response) {
                var formXml = response.FormXml;
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(formXml, "text/xml");
                var nodes = xmlDoc.getElementsByTagName("Library");
                for (var i = 0; i < nodes.length; i++) {
                    names.push(nodes[i].getAttribute("name"));
                }
            });
            return names;
        };
        XrmQuery.prototype.retrieveWebResourceChangeDates = function (resourceNames, callback, onError) {
            var filter = this.createNameEndWithFilter(resourceNames);
            var query = "WebResourceSet?$select=ModifiedOn&" + filter;
            this.sendRequest(query, true, function (response) {
                var results = response.results;
                var dates = new Array();
                for (var i = 0; i < results.length; i++) {
                    var ms = parseInt(results[i].ModifiedOn.replace("/Date(", "").replace(")/", ""), 10);
                    var modifiedOn = new Date(ms);
                    dates.push(modifiedOn);
                }
                if (callback) {
                    callback(dates);
                }
            }, onError);
        };
        XrmQuery.prototype.sendRequest = function (query, async, onSuccess, onError) {
            var req = new XMLHttpRequest();
            req.open("GET", this.getOrganizationServiceUrl() + query, async);
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.onreadystatechange = function () {
                if (this.readyState === 4) {
                    this.onreadystatechange = null;
                    if (this.status === 200) {
                        var response = JSON.parse(this.responseText).d;
                        if (onSuccess) {
                            onSuccess(response);
                        }
                    }
                    else {
                        console.log("XrmQuery failed with status " + this.statusText + ". Query: " + query);
                        if (onError) {
                            onError(this.statusText);
                        }
                    }
                }
            };
            req.send();
        };
        XrmQuery.prototype.createNameEndWithFilter = function (resourceNames) {
            var nameFilters = [];
            resourceNames.forEach(function (name) {
                nameFilters.push("endswith(Name, '" + name + "')");
            });
            var filter = "$filter = " + nameFilters.join(" or ");
            return filter;
        };
        return XrmQuery;
    }());
    QUnitTestRunner.XrmQuery = XrmQuery;
})(QUnitTestRunner || (QUnitTestRunner = {}));
var QUnitTestRunner;
(function (QUnitTestRunner) {
    var WebResourceMonitor = (function () {
        function WebResourceMonitor(interval, enabled, onChange) {
            this.clientTimeStamp = new Date();
            this.timer = null;
            this.started = false;
            this.interval = 1000;
            this.enabled = true;
            this.webResources = new Array();
            this.xrmQuery = new QUnitTestRunner.XrmQuery();
            this.includeCurrentFormResources = false;
            this.interval = interval;
            this.enabled = enabled;
            if (onChange) {
                this.onChange = onChange;
            }
        }
        WebResourceMonitor.prototype.addResources = function (urls) {
            var _this = this;
            urls.forEach(function (url) {
                url = url.substring(url.lastIndexOf("/") + 1);
                if (_this.webResources.indexOf(url) === -1) {
                    _this.webResources.push(url);
                }
            });
        };
        WebResourceMonitor.prototype.start = function () {
            var _this = this;
            if (!this.xrmQuery.getXrmPage()) {
                console.warn("WebResourceMonitor.start(): no Xrm.Page found");
                return;
            }
            if (!this.enabled) {
                console.warn("WebResourceMonitor.start(): WebResourceChangeMonitor disabled");
                return;
            }
            if (this.started) {
                console.warn("WebResourceeMonitor.start(): already started");
                return;
            }
            if (this.includeCurrentFormResources) {
                var formResources = this.xrmQuery.retrieveCurrentFormWebResources();
                this.webResources = this.webResources.concat(formResources);
            }
            if (this.webResources.length < 1) {
                console.warn("WebResourceMonitor.start(): no resources to monitor");
                return;
            }
            this.timer = setInterval(function () { return _this.timerElapsed(); }, this.interval);
            console.log("WebResourceMonitor started on resources " + this.webResources.join(", "));
            this.started = true;
        };
        WebResourceMonitor.prototype.stop = function () {
            if (this.timer) {
                clearInterval(this.timer);
            }
            this.started = false;
            console.log("WebResourceMonitor stopped on resources " + this.webResources.join(", "));
        };
        WebResourceMonitor.prototype.timerElapsed = function () {
            var _this = this;
            this.xrmQuery.retrieveWebResourceChangeDates(this.webResources, function (dates) {
                var serverTimeStamp = dates.reduce(function (d1, d2) { return d1 > d2 ? d1 : d2; });
                if (serverTimeStamp > _this.clientTimeStamp) {
                    _this.clientTimeStamp = serverTimeStamp;
                    if (_this.onChange) {
                        _this.onChange(serverTimeStamp);
                    }
                }
            }, function () { return _this.stop(); });
        };
        return WebResourceMonitor;
    }());
    QUnitTestRunner.WebResourceMonitor = WebResourceMonitor;
})(QUnitTestRunner || (QUnitTestRunner = {}));
var QUnitTestRunner;
(function (QUnitTestRunner) {
    var crm2016 = 8.0;
    QUnitTestRunner.window = (getCrmVersion() >= crm2016) ? parent : self;
    QUnitTestRunner.document = QUnitTestRunner.window.document;
    var attachToKeyCode = QUnitTestRunner.Config.attachToKeyCode;
    var keyDownAttached = false;
    var testResourceUrls;
    var state = new QUnitTestRunner.CookieState(QUnitTestRunner.Config.stateCookieName, QUnitTestRunner.Config.stateCookieDuration);
    var qUnitLib = new QUnitTestRunner.QUnitLib(QUnitTestRunner.Config.qunitJsUrl, QUnitTestRunner.Config.qunitCssUrl, QUnitTestRunner.Config.qunitDivStyle);
    var changeDetector = new QUnitTestRunner.WebResourceMonitor(QUnitTestRunner.Config.webResourceMonitorInterval, QUnitTestRunner.Config.webResourceMonitorEnabled);
    function Execute() {
        var urls = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            urls[_i - 0] = arguments[_i];
        }
        testResourceUrls = urls;
        if (state.getEnabled()) {
            start();
        }
        if (!keyDownAttached) {
            attach_toogleTestEnabled_On_Ctrl_Shift_KeyDown();
            keyDownAttached = true;
        }
    }
    QUnitTestRunner.Execute = Execute;
    function start() {
        qUnitLib.addTests(testResourceUrls);
        qUnitLib.load();
        changeDetector.addResources(testResourceUrls);
        changeDetector.includeCurrentFormResources = true;
        changeDetector.onChange = reloadPage;
        changeDetector.start();
    }
    function stop() {
        qUnitLib.unload();
        changeDetector.stop();
    }
    function getEnabled() {
        return state.getEnabled();
    }
    QUnitTestRunner.getEnabled = getEnabled;
    function toggleTestEnabled() {
        if (state.getEnabled()) {
            state.setEnabled(false);
            stop();
        }
        else {
            state.setEnabled(true);
            start();
        }
    }
    function attach_toogleTestEnabled_On_Ctrl_Shift_KeyDown() {
        QUnitTestRunner.document.addEventListener("keydown", function (event) {
            if (event == null) {
                event = QUnitTestRunner.window.event;
            }
            if (event.ctrlKey && event.shiftKey && event.keyCode === attachToKeyCode) {
                toggleTestEnabled();
            }
        });
    }
    function getCrmVersion() {
        if (self.top && self.top.APPLICATION_VERSION) {
            return parseInt(self.top.APPLICATION_VERSION, 10);
        }
        return null;
    }
    function reloadPage() {
        var w = (QUnitTestRunner.window.top) ? QUnitTestRunner.window.top : QUnitTestRunner.window;
        w.location.reload(true);
    }
})(QUnitTestRunner || (QUnitTestRunner = {}));
