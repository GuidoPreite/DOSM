// #region DOSM.Logic.EditConfiguration
/**
 * Edit Configuration Process
 */
DOSM.Logic.EditConfiguration.Process = function () {
    DOSM.UI.ShowLoading("Applying Configuration to selected Forms...<br /><b>This is a long-running operation, please wait for the confirmation message</b>", "large");
    setTimeout(function () {
        var jsonMappings = [];
        DOSM.Metadata.Mappings.forEach(function (mapping) {
            if (DOSM.Utilities.HasValue(mapping.Parent) && DOSM.Utilities.HasValue(mapping.Child)) { jsonMappings.push(mapping.ToJSONMapping()); }
        });
        var updateWebResource = new DOSM.Models.WebResource(DOSM.Metadata.UsedWebResource.Id, DOSM.Metadata.UsedWebResource.Path, DOSM.Metadata.UsedWebResource.Name, JSON.stringify(jsonMappings, null, 2));
        var updateWebResourceData = { content: btoa(updateWebResource.Content) };
        DOSM.Common.UpdateWebResource(updateWebResource.Id, updateWebResourceData)
            .done(function () {
                DOSM.Common.PublishWebResource(updateWebResource.Id)
                    .done(function () {
                        var formsToUpdate = [];
                        var entitiesToPublish = [];
                        DOSM.Metadata.UsedForms.Records.forEach(function (usedForm) {
                            var removedFormXml = DOSM.Common.RemoveConfigurationFromXml(usedForm.FormXml);
                            var addedFormXml = DOSM.Common.AddConfigurationToXml(updateWebResource.Path, jsonMappings, removedFormXml);
                            formsToUpdate.push({ id: usedForm.Id, formxml: addedFormXml });
                            if (entitiesToPublish.indexOf(usedForm.EntityLogicalName) == -1) { entitiesToPublish.push(usedForm.EntityLogicalName); };
                        });
                        DOSM.Common.UpdateForms(formsToUpdate)
                            .done(function () {
                                DOSM.Common.PublishEntities(entitiesToPublish)
                                    .done(function () {
                                        DOSM.UI.SetEmpty("div_content");
                                        DOSM.UI.Show("Edit Configuration", "Configuration has been updated and applied to the selected Forms.", "large");
                                    })
                                    .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.PublishEntities Error", DOSM.Common.GetErrorMessage(xhr)); });
                            })
                            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.UpdateForms Error", DOSM.Common.GetErrorMessage(xhr)); });
                    })
                    .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.PublishWebResource Error", DOSM.Common.GetErrorMessage(xhr)); });
            })
            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.UpdateWebResource Error", DOSM.Common.GetErrorMessage(xhr)); });
    }, DOSM.Settings.TimeoutDelay);
}

/**
 * Edit Configuration Confirm
 */
DOSM.Logic.EditConfiguration.Confirm = function () {
    if (!DOSM.Utilities.HasValue(DOSM.Metadata.UsedWebResource)) { DOSM.UI.ShowError("Save Configuration Error", "Web Resource not found."); return; }
    if (DOSM.Metadata.Mappings.length == 0) { DOSM.UI.ShowError("Save Configuration Error", "The current Configuration is empty."); return; }

    var foundIncompleteMapping = false;
    DOSM.Metadata.Mappings.forEach(function (checkMapping) { if (!DOSM.Utilities.HasValue(checkMapping.Parent) || !DOSM.Utilities.HasValue(checkMapping.Child)) { foundIncompleteMapping = true; } });
    if (foundIncompleteMapping == true) { DOSM.UI.ShowError("Save Configuration Error", "The current Configuration contains dependencies not configured."); return; }

    DOSM.UI.ShowQuestion("Save Configuration",
        "The current Configuration will be saved to Web Resource<br /><b>" +
        DOSM.Metadata.UsedWebResource.Path + " (" + DOSM.Metadata.UsedWebResource.Name + ")</b><br />" +
        "and will be applied to the selected Forms." +
        "<br /><br /><b>Continue?</b>", "large",
        function () { DOSM.Logic.EditConfiguration.Process(); });
}

/**
 * Bind a selection element
 * @param {string} selectionElementId Selection Element Id
 * @param {number} index Index
 */
DOSM.Logic.EditConfiguration.BindSelection = function (selectionElementId, index) {
    $("#" + selectionElementId).on("change", function (e) {
        // get the mapping
        var mapping = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.Mappings, "Index", index);
        if (!DOSM.Utilities.HasValue(mapping)) { return; }
        // check if is a strict selection
        if (mapping.StrictSelection == true) {

            var parentValues = Object.keys(mapping.Options);
            var selectedValues = [];

            parentValues.forEach(function (parentValue) {
                // we store the selected values in case we need them later
                var selectionId = "cbx_selection_" + index + "_" + parentValue;
                var selectionValues = $("#" + selectionId).val();
                selectionValues.forEach(function (selectedValue) {
                    if (selectedValues.indexOf(selectedValue) == -1) { selectedValues.push(selectedValue); }
                });
            });

            var childOption = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.SelectedEntity.OptionSets, "LogicalName", mapping.Child);
            var notSelectedChildValues = childOption.Values.filter(function (item) { return selectedValues.indexOf(item.Value) == -1; });
            var notSelectedValues = DOSM.Utilities.GetArrayFromProperty(notSelectedChildValues, "Value");

            parentValues.forEach(function (parentValue) {
                // get the value of the parent selection
                var selectionId = "cbx_selection_" + index + "_" + parentValue;
                var selectionValues = $("#" + selectionId).val();
                var clonedChildOption = DOSM.Common.CloneOptionSet(childOption);
                clonedChildOption.Values = childOption.Values.filter(function (item) { return selectionValues.indexOf(item.Value) > -1 || notSelectedValues.indexOf(item.Value) > -1; });
                DOSM.UI.FillDropdown(selectionId, "Select Values", clonedChildOption.ValuesToDropdown());
                $("#" + selectionId).val(selectionValues);
                DOSM.UI.RefreshDropdown(selectionId);
            });
        }

        // refresh the preview
        DOSM.Logic.EditConfiguration.RefreshPreview(index);
    });
}

/**
 * Bind a strict checkbox
 * @param {string} strictElementId Strict Element Id
 * @param {number} index Index
 */
