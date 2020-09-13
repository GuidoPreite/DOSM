// #region DOSM.Common.Xrm
// #region Add Solution Component Functions
/**
 * Add a Web Resource to a Solution
 * @param {string} webResourceId Web Resource Id
 * @param {string} solutionUniqueName Solution Unique Name
 */
DOSM.Common.AddWebResourceToSolution = function (webResourceId, solutionUniqueName) {
    var component = { ComponentId: webResourceId, ComponentType: 61, SolutionUniqueName: solutionUniqueName, AddRequiredComponents: false };
    return DOSM.Xrm.AddSolutionComponent(component);
}
// #endregion

// #region Create Functions
/**
 * Create a Web Resource
 * @param {any} webResourceData Web Resource Data
 */
DOSM.Common.CreateWebResource = function (webResourceData) {
    return DOSM.Xrm.CreateRecord("webresourceset", webResourceData);
}
// #endregion

// #region Delete Functions
/**
 * Delete a Web Resource
 * @param {string} webResourceId Web Resource Id
 */
DOSM.Common.DeleteWebResource = function (webResourceId) {
    return DOSM.Xrm.DeleteRecord("webresourceset", webResourceId);
}
// #endregion

// #region Publish Functions
/**
 * Publish Entities
 * @param {string[]} entityLogicalNames Entity Logical Names
 */
DOSM.Common.PublishEntities = function (entityLogicalNames) {
    var parameterXml = "<importexportxml><entities>";
    entityLogicalNames.forEach(function (entityLogicalName) { parameterXml += "<entity>" + entityLogicalName + "</entity>"; });
    parameterXml += "</entities></importexportxml>";
    return DOSM.Xrm.PublishXml(parameterXml);
}

/**
 * Publish Web Resource
 * @param {string} webResourceId Web Resource Id
 */
DOSM.Common.PublishWebResource = function (webResourceId) {
    var parameterXml = "<importexportxml><webresources><webresource>{" + webResourceId + "}</webresource></webresources></importexportxml>";
    return DOSM.Xrm.PublishXml(parameterXml);
}
// #endregion

// #region Retrieve Dependent Components Functions
/**
 * Retrieve Web Resource Dependent Components
 * @param {string} webResourceId Web Resource Id
 */
DOSM.Common.RetrieveWebResourceDependentComponents = function (webResourceId) {
    return DOSM.Xrm.RetrieveDependentComponents(webResourceId, 61);
}
// #endregion

// #region Retrieve Functions
/**
 * Retrieve Entities
 */
DOSM.Common.RetrieveEntities = function () {
    // we consider only the Entities shown inside Advanced Find
    return DOSM.Xrm.Retrieve("EntityDefinitions", "$select=LogicalName,SchemaName,DisplayName&$filter=IsValidForAdvancedFind eq true");
}

/**
 * Retrieve Entity Fields
 * @param {string[]} entityLogicalNames Entity Logical Names
 */
DOSM.Common.RetrieveEntityFields = function (entityLogicalNames) {
    // we consider only optionsets (normal and multi select)
    var entityFieldsQueries = [];
    entityLogicalNames.forEach(function (entityLogicalName) {
        var retrieveQueryOptionSet = {};
        retrieveQueryOptionSet.EntitySetName = "EntityDefinitions(LogicalName='" + entityLogicalName + "')/Attributes/Microsoft.Dynamics.CRM.PicklistAttributeMetadata";
        retrieveQueryOptionSet.Filters = "$select=LogicalName,SchemaName,DisplayName&$expand=OptionSet";
        entityFieldsQueries.push(retrieveQueryOptionSet);

        var retrieveQueryMultiSelectOptionSet = {};
        retrieveQueryMultiSelectOptionSet.EntitySetName = "EntityDefinitions(LogicalName='" + entityLogicalName + "')/Attributes/Microsoft.Dynamics.CRM.MultiSelectPicklistAttributeMetadata";
        retrieveQueryMultiSelectOptionSet.Filters = "$select=LogicalName,SchemaName,DisplayName&$expand=OptionSet";
        entityFieldsQueries.push(retrieveQueryMultiSelectOptionSet);
    });
    return DOSM.Xrm.RetrieveBatch(entityFieldsQueries);
}

/**
 * Retrieve Forms by Form Ids
 * @param {string[]} formIds Form Ids
 */
DOSM.Common.RetrieveForms = function (formIds) {
    if (formIds.length == 0) { return $.when(); }
    var fetch_Pre = [
        "<fetch>",
        "  <entity name='systemform'>",
        "    <attribute name='formid'/>",
        "    <attribute name='name'/>",
        "    <attribute name='type'/>",
        "    <attribute name='objecttypecode'/>",
        "    <attribute name='formxml'/>"];

    var fetch_Conditions = ["    <filter type='or'>"];
    formIds.forEach(function (formId) { fetch_Conditions.push("      <condition attribute='formid' operator='eq' value='" + formId + "'/>"); });
    fetch_Conditions.push("    </filter>");

    var fetch_Post = [
        "  </entity>",
        "</fetch>"];

    var fetchXmlSystemForms = fetch_Pre.concat(fetch_Conditions, fetch_Post).join("");

    return DOSM.Xrm.RetrieveFetchXmlBatch("systemforms", fetchXmlSystemForms);
}

