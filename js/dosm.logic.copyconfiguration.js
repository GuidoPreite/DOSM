// #region DOSM.Logic.CopyConfiguration
/**
 * Add configuration defined inside the Web Resource to the passed Forms
 * @param {DOSM.Models.WebResource} webResource Web Resource
 * @param {DOSM.Models.Forms[]} forms Forms
 */
DOSM.Logic.CopyConfiguration.AddConfigurationToForms = function (webResource, forms) {
    if (forms.length == 0) {
        DOSM.UI.ShowError("Copy Configuration Error", "No selected Forms", "large");
    } else {
        var foundEntities = DOSM.Utilities.GetArrayFromProperty(forms, "EntityLogicalName");
        if (foundEntities.length == 0) { DOSM.UI.ShowError("Copy Configuration Error", "No Entities found for selected Forms", "large"); }
        if (foundEntities.length > 1) { DOSM.UI.ShowError("Copy Configuration Error", "Multiple Entities found for selected Forms", "large"); }
        if (foundEntities.length == 1) {
            var targetEntities = [];
            targetEntities.push(new DOSM.Models.Entity(forms[0].EntityLogicalName, forms[0].EntityName));
            DOSM.Common.RetrieveEntityFields(foundEntities)
                .done(function (data) {
                    targetEntities = DOSM.Common.SetOptionSetsInsideEntities(data, targetEntities);
                    var errorMessagesCheck = DOSM.Common.CheckWebResourceErrors(webResource.Content, targetEntities, forms);
                    // no errors on dependency
                    if (errorMessagesCheck.length == 0) {
                        var parsedContent = JSON.parse(webResource.Content);
                        var formsToUpdate = [];
                        forms.forEach(function (form) {
                            var removedFormXml = DOSM.Common.RemoveConfigurationFromXml(form.FormXml);
                            var addedFormXml = DOSM.Common.AddConfigurationToXml(webResource.Path, parsedContent, removedFormXml);
                            formsToUpdate.push({ id: form.Id, formxml: addedFormXml });
                        });
                        DOSM.Common.UpdateForms(formsToUpdate)
                            .done(function () {
                                DOSM.Common.PublishEntities(foundEntities)
                                    .done(function () {
                                        DOSM.UI.SetEmpty("div_content");
                                        DOSM.UI.Show("Copy Configuration To Forms", "Configuration has been copied to the selected Forms");
                                    })
                                    .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.PublishEntities Error", DOSM.Common.GetErrorMessage(xhr)); });
                            })
                            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.UpdateForms Error", DOSM.Common.GetErrorMessage(xhr)); });
                    } else {
                        var errorsList = "<ul>";
                        errorMessagesCheck.forEach(function (errorMessage) { errorsList += "<li>" + errorMessage + "</li>"; });
                        errorsList += "</ul>";
                        DOSM.UI.ShowError("Copy Configuration Error", "Errors: <br />" + errorsList, "large");
                    }
                })
                .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveEntityFields Error", DOSM.Common.GetErrorMessage(xhr)); });
        }
    }
}

/*
 * Copy Configuration Process
 */
DOSM.Logic.CopyConfiguration.Process = function () {
    var selectedFormIds = $("#cbx_targetform").val();
    if (selectedFormIds.length == 0) { DOSM.UI.ShowError("Copy Configuration Error", "No Forms selected."); return; }

    var failedData = false;
    var selectedForms = [];
    for (var count = 0; count < selectedFormIds.length; count++) {
        var currentForm = DOSM.Utilities.GetRecordById(DOSM.Metadata.FilteredTargetForms.Records, selectedFormIds[count]);
        if (!DOSM.Utilities.HasValue(currentForm)) { failedData = true; break; }
        selectedForms.push(currentForm);
    }
    if (failedData == true || !DOSM.Utilities.HasValue(DOSM.Metadata.CurrentWebResource)) { DOSM.UI.ShowError("Copy Configuration Error", "Error retrieving required data."); return; }

    DOSM.UI.ShowLoading("Copying Configuration to selected Forms...<br /><b>This is a long-running operation, please wait for the confirmation message</b>", "large");
    setTimeout(function () {
        DOSM.Logic.CopyConfiguration.AddConfigurationToForms(DOSM.Metadata.CurrentWebResource, selectedForms);
    }, DOSM.Settings.TimeoutDelay);
}