DOSM.Logic.EditConfiguration.BindStrict = function (strictElementId, index) {
    // this binding doesn't affect the preview but only the selection dropdowns
    // just the aspect, not the selection, so preview should not be triggered
    $("#" + strictElementId).on("change", function (e) {
        // if current mapping not found do nothing
        var mapping = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.Mappings, "Index", index);
        if (!DOSM.Utilities.HasValue(mapping)) { return; }
        // get the check status
        var checkedStatus = $(this).is(':checked');
        // set the strict selection to false
        mapping.StrictSelection = false;

        // get all the parent values
        var parentValues = Object.keys(mapping.Options);
        // store the selected values in case we need them later
        var selectedValues = [];

        // user clicked to be strict, verify if it can be
        if (checkedStatus == true) {
            // we need to verify the StrictSelection for the current mapping
            var selectedChildValues = [];
            parentValues.forEach(function (parentValue) {
                selectedChildValues.push(mapping.Options[parentValue]);

                // we store the selected values in case we need them later
                var selectionId = "cbx_selection_" + index + "_" + parentValue;
                var selectionValues = $("#" + selectionId).val();
                selectionValues.forEach(function (selectedValue) {
                    if (selectedValues.indexOf(selectedValue) == -1) { selectedValues.push(selectedValue); }
                });
            });
            var notStrict = DOSM.Utilities.ValueAppearsInMoreThanOneArray(selectedChildValues);
            // if we found values shared inside the selections then we stop the strict
            // otherwise we set StrictSelection to true
            if (notStrict == true) { $(this).prop('checked', false); return; } else { mapping.StrictSelection = true; }
        }
        // refresh all selections
        var childOption = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.SelectedEntity.OptionSets, "LogicalName", mapping.Child);

        if (mapping.StrictSelection == false) {
            parentValues.forEach(function (parentValue) {
                // get the value of the parent selection
                var selectionId = "cbx_selection_" + index + "_" + parentValue;
                var selectionValues = $("#" + selectionId).val();
                DOSM.UI.FillDropdown(selectionId, "Select Values", childOption.ValuesToDropdown());
                $("#" + selectionId).val(selectionValues);
                DOSM.UI.RefreshDropdown(selectionId);
            });
        } else {
            var notSelectedChildValues = childOption.Values.filter(function (item) { return selectedValues.indexOf(item.Value) == -1; });
            var notSelectedValues = DOSM.Utilities.GetArrayFromProperty(notSelectedChildValues, "Value");

            parentValues.forEach(function (parentValue) {
                // get the value of the parent selection
                var selectionId = "cbx_selection_" + index + "_" + parentValue;
                var selectionValues = $("#" + selectionId).val();
                var clonedChildOption = DOSM.Common.CloneOptionSet(childOption);
                clonedChildOption.Values = childOption.Values.filter(function (item) { return selectionValues.indexOf(item.Value) > -1 || notSelectedValues.indexOf(item.Value) > -1; });
                DOSM.UI.FillDropdown(selectionId, "Select Values", clonedChildOption.ValuesToDropdown());
                $("#" + selectionId).val(selectionValues);
                DOSM.UI.RefreshDropdown(selectionId);
            });
        }
    });
}

/**
 * 
 * @param {string} parentFieldElementId Parent Field Element Id
 * @param {string} childFieldElementId Child Field Element Id
 * @param {DOSM.Models.Mapping} mapping Mapping
 */
DOSM.Logic.EditConfiguration.ParentFieldChange = function (parentFieldElementId, childFieldElementId, mapping) {
    var parentFieldId = $("#" + parentFieldElementId).val();
    if (!DOSM.Utilities.HasValue(parentFieldId)) {
        // no parent field selected, reset dropdown
        DOSM.UI.ResetDropdown(childFieldElementId, "Select a Parent Field first");
    } else {
        // fill the Child Field dropdown with all the fields excluding the selected parent
        var filteredSelectedEntity = new DOSM.Models.Entity(DOSM.Metadata.SelectedEntity.LogicalName, DOSM.Metadata.SelectedEntity.Name);
        filteredSelectedEntity.OptionSets = DOSM.Metadata.SelectedEntity.OptionSets.filter(function (field) { return field.LogicalName != parentFieldId; });

        DOSM.UI.FillDropdown(childFieldElementId, "Select a Child Field", filteredSelectedEntity.OptionSetsToDropdown());
        if (DOSM.Utilities.HasValue(mapping)) { mapping.Parent = parentFieldId; }
        $("#" + childFieldElementId).val(null).change();
    }
}

/**
 * Bind a parent field
 * @param {string} parentFieldElementId Parent Field Element Id
 * @param {string} childFieldElementId Child Field Element Id
 * @param {number} index Index
 */
DOSM.Logic.EditConfiguration.BindParentField = function (parentFieldElementId, childFieldElementId, index) {
    $("#" + parentFieldElementId).on("change", function (e) {
        // clear the child field inside the mapping
        var mapping = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.Mappings, "Index", index);
        if (!DOSM.Utilities.HasValue(mapping)) { return; }

        // reset child and options
        mapping.Child = "";
        mapping.Options = {};
        // call the main method for Parent Field Change
        DOSM.Logic.EditConfiguration.ParentFieldChange(parentFieldElementId, childFieldElementId, mapping);
    });
}

/**
 * Bind a Parent Preview Field
 * @param {string} parentElementId Parent Element Id
 * @param {string} childElementId Child Element Id
 * @param {string} childTitle Child Title
 * @param {string} emptyChildTitle Empty Child Title
 * @param {number} index Index
 */
DOSM.Logic.EditConfiguration.BindParentPreview = function (parentElementId, childElementId, childTitle, emptyChildTitle, index) {
    $("#" + parentElementId).on("change", function (e) {
        var mapping = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.Mappings, "Index", index);
        if (!DOSM.Utilities.HasValue(mapping)) { return; }
        var childOption = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.SelectedEntity.OptionSets, "LogicalName", mapping.Child);
        DOSM.Common.FilterParent(parentElementId, childElementId, childTitle, emptyChildTitle, childOption, mapping);
    });
}

/**
 * 
 * @param {string} childFieldElementId Child Field Element Id
 * @param {DOSM.Models.Mapping} mapping Mapping
 */
