// #region DOSM.Logic.ShowConfiguration
/**
 * Show Configuration Bind Parent
 * @param {string} parentElementId Parent Element Id
 * @param {string} childElementId Child Element Id
 * @param {string} childTitle Child Title
 * @param {string} emptyChildTitle Empty Child Title
 * @param {number} index Index
 */
DOSM.Logic.ShowConfiguration.BindParent = function (parentElementId, childElementId, childTitle, emptyChildTitle, index) {
    $("#" + parentElementId).on("change", function (e) {
        var mapping = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.Mappings, "Index", index);
        if (!DOSM.Utilities.HasValue(mapping)) { return; }
        var childOption = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.SelectedEntity.OptionSets, "LogicalName", mapping.Child);
        DOSM.Common.FilterParent(parentElementId, childElementId, childTitle, emptyChildTitle, childOption, mapping);
    });
}

/**
 * Show Configuration Bind Form 
 */
DOSM.Logic.ShowConfiguration.BindForm = function () {
    $("#cbx_form").on("change", function (e) {
        DOSM.UI.SetEmpty("div_space");
        var selectedForm = DOSM.Utilities.GetRecordById(DOSM.Metadata.ConfiguredForms.Records, $(this).val());
        if (!DOSM.Utilities.HasValue(selectedForm)) { return };

        var selectedEntity = DOSM.Utilities.GetRecordById(DOSM.Metadata.ConfiguredEntities.Records, selectedForm.EntityLogicalName);
        var selectedWebResource = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.ConfiguredWebResources.Records, "Path", selectedForm.ConfigurationPath);
        if (!DOSM.Utilities.HasValue(selectedEntity) || !DOSM.Utilities.HasValue(selectedWebResource)) { DOSM.UI.ShowError("Show Configuration Error", "Error retrieving required data."); return; }

        DOSM.Metadata.CurrentWebResource = selectedWebResource;

        var entityTitle = selectedEntity.Name + " (" + selectedEntity.LogicalName + ")";
        var webResourceTitle = selectedWebResource.Name + " (" + selectedWebResource.Path + ")";

        var container = DOSM.UI.CreateSubContainer(webResourceTitle);
        DOSM.UI.Append("div_space", container);

        var errorMessages = DOSM.Common.CheckConfiguredWebResourceErrors(selectedWebResource.Path, selectedWebResource.Content, [selectedEntity], [selectedForm])
        if (errorMessages.length == 0) {
            var parsedContent = JSON.parse(selectedWebResource.Content);
            DOSM.Metadata.Mappings = [];
            parsedContent.forEach(function (dependency, index) {
                var mapping = new DOSM.Models.Mapping(index, dependency.parent, dependency.child, dependency.parent_sort, dependency.child_sort, dependency.options);
                DOSM.Metadata.Mappings.push(mapping);
                DOSM.Metadata.SelectedEntity = selectedEntity;
                var parentOption = DOSM.Utilities.GetRecordByProperty(selectedEntity.OptionSets, "LogicalName", mapping.Parent);
                var childOption = DOSM.Utilities.GetRecordByProperty(selectedEntity.OptionSets, "LogicalName", mapping.Child);

                parentOption = DOSM.Common.CloneOptionSet(parentOption);
                var parentName = parentOption.DisplayName;
                var childName = childOption.DisplayName;

                // set sort 
                var parentSort = mapping.ParentSort;
                var childSort = mapping.ChildSort;

                var parentSortName = DOSM.Utilities.GetRecordById(DOSM.Settings.SortTypes.Records, parentSort).Name;
                var childSortName = DOSM.Utilities.GetRecordById(DOSM.Settings.SortTypes.Records, childSort).Name;

                // we don't need to reassign Values because is taken by reference                      
                DOSM.Common.SortOptionSetValues(parentOption, parentSort);

                // create dropdowns

                var parentSubText = "Sort: " + parentSortName;
                var childSubText = "Sort: " + childSortName;

                if (parentOption.MultiSelect) { parentSubText = "Multi Select, " + parentSubText; }
                if (childOption.MultiSelect) { childSubText = "Multi Select, " + childSubText; }

                container.append(DOSM.UI.CreateSpan("span_parent_" + index, parentName, parentSubText));
                container.append(DOSM.UI.CreateDropdown("cbx_parent_" + index, parentOption.MultiSelect));
                container.append(DOSM.UI.CreateSpan("span_child_" + index, childName, childSubText));
                container.append(DOSM.UI.CreateDropdown("cbx_child_" + index, childOption.MultiSelect));
                container.append(DOSM.UI.CreateSpacer());

                // fill and reset dropdowns
                DOSM.UI.FillDropdown("cbx_parent_" + index, "Select " + parentName, parentOption.ValuesToDropdown());
                DOSM.UI.ResetDropdown("cbx_child_" + index, "Select " + parentName + " first");

                // set binding
                DOSM.Logic.ShowConfiguration.BindParent("cbx_parent_" + index, "cbx_child_" + index, "Select " + childName, "Select " + parentName + " first", index);
            });
            // add button
            container.append(DOSM.UI.CreateButton("btn_showconfiguration_showjson", "Show JSON", DOSM.Logic.ShowConfiguration.ShowJson));
        } else {
            var errorList = "<ul>";
            errorMessages.forEach(function (errorMessage) { errorList += "<li>" + errorMessage + "</li>"; });
            errorList += "</ul>";

            DOSM.UI.ShowError("Show Configuration Error", "The selected Configuration<br /><b>" +
                webResourceTitle + "</b><br />is not valid for the selected Form<br /><b>" +
                selectedForm.Name + " (" + selectedForm.FormType + ") - Entity: " + entityTitle + "</b><br /><br />" +
                "Errors: <br />" + errorList + "Please update or remove it from this Form", "large");
        }
    });
}

