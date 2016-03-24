/// <reference path="config.ts" />
    /**
     * Responsible for maintaining state of QUnitTestRunner
     */
namespace QUnitTestRunner.CookieState  {
    
    var cookieName: string = Config.stateCookieName;
    var cookieDuration: number = Config.stateCookieDuration;

    /**
     * If QUnitTestRunner enabled, returns true; otherwise returns false
     */
    export function getEnabled(): boolean {
        var q = getCookie(cookieName);
        if (q == null) return false;
        var enabled = (parseInt(q) === 1);
        return enabled;
    }

    /**
     * Enables or disables tQUnitTestRunner
     * @param enabled Pass true to enable QUnitTestRunner, to disable pass false
     */
    export function setEnabled(enabled: boolean): void {
        setCookie(cookieName, enabled ? 1 : 0);
    }

    //taken from codeproject 
    //http://www.codeproject.com/Tips/1009583/How-to-use-cookies-in-jQuery-without-a-plugin
    function getCookie(key) {
        var keyValue = targetDocument.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    }
    function setCookie(key, value) {
        var expires = new Date();
        expires.setTime(expires.getTime() + cookieDuration);
        targetDocument.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
    }
}