/*
 * Copy Configuration Confirm
 */
DOSM.Logic.CopyConfiguration.Confirm = function () {
    var selectedFormIds = $("#cbx_targetform").val();
    if (selectedFormIds.length == 0) { DOSM.UI.ShowError("Copy Configuration Error", "No Forms selected."); return; }

    var failedData = false;
    var detailForms = "<br />";
    var detailGroup = "";
    for (var count = 0; count < selectedFormIds.length; count++) {
        var currentForm = DOSM.Utilities.GetRecordById(DOSM.Metadata.FilteredTargetForms.Records, selectedFormIds[count]);
        if (!DOSM.Utilities.HasValue(currentForm)) { failedData = true; break; }
        var currentGroup = "Entity: " + currentForm.EntityName + " (" + currentForm.EntityLogicalName + ")";
        if (currentGroup != detailGroup) {
            detailForms += currentGroup + "<ul>";
            detailGroup = currentGroup;
        }
        var formName = "<b>" + currentForm.Name + " (" + currentForm.FormType + ")</b>";
        detailForms += "<li>" + formName + "</li>";
    }
    detailForms += "</ul>";
    if (failedData == true || !DOSM.Utilities.HasValue(DOSM.Metadata.CurrentWebResource)) { DOSM.UI.ShowError("Copy Configuration Error", "Error retrieving required data."); return; }

    var webResourceTitle = DOSM.Metadata.CurrentWebResource.Name + " (" + DOSM.Metadata.CurrentWebResource.Path + ")";

    DOSM.UI.ShowQuestion("Copy Configuration to Forms",
        "The Configuration <b>" + webResourceTitle + "</b><br />will be copied to the following Forms:" + detailForms +
        "A check to verify if the required Fields are present inside the selected Forms will be performed.<br /><br />" +
        "<b>Continue?</b>", "large",
        function () { DOSM.Logic.CopyConfiguration.Process(); });
}

/**
 * Bind Entity
 * @param {string} entityElementId Entity Element Id
 * @param {string} formElementId Form Element Id
 * @param {string[]} formIdsToExclude Form Ids to exclude
 */
DOSM.Logic.CopyConfiguration.BindEntity = function (entityElementId, formElementId, formIdsToExclude) {
    $("#" + entityElementId).on("change", function (e) {
        var entityLogicalName = $(this).val();
        $("#" + formElementId).val(null).change();
        DOSM.UI.ShowLoading("Retrieving Forms...");
        setTimeout(function () {
            DOSM.Common.RetrieveFormsByEntityLogicalName(entityLogicalName)
                .done(function (data) {
                    var forms = DOSM.Common.MapForms(data, "Name", null, null, formIdsToExclude);
                    DOSM.Metadata.FilteredTargetForms = new DOSM.Models.Records(forms);
                    DOSM.UI.FillDropdown(formElementId, "Select Forms", DOSM.Metadata.FilteredTargetForms.ToDropdown(), false, false, true);
                    DOSM.UI.HideLoading();
                })
                .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveFormsByEntityLogicalName Error", DOSM.Common.GetErrorMessage(xhr)); });
        }, DOSM.Settings.TimeoutDelay);

    });
}

/**
 * Bind Form
 * @param {string} formElementId Form Element Id
 */
