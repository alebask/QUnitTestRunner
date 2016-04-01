/// <reference path="scriptloader.ts" />
namespace QUnitTestRunner {
    /**
     * Adds QUnit framework to page and executes tests
     */
    export class QUnitLib {
        private qunitDivStyle: string;
        private qunitCssUrl: string;
        private qunitJsUrl: string;

        private testUrls = new Array<string>();

        constructor(qunitJsUrl: string, qunitCssUrl: string, qunitDivStyle: string, testUrls?: Array<string>) {
            this.qunitJsUrl = qunitJsUrl;
            this.qunitCssUrl = qunitCssUrl;
            this.qunitDivStyle = qunitDivStyle;
            if (testUrls) {
                this.addTests(testUrls);
            }
        }

        public addTests(urls: Array<string>): void {
            urls.forEach((url: string) => {
                if (this.testUrls.indexOf(url) === -1) {
                    this.testUrls.push(url);
                }
            });
        }

        /**
         * Injects QUnit script, stylesheet and html elements to page, and after QUnit is ready, loads and executes tests
         */
        public load() {
            this.createQUnitDiv();
            this.createQUnitFixtureDiv();
            this.loadQUnitCss();
            this.loadQUnitJs(() => {
                this.loadTests();
                window.QUnit.begin(() => {
                    this.cleanupQUnitInterface();
                    this.setQUnitHeader();
                });
            });
        }

        /**
         * Removes QUnit script library, stylesheet and html elements from page
         */
        public unload(): void {
            this.removeQUnitCss();
            this.removeQUnitJs();
            this.removeQUnitDiv();
            this.removeQUnitFixtureDiv();
        }
        private createQUnitDiv() {
            var qdiv = document.getElementById("qunit");
            if (qdiv == null) {
                qdiv = document.createElement("div");
                qdiv.id = "qunit";
                qdiv.style.cssText = this.qunitDivStyle;
            }
            document.body.appendChild(qdiv);
            return qdiv;
        }
        private removeQUnitDiv() {
            var qdiv = document.getElementById("qunit");
            if (qdiv != null) {
                qdiv.parentElement.removeChild(qdiv);
            }
        }
        private createQUnitFixtureDiv() {
            var qdiv_fix = document.getElementById("qunit-fixture");
            if (qdiv_fix == null) {
                qdiv_fix = document.createElement("div");
                qdiv_fix.id = "qunit-fixture";
            }
            document.body.appendChild(qdiv_fix);
            return qdiv_fix;
        }
        private removeQUnitFixtureDiv() {
            var qdiv = document.getElementById("qunit-fixture");
            if (qdiv != null) {
                qdiv.parentElement.removeChild(qdiv);
            }
        }
        private loadQUnitCss() {
            var link = <HTMLLinkElement>document.getElementById(this.qunitCssUrl);
            if (link == null) {
                link = <HTMLLinkElement>document.createElement("link");
                link.id = this.qunitCssUrl;
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = this.qunitCssUrl;
                document.getElementsByTagName('head')[0].appendChild(link);
            }
        }
        private removeQUnitCss() {
            var link = document.getElementById(this.qunitCssUrl);
            if (link) {
                link.parentElement.removeChild(link);
            }
        }
        private loadQUnitJs(onload: Function): void {
            var loader = new ScriptLoader(onload);
            loader.load(this.qunitJsUrl);
        }
        private removeQUnitJs() {
            var script = document.getElementById(this.qunitJsUrl);
            if (script) {
                script.parentElement.removeChild(script);
            }

            //destroy QUnit
            if (typeof window.QUnit != undefined) {
                window.QUnit = undefined;
            }
        }
        private loadTests() {
            var urls = this.testUrls;

            if (urls.length > 0) {
                var l = new ScriptLoader(window.QUnit.load); //load QUnit after tests
                for (var i = 0; i < urls.length; i++) {
                    l.load(urls[i]);
                }
            } else {
                window.QUnit.load();
            }
        }
        private cleanupQUnitInterface() {
            //clean up testrunner interface as toolbar options and links do not work
            var toolbar = document.getElementById("qunit-testrunner-toolbar");
            if (toolbar) {
                toolbar.style.display = "none";
            }

            var links = this.createQUnitDiv().getElementsByTagName("a") || [];
            for (var i = 0; i < links.length; i++) {
                links[i].style.display = "none";
            }
        }
        private setQUnitHeader() {
            var header = document.getElementById("qunit-header");
            if (header) {
                header.innerHTML = this.testUrls.join("<br>");
            }
        }
    }
}