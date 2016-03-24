
### QUnitTestRunner.js is a small library for running [QUnit](https://qunitjs.com/) tests on Microsoft Dynamics CRM forms

*Tested with Microsoft Dynamics CRM 2013 / 2015 / 2016*

####How to use QUnitTestRunner.js

1. Import *QUnitTestRunner.zip* solution to your CRM organization.
2. Add *QUnitTestRunner.js* web resource to entity form.
3. Register method *QUnitTestRunner.Execute(path)* on load event of the form, 
where *path* points to a web resource with QUnit tests. For example, *QUnitTestRunner.Execute("/WebResources/isv_tests.js")*. 
4. Open CRM form and press Ctrl+Shift+V to activate QUnitTestRunner. 
You should see that QUnit div popups on the page with your tests being executed.

To disable QUnitTestRunner press Ctrl+Shift+V again.

If your tests are arragend in several files, then pass them comma-delimeted to *QUnitTestRunner.Execute(path1, path2,...)* method. 

Instead of importing solution you can add three web resources into your CRM organization by hand:

* *QUnitTestRunner.js*
* *qunit_1.22.0.js*
* *qunit_1.22.0.css*

You can achieve a smooth TDD workflow by using QUnitTestRunner together with [CrmDeveloperExtensions](https://github.com/jlattimer/CRMDeveloperExtensions),
which allows one-click publish of web resources from Visual Studio to CRM server .

**Note.**
Project contains a slighlty modified version of QUnit. 
I commented out lines 4191-4209 in the original QUnit script *qunit_1.22.0.js* to prevent triggering *QUnit.load()* on window load. 
I call *QUnit.load()* directly in QUnitTestRunner after loading all files with tests. 

*@alebask*