jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"dockass/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"dockass/test/integration/pages/App",
	"dockass/test/integration/pages/Browser",
	"dockass/test/integration/pages/Master",
	"dockass/test/integration/pages/Detail",
	"dockass/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "dockass.view."
	});

	sap.ui.require([
		"dockass/test/integration/NavigationJourneyPhone",
		"dockass/test/integration/NotFoundJourneyPhone",
		"dockass/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});

