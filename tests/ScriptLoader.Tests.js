/// <reference path="../compiled_js/QUnitTestRunner.js" />

QUnit.module("ScriptLoader");

QUnit.test("load(any_url) script tag added", function (assert) {
    var url = "index1.js";
    var loader = new QUnitTestRunner.ScriptLoader();

    loader.load(url);

    //ASSERT
    var script = document.getElementById(url);
    assert.equal(script.id, url, "script tag added to page");
});

QUnit.test("load(any_url)x2 only one script tag added", function (assert) {
    var url = "index1.js";
    var loader = new QUnitTestRunner.ScriptLoader();

    loader.load(url);
    loader.load(url);

    //ASSERT
    var l = document.querySelectorAll("[id='" + url + "']");
    assert.equal(l.length, 1, "only one script tag added to page");
});



QUnit.test("load(bad_url) onerror fired", function (assert) {
    var done = assert.async();

    var bad_url = "http://bad_url"
    var loader = new QUnitTestRunner.ScriptLoader(
        function () {/*do nothing onload*/ },
        function (e) {
            //ASSERT
            assert.ok(true, "onerror fired");
            assert.equal(e.srcElement.id, bad_url);
            done();
        });

    loader.load(bad_url);
});

QUnit.test("load(url) jQuery cdn loaded", function (assert) {
    var done = assert.async();

    //load jQuery from cdn
    var url = "https://code.jquery.com/jquery-2.2.2.min.js";

    var loader = new QUnitTestRunner.ScriptLoader();
    loader.load(url);
    loader.onload = function () {
        //ASSERT
        assert.notEqual(eval("window.jQuery"), null, "jQuery loaded OK");
        done();

        //cleanup
        eval("window.jQuery = null;");
    };
});