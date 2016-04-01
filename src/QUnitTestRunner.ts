/// <reference path="config.ts" />
/// <reference path="cookiestate.ts" />
/// <reference path="qunitlib.ts" />
/// <reference path="scriptloader.ts" />
/// <reference path="webresourcemonitor.ts" />

/**
 *Enables running QUnit tests on existing page
 */
namespace QUnitTestRunner {
    const crm2016 = 8.0;

    // define window depending on crm version
    export var window = (getCrmVersion() >= crm2016) ? parent : self; // crm2016 loads custom web resources into their own iframe
    export var document = window.document;

    var attachToKeyCode = Config.attachToKeyCode;
    var keyDownAttached = false;
    var testResourceUrls:Array<string>;

    var state = new CookieState(Config.stateCookieName, Config.stateCookieDuration);
    var qUnitLib = new QUnitLib(Config.qunitJsUrl, Config.qunitCssUrl, Config.qunitDivStyle);
    var changeDetector = new WebResourceMonitor(Config.webResourceMonitorInterval, Config.webResourceMonitorEnabled);

    /**
     * Loads and executes QUnit tests
     * @param urls urls of resources containing QUnit tests
     */
    export function Execute(...urls: Array<string>) {

        testResourceUrls = urls;

        if (state.getEnabled()) {
            start();
        }
        if (!keyDownAttached) {
            attach_toogleTestEnabled_On_Ctrl_Shift_KeyDown();
            keyDownAttached = true;
        }
    }

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

    export function getEnabled() {
        return state.getEnabled();
    }

    function toggleTestEnabled() {
        if (state.getEnabled()) {
            state.setEnabled(false);
            stop();
        } else {
            state.setEnabled(true);
            start();
        }
    }
    function attach_toogleTestEnabled_On_Ctrl_Shift_KeyDown() {
        document.addEventListener("keydown", function (event: KeyboardEvent) {
            if (event == null) {
                event = <KeyboardEvent>window.event;
            }
            if (event.ctrlKey && event.shiftKey && event.keyCode === attachToKeyCode) {
                toggleTestEnabled();
            }
        });
    }

    function getCrmVersion(): number {
        if (self.top && self.top.APPLICATION_VERSION) {
            return parseInt(self.top.APPLICATION_VERSION, 10);
        }
        return null;
    }
    function reloadPage() {
        var w = (window.top) ? window.top : window;
        w.location.reload(true);
    }
}