DOSM.Logic.CopyConfiguration.BindForm = function (formElementId) {
    $("#" + formElementId).on("change", function (e) {
        // empty the other area for selection
        DOSM.UI.SetEmpty("div_space");
        var selectedForm = DOSM.Utilities.GetRecordById(DOSM.Metadata.SourceForms.Records, $("#" + formElementId).val());
        if (!DOSM.Utilities.HasValue(selectedForm)) { return; }

        var selectedWebResource = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.ConfiguredWebResources.Records, "Path", selectedForm.ConfigurationPath);
        var selectedEntity = DOSM.Utilities.GetRecordById(DOSM.Metadata.ConfiguredEntities.Records, selectedForm.EntityLogicalName);

        if (!DOSM.Utilities.HasValue(selectedWebResource) || !DOSM.Utilities.HasValue(selectedEntity)) { DOSM.UI.ShowError("Copy Configuration Error", "Error retrieving required data."); return; }

        DOSM.Metadata.CurrentEntity = selectedEntity; // for the Show Instructions button
        DOSM.Metadata.CurrentWebResource = selectedWebResource; // for the Confirm and Show Instructions buttons

        var entityTitle = selectedEntity.Name + " (" + selectedEntity.LogicalName + ")";
        var webResourceTitle = selectedWebResource.Name + " (" + selectedWebResource.Path + ")";

        var container = DOSM.UI.CreateSubContainer(webResourceTitle);
        DOSM.UI.Append("div_space", container);

        var errorMessages = DOSM.Common.CheckConfiguredWebResourceErrors(selectedWebResource.Path, selectedWebResource.Content, [selectedEntity], [selectedForm])

        if (errorMessages.length == 0) {
            // create Target Entity dropdown
            container.append(DOSM.UI.CreateSpan("span_targetentity", "Target Entity"));
            container.append(DOSM.UI.CreateDropdown("cbx_targetentity"));

            // create Target Form dropdown
            container.append(DOSM.UI.CreateSpan("span_targetform", "Target Forms"));
            container.append(DOSM.UI.CreateDropdown("cbx_targetform", true, true));
            container.append(DOSM.UI.CreateSpacer());

            // fill and reset dropdowns
            DOSM.UI.FillDropdown("cbx_targetentity", "Select Entity", DOSM.Metadata.Entities.ToDropdown());
            DOSM.UI.ResetDropdown("cbx_targetform", "Select an Entity first");

            // add buttons
            container.append(DOSM.UI.CreateButton("btn_copyconfiguration_confirm", "Copy", DOSM.Logic.CopyConfiguration.Confirm, "btn-danger"));
            container.append(DOSM.UI.CreateButton("btn_copyconfiguration_showjson", "Show JSON", DOSM.Logic.CopyConfiguration.ShowJson));
            container.append(DOSM.UI.CreateButton("btn_copyconfiguration_showinstructions", "Manual Instructions", DOSM.Logic.CopyConfiguration.ShowInstructions));

            // set defaults
            $("#btn_copyconfiguration_confirm").prop("disabled", true);

            // set bindings
            DOSM.Common.BindButtonWithInputs("btn_copyconfiguration_confirm", ["cbx_targetform"]);
            var formIdsToExclude = DOSM.Utilities.GetArrayFromProperty(DOSM.Metadata.SourceForms.Records, "Id");
            DOSM.Logic.CopyConfiguration.BindEntity("cbx_targetentity", "cbx_targetform", formIdsToExclude);

            // select the entity that was selected in the upper one
            $("#cbx_targetentity").val(selectedEntity.LogicalName).change();

        } else {
            var errorList = "<ul>";
            errorMessages.forEach(function (errorMessage) { errorList += "<li>" + errorMessage + "</li>"; });
            errorList += "</ul>";

            DOSM.UI.ShowError("Copy Configuration Error", "The selected Configuration<br /><b>" +
                webResourceTitle + "</b><br />is not valid for the selected Form<br /><b>" +
                selectedForm.Name + " (" + selectedForm.FormType + ") - Entity: " + entityTitle + "</b><br /><br />" +
                "Errors: <br />" + errorList +
                "Please update or remove it from this Form", "large");
        }
    });
}

/*
 * Copy Configuration Show JSON
 */
DOSM.Logic.CopyConfiguration.ShowJson = function () {
    if (DOSM.Utilities.HasValue(DOSM.Metadata.CurrentWebResource)) { DOSM.Common.ShowJson(DOSM.Metadata.CurrentWebResource.Content, DOSM.Metadata.CurrentWebResource.Path); }
    else { DOSM.UI.ShowError("JSON Web Resource Error", "JSON Web Resource not found."); }
}

/**
 * Copy Configuration Show Instructions
 */
