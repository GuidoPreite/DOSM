// #region DOSM.Logic.DeleteJSON
/**
 * Delete JSON Process
 */
DOSM.Logic.DeleteJSON.Process = function () {
    var webResourceId = $("#cbx_webresource").val();
    var selectedWebResource = DOSM.Utilities.GetRecordById(DOSM.Metadata.WebResources.Records, webResourceId);
    if (!DOSM.Utilities.HasValue(selectedWebResource)) { DOSM.UI.ShowError("JSON Web Resource Error", "JSON Web Resource not found."); return; }

    var webResourcePath = selectedWebResource.Path;
    var webResourceName = selectedWebResource.Name;

    DOSM.UI.ShowLoading("Deleting JSON Web Resource...");
    setTimeout(function () {
        DOSM.Common.RetrieveWebResource(DOSM.Settings.NewLibraryId, "$select=name")
            .done(function () {
                DOSM.Common.RetrieveWebResourceDependentComponents(DOSM.Settings.NewLibraryId)
                    .done(function (data) {
                        var dependentFormIds = DOSM.Common.MapFormDependentComponents(data);
                        DOSM.Common.RetrieveForms(dependentFormIds)
                            .done(function (data) {
                                var webResourceUsed = false;
                                if (dependentFormIds.length > 0) {
                                    var contextRegion = data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1);
                                    var context = JSON.parse(contextRegion);

                                    var libraryForms = DOSM.Common.MapForms(context, null, DOSM.Settings.NewInitFunctionName, DOSM.Settings.NewLibraryName);
                                    var configurations = DOSM.Utilities.GetArrayFromProperty(libraryForms, "ConfigurationPath");
                                    if (configurations.indexOf(webResourcePath) > -1) { webResourceUsed = true; }
                                }
                                if (webResourceUsed == true) {
                                    DOSM.UI.ShowError("Delete JSON Web Resource Error", "JSON Web Resource <b>" + webResourcePath + " (" + webResourceName + ")</b> is used inside a Configuration, it cannot be deleted.", "large");
                                }
                                else {
                                    DOSM.Common.DeleteWebResource(webResourceId)
                                        .done(function () {
                                            DOSM.UI.SetEmpty("div_content");
                                            DOSM.UI.Show("JSON Web Resource Deleted", "JSON Web Resource <b>" + webResourcePath + " (" + webResourceName + ")</b> has been deleted.", "large");
                                        })
                                        .fail(function (xhr) { DOSM.UI.ShowError("Delete JSON Web Resource Error", DOSM.Common.GetErrorMessage(xhr)); });
                                }
                            })
                            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveForms Error", DOSM.Common.GetErrorMessage(xhr)); });
                    })
                    .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveWebResourceDependentComponents Error", DOSM.Common.GetErrorMessage(xhr)); });
            })
            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveWebResource Error", DOSM.Common.GetErrorMessage(xhr)); });
    }, DOSM.Settings.TimeoutDelay);
}

/**
 *  Delete JSON Confirm
 */
DOSM.Logic.DeleteJSON.Confirm = function () {
    var selectedWebResource = DOSM.Utilities.GetRecordById(DOSM.Metadata.WebResources.Records, $("#cbx_webresource").val());
    if (!DOSM.Utilities.HasValue(selectedWebResource)) { DOSM.UI.ShowError("JSON Web Resource Error", "JSON Web Resource not found."); return; }

    DOSM.UI.ShowQuestion("Delete JSON Web Resource",
        "JSON Web Resource <b>" + selectedWebResource.Path + " (" + selectedWebResource.Name + ")</b> will be deleted.<br />" +
        "A check to verify that is not used in a Configuration will be performed.<br />" +
        "<b>Make sure the Web Resource is not used in other contexts before deleting it.</b>" +
        "<br /><br /><b>Continue?</b>", "large",
        function () { DOSM.Logic.DeleteJSON.Process(); });
}

/**
 * Bind Solution dropdown to Web Resource dropdown
 * @param {string} solutionElementId Solution Element Id
 * @param {string} webResourceElementId Web Resource Element Id
 */
