// #region DOSM.Initialize
/**
 * Set Default Settings
 */
DOSM.SetDefaultSettings = function () {
    // Sort Types
    var sortTypes = [];
    sortTypes.push(new DOSM.Models.SortType("default", "Default"));
    sortTypes.push(new DOSM.Models.SortType("default_desc", "Default Descending"));
    sortTypes.push(new DOSM.Models.SortType("label", "Label"));
    sortTypes.push(new DOSM.Models.SortType("label_desc", "Label Descending"));
    sortTypes.push(new DOSM.Models.SortType("value", "Value"));
    sortTypes.push(new DOSM.Models.SortType("value_desc", "Value Descending"));

    DOSM.Settings.SortTypes = new DOSM.Models.Records(sortTypes);

    // used in the setTimout calls
    DOSM.Settings.TimeoutDelay = 500;

    // Default Solution Id, GUID from https://docs.microsoft.com/en-us/dynamics365/customerengagement/on-premises/developer/work-solutions
    // used inside DOSM.Common.RetrieveSolutions
    DOSM.Settings.DefaultSolutionId = "fd140aaf-4df4-11dd-bd17-0019b9312238";

    DOSM.Settings.PreviousLibraryId = "f954c1d0-de6a-e611-80dd-fc15b4286740";
    DOSM.Settings.NewLibraryId = "e21a99d0-42d2-ea11-a812-000d3a666d40";
    DOSM.Settings.PreviousLibraryName = "gp_/js/DependentOptionSet.js";
    DOSM.Settings.NewLibraryName = "gp_/js/dosm_DependentOptionSet.js";
    DOSM.Settings.PreviousInitFunctionName = "DO.DependentOptionSet.init";
    DOSM.Settings.NewInitFunctionName = "DOSM.LoadConfiguration";
    DOSM.Settings.PreviousFilterFunctionName = "DO.DependentOptionSet.filterDependentField";
    DOSM.Settings.NewFilterFunctionName = "DOSM.FilterField";
    DOSM.Settings.NewPassExecutionContext = "true";
}

/**
 * Define Operations
 */
DOSM.DefineOperations = function () {
    var btn_ShowConfiguration = DOSM.UI.CreateButton("btn_showconfiguration", "Show Configuration", DOSM.Logic.ShowConfiguration.Start, "dropdown-item");
    var btn_EditConfiguration = DOSM.UI.CreateButton("btn_editconfiguration", "Edit Configuration", DOSM.Logic.EditConfiguration.Start, "dropdown-item");
    var btn_CopyConfiguration = DOSM.UI.CreateButton("btn_copyconfiguration", "Copy Configuration to Forms", DOSM.Logic.CopyConfiguration.Start, "dropdown-item");
    var btn_RemoveConfiguration = DOSM.UI.CreateButton("btn_removeconfiguration", "Remove Configuration from Forms", DOSM.Logic.RemoveConfiguration.Start, "dropdown-item");
    var btn_CreateJSON = DOSM.UI.CreateButton("btn_createjson", "Create JSON Web Resource", DOSM.Logic.CreateJSON.Start, "dropdown-item");
    var btn_CloneJSON = DOSM.UI.CreateButton("btn_clonejson", "Clone JSON Web Resource", DOSM.Logic.CloneJSON.Start, "dropdown-item");
    var btn_DeleteJSON = DOSM.UI.CreateButton("btn_deletejson", "Delete JSON Web Resource", DOSM.Logic.DeleteJSON.Start, "dropdown-item");
    var btn_ShowFields = DOSM.UI.CreateButton("btn_showfields", "Show Entities and Forms Fields", DOSM.Logic.ShowFields.Start, "dropdown-item");
    var btn_UpgradeConfiguration = DOSM.UI.CreateButton("btn_upgradeconfiguration", "Upgrade from Dependent OptionSet Generator", DOSM.Logic.UpgradeConfiguration.Start, "dropdown-item");

    var menu = $("#mnu_main");
    menu.append(btn_ShowConfiguration);
    menu.append(btn_EditConfiguration);
    menu.append(btn_CopyConfiguration);
    menu.append(btn_RemoveConfiguration);
    menu.append(DOSM.UI.CreateDiv("dropdown-divider"));
    menu.append(btn_CreateJSON);
    menu.append(btn_CloneJSON);
    menu.append(btn_DeleteJSON);
    menu.append(DOSM.UI.CreateDiv("dropdown-divider"));
    menu.append(btn_ShowFields);
    menu.append(DOSM.UI.CreateDiv("dropdown-divider"));
    menu.append(btn_UpgradeConfiguration);
}

/**
 * Hide Notice message
 */
DOSM.HideNotice = function () {
    $("#div_notice").hide();
    $("#btn_notice").attr("onclick", "DOSM.ShowNotice()").text("Show Notice");
}

/**
 * Show Notice message
 */
DOSM.ShowNotice = function () {
    $("#div_notice").fadeIn();
    $("#btn_notice").attr("onclick", "DOSM.HideNotice()").text("Hide Notice");
}

/**
 * Main function called by the HTML page
 */
DOSM.Initialize = function () {
    if (DOSM.Xrm.IsDemoMode()) { $("#demo").html("(Demo)"); }
    DOSM.HideNotice();
    DOSM.SetDefaultSettings();
    DOSM.DefineOperations();
}
// #endregion