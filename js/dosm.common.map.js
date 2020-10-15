// #region DOSM.Common.Map
/**
 * Map Entities
 * @param {any} data Data to parse
 * @param {string} sortProperty Sort Property
 */
DOSM.Common.MapEntities = function (data, sortProperty) {
    // create the array
    var entities = [];
    // parse data
    data.value.forEach(function (record) {
        var logicalName = record["LogicalName"];
        var name = record["SchemaName"];
        if (record["DisplayName"] != null && record["DisplayName"]["UserLocalizedLabel"] != null && record["DisplayName"]["UserLocalizedLabel"]["Label"] != null) { name = record["DisplayName"]["UserLocalizedLabel"]["Label"]; }
        entities.push(new DOSM.Models.Entity(logicalName, name));
    });
    // eventually sort the array based on the provided sortPrperty
    if (DOSM.Utilities.HasValue(sortProperty)) { entities.sort(DOSM.Utilities.CustomSort(sortProperty)); }
    // return the array
    return entities;
}

/**
 * Map Form Dependent Components
 * @param {any} data Data to parse
 */
DOSM.Common.MapFormDependentComponents = function (data) {
    // create the array
    var dependentIds = [];
    // parse data
    data.value.forEach(function (record) {
        var type = record["dependentcomponenttype"];
        if (type == 60) { dependentIds.push(DOSM.Utilities.CleanGuid(record["dependentcomponentobjectid"])); }
    });
    // return the array
    return dependentIds;
}

/**
 * Map Forms
 * @param {any} data Data to parse
 * @param {string} sortProperty  Sort Property
 * @param {string} initFunctionName Init Function Name to check
 * @param {string} libraryName Library Name to check
 * @param {string[]} formIdsToExclude Forms Ids to exclude
 * @param {string} checkConfigurationPath Configuration Path to check
 */
DOSM.Common.MapForms = function (data, sortProperty, initFunctionName, libraryName, formIdsToExclude, checkConfigurationPath) {
    // create the array
    var forms = [];
    // parse data
    for (var count = 0; count < data.value.length; count++) {
        var record = data.value[count];
        var id = record["formid"];
        var formTypeValue = record["type"];

        // check if the id is inside formIdsToExclude parameter
        if (Array.isArray(formIdsToExclude)) { if (formIdsToExclude.indexOf(id) > -1) { continue; } }

        // we only include forms that are Main and Quick Create Types
        if (formTypeValue != 2 && formTypeValue != 7) { continue; }

        // map the fields
        var name = record["name"];
        var entityName = record["objecttypecode@OData.Community.Display.V1.FormattedValue"];
        var entityLogicalName = record["objecttypecode"];
        var formType = record["type@OData.Community.Display.V1.FormattedValue"];
        var formXml = record["formxml"];
        var configurationPath = "";

        // we check if we need to find the configurationPath based on the init function
        if (DOSM.Utilities.HasValue(initFunctionName)) {
            var parsedXml = $($.parseXML(formXml));
            parsedXml.find("form > events").find("Handler").each(function () {
                if (this.hasAttribute("functionName") && this.attributes["functionName"].value == initFunctionName) {
                    if (DOSM.Utilities.HasValue(libraryName)) { if (this.hasAttribute("libraryName") && this.attributes["libraryName"].value != libraryName) { return; } }
                    if (this.hasAttribute("parameters") && DOSM.Utilities.HasValue(this.attributes["parameters"].value)) { configurationPath = this.attributes["parameters"].value.replace(/"/g, "").replace(/'/g, ""); } // we replace single quote just in case
                }
            });
            if (!DOSM.Utilities.HasValue(configurationPath)) { continue; }
        }

        // include only records with specific configuration path
        if (DOSM.Utilities.HasValue(checkConfigurationPath) && checkConfigurationPath != configurationPath) { continue; }

        forms.push(new DOSM.Models.Form(id, name, entityName, entityLogicalName, formType, formXml, configurationPath));
    }
    // eventually sort the array based on the provided sortPrperty
    if (DOSM.Utilities.HasValue(sortProperty)) { forms.sort(DOSM.Utilities.CustomSort(sortProperty)); }
    // return the array
    return forms;
}

/**
 * Map Solutions
 * @param {any} data Data to parse
 * @param {string} sortProperty Sort Property
 */
DOSM.Common.MapSolutions = function (data, sortProperty) {
    // create the array
    var solutions = [];
    // parse data
    data.value.forEach(function (record) {
        var id = record["solutionid"];
        var displayName = record["friendlyname"];
        var uniqueName = record["uniquename"];
        var version = record["version"];
        var customizationPrefix = record["publisherid"]["customizationprefix"];
        solutions.push(new DOSM.Models.Solution(id, displayName, uniqueName, version, customizationPrefix));
    });
    // eventually sort the array based on the provided sortPrperty
    if (DOSM.Utilities.HasValue(sortProperty)) { solutions.sort(DOSM.Utilities.CustomSort(sortProperty)); }
    // return the array
    return solutions;
}

/**
 * Map Web Resources
 * @param {any} data Data to parse
 * @param {string} sortProperty Sort Property
 */
DOSM.Common.MapWebResources = function (data, sortProperty) {
    // create the array
    var webResources = [];
    // parse data
    data.value.forEach(function (record) {
        var content = atob(record["content"]);
        // only include Web Resources with a JSON parsable content
        try {
            var parsedContent = JSON.parse(content);
            var id = record["webresourceid"];
            var path = record["name"];
            var name = record["displayname"];
            if (name == null) { name = "(No Name)"; }
            webResources.push(new DOSM.Models.WebResource(id, path, name, content));
        } catch (e) { }
    });
    // eventually sort the array based on the provided sortPrperty
    if (DOSM.Utilities.HasValue(sortProperty)) { webResources.sort(DOSM.Utilities.CustomSort(sortProperty)); }
    // return the array
    return webResources;
}
// #endregion