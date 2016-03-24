﻿QUnit.module("CookieState");
QUnit.test("getEnabled()/setEnabled(true|false)", function (assert) {

    assert.expect(3);

    var c = QUnitTestRunner.CookieState;
    
    assert.ok(false == c.getEnabled(), "by default should be disabled");  
    
    c.setEnabled(true);  
    assert.ok(true == c.getEnabled(), "after setting true should be true"); 
    
    c.setEnabled(false);
    assert.ok(false == c.getEnabled(), "after setting false should be false");

});