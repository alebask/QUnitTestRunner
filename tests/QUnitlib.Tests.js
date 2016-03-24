QUnit.module("QUnitLib");

QUnit.test("load() qunit js/css/div added to page", function (assert) {
    
    QUnitTestRunner.QUnitLib.load();

    var qunitDiv = document.getElementById("qunit");
    var qunitFixtureDiv = document.getElementById("qunit-fixture");
    var qunit_css = document.getElementById(QUnitTestRunner.Config.qunitCssUrl);
    var qunit_js = document.getElementById(QUnitTestRunner.Config.qunitJsUrl);
    
    assert.ok(qunitDiv != null, "qunit div found");
    assert.ok(qunitFixtureDiv != null, "qunit-fixture div found");
    assert.ok(qunit_css != null, "qunit css loaded");
    assert.ok(qunit_js != null, "qunit js loaded");

});

/*
These tests  do not work.
There is some interference between downloaded QUnit and built-in QUnit into Chutzpah.
I did not figured out it yet.

Error:
Unhandled exception at line 4068, column 2 in Microsoft/VisualStudio/14.0/Extensions/vn4kyx0n.six/TestFiles/QUnit/qunit.js
0x800a138f - Ошибка выполнения JavaScript: Не удалось получить свойство "getElementsByTagName" ссылки,
значение которой не определено или является NULL

QUnit.test("unload() qunit js/css/div removed from page", function (assert) {

    QUnitTestRunner.QUnitLib.load();

    var done = assert.async();

    setTimeout(() => {
        QUnitTestRunner.QUnitLib.unload();

        var qunitDiv = document.getElementById("qunit");
        var qunitFixtureDiv = document.getElementById("qunit-fixture");
        var qunit_css = document.getElementById(QUnitTestRunner.Config.qunitCssUrl);
        var qunit_js = document.getElementById(QUnitTestRunner.Config.qunitJsUrl);

        assert.ok(qunitDiv == null, "qunit div removed");
        assert.ok(qunitFixtureDiv == null, "qunit-fixture div removed");
        assert.ok(qunit_css == null, "qunit css unloaded");
        assert.ok(qunit_js == null, "qunit js unloaded");

        done();

    }, 10);

});

QUnit.test("load(good_url)", function (assert) {

    var good_url = "../index1.js";

    var done = assert.async();

    QUnitTestRunner.QUnitLib.load(good_url);

   setTimeout(() => {

        //ASSERT
       var script = document.getElementById(good_url);
       assert.ok(script != null, "script " + script + " loaded ok");

        done();
    }, 10);

});
*/