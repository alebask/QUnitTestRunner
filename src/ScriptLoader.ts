namespace QUnitTestRunner {
    /**
     * Enables downloading remote scripts to existing page
     *
     */
    export class ScriptLoader {
        /**The number of currently loading scripts*/
        loading: number = 0;

        /**set true for synchronous loading; default is false*/
        async: boolean = false;

        /**callback after loading all scripts*/
        onload: Function;

        /**callback in case of error*/
        onerror: Function;

        /**
         * Creates a new instance of ScriptLoader
         * @param onload callback after loading all scripts
         * @param onerror callback in case of error
         */
        constructor(onload?: Function, onerror?: Function) {
            this.onload = onload;
            this.onerror = onerror;
        }

        /**
         * Loads a remote script by adding a <script> tag to page's head
         * @param url location of remote script
         */
        load(url: string): void {
            var head = document.getElementsByTagName('head')[0] || document.documentElement;

            var script = <HTMLScriptElement>document.getElementById(url);

            if (script) {
                head.removeChild(script);
            }

            script = document.createElement("script");
            script.id = url;
            script.type = "text/javascript";
            script.src = url;
            script.async = this.async;
            script.onload = () => {
                if (--this.loading) {
                    return;
                }
                if (this.onload) {
                    this.onload();
                }
            };

            script.onerror = (e: Event) => {
                if (this.onerror) {
                    this.onerror(e);
                }
            };

            head.appendChild(script);

            this.loading++;
        }
    }
}