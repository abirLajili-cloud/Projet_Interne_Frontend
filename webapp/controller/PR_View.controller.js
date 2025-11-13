sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, MessageToast, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("printerne.controller.PR_View", {
        onInit() {
            // Initialisation si nécessaire
        },

        /** =========================
         * RECHERCHE ENTÊTES
         ========================== */
        onSearchHeader(oEvent) {
            const sQuery = oEvent.getParameter("newValue");
            const oBinding = this.byId("headerTable").getBinding("items");
            if (oBinding) {
                const oFilter = new Filter([
                    new Filter("PurchaseRequisition", FilterOperator.Contains, sQuery),
                    new Filter("PurReqnDescription", FilterOperator.Contains, sQuery)
                ], false);
                oBinding.filter(sQuery ? [oFilter] : []);
            }
        },

        /** =========================
         * RECHERCHE ITEMS
         ========================== */
        onSearchItem(oEvent) {
            const sQuery = oEvent.getParameter("newValue");
            const oBinding = this.byId("itemTable").getBinding("items");
            if (oBinding) {
                const oFilter = new Filter([
                    new Filter("Plant", FilterOperator.Contains, sQuery),
                    new Filter("Material", FilterOperator.Contains, sQuery)
                ], false);
                oBinding.filter(sQuery ? [oFilter] : []);
            }
        },

        /** =========================
         * POPUP CRÉATION RÉQUISITION
         ========================== */
        onCreateHeader() {
            this.byId("createDialogHeader").open();
        },

        onSaveHeader() {
            const sName = this.byId("nameInput").getValue();
            const sDesc = this.byId("descInput").getValue();
            const sDate = this.byId("dateInput").getDateValue();

            // Validation
            if (!sName || !sDesc || !sDate) {
                MessageToast.show("Veuillez remplir tous les champs !");
                return;
            }

            const oModel = this.getView().getModel();
            const aHeaders = oModel.getProperty("/PurchaseReqHeader") || [];

            aHeaders.push({
                LastChangeDateTime: sDate.toLocaleDateString(),
                PurchaseRequisition: sName,
                PurReqnDescription: sDesc,
                Items: []
            });

            oModel.setProperty("/PurchaseReqHeader", aHeaders);
            MessageToast.show("Réquisition créée !");
            this.byId("createDialogHeader").close();
        },

        onCancelHeader() {
            this.byId("createDialogHeader").close();
        },

        /** =========================
         * POPUP CRÉATION ITEM
         ========================== */
        onCreateItem() {
            this.byId("createDialogItem").open();
        },

        onSaveItem() {
            const sReq = this.byId("itemReqInput").getValue();
            const sPlant = this.byId("itemPlantInput").getValue();
            const sMaterial = this.byId("itemMaterialInput").getValue();

            if (!sReq || !sPlant || !sMaterial) {
                MessageToast.show("Veuillez remplir tous les champs !");
                return;
            }

            const oModel = this.getView().getModel();
            const aItems = oModel.getProperty("/PurchaseReqItem") || [];

            aItems.push({
                PurchaseRequisition: sReq,
                Plant: sPlant,
                Material: sMaterial
            });

            oModel.setProperty("/PurchaseReqItem", aItems);
            MessageToast.show("Item ajouté !");
            this.byId("createDialogItem").close();
        },

        onCancelItem() {
            this.byId("createDialogItem").close();
        },

        /** =========================
         * AFFICHER ITEMS POUR ENTÊTE
         ========================== */
        onHeaderSelect(oEvent) {
            const oSelectedItem = oEvent.getSource();
            const oContext = oSelectedItem.getBindingContext();
            const sPath = oContext.getPath();

            const oItemTable = this.byId("itemTable");
            oItemTable.bindItems({
                path: sPath + "/Items",
                template: new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Text({ text: "{PurchaseRequisition}" }),
                        new sap.m.Text({ text: "{Plant}" }),
                        new sap.m.Text({ text: "{Material}" })
                    ]
                })
            });
        }
    });
});