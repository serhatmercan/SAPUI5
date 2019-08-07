/*global location */
sap.ui.define([
	"com/spro/uismsapui5/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"com/spro/uismsapui5/model/formatter",
	"com/spro/uismsapui5/model/models",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/routing/History",
	"sap/ui/Device",
	"sap/m/Popover",
	"sap/m/Button",
	"sap/m/library"
], function(BaseController, JSONModel, formatter, models, MessageToast, Filter, FilterOperator, History, Device, Popover, Button,
	mobileLibrary) {
	"use strict";

	var ButtonType = mobileLibrary.ButtonType,
		PlacementType = mobileLibrary.PlacementType;

	return BaseController.extend("com.spro.uismsapui5.controller.Action", {

		formatter: formatter,

		onInit: function() {

			this._First = true;

			this._oResourceBundle = this.getResourceBundle();

			this.getRouter().getRoute("action").attachPatternMatched(this._onObjectMatched, this);

		},

		// --> Action Sheet
		onPressActionSheet: function(oEvent) {
			if (!this._actionSheet) {
				this._actionSheet = sap.ui.xmlfragment("com.spro.uismsapui5.fragment.ActionSheet", this);
				this.getView().addDependent(this._actionSheet);
			}
			this._actionSheet.openBy(oEvent.getSource());
		},

		actionSelected: function(oEvent) {
			MessageToast.show("Selected action is '" + oEvent.getSource().getText() + "'");
		},
		// <-- Action Sheet
		// --> Breadcrumbs
		onPressBreadcrumbs: function(oEvent) {
			MessageToast.show(oEvent.getSource().getText() + " has been activated.");
		},
		// <-- Breadcrumbs
		// --> Menu
		handlePressOpenMenu: function(oEvent) {
			var oButton = oEvent.getSource();

			if (!this._menu) {
				this._menu = sap.ui.xmlfragment("com.spro.uismsapui5.fragment.MenuItemEventing", this);
				this.getView().addDependent(this._menu);
			}

			var eDock = sap.ui.core.Popup.Dock;
			this._menu.open(this._bKeyboard, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);
		},
		handleMenuItemPress: function(oEvent) {
			var msg = "'" + oEvent.getParameter("item").getText() + "' pressed";
			MessageToast.show(msg);
		},
		handleTextFieldItemPress: function(oEvent) {
			var msg = "'" + oEvent.getParameter("item").getValue() + "' entered";
			MessageToast.show(msg);
		},
		// <-- Menu
		// --> Navigation List
		onCollapseExpandPress: function() {
			var oNavigationList = this.byId("navigationList");
			var bExpanded = oNavigationList.getExpanded();

			oNavigationList.setExpanded(!bExpanded);
		},
		// <-- Navigation List
		// --> Overflow Toolbar Button
		onSliderMoved: function(oEvent) {
			var iValue = oEvent.getParameter("value");
			this.byId("otbFooter").setWidth(iValue + "%");
		},
		// <-- Overflow Toolbar Button
		// --> Pull To Refresh
		handleRefresh: function(evt) {
			setTimeout(function() {
				this.byId("pullToRefresh").hide();
				// Read Data
			}.bind(this), 3000);
		},
		// <-- Pull To Refresh
		// --> Generic Tag
		onGenericTagPress: function(oEvent) {
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("com.spro.uismsapui5.fragment.Card", this);
				this.getView().addDependent(this._oPopover);
			}
			this._oPopover.openBy(oEvent.getSource());
		},
		// <-- Generic Tag
		// --> URL Helper
		_getVal: function(evt) {
			return sap.ui.getCore().byId(evt.getParameter("id")).getValue();
		},

		handleTelPress: function(evt) {
			sap.m.URLHelper.triggerTel(this._getVal(evt));
		},

		handleSmsPress: function(evt) {
			sap.m.URLHelper.triggerSms(this._getVal(evt));
		},

		handleEmailPress: function(evt) {
			sap.m.URLHelper.triggerEmail(this._getVal(evt), "Info Request");
		},

		handleUrlPress: function(evt) {
			sap.m.URLHelper.redirect(this._getVal(evt), true);
		},
		// <-- URL Helper

		onAfterRendering: function() {
			if (this._First) {
				this._First = false;
			}
		},

		_onObjectMatched: function(oEvent) {},

		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash(),
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"),
				bReplace = !Device.system.phone;
			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				history.go(-1);
			} else {
				this.getRouter().navTo("menu", {}, bReplace);
			}
		}
	});

});
