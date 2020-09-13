// #region DOSM.Logic.RemoveConfiguration
/*
 * Remove Configuration Show Process
 */
DOSM.Logic.RemoveConfiguration.Process = function () {
    var selectedFormIds = $("#cbx_form").val();
    if (selectedFormIds.length == 0) { DOSM.UI.ShowError("Remove Configuration Error", "No Forms selected."); return; }

    var failedData = false;
    var formsToUpdate = [];
    var entitiesToPublish = [];

    for (var count = 0; count < selectedFormIds.length; count++) {
        var currentForm = DOSM.Utilities.GetRecordById(DOSM.Metadata.Forms.Records, selectedFormIds[count]);
        if (!DOSM.Utilities.HasValue(currentForm)) { failedData = true; break; }
        var removedXml = DOSM.Common.RemoveConfigurationFromXml(currentForm.FormXml);
        formsToUpdate.push({ id: currentForm.Id, formxml: removedXml });
        if (entitiesToPublish.indexOf(currentForm.EntityLogicalName) == -1) { entitiesToPublish.push(currentForm.EntityLogicalName); };
    }
    if (failedData == true) { DOSM.UI.ShowError("Remove Configuration Error", "Error retrieving required data."); return; }

    DOSM.UI.ShowLoading("Removing Configuration from selected Forms...<br /><b>This is a long-running operation, please wait for the confirmation message</b>", "large");
    setTimeout(function () {
        DOSM.Common.UpdateForms(formsToUpdate)
            .done(function () {
                DOSM.Common.PublishEntities(entitiesToPublish)
                    .done(function () {
                        DOSM.UI.SetEmpty("div_content");
                        DOSM.UI.Show("Remove Configuration from Forms", "Configuration has been removed from the selected Forms.");
                    })
                    .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.PublishEntities Error", DOSM.Common.GetErrorMessage(xhr)); });
            })
            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.UpdateForms Error", DOSM.Common.GetErrorMessage(xhr)); });
    }, DOSM.Settings.TimeoutDelay);
}

/*
 * Remove Configuration Show Confirm
 */
DOSM.Logic.RemoveConfiguration.Confirm = function () {
    var selectedFormIds = $("#cbx_form").val();
    if (selectedFormIds.length == 0) { DOSM.UI.ShowError("Remove Configuration Error", "No Forms selected."); return; }

    var failedData = false;
    var detailForms = "<ul>";
    var detailGroup = "";
    for (var count = 0; count < selectedFormIds.length; count++) {
        var currentForm = DOSM.Utilities.GetRecordById(DOSM.Metadata.Forms.Records, selectedFormIds[count]);
        if (!DOSM.Utilities.HasValue(currentForm)) { failedData = true; break; }
        var currentGroup = "Entity: " + currentForm.EntityName + " (" + currentForm.EntityLogicalName + ")";
        if (currentGroup != detailGroup) {
            if (detailGroup != "") { detailForms += "</ul></li>"; }

            detailForms += "<li>" + currentGroup + "<ul>";
            detailGroup = currentGroup;

        }
        var formName = "<b>" + currentForm.Name + " (" + currentForm.FormType + ")</b>";
        if (DOSM.Utilities.HasValue(currentForm.ConfigurationPath)) { formName += " - Configuration: <b>" + currentForm.ConfigurationPath + "</b>"; }
        detailForms += "<li>" + formName + "</li>";
    }
    detailForms += "</ul></li></ul>";

    if (failedData == true) { DOSM.UI.ShowError("Remove Configuration Error", "Error retrieving required data."); return; }

    DOSM.UI.ShowQuestion("Remove Configuration from Forms",
        "The Dependent Option Set Configuration will be removed from the following Forms:" + detailForms + "<b>Continue?</b>", "large",
        function () { DOSM.Logic.RemoveConfiguration.Process(); });

}

/*
 * Remove Configuration Show Instructions
 */
