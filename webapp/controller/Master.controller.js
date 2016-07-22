/*global history */
sap.ui.define([
	"dockass/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"dockass/model/formatter"
], function(BaseController, JSONModel, Filter, FilterOperator, GroupHeaderListItem, Device, formatter) {
	"use strict";

	return BaseController.extend("dockass.controller.Master", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the master list controller is instantiated. It sets up the event handling for the master/detail communication and other lifecycle tasks.
		 * @public
		 */
		onInit: function() {
			// this.setModel(oViewModel, "masterView");
			// // Make sure, busy indication is showing immediately so there is no
			// // break after the busy indication for loading the view's meta data is
			// // ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			// oList.attachEventOnce("updateFinished", function(){
			// 	// Restore original busy indicator delay for the list
			// 	oViewModel.setProperty("/delay", iOriginalBusyDelay);
			// });

			// this.getView().addEventDelegate({
			// 	onBeforeFirstShow: function () {
			// 		this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
			// 	}.bind(this)
			// });

			// set data model on view
			// var oData = {
			//   plant : "no_vacio"
			// };
			// var oModel = new JSONModel(oData);
			// this.setmodel(oModel);
			// this.getView().setModel(oModel, "masterView");

			this.oFormatYyyymmdd = sap.ui.core.format.DateFormat.getInstance({
				pattern: "yyyyMMdd",
				calendarType: sap.ui.core.CalendarType.Gregorian
			});
			
			this.oFormatnav = sap.ui.core.format.DateFormat.getDateInstance();

			this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			this.getRouter().attachBypassed(this.onBypassed, this);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * After list data is available, this handler method updates the
		 * master list counter and hides the pull to refresh control, if
		 * necessary.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function(oEvent) {
			// update the master list object counter after new data is loaded
			this._updateListItemCount(oEvent.getParameter("total"));
			// hide pull to refresh if necessary
			this.byId("pullToRefresh").hide();
		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function() {
			this._oList.getBinding("items").refresh();
		},

		/**
		 * Event handler for the list selection event
		 * @param {sap.ui.base.Event} oEvent the list selectionChange event
		 * @public
		 */
		// onSelectionChange : function (oEvent) {
		// 	// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
		// 	this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
		// },
		onCalendarSelect: function(oEvent) {
			var oCalendar = oEvent.oSource;
			var aSelectedDates = oCalendar.getSelectedDates();
			var oDate;
			/*var vPlantId = this.byId("PlantId").getValue();*/
			var vPlantId = this.byId("CBMasterPlant").getValue();

			if (aSelectedDates.length > 0) {
				oDate = aSelectedDates[0].getStartDate();
				this._showDetail(this.oFormatYyyymmdd.format(oDate), vPlantId);
				// this._showDetail(oDate, vPlantId);
			}
		},

		/**
		 * Event handler for the bypassed event, which is fired when no routing pattern matched.
		 * If there was an object selected in the master list, that selection is removed.
		 * @public
		 */
		onBypassed: function() {
			this._oList.removeSelections(true);
		},

		/**
		 * Event handler for navigating back.
		 * We navigate back in the browser historz
		 * @public
		 */
		onNavBack: function() {
			history.go(-1);
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		_createViewModel: function() {
			return new JSONModel({
				isFilterBarVisible: false,
				filterBarLabel: "",
				delay: 0,
				title: this.getResourceBundle().getText("masterTitleCount", [0]),
				noDataText: this.getResourceBundle().getText("masterListNoDataText"),
				sortBy: "dock",
				groupBy: "None"
			});
		},

		/**
		 * If the master route was hit (empty hash) we have to set
		 * the hash to to the first item in the list as soon as the
		 * listLoading is done and the first item in the list is known
		 * @private
		 */
		_onMasterMatched: function() {
			this.getOwnerComponent().oListSelector.oWhenListLoadingIsDone.then(
				function(mParams) {
					if (mParams.list.getMode() === "None") {
						return;
					}
					var sObjectId = mParams.firstListitem.getBindingContext().getProperty("date");
					this.getRouter().navTo("object", {
						objectId: sObjectId
					}, true);
				}.bind(this),
				function(mParams) {
					if (mParams.error) {
						return;
					}
					this.getRouter().getTargets().display("detailNoObjectsAvailable");
				}.bind(this)
			);
		},

		/**
		 * Shows the selected item on the detail page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showDetail: function(oDate, oPlant) {
			var bReplace = !Device.system.phone;
			this.getRouter().navTo("object", {
				Plant: oPlant,
				Date: oDate
			}, bReplace);
		}
	});
});