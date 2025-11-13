sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";

    return Controller.extend("printerne.controller.Auth", {
        onClientPress: function() {
            // Redirection vers PR_View
            sap.ui.core.UIComponent.getRouterFor(this).navTo("PRView");
        },

        onFournisseurPress: function() {
            // Redirection vers la nouvelle vue Fournisseur
            sap.ui.core.UIComponent.getRouterFor(this).navTo("FournisseurView");
        },

        onAdminPress: function() {
            sap.m.MessageToast.show("Espace Admin (à implémenter)");
        }
    });
});