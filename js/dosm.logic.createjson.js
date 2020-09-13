// #region DOSM.Logic.CreateJSON
/**
 * Create JSON Process
 */
DOSM.Logic.CreateJSON.Process = function () {
    var solution = DOSM.Utilities.GetRecordById(DOSM.Metadata.Solutions.Records, $("#cbx_solution").val());
    var webResourcePath = $("#txt_webresource_prefix").text() + $("#txt_webresource_path").val(); // we compose the webresource name (prefix + name)
    var webResourceDisplayName = $("#txt_webresource_name").val(); // we retrieve the display name

    if (!DOSM.Utilities.HasValue(solution) || !DOSM.Utilities.HasValue(webResourcePath) || !DOSM.Utilities.HasValue(webResourceDisplayName)) {
        DOSM.UI.ShowError("Create JSON Web Resource Error", "Error retrieving required data.");
        return;
    }

    DOSM.UI.ShowLoading("Creating JSON Web Resource...");
    setTimeout(function () {
        var newWebResourceData = { name: webResourcePath, displayname: webResourceDisplayName, webresourcetype: 3, content: btoa("[]") };
        DOSM.Common.CreateWebResource(newWebResourceData)
            .done(function (data, textStatus, xhr) {
                var uri = xhr.getResponseHeader("OData-EntityId");
                var webResourceId = /\(([^)]+)\)/.exec(uri)[1];
                DOSM.Common.PublishWebResource(webResourceId)
                    .done(function () {
                        var selectedWebResource = new DOSM.Models.WebResource(webResourceId, webResourcePath, webResourceDisplayName, "[]");
                        DOSM.Common.AddWebResourceToSolution(webResourceId, solution.UniqueName)
                            .done(function () {
                                DOSM.UI.Show("JSON Web Resource Created", "JSON Web Resource <b>" + webResourcePath + " (" + webResourceDisplayName + ")</b> created.<br />After press OK it will be selected for a Configuration.", "large",
                                    function () { DOSM.Logic.EditConfiguration.Start(selectedWebResource); });
                            })
                            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.AddWebResourceToSolution Error", DOSM.Common.GetErrorMessage(xhr)); });
                    })
                    .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.PublishWebResource Error", DOSM.Common.GetErrorMessage(xhr)); });
            })
            .fail(function (xhr) { DOSM.UI.ShowError("Create JSON Web Resource Error", DOSM.Common.GetErrorMessage(xhr)); });
    }, DOSM.Settings.TimeoutDelay);
}

/**
 * Create JSON Confirm
 */
DOSM.Logic.CreateJSON.Confirm = function () {
    var solutionName = $("#cbx_solution").find("option:selected").text(); // we retrieve the solution name from the dropdown (it contains also version and unique name)
    var webResourcePath = $("#txt_webresource_prefix").text() + $("#txt_webresource_path").val(); // we compose the webresource name (prefix + name)
    var webResourceDisplayName = $("#txt_webresource_name").val(); // we retrieve the display name

    if (!DOSM.Utilities.HasValue(webResourcePath) || !DOSM.Utilities.HasValue(webResourceDisplayName)) {
        DOSM.UI.ShowError("Create JSON Web Resource Error", "Error retrieving required data.");
        return;
    }

    // show question to the user if wants to continue
    DOSM.UI.ShowQuestion("Create JSON Web Resource",
        "A new JSON Web Resource <b>" + webResourcePath + " (" + webResourceDisplayName + ")</b><br />" +
        "will be created inside the solution <i>" + solutionName + "</i>.<br />" +
        "The type will be <b>Script (JScript)</b> and the content <b>[]</b> in order to be used as a Configuration." +
        "<br /><br /><b>Continue?</b>", "large",
        function () { DOSM.Logic.CreateJSON.Process(); });
}

/**
 * Bind the OnChange event of a Solution element
 * @param {string} solutionId Solution Element Id
 * @param {string} prefixElementId Prefix Element Id
 * @param {string[]} elementIdsToEnable Element Ids to enable when a Solution is selected
 */