DOSM.Logic.DeleteJSON.BindSolution = function (solutionElementId, webResourceElementId) {
    $("#" + solutionElementId).on("change", function (e) {
        var solutionId = $(this).val();
        $("#" + webResourceElementId).val(null).change();
        DOSM.UI.ShowLoading("Retrieving Web Resources...");
        setTimeout(function () {
            DOSM.Common.RetrieveSolutionWebResources(solutionId)
                .done(function (data) {
                    var webResources = DOSM.Common.MapWebResources(data, "Name");
                    DOSM.Metadata.WebResources = new DOSM.Models.Records(webResources);
                    DOSM.UI.FillDropdown(webResourceElementId, "Select a Web Resource", DOSM.Metadata.WebResources.ToDropdown());
                    DOSM.UI.HideLoading();
                })
                .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveSolutionWebResources Error", DOSM.Common.GetErrorMessage(xhr)); });
        }, DOSM.Settings.TimeoutDelay);
    });
}

/*
 * Delete JSON Show JSON
 */
DOSM.Logic.DeleteJSON.ShowJson = function () {
    var selectedWebResource = DOSM.Utilities.GetRecordById(DOSM.Metadata.WebResources.Records, $("#cbx_webresource").val());
    if (DOSM.Utilities.HasValue(selectedWebResource)) { DOSM.Common.ShowJson(selectedWebResource.Content, selectedWebResource.Path); }
    else { DOSM.UI.ShowError("JSON Web Resource Error", "JSON Web Resource not found."); }
}

/*
 * Delete Web Resource Show Instructions
 */
DOSM.Logic.DeleteJSON.ShowInstructions = function () {
    var instructionsMessage = "<ol>" +
        "<li>Make sure the Web Resource is not used inside a Dependent Option Set Configuration or other contexts</li><br />" +
        "<li>Select an Unmanaged Solution containing the Web Resource you want to delete</li><br />" +
        "<li>Select the Web Resource and delete it</li>" +
        "</ol>";
    DOSM.UI.Show("Delete JSON Web Resource - Manual Instructions", instructionsMessage, "large");
}

/*
 * Delete JSON Start Function
 */
DOSM.Logic.DeleteJSON.Start = function () {
    // Metadata used inside DeleteJSON
    // DOSM.Metadata.WebResources

    // clear the DOSM.Metadata namespace
    DOSM.Metadata = {};

    // create container with title
    DOSM.UI.SetEmpty("div_content");
    var container = DOSM.UI.CreateWideContainer("Delete JSON Web Resource");
    DOSM.UI.Append("div_content", container);

    // create Solution dropdown
    container.append(DOSM.UI.CreateSpan("span_solution", "Solution"));
    container.append(DOSM.UI.CreateDropdown("cbx_solution"));
    container.append(DOSM.UI.CreateSpacer());

    // create Web Resource dropdown
    container.append(DOSM.UI.CreateSpan("span_webresource", "Web Resource"));
    container.append(DOSM.UI.CreateDropdown("cbx_webresource"));
    container.append(DOSM.UI.CreateSpacer());

    // reset dropdowns
    DOSM.UI.ResetDropdown("cbx_solution", "Select a Solution");
    DOSM.UI.ResetDropdown("cbx_webresource", "Select a Solution first");

    // create buttons
    container.append(DOSM.UI.CreateButton("btn_deletejson_confirm", "Delete", DOSM.Logic.DeleteJSON.Confirm, "btn-danger"));
    container.append(DOSM.UI.CreateButton("btn_deletejson_showjson", "Show JSON", DOSM.Logic.DeleteJSON.ShowJson));
    container.append(DOSM.UI.CreateButton("btn_deletejson_showinstructions", "Manual Instructions", DOSM.Logic.DeleteJSON.ShowInstructions));

    // set buttons to default state
    $("#btn_deletejson_confirm").prop("disabled", true);
    $("#btn_deletejson_showjson").prop("disabled", true);

    // retrieve solutions
    DOSM.UI.ShowLoading("Retrieving Solutions...");
    setTimeout(function () {
        DOSM.Common.RetrieveSolutions()
            .done(function (data) {
                var solutions = DOSM.Common.MapSolutions(data, "DisplayName");
                DOSM.UI.FillDropdown("cbx_solution", "Select a Solution", new DOSM.Models.Records(solutions).ToDropdown());

                // set bindings
                DOSM.Common.BindButtonWithInputs("btn_deletejson_confirm", ["cbx_webresource"]);
                DOSM.Common.BindButtonWithInputs("btn_deletejson_showjson", ["cbx_webresource"]);
                DOSM.Logic.DeleteJSON.BindSolution("cbx_solution", "cbx_webresource");

                // hide show loading
                DOSM.UI.HideLoading();
            })
            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveSolutions Error", DOSM.Common.GetErrorMessage(xhr)); });
    }, DOSM.Settings.TimeoutDelay);
}
// #endregion