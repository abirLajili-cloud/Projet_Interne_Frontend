/*global QUnit*/

sap.ui.define([
	"printerne/controller/PR_View.controller"
], function (Controller) {
	"use strict";

	QUnit.module("PR_View Controller");

	QUnit.test("I should test the PR_View controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
