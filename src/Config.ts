    /**
     * Configuration parameters for QUnitTestRunner          
     */
namespace QUnitTestRunner.Config {
    /**
     * Pressed in combination with Shift+Ctrl activates QUnitTestRunner
     */
    export const attachToKeyCode: number = 86; /* v key */

    /**
     * Name of cookie to which QUnitTestRunner saves its state
     */
    export const stateCookieName: string = "qunit-enabled";

    /**
     * Expiration period of cookie which stores the state of QUnitTestRunner.
     */
    export const stateCookieDuration: number = 3600 * 24 * 1000; /*1day*/

    /**
     * Location of QUnit stylesheet
     */
    export const qunitCssUrl: string = "qunit/qunit_1.22.0.css";

    /**
     * Location of QUnit script library
     */
    export const qunitJsUrl: string = "qunit/qunit_1.22.0.js";

    /**
     * Modify in order to change the default appearance of QUnit test runner on a page after activation
     */
    export const qunitDivStyle: string = "height:80%;width:50%;top:0px;right:50px;position:absolute;background-color:gray;z-index:100;overflow-y:auto";    
}



