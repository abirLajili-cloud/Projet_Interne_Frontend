/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["printerne/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
