/// <reference path="config.ts" />
/// <reference path="cookiestate.ts" />
/// <reference path="qunitlib.ts" />
/// <reference path="scriptloader.ts" />
    /**
     *Enables running QUnit tests on existing page
     */
namespace QUnitTestRunner {
    
    var attachToKeyCode = Config.attachToKeyCode;
    var keyDownAttached = false;

    const crm2016 = 8.0;

    export var targetWindow = (getCrmVersion() >= crm2016) ?  window.parent : window;//crm2016 loads custom web resources into iframe
    export var targetDocument = targetWindow.document; 
    
    /**
     * Loads and executes QUnit tests
     * @param urls urls of resources containing QUnit tests
     */
    export function Execute(...urls: string[]) {

        if (CookieState.getEnabled()) {
            QUnitLib.load(...urls);
        }
        if (!keyDownAttached) {
            attach_toogleTestEnabled_On_Ctrl_Shift_KeyDown(...urls);
            keyDownAttached = true;
        }
    }
        
    function toggleTestEnabled(...urls: string[]) {

        if (CookieState.getEnabled()) {
            CookieState.setEnabled(false);
            QUnitLib.unload();
        }
        else {
            CookieState.setEnabled(true);
            QUnitLib.load(...urls);
        }
    }
    function attach_toogleTestEnabled_On_Ctrl_Shift_KeyDown(...urls: string[]) {

        targetDocument.addEventListener("keydown", function (event) {
            if (event == null) {
                event = <KeyboardEvent>targetWindow.event;
            }
            if (event.ctrlKey && event.shiftKey && event.keyCode == attachToKeyCode) {
                toggleTestEnabled(...urls);
            }
        });
    }

    function getCrmVersion():number {
        
        if (window.top && window.top.APPLICATION_VERSION) {

            return parseInt(window.top.APPLICATION_VERSION);

        }

        return null;
    }
}
