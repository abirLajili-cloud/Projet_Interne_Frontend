sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel"
], (Controller, MessageToast, Filter, FilterOperator, JSONModel) => {
    "use strict";

    return Controller.extend("printerne.controller.PR_View", {
        onInit() {
            const oLocalModel = new JSONModel({
                SelectedHeader: {},
                SelectedItems: [],
                NewItems: []
            });
            this.getView().setModel(oLocalModel, "local");
        },

        /** Recherche */
        onSearchHeader(oEvent) {
            const sQuery = oEvent.getParameter("newValue");
            const oBinding = this.byId("headerTable").getBinding("items");
            if (oBinding) {
                const oFilter = new Filter([
                    new Filter("PurchaseRequisition", FilterOperator.Contains, sQuery),
                    new Filter("PurchaseRequisitionType", FilterOperator.Contains, sQuery)
                ], false);
                oBinding.filter(sQuery ? [oFilter] : []);
            }
        },

        /** Ouverture popup création */
        onCreateHeader() {
            this.getView().getModel("local").setProperty("/NewItems", []);
            this.byId("createDialogHeader").open();
        },

        onAddMaterial: function () {
            const oModel = this.getView().getModel("local");
            const aItems = oModel.getProperty("/NewItems");
            aItems.push({
                Item: (aItems.length + 1) * 10, // Numérotation SAP standard
                ProductTypeGroup: "Material (1)", // Type Material
                Material: "",
                MaterialGroup: "",
                Plant: "",
                Quantity: "0.000",
                ValuationPrice: "0.00",
                Requisitioner: "",
                TotalValue: ""
            });
            oModel.setProperty("/NewItems", aItems);
        },

        onAddService: function () {
            const oModel = this.getView().getModel("local");
            const aItems = oModel.getProperty("/NewItems");
            aItems.push({
                Item: (aItems.length + 1) * 10,
                ProductTypeGroup: "Service (2)", // Type Service
                Material: "",
                MaterialGroup: "",
                Plant: "",
                Quantity: "0.000",
                ValuationPrice: "0.00",
                Requisitioner: "",
                TotalValue: ""
            });
            oModel.setProperty("/NewItems", aItems);
        },

        /** Sauvegarde Réquisition avec Items */
        onSaveHeader() {
            const sHeaderNote = this.byId("headerNoteInput").getValue();
            const aItems = this.getView().getModel("local").getProperty("/NewItems");

            if (!sHeaderNote || aItems.length === 0) {
                MessageToast.show("Veuillez saisir une note et au moins un item !");
                return;
            }

            const oODataModel = this.getView().getModel("odata");
            oODataModel.create("/PurchaseReqHeader", {
                HeaderNote: sHeaderNote,
                to_Items: aItems
            }, {
                success: () => {
                    MessageToast.show("Réquisition créée !");
                    this.byId("createDialogHeader").close();
                    oODataModel.refresh();
                },
                error: () => MessageToast.show("Erreur lors de la création.")
            });
        },

        onCancelHeader() {
            this.byId("createDialogHeader").close();
        },

        /** Affichage détails */
        onHeaderSelect(oEvent) {
            const oContext = oEvent.getSource().getBindingContext("odata");
            const oHeaderData = oContext.getObject();
            const sPurchaseReq = oHeaderData.PurchaseRequisition;

            this.getView().getModel("local").setProperty("/SelectedHeader", oHeaderData);

            const oODataModel = this.getView().getModel("odata");
            const sPath = `/PurchaseReqHeader('${sPurchaseReq}')/to_Items`;

            oODataModel.read(sPath, {
                success: (oResult) => {
                    this.getView().getModel("local").setProperty("/SelectedItems", oResult.results);
                    this.byId("detailsDialog").open();
                },
                error: () => MessageToast.show("Erreur lors du chargement des items.")
            });
        },

        onCloseDialog() {
            this.byId("detailsDialog").close();
        },

        /** =========================
         * ACTION : CREATE ORDER
         ========================== */
        onCreateOrder(oEvent) {
            const oContext = oEvent.getSource().getParent().getBindingContext();
            const oData = oContext.getObject();

            this.getView().getModel("local").setProperty("/SelectedHeader", oData);
            this.byId("confirmOrderDialog").open();
        },

        onConfirmOrder() {
            const oSelectedHeader = this.getView().getModel("local").getProperty("/SelectedHeader");
            MessageToast.show("Order created for requisition: " + oSelectedHeader.PurchaseRequisition);
            this.byId("confirmOrderDialog").close();
        },

        onCancelOrder() {
            this.byId("confirmOrderDialog").close();
        }
    });
});