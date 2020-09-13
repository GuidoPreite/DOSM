// #region DOSM.Logic.CloneJSON
/**
 * Clone Web Resource Process
 */
DOSM.Logic.CloneJSON.Process = function () {
    var sourceWebResource = DOSM.Utilities.GetRecordById(DOSM.Metadata.SourceWebResources.Records, $("#cbx_sourcewebresource").val());
    var targetSolution = DOSM.Utilities.GetRecordById(DOSM.Metadata.TargetSolutions.Records, $("#cbx_targetsolution").val());

    var targetWebResourcePath = $("#txt_webresource_prefix").text() + $("#txt_webresource_path").val(); // we compose the webresource name (prefix + name)
    var targetWebResourceDisplayName = $("#txt_webresource_name").val(); // we retrieve the display name

    if (!DOSM.Utilities.HasValue(sourceWebResource) || !DOSM.Utilities.HasValue(targetSolution) ||
        !DOSM.Utilities.HasValue(targetWebResourcePath) || !DOSM.Utilities.HasValue(targetWebResourceDisplayName)) {
        DOSM.UI.ShowError("Clone JSON Web Resource Error", "Error retrieving required data.");
        return;
    }

    DOSM.UI.ShowLoading("Cloning JSON Web Resource...");
    setTimeout(function () {
        var newWebResourceData = { name: targetWebResourcePath, displayname: targetWebResourceDisplayName, webresourcetype: 3, content: btoa(sourceWebResource.Content) };
        DOSM.Common.CreateWebResource(newWebResourceData)
            .done(function (data, textStatus, xhr) {
                var uri = xhr.getResponseHeader("OData-EntityId");
                var webResourceId = /\(([^)]+)\)/.exec(uri)[1];
                DOSM.Common.PublishWebResource(webResourceId)
                    .done(function () {
                        var selectedWebResource = new DOSM.Models.WebResource(webResourceId, targetWebResourcePath, targetWebResourceDisplayName, sourceWebResource.Content);
                        DOSM.Common.AddWebResourceToSolution(webResourceId, targetSolution.UniqueName)
                            .done(function () {
                                DOSM.UI.Show("JSON Web Resource Cloned", "JSON Web Resource <b>" + targetWebResourcePath + " (" + targetWebResourceDisplayName + ")</b> created, " +
                                    "content copied from <b>" + sourceWebResource.Path + " (" + sourceWebResource.Name + ")</b> .<br />After press OK it will be selected for a Configuration.", "large",
                                    function () { DOSM.Logic.EditConfiguration.Start(selectedWebResource); });
                            })
                            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.AddWebResourceToSolution Error", DOSM.Common.GetErrorMessage(xhr)); });
                    })
                    .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.PublishWebResource Error", DOSM.Common.GetErrorMessage(xhr)); });
            })
            .fail(function (xhr) { DOSM.UI.ShowError("Clone JSON Web Resource Error", DOSM.Common.GetErrorMessage(xhr)); });
    }, DOSM.Settings.TimeoutDelay);
}

/**
 * Clone JSON Confirm
 */
DOSM.Logic.CloneJSON.Confirm = function () {
    var sourceWebResource = DOSM.Utilities.GetRecordById(DOSM.Metadata.SourceWebResources.Records, $("#cbx_sourcewebresource").val());
    var targetSolutionName = $("#cbx_targetsolution").find("option:selected").text(); // we retrieve the solution name from the dropdown (it contains also version and unique name)
    var targetWebResourcePath = $("#txt_webresource_prefix").text() + $("#txt_webresource_path").val(); // we compose the webresource name (prefix + name)
    var targetWebResourceDisplayName = $("#txt_webresource_name").val(); // we retrieve the display name

    if (!DOSM.Utilities.HasValue(sourceWebResource) || !DOSM.Utilities.HasValue(targetWebResourcePath) || !DOSM.Utilities.HasValue(targetWebResourceDisplayName)) {
        DOSM.UI.ShowError("Clone JSON Web Resource Error", "Error retrieving required data.");
        return;
    }

    // show question to the user if wants to continue
    DOSM.UI.ShowQuestion("Clone JSON Web Resource",
        "A new JSON Web Resource <b>" + targetWebResourcePath + " (" + targetWebResourceDisplayName + ")</b><br />" +
        "will be created inside the solution <i>" + targetSolutionName + "</i>.<br />" +
        "The type will be <b>Script (JScript)</b> and the content will be copied from JSON Web Resource <b>" + sourceWebResource.Path + " (" + sourceWebResource.Name + ")</b>." +
        "<br /><br /><b>Continue?</b>", "large",
        function () { DOSM.Logic.CloneJSON.Process(); });
}