/**
 * Show Configuration Show Json 
 */
DOSM.Logic.ShowConfiguration.ShowJson = function () {
    if (DOSM.Utilities.HasValue(DOSM.Metadata.CurrentWebResource)) { DOSM.Common.ShowJson(DOSM.Metadata.CurrentWebResource.Content, DOSM.Metadata.CurrentWebResource.Path); }
    else { DOSM.UI.ShowError("JSON Web Resource Error", "JSON Web Resource not found."); }
}

/**
 * Show Configuration Start Function 
 */
DOSM.Logic.ShowConfiguration.Start = function () {
    // Metadata used inside ShowConfiguration
    // DOSM.Metadata.ConfiguredEntities
    // DOSM.Metadata.ConfiguredForms
    // DOSM.Metadata.ConfiguredWebResources
    // DOSM.Metadata.CurrentWebResource
    // DOSM.Metadata.Mappings
    // DOSM.Metadata.SelectedEntity

    // clear the DOSM.Metadata namespace
    DOSM.Metadata = {};

    // create container with title
    DOSM.UI.SetEmpty("div_content");
    var container = DOSM.UI.CreateWideContainer("Show Configuration");
    DOSM.UI.Append("div_content", container);

    // create Form dropdown
    container.append(DOSM.UI.CreateSpan("span_form", "Configured Forms"));
    container.append(DOSM.UI.CreateDropdown("cbx_form"));
    container.append(DOSM.UI.CreateSpacer());

    // create additional container for the new selection
    container.append(DOSM.UI.CreateEmptyContainer("div_space"));

    // reset dropdown
    DOSM.UI.ResetDropdown("cbx_form", "Forms");

    // check current solution
    DOSM.UI.ShowLoading("Checking Dependent Option Set Configurations...")
    setTimeout(function () {
        DOSM.Common.RetrieveWebResource(DOSM.Settings.NewLibraryId, "$select=name")
            .done(function () {
                DOSM.Common.RetrieveWebResourceDependentComponents(DOSM.Settings.NewLibraryId)
                    .done(function (data) {
                        var dependentFormIds = DOSM.Common.MapFormDependentComponents(data);
                        if (dependentFormIds.length == 0) {
                            DOSM.UI.Show("Show Configuration", "Dependent Option Set Manager Solution not used, no Configurations to show.");
                        } else {
                            DOSM.Common.RetrieveForms(dependentFormIds)
                                .done(function (data) {
                                    var contextRegion = data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1);
                                    var context = JSON.parse(contextRegion);

                                    var forms = DOSM.Common.MapForms(context, "Name", DOSM.Settings.NewInitFunctionName, DOSM.Settings.NewLibraryName);
                                    var configurations = DOSM.Utilities.GetArrayFromProperty(forms, "ConfigurationPath");
                                    var foundEntities = DOSM.Utilities.GetArrayFromProperty(forms, "EntityLogicalName");

                                    var configuredEntities = [];
                                    for (var entityCount = 0; entityCount < foundEntities.length; entityCount++) {
                                        for (var formCount = 0; formCount < forms.length; formCount++) {
                                            if (forms[formCount].EntityLogicalName == foundEntities[entityCount]) {
                                                configuredEntities.push(new DOSM.Models.Entity(forms[formCount].EntityLogicalName, forms[formCount].EntityName));
                                                break;
                                            }
                                        }
                                    }

                                    DOSM.Metadata.ConfiguredForms = new DOSM.Models.Records(forms);
                                    DOSM.UI.FillDropdownWithGroups("cbx_form", "Forms", DOSM.Metadata.ConfiguredForms.ToDropdown());
                                    DOSM.Common.RetrieveWebResources(configurations)
                                        .done(function (data) {
                                            var contextRegion = data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1);
                                            var context = JSON.parse(contextRegion);

                                            var configuredWebResources = DOSM.Common.MapWebResources(context);
                                            DOSM.Metadata.ConfiguredWebResources = new DOSM.Models.Records(configuredWebResources);

                                            DOSM.Common.RetrieveEntityFields(foundEntities)
                                                .done(function (data) {
                                                    DOSM.Metadata.ConfiguredEntities = new DOSM.Models.Records(DOSM.Common.SetOptionSetsInsideEntities(data, configuredEntities));

                                                    // set bindings
                                                    DOSM.Logic.ShowConfiguration.BindForm();
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
    }, DOSM.Settings.TimeoutDelay);
}
// #endregion