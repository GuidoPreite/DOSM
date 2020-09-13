// #region DOSM.Logic.UpgradeConfiguration

/**
 * Upgrade Configuration Process
 */
DOSM.Logic.UpgradeConfiguration.Process = function () {
    // proceed only if threre is at least one form inside DOSM.Metadata.UpgradeForms
    if (DOSM.Metadata.UpgradeForms.Records.length == 0) { DOSM.UI.ShowError("Upgrade Forms Error", "No Forms to upgrade."); return; }

    // store the forms to update and the entities to publish
    var formsToUpdate = [];
    var entitiesToPublish = [];
    DOSM.Metadata.UpgradeForms.Records.forEach(function (upgradeForm) {
        var upgradedXml = DOSM.Common.UpgradeConfigurationXml(upgradeForm.FormXml); // upgrade FormXml
        formsToUpdate.push({ id: upgradeForm.Id, formxml: upgradedXml });
        if (entitiesToPublish.indexOf(upgradeForm.EntityLogicalName) == -1) { entitiesToPublish.push(upgradeForm.EntityLogicalName); };
    });

    // show loading message
    DOSM.UI.ShowLoading("Upgrading Forms...<br /><b>This is a long-running operation, please wait for the confirmation message</b>", "large");
    setTimeout(function () {
        DOSM.Common.UpdateForms(formsToUpdate)
            .done(function () {
                DOSM.Common.PublishEntities(entitiesToPublish)
                    .done(function () {
                        DOSM.UI.SetEmpty("div_content");
                        DOSM.UI.Show("Upgrade Forms Completed", "All Forms have been upgraded to the new Dependent Option Set Manager.", "large");
                    })
                    .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.PublishEntities Error", DOSM.Common.GetErrorMessage(xhr)); });
            })
            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.UpdateForms Error", DOSM.Common.GetErrorMessage(xhr)); });
    }, DOSM.Settings.TimeoutDelay);
}

/**
 * Upgrade Configuration Confirm
 */
DOSM.Logic.UpgradeConfiguration.Confirm = function () {
    DOSM.UI.ShowQuestion("Upgrade Forms",
        "All Forms listed inside the dropdown will be updated to use the new Dependent Option Set Manager." +
        "<br /><br /><b>Continue?</b>", "large",
        function () { DOSM.Logic.UpgradeConfiguration.Process(); });
}

/**
 * Upgrade Configuration Show Instructions
 */
DOSM.Logic.UpgradeConfiguration.ShowInstructions = function () {
    var checkStatus = "check";
    if (DOSM.Settings.NewPassExecutionContext == "false") { checkStatus = "uncheck"; }

    var instructionsMessage = "<u>For each Form</u> that is using the previous library <i>" + DOSM.Settings.PreviousLibraryName + "</i>:<br /><br />" +
        "<ol>" +
        "<li>Add the library <b>" + DOSM.Settings.NewLibraryName + "</b></li><br />" +
        "<li>Under the Form OnLoad events list find the event using <i>" + DOSM.Settings.PreviousInitFunctionName + "</i> and open it</li><br />" +
        "<li>change the library to <b>" + DOSM.Settings.NewLibraryName + "</b>, change the function to <b>" + DOSM.Settings.NewInitFunctionName + "</b> and <b>" + checkStatus + " </b><i>Pass execution context as first parameter</i></li><br />" +
        "<li><u>For each Parent Field</u> that is part of a Dependent Option Set Configuration find the OnChange event using <i>" + DOSM.Settings.PreviousFilterFunctionName + "</i> and open it</li><br />" +
        "<ul><li>change the library to <b>" + DOSM.Settings.NewLibraryName + "</b>, change the function to <b>" + DOSM.Settings.NewFilterFunctionName + "</b> and <b>" + checkStatus + " </b><i>Pass execution context as first parameter</i></li></ul><br />" +
        "<li>Remove the previous library <i>" + DOSM.Settings.PreviousLibraryName + "</i> (at this point it should not be used), save and publish the Form</li>" +
        "</ol>";

    DOSM.UI.Show("Upgrade Forms - Manual Instructions", instructionsMessage, "xl");
}

/**
 * Ugrapde Configuration Start Function
 */
DOSM.Logic.UpgradeConfiguration.Start = function () {
    // Metadata used inside UpgradeConfiguration
    // DOSM.Metadata.UpgradeForms

    // clear the DOSM.Metadata namespace
    DOSM.Metadata = {};

    // create container with title
    DOSM.UI.SetEmpty("div_content");
    var container = DOSM.UI.CreateWideContainer("Upgrade from Dependent OptionSet Generator");
    DOSM.UI.Append("div_content", container);

    // create Form dropdown
    container.append(DOSM.UI.CreateSpan("span_form", "Forms using the previous Generator"));
    container.append(DOSM.UI.CreateDropdown("cbx_form"));
    container.append(DOSM.UI.CreateSpacer());

    // reset Form dropdown
    DOSM.UI.ResetDropdown("cbx_form", "Forms");

    // create buttons
    container.append(DOSM.UI.CreateButton("btn_upgradeconfiguration_confirm", "Upgrade", DOSM.Logic.UpgradeConfiguration.Confirm, "btn-danger"));
    container.append(DOSM.UI.CreateButton("btn_upgradeconfiguration_showinstructions", "Manual Instructions", DOSM.Logic.UpgradeConfiguration.ShowInstructions));

    // set button to default state
    $("#btn_upgradeconfiguration_confirm").prop("disabled", true);

    // check previous solution
    DOSM.UI.ShowLoading("Checking Previous Dependent Option Set Configurations...");
    setTimeout(function () {
        DOSM.Common.RetrieveWebResource(DOSM.Settings.PreviousLibraryId, "$select=name")
            .done(function () {
                DOSM.Common.RetrieveWebResourceDependentComponents(DOSM.Settings.PreviousLibraryId)
                    .done(function (data) {
                        var dependentFormIds = DOSM.Common.MapFormDependentComponents(data);
                        if (dependentFormIds.length == 0) {
                            DOSM.UI.Show("Upgrade not necessary", "Dependent OptionSet Generator Solution not used, Upgrade process is not necessary.", "large");
                        } else {
                            DOSM.Common.RetrieveForms(dependentFormIds)
                                .done(function (data) {
                                    var contextRegion = data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1);
                                    var context = JSON.parse(contextRegion);

                                    // map forms, fill dropdown and enable upgrade button
                                    var forms = DOSM.Common.MapForms(context, "Name", DOSM.Settings.PreviousInitFunctionName);
                                    DOSM.Metadata.UpgradeForms = new DOSM.Models.Records(forms);
                                    DOSM.UI.FillDropdownWithGroups("cbx_form", "Forms", DOSM.Metadata.UpgradeForms.ToDropdown(), true);
                                    $("#btn_upgradeconfiguration_confirm").prop("disabled", false);
                                    // hide loading
                                    DOSM.UI.HideLoading();
                                })
                                .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveForms Error", DOSM.Common.GetErrorMessage(xhr)); });
                        }
                    })
                    .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveWebResourceDependentComponents Error", DOSM.Common.GetErrorMessage(xhr)); });
            })
            .fail(function () { DOSM.UI.Show("Upgrade not necessary", "Dependent OptionSet Generator Solution not found, Upgrade process is not necessary.", "large"); });
    }, DOSM.Settings.TimeoutDelay);
}
// #endregion