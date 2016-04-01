/// <reference path="../compiled_js/QUnitTestRunner.js" />

//create fakes
var Fakes = Fakes || {};

 Fakes.formWebResources = [{ name: "ab_qunit/QUnitTestRunner.js", modifiedOn: new Date(2016, 01, 20) },
                         { name: "oppotunity/opportunity_main_ibrary.js", modifiedOn: new Date(2016, 01, 21) }];
 
 Fakes.XrmQuery = function () {

     var query = this;
     this.errorOccurred = false;

     this.retrieveCurrentFormWebResources = function () {
         return Fakes.formWebResources.map(function (res) { return res.name; });
     };

     this.retrieveWebResourceChangeDates = function (resourceNames, callback, onError) {

         var dates = Fakes.formWebResources.map(function (res) { return res.modifiedOn; });
         if (callback) {
             callback(dates);
         }
         if (query.errorOccurred && onError) {
             onError();
         }
     };


     this.getXrmPage = function () {
         return new Object();
     };
     this.getClientUrl = function () {

     };
     this.getOrganizationServiceUrl = function () {

     };
     this.getCurrentFormId = function () {

     };
 };