DOSM.Logic.CopyConfiguration.ShowInstructions = function () {
    if (!DOSM.Utilities.HasValue(DOSM.Metadata.CurrentWebResource)) { DOSM.UI.ShowError("JSON Web Resource Error", "JSON Web Resource not found."); return; }
    if (!DOSM.Utilities.HasValue(DOSM.Metadata.CurrentEntity)) { DOSM.UI.ShowError("Copy Configuration to Forms - Manual Instructions Error", "Error retrieving required data."); return; }
    try {
        var parsedContent = JSON.parse(DOSM.Metadata.CurrentWebResource.Content);
    }
    catch (e) { DOSM.UI.ShowError("JSON Web Resource Error", "Failed to parse JSON Web Resource"); return; }

    var instructionsMessage = "<u>For each Form</u> where you want to copy the configuration <b>" + DOSM.Metadata.CurrentWebResource.Path + "</b>:<br /><br />" +
        "<ol>" +
        "<li><u>If the Form has already a Configuration, remove it before proceeding</u></li><br />" +
        "<li>Add the library <b>" + DOSM.Settings.NewLibraryName + "</b></li><br />" +
        "<li>Under the Form OnLoad events list add a new event:<br /><br /><ul>" +
        "<li>set the library to <b>" + DOSM.Settings.NewLibraryName + "</b></li>" +
        "<li>set the function to <b>" + DOSM.Settings.NewInitFunctionName + "</b></li>" +
        "<li>check <i>Pass execution context</b> as first parameter</i></li>" +
        "<li>enter <b>&quot;" + DOSM.Metadata.CurrentWebResource.Path + "&quot;</b> (including quotation marks)<br />into the field <i>Comma separated list of parameters that will be passed to the function</i></li>" +
        "</ul><br />";

    var parseFailed = false;
    parsedContent.forEach(function (dependency) {
        var parentOption = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.CurrentEntity.OptionSets, "LogicalName", dependency.parent);
        if (!DOSM.Utilities.HasValue(parentOption)) { parseFailed = true; }
        var parentName = parentOption.DisplayName;

        instructionsMessage += "<li>Under the OnChange events list for the field <b>" + parentName + " (" + dependency.parent + ")</b> add a new event:<br /><br /><ul>" +
            "<li>set the library to <b>" + DOSM.Settings.NewLibraryName + "</b></li>" +
            "<li>set the function to <b>" + DOSM.Settings.NewFilterFunctionName + "</b></li>" +
            "<li>check <i>Pass execution context</b> as first parameter</i></li>" +
            "<li>enter <b>&quot;" + dependency.parent + "&quot;, &quot;" + dependency.child + "&quot;</b> (including quotation marks)<br />into the field <i>Comma separated list of parameters that will be passed to the function</i></li>" +
            "</ul><br />";
    });
    if (parseFailed == true) { DOSM.UI.ShowError("JSON Web Resource Error", "Failed to parse JSON Web Resource"); return; }
    instructionsMessage += "<li>Save and publish the Form</li></ol>";
    DOSM.UI.Show("Copy Configuration to Forms - Manual Instructions", instructionsMessage, "xl");
}

/**
 * Copy Configuration Start Function
 */