DOSM.Logic.RemoveConfiguration.ShowInstructions = function () {
    var instructionsMessage = "<u>For each Form</u> that is using the library <b>" + DOSM.Settings.NewLibraryName + "</b>:<br /><br />" +
        "<ol>" +
        "<li><u>For each Parent Field</u> that is part of a Dependent Option Set Configuration find the OnChange event using <b>" + DOSM.Settings.NewFilterFunctionName + "</b> and remove it</li><br />" +
        "<li>Under the Form OnLoad events list find the event using <b>" + DOSM.Settings.NewInitFunctionName + "</b> and remove it</li><br />" +
        "<li>Remove the library <b>" + DOSM.Settings.NewLibraryName + "</b> (at this point it should not be used), save and publish the Form</li>" +
        "</ol>";

    DOSM.UI.Show("Remove Configuration from Forms - Manual Instructions", instructionsMessage, "xl");
}

/*
 * Remove Configuration Start Function
 */
DOSM.Logic.RemoveConfiguration.Start = function () {
    // Metadata used inside RemoveConfiguration
    // DOSM.Metadata.Forms

    // clear the DOSM.Metadata namespace
    DOSM.Metadata = {};

    // create container with title
    DOSM.UI.SetEmpty("div_content");
    var container = DOSM.UI.CreateWideContainer("Remove Configuration from Forms");
    DOSM.UI.Append("div_content", container);

    // create Form dropdown
    container.append(DOSM.UI.CreateSpan("span_form", "Configured Forms"));
    container.append(DOSM.UI.CreateDropdown("cbx_form", true, true));
    container.append(DOSM.UI.CreateSpacer());

    // reset dropdown
    DOSM.UI.ResetDropdown("cbx_form", "Forms");

    // create buttons
    container.append(DOSM.UI.CreateButton("btn_removeconfiguration_confirm", "Remove", DOSM.Logic.RemoveConfiguration.Confirm, "btn-danger"));
    container.append(DOSM.UI.CreateButton("btn_removeconfiguration_showinstructions", "Manual Instructions", DOSM.Logic.RemoveConfiguration.ShowInstructions));

    // set the button to default state
    $("#btn_removeconfiguration_confirm").prop("disabled", true);

    // check DOSM solution
    DOSM.UI.ShowLoading("Checking Dependent Option Set Configurations...");
    setTimeout(function () {
        DOSM.Common.RetrieveWebResource(DOSM.Settings.NewLibraryId, "$select=name")
            .done(function () {
                DOSM.Common.RetrieveWebResourceDependentComponents(DOSM.Settings.NewLibraryId)
                    .done(function (data) {
                        var dependentFormIds = DOSM.Common.MapFormDependentComponents(data);
                        if (dependentFormIds.length == 0) {
                            DOSM.UI.Show("Remove Configuration not necessary", "Dependent Option Set Manager Solution not used, Remove process is not necessary.");
                        } else {
                            DOSM.Common.RetrieveForms(dependentFormIds)
                                .done(function (data) {
                                    var contextRegion = data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1);
                                    var context = JSON.parse(contextRegion);

                                    var forms = DOSM.Common.MapForms(context, "Name", DOSM.Settings.NewInitFunctionName, DOSM.Settings.NewLibraryName);
                                    DOSM.Metadata.Forms = new DOSM.Models.Records(forms);
                                    DOSM.UI.FillDropdownWithGroups("cbx_form", "Forms", DOSM.Metadata.Forms.ToDropdown());

                                    // define bindings
                                    DOSM.Common.BindButtonWithInputs("btn_removeconfiguration_confirm", ["cbx_form"]);

                                    // hide show loading
                                    DOSM.UI.HideLoading();
                                })
                                .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveForms Error", DOSM.Common.GetErrorMessage(xhr)); });
                        }
                    })
                    .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveWebResourceDependentComponents Error", DOSM.Common.GetErrorMessage(xhr)); });
            })
            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveWebResource Error", DOSM.Common.GetErrorMessage(xhr)); });
    }, DOSM.Settings.TimeoutDelay);
}
// #endregion