/**
 * Bind the OnChange event of a Source Solution element
 * @param {string} solutionElementId Solution Element Id
 * @param {string} prefixElementId Prefix Element Id
 * @param {string[]} elementIdsToEnable Element Ids to enable when a Solution is selected
 */
DOSM.Logic.CloneJSON.BindSourceSolution = function (solutionElementId, webResourceElementId) {
    $("#" + solutionElementId).on("change", function (e) {
        var solutionId = $(this).val();
        $("#" + webResourceElementId).val(null).change();
        DOSM.UI.ShowLoading("Retrieving Web Resources...");
        setTimeout(function () {
            DOSM.Common.RetrieveSolutionWebResources(solutionId, true)
                .done(function (data) {
                    var webResources = DOSM.Common.MapWebResources(data, "Name");
                    DOSM.Metadata.SourceWebResources = new DOSM.Models.Records(webResources);
                    DOSM.UI.FillDropdown(webResourceElementId, "Select a Web Resource", DOSM.Metadata.SourceWebResources.ToDropdown());
                    DOSM.UI.HideLoading();
                })
                .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveSolutionWebResources Error", DOSM.Common.GetErrorMessage(xhr)); });
        }, DOSM.Settings.TimeoutDelay);
    });
}

/**
 * Bind the OnChange event of a Target Solution element
 * @param {string} solutionElementId Solution Element Id
 * @param {string} prefixElementId Prefix Element Id
 * @param {string[]} elementIdsToEnable Element Ids to enable when a Solution is selected
 */
DOSM.Logic.CloneJSON.BindTargetSolution = function (solutionElementId, prefixElementId, elementIdsToEnable) {
    $("#" + solutionElementId).on("change", function (e) {
        var targetSolution = DOSM.Utilities.GetRecordById(DOSM.Metadata.TargetSolutions.Records, $(this).val());
        if (DOSM.Utilities.HasValue(targetSolution)) {
            $("#" + prefixElementId).text(targetSolution.CustomizationPrefix + "_");
            // enable the selected Elements
            if (Array.isArray(elementIdsToEnable)) {
                elementIdsToEnable.forEach(function (elementId) { $("#" + elementId).prop("disabled", false); });
            }
        }
    });
}

/*
 * Clone JSON Show JSON
 */
DOSM.Logic.CloneJSON.ShowJson = function () {
    var selectedWebResource = DOSM.Utilities.GetRecordById(DOSM.Metadata.SourceWebResources.Records, $("#cbx_sourcewebresource").val());
    if (DOSM.Utilities.HasValue(selectedWebResource)) { DOSM.Common.ShowJson(selectedWebResource.Content, selectedWebResource.Path); }
    else { DOSM.UI.ShowError("JSON Web Resource Error", "JSON Web Resource not found."); }
}

/*
 * Clone JSON Show Instructions
 */
DOSM.Logic.CloneJSON.ShowInstructions = function () {
    var instructionsMessage = "<ol>" +
        "<li>Select a source Web Resource and copy the content</li><br />" +
        "<li>Select the Unmanaged Solution where you would like to add the cloned Web Resource</li><br />" +
        "<li>Create a new Web Resource, specify <i>Name</i>, <i>Display Name</i> and set <i>Type</i> to <b>Script (JScript)</b></li><br />" +
        "<li>Set the content to the copied content from the source Web Resource</li><br />" +
        "<li>Save and publish the Web Resource</li>" +
        "</ol>";
    DOSM.UI.Show("Clone JSON Web Resource - Manual Instructions", instructionsMessage, "large");
}

/*
 * Clone JSON Start Function
 */