DOSM.Logic.CreateJSON.BindSolution = function (solutionElementId, prefixElementId, elementIdsToEnable) {
    $("#" + solutionElementId).on("change", function (e) {
        var solution = DOSM.Utilities.GetRecordById(DOSM.Metadata.Solutions.Records, $(this).val());
        if (DOSM.Utilities.HasValue(solution)) {
            $("#" + prefixElementId).text(solution.CustomizationPrefix + "_");
            // enable the selected Elements
            if (Array.isArray(elementIdsToEnable)) {
                elementIdsToEnable.forEach(function (elementId) { $("#" + elementId).prop("disabled", false); });
            }
        }
    });
}

/*
 * Create JSON Show Instructions
 */
DOSM.Logic.CreateJSON.ShowInstructions = function () {
    var instructionsMessage = "<ol>" +
        "<li>Select the Unmanaged Solution where you would like to add a new Web Resource</li><br />" +
        "<li>Create a new Web Resource, specify <i>Name</i>, <i>Display Name</i> and set <i>Type</i> to <b>Script (JScript)</b></li><br />" +
        "<li>Set the content to <b>[]</b> (square brackets is an empty configuration)</li><br />" +
        "<li>Save and publish the Web Resource</li>" +
        "</ol>";
    DOSM.UI.Show("Create JSON Web Resource - Manual Instructions", instructionsMessage, "large");
}

/**
 * Crate JSON Start Function 
 */
DOSM.Logic.CreateJSON.Start = function () {
    // Metadata used inside CreateJSON
    // DOSM.Metadata.Solutions

    // clear the DOSM.Metadata namespace
    DOSM.Metadata = {};

    // create container with title
    DOSM.UI.SetEmpty("div_content");
    var container = DOSM.UI.CreateHalfContainer("Create JSON Web Resource");
    DOSM.UI.Append("div_content", container);

    // create Solution Dropdown
    container.append(DOSM.UI.CreateSpan("span_solution", "Solution"));
    container.append(DOSM.UI.CreateDropdown("cbx_solution"));
    container.append(DOSM.UI.CreateSpacer());

    // reset dropdown
    DOSM.UI.ResetDropdown("cbx_solution", "Select a Solution");

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
    container.append(DOSM.UI.CreateButton("btn_createjson_confirm", "Create", DOSM.Logic.CreateJSON.Confirm, "btn-danger"));
    container.append(DOSM.UI.CreateButton("btn_createjson_showinstructions", "Manual Instructions", DOSM.Logic.CreateJSON.ShowInstructions));

    // set the fields and buttons to default state
    $("#txt_webresource_path").prop("disabled", true);
    $("#txt_webresource_path").val("");
    $("#txt_webresource_name").prop("disabled", true);
    $("#txt_webresource_name").val("");
    $("#txt_webresource_prefix").text("_");
    $("#btn_createjson_confirm").prop("disabled", true);

    // load solutions
    DOSM.UI.ShowLoading("Retrieving Solutions...");
    setTimeout(function () {
        DOSM.Common.RetrieveSolutions()
            .done(function (data) {
                var solutions = DOSM.Common.MapSolutions(data, "DisplayName");
                DOSM.Metadata.Solutions = new DOSM.Models.Records(solutions);
                DOSM.UI.FillDropdown("cbx_solution", "Select a Solution", DOSM.Metadata.Solutions.ToDropdown());

                // define bindings
                DOSM.Common.BindWebResourcePath("txt_webresource_path");
                DOSM.Common.BindButtonWithInputs("btn_createjson_confirm", ["txt_webresource_path", "txt_webresource_name"]);
                DOSM.Logic.CreateJSON.BindSolution("cbx_solution", "txt_webresource_prefix", ["txt_webresource_path", "txt_webresource_name"]);

                // hide show loading
                DOSM.UI.HideLoading();
            })
            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveSolutions Error", DOSM.Common.GetErrorMessage(xhr)); });
    }, DOSM.Settings.TimeoutDelay);

}
// #endregion