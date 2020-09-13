// #region gp_/js/dosm_DependentOptionSet.js

// #region DOSM.Namespaces
if (typeof (DOSM) == "undefined") { DOSM = {}; } // main namespace
if (typeof (DOSM.Metadata) == "undefined") { DOSM.Metadata = {}; } // Store temporarily the retrieved Metadata
if (typeof (DOSM.Utilities) == "undefined") { DOSM.Utilities = {}; } // Utilities Functions
// #endregion

// #region DOSM.Utilities
/**
 * Returns true if a parameter is not undefined, not null and not an empty string, otherwise returns false
 * @param {any} parameter Parameter to check
 */
DOSM.Utilities.HasValue = function (parameter) {
    if (parameter != undefined && parameter != null && parameter != "") { return true; } else { return false; }
}

/**
 * Sort an Array on a specific property, minus sign (-) in front of the property defines a reverse sort
 * @param {string} property Property Name
 */
DOSM.Utilities.CustomSort = function (property) {
    var sortOrder = 1;
    if (property[0] == "-") { sortOrder = -1; property = property.substr(1); }

    return function (a, b) {
        var result = (a[property].toLowerCase() < b[property].toLowerCase()) ? -1 : (a[property].toLowerCase() > b[property].toLowerCase()) ? 1 : 0;
        return result * sortOrder;
    }
}

/**
 * Returns a new Array with unique elements of another Array specific property
 * @param {any[]} records Array to sort
 * @param {string} propertyName Property Name
 */
DOSM.Utilities.GetArrayFromProperty = function (records, propertyName) {
    var values = [];
    records.forEach(function (record) {
        if (record.hasOwnProperty(propertyName) && values.indexOf(record[propertyName]) == -1) { values.push(record[propertyName]); }
    });
    return values;
}

/**
 * Sort an Array based on DOSM Sort Types
 * @param {any[]} array Array to sort
 * @param {string} sort DOSM Sort Type (default, default_desc, label, label_desc, value, value_desc)
 */
DOSM.Utilities.SortArrayBySortType = function (array, sort) {
    switch (sort) {
        case "default_desc": array.reverse(); break;
        case "label": array.sort(DOSM.Utilities.CustomSort("text")); break;
        case "label_desc": array.sort(DOSM.Utilities.CustomSort("-text")); break;
        case "value": array.sort(DOSM.Utilities.CustomSort("value")); break;
        case "value_desc": array.sort(DOSM.Utilities.CustomSort("-value")); break;
    }
}

/**
 * Returns a new Array with only the values included in all the provided Arrays
 * @param {any[]} arrays Arrays to check
 */
DOSM.Utilities.GetUniqueEntriesFromArrays = function (arrays) {
    var allValues = [];
    arrays.forEach(function (arr) { allValues = allValues.concat(arr); });
    var uniqueEntries = [];
    allValues.forEach(function (value) {
        var valueFound = true;
        arrays.forEach(function (arr) { if (arr.indexOf(value) == -1) { valueFound = false; } });
        if (valueFound == true && uniqueEntries.indexOf(value) == -1) { uniqueEntries.push(value); };
    });
    return uniqueEntries;
}

// #endregion

// #region DOSM Load Method
/**
 * DOSM Load Configuration
 * @param {any} executionContext Execution Context
 * @param {string} webResourcePath Path of the DOSM JSON Web Resource
 */
DOSM.LoadConfiguration = function (executionContext, webResourcePath) {
    // get formContext
    var formContext = executionContext.getFormContext();
    // check if the form is not Read Only (3) or Disabled (4)
    if (formContext.ui.getFormType() == 3 || formContext.ui.getFormType() == 4) { return; }
    // initialize the Metadata.Dependencies where the parsed JSON Web Resource will be stored
    DOSM.Metadata.Dependencies = null;

    // Retrieve DOSM JSON Web Resource
    var serverUrl = Xrm.Utility.getGlobalContext().getClientUrl();
    var webResourceFullPath = serverUrl + "/WebResources/" + webResourcePath;
    // XMLHttpRequest to avoid using jQuery
    var xhr = new XMLHttpRequest();
    xhr.open("GET", webResourceFullPath, true);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            this.onreadystatechange = null;
            if (this.status == 200) {
                // we set the default content as [] (empty configuration)
                var webResourceContent = '[]';
                if (this.response !== undefined) {
                    // set the content to the XMLHttpRequest response
                    webResourceContent = this.response;
                }
                try {
                    // parse the content
                    DOSM.Metadata.Dependencies = JSON.parse(webResourceContent);
                    // expand the dependencies with sort type and option values
                    var sortedFields = {};
                    var allParents = [];
                    var allChildren = [];
                    DOSM.Metadata.Dependencies.forEach(function (dependency) {
                        // we need to make sure the sorting is the same if the field is present more than one time (like parent and child in two different dependencies)
                        // check dependency.parent
                        if (DOSM.Utilities.HasValue(sortedFields[dependency.parent])) { dependency.parent_sort = sortedFields[dependency.parent]; }
                        else {
                            if (!DOSM.Utilities.HasValue(dependency.parent_sort)) { dependency.parent_sort = "default"; }
                            sortedFields[dependency.parent] = dependency.parent_sort;
                        }

                        // check dependency.child
                        if (DOSM.Utilities.HasValue(sortedFields[dependency.child])) { dependency.child_sort = sortedFields[dependency.child]; }
                        else {
                            if (!DOSM.Utilities.HasValue(dependency.child_sort)) { dependency.child_sort = "default"; }
                            sortedFields[dependency.child] = dependency.child_sort;
                        }

                        // get Parent Field Options and sort them
                        dependency.parent_values = [];
                        var parentField = formContext.getAttribute(dependency.parent);
                        if (parentField != null) { dependency.parent_values = parentField.getOptions(); }
                        DOSM.Utilities.SortArrayBySortType(dependency.parent_values, dependency.parent_sort);

                        // get Parent Child Options and sort them
                        dependency.child_values = [];
                        var childField = formContext.getAttribute(dependency.child);
                        if (childField != null) { dependency.child_values = childField.getOptions(); }
                        DOSM.Utilities.SortArrayBySortType(dependency.child_values, dependency.child_sort);

                        if (allParents.indexOf(dependency.parent) == -1) { allParents.push(dependency.parent); }
                        if (allChildren.indexOf(dependency.child) == -1) { allChildren.push(dependency.child); }
                    });

                    // get the fields that are only parents
                    var onlyParents = [];
                    allParents.forEach(function (parentCheck) {
                        if (allChildren.indexOf(parentCheck) == -1 && onlyParents.indexOf(parentCheck) == -1) { onlyParents.push(parentCheck); }
                    });

                    // sort the parent fields, store the ones already sorted
                    var sortedOnlyParents = [];
                    onlyParents.forEach(function (onlyParent) {
                        DOSM.Metadata.Dependencies.forEach(function (dependency) {
                            if (dependency.parent == onlyParent && onlyParents.indexOf(dependency.parent) > -1 && sortedOnlyParents.indexOf(dependency.parent) == -1) {
                                // add inside sortedOnlyParents to track that this field has already been processed
                                sortedOnlyParents.push(dependency.parent);
                                // get the field
                                var onlyParentField = formContext.getAttribute(onlyParent);
                                if (onlyParentField != null) {
                                    // save the value
                                    var onlyParentFieldValue = onlyParentField.getValue();
                                    // clear the options, sort the options and add them back
                                    onlyParentField.controls.forEach(function (control) {
                                        control.clearOptions();
                                        dependency.parent_values.forEach(function (sortedOption) {
                                            if (sortedOption.value != -1) { control.addOption(onlyParentField.getOption(parseInt(sortedOption.value))); }
                                        });
                                    });
                                    // set back the value
                                    onlyParentField.setValue(onlyParentFieldValue);
                                }
                            }
                        });
                    });

                    // for each dependency we decide to fire the Parent Field OnChange events or set the Child Field to null and disable its controls
                    DOSM.Metadata.Dependencies.forEach(function (dependency) {
                        var parentField = formContext.getAttribute(dependency.parent);
                        var childField = formContext.getAttribute(dependency.child);
                        if (parentField != null && childField != null) {
                            // check if the Parent Field value
                            if (parentField.getValue() == null || parentField.getValue() == -1) {
                                // set the Child Field to null
                                childField.setValue(null);
                                // we disable all controls associated to the Child Field attribute
                                childField.controls.forEach(function (control) { control.setDisabled(true); });
                            } else {
                                // trigger Parent Field OnChange events
                                parentField.fireOnChange();
                            }
                        }
                    });
                } catch (e) {
                    // error during the parse
                    Xrm.Navigation.openAlertDialog({ text: "Failed to parse configuration data for Web Resource " + webResourcePath });
                }
            }
            else {
                // error during the XMLHttpRequest request
                Xrm.Navigation.openAlertDialog({ text: "Failed to load configuration data for Web Resource " + webResourcePath });
            }
        }
    };
    xhr.send();
};
// #endregion

// #region DOSM OnChange Method
/**
 * DOSM FilterField Function
 * @param {any} executionContext Execution Context
 * @param {string} parentFieldName Parent Field Name
 * @param {string} childFieldName Child Field Name
 */
DOSM.FilterField = function (executionContext, parentFieldName, childFieldName) {
    var formContext = executionContext.getFormContext();
    // check if the form is not Read Only (3) or Disabled (4)
    if (formContext.ui.getFormType() == 3 || formContext.ui.getFormType() == 4) { return; }

    var parentField = formContext.getAttribute(parentFieldName);
    var childField = formContext.getAttribute(childFieldName);

    // if we don't find parent field or child field we do nothing
    if (parentField == null || childField == null) { return; }

    // save the dependencies connected to this child (we will use if a child has multiple parents)
    var childDependencies = [];
    DOSM.Metadata.Dependencies.forEach(function (dependency) { if (dependency.child == childFieldName) { childDependencies.push(dependency); } });

    // for each dependency call the filterOptions function
    DOSM.Metadata.Dependencies.forEach(function (dependency) {
        if (dependency.parent == parentFieldName && dependency.child == childFieldName) {
            // get  Child Field value
            var currentChildFieldValue = childField.getValue();

            var childrenValues = [];
            childDependencies.forEach(function (childDependency) {
                var otherParentField = formContext.getAttribute(childDependency.parent);
                if (otherParentField != null) {
                    var otherParentFieldValue = otherParentField.getValue();
                    // if Parent Field value is not null and not -1
                    // Interactive Service Hub, CRM for Tablets & CRM for phones can return -1 when no option selected
                    if (otherParentFieldValue != null && otherParentFieldValue != -1) {
                        // Parent Field has value
                        if (Array.isArray(otherParentFieldValue)) {
                            var otherValidOptionValues = [];
                            // parent is a Multi-Select Option Set, duplicates are not allowed
                            otherParentFieldValue.forEach(function (otherParentValue) {
                                childDependency.options[otherParentValue.toString()].forEach(function (otherMultiValue) {
                                    if (otherValidOptionValues.indexOf(otherMultiValue) == -1) { otherValidOptionValues.push(otherMultiValue); }
                                });
                            });
                            childrenValues.push(otherValidOptionValues);
                        } else {
                            // parent is a normal Option Set
                            childrenValues.push(childDependency.options[otherParentFieldValue.toString()]);
                        }
                    }
                }
            });
            // array to store the valid options for this parent
            var validOptionValues = DOSM.Utilities.GetUniqueEntriesFromArrays(childrenValues);
            // if the validOptionValues is empty, we disable the Child Field Controls (this happens also when parentFieldValue is null or equals -1)
            if (validOptionValues.length == 0) {
                // set the Child Field to null
                childField.setValue(null);
                // we disable all controls associated to the Child Field attribute
                childField.controls.forEach(function (control) { control.setDisabled(true); });
            } else {
                // validOptionValues has values
                // sort the validOptionValues based on the order of sortedChildValues (dependency.child_values as string)
                var sortedChildValues = DOSM.Utilities.GetArrayFromProperty(dependency.child_values, "value").map(String);
                validOptionValues.sort(function (a, b) { return sortedChildValues.indexOf(a) - sortedChildValues.indexOf(b); });

                // we iterate for each control of the Child Field attribute
                childField.controls.forEach(function (control) {
                    // enable the control and remove all the options
                    control.setDisabled(false);
                    control.clearOptions();

                    // The attribute options for the Interactive Service Hub, CRM for Tablets & CRM for phones clients
                    // do not include a definition for an unselected option, this will add it
                    if (Xrm.Utility.getGlobalContext().client.getClient() == "Mobile") { control.addOption({ text: "", value: -1 }); }

                    // add each valid option inside the dropdown                   
                    validOptionValues.forEach(function (validOptionValue) { control.addOption(childField.getOption(parseInt(validOptionValue))); });
                });

                //Set the value back to the current value if it is a valid value.                
                if (currentChildFieldValue != null) {
                    if (Array.isArray(currentChildFieldValue)) {
                        // parent is a Multi-Select Option Set, duplicates are not allowed
                        var validMultiValues = [];
                        currentChildFieldValue.forEach(function (currentValue) {
                            if (validOptionValues.indexOf(currentValue.toString()) > -1 && validMultiValues.indexOf(currentValue) == -1) { validMultiValues.push(currentValue); }
                        });
                        // if values are found set to Child Field, otherwise set null
                        if (validMultiValues.length > 0) { childField.setValue(validMultiValues); } else { childField.setValue(null); }
                    } else {
                        // is not a multi-select, if the previous value is a valid option set it, otherwise set null
                        if (validOptionValues.indexOf(currentChildFieldValue.toString()) > -1) { childField.setValue(currentChildFieldValue); } else { childField.setValue(null); }
                    }
                }
            }

            //filter any other dependent Option Sets
            childField.fireOnChange();
        }
    });
};
// #endregion

// #endregion