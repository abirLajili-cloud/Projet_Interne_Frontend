sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("printerne.controller.Auth", {

        onLoginPress: function () {
            var oModel = this.getOwnerComponent().getModel("authModel");
            var sUserId = this.byId("inputUser").getValue();
            var sPassword = this.byId("inputPassword").getValue();

            oModel.bindAction({
                path: "/ZI_BUSINESSPARTNER('" + sUserId + "')/SAP__self.authenticate",
                parameters: {
                    userid: sUserId,
                    password: sPassword
                }
            }).execute().then(function (oData) {
                if (oData.isAuthenticated === "X") {
                    if (oData.redirecturl === "/customer/home") {
                        this.getOwnerComponent().getRouter().navTo("PRView");
                    } else if (oData.redirecturl === "/supplier/home") {
                        this.getOwnerComponent().getRouter().navTo("FournisseurView");
                    } else {
                        this.getOwnerComponent().getRouter().navTo("AdministratorView");
                    }
                } else {
                    sap.m.MessageToast.show(oData.message);
                }
            }.bind(this));
        }


    });
});