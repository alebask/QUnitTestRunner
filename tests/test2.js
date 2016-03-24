QUnit.module("tests from test2.js ");
QUnit.test("test2", function (assert) {

    var done = assert.async();

    setTimeout(function () {

        assert.ok(true, "async test2 ok!");
        done();

    }, 500);
});