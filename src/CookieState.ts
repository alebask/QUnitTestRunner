namespace QUnitTestRunner {
    export class CookieState {
        private cookieName: string;
        private cookieDuration: number;

        constructor(cookieName: string, cookieDuration: number) {
            this.cookieName = cookieName;
            this.cookieDuration = cookieDuration;
        }

        getEnabled(): boolean {
            var q = this.getCookie(this.cookieName);
            if (q == null) return false;
            var enabled = (parseInt(q) === 1);
            return enabled;
        }

        setEnabled(enabled: boolean): void {
            this.setCookie(this.cookieName, enabled ? 1 : 0);
        }

        //taken from codeproject
        //http://www.codeproject.com/Tips/1009583/How-to-use-cookies-in-jQuery-without-a-plugin
        private getCookie(key) {
            var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
            return keyValue ? keyValue[2] : null;
        }
        private setCookie(key, value) {
            var expires = new Date();
            expires.setTime(expires.getTime() + this.cookieDuration);
            document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
        }
    }
}