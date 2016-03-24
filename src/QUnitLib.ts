/// <reference path="config.ts" />
/// <reference path="scriptloader.ts" />

    /**
     * Adds QUnit framework to page and executes tests         
     */
namespace QUnitTestRunner.QUnitLib {

    var qunitDivStyle: string = Config.qunitDivStyle;
    var qunitCssUrl: string = Config.qunitCssUrl;
    var qunitJsUrl: string = Config.qunitJsUrl;

    /**
     * Injects QUnit script, stylesheet and html elements to page, and after QUnit is ready, loads and executes tests
     * @param urls links to resources with tests
     */
    export function load(...urls: string[]) {

        createQUnitDiv();
        createQUnitFixtureDiv();
        loadQUnitCss();
        loadQUnitJs(() => {
            loadTests(...urls);
            targetWindow.QUnit.begin(() => {
                cleanupQUnitInterface();
                setQUnitHeader(...urls);
            });
        });
    }

    /**
     * Removes QUnit script library, stylesheet and html elements from page
     */
    export function unload(): void {
        removeQUnitCss();
        removeQUnitJs();
        removeQUnitDiv();
        removeQUnitFixtureDiv();
    }
    function createQUnitDiv() {
        var qdiv = targetDocument.getElementById("qunit");
        if (qdiv == null) {
            qdiv = targetDocument.createElement("div");
            qdiv.id = "qunit";
            qdiv.style.cssText = qunitDivStyle;
        }
        targetDocument.body.appendChild(qdiv);
        return qdiv;
    }
    function removeQUnitDiv() {
        var qdiv = targetDocument.getElementById("qunit");
        if (qdiv != null) {
            qdiv.parentElement.removeChild(qdiv);
        }
    }
    function createQUnitFixtureDiv() {
        var qdiv_fix = targetDocument.getElementById("qunit-fixture");
        if (qdiv_fix == null) {
            qdiv_fix = targetDocument.createElement("div");
            qdiv_fix.id = "qunit-fixture";
        }
        targetDocument.body.appendChild(qdiv_fix);
        return qdiv_fix;
    }
    function removeQUnitFixtureDiv() {
        var qdiv = targetDocument.getElementById("qunit-fixture");
        if (qdiv != null) {
            qdiv.parentElement.removeChild(qdiv);
        }
    }
    function loadQUnitCss() {
        var link = <HTMLLinkElement>targetDocument.getElementById(qunitCssUrl);
        if (link == null) {
            link = <HTMLLinkElement>targetDocument.createElement("link");
            link.id = qunitCssUrl;
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = qunitCssUrl;
            targetDocument.getElementsByTagName('head')[0].appendChild(link);
        }
    }
    function removeQUnitCss() {
        var link = targetDocument.getElementById(qunitCssUrl);
        if (link) {
            link.parentElement.removeChild(link);
        }
    }
    function loadQUnitJs(onload: Function): void {
        var loader = new ScriptLoader(onload);
        loader.load(qunitJsUrl);
    }
    function removeQUnitJs() {
        var script = targetDocument.getElementById(qunitJsUrl);
        if (script) {
            script.parentElement.removeChild(script);
        }

        //destroy QUnit
        if (typeof targetWindow.QUnit != undefined) {
            targetWindow.QUnit = undefined;
        }
    }
    function loadTests(...urls: string[]) {

        if (urls.length > 0) {
            var l = new ScriptLoader(targetWindow.QUnit.load); //load QUnit after tests
            for (var i = 0; i < urls.length; i++) {
                l.load(urls[i]);
            }
        }
        else {
            targetWindow.QUnit.load();
        }
    }
    function cleanupQUnitInterface() {

        //clean up testrunner interface as toolbar options and links do not work
        var toolbar = targetDocument.getElementById("qunit-testrunner-toolbar");
        if (toolbar) {
            toolbar.style.display = "none";
        }

        var links = createQUnitDiv().getElementsByTagName("a") || [];
        for (var i = 0; i < links.length; i++) {
            links[i].style.display = "none";
        }
    }
    function setQUnitHeader(...urls: string[]) {
        var header = targetDocument.getElementById("qunit-header");
        if (header) {
            header.innerHTML = urls.join("<br>");
        }
    }
}

