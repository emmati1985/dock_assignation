jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 DockAssignation in the list
// * All 3 DockAssignation have at least one DockToOrders

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
		"dockass/test/integration/MasterJourney",
		"dockass/test/integration/NavigationJourney",
		"dockass/test/integration/NotFoundJourney",
		"dockass/test/integration/BusyJourney"
	], function () {
		QUnit.start();
	});
});