DOSM.Logic.EditConfiguration.ChildFieldChange = function (childFieldElementId, mapping) {
    var index = mapping.Index;
    // we empty all and create again
    var innerContainer = $("#div_mapping_inner_" + index);
    DOSM.UI.SetEmpty("div_mapping_inner_" + index);
    var childFieldId = $("#" + childFieldElementId).val();
    mapping.Child = childFieldId;
    // we store an array with all "parent|child" values (used for next checks)
    var mappingsParentChild = [];
    DOSM.Metadata.Mappings.forEach(function (mapping) { mappingsParentChild.push(mapping.Parent + "|" + mapping.Child); });

    //  check if a parent-child configuration appears more than one time
    var mappingParentChild = mapping.Parent + "|" + mapping.Child;
    if (mappingsParentChild.indexOf(mappingParentChild) != mappingsParentChild.lastIndexOf(mappingParentChild)) {
        DOSM.UI.ShowError("Parent-Child Error", "Parent-Child  <b>" + mapping.Parent + " " + mapping.Child + "</b> already present inside this Configuration", "large");
        mapping.Child = "";
        $("#" + childFieldElementId).val(null).change();
        return;
    }

    // check if there is a parent-child and child-parent configuration
    var mappingChildParent = mapping.Child + "|" + mapping.Parent;
    if (mappingsParentChild.indexOf(mappingChildParent) > -1) {
        DOSM.UI.ShowError("Parent-Child Error", "Inverted Child-Parent for  <b>" + mapping.Parent + " " + mapping.Child + "</b> already present inside this Configuration", "large");
        mapping.Child = "";
        $("#" + childFieldElementId).val(null).change();
        return;
    }

    var parentOption = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.SelectedEntity.OptionSets, "LogicalName", mapping.Parent);
    var childOption = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.SelectedEntity.OptionSets, "LogicalName", mapping.Child);
    var parentFieldName = parentOption.DisplayName;
    var childFieldName = childOption.DisplayName;


    // lock the sorting for future sortings
    var sortedFields = {};
    DOSM.Metadata.Mappings.forEach(function (sortMapping) {
        // we need to make sure the sorting is the same if the field is present more than one time (like parent and child in two different dependencies)
        // check dependency.parent
        if (DOSM.Utilities.HasValue(sortMapping.Parent)) {
            if (DOSM.Utilities.HasValue(sortedFields[sortMapping.Parent])) { sortMapping.ParentSort = sortedFields[sortMapping.Parent]; sortMapping.LockParentSort = true; }
            else {
                if (!DOSM.Utilities.HasValue(sortMapping.ParentSort)) { sortMapping.ParentSort = "default"; }
                sortedFields[sortMapping.Parent] = sortMapping.ParentSort;
            }
        }

        // check dependency.child
        if (DOSM.Utilities.HasValue(sortMapping.Child)) {
            if (DOSM.Utilities.HasValue(sortedFields[sortMapping.Child])) { sortMapping.ChildSort = sortedFields[sortMapping.Child]; sortMapping.LockChildSort = true; }
            else {
                if (!DOSM.Utilities.HasValue(sortMapping.ChildSort)) { sortMapping.ChildSort = "default"; }
                sortedFields[sortMapping.Child] = sortMapping.ChildSort;
            }
        }
    });

    // create Parent Sort and Child Sort dropdowns
    innerContainer.append(DOSM.UI.CreateSpan("span_parentsort_" + index, "Parent Sort"));
    innerContainer.append(DOSM.UI.CreateSimpleDropdown("cbx_parentsort_" + index));
    innerContainer.append(DOSM.UI.CreateSpan("span_childsort_" + index, "Child Sort"));
    innerContainer.append(DOSM.UI.CreateSimpleDropdown("cbx_childsort_" + index));
    innerContainer.append(DOSM.UI.CreateSpacer());

    // fill Parent Sort and Child Sort dropdowns
    DOSM.UI.FillDropdown("cbx_parentsort_" + index, "Select a Sort", DOSM.Settings.SortTypes.ToDropdown());
    DOSM.UI.FillDropdown("cbx_childsort_" + index, "Select a Sort", DOSM.Settings.SortTypes.ToDropdown());

    // set the bindings for sorting
    DOSM.Logic.EditConfiguration.BindSort("cbx_parentsort_" + index, index, "ParentSort", true);
    DOSM.Logic.EditConfiguration.BindSort("cbx_childsort_" + index, index, "ChildSort", false);

    // set the value for sorting and trigger
    $("#cbx_parentsort_" + index).val(mapping.ParentSort);
    if (DOSM.Utilities.HasValue(mapping) && mapping.LockParentSort) { DOSM.UI.LockDropdown("cbx_parentsort_" + index); }
    $("#cbx_parentsort_" + index).change();

    $("#cbx_childsort_" + index).val(mapping.ChildSort);
    if (DOSM.Utilities.HasValue(mapping) && mapping.LockChildSort) { DOSM.UI.LockDropdown("cbx_childsort_" + index); }
    $("#cbx_childsort_" + index).change();

    // create the preview fields
    innerContainer.append(DOSM.UI.CreateCheckbox("chk_strict_" + index, "Strict Selection", mapping.StrictSelection));
    innerContainer.append(DOSM.UI.CreateSpacer());
    // bind the strict checkbox
    DOSM.Logic.EditConfiguration.BindStrict("chk_strict_" + index, index);

    var clonedParentOption = DOSM.Common.CloneOptionSet(parentOption);

    // get the values that are not selected in any of the parents
    var noSelectedValues = DOSM.Utilities.GetArrayFromProperty(childOption.Values, "Value");
    clonedParentOption.Values.forEach(function (currentSelection) {
        var selectedChildValues = mapping.Options[currentSelection.Value];
        if (!DOSM.Utilities.HasValue(selectedChildValues)) { selectedChildValues = [] };
        if (noSelectedValues.length > 0 && selectedChildValues.length > 0) {
            noSelectedValues = noSelectedValues.filter(function (item) { return selectedChildValues.indexOf(item) == -1 });
        }
    });

    // create a selection dropdown for each parent value
    clonedParentOption.Values.forEach(function (currentSelection) {
        var clonedChildOption = DOSM.Common.CloneOptionSet(childOption);

        var currentParentValue = currentSelection.Value;
        var currentParentName = currentSelection.Label;

        var selectionContainer = DOSM.UI.CreateDiv("block");
        innerContainer.append(selectionContainer);

        selectionContainer.append(DOSM.UI.CreateSpan("span_selection_" + index + "_" + currentParentValue, "<b>" + currentParentName + "</b>"));
        selectionContainer.append(DOSM.UI.CreateSpacer());
        selectionContainer.append(DOSM.UI.CreateDropdown("cbx_selection_" + index + "_" + currentParentValue, true, true));

        // fill the dropdown, trigger and bing the selection
        var selectedChildValues = mapping.Options[currentParentValue];
        DOSM.UI.FillDropdown("cbx_selection_" + index + "_" + currentParentValue, "Select Values", clonedChildOption.ValuesToDropdown());
        $("#cbx_selection_" + index + "_" + currentParentValue).val(selectedChildValues);
        DOSM.UI.RefreshDropdown("cbx_selection_" + index + "_" + currentParentValue);
        DOSM.Logic.EditConfiguration.BindSelection("cbx_selection_" + index + "_" + currentParentValue, index);
    });

    // create the preview dropdowns
    innerContainer.append(DOSM.UI.CreateSpacer());
    innerContainer.append(DOSM.UI.CreateHr());
    innerContainer.append(DOSM.UI.CreateSpan("span_preview_" + index, "<b>Preview: </b>"));
    var smallParentText = null;
    var smallChildText = null;
    if (parentOption.MultiSelect) { smallParentText = "Multi Select"; }
    if (childOption.MultiSelect) { smallChildText = "Multi Select"; }
    innerContainer.append(DOSM.UI.CreateSpan("span_parentpreview_" + index, parentFieldName, smallParentText));
    innerContainer.append(DOSM.UI.CreateDropdown("cbx_parentpreview_" + index, parentOption.MultiSelect));
    innerContainer.append(DOSM.UI.CreateSpan("span_parentpreview_" + index, childFieldName, smallChildText));
    innerContainer.append(DOSM.UI.CreateDropdown("cbx_childpreview_" + index, childOption.MultiSelect));

    // bind the parent preview field and refresh the preview
    DOSM.Logic.EditConfiguration.BindParentPreview("cbx_parentpreview_" + index, "cbx_childpreview_" + index, "Select " + childFieldName, "Select " + parentFieldName + " first", index);

    $("#chk_strict_" + index).change();
    DOSM.Logic.EditConfiguration.RefreshPreview(index);
}

