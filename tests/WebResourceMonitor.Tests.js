/// <reference path="../compiled_js/QUnitTestRunner.js" />
/// <reference path="fakes.js" />

QUnit.module("WebResourceMonitor");
QUnit.test("addResources(url) adds resource", function (assert) {

    var mon = new QUnitTestRunner.WebResourceMonitor(1000, true);    
    mon.addResources(["/WebResources/isv_/test1.js"]);

    assert.ok(mon.webResources.indexOf("test1.js") > -1, "Test web resource added to collection");
});

QUnit.test("includeCurrentFormResources=true adds form resources", function (assert) {
        
    var mon = new QUnitTestRunner.WebResourceMonitor(1000, true);
    mon.xrmQuery = new Fakes.XrmQuery(); //use fake        
    mon.addResources(["/WebResources/isv_/test1.js"]);

    mon.includeCurrentFormResources = true;
    mon.start();
    
    assert.ok(mon.webResources.indexOf("test1.js") > -1, "external resource added: test1.js");
    assert.ok(mon.webResources.indexOf("ab_qunit/QUnitTestRunner.js") > -1, "form resource added: ab_qunit/QUnitTestRunner.js"); 
    assert.ok(mon.webResources.indexOf("oppotunity/opportunity_main_ibrary.js") > -1, "form resource added: oppotunity/opportunity_main_ibrary.js");

});
QUnit.test("includeCurrentFormResources=false not adds form resources", function (assert) {

    var mon = new QUnitTestRunner.WebResourceMonitor(1000, true);
    mon.xrmQuery = new Fakes.XrmQuery(); //use fake    
    mon.addResources(["/WebResources/isv_/test1.js"]);

    mon.includeCurrentFormResources = false;
    mon.start();

    assert.ok(mon.webResources.indexOf("test1.js") > -1, "external resource added: test1.js");
    assert.ok(mon.webResources.indexOf("ab_qunit/QUnitTestRunner.js") == -1, "form resource not added: ab_qunit/QUnitTestRunner.js");
    assert.ok(mon.webResources.indexOf("oppotunity/opportunity_main_ibrary.js") == -1, "form resource not added: oppotunity/opportunity_main_ibrary.js");
        
});

QUnit.test("start() oChange fired ok", function (assert) {

    var done = assert.async();
    var query = new Fakes.XrmQuery();

    var mon = new QUnitTestRunner.WebResourceMonitor(10, true);
    mon.xrmQuery =query ; //use fake            
    mon.includeCurrentFormResources = true
    mon.addResources(["tests/test1.js"]);

    var d = new Date();
    d.setDate(d.getDate() + 1);

    mon.onChange = function (timeStamp) {
        assert.ok(true, "onChange fired on server date change");
        assert.equal(timeStamp.getTime(), d.getTime(), "server timestamp equals callback timestamp: " +timeStamp);
        assert.equal(timeStamp.getTime(), mon.clientTimeStamp.getTime(), "client timestamp equals callback timestamp: " +timeStamp);
        done();
    };

    mon.start();

    setTimeout(function () {
        Fakes.formWebResources[0].modifiedOn = d;
    }, 30);
});

QUnit.test("stops on error", function (assert) {

    var done = assert.async();
    var query = new Fakes.XrmQuery();

    var mon = new QUnitTestRunner.WebResourceMonitor(1, true);
    mon.xrmQuery = query; //use fake            
    mon.includeCurrentFormResources = true
        
    mon.start();

    assert.ok(mon.started, "monitor started ok");

    //set error occured
    query.errorOccurred = true;

    setTimeout(function () {
        assert.ok(!mon.started, "monitor stopped on error");
        done();
    }, 10);
});

QUnit.test("start() doesn' start if Xrm.Page undefined", function (assert) {
    
    var mon = new QUnitTestRunner.WebResourceMonitor(1000, true);
    
    var url = ["/WebResources/isv_/test1.js"];
    mon.addResources(url);
    
    mon.start();

    assert.equal(mon.started, false, "monitor didn't started as Xrm.Page undefined");

});

QUnit.test("start() doesn' start if no resources to monitor", function (assert) {

    var mon = new QUnitTestRunner.WebResourceMonitor(1000, true);
    mon.xrmQuery = new Fakes.XrmQuery();    

    mon.start();

    assert.equal(mon.webResources.length, 0, "number of resources to monitor is zero")
    assert.equal(mon.started, false, "monitor didn't started as no resources to monitor");

});

QUnit.test("start() doesn' start if set disabled", function (assert) {

    var mon = new QUnitTestRunner.WebResourceMonitor(1000, false);
    mon.xrmQuery = new Fakes.XrmQuery();   

    var url = ["/WebResources/isv_/test1.js"];
    mon.addResources(url);
    mon.start();
    
    assert.equal(mon.enabled, false, "monitor disabled")
    assert.equal(mon.started, false, "monitor didn't start as disabled");

});
