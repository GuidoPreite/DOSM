// #region DOSM.Logic.ShowFields
/**
 * Bind Entity dropdown to Entity Field, Entity Field Value, Form and Form Field dropdowns
 * Retrieve Fields and Forms of the selected Entity
 * @param {string} entityElementId  Entity Element Id (OnChange event)
 * @param {string} entityFieldElementId Entity Field Element Id
 * @param {string} entityFieldValueElementId Entity Field Value Element Id
 * @param {string} formElementId Form Element Id
 * @param {string} formFieldElementId Form Field Element Id
 */
DOSM.Logic.ShowFields.BindEntity = function (entityElementId, entityFieldElementId, entityFieldValueElementId, formElementId, formFieldElementId) {
    $("#" + entityElementId).on("change", function (e) {
        // reset the dropdowns
        DOSM.UI.ResetDropdown(entityFieldElementId, "Select an Entity first");
        DOSM.UI.ResetDropdown(entityFieldValueElementId, "Select an Entity Field first");
        DOSM.UI.ResetDropdown(formElementId, "Select an Entity first");
        DOSM.UI.ResetDropdown(formFieldElementId, "Select a Form first");

        var entityLogicalName = $(this).val();
        var entity = DOSM.Utilities.GetRecordById(DOSM.Metadata.Entities.Records, entityLogicalName);
        if (DOSM.Utilities.HasValue(entity)) {
            DOSM.UI.ShowLoading("Retrieving Entity Fields and Forms...");
            setTimeout(function () {
                // retrieve the Entity Fields
                DOSM.Common.RetrieveEntityFields([entityLogicalName])
                    .done(function (data) {
                        // set the Entity Field dropdown                      
                        var updatedEntities = DOSM.Common.SetOptionSetsInsideEntities(data, [entity]);
                        DOSM.Metadata.CurrentEntityFields = new DOSM.Models.Records(updatedEntities[0].OptionSets);
                        DOSM.UI.FillDropdown(entityFieldElementId, "Select an Entity Field", DOSM.Metadata.CurrentEntityFields.ToDropdown());
                        // retrieve the Entity Forms
                        DOSM.Common.RetrieveFormsByEntityLogicalName(entityLogicalName)
                            .done(function (data) {
                                // set the Forms dropdown
                                var forms = DOSM.Common.MapForms(data, "Name");
                                DOSM.Metadata.CurrentForms = new DOSM.Models.Records(forms);
                                DOSM.UI.FillDropdown(formElementId, "Select a Form", DOSM.Metadata.CurrentForms.ToDropdown(), false, false, true);
                                DOSM.UI.HideLoading();
                            })
                            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveFormsByEntityLogicalName Error", DOSM.Common.GetErrorMessage(xhr)); });
                    })
                    .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveEntityFields Error", DOSM.Common.GetErrorMessage(xhr)); });
            }, DOSM.Settings.TimeoutDelay);
        }
    });
}

/**
 * Bind Entity Field dropdown to Entity Field Value dropdown
 * @param {string} entityFieldElementId Entity Field Element Id (OnChange event)
 * @param {string} entityFieldValueElementId Entity Field Value Element Id
 */
DOSM.Logic.ShowFields.BindEntityField = function (entityFieldElementId, entityFieldValueElementId) {
    $("#" + entityFieldElementId).on("change", function (e) {
        var entityField = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.CurrentEntityFields.Records, "LogicalName", $(this).val());
        if (DOSM.Utilities.HasValue(entityField)) {
            DOSM.UI.FillDropdown(entityFieldValueElementId, "Show Entity Field Values", new DOSM.Models.Records(entityField.Values).ToDropdown(), true);
        }
    });
}

/**
 * Bind Form dropdown to Form Field dropdown
 * @param {string} formElementId Form Element Id (OnChange event)
 * @param {string} formFieldElementId Form Field Element Id
 */