/**
 * Retrieve Forms by Entity Logical Name
 * @param {string} entityLogicalName Entity Logical Name
 */
DOSM.Common.RetrieveFormsByEntityLogicalName = function (entityLogicalName) {
    return DOSM.Xrm.Retrieve("systemforms", "$select=formid,name,objecttypecode,type,formxml&$filter=objecttypecode eq '" + entityLogicalName + "'");
}

/**
 * Retrieve Solutions
 * @param {boolean} includeManaged If the query should include Managaged Solutions
 */
DOSM.Common.RetrieveSolutions = function (includeManaged) {
    if (includeManaged == true) {
        return DOSM.Xrm.Retrieve("solutions", "$select=friendlyname,uniquename,version&$expand=publisherid($select=customizationprefix)&$filter=isvisible eq true and solutionid ne " + DOSM.Settings.DefaultSolutionId);
    } else {
        return DOSM.Xrm.Retrieve("solutions", "$select=friendlyname,uniquename,version&$expand=publisherid($select=customizationprefix)&$filter=isvisible eq true and ismanaged eq false and solutionid ne " + DOSM.Settings.DefaultSolutionId);
    }
}

/**
 * Retrieve a Web Resource
 * @param {string} webResourceId Web Resource Id
 * @param {string} webResourceFilters Web REsource Filters
 */
DOSM.Common.RetrieveWebResource = function (webResourceId, webResourceFilters) {
    return DOSM.Xrm.RetrieveRecord("webresourceset", webResourceId, webResourceFilters);
}

/**
 * Retrieve Web Resources of a Solution
 * @param {string} solutionId Solution Id
 * @param {boolean} includeManaged If the query should include Managaged Web Resources
 */
DOSM.Common.RetrieveSolutionWebResources = function (solutionId, includeManaged) {
    var fetch_Pre = [
        "<fetch distinct='true'>",
        "  <entity name='webresource'>",
        "    <attribute name='content'/>",
        "    <attribute name='name'/>",
        "    <attribute name='displayname'/>",
        "    <attribute name='webresourceid'/>",
        "    <filter type='and'>",
        "      <condition attribute='webresourcetype' operator='eq' value='3'/>"];

    var fetch_Conditions = ["      <condition attribute='ismanaged' operator='eq' value='0'/>"];

    var fetch_Post = [
        "    </filter>",
        "    <link-entity name='solutioncomponent' from='objectid' to='webresourceid'>",
        "      <link-entity name='solution' from='solutionid' to='solutionid' alias='solution'>",
        "        <attribute name='solutionid'/>",
        "        <filter type='and'>",
        "          <condition attribute='solutionid' operator='eq' value='" + solutionId + "'/>",
        "        </filter>",
        "      </link-entity>",
        "    </link-entity>",
        "  </entity>",
        "</fetch>"];

    if (includeManaged == true) { fetch_Conditions = []; }
    var fetchXmlWebResources = fetch_Pre.concat(fetch_Conditions, fetch_Post).join("");
    return DOSM.Xrm.RetrieveFetchXml("webresourceset", fetchXmlWebResources)
}

/**
 * Retrieve Web Resources by Web Resource Paths
 * @param {string[]} webResourcePaths Web Resource Paths
 */
DOSM.Common.RetrieveWebResources = function (webResourcePaths) {
    var fetch_Pre = [
        "<fetch>",
        "  <entity name='webresource'>",
        "    <attribute name='webresourceid'/>",
        "    <attribute name='name'/>",
        "    <attribute name='displayname'/>",
        "    <attribute name='content'/>"];

    var fetch_Conditions = ["    <filter type='or'>"];
    webResourcePaths.forEach(function (webResourcePath) { fetch_Conditions.push("      <condition attribute='name' operator='eq' value='" + webResourcePath + "'/>"); });
    fetch_Conditions.push("    </filter>");

    var fetch_Post = [
        "  </entity>",
        "</fetch>"];

    var fetchXmlWebResources = fetch_Pre.concat(fetch_Conditions, fetch_Post).join("");

    return DOSM.Xrm.RetrieveFetchXmlBatch("webresourceset", fetchXmlWebResources);
}
// #endregion

// #region Update Functions
/**
 * Update Forms
 * @param {any[]} forms Form Records
 */
DOSM.Common.UpdateForms = function (forms) {
    var formsToUpdate = [];
    forms.forEach(function (form) {
        formsToUpdate.push({ Id: form.id, EntitySetName: "systemforms", Data: { formxml: form.formxml } });
    });
    return DOSM.Xrm.UpdateBatch(formsToUpdate);
}

/**
 * Update a Web Resource
 * @param {string} webResourceId Web Resource
 * @param {any} webResourceData Web Resource data to process
 */
DOSM.Common.UpdateWebResource = function (webResourceId, webResourceData) {
    return DOSM.Xrm.UpdateRecord("webresourceset", webResourceId, webResourceData);
}
// #endregion
// #endregion