DOSM.Logic.CopyConfiguration.Start = function () {
    // Metadata used inside RemoveConfiguration
    // DOSM.Metadata.ConfiguredEntities
    // DOSM.Metadata.ConfiguredWebResources
    // DOSM.Metadata.CurrentEntity
    // DOSM.Metadata.CurrentWebResource
    // DOSM.Metadata.Entities
    // DOSM.Metadata.FilteredTargetForms
    // DOSM.Metadata.SourceForms

    // clear the DOSM.Metadata namespace
    DOSM.Metadata = {};

    // create container with title
    DOSM.UI.SetEmpty("div_content");
    var container = DOSM.UI.CreateWideContainer("Copy Configuration to Forms");
    DOSM.UI.Append("div_content", container);

    // create Form dropdown
    container.append(DOSM.UI.CreateSpan("span_sourceform", "Configured Forms"));
    container.append(DOSM.UI.CreateDropdown("cbx_sourceform"));
    container.append(DOSM.UI.CreateSpacer());

    // create additional container for the new selection
    container.append(DOSM.UI.CreateEmptyContainer("div_space"));

    // reset dropdown
    DOSM.UI.ResetDropdown("cbx_sourceform", "Forms");

    // check current solution
    DOSM.UI.ShowLoading("Checking Dependent Option Set Configurations...");
    setTimeout(function () {
        DOSM.Common.RetrieveEntities()
            .done(function (data) {
                var entities = DOSM.Common.MapEntities(data, "Name");
                DOSM.Metadata.Entities = new DOSM.Models.Records(entities);
                DOSM.Common.RetrieveWebResource(DOSM.Settings.NewLibraryId, "$select=name")
                    .done(function () {
                        DOSM.Common.RetrieveWebResourceDependentComponents(DOSM.Settings.NewLibraryId)
                            .done(function (data) {
                                var dependentFormIds = DOSM.Common.MapFormDependentComponents(data);
                                if (dependentFormIds.length == 0) {
                                    DOSM.UI.Show("Copy Configuration", "Dependent Option Set Manager Solution not used, no Configurations to copy.");
                                } else {
                                    DOSM.Common.RetrieveForms(dependentFormIds)
                                        .done(function (data) {
                                            var contextRegion = data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1);
                                            var context = JSON.parse(contextRegion);

                                            var forms = DOSM.Common.MapForms(context, "Name", DOSM.Settings.NewInitFunctionName, DOSM.Settings.NewLibraryName);
                                            var configurations = DOSM.Utilities.GetArrayFromProperty(forms, "ConfigurationPath");
                                            var foundEntities = DOSM.Utilities.GetArrayFromProperty(forms, "EntityLogicalName");
                                            DOSM.Metadata.SourceForms = new DOSM.Models.Records(forms);

                                            var configuredEntities = [];
                                            foundEntities.forEach(function (entity) {
                                                var foundEntity = DOSM.Utilities.GetRecordById(DOSM.Metadata.Entities.Records, entity);
                                                if (DOSM.Utilities.HasValue(foundEntity)) { configuredEntities.push(foundEntity); }
                                            });
                                            DOSM.Metadata.ConfiguredEntities = new DOSM.Models.Records(configuredEntities);

                                            DOSM.UI.FillDropdownWithGroups("cbx_sourceform", "Forms", DOSM.Metadata.SourceForms.ToDropdown());
                                            DOSM.Common.RetrieveWebResources(configurations)
                                                .done(function (data) {
                                                    var contextRegion = data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1);
                                                    var context = JSON.parse(contextRegion);

                                                    var configuredWebResources = DOSM.Common.MapWebResources(context);
                                                    DOSM.Metadata.ConfiguredWebResources = new DOSM.Models.Records(configuredWebResources);
                                                    // RetrieveEntityFields necessary to confirm that the form is configured correctly when selected
                                                    DOSM.Common.RetrieveEntityFields(foundEntities)
                                                        .done(function (data) {
                                                            DOSM.Metadata.ConfiguredEntities = new DOSM.Models.Records(DOSM.Common.SetOptionSetsInsideEntities(data, DOSM.Metadata.ConfiguredEntities.Records));

                                                            // set bindings
                                                            DOSM.Logic.CopyConfiguration.BindForm("cbx_sourceform");
                                                            // hide loading
                                                            DOSM.UI.HideLoading();
                                                        })
                                                        .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveEntityFields Error", DOSM.Common.GetErrorMessage(xhr)); });
                                                })
                                                .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveWebResources Error", DOSM.Common.GetErrorMessage(xhr)); });
                                        })
                                        .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveForms Error", DOSM.Common.GetErrorMessage(xhr)); });
                                }
                            })
                            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveWebResourceDependentComponents Error", DOSM.Common.GetErrorMessage(xhr)); });
                    })
                    .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveWebResource Error", DOSM.Common.GetErrorMessage(xhr)); });
            })
            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveEntities Error", DOSM.Common.GetErrorMessage(xhr)); });
    }, DOSM.Settings.TimeoutDelay);
}
// #endregion