DOSM.Logic.ShowFields.BindForm = function (formElementId, formFieldElementId) {
    $("#" + formElementId).on("change", function (e) {
        var form = DOSM.Utilities.GetRecordById(DOSM.Metadata.CurrentForms.Records, $(this).val());
        if (DOSM.Utilities.HasValue(form)) {
            var formFields = DOSM.Common.GetFieldsFromXml(form.FormXml);
            var optionSetValues = [];
            formFields.forEach(function (formField) {
                DOSM.Metadata.CurrentEntityFields.Records.forEach(function (entityField) {
                    if (formField == entityField.LogicalName) { optionSetValues.push(entityField); }
                });
            });
            optionSetValues.sort(DOSM.Utilities.CustomSort("DisplayName"));
            DOSM.UI.FillDropdown(formFieldElementId, "Show Form Fields", new DOSM.Models.Records(optionSetValues).ToDropdown(), true);
        }
    });
}

/**
 * Show Fields Start Function
 */
DOSM.Logic.ShowFields.Start = function () {
    // Metadata used inside ShowFields
    // DOSM.Metadata.CurrentEntityFields
    // DOSM.Metadata.CurrentForms
    // DOSM.Metadata.Entities

    // clear the DOSM.Metadata namespace
    DOSM.Metadata = {};

    // create container with title
    DOSM.UI.SetEmpty("div_content");
    var container = DOSM.UI.CreateWideContainer("Show Entities and Forms Fields");
    DOSM.UI.Append("div_content", container);

    //create Entity dropdown
    container.append(DOSM.UI.CreateSpan("span_entity", "Entity"));
    container.append(DOSM.UI.CreateDropdown("cbx_entity"));
    container.append(DOSM.UI.CreateSpacer());

    // create Entity Fields and Entity Field Values dropdowns
    container.append(DOSM.UI.CreateSpan("span_entityfield", "Entity Field"));
    container.append(DOSM.UI.CreateDropdown("cbx_entityfield"));
    container.append(DOSM.UI.CreateSpan("span_entityfieldvalue", "Entity Field Values"));
    container.append(DOSM.UI.CreateDropdown("cbx_entityfieldvalue"));
    container.append(DOSM.UI.CreateSpacer());

    // create Forms and Form Fields dropdowns
    container.append(DOSM.UI.CreateSpan("span_form", "Form"));
    container.append(DOSM.UI.CreateDropdown("cbx_form"));
    container.append(DOSM.UI.CreateSpan("span_formfield", "Form Fields"));
    container.append(DOSM.UI.CreateDropdown("cbx_formfield"));

    // reset dropdowns
    DOSM.UI.ResetDropdown("cbx_entity", "Select an Entity");
    DOSM.UI.ResetDropdown("cbx_entityfield", "Select an Entity first");
    DOSM.UI.ResetDropdown("cbx_entityfieldvalue", "Select an Entity Field first");
    DOSM.UI.ResetDropdown("cbx_form", "Select an Entity first");
    DOSM.UI.ResetDropdown("cbx_formfield", "Select a Form first");

    // retrieve entities
    DOSM.UI.ShowLoading("Retrieving Entities...");
    setTimeout(function () {
        DOSM.Common.RetrieveEntities()
            .done(function (data) {
                var entities = DOSM.Common.MapEntities(data, "Name");
                DOSM.Metadata.Entities = new DOSM.Models.Records(entities);
                DOSM.UI.FillDropdown("cbx_entity", "Select an Entity", DOSM.Metadata.Entities.ToDropdown());

                // define bindings
                DOSM.Logic.ShowFields.BindEntity("cbx_entity", "cbx_entityfield", "cbx_entityfieldvalue", "cbx_form", "cbx_formfield");
                DOSM.Logic.ShowFields.BindEntityField("cbx_entityfield", "cbx_entityfieldvalue");
                DOSM.Logic.ShowFields.BindForm("cbx_form", "cbx_formfield");

                // hide show loading
                DOSM.UI.HideLoading();
            })
            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveEntities Error", DOSM.Common.GetErrorMessage(xhr)); });
    }, DOSM.Settings.TimeoutDelay);
}
// #endregion