/**
 * 
 * @param {any} childFieldElementId Child Field Element Id
 * @param {number} index Index
 */
DOSM.Logic.EditConfiguration.BindChildField = function (childFieldElementId, index) {
    $("#" + childFieldElementId).on("change", function (e) {

        var childFieldId = $(this).val();
        var mapping = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.Mappings, "Index", index);
        // do nothing if the childField is null or mapping not found
        if (!DOSM.Utilities.HasValue(childFieldId) || !DOSM.Utilities.HasValue(mapping)) {
            // we empty all and create again
            DOSM.UI.SetEmpty("div_mapping_inner_" + index);
            return;
        }

        // reset the options
        mapping.Options = {};
        DOSM.Logic.EditConfiguration.ChildFieldChange(childFieldElementId, mapping);
    });
}

/**
 * Refresh the preview
 * @param {number} index Index
 */
DOSM.Logic.EditConfiguration.RefreshPreview = function (index) {
    // refresh the preview only if the preview fields are created
    if ($("#cbx_parentpreview_" + index).length && $("#cbx_childpreview_" + index).length) {
        // get the mapping
        var mapping = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.Mappings, "Index", index);
        if (!DOSM.Utilities.HasValue(mapping)) { return; }

        // get the parent option and sort it
        var parentOption = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.SelectedEntity.OptionSets, "LogicalName", mapping.Parent);
        var clonedParentOption = DOSM.Common.CloneOptionSet(parentOption);
        var parentFieldName = clonedParentOption.DisplayName;
        var parentSort = $("#cbx_parentsort_" + index).val();
        DOSM.Common.SortOptionSetValues(clonedParentOption, parentSort);

        // get the option selected values
        var options = {};
        clonedParentOption.Values.forEach(function (optionSetValue) { options[optionSetValue.Value] = $("#cbx_selection_" + index + "_" + optionSetValue.Value).val(); });
        mapping.Options = options;

        // fill and reset the preview dropdowns
        DOSM.UI.FillDropdown("cbx_parentpreview_" + index, "Select " + parentFieldName, clonedParentOption.ValuesToDropdown());
        DOSM.UI.ResetDropdown("cbx_childpreview_" + index, "Select " + parentFieldName + " first");
    }
}

/**
 * Bind a sort
 * @param {string} sortElementId Sort Element Id
 * @param {number} index Index
 * @param {string} sortPosition Sort Position
 * @param {boolean} isParent If the element is a Parent or a Child
 */
DOSM.Logic.EditConfiguration.BindSort = function (sortElementId, index, sortPosition, isParent) {
    $("#" + sortElementId).on("change", function (e) {
        var selectedSort = $(this).val();
        var mapping = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.Mappings, "Index", index);
        if (DOSM.Utilities.HasValue(mapping)) {
            mapping[sortPosition] = selectedSort;

            var mainPosition = "Child";
            if (isParent == true) { mainPosition = "Parent"; }

            var indexesToRefresh = [index];
            DOSM.Metadata.Mappings.forEach(function (checkMapping) {
                if (checkMapping.Parent == mapping[mainPosition] && checkMapping.LockParentSort == true) {
                    checkMapping.ParentSort = selectedSort;
                    $("#cbx_parentsort_" + checkMapping.Index).val(selectedSort);
                    DOSM.UI.RefreshDropdown("cbx_parentsort_" + checkMapping.Index);
                    if (indexesToRefresh.indexOf(checkMapping.Index) == -1) { indexesToRefresh.push(checkMapping.Index) };
                }

                if (checkMapping.Child == mapping[mainPosition] && checkMapping.LockChildSort == true) {
                    checkMapping.ChildSort = selectedSort;
                    $("#cbx_childsort_" + checkMapping.Index).val(selectedSort);
                    DOSM.UI.RefreshDropdown("cbx_childsort_" + checkMapping.Index);
                    if (indexesToRefresh.indexOf(checkMapping.Index) == -1) { indexesToRefresh.push(checkMapping.Index) };
                }
            });

            // refresh all involved previews
            indexesToRefresh.forEach(function (currentIndex) { DOSM.Logic.EditConfiguration.RefreshPreview(currentIndex); });
        }
    });
}

/**
 * Delete a mapping
 * @param {number} index Index
 */
DOSM.Logic.EditConfiguration.DeleteMapping = function (index) {
    var mappingToRemove = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.Mappings, "Index", index);
    if (!DOSM.Utilities.HasValue(mappingToRemove)) { return; }

    // we need to make sure to unlock sort fields of other mappings if one of the fields removed from this mapping is a master for other sort fields
    var fieldsToCheck = [];
    // we add only the fields that are not locked
    if (mappingToRemove.LockParentSort == false) { fieldsToCheck.push(mappingToRemove.Parent); }
    if (mappingToRemove.LockChildSort == false) { fieldsToCheck.push(mappingToRemove.Child); }

    // remove the mapping first
    var mappings = [];
    DOSM.Metadata.Mappings.forEach(function (mapping) { if (mapping.Index != index) { mappings.push(mapping); } });
    DOSM.Metadata.Mappings = mappings;

    // check if we need to enable other fields
    fieldsToCheck.forEach(function (fieldToCheck) {
        for (var count = 0; count < DOSM.Metadata.Mappings.length; count++) {
            var mapping = DOSM.Metadata.Mappings[count];
            if (mapping.Parent == fieldToCheck && mapping.LockParentSort == true) {
                DOSM.UI.UnlockDropdown("cbx_parentsort_" + mapping.Index);
                mapping.LockParentSort = false;
                break;
            }

            if (mapping.Child == fieldToCheck && mapping.LockChildSort == true) {
                DOSM.UI.UnlockDropdown("cbx_childsort_" + mapping.Index);
                mapping.LockChildSort = false;
                break;
            }
        }
    });
    $("#div_mapping_" + index).remove();
}

/**
 * Add a mapping
 * @param {DOSM.Models.Mapping} mapping Mapping
 * @param {number} index Index
 */
