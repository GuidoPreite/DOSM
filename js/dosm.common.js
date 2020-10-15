// #region DOSM.Common
/**
 * Get the error message from an xhr object
 * @param {any} xhr xhr Object
 */
DOSM.Common.GetErrorMessage = function (xhr) {
    try {
        var responseText = xhr.responseText;
        responseText = responseText.substring(responseText.indexOf('{'), responseText.lastIndexOf('}') + 1);
        var errorMessage = JSON.parse(responseText).error.message;
        return errorMessage;
    }
    catch (e) {
        console.log(xhr);
        return "Unable to parse the error, logged it inside the Browser console.";
    }
}

/**
 * Check if the Web Resource has errors as configured compared to the selected entities and forms
 * @param {string} webResourcePath Web Resource Path
 * @param {string} webResourceContent Web Resource Content
 * @param {DOSM.Models.Entity[]} entities Entities
 * @param {DOSM.Models.Form[]} forms Forms
 */
DOSM.Common.CheckConfiguredWebResourceErrors = function (webResourcePath, webResourceContent, entities, forms) {
    // check standard web resource errors first
    var errorMessages = DOSM.Common.CheckWebResourceErrors(webResourceContent, entities, forms);
    if (errorMessages.length > 0) { return errorMessages; }

    var parsedContent = JSON.parse(webResourceContent);
    for (var dependencyCount = 0; dependencyCount < parsedContent.length; dependencyCount++) {
        var dependency = parsedContent[dependencyCount];

        // check against all forms
        for (var formCount = 0; formCount < forms.length; formCount++) {
            var form = forms[formCount];
            var parsedXml = $($.parseXML(form.FormXml));

            // form events check
            var missingInitEvent = true;
            parsedXml.find("form > events").find("event").each(function () {
                var foundOnLoad = false;
                if (this.hasAttribute("name") && this.attributes["name"].value == "onload") { foundOnLoad = true; }
                if (foundOnLoad == true) {
                    $(this).find("Handler").each(function () {
                        if (this.hasAttribute("functionName") && this.attributes["functionName"].value == DOSM.Settings.NewInitFunctionName &&
                            this.hasAttribute("libraryName") && this.attributes["libraryName"].value == DOSM.Settings.NewLibraryName) {
                            missingInitEvent = false;

                            if (this.hasAttribute("parameters") && DOSM.Utilities.HasValue(this.attributes["parameters"].value)) {
                                var parameter = this.attributes["parameters"].value;
                                if (!DOSM.Utilities.HasValue(parameter)) {
                                    errorMessages.push("Parameter is not correct for the Init Function Event inside Form <b>" + form.Name + "</b> from the Entity " + form.EntityName + " (" + form.EntityLogicalName + ")");
                                } else {
                                    parameter = parameter.replace(/"/g, "").replace(/'/g, "").replace(/ /g, "");
                                    if (parameter != webResourcePath) {
                                        errorMessages.push("Parameter is not this Configured Web Resource for the Init Function Event inside Form <b>" + form.Name + "</b> from the Entity " + form.EntityName + " (" + form.EntityLogicalName + ")");
                                    }
                                }
                                return false; // out from $(this).find("Handler").each
                            }
                        }
                    });
                    return false; // out from parsedXml.find("form > events").find("event").each
                }
            });

            // init event is missing
            if (missingInitEvent == true) { errorMessages.push("Init Event for the configured Web Resource not found inside Form <b>" + form.Name + "</b> from the Entity " + form.EntityName + " (" + form.EntityLogicalName + ")"); }

            var foundCorrectConfiguration = false;
            parsedXml.find("form > events").find("event").each(function () {
                if (this.hasAttribute("name") && this.attributes["name"].value == "onchange" && this.hasAttribute("attribute") && this.attributes["attribute"].value == dependency.parent) {
                    $(this).find("Handler").each(function () {
                        if (this.hasAttribute("functionName") && this.attributes["functionName"].value == DOSM.Settings.NewFilterFunctionName &&
                            this.hasAttribute("libraryName") && this.attributes["libraryName"].value == DOSM.Settings.NewLibraryName) {

                            if (this.hasAttribute("parameters") && DOSM.Utilities.HasValue(this.attributes["parameters"].value)) {
                                var parameters = this.attributes["parameters"].value.split(",");
                                if (parameters.length != 2) {
                                    errorMessages.push("Number of Parameters is not correct for the Parent Field <b>" + dependency.parent + "</b> Event inside Form <b>" + form.Name + "</b> from the Entity " + form.EntityName + " (" + form.EntityLogicalName + ")");
                                } else {
                                    parameters[0] = parameters[0].replace(/"/g, "").replace(/'/g, "").replace(/ /g, ""); // parent parameter
                                    parameters[1] = parameters[1].replace(/"/g, "").replace(/'/g, "").replace(/ /g, ""); // child parameter
                                    if (parameters[0] == dependency.parent && parameters[1] == dependency.child) { foundCorrectConfiguration = true; }
                                }
                            } else {
                                errorMessages.push("Parameters are missing for the Parent Field <b>" + dependency.parent + "</b> Event inside Form <b>" + form.Name + "</b> from the Entity " + form.EntityName + " (" + form.EntityLogicalName + ")");
                            }
                        }
                    });
                }
            });

            // correct configuration not found
            if (foundCorrectConfiguration == false) { errorMessages.push("Parameters (Parent Field, Child Field) are not configured correctly for the Parent Field <b>" + dependency.parent + "</b> Event inside Form <b>" + form.Name + "</b> from the Entity " + form.EntityName + " (" + form.EntityLogicalName + ")"); }
        }
        // if the dependency generated errors, return them
        if (errorMessages.length > 0) { return errorMessages; }
    }
    return errorMessages;
}

/**
 * Check if the Web Resource has errors compared to the selected entities and forms
 * @param {string} webResourceContent Web Resource Content
 * @param {DOSM.Models.Entity[]} entities Entities
 * @param {DOSM.Models.Form[]} forms Forms
 */
DOSM.Common.CheckWebResourceErrors = function (webResourceContent, entities, forms) {
    var errorMessages = [];
    // we try to parse the Web Resource Content
    var parsedContent = "";
    try {
        parsedContent = JSON.parse(webResourceContent);
    } catch (e) { errorMessages.push("Failed to parse JSON Web Resource"); }
    if (errorMessages.length > 0) { return errorMessages; }

    // we store an array with all "parent|child" values (used for next checks)
    var dependenciesParentChild = [];
    parsedContent.forEach(function (dependency) { dependenciesParentChild.push(dependency.parent + "|" + dependency.child); });

    // we check each dependency
    for (var dependencyCount = 0; dependencyCount < parsedContent.length; dependencyCount++) {
        var dependency = parsedContent[dependencyCount];

        // check if parent and child have values
        if (!DOSM.Utilities.HasValue(dependency.parent)) { errorMessages.push("Parent Field inside the Configuration Web Resource must have a value"); }
        if (!DOSM.Utilities.HasValue(dependency.child)) { errorMessages.push("Child Field inside the Configuration Web Resource must have a value"); }

        if (errorMessages.length > 0) { return errorMessages; }

        // check if parent and child are not the same field
        if (dependency.parent == dependency.child) { errorMessages.push("Field <b>" + dependency.parent + "</b> cannot be both Parent and Child for the same Dependency"); }
        if (errorMessages.length > 0) { return errorMessages; }

        //  check if a parent-child configuration appears more than one time
        var dependencyParentChild = dependency.parent + "|" + dependency.child;
        if (dependenciesParentChild.indexOf(dependencyParentChild) != dependenciesParentChild.lastIndexOf(dependencyParentChild)) {
            errorMessages.push("Found one more than one entry for Parent-Child <b>" + dependency.parent + " " + dependency.child + "</b> inside the Configuration");
        }

        // check if there is a parent-child and child-parent configuration
        var dependencyChildParent = dependency.child + "|" + dependency.parent;
        if (dependenciesParentChild.indexOf(dependencyChildParent) > -1) {
            errorMessages.push("Found one entry inverted (Child-Parent) for Parent-Child <b>" + dependency.parent + " " + dependency.child + "</b> inside the Configuration");
        }

        if (errorMessages.length > 0) { return errorMessages; }

        // check against all the entities
        entities.forEach(function (entity) {
            // check if parent and child are fields of the selected entity
            var parentOption = DOSM.Utilities.GetRecordByProperty(entity.OptionSets, "LogicalName", dependency.parent);
            var childOption = DOSM.Utilities.GetRecordByProperty(entity.OptionSets, "LogicalName", dependency.child);
            if (parentOption == null) { errorMessages.push("Parent Field <b>" + dependency.parent + "</b> is missing from the Entity " + entity.Name + " (" + entity.LogicalName + ")"); }
            if (childOption == null) { errorMessages.push("Child Field <b>" + dependency.child + "</b> is missing from the Entity " + entity.Name + " (" + entity.LogicalName + ")"); }
            if (errorMessages.length > 0) { return errorMessages; }

            // check if parent and child are missing values from the fields
            var parentValues = DOSM.Utilities.GetArrayFromProperty(parentOption.Values, "Value");
            var childValues = DOSM.Utilities.GetArrayFromProperty(childOption.Values, "Value");

            var allConfiguredParentValues = Object.keys(dependency.options);
            var allConfiguredChildValues = [];
            allConfiguredParentValues.forEach(function (configuredParentValue) { allConfiguredChildValues = allConfiguredChildValues.concat(dependency.options[configuredParentValue]); });

            var missingParentValues = DOSM.Utilities.GetMissingValuesFromArray(allConfiguredParentValues, parentValues);
            var missingChildValues = DOSM.Utilities.GetMissingValuesFromArray(allConfiguredChildValues, childValues);

            if (missingParentValues.length > 0) { errorMessages.push("Following values are missing from the Parent Field <b>" + dependency.parent + "</b> from the Entity " + entity.Name + " (" + entity.LogicalName + "):<br />" + missingParentValues.toString()); }
            if (missingChildValues.length > 0) { errorMessages.push("Following values are missing from the Child Field <b>" + dependency.child + "</b> from the Entity " + entity.Name + " (" + entity.LogicalName + "):<br />" + missingChildValues.toString()); }
        });
        if (errorMessages.length > 0) { return errorMessages; }

        // check against all forms
        for (var formCount = 0; formCount < forms.length; formCount++) {
            var form = forms[formCount];
            var parsedXml = $($.parseXML(form.FormXml));

            // check if parent and child are controls inside the form xml
            var involvedFields = [dependency.parent, dependency.child];
            for (var fieldCount = 0; fieldCount < involvedFields.length; fieldCount++) {
                var foundControl = false;
                parsedXml.find("control").each(function () {
                    if (this.hasAttribute("datafieldname") && this.attributes["datafieldname"].value == involvedFields[fieldCount]) {
                        foundControl = true;
                        return false; //out from parsedXml.find("control").each
                    }
                });

                if (foundControl == false) {
                    errorMessages.push("Control for Field <b>" + involvedFields[fieldCount] + "</b> not found inside Form <b>" + form.Name + "</b> from the Entity " + form.EntityName + " (" + form.EntityLogicalName + ")");
                }
            }
        }
        if (errorMessages.length > 0) { return errorMessages; }
    }
    return errorMessages;
}

/**
 * Set OptionSets inside Entities
 * @param {any} data Data to process
 * @param {DOSM.Models.Entity[]} entities Entities
 */
DOSM.Common.SetOptionSetsInsideEntities = function (data, entities) {
    //clear the OptionSets inside the entities
    entities.forEach(function (entity) { entity.OptionSets = []; });

    var dataResponses = [];
    // clear the response
    var firstRowData = data.split('\r\n', 1)[0];
    var splittedData = data.split(firstRowData);
    splittedData.forEach(function (segment) { if (segment.indexOf("{") > -1) { dataResponses.push(segment); } });
    // end clear the response

    dataResponses.forEach(function (dataResponse) {
        var contextRegion = dataResponse.substring(dataResponse.indexOf('{'), dataResponse.lastIndexOf('}') + 1);
        var context = JSON.parse(contextRegion);

        var oDataContext = context["@odata.context"];
        var multiSelect = false;
        if (oDataContext.indexOf("Microsoft.Dynamics.CRM.MultiSelectPicklistAttributeMetadata") > -1) { multiSelect = true; }
        var entityLogicalName = oDataContext.substring(oDataContext.indexOf("#EntityDefinitions('") + 20, oDataContext.lastIndexOf("')/Attributes"));

        var fields = [];
        context.value.forEach(function (record) {
            var fieldLogicalName = record["LogicalName"];
            var fieldDisplayName = record["SchemaName"];
            if (record["DisplayName"] != null && record["DisplayName"]["UserLocalizedLabel"] != null && record["DisplayName"]["UserLocalizedLabel"]["Label"] != null) { fieldDisplayName = record["DisplayName"]["UserLocalizedLabel"]["Label"]; }

            var field = new DOSM.Models.OptionSet(fieldLogicalName, fieldDisplayName, multiSelect);
            record.OptionSet.Options.forEach(function (option) {
                var optionValue = option.Value.toString();
                var optionName = "(No Name)";
                if (option["Label"] != null && option["Label"]["UserLocalizedLabel"] != null && option["Label"]["UserLocalizedLabel"]["Label"] != null) { optionName = option["Label"]["UserLocalizedLabel"]["Label"]; }
                field.Values.push(new DOSM.Models.OptionSetValue(optionValue, optionName));
            });
            fields.push(field);
        });
        entities.forEach(function (entity) { if (entity.LogicalName == entityLogicalName) { entity.OptionSets = entity.OptionSets.concat(fields); } });
    });
    // sort the options
    entities.forEach(function (entity) { entity.OptionSets.sort(DOSM.Utilities.CustomSort("DisplayName")); });

    // return entities
    return entities;
}

/**
 * Filter a Parent dropdown
 * @param {string} parentElementId Parent Element Id
 * @param {string} childElementId Child Element Id
 * @param {string} childTitle Child Title
 * @param {string} emptyChildTitle Child Empty Title
 * @param {any} childOption Child Option
 * @param {DOSM.Models.Mapping} mapping Mapping
 */
DOSM.Common.FilterParent = function (parentElementId, childElementId, childTitle, emptyChildTitle, childOption, mapping) {
    var parentValue = $("#" + parentElementId).val();
    // if the Parent Value has no value or no elements selected we reset the dropdown
    if (!DOSM.Utilities.HasValue(parentValue)) { DOSM.UI.ResetDropdown(childElementId, emptyChildTitle); return; }
    if (Array.isArray(parentValue) && parentValue.length == 0) { DOSM.UI.ResetDropdown(childElementId, emptyChildTitle); return; }
    if (!DOSM.Utilities.HasValue(mapping)) { DOSM.UI.ResetDropdown(childElementId, emptyChildTitle); return; }

    // we store the previous Child Values if we need them later
    var previousChildValues = $("#" + childElementId).val();

    // clone the OptionSet
    var filteredChildOption = DOSM.Common.CloneOptionSet(childOption);

    // for clarity I don't use else here
    var valuesToKeep = [];
    if (!Array.isArray(parentValue)) { valuesToKeep = mapping.Options[parentValue]; }
    if (Array.isArray(parentValue)) {
        parentValue.forEach(function (value) {
            mapping.Options[value].forEach(function (innerValue, innerIndex) { valuesToKeep.push(mapping.Options[value][innerIndex]); });
        });
    }

    filteredChildOption.Values = filteredChildOption.Values.filter(function (option) { return valuesToKeep.indexOf(option.Value) != -1; });
    // sort of values based on the property passed
    DOSM.Common.SortOptionSetValues(filteredChildOption, mapping.ChildSort);
    // fill dropdown
    DOSM.UI.FillDropdown(childElementId, childTitle, filteredChildOption.ValuesToDropdown());

    // keep the previous selected values
    var stillChildValues = null;

    // for clarity I don't use else here
    if (!Array.isArray(previousChildValues)) { if (valuesToKeep.indexOf(previousChildValues) != -1) { stillChildValues = previousChildValues; } }
    if (Array.isArray(previousChildValues)) {
        stillChildValues = [];
        previousChildValues.forEach(function (previousValue) { if (valuesToKeep.indexOf(previousValue) != -1) { stillChildValues.push(previousValue); }; });

        // we set to null if stillChildValues is empty
        if (stillChildValues.length == 0) { stillChildValues = null; }
    }

    // some previous values are valid, set to the child dropdown
    if (stillChildValues != null) {
        $("#" + childElementId).val(stillChildValues);
        DOSM.UI.RefreshDropdown(childElementId);
    }
}

/**
 * Bind a button with Elements
 * @param {string} buttonElementId Button Element Id
 * @param {string[]} elementIds Element Ids
 */
DOSM.Common.BindButtonWithInputs = function (buttonElementId, elementIds) {
    elementIds.forEach(function (elementId) {
        // for each element we attach a change keyup event
        $("#" + elementId).bind("change keyup", function () {
            var disableButton = false;
            for (var count = 0; count < elementIds.length; count++) {
                // if we find one of the elements with an empty value, we set the button to disable status
                if (!DOSM.Utilities.HasValue($("#" + elementIds[count]).val())) { disableButton = true; break; }
            }
            $("#" + buttonElementId).prop("disabled", disableButton);
        });
    });
}

/**
 * Clone an Option Set including its Values
 * @param {DOSM.Models.OptionSet} optionSet OptionSet to clone
 */
DOSM.Common.CloneOptionSet = function (optionSet) {
    var clonedOptionSet = new DOSM.Models.OptionSet(optionSet.LogicalName, optionSet.DisplayName, optionSet.MultiSelect);
    optionSet.Values.forEach(function (value) { clonedOptionSet.Values.push(value); });
    return clonedOptionSet;
}

/**
 * Sort an optionSet.Values array based on DOSM Sort Types
 * @param {DOSM.Models.OptionSet} optionSet OptionSet to sort
 * @param {string} sort DOSM Sort Type (default, default_desc, label, label_desc, value, value_desc)
 */
DOSM.Common.SortOptionSetValues = function (optionSet, sort) {
    switch (sort) {
        case "default_desc": optionSet.Values.reverse(); break;
        case "label": optionSet.Values.sort(DOSM.Utilities.CustomSort("Label")); break;
        case "label_desc": optionSet.Values.sort(DOSM.Utilities.CustomSort("-Label")); break;
        case "value": optionSet.Values.sort(DOSM.Utilities.CustomSort("Value")); break;
        case "value_desc": optionSet.Values.sort(DOSM.Utilities.CustomSort("-Value")); break;
    }
}

/**
 * Show a JSON
 * @param {string} stringContent JSON to show as a string
 */
DOSM.Common.ShowJson = function (stringContent, title) {
    try {
        var parsedContent = JSON.parse(stringContent);
        var printedContent = JSON.stringify(parsedContent, null, "!!").replace(/!!/g, "&nbsp;&nbsp;").replace(/(?:\r\n|\r|\n)/g, '<br />');
        DOSM.UI.Show("JSON " + title, printedContent, "large");
    } catch (e) {
        DOSM.UI.ShowError("JSON Error", "JSON contains errors");
    }
}

/**
 * Bind the Input event of an Element to check if it is a valid Web Resource Path
 * @param {string} id Element Id
 */
DOSM.Common.BindWebResourcePath = function (id) {
    $("#" + id).on("input", function (e) {
        $(this).val(function (i, v) {
            return v.replace(/[^\w./-]/g, "").replace("./", ".").replace("/.", "/").replace("//", "/").replace("..", ".").replace("--", "-").replace("__", "_");
        });
    });
}
// #endregion