DOSM.Logic.CloneJSON.Start = function () {
    // Metadata used inside CloneJSON
    // DOSM.Metadata.SourceWebResources
    // DOSM.Metadata.TargetSolutions

    // clear the DOSM.Metadata namespace
    DOSM.Metadata = {};

    // create container with title
    DOSM.UI.SetEmpty("div_content");
    var container = DOSM.UI.CreateWideContainer("Clone JSON Web Resource");
    DOSM.UI.Append("div_content", container);

    // create Source Solution dropdown
    container.append(DOSM.UI.CreateSpan("span_sourcesolution", "Source Solution"));
    container.append(DOSM.UI.CreateDropdown("cbx_sourcesolution"));
    container.append(DOSM.UI.CreateSpacer());

    // create Source Web Resource dropdown
    container.append(DOSM.UI.CreateSpan("span_sourcewebresource", "Source Web Resource"));
    container.append(DOSM.UI.CreateDropdown("cbx_sourcewebresource"));
    container.append(DOSM.UI.CreateSpacer());

    // create Target Solution dropdown
    container.append(DOSM.UI.CreateSpan("span_targetsolution", "Target Solution"));
    container.append(DOSM.UI.CreateDropdown("cbx_targetsolution"));
    container.append(DOSM.UI.CreateSpacer());

    // reset the dropdowns
    DOSM.UI.ResetDropdown("cbx_sourcesolution", "Select a Solution");
    DOSM.UI.ResetDropdown("cbx_sourcewebresource", "Select a Solution first");
    DOSM.UI.ResetDropdown("cbx_targetsolution", "Select a Solution");

    // create Web Resource Fields
    container.append(DOSM.UI.CreateSpan("span_webresource_path", "Web Resource Name"));
    container.append(DOSM.UI.CreateSpacer());
    container.append(DOSM.UI.CreateInputWithPrefix("txt_webresource_path", "txt_webresource_prefix", "_", 80));
    container.append(DOSM.UI.CreateSpacer());
    container.append(DOSM.UI.CreateSpan("span_webresource_name", "Web Resource Display Name"));
    container.append(DOSM.UI.CreateSpacer());
    container.append(DOSM.UI.CreateInput("txt_webresource_name", 80));
    container.append(DOSM.UI.CreateSpacer());

    // create buttons
    container.append(DOSM.UI.CreateButton("btn_clonejson_confirm", "Clone", DOSM.Logic.CloneJSON.Confirm, "btn-danger"));
    container.append(DOSM.UI.CreateButton("btn_clonejson_showjson", "Show JSON", DOSM.Logic.CloneJSON.ShowJson));
    container.append(DOSM.UI.CreateButton("btn_clonejson_showinstructions", "Manual Instructions", DOSM.Logic.CloneJSON.ShowInstructions));

    // set the fields and buttons to default state
    $("#txt_webresource_path").prop("disabled", true);
    $("#txt_webresource_path").val("");
    $("#txt_webresource_name").prop("disabled", true);
    $("#txt_webresource_name").val("");
    $("#txt_webresource_prefix").text("_");
    $("#btn_clonejson_confirm").prop("disabled", true);
    $("#btn_clonejson_showjson").prop("disabled", true);

    // load solutions (source and target)
    DOSM.UI.ShowLoading("Retrieving Solutions...");
    setTimeout(function () {
        DOSM.Common.RetrieveSolutions(true)
            .done(function (data) {
                var allSolutions = DOSM.Common.MapSolutions(data, "DisplayName");
                DOSM.UI.FillDropdown("cbx_sourcesolution", "Select a Solution", new DOSM.Models.Records(allSolutions).ToDropdown());
                DOSM.Common.RetrieveSolutions()
                    .done(function (data) {
                        var solutions = DOSM.Common.MapSolutions(data, "DisplayName");
                        DOSM.Metadata.TargetSolutions = new DOSM.Models.Records(solutions);
                        DOSM.UI.FillDropdown("cbx_targetsolution", "Select a Solution", DOSM.Metadata.TargetSolutions.ToDropdown());

                        // define bindings
                        DOSM.Common.BindWebResourcePath("txt_webresource_path");
                        DOSM.Common.BindButtonWithInputs("btn_clonejson_confirm", ["cbx_sourcewebresource", "txt_webresource_path", "txt_webresource_name"]);
                        DOSM.Common.BindButtonWithInputs("btn_clonejson_showjson", ["cbx_sourcewebresource"]);

                        DOSM.Logic.CloneJSON.BindSourceSolution("cbx_sourcesolution", "cbx_sourcewebresource");
                        DOSM.Logic.CloneJSON.BindTargetSolution("cbx_targetsolution", "txt_webresource_prefix", ["txt_webresource_path", "txt_webresource_name"]);

                        // hide show loading
                        DOSM.UI.HideLoading();
                    })
                    .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveSolutions Error", DOSM.Common.GetErrorMessage(xhr)); });
            })
            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveSolutions Error", DOSM.Common.GetErrorMessage(xhr)); });
    }, DOSM.Settings.TimeoutDelay);
}
// #endregion