DOSM.Logic.EditConfiguration.AddMapping = function (mapping, index) {
    if (isNaN(index)) {
        if (DOSM.Metadata.Mappings.length == 0) { index = 0; }
        else { index = DOSM.Metadata.Mappings[DOSM.Metadata.Mappings.length - 1].Index + 1; }
        DOSM.Metadata.Mappings.push(new DOSM.Models.Mapping(index, "", "", "", ""));
    }

    var mappingPanel = $("#div_mapping_panel");
    var mappingContainer = DOSM.UI.CreateEmptyContainer("div_mapping_" + index, "mapping-container");
    mappingPanel.append(mappingContainer);

    // create close button
    mappingContainer.append(DOSM.UI.CreateCloseButton(DOSM.Logic.EditConfiguration.DeleteMapping, index));

    // create Parent Field dropdown
    mappingContainer.append(DOSM.UI.CreateSpan("span_parentfield_" + index, "Parent Field"));
    mappingContainer.append(DOSM.UI.CreateDropdown("cbx_parentfield_" + index));
    // created Child Field dropdown
    mappingContainer.append(DOSM.UI.CreateSpan("span_childfield_" + index, "Child Field"));
    mappingContainer.append(DOSM.UI.CreateDropdown("cbx_childfield_" + index));
    mappingContainer.append(DOSM.UI.CreateSpacer());

    // create inner container
    mappingContainer.append(DOSM.UI.CreateEmptyContainer("div_mapping_inner_" + index));

    // fill and reset Parent Field and Child Field dropdowns
    DOSM.UI.FillDropdown("cbx_parentfield_" + index, "Select a Parent Field", DOSM.Metadata.SelectedEntity.OptionSetsToDropdown());
    DOSM.UI.ResetDropdown("cbx_childfield_" + index, "Select a Parent Field first");

    // set the bindings for Parent Field and Child Field

    if (DOSM.Utilities.HasValue(mapping) && DOSM.Utilities.HasValue(mapping.Parent) && DOSM.Utilities.HasValue(mapping.Child)) {
        var parentOption = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.SelectedEntity.OptionSets, "LogicalName", mapping.Parent);
        var childOption = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.SelectedEntity.OptionSets, "LogicalName", mapping.Child);

        $("#cbx_parentfield_" + index).val(parentOption.LogicalName);
        DOSM.UI.RefreshDropdown("cbx_parentfield_" + index);
        DOSM.Logic.EditConfiguration.ParentFieldChange("cbx_parentfield_" + index, "cbx_childfield_" + index, mapping);
        $("#cbx_childfield_" + index).val(childOption.LogicalName);
        DOSM.UI.RefreshDropdown("cbx_childfield_" + index);
        DOSM.Logic.EditConfiguration.ChildFieldChange("cbx_childfield_" + index, mapping);
    }

    DOSM.Logic.EditConfiguration.BindParentField("cbx_parentfield_" + index, "cbx_childfield_" + index, index);
    DOSM.Logic.EditConfiguration.BindChildField("cbx_childfield_" + index, index);
}

/**
 * Edit Conifguration Show Original JSON
 */
DOSM.Logic.EditConfiguration.ShowOriginalJson = function () {
    if (DOSM.Utilities.HasValue(DOSM.Metadata.OriginalJSONContent) && DOSM.Utilities.HasValue(DOSM.Metadata.UsedWebResource)) { DOSM.Common.ShowJson(DOSM.Metadata.OriginalJSONContent, DOSM.Metadata.UsedWebResource.Path); }
    else { DOSM.UI.ShowError("JSON Web Resource Error", "JSON Web Resource not found."); }
}

/**
 * Edit Conifguration Show Current JSON
 */
DOSM.Logic.EditConfiguration.ShowCurrentJson = function () {
    var jsonMappings = [];
    DOSM.Metadata.Mappings.forEach(function (mapping) {
        if (DOSM.Utilities.HasValue(mapping.Parent) && DOSM.Utilities.HasValue(mapping.Child)) { jsonMappings.push(mapping.ToJSONMapping()); }
    });
    var currentJson = JSON.stringify(jsonMappings);
    DOSM.Common.ShowJson(currentJson, "Current Configuration");
}

/**
 * Edit Configuration Show Instructions
 */
DOSM.Logic.EditConfiguration.ShowInstructions = function () {
    if (!DOSM.Utilities.HasValue(DOSM.Metadata.UsedWebResource)) { DOSM.UI.ShowError("JSON Web Resource Error", "JSON Web Resource not found."); return; }
    if (DOSM.Metadata.Mappings.length == 0) { DOSM.UI.ShowError("Edit Configuration - Manual Instructions Error", "The current Configuration is empty."); return; }

    var foundIncompleteMapping = false;
    DOSM.Metadata.Mappings.forEach(function (checkMapping) { if (!DOSM.Utilities.HasValue(checkMapping.Parent) || !DOSM.Utilities.HasValue(checkMapping.Child)) { foundIncompleteMapping = true; } });
    if (foundIncompleteMapping == true) { DOSM.UI.ShowError("Edit Configuration - Manual Instructions Error", "The current Configuration contains dependencies not configured."); return; }

    var instructionsMessage = "Save the current Configuration inside Web Resource <b>" + DOSM.Metadata.UsedWebResource.Path + "</b> and publish it<br /><br />" +
        "<u>For each Form</u> where you want to apply the configuration <b>" + DOSM.Metadata.UsedWebResource.Path + "</b>:<br /><br />" +
        "<ol>" +
        "<li><u>If the Form has already a Configuration, remove it before proceeding</u></li><br />" +
        "<li>Add the library <b>" + DOSM.Settings.NewLibraryName + "</b></li><br />" +
        "<li>Under the Form OnLoad events list add a new event:<br /><br /><ul>" +
        "<li>set the library to <b>" + DOSM.Settings.NewLibraryName + "</b></li>" +
        "<li>set the function to <b>" + DOSM.Settings.NewInitFunctionName + "</b></li>" +
        "<li>check <i>Pass execution context</b> as first parameter</i></li>" +
        "<li>enter <b>&quot;" + DOSM.Metadata.UsedWebResource.Path + "&quot;</b> (including quotation marks)<br />into the field <i>Comma separated list of parameters that will be passed to the function</i></li>" +
        "</ul><br />";

    var parseFailed = false;
    DOSM.Metadata.Mappings.forEach(function (checkMapping) {
        var parentOption = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.SelectedEntity.OptionSets, "LogicalName", checkMapping.Parent);
        if (!DOSM.Utilities.HasValue(parentOption)) { parseFailed = true; }
        var parentName = parentOption.DisplayName;

        instructionsMessage += "<li>Under the OnChange events list for the field <b>" + parentName + " (" + checkMapping.Parent + ")</b> add a new event:<br /><br /><ul>" +
            "<li>set the library to <b>" + DOSM.Settings.NewLibraryName + "</b></li>" +
            "<li>set the function to <b>" + DOSM.Settings.NewFilterFunctionName + "</b></li>" +
            "<li>check <i>Pass execution context</b> as first parameter</i></li>" +
            "<li>enter <b>&quot;" + checkMapping.Parent + "&quot;, &quot;" + checkMapping.Child + "&quot;</b> (including quotation marks)<br />into the field <i>Comma separated list of parameters that will be passed to the function</i></li>" +
            "</ul><br />";
    });
    if (parseFailed == true) { DOSM.UI.ShowError("JSON Web Resource Error", "Failed to parse JSON Web Resource"); return; }
    instructionsMessage += "<li>Save and publish the Form</li></ol>";
    DOSM.UI.Show("Edit Configuration - Manual Instructions", instructionsMessage, "xl");
}

