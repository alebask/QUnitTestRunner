/// <reference path="../compiled_js/QUnitTestRunner.js" />
QUnit.module("QUnitTestRunner");
QUnit.test("enabled after ctrl+shift+key", function (assert) {
    var url = "index1.js";
    var keyCode = QUnitTestRunner.Config.attachToKeyCode;
    var getEnabled = QUnitTestRunner.getEnabled;

    QUnitTestRunner.Execute(url);

    assert.ok(!getEnabled(), "by default QUnitTestRunner disabled");
       
    //press ctrl+shift+v
    simulateKeydownEvent(document.body, keyCode, true, true);

    assert.ok(getEnabled(), "QUnitTestRunner enabled after first {Ctrl+Shift+" + String.fromCharCode(keyCode) + "}");
});

function simulateKeydownEvent(element, keyCode, ctrlKey, shiftKey) {
    var event = document.createEvent("Events");
    event.initEvent("keydown", true, true);
    event.keyCode = keyCode;
    event.ctrlKey = ctrlKey;
    event.shiftKey = shiftKey;

    element.dispatchEvent(event);

}