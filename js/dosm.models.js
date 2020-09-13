// #region DOSM.Models
/**
 * Dropdown Option Model
 * @param {any} value Value
 * @param {string} label Label
 * @param {string} subText Sub Text
 * @param {string} subText2 Sub Text 2
 */
DOSM.Models.DropdownOption = function (value, label, subText, subText2) {
    this.Value = value;
    this.Label = label;
    this.SubText = subText;
    this.SubText2 = subText2;
}

/**
 * Option Set Value Model
 * @param {any} value Value
 * @param {string} label Label
 */
DOSM.Models.OptionSetValue = function (value, label) {
    this.Value = value;
    this.Label = label;

    this.ToDropdownOption = function () {
        return new DOSM.Models.DropdownOption(this.Value, this.Label, this.Value);
    }
}

/**
 * Option Set Model
 * @param {string} logicalName Logical Name
 * @param {string} displayName Display Name
 * @param {boolean} multiSelect If is a Multi Select or not
 */
DOSM.Models.OptionSet = function (logicalName, displayName, multiSelect) {
    this.LogicalName = logicalName;
    this.DisplayName = displayName;
    this.MultiSelect = multiSelect;
    this.Values = [];

    this.ToDropdownOption = function () {
        var subText = this.LogicalName;
        if (this.MultiSelect == true) { subText += ' (Multi Select)'; }
        return new DOSM.Models.DropdownOption(this.LogicalName, this.DisplayName, subText);
    }

    this.ValuesToDropdown = function () {
        var valuesDropdown = [];
        this.Values.forEach(function (value) { valuesDropdown.push(value.ToDropdownOption()); });
        return valuesDropdown;
    }
}

/**
 * Entity Model
 * @param {string} logicalName Logical Name
 * @param {string} name Name
 */
DOSM.Models.Entity = function (logicalName, name) {
    this.Id = logicalName;
    this.LogicalName = logicalName;
    this.Name = name;
    this.OptionSets = [];

    this.ToDropdownOption = function () { return new DOSM.Models.DropdownOption(this.LogicalName, this.Name, this.LogicalName); }

    this.OptionSetsToDropdown = function () {
        var optionSetsDropdown = [];
        this.OptionSets.forEach(function (optionSet) { optionSetsDropdown.push(optionSet.ToDropdownOption()); });
        return optionSetsDropdown;
    }
}

/**
 * Form Model
 * @param {string} id Id
 * @param {string} name Name
 * @param {string} entityName Entity Name
 * @param {string} entityLogicalName Entity Logical Name
 * @param {string} formType Form Type
 * @param {string} formXml Form Xml
 * @param {string} configurationPath Configuration Path
 */
DOSM.Models.Form = function (id, name, entityName, entityLogicalName, formType, formXml, configurationPath) {
    this.Id = DOSM.Utilities.CleanGuid(id);
    this.Name = name;
    this.EntityName = entityName;
    this.EntityLogicalName = entityLogicalName;
    this.FormType = formType;
    this.FormXml = formXml;
    this.ConfigurationPath = configurationPath;

    this.ToDropdownOption = function () {
        var subText2 = "";
        if (DOSM.Utilities.HasValue(this.ConfigurationPath)) { subText2 = "Configuration: " + this.ConfigurationPath; }
        return new DOSM.Models.DropdownOption(this.Id, this.Name + " (" + this.FormType + ")", "Entity: " + this.EntityName + " (" + this.EntityLogicalName + ")", subText2);
    }
}

/**
 * Solution Model
 * @param {string} id Id
 * @param {string} displayName Display Name
 * @param {string} uniqueName Unique Name
 * @param {string} version Version
 * @param {string} customizationPrefix Customization Prefix
 */
DOSM.Models.Solution = function (id, displayName, uniqueName, version, customizationPrefix) {
    this.Id = DOSM.Utilities.CleanGuid(id);
    this.DisplayName = displayName;
    this.UniqueName = uniqueName;
    this.Version = version;
    this.CustomizationPrefix = customizationPrefix;

    this.ToDropdownOption = function () { return new DOSM.Models.DropdownOption(this.Id, this.DisplayName + " - " + this.Version + " (" + this.UniqueName + ")", "Publisher Prefix: " + this.CustomizationPrefix); }
}

/**
 * Sort Type Model
 * @param {string} value Value
 * @param {string} name Name
 */
DOSM.Models.SortType = function (value, name) {
    this.Id = value;
    this.Value = value;
    this.Name = name;

    this.ToDropdownOption = function () { return new DOSM.Models.DropdownOption(this.Value, this.Name); }
}

/**
 * Web Resource Model
 * @param {string} id Id
 * @param {string} path Path
 * @param {string} name Name
 * @param {string} content Content
 */
DOSM.Models.WebResource = function (id, path, name, content) {
    this.Id = DOSM.Utilities.CleanGuid(id);
    this.Path = path;
    this.Name = name;
    this.Content = content;

    this.ToDropdownOption = function () { return new DOSM.Models.DropdownOption(this.Id, this.Name, this.Path); }
}

/**
 * Mapping Model
 * @param {number} index Index
 * @param {string} parent Parent Field
 * @param {string} child Child Field
 * @param {string} parentSort Parent Field Sort
 * @param {string} childSort Child Field Sort
 * @param {any} options Options
 */
DOSM.Models.Mapping = function (index, parent, child, parentSort, childSort, options) {
    this.Index = index;
    this.Parent = parent;
    this.Child = child;
    this.ParentSort = parentSort;
    this.ChildSort = childSort;
    this.LockParentSort = false;
    this.LockChildSort = false;
    this.StrictSelection = true;
    this.Options = {};

    if (!DOSM.Utilities.HasValue(this.ParentSort)) { this.ParentSort = "default"; }
    if (!DOSM.Utilities.HasValue(this.ChildSort)) { this.ChildSort = "default"; }
    if (DOSM.Utilities.HasValue(options)) { this.Options = options; }

    this.ToJSONMapping = function () {
        if (this.Parent == "" || this.Child == "") { return null; }
        else {
            return {
                parent: this.Parent,
                child: this.Child,
                parent_sort: this.ParentSort,
                child_sort: this.ChildSort,
                options: this.Options
            };
        }
    }
}

/**
 * Records Model
 * @param {any} records Records
 */
DOSM.Models.Records = function (records) {
    this.Records = records;

    this.ToDropdown = function () {
        var recordsDropdown = [];
        this.Records.forEach(function (record) { recordsDropdown.push(record.ToDropdownOption()); });
        return recordsDropdown;
    }
}
// #endregion