/**
 * 
 */
DOSM.Logic.EditConfiguration.EditWebResource = function () {
    var errorMessages = [];
    // Web Resource is not used by forms, we check only for errors and not for the configured state
    if (DOSM.Metadata.FormNotConfigured == true) {
        errorMessages = DOSM.Common.CheckWebResourceErrors(DOSM.Metadata.UsedWebResource.Content, DOSM.Metadata.UsedEntities.Records, DOSM.Metadata.UsedForms.Records);
    } else {
        errorMessages = DOSM.Common.CheckConfiguredWebResourceErrors(DOSM.Metadata.UsedWebResource.Path, DOSM.Metadata.UsedWebResource.Content, DOSM.Metadata.UsedEntities.Records, DOSM.Metadata.UsedForms.Records);
    }
    DOSM.Metadata.OriginalJSONContent = DOSM.Metadata.UsedWebResource.Content;

    DOSM.Metadata.Mappings = [];
    if (errorMessages.length > 0) {
        var errorList = "<ul>";
        errorMessages.forEach(function (errorMessage) { errorList += "<li>" + errorMessage + "</li>"; });
        errorList += "</ul>";
        var webResourceTitle = DOSM.Metadata.UsedWebResource.Name + " (" + DOSM.Metadata.UsedWebResource.Path + ")";
        DOSM.UI.ShowError("Edit Configuration Error", "The selected Configuration<br /><b>" +
            webResourceTitle + "</b><br />is not valid for the selected Forms<br />" +
            "Errors: <br />" + errorList +
            "<br /><u><b>The Configuration will be set to empty</b></u>",
            "large");
    } else {
        var parsedContent = JSON.parse(DOSM.Metadata.UsedWebResource.Content);
        parsedContent.forEach(function (dependency, index) {
            // convert the dependency to a mapping
            var convertedMapping = new DOSM.Models.Mapping(index, dependency.parent, dependency.child, dependency.parent_sort, dependency.child_sort, dependency.options);

            // we need to verify the StrictSelection for the current mapping
            var convertedChildValues = [];
            var convertedParentValues = Object.keys(convertedMapping.Options);
            convertedParentValues.forEach(function (convertedParentValue) { convertedChildValues.push(convertedMapping.Options[convertedParentValue]); });
            var notStrict = DOSM.Utilities.ValueAppearsInMoreThanOneArray(convertedChildValues);
            if (notStrict == true) { convertedMapping.StrictSelection = false; }

            // add the mapping to the Metadata
            DOSM.Metadata.Mappings.push(convertedMapping);
        });
    }

    // restrict the fields
    var fieldsLogicalNames = [];
    DOSM.Metadata.UsedEntities.Records.forEach(function (entity) { fieldsLogicalNames.push(DOSM.Utilities.GetArrayFromProperty(entity.OptionSets, "LogicalName")); });
    DOSM.Metadata.UsedForms.Records.forEach(function (form) { fieldsLogicalNames.push(DOSM.Common.GetFieldsFromXml(form.FormXml)); });
    var uniqueFieldsLogicalNames = DOSM.Utilities.GetUniqueEntriesFromArrays(fieldsLogicalNames);

    // we check if also the values are the same of the matching fields
    var filteredUniqueFieldsLogicalNames = [];
    uniqueFieldsLogicalNames.forEach(function (fieldLogicalName) {
        var firstEntityOptionSet = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.UsedEntities.Records[0].OptionSets, "LogicalName", fieldLogicalName);
        var firstFieldValues = DOSM.Utilities.GetArrayFromProperty(firstEntityOptionSet.Values, "Value");
        var foundNotEqual = false;
        DOSM.Metadata.UsedEntities.Records.forEach(function (entity) {
            var usedEntityOptionSet = DOSM.Utilities.GetRecordByProperty(entity.OptionSets, "LogicalName", fieldLogicalName);
            if (DOSM.Utilities.HasValue(usedEntityOptionSet)) {
                var usedFieldValues = DOSM.Utilities.GetArrayFromProperty(usedEntityOptionSet.Values, "Value");
                if (!DOSM.Utilities.ArraysHaveEqualValues([firstFieldValues, usedFieldValues])) { foundNotEqual = true; }
            }
        });
        if (foundNotEqual == false) { filteredUniqueFieldsLogicalNames.push(fieldLogicalName); }
    });

    // we set a fake selectedEntity
    DOSM.Metadata.SelectedEntity = new DOSM.Models.Entity("_mergedentity", "Merged Entity");

    // all the unique fields should be in all records, so we just check the first record
    var entityToCheck = DOSM.Metadata.UsedEntities.Records[0];
    filteredUniqueFieldsLogicalNames.forEach(function (field) {
        entityToCheck.OptionSets.forEach(function (optionSet) {
            if (field == optionSet.LogicalName) { DOSM.Metadata.SelectedEntity.OptionSets = DOSM.Metadata.SelectedEntity.OptionSets.concat(optionSet); }
        });
    });

    // fill dropdown with the fields
    DOSM.UI.FillDropdown("cbx_uniquefield", "Show Fields", DOSM.Metadata.SelectedEntity.OptionSetsToDropdown(), true);

    var mainEditor = $("#div_editor");
    DOSM.UI.SetEmpty("div_editor");
    mainEditor.append(DOSM.UI.CreateSubContainer("Dependencies"));
    // we call DOSM.Logic.EditConfiguration.AddMapping
    mainEditor.append(DOSM.UI.CreateEmptyContainer("div_mapping_panel"));
    DOSM.Metadata.Mappings.forEach(function (mapping, index) { DOSM.Logic.EditConfiguration.AddMapping(mapping, index); });

    // create the buttons
    mainEditor.append(DOSM.UI.CreateSpacer());
    mainEditor.append(DOSM.UI.CreateButton("btn_editconfiguration_addmapping", "Add Dependency", DOSM.Logic.EditConfiguration.AddMapping));
    mainEditor.append(DOSM.UI.CreateSpacer());
    mainEditor.append(DOSM.UI.CreateButton("btn_editconfiguration_confirm", "Save Configuration", DOSM.Logic.EditConfiguration.Confirm, "btn-danger"));
    mainEditor.append(DOSM.UI.CreateButton("btn_editconfiguration_showcurrentjson", "Show Current JSON", DOSM.Logic.EditConfiguration.ShowCurrentJson));
    mainEditor.append(DOSM.UI.CreateButton("btn_editconfiguration_showoriginaljson", "Show Original JSON", DOSM.Logic.EditConfiguration.ShowOriginalJson));
    mainEditor.append(DOSM.UI.CreateButton("btn_editconfiguration_showinstructions", "Manual Instructions", DOSM.Logic.EditConfiguration.ShowInstructions));

    // add some spacing to bottom in order to make dropdowns expand
    for (var count = 0; count < 16; count++) { mainEditor.append(DOSM.UI.CreateBr()); }
}

/**
 * Bind entity
 * @param {string} entityElementId Entity Element Id
 * @param {string} formElementId Form Element Id
 */
DOSM.Logic.EditConfiguration.BindEntity = function (entityElementId, formElementId) {
    $("#" + entityElementId).on("change", function (e) {
        var entityLogicalName = $(this).val();
        DOSM.UI.SetEmpty("div_editor");

        if (DOSM.Utilities.HasValue(entityLogicalName)) {
            DOSM.UI.ShowLoading("Retrieving Entity Fields and Forms...");
            setTimeout(function () {
                DOSM.Common.RetrieveEntityFields([entityLogicalName])
                    .done(function (data) {
                        var entity = DOSM.Utilities.GetRecordById(DOSM.Metadata.Entities.Records, entityLogicalName);
                        DOSM.Metadata.UsedEntities = new DOSM.Models.Records(DOSM.Common.SetOptionSetsInsideEntities(data, [entity]));

                        DOSM.Common.RetrieveFormsByEntityLogicalName(entityLogicalName)
                            .done(function (data) {
                                var forms = DOSM.Common.MapForms(data, "Name", null, null, DOSM.Metadata.FormIdsToExclude);
                                DOSM.Metadata.FilteredTargetForms = new DOSM.Models.Records(forms);
                                DOSM.UI.FillDropdown(formElementId, "Select Form", DOSM.Metadata.FilteredTargetForms.ToDropdown(), false, false, true);
                                $("#" + formElementId).val(null).change();
                                DOSM.UI.HideLoading();
                            })
                            .fail(function (xhr) { DOSM.UI.ShowError("RetrieveFormsByEntityLogicalName Error", DOSM.Common.GetErrorMessage(xhr)); });

                    })
                    .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveEntityFields Error", DOSM.Common.GetErrorMessage(xhr)); });
            }, DOSM.Settings.TimeoutDelay);
        }
    });
}

/**
 * Bind form
 * @param {string} formElementId Form Element Id
 * @param {string[]} fieldsElementId Fields Element Id
 */
DOSM.Logic.EditConfiguration.BindForm = function (formElementId, fieldsElementId) {
    $("#" + formElementId).on("change", function (e) {
        var formId = $(this).val();
        DOSM.UI.ResetDropdown(fieldsElementId, "Select a Form first");
        var form = DOSM.Utilities.GetRecordById(DOSM.Metadata.FilteredTargetForms.Records, formId);
        if (DOSM.Utilities.HasValue(form)) {
            DOSM.Metadata.UsedForms = new DOSM.Models.Records([form]);
            DOSM.Metadata.FormNotConfigured = true;
            DOSM.Logic.EditConfiguration.EditWebResource();
        }
    });
}

/**
 * Select a form
 */
DOSM.Logic.EditConfiguration.SelectForm = function () {
    DOSM.Common.RetrieveEntities()
        .done(function (data) {
            var entities = DOSM.Common.MapEntities(data, "Name");
            DOSM.Metadata.Entities = new DOSM.Models.Records(entities);

            var container = $("#div_space");
            var message = '<i>The selected Web Resource is not used, please select an Entity and a Form to show the available fields.</i><br />' +
                '<i>Later you can use the <b>Copy Configuration to Forms</b> functionality to copy the configuration to other Forms (including a different Entity).</i>';
            container.append(DOSM.UI.CreateParagraph(message));

            // create Entity dropdown
            container.append(DOSM.UI.CreateSpan("span_entity", "Entity"));
            container.append(DOSM.UI.CreateDropdown("cbx_entity"));

            // create Form dropdown
            container.append(DOSM.UI.CreateSpan("span_form", "Form"));
            container.append(DOSM.UI.CreateDropdown("cbx_form"));

            // create Available Fields dropdown
            container.append(DOSM.UI.CreateSpan("span_uniquefield", "Available Fields"));
            container.append(DOSM.UI.CreateDropdown("cbx_uniquefield"));
            container.append(DOSM.UI.CreateSpacer());
            // fill and reset dropdowns
            DOSM.UI.FillDropdown("cbx_entity", "Select an Entity", DOSM.Metadata.Entities.ToDropdown());
            DOSM.UI.ResetDropdown("cbx_form", "Select an Entity first");
            DOSM.UI.ResetDropdown("cbx_uniquefield", "Select a Form first");

            // set bindings
            DOSM.Logic.EditConfiguration.BindEntity("cbx_entity", "cbx_form");
            DOSM.Logic.EditConfiguration.BindForm("cbx_form", "cbx_uniquefield");
            DOSM.UI.HideLoading();
        })
        .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveEntities Error", DOSM.Common.GetErrorMessage(xhr)); });
}

/**
 * Bind Solution
 * @param {string} solutionElementId Solution Element Id
 * @param {string} webResourceElementId Web Resource Element Id
 */
DOSM.Logic.EditConfiguration.BindSolution = function (solutionElementId, webResourceElementId) {
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

/**
 * Check a Web Resource
 */
DOSM.Logic.EditConfiguration.CheckWebResource = function () {
    // Metadata to use after, one if the Web Resource is already associated, the other if is not associated
    DOSM.Metadata.FormIdsToExclude = [];
    DOSM.Metadata.FormNotConfigured = false;

    DOSM.UI.ShowLoading("Checking Dependent Option Set Configurations...");
    setTimeout(function () {
        DOSM.Common.RetrieveWebResource(DOSM.Settings.NewLibraryId, "$select=name")
            .done(function () {
                DOSM.Common.RetrieveWebResourceDependentComponents(DOSM.Settings.NewLibraryId)
                    .done(function (data) {
                        var dependentFormIds = DOSM.Common.MapFormDependentComponents(data);
                        DOSM.Metadata.FormIdsToExclude = dependentFormIds;
                        if (dependentFormIds.length > 0) {
                            DOSM.Common.RetrieveForms(dependentFormIds)
                                .done(function (data) {
                                    var contextRegion = data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1);
                                    var context = JSON.parse(contextRegion);

                                    var forms = DOSM.Common.MapForms(context, "Name", DOSM.Settings.NewInitFunctionName, DOSM.Settings.NewLibraryName, null, DOSM.Metadata.UsedWebResource.Path);
                                    var foundEntities = DOSM.Utilities.GetArrayFromProperty(forms, "EntityLogicalName");

                                    if (foundEntities.length > 0) {
                                        var configuredEntities = [];
                                        for (var entityCount = 0; entityCount < foundEntities.length; entityCount++) {
                                            for (var formCount = 0; formCount < forms.length; formCount++) {
                                                if (forms[formCount].EntityLogicalName == foundEntities[entityCount]) {
                                                    configuredEntities.push(new DOSM.Models.Entity(forms[formCount].EntityLogicalName, forms[formCount].EntityName));
                                                    break;
                                                }
                                            }
                                        }
                                        DOSM.Common.RetrieveEntityFields(foundEntities)
                                            .done(function (data) {
                                                var container = $("#div_space");
                                                // create dropdowns
                                                container.append(DOSM.UI.CreateSpan("span_usedform", "Forms using this configuration"));
                                                container.append(DOSM.UI.CreateDropdown("cbx_usedform"));
                                                container.append(DOSM.UI.CreateSpan("span_uniquefield", "Available Fields"));
                                                container.append(DOSM.UI.CreateDropdown("cbx_uniquefield"));

                                                // set metadata
                                                DOSM.Metadata.UsedEntities = new DOSM.Models.Records(DOSM.Common.SetOptionSetsInsideEntities(data, configuredEntities));
                                                DOSM.Metadata.UsedForms = new DOSM.Models.Records(forms);

                                                // fill and reset dropdown
                                                DOSM.UI.FillDropdownWithGroups("cbx_usedform", "Forms", DOSM.Metadata.UsedForms.ToDropdown(), true);
                                                DOSM.UI.ResetDropdown("cbx_uniquefield", "Show Fields");

                                                // show associated message
                                                var message = '<i>The selected Web Resource is already connected to the Forms listed above, the available fields will be based on the connected items.</i><br />' +
                                                    '<i>Later you can use the <b>Copy Configuration to Forms</b> functionality to copy the configuration to other Forms (including a different Entity).</i>';
                                                container.append(DOSM.UI.CreateParagraph(message));

                                                // hide loading
                                                DOSM.UI.HideLoading();

                                                // call the edit method
                                                DOSM.Logic.EditConfiguration.EditWebResource();
                                            })
                                            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveEntityFields Error", DOSM.Common.GetErrorMessage(xhr)); });
                                    } else {
                                        // web resource never used, so we have 0 forms and all entities
                                        DOSM.Logic.EditConfiguration.SelectForm();
                                    }
                                })
                                .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveForms Error", DOSM.Common.GetErrorMessage(xhr)); });
                        } else {
                            // web resource never used, so we have 0 forms and all entities
                            DOSM.Logic.EditConfiguration.SelectForm();
                        }
                    })
                    .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveWebResourceDependentComponents Error", DOSM.Common.GetErrorMessage(xhr)); });
            })
            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveWebResource Error", DOSM.Common.GetErrorMessage(xhr)); });
    }, DOSM.Settings.TimeoutDelay);
}

/**
 * Select a Web Resource
 * @param {DOSM.Models.WebResource} webResource Web Resource
 */
DOSM.Logic.EditConfiguration.SelectWebResource = function (webResource) {
    if (!DOSM.Utilities.HasValue(webResource)) {
        // no parameter passed, we check if the Web Resource dropdown has a value
        var webResourceId = $("#cbx_webresource").val();
        DOSM.Metadata.UsedWebResource = DOSM.Utilities.GetRecordById(DOSM.Metadata.WebResources.Records, webResourceId);
    } else {
        // we set to the Metadata the selected Web Resource
        DOSM.Metadata.UsedWebResource = webResource;
    }

    if (DOSM.Utilities.HasValue(DOSM.Metadata.UsedWebResource)) {
        var webResourceTitle = DOSM.Metadata.UsedWebResource.Name + " (" + DOSM.Metadata.UsedWebResource.Path + ")";

        // create container with title
        DOSM.UI.SetEmpty("div_content");
        var container = DOSM.UI.CreateWideContainer("Edit Configuration");
        DOSM.UI.Append("div_content", container);

        container.append(DOSM.UI.CreateEmptyContainer("div_space"));
        container.append(DOSM.UI.CreateEmptyContainer("div_editor"));
        $("#div_space").append(DOSM.UI.CreateSubContainer(webResourceTitle));
        DOSM.Logic.EditConfiguration.CheckWebResource();
    }
}

/**
 * Edit Configuration Start Function
 * @param {DOSM.Models.WebResource} selectedWebResource Selected Web Resource
 */
DOSM.Logic.EditConfiguration.Start = function (selectedWebResource) {
    // Metadata used inside EditConfiguration
    // DOSM.Metadata.X

    // clear the DOSM.Metadata namespace
    DOSM.Metadata = {};

    if (DOSM.Utilities.HasValue(selectedWebResource)) {
        DOSM.Logic.EditConfiguration.SelectWebResource(selectedWebResource);
    } else {
        // create container with title
        DOSM.UI.SetEmpty("div_content");
        var container = DOSM.UI.CreateWideContainer("Edit Configuration");
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

        // create button
        container.append(DOSM.UI.CreateButton("btn_selectwebresource", "Select Web Resource", DOSM.Logic.EditConfiguration.SelectWebResource));
        container.append(DOSM.UI.CreateSpacer());

        // set defaults
        $("#btn_selectwebresource").prop("disabled", true);

        // retrieving solutions
        DOSM.UI.ShowLoading("Retrieving Solutions...");
        setTimeout(function () {
            DOSM.Common.RetrieveSolutions()
                .done(function (data) {
                    var solutions = DOSM.Common.MapSolutions(data, "DisplayName");
                    DOSM.UI.FillDropdown("cbx_solution", "Select a Solution", new DOSM.Models.Records(solutions).ToDropdown());

                    // set bindings
                    DOSM.Common.BindButtonWithInputs("btn_selectwebresource", ["cbx_webresource"]);
                    DOSM.Logic.EditConfiguration.BindSolution("cbx_solution", "cbx_webresource");

                    // hide loading
                    DOSM.UI.HideLoading();
                })
                .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RefreshSolutions Error", DOSM.Common.GetErrorMessage(xhr)); });
        }, DOSM.Settings.TimeoutDelay);
    }
}
// #endregion