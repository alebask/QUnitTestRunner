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
    })(Config = QUnitTestRunner.Config || (QUnitTestRunner.Config = {}));
})(QUnitTestRunner || (QUnitTestRunner = {}));
var QUnitTestRunner;
(function (QUnitTestRunner) {
    var CookieState;
    (function (CookieState) {
        var cookieName = QUnitTestRunner.Config.stateCookieName;
        var cookieDuration = QUnitTestRunner.Config.stateCookieDuration;
        function getEnabled() {
            var q = getCookie(cookieName);
            if (q == null)
                return false;
            var enabled = (parseInt(q) === 1);
            return enabled;
        }
        CookieState.getEnabled = getEnabled;
        function setEnabled(enabled) {
            setCookie(cookieName, enabled ? 1 : 0);
        }
        CookieState.setEnabled = setEnabled;
        function getCookie(key) {
            var keyValue = QUnitTestRunner.targetDocument.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
            return keyValue ? keyValue[2] : null;
        }
        function setCookie(key, value) {
            var expires = new Date();
            expires.setTime(expires.getTime() + cookieDuration);
            QUnitTestRunner.targetDocument.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
        }
    })(CookieState = QUnitTestRunner.CookieState || (QUnitTestRunner.CookieState = {}));
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
            var head = QUnitTestRunner.targetDocument.getElementsByTagName('head')[0] || QUnitTestRunner.targetDocument.documentElement;
            var script = QUnitTestRunner.targetDocument.getElementById(url);
            if (script) {
                head.removeChild(script);
            }
            script = QUnitTestRunner.targetDocument.createElement("script");
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
    var QUnitLib;
    (function (QUnitLib) {
        var qunitDivStyle = QUnitTestRunner.Config.qunitDivStyle;
        var qunitCssUrl = QUnitTestRunner.Config.qunitCssUrl;
        var qunitJsUrl = QUnitTestRunner.Config.qunitJsUrl;
        function load() {
            var urls = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                urls[_i - 0] = arguments[_i];
            }
            createQUnitDiv();
            createQUnitFixtureDiv();
            loadQUnitCss();
            loadQUnitJs(function () {
                loadTests.apply(void 0, urls);
                QUnitTestRunner.targetWindow.QUnit.begin(function () {
                    cleanupQUnitInterface();
                    setQUnitHeader.apply(void 0, urls);
                });
            });
        }
        QUnitLib.load = load;
        function unload() {
            removeQUnitCss();
            removeQUnitJs();
            removeQUnitDiv();
            removeQUnitFixtureDiv();
        }
        QUnitLib.unload = unload;
        function createQUnitDiv() {
            var qdiv = QUnitTestRunner.targetDocument.getElementById("qunit");
            if (qdiv == null) {
                qdiv = QUnitTestRunner.targetDocument.createElement("div");
                qdiv.id = "qunit";
                qdiv.style.cssText = qunitDivStyle;
            }
            QUnitTestRunner.targetDocument.body.appendChild(qdiv);
            return qdiv;
        }
        function removeQUnitDiv() {
            var qdiv = QUnitTestRunner.targetDocument.getElementById("qunit");
            if (qdiv != null) {
                qdiv.parentElement.removeChild(qdiv);
            }
        }
        function createQUnitFixtureDiv() {
            var qdiv_fix = QUnitTestRunner.targetDocument.getElementById("qunit-fixture");
            if (qdiv_fix == null) {
                qdiv_fix = QUnitTestRunner.targetDocument.createElement("div");
                qdiv_fix.id = "qunit-fixture";
            }
            QUnitTestRunner.targetDocument.body.appendChild(qdiv_fix);
            return qdiv_fix;
        }
        function removeQUnitFixtureDiv() {
            var qdiv = QUnitTestRunner.targetDocument.getElementById("qunit-fixture");
            if (qdiv != null) {
                qdiv.parentElement.removeChild(qdiv);
            }
        }
        function loadQUnitCss() {
            var link = QUnitTestRunner.targetDocument.getElementById(qunitCssUrl);
            if (link == null) {
                link = QUnitTestRunner.targetDocument.createElement("link");
                link.id = qunitCssUrl;
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = qunitCssUrl;
                QUnitTestRunner.targetDocument.getElementsByTagName('head')[0].appendChild(link);
            }
        }
        function removeQUnitCss() {
            var link = QUnitTestRunner.targetDocument.getElementById(qunitCssUrl);
            if (link) {
                link.parentElement.removeChild(link);
            }
        }
        function loadQUnitJs(onload) {
            var loader = new QUnitTestRunner.ScriptLoader(onload);
            loader.load(qunitJsUrl);
        }
        function removeQUnitJs() {
            var script = QUnitTestRunner.targetDocument.getElementById(qunitJsUrl);
            if (script) {
                script.parentElement.removeChild(script);
            }
            if (typeof QUnitTestRunner.targetWindow.QUnit != undefined) {
                QUnitTestRunner.targetWindow.QUnit = undefined;
            }
        }
        function loadTests() {
            var urls = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                urls[_i - 0] = arguments[_i];
            }
            if (urls.length > 0) {
                var l = new QUnitTestRunner.ScriptLoader(QUnitTestRunner.targetWindow.QUnit.load);
                for (var i = 0; i < urls.length; i++) {
                    l.load(urls[i]);
                }
            }
            else {
                QUnitTestRunner.targetWindow.QUnit.load();
            }
        }
        function cleanupQUnitInterface() {
            var toolbar = QUnitTestRunner.targetDocument.getElementById("qunit-testrunner-toolbar");
            if (toolbar) {
                toolbar.style.display = "none";
            }
            var links = createQUnitDiv().getElementsByTagName("a") || [];
            for (var i = 0; i < links.length; i++) {
                links[i].style.display = "none";
            }
        }
        function setQUnitHeader() {
            var urls = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                urls[_i - 0] = arguments[_i];
            }
            var header = QUnitTestRunner.targetDocument.getElementById("qunit-header");
            if (header) {
                header.innerHTML = urls.join("<br>");
            }
        }
    })(QUnitLib = QUnitTestRunner.QUnitLib || (QUnitTestRunner.QUnitLib = {}));
})(QUnitTestRunner || (QUnitTestRunner = {}));
var QUnitTestRunner;
(function (QUnitTestRunner) {
    var attachToKeyCode = QUnitTestRunner.Config.attachToKeyCode;
    var keyDownAttached = false;
    var crm2016 = 8.0;
    QUnitTestRunner.targetWindow = (getCrmVersion() >= crm2016) ? window.parent : window;
    QUnitTestRunner.targetDocument = QUnitTestRunner.targetWindow.document;
    function Execute() {
        var urls = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            urls[_i - 0] = arguments[_i];
        }
        if (QUnitTestRunner.CookieState.getEnabled()) {
            QUnitTestRunner.QUnitLib.load.apply(QUnitTestRunner.QUnitLib, urls);
        }
        if (!keyDownAttached) {
            attach_toogleTestEnabled_On_Ctrl_Shift_KeyDown.apply(void 0, urls);
            keyDownAttached = true;
        }
    }
    QUnitTestRunner.Execute = Execute;
    function toggleTestEnabled() {
        var urls = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            urls[_i - 0] = arguments[_i];
        }
        if (QUnitTestRunner.CookieState.getEnabled()) {
            QUnitTestRunner.CookieState.setEnabled(false);
            QUnitTestRunner.QUnitLib.unload();
        }
        else {
            QUnitTestRunner.CookieState.setEnabled(true);
            QUnitTestRunner.QUnitLib.load.apply(QUnitTestRunner.QUnitLib, urls);
        }
    }
    function attach_toogleTestEnabled_On_Ctrl_Shift_KeyDown() {
        var urls = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            urls[_i - 0] = arguments[_i];
        }
        QUnitTestRunner.targetDocument.addEventListener("keydown", function (event) {
            if (event == null) {
                event = QUnitTestRunner.targetWindow.event;
            }
            if (event.ctrlKey && event.shiftKey && event.keyCode == attachToKeyCode) {
                toggleTestEnabled.apply(void 0, urls);
            }
        });
    }
    function getCrmVersion() {
        if (window.top && window.top.APPLICATION_VERSION) {
            return parseInt(window.top.APPLICATION_VERSION);
        }
        return null;
    }
})(QUnitTestRunner || (QUnitTestRunner = {}));
