// #region DOSM.Namespaces
if (typeof (DOSM) == "undefined") { DOSM = {}; } // Main Namespace
if (typeof (DOSM.Common) == "undefined") { DOSM.Common = {}; } // Common Functions
if (typeof (DOSM.Metadata) == "undefined") { DOSM.Metadata = {}; } // Store temporarily the retrieved Metadata
if (typeof (DOSM.Models) == "undefined") { DOSM.Models = {}; } // Models used by the Application
if (typeof (DOSM.Settings) == "undefined") { DOSM.Settings = {}; } // Settings used by the Application
if (typeof (DOSM.UI) == "undefined") { DOSM.UI = {}; } // Functions to manage UI elements
if (typeof (DOSM.Utilities) == "undefined") { DOSM.Utilities = {}; } // Utilities Functions
if (typeof (DOSM.Xrm) == "undefined") { DOSM.Xrm = {}; } // Xrm Functions

if (typeof (DOSM.Logic) == "undefined") { DOSM.Logic = {}; } // Functions defined for each operation
if (typeof (DOSM.Logic.ShowConfiguration) == "undefined") { DOSM.Logic.ShowConfiguration = {}; } // Show Configuration Functions
if (typeof (DOSM.Logic.EditConfiguration) == "undefined") { DOSM.Logic.EditConfiguration = {}; } // Edit Configuration Functions
if (typeof (DOSM.Logic.CopyConfiguration) == "undefined") { DOSM.Logic.CopyConfiguration = {}; } // Copy Configuration Functions
if (typeof (DOSM.Logic.RemoveConfiguration) == "undefined") { DOSM.Logic.RemoveConfiguration = {}; } // Remove Configuration Functions
if (typeof (DOSM.Logic.CreateJSON) == "undefined") { DOSM.Logic.CreateJSON = {}; } // Create JSON Functions
if (typeof (DOSM.Logic.CloneJSON) == "undefined") { DOSM.Logic.CloneJSON = {}; } // Clone JSON Functions
if (typeof (DOSM.Logic.DeleteJSON) == "undefined") { DOSM.Logic.DeleteJSON = {}; } // Delete JSON Functions
if (typeof (DOSM.Logic.ShowFields) == "undefined") { DOSM.Logic.ShowFields = {}; } // Show Fields Functions
if (typeof (DOSM.Logic.UpgradeConfiguration) == "undefined") { DOSM.Logic.UpgradeConfiguration = {}; } // Upgrade Configuration Functions
// #endregion  
 
﻿// #region DOSM.Utilities
/**
 * Returns true if a parameter is not undefined, not null and not an empty string, otherwise returns false
 * @param {any} parameter Parameter to check
 */
DOSM.Utilities.HasValue = function (parameter) {
    if (parameter != undefined && parameter != null && parameter != "") { return true; } else { return false; }
}

/**
 * Remove "{" and "}" from a string containing a Guid and set it to lowercase
 * @param {string} guid Guid to clean
 */
DOSM.Utilities.CleanGuid = function (guid) {
    if (!DOSM.Utilities.HasValue(guid)) { return guid; }
    return guid.replace("{", "").replace("}", "").toLowerCase();
}

/**
 * Returns a Random Guid with options to add Braces or Upper Case
 * @param {boolean} braces if the Guid contains braces
 * @param {boolean} upperCase if the Guid is returned as Upper Case
 */
DOSM.Utilities.GenerateGuid = function (braces, upperCase) {
    var randomGuid = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/x/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    if (braces == true) { randomGuid = "{" + randomGuid + "}"; }
    if (upperCase == true) { randomGuid = randomGuid.toUpperCase(); }
    return randomGuid;
}
/**
 * Get an Array from a a specific property from the passed records
 * @param {any[]} records Records
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
 * Check if a value appears in more than one array
 * @param {any[]} arrays Arrays to check
 */
DOSM.Utilities.ValueAppearsInMoreThanOneArray = function (arrays) {
    var allValues = [];
    arrays.forEach(function (arr) { allValues = allValues.concat(arr); });
    // make the allValues unique
    allValues = allValues.filter(function (value, index, self) { return self.indexOf(value) === index; });
    var uniqueArrays = [];
    // make unique also all arrays
    arrays.forEach(function (arr) { uniqueArrays.push(arr.filter(function (value, index, self) { return self.indexOf(value) === index; })); });

    var appearsInMoreThanOneArray = false;
    allValues.forEach(function (value) {
        var foundCount = 0;
        uniqueArrays.forEach(function (arr) { if (arr.indexOf(value) > -1) { foundCount++; } });
        if (foundCount > 1) { appearsInMoreThanOneArray = true; }
    });

    return appearsInMoreThanOneArray;
}

/**
 * Returns a new Array with only the values included in all the provided Arrays
 * @param {any[]} arrays Arrays to check
 */
DOSM.Utilities.GetUniqueEntriesFromArrays = function (arrays) {
    var allValues = [];
    arrays.forEach(function (arr) { allValues = allValues.concat(arr); });

    // not necessary to reduce the elements
    allValues = allValues.filter(function (value, index, self) { return self.indexOf(value) === index; });

    var uniqueEntries = [];
    allValues.forEach(function (value) {
        var valueFound = true;
        arrays.forEach(function (arr) { if (arr.indexOf(value) == -1) { valueFound = false; } });
        if (valueFound == true && uniqueEntries.indexOf(value) == -1) { uniqueEntries.push(value); };
    });
    return uniqueEntries;
}

/**
 * Check if the Arrays have the same values
 * @param {any[]} arrays Arrays to check
 */
DOSM.Utilities.ArraysHaveEqualValues = function (arrays) {
    // check if we receive an array
    if (!Array.isArray(arrays)) { return false; }

    // we don't have arrays or we have just a single array
    if (arrays.length == 0 || arrays.length == 1) { return true; }

    // store the sorted arrays
    var copiedArrays = [];

    // check if each element of the array is an array too and has same length
    for (var count = 0; count < arrays.length; count++) {
        if (!Array.isArray(arrays[count])) { return false; }
        if (arrays[count].length != arrays[0].length) { return false; }
        copiedArrays.push(arrays[count].slice().sort());
    }

    // check if the elements of the array are the same
    for (var count = 0; count < copiedArrays.length; count++) {
        for (var innerCount = 0; innerCount < copiedArrays[count].length; innerCount++) {
            if (copiedArrays[count][innerCount] != copiedArrays[0][innerCount]) { return false; }
        }
    }
    return true;
}

/**
 * Returns a new Array with the missing values
 * @param {any[]} valuesToCheck Values to Check if they are present
 * @param {any[]} mainArray Main Array to check
 */
DOSM.Utilities.GetMissingValuesFromArray = function (valuesToCheck, mainArray) {
    var missingValues = [];
    valuesToCheck.forEach(function (value) {
        if (mainArray.indexOf(value) == -1 && missingValues.indexOf(value) == -1) { missingValues.push(value); }
    });
    return missingValues;
}

/**
 * Returns a Record matching the property and its value passed
 * @param {any[]} records Records
 * @param {string} propertyName Property Name
 * @param {any} propertyValue Property Value
 */
DOSM.Utilities.GetRecordByProperty = function (records, propertyName, propertyValue) {
    if (Array.isArray(records)) {
        for (var count = 0; count < records.length; count++) {
            if (records[count].hasOwnProperty(propertyName) && records[count][propertyName] == propertyValue) { return records[count]; }
        }
    }
    return null;
}

/**
 * Returns a record matching the Id
 * @param {any[]} records Records
 * @param {any} id Id
 */
DOSM.Utilities.GetRecordById = function (records, id) {
    return DOSM.Utilities.GetRecordByProperty(records, "Id", id);
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
// #endregion  
 
﻿// #region DOSM.Xrm.GetDemoData
/**
 * Get Demo Data based on parameters
 * @param {string} entitySetName Entity Set Name
 * @param {string} filters Filter
 * @param {boolean} singleRecord If the demo is of a single record
 */
DOSM.Xrm.GetDemoData = function (entitySetName, filters, singleRecord) {

    var contentEmpty = "[]";
    var contentjQuery = "'use strict';";
    var contentManaged = ['[', ' {', '  "parent": "mng_parent",', '  "child": "mng_child",', '  "options": {', '   "100000001": [', '    "100000001",', '    "100000002"', '   ],', '   "100000002": [', '    "100000003",', '    "100000004"', '   ]', '  }', ' }', ']'].join("\r\n");
    var contentMixed = ['[', ' {', '  "parent": "mixed_parent",', '  "child": "mixed_child",', '  "parent_sort": "default_desc",', '  "child_sort": "default_desc",', '  "options": {', '   "1": [', '    "1",', '    "2"', '   ],', '   "2": [', '    "3",', '    "4"', '   ]', '  }', ' }', ']'].join("\r\n");
    var contentNBA = ['[', ' {', '  "parent": "sample_conference",', '  "child": "sample_division",', '  "options": {', '   "814000000": [', '    "814000000",', '    "814000001",', '    "814000002"', '   ],', '   "814000001": [', '    "814000000",', '    "814000004",', '    "814000005"', '   ]', '  }', ' },', ' {', '  "parent": "sample_division",', '  "child": "sample_team",', '  "options": {', '   "814000000": [', '    "814000000",', '    "814000001",', '    "814000002",', '    "814000003",', '    "814000004"', '   ],', '   "814000001": [', '    "814000005",', '    "814000006",', '    "814000007",', '    "814000008",', '    "814000009"', '   ],', '   "814000002": [', '    "814000010",', '    "814000011",', '    "814000012",', '    "814000013",', '    "814000014"', '   ],', '   "814000003": [', '    "814000015",', '    "814000016",', '    "814000017",', '    "814000018",', '    "814000019"', '   ],', '   "814000004": [', '    "814000020",', '    "814000021",', '    "814000022",', '    "814000023",', '    "814000024"', '   ],', '   "814000005": [', '    "814000025",', '    "814000026",', '    "814000027",', '    "814000028",', '    "814000029"', '   ]', '  }', ' }', ']'].join("\r\n");
    var contentTestConfig = "[]";
    var contentTicket = ['[', ' {', '  "parent": "sample_category",', '  "child": "sample_subcategory",', '  "options": {', '   "727000000": [', '    "727000000",', '    "727000001",', '    "727000002"', '   ],', '   "727000001": [', '    "727000003",', '    "727000004",', '    "727000005",', '    "727000006",', '    "727000007"', '   ]', '  }', ' },', ' {', '  "parent": "sample_subcategory",', '  "child": "sample_type",', '  "options": {', '   "727000000": [', '    "727000000",', '    "727000001",', '    "727000002",', '    "727000003"', '   ],', '   "727000001": [', '    "727000004",', '    "727000005",', '    "727000006"', '   ],', '   "727000002": [', '    "727000007",', '    "727000008",', '    "727000009",', '    "727000010"', '   ],', '   "727000003": [', '    "727000011",', '    "727000012",', '    "727000013",', '    "727000014"', '   ],', '   "727000004": [', '    "727000015",', '    "727000016",', '    "727000017",', '    "727000018"', '   ],', '   "727000005": [', '    "727000019",', '    "727000020",', '    "727000021",', '    "727000022"', '   ],', '   "727000006": [', '    "727000023",', '    "727000024",', '    "727000025",', '    "727000026"', '   ],', '   "727000007": [', '    "727000027",', '    "727000028",', '    "727000029"', '   ]', '  }', ' }', ']'].join("\r\n");

    var webResourcePreviousLibrary = { "webresourceid": "f954c1d0-de6a-e611-80dd-fc15b4286740", "displayname": "DependentOptionSet.js", "name": "gp_/js/DependentOptionSet.js", "content": btoa(contentEmpty) };
    var webResourceNewLibrary = { "webresourceid": "e21a99d0-42d2-ea11-a812-000d3a666d40", "displayname": "DependentOptionSet.js", "name": "gp_/js/dosm_DependentOptionSet.js", "content": btoa(contentEmpty) };

    var webResourcejQuery = { "webresourceid": "5b1bc98e-52a8-4d1b-a51f-8eb48f024ff6", "name": "tst_/jquery.js", "displayname": "jQuery Library", "content": btoa(contentjQuery) };
    var webResourceManaged = { "webresourceid": "122f75f9-fbd2-4b8c-be6f-069834af495e", "name": "mng_/managed_config.js", "displayname": "Managed Configuration", "content": btoa(contentManaged) };
    var webResourceMixed = { "webresourceid": "5e159088-7ff0-4c56-b5f1-158f5414e151", "name": "mixed_/mixed_config.js", "displayname": "Mixed Configuration", "content": btoa(contentMixed) };
    var webResourceNBA = { "webresourceid": "654aa45a-36af-4236-82cd-0ca4848a396b", "name": "sample_/sample_nba_config.js", "displayname": "NBA Dependent Configuration", "content": btoa(contentNBA) };
    var webResourceTestConfig = { "webresourceid": "9cdc10ef-6368-472c-9bef-bd08caeb2f6b", "name": "tst_/test_config.js", "displayname": "Test Dependent Configuration", "content": btoa(contentTestConfig) };
    var webResourceTicket = { "webresourceid": "b06b7b8a-1ea1-4910-a51d-4f5e83d521b9", "name": "sample_/sample_ticket_config.js", "displayname": "Ticket Dependent Configuration", "content": btoa(contentTicket) };

    var fakeHeaderStart = ['--batchresponse_00000000-0000-0000-0000-000000000000', 'Content-Type: application/http', 'Content-Transfer-Encoding: binary', '', 'HTTP/1.1 200 OK', 'Content-Type: application/json; odata.metadata=minimal', 'OData-Version: 4.0', 'Preference-Applied: odata.include-annotations="*"', ''].join("\r\n");
    var fakeHeaderEnd = '--batchresponse_00000000-0000-0000-0000-000000000000--';
    var emptyLine = ['', ''].join("\r\n");

    var fakeData = { value: [] };
    if (singleRecord == true) {
        switch (entitySetName) {
            case "webresourceset":
                switch (filters) {
                    case "f954c1d0-de6a-e611-80dd-fc15b4286740": fakeData = webResourcePreviousLibrary; break;
                    case "e21a99d0-42d2-ea11-a812-000d3a666d40": fakeData = webResourceNewLibrary; break;

                    case "5b1bc98e-52a8-4d1b-a51f-8eb48f024ff6": fakeData = webResourcejQuery; break;
                    case "122f75f9-fbd2-4b8c-be6f-069834af495e": fakeData = webResourceManaged; break;
                    case "5e159088-7ff0-4c56-b5f1-158f5414e151": fakeData = webResourceMixed; break;
                    case "654aa45a-36af-4236-82cd-0ca4848a396b": fakeData = webResourceNBA; break;
                    case "9cdc10ef-6368-472c-9bef-bd08caeb2f6b": fakeData = webResourceTestConfig; break;
                    case "b06b7b8a-1ea1-4910-a51d-4f5e83d521b9": fakeData = webResourceTicket; break;
                }
                break;
        }
    } else {
        switch (entitySetName) {
            case "EntityDefinitions":
                fakeData.value.push({ "SchemaName": "Ticket", "LogicalName": "sample_ticket" });
                fakeData.value.push({ "SchemaName": "NBA", "LogicalName": "sample_nba" });
                fakeData.value.push({ "SchemaName": "Mixed Entity", "LogicalName": "mixed_entity" });
                fakeData.value.push({ "SchemaName": "Account", "LogicalName": "account" });
                break;

            case "RetrieveDependentComponents":
                fakeData.value.push({ "dependentcomponentobjectid": "dc766e2b-0d73-432c-aed4-e99f8f6bcf34", "dependentcomponenttype": 60 }); // form NBA Main
                fakeData.value.push({ "dependentcomponentobjectid": "130d7071-5f55-4ebd-ab6e-f84bf3038dbe", "dependentcomponenttype": 60 }); // form NBA Quick

                fakeData.value.push({ "dependentcomponentobjectid": "c960b331-a674-44cf-af77-473c566dd9e3", "dependentcomponenttype": 60 }); // form Ticket Main
                fakeData.value.push({ "dependentcomponentobjectid": "e77df88a-908e-48b8-bb7b-ddf0362e2d46", "dependentcomponenttype": 60 }); // form Ticket Quick

                fakeData.value.push({ "dependentcomponentobjectid": "ce503a41-90cf-438d-8f8a-d63d7676b185", "dependentcomponenttype": 60 }); // form Account Quick
                fakeData.value.push({ "dependentcomponentobjectid": "0e62a1a1-6130-4684-9bfa-3179cf5e61c2", "dependentcomponenttype": 60 }); // form Mixed Main
                break;

            case "solutions":
                fakeData.value.push({ "solutionid": "b76efba2-221d-4496-a24f-3b0307701132", "friendlyname": "Void Solution", "uniquename": "voidversion", "version": "1.0.0.0", "publisherid": { "customizationprefix": "void" } });
                fakeData.value.push({ "solutionid": "5cc25b43-7939-47f2-9efe-ca5f7374faac", "friendlyname": "Sample Solution", "uniquename": "samplesolution", "version": "1.0.0.3", "publisherid": { "customizationprefix": "sample" } });
                fakeData.value.push({ "solutionid": "40e34c17-718b-42db-93d1-f875dac4241a", "friendlyname": "Test Solution", "uniquename": "testsolution", "version": "1.0.0.0", "publisherid": { "customizationprefix": "tst" } });
                if (filters.indexOf("ismanaged") == -1) { fakeData.value.push({ "solutionid": "4efb97ad-271b-428d-8460-bbd409e56a21", "friendlyname": "Managed Solution", "uniquename": "managedsolution", "version": "2.0.0.0", "publisherid": { "customizationprefix": "mng" } }); }
                break;

            case "systemforms":
                var fakeXmlNBA = '<form shownavigationbar="true" showImage="false" maxWidth="1920"><tabs><tab verticallayout="true" id="{52bd0dbf-e621-4148-a046-107885775b8b}" IsUserDefined="1"><labels><label description="General" languagecode="1033" /></labels><columns><column width="100%"><sections><section showlabel="false" showbar="false" IsUserDefined="0" id="{75039b6b-aca6-4397-aadc-5b8a3c128e2a}"><labels><label description="General" languagecode="1033" /></labels><rows><row><cell id="{d449c844-4b82-cda2-5aee-081e911e4740}" showlabel="true" locklevel="0"><labels><label description="Conference" languagecode="1033" /></labels><control id="sample_conference" classid="{3EF39988-22BB-4f0b-BBBE-64B5A3748AEE}" datafieldname="sample_conference" disabled="false" uniqueid="{3d4ebbb5-6397-11a2-7c37-0b61a25d7061}" /></cell></row><row><cell id="{1526a79e-709c-a471-d01d-52cc52aa7487}" showlabel="true" locklevel="0"><labels><label description="Division" languagecode="1033" /></labels><control id="sample_division" classid="{4AA28AB7-9C13-4F57-A73D-AD894D048B5F}" datafieldname="sample_division" disabled="false" uniqueid="{0e004a49-2475-45c8-1739-49c1a799a2a6}" /></cell></row><row><cell id="{381de048-5418-e156-8721-11692ad31415}" showlabel="true" locklevel="0"><labels><label description="Team" languagecode="1033" /></labels><control id="sample_team" classid="{3EF39988-22BB-4f0b-BBBE-64B5A3748AEE}" datafieldname="sample_team" disabled="false" /></cell></row></rows></section></sections></column></columns></tab></tabs><Navigation><NavBar></NavBar><NavBarAreas /></Navigation><formLibraries><Library name="gp_/js/DependentOptionSet.js" libraryUniqueId="{5e1627db-3978-ea09-77ec-059d579d5833}" /><Library name="gp_/js/dosm_DependentOptionSet.js" libraryUniqueId="{b36302b4-6a9b-433a-a033-5b59f8d0ef5e}" /></formLibraries><events><event name="onload" application="false" active="false"><Handlers><Handler functionName="DO.DependentOptionSet.init" libraryName="gp_/js/DependentOptionSet.js" handlerUniqueId="{cbc65b04-9e74-c3b4-2500-e95c8e3c397d}" enabled="true" parameters="&quot;sample_/sample_nba_config.js&quot;" passExecutionContext="false" /><Handler functionName="DOSM.LoadConfiguration" libraryName="gp_/js/dosm_DependentOptionSet.js" handlerUniqueId="{b2be0efb-f305-4586-a601-357ec9df107b}" enabled="true" parameters="&quot;sample_/sample_nba_config.js&quot;" passExecutionContext="true" /></Handlers></event><event name="onchange" application="false" active="false" attribute="sample_conference"><Handlers><Handler functionName="DO.DependentOptionSet.filterDependentField" libraryName="gp_/js/DependentOptionSet.js" handlerUniqueId="{c13507a1-a40a-66c3-dc18-2424ce92ed4a}" enabled="true" parameters="&quot;sample_conference&quot;, &quot;sample_division&quot;" passExecutionContext="false" /><Handler functionName="DOSM.FilterField" libraryName="gp_/js/dosm_DependentOptionSet.js" handlerUniqueId="{65ed13af-1f8f-4efd-b5c9-45ac9d60f23b}" enabled="true" parameters="&quot;sample_conference&quot;, &quot;sample_division&quot;" passExecutionContext="true" /></Handlers></event><event name="onchange" application="false" active="false" attribute="sample_division"><Handlers><Handler functionName="DO.DependentOptionSet.filterDependentField" libraryName="gp_/js/DependentOptionSet.js" handlerUniqueId="{d6a67885-4831-2820-b655-c09a49ce5cdd}" enabled="true" parameters="&quot;sample_division&quot;, &quot;sample_team&quot;" passExecutionContext="false" /><Handler functionName="DOSM.FilterField" libraryName="gp_/js/dosm_DependentOptionSet.js" handlerUniqueId="{dc3541fa-d144-4f5a-872d-0b4c0ba70f3a}" enabled="true" parameters="&quot;sample_division&quot;, &quot;sample_team&quot;" passExecutionContext="true" /></Handlers></event></events><controlDescriptions /></form>';
                var fakeXmlNBASeason = '<form shownavigationbar="true" showImage="false" maxWidth="1920"><tabs><tab verticallayout="true" id="{52bd0dbf-e621-4148-a046-107885775b8b}" IsUserDefined="1"><labels><label description="General" languagecode="1033" /></labels><columns><column width="100%"><sections><section showlabel="false" showbar="false" IsUserDefined="0" id="{75039b6b-aca6-4397-aadc-5b8a3c128e2a}"><labels><label description="General" languagecode="1033" /></labels><rows><row><cell id="{d449c844-4b82-cda2-5aee-081e911e4740}" showlabel="true" locklevel="0"><labels><label description="Conference" languagecode="1033" /></labels><control id="sample_conference" classid="{3EF39988-22BB-4f0b-BBBE-64B5A3748AEE}" datafieldname="sample_conference" disabled="false" /></cell></row><row><cell id="{1526a79e-709c-a471-d01d-52cc52aa7487}" showlabel="true" locklevel="0"><labels><label description="Division" languagecode="1033" /></labels><control id="sample_division" classid="{4AA28AB7-9C13-4F57-A73D-AD894D048B5F}" datafieldname="sample_division" disabled="false" /></cell></row><row><cell id="{381de048-5418-e156-8721-11692ad31415}" showlabel="true" locklevel="0"><labels><label description="Team" languagecode="1033" /></labels><control id="sample_team" classid="{3EF39988-22BB-4f0b-BBBE-64B5A3748AEE}" datafieldname="sample_team" disabled="false" /></cell></row></rows></section></sections></column></columns></tab></tabs><Navigation><NavBar></NavBar><NavBarAreas /></Navigation><formLibraries></formLibraries><events><event name="onload" application="false" active="false"></event><event name="onchange" application="false" active="false" attribute="sample_conference"><InternalHandlers><Handler functionName="internalInit" libraryName="internal.js" handlerUniqueId="{f783d0aa-928b-44e2-ba95-376a5bb63763}" enabled="true" parameters="" passExecutionContext="true"/></InternalHandlers><Handlers><Handler functionName="otherInit" libraryName="other.js" handlerUniqueId="{44e33c23-2b5d-48fc-b963-f53bd6c214c6}" enabled="true" parameters="" passExecutionContext="true"/></Handlers></event></events><controlDescriptions /></form>';
                var fakeXmlTicket = '<form shownavigationbar="true" showImage="false" maxWidth="1920"><tabs><tab verticallayout="true" id="{52bd0dbf-e621-4148-a046-107885775b8b}" IsUserDefined="1"><labels><label description="General" languagecode="1033" /></labels><columns><column width="100%"><sections><section showlabel="false" showbar="false" IsUserDefined="0" id="{75039b6b-aca6-4397-aadc-5b8a3c128e2a}"><labels><label description="General" languagecode="1033" /></labels><rows><row><cell id="{d449c844-4b82-cda2-5aee-081e911e4740}" showlabel="true" locklevel="0"><labels><label description="Category" languagecode="1033" /></labels><control id="sample_category" classid="{3EF39988-22BB-4f0b-BBBE-64B5A3748AEE}" datafieldname="sample_category" disabled="false" uniqueid="{3d4ebbb5-6397-11a2-7c37-0b61a25d7061}" /></cell></row><row><cell id="{1526a79e-709c-a471-d01d-52cc52aa7487}" showlabel="true" locklevel="0"><labels><label description="Sub Category" languagecode="1033" /></labels><control id="sample_subcategory" classid="{4AA28AB7-9C13-4F57-A73D-AD894D048B5F}" datafieldname="sample_subcategory" disabled="false" uniqueid="{0e004a49-2475-45c8-1739-49c1a799a2a6}" /></cell></row><row><cell id="{381de048-5418-e156-8721-11692ad31415}" showlabel="true" locklevel="0"><labels><label description="Type" languagecode="1033" /></labels><control id="sample_type" classid="{3EF39988-22BB-4f0b-BBBE-64B5A3748AEE}" datafieldname="sample_type" disabled="false" /></cell></row></rows></section></sections></column></columns></tab></tabs><Navigation><NavBar></NavBar><NavBarAreas /></Navigation><formLibraries><Library name="gp_/js/DependentOptionSet.js" libraryUniqueId="{5e1627db-3978-ea09-77ec-059d579d5833}" /><Library name="gp_/js/dosm_DependentOptionSet.js" libraryUniqueId="{b36302b4-6a9b-433a-a033-5b59f8d0ef5e}" /></formLibraries><events><event name="onload" application="false" active="false"><Handlers><Handler functionName="DO.DependentOptionSet.init" libraryName="gp_/js/DependentOptionSet.js" handlerUniqueId="{cbc65b04-9e74-c3b4-2500-e95c8e3c397d}" enabled="true" parameters="&quot;sample_/sample_ticket_config.js&quot;" passExecutionContext="false" /><Handler functionName="DOSM.LoadConfiguration" libraryName="gp_/js/dosm_DependentOptionSet.js" handlerUniqueId="{b2be0efb-f305-4586-a601-357ec9df107b}" enabled="true" parameters="&quot;sample_/sample_ticket_config.js&quot;" passExecutionContext="true" /></Handlers></event><event name="onchange" application="false" active="false" attribute="sample_category"><Handlers><Handler functionName="DO.DependentOptionSet.filterDependentField" libraryName="gp_/js/DependentOptionSet.js" handlerUniqueId="{c13507a1-a40a-66c3-dc18-2424ce92ed4a}" enabled="true" parameters="&quot;sample_category&quot;, &quot;sample_subcategory&quot;" passExecutionContext="false" /><Handler functionName="DOSM.FilterField" libraryName="gp_/js/dosm_DependentOptionSet.js" handlerUniqueId="{65ed13af-1f8f-4efd-b5c9-45ac9d60f23b}" enabled="true" parameters="&quot;sample_category&quot;, &quot;sample_subcategory&quot;" passExecutionContext="true" /></Handlers></event><event name="onchange" application="false" active="false" attribute="sample_subcategory"><Handlers><Handler functionName="DO.DependentOptionSet.filterDependentField" libraryName="gp_/js/DependentOptionSet.js" handlerUniqueId="{d6a67885-4831-2820-b655-c09a49ce5cdd}" enabled="true" parameters="&quot;sample_subcategory&quot;, &quot;sample_type&quot;" passExecutionContext="false" /><Handler functionName="DOSM.FilterField" libraryName="gp_/js/dosm_DependentOptionSet.js" handlerUniqueId="{dc3541fa-d144-4f5a-872d-0b4c0ba70f3a}" enabled="true" parameters="&quot;sample_subcategory&quot;, &quot;sample_type&quot;" passExecutionContext="true" /></Handlers></event></events><controlDescriptions /></form>';
                var fakeXmlTicketNotConfigured = '<form shownavigationbar="true" showImage="false" maxWidth="1920"><tabs><tab verticallayout="true" id="{52bd0dbf-e621-4148-a046-107885775b8b}" IsUserDefined="1"><labels><label description="General" languagecode="1033" /></labels><columns><column width="100%"><sections><section showlabel="false" showbar="false" IsUserDefined="0" id="{75039b6b-aca6-4397-aadc-5b8a3c128e2a}"><labels><label description="General" languagecode="1033" /></labels><rows><row><cell id="{d449c844-4b82-cda2-5aee-081e911e4740}" showlabel="true" locklevel="0"><labels><label description="Category" languagecode="1033" /></labels><control id="sample_category" classid="{3EF39988-22BB-4f0b-BBBE-64B5A3748AEE}" datafieldname="sample_category" disabled="false" uniqueid="{3d4ebbb5-6397-11a2-7c37-0b61a25d7061}" /></cell></row><row><cell id="{1526a79e-709c-a471-d01d-52cc52aa7487}" showlabel="true" locklevel="0"><labels><label description="Sub Category" languagecode="1033" /></labels><control id="sample_subcategory" classid="{4AA28AB7-9C13-4F57-A73D-AD894D048B5F}" datafieldname="sample_subcategory" disabled="false" uniqueid="{0e004a49-2475-45c8-1739-49c1a799a2a6}" /></cell></row><row><cell id="{381de048-5418-e156-8721-11692ad31415}" showlabel="true" locklevel="0"><labels><label description="Type" languagecode="1033" /></labels><control id="sample_type" classid="{3EF39988-22BB-4f0b-BBBE-64B5A3748AEE}" datafieldname="sample_type" disabled="false" /></cell></row></rows></section></sections></column></columns></tab></tabs><Navigation><NavBar></NavBar><NavBarAreas /></Navigation><controlDescriptions /></form>';

                var fakeXmlAccount = '<form shownavigationbar="true" showImage="false" maxWidth="1920"><tabs><tab verticallayout="true" id="{52bd0dbf-e621-4148-a046-107885775b8b}" IsUserDefined="1"><labels><label description="General" languagecode="1033" /></labels><columns><column width="100%"><sections><section showlabel="false" showbar="false" IsUserDefined="0" id="{75039b6b-aca6-4397-aadc-5b8a3c128e2a}"><labels><label description="General" languagecode="1033" /></labels><rows><row><cell id="{d449c844-4b82-cda2-5aee-081e911e4740}" showlabel="true" locklevel="0"><labels><label description="Category" languagecode="1033" /></labels><control id="accountcategorycode" classid="{3EF39988-22BB-4f0b-BBBE-64B5A3748AEE}" datafieldname="accountcategorycode" disabled="false" /></cell></row><row><cell id="{1526a79e-709c-a471-d01d-52cc52aa7487}" showlabel="true" locklevel="0"><labels><label description="Payment Terms" languagecode="1033" /></labels><control id="paymenttermscode" classid="{4AA28AB7-9C13-4F57-A73D-AD894D048B5F}" datafieldname="paymenttermscode" disabled="false" /></cell></row></rows></section></sections></column></columns></tab></tabs><Navigation><NavBar></NavBar><NavBarAreas /></Navigation><controlDescriptions /></form>';
                var fakeXmlAccountDay = '<form shownavigationbar="true" showImage="false" maxWidth="1920"><tabs><tab verticallayout="true" id="{52bd0dbf-e621-4148-a046-107885775b8b}" IsUserDefined="1"><labels><label description="General" languagecode="1033" /></labels><columns><column width="100%"><sections><section showlabel="false" showbar="false" IsUserDefined="0" id="{75039b6b-aca6-4397-aadc-5b8a3c128e2a}"><labels><label description="General" languagecode="1033" /></labels><rows><row><cell id="{d449c844-4b82-cda2-5aee-081e911e4740}" showlabel="true" locklevel="0"><labels><label description="Category" languagecode="1033" /></labels><control id="accountcategorycode" classid="{3EF39988-22BB-4f0b-BBBE-64B5A3748AEE}" datafieldname="accountcategorycode" disabled="false" /></cell></row><row><cell id="{1526a79e-709c-a471-d01d-52cc52aa7487}" showlabel="true" locklevel="0"><labels><label description="Preferred Day" languagecode="1033" /></labels><control id="preferredappointmentdaycode" classid="{4AA28AB7-9C13-4F57-A73D-AD894D048B5F}" datafieldname="preferredappointmentdaycode" disabled="false" /></cell></row></rows></section></sections></column></columns></tab></tabs><Navigation><NavBar></NavBar><NavBarAreas /></Navigation><controlDescriptions /></form>';
                var fakeXmlMixed = '<form shownavigationbar="true" showImage="false" maxWidth="1920"><tabs><tab verticallayout="true" id="{52bd0dbf-e621-4148-a046-107885775b8b}" IsUserDefined="1"><labels><label description="General" languagecode="1033" /></labels><columns><column width="100%"><sections><section showlabel="false" showbar="false" IsUserDefined="0" id="{75039b6b-aca6-4397-aadc-5b8a3c128e2a}"><labels><label description="General" languagecode="1033" /></labels><rows><row><cell id="{d449c844-4b82-cda2-5aee-081e911e4740}" showlabel="true" locklevel="0"><labels><label description="Mixed Parent" languagecode="1033" /></labels><control id="mixed_parent" classid="{3EF39988-22BB-4f0b-BBBE-64B5A3748AEE}" datafieldname="mixed_parent" disabled="false" /></cell></row><row><cell id="{1526a79e-709c-a471-d01d-52cc52aa7487}" showlabel="true" locklevel="0"><labels><label description="Mixed Child" languagecode="1033" /></labels><control id="mixed_child" classid="{4AA28AB7-9C13-4F57-A73D-AD894D048B5F}" datafieldname="mixed_child" disabled="false" /></cell></row></rows></section></sections></column></columns></tab></tabs><Navigation><NavBar></NavBar><NavBarAreas /></Navigation><formLibraries><Library name="gp_/js/dosm_DependentOptionSet.js" libraryUniqueId="{b36302b4-6a9b-433a-a033-5b59f8d0ef5e}" /></formLibraries><events><event name="onload" application="false" active="false"><Handlers><Handler functionName="DOSM.LoadConfiguration" libraryName="gp_/js/dosm_DependentOptionSet.js" handlerUniqueId="{b2be0efb-f305-4586-a601-357ec9df107b}" enabled="true" parameters="&quot;mixed_/mixed_config.js&quot;" passExecutionContext="true" /></Handlers></event><event name="onchange" application="false" active="false" attribute="mixed_parent"><Handlers><Handler functionName="DOSM.FilterField" libraryName="gp_/js/dosm_DependentOptionSet.js" handlerUniqueId="{65ed13af-1f8f-4efd-b5c9-45ac9d60f23b}" enabled="true" parameters="&quot;mixed_parent&quot;, &quot;mixed_child&quot;" passExecutionContext="true" /></Handlers></event></events><controlDescriptions /></form>';

                var formNBAInformation = { "formid": "dc766e2b-0d73-432c-aed4-e99f8f6bcf34", "name": "Information NBA", "objecttypecode": "sample_nba", "objecttypecode@OData.Community.Display.V1.FormattedValue": "NBA", "type": 2, "type@OData.Community.Display.V1.FormattedValue": "Main", "formxml": fakeXmlNBA };
                var formNBAQuick = { "formid": "130d7071-5f55-4ebd-ab6e-f84bf3038dbe", "name": "Quick NBA", "objecttypecode": "sample_nba", "objecttypecode@OData.Community.Display.V1.FormattedValue": "NBA", "type": 7, "type@OData.Community.Display.V1.FormattedValue": "Quick Create", "formxml": fakeXmlNBA };
                var formNBASeason = { "formid": "709e08e3-9365-4a04-838c-f2b371c25842", "name": "Season NBA", "objecttypecode": "sample_nba", "objecttypecode@OData.Community.Display.V1.FormattedValue": "NBA", "type": 2, "type@OData.Community.Display.V1.FormattedValue": "Main", "formxml": fakeXmlNBASeason };

                var formTicketInformation = { "formid": "c960b331-a674-44cf-af77-473c566dd9e3", "name": "Information Ticket", "objecttypecode": "sample_ticket", "objecttypecode@OData.Community.Display.V1.FormattedValue": "Ticket", "type": 2, "type@OData.Community.Display.V1.FormattedValue": "Main", "formxml": fakeXmlTicket };
                var formTicketQuick = { "formid": "e77df88a-908e-48b8-bb7b-ddf0362e2d46", "name": "Quick Ticket", "objecttypecode": "sample_ticket", "objecttypecode@OData.Community.Display.V1.FormattedValue": "Ticket", "type": 7, "type@OData.Community.Display.V1.FormattedValue": "Quick Create", "formxml": fakeXmlTicket };
                var formTicketDetails = { "formid": "98ce4e47-0edc-46d0-aef6-2b7b7555b237", "name": "Ticket Details", "objecttypecode": "sample_ticket", "objecttypecode@OData.Community.Display.V1.FormattedValue": "Ticket", "type": 2, "type@OData.Community.Display.V1.FormattedValue": "Main", "formxml": fakeXmlTicketNotConfigured };

                var formAccount = { "formid": "d265b23e-b065-4e3c-98bf-189ffaa0ee0b", "name": "Account", "objecttypecode": "account", "objecttypecode@OData.Community.Display.V1.FormattedValue": "Account", "type": 2, "type@OData.Community.Display.V1.FormattedValue": "Main", "formxml": fakeXmlAccount };
                var formAccountQuick = { "formid": "ce503a41-90cf-438d-8f8a-d63d7676b185", "name": "Account Quick Create", "objecttypecode": "account", "objecttypecode@OData.Community.Display.V1.FormattedValue": "Account", "type": 7, "type@OData.Community.Display.V1.FormattedValue": "Quick Create", "formxml": fakeXmlMixed };
                var formAccountDay = { "formid": "796c565d-c19e-4247-98ea-ffa51a8ca181", "name": "Account Day", "objecttypecode": "account", "objecttypecode@OData.Community.Display.V1.FormattedValue": "Account", "type": 2, "type@OData.Community.Display.V1.FormattedValue": "Main", "formxml": fakeXmlAccountDay };
                var formMixed = { "formid": "0e62a1a1-6130-4684-9bfa-3179cf5e61c2", "name": "Mixed Form", "objecttypecode": "mixed_entity", "objecttypecode@OData.Community.Display.V1.FormattedValue": "Mixed Entity", "type": 2, "type@OData.Community.Display.V1.FormattedValue": "Main", "formxml": fakeXmlMixed };

                var fakeContext = { value: [] };
                fakeContext["@odata.context"] = "https://democall/api/data/v9.0/$metadata#systemforms(formid,name,type,objecttypecode,formxml)";
                fakeContext.value.push(formTicketQuick);
                fakeContext.value.push(formTicketInformation);
                fakeContext.value.push(formNBAQuick);
                fakeContext.value.push(formNBAInformation);
                fakeContext.value.push(formMixed);
                fakeContext.value.push(formAccountQuick);
                fakeContext.value.push(formAccount);

                fakeData = fakeHeaderStart + emptyLine + JSON.stringify(fakeContext) + emptyLine + fakeHeaderEnd;

                if (filters.indexOf("$select") > -1) {
                    fakeData = { value: [] };

                    if (filters.indexOf("sample_nba") > -1) {
                        fakeData.value.push(formNBASeason);
                        fakeData.value.push(formNBAInformation);
                        fakeData.value.push(formNBAQuick);
                    }
                    if (filters.indexOf("sample_ticket") > -1) {
                        fakeData.value.push(formTicketDetails);
                        fakeData.value.push(formTicketInformation);
                        fakeData.value.push(formTicketQuick);
                    }

                    if (filters.indexOf("account") > -1) {
                        fakeData.value.push(formAccountDay);
                        fakeData.value.push(formAccount);
                        fakeData.value.push(formAccountQuick);
                    }

                    if (filters.indexOf("mixed_entity") > -1) {
                        fakeData.value.push(formMixed);
                    }
                }
                break;

            case "webresourceset":
                var fakeContext = { value: [] };
                fakeContext["@odata.context"] = "https://democall/api/data/v9.0/$metadata#webresourceset(webresourceid,name,displayname,content)";

                fakeContext.value.push(webResourceTicket);
                fakeContext.value.push(webResourceTestConfig);
                fakeContext.value.push(webResourceNBA);
                fakeContext.value.push(webResourceMixed);

                fakeData = fakeHeaderStart + emptyLine + JSON.stringify(fakeContext) + emptyLine + fakeHeaderEnd;

                if (filters.indexOf("5cc25b43-7939-47f2-9efe-ca5f7374faac") > -1) {
                    fakeData = { value: [] };
                    fakeData.value.push(webResourceNBA);
                    fakeData.value.push(webResourceTicket);
                    fakeData.value.push(webResourcejQuery);
                }

                if (filters.indexOf("40e34c17-718b-42db-93d1-f875dac4241a") > -1) {
                    fakeData = { value: [] };
                    fakeData.value.push(webResourceTestConfig);
                    fakeData.value.push(webResourceMixed);
                    fakeData.value.push(webResourcejQuery);
                }

                if (filters.indexOf("b76efba2-221d-4496-a24f-3b0307701132") > -1) {
                    fakeData = { value: [] };
                }
                // Managed Solution
                if (filters.indexOf("4efb97ad-271b-428d-8460-bbd409e56a21") > -1) {
                    fakeData = { value: [] };
                    fakeData.value.push(webResourceManaged);
                }
                break;
        }

        if (entitySetName.indexOf("PicklistAttributeMetadata") > -1) {
            // #region Field Values
            var nbaValues_conference = [];
            nbaValues_conference.push({ "Value": 814000000, "Label": "Eastern Conference" });
            nbaValues_conference.push({ "Value": 814000001, "Label": "Western Conference" });

            var nbaValues_division = [];
            nbaValues_division.push({ "Value": 814000000, "Label": "Atlantic Division" });
            nbaValues_division.push({ "Value": 814000001, "Label": "Central Division" });
            nbaValues_division.push({ "Value": 814000002, "Label": "Southeast Division" });
            nbaValues_division.push({ "Value": 814000003, "Label": "Northwest Division" });
            nbaValues_division.push({ "Value": 814000004, "Label": "Pacific Division" });
            nbaValues_division.push({ "Value": 814000005, "Label": "Southwest Division" });

            var nbaValues_team = [];
            nbaValues_team.push({ "Value": 814000000, "Label": "Boston Celtics" });
            nbaValues_team.push({ "Value": 814000001, "Label": "Brooklyn Nets" });
            nbaValues_team.push({ "Value": 814000002, "Label": "New York Knicks" });
            nbaValues_team.push({ "Value": 814000003, "Label": "Philadelphia 76ers" });
            nbaValues_team.push({ "Value": 814000004, "Label": "Toronto Raptors" });
            nbaValues_team.push({ "Value": 814000005, "Label": "Chicago Bulls" });
            nbaValues_team.push({ "Value": 814000006, "Label": "Cleveland Cavaliers" });
            nbaValues_team.push({ "Value": 814000007, "Label": "Detroit Pistons" });
            nbaValues_team.push({ "Value": 814000008, "Label": "Indiana Pacers" });
            nbaValues_team.push({ "Value": 814000009, "Label": "Milwaukee Bucks" });
            nbaValues_team.push({ "Value": 814000010, "Label": "Atlanta Hawks" });
            nbaValues_team.push({ "Value": 814000011, "Label": "Charlotte Hornets" });
            nbaValues_team.push({ "Value": 814000012, "Label": "Miami Heat" });
            nbaValues_team.push({ "Value": 814000013, "Label": "Orlando Magic" });
            nbaValues_team.push({ "Value": 814000014, "Label": "Washington Wizards" });
            nbaValues_team.push({ "Value": 814000015, "Label": "Denver Nuggets" });
            nbaValues_team.push({ "Value": 814000016, "Label": "Minnesota Timberwolves" });
            nbaValues_team.push({ "Value": 814000017, "Label": "Oklahoma City Thunder" });
            nbaValues_team.push({ "Value": 814000018, "Label": "Portland Trail Blazers" });
            nbaValues_team.push({ "Value": 814000019, "Label": "Utah Jazz" });
            nbaValues_team.push({ "Value": 814000020, "Label": "Golden State Warriors" });
            nbaValues_team.push({ "Value": 814000021, "Label": "Los Angeles Clippers" });
            nbaValues_team.push({ "Value": 814000022, "Label": "Los Angeles Lakers" });
            nbaValues_team.push({ "Value": 814000023, "Label": "Phoenix Suns" });
            nbaValues_team.push({ "Value": 814000024, "Label": "Sacramento Kings" });
            nbaValues_team.push({ "Value": 814000025, "Label": "Dallas Mavericks" });
            nbaValues_team.push({ "Value": 814000026, "Label": "Houston Rockets" });
            nbaValues_team.push({ "Value": 814000027, "Label": "Memphis Grizzlies" });
            nbaValues_team.push({ "Value": 814000028, "Label": "New Orleans Pelicans" });
            nbaValues_team.push({ "Value": 814000029, "Label": "San Antonio Spurs" });

            var ticketValues_category = [];
            ticketValues_category.push({ "Value": 727000000, "Label": "Software" });
            ticketValues_category.push({ "Value": 727000001, "Label": "Hardware" });

            var ticketValues_subcategory = [];
            ticketValues_subcategory.push({ "Value": 727000000, "Label": "Personal Productivity" });
            ticketValues_subcategory.push({ "Value": 727000001, "Label": "Business Applications" });
            ticketValues_subcategory.push({ "Value": 727000002, "Label": "Operating Systems" });
            ticketValues_subcategory.push({ "Value": 727000003, "Label": "Desktop Computer" });
            ticketValues_subcategory.push({ "Value": 727000004, "Label": "Laptop Computer" });
            ticketValues_subcategory.push({ "Value": 727000005, "Label": "Monitor" });
            ticketValues_subcategory.push({ "Value": 727000006, "Label": "Printer" });
            ticketValues_subcategory.push({ "Value": 727000007, "Label": "Telephone" });

            var ticketValues_type = [];
            ticketValues_type.push({ "Value": 727000000, "Label": "Word Processor" });
            ticketValues_type.push({ "Value": 727000001, "Label": "Spreadsheet" });
            ticketValues_type.push({ "Value": 727000002, "Label": "Internet Browser" });
            ticketValues_type.push({ "Value": 727000003, "Label": "E-mail" });
            ticketValues_type.push({ "Value": 727000004, "Label": "Customer Relationship Management" });
            ticketValues_type.push({ "Value": 727000005, "Label": "Enterprise Resource Management" });
            ticketValues_type.push({ "Value": 727000006, "Label": "Human Resource Management" });
            ticketValues_type.push({ "Value": 727000007, "Label": "Windows Vista" });
            ticketValues_type.push({ "Value": 727000008, "Label": "Windows 7" });
            ticketValues_type.push({ "Value": 727000009, "Label": "Windows Server 2003" });
            ticketValues_type.push({ "Value": 727000010, "Label": "Windows Server 2008" });
            ticketValues_type.push({ "Value": 727000011, "Label": "Workstation x1000" });
            ticketValues_type.push({ "Value": 727000012, "Label": "Workstation x2000" });
            ticketValues_type.push({ "Value": 727000013, "Label": "Workstation x3000" });
            ticketValues_type.push({ "Value": 727000014, "Label": "Workstation x4000" });
            ticketValues_type.push({ "Value": 727000015, "Label": "Laptop 1000 series" });
            ticketValues_type.push({ "Value": 727000016, "Label": "Laptop 2000 series" });
            ticketValues_type.push({ "Value": 727000017, "Label": "Laptop 3000 series" });
            ticketValues_type.push({ "Value": 727000018, "Label": "Laptop 4000 series" });
            ticketValues_type.push({ "Value": 727000019, "Label": "CRT-XYZ 17 inch" });
            ticketValues_type.push({ "Value": 727000020, "Label": "LCD-XYZ 17 inch" });
            ticketValues_type.push({ "Value": 727000021, "Label": "LCD-XYZ 21 inch" });
            ticketValues_type.push({ "Value": 727000022, "Label": "LCD-XYZ 24 inch" });
            ticketValues_type.push({ "Value": 727000023, "Label": "Series 1000 Printer - Private" });
            ticketValues_type.push({ "Value": 727000024, "Label": "Series 2000 Color Printer - Private" });
            ticketValues_type.push({ "Value": 727000025, "Label": "Series 9000 Printer - Shared" });
            ticketValues_type.push({ "Value": 727000026, "Label": "Series 9000 Color Printer - Shared" });
            ticketValues_type.push({ "Value": 727000027, "Label": "PSTN Phone" });
            ticketValues_type.push({ "Value": 727000028, "Label": "IP Phone" });
            ticketValues_type.push({ "Value": 727000029, "Label": "Mobile Phone" });


            var accountValues_category = [];
            accountValues_category.push({ "Value": 1, "Label": "Preferred Customer" });
            accountValues_category.push({ "Value": 2, "Label": "Standard" });

            var accountValues_paymentterms = [];
            accountValues_paymentterms.push({ "Value": 1, "Label": "Net 30" });
            accountValues_paymentterms.push({ "Value": 2, "Label": "2% 10, Net 30" });
            accountValues_paymentterms.push({ "Value": 3, "Label": "Net 45" });
            accountValues_paymentterms.push({ "Value": 4, "Label": "Net 60" });


            var accountValues_preferreddays = []
            accountValues_preferreddays.push({ "Value": 1, "Label": "Monday" });
            accountValues_preferreddays.push({ "Value": 2, "Label": "Tuesday" });
            accountValues_preferreddays.push({ "Value": 3, "Label": "Wednesday" });
            accountValues_preferreddays.push({ "Value": 4, "Label": "Thursday" });
            accountValues_preferreddays.push({ "Value": 5, "Label": "Friday" });
            accountValues_preferreddays.push({ "Value": 6, "Label": "Saturday" });
            accountValues_preferreddays.push({ "Value": 0, "Label": "Sunday" });

            var mixedValues_parent = [];
            mixedValues_parent.push({ "Value": 1, "Label": "Parent 1" });
            mixedValues_parent.push({ "Value": 2, "Label": "Parent 2" });

            var mixedValues_child = [];
            mixedValues_child.push({ "Value": 1, "Label": "Child 1A" });
            mixedValues_child.push({ "Value": 2, "Label": "Child 1B" });
            mixedValues_child.push({ "Value": 3, "Label": "Child 2A" });
            mixedValues_child.push({ "Value": 4, "Label": "Child 2B" });

            var mixedValues_child2 = [];
            mixedValues_child2.push({ "Value": 1, "Label": "Child 1A" });
            mixedValues_child2.push({ "Value": 2, "Label": "Child 1B" });
            mixedValues_child2.push({ "Value": 3, "Label": "Child 2A" });
            mixedValues_child2.push({ "Value": 4, "Label": "Child 2B" });
            // #endregion

            var fakeContext1 = { value: [] };
            fakeContext1["@odata.context"] = "https://democall/api/data/v9.0/$metadata#EntityDefinitions('sample_nba')/Attributes/Microsoft.Dynamics.CRM.PicklistAttributeMetadata";

            fakeContext1.value.push({ "LogicalName": "sample_conference", "SchemaName": "Conference", "OptionSet": { "Options": [] } });
            for (var k = 0; k < nbaValues_conference.length; k++) {
                fakeContext1.value[fakeContext1.value.length - 1].OptionSet.Options.push({ "Value": nbaValues_conference[k].Value, "Label": { "UserLocalizedLabel": { "Label": nbaValues_conference[k].Label } } });
            }

            fakeContext1.value.push({ "LogicalName": "sample_division", "SchemaName": "Division", "OptionSet": { "Options": [] } });
            for (var k = 0; k < nbaValues_division.length; k++) {
                fakeContext1.value[fakeContext1.value.length - 1].OptionSet.Options.push({ "Value": nbaValues_division[k].Value, "Label": { "UserLocalizedLabel": { "Label": nbaValues_division[k].Label } } });
            }

            fakeContext1.value.push({ "LogicalName": "sample_team", "SchemaName": "Team", "OptionSet": { "Options": [] } });
            for (var k = 0; k < nbaValues_team.length; k++) {
                fakeContext1.value[fakeContext1.value.length - 1].OptionSet.Options.push({ "Value": nbaValues_team[k].Value, "Label": { "UserLocalizedLabel": { "Label": nbaValues_team[k].Label } } });
            }

            var fakeContext2 = { value: [] };
            fakeContext2["@odata.context"] = "https://democall/api/data/v9.0/$metadata#EntityDefinitions('sample_ticket')/Attributes/Microsoft.Dynamics.CRM.MultiSelectPicklistAttributeMetadata";

            fakeContext2.value.push({ "LogicalName": "sample_category", "SchemaName": "Category", "OptionSet": { "Options": [] } });
            for (var k = 0; k < ticketValues_category.length; k++) {
                fakeContext2.value[fakeContext2.value.length - 1].OptionSet.Options.push({ "Value": ticketValues_category[k].Value, "Label": { "UserLocalizedLabel": { "Label": ticketValues_category[k].Label } } });
            }
            fakeContext2.value.push({ "LogicalName": "sample_subcategory", "SchemaName": "Sub Category", "OptionSet": { "Options": [] } });
            for (var k = 0; k < ticketValues_subcategory.length; k++) {
                fakeContext2.value[fakeContext2.value.length - 1].OptionSet.Options.push({ "Value": ticketValues_subcategory[k].Value, "Label": { "UserLocalizedLabel": { "Label": ticketValues_subcategory[k].Label } } });
            }
            fakeContext2.value.push({ "LogicalName": "sample_type", "SchemaName": "Type", "OptionSet": { "Options": [] } });
            for (var k = 0; k < ticketValues_type.length; k++) {
                fakeContext2.value[fakeContext2.value.length - 1].OptionSet.Options.push({ "Value": ticketValues_type[k].Value, "Label": { "UserLocalizedLabel": { "Label": ticketValues_type[k].Label } } });
            }

            var fakeContext3 = { value: [] };
            fakeContext3["@odata.context"] = "https://democall/api/data/v9.0/$metadata#EntityDefinitions('account')/Attributes/Microsoft.Dynamics.CRM.PicklistAttributeMetadata";

            fakeContext3.value.push({ "LogicalName": "accountcategorycode", "SchemaName": "Category", "OptionSet": { "Options": [] } });
            for (var k = 0; k < accountValues_category.length; k++) {
                fakeContext3.value[fakeContext3.value.length - 1].OptionSet.Options.push({ "Value": accountValues_category[k].Value, "Label": { "UserLocalizedLabel": { "Label": accountValues_category[k].Label } } });
            }
            fakeContext3.value.push({ "LogicalName": "paymenttermscode", "SchemaName": "Payment Terms", "OptionSet": { "Options": [] } });
            for (var k = 0; k < accountValues_paymentterms.length; k++) {
                fakeContext3.value[fakeContext3.value.length - 1].OptionSet.Options.push({ "Value": accountValues_paymentterms[k].Value, "Label": { "UserLocalizedLabel": { "Label": accountValues_paymentterms[k].Label } } });
            }
            fakeContext3.value.push({ "LogicalName": "preferredappointmentdaycode", "SchemaName": "Preferred Day", "OptionSet": { "Options": [] } });
            for (var k = 0; k < accountValues_preferreddays.length; k++) {
                fakeContext3.value[fakeContext3.value.length - 1].OptionSet.Options.push({ "Value": accountValues_preferreddays[k].Value, "Label": { "UserLocalizedLabel": { "Label": accountValues_preferreddays[k].Label } } });
            }
            // adding to account the mixed fields
            fakeContext3.value.push({ "LogicalName": "mixed_parent", "SchemaName": "Mixed Parent", "OptionSet": { "Options": [] } });
            for (var k = 0; k < mixedValues_parent.length; k++) {
                fakeContext3.value[fakeContext3.value.length - 1].OptionSet.Options.push({ "Value": mixedValues_parent[k].Value, "Label": { "UserLocalizedLabel": { "Label": mixedValues_parent[k].Label } } });
            }
            fakeContext3.value.push({ "LogicalName": "mixed_child", "SchemaName": "Mixed Child", "OptionSet": { "Options": [] } });
            for (var k = 0; k < mixedValues_child2.length; k++) {
                fakeContext3.value[fakeContext3.value.length - 1].OptionSet.Options.push({ "Value": mixedValues_child2[k].Value, "Label": { "UserLocalizedLabel": { "Label": mixedValues_child2[k].Label } } });
            }

            var fakeContext4 = { value: [] };
            fakeContext4["@odata.context"] = "https://democall/api/data/v9.0/$metadata#EntityDefinitions('mixed_entity')/Attributes/Microsoft.Dynamics.CRM.PicklistAttributeMetadata";

            fakeContext4.value.push({ "LogicalName": "mixed_parent", "SchemaName": "Mixed Parent", "OptionSet": { "Options": [] } });
            for (var k = 0; k < mixedValues_parent.length; k++) {
                fakeContext4.value[fakeContext4.value.length - 1].OptionSet.Options.push({ "Value": mixedValues_parent[k].Value, "Label": { "UserLocalizedLabel": { "Label": mixedValues_parent[k].Label } } });
            }
            fakeContext4.value.push({ "LogicalName": "mixed_child", "SchemaName": "Mixed Child", "OptionSet": { "Options": [] } });
            for (var k = 0; k < mixedValues_child.length; k++) {
                fakeContext4.value[fakeContext4.value.length - 1].OptionSet.Options.push({ "Value": mixedValues_child[k].Value, "Label": { "UserLocalizedLabel": { "Label": mixedValues_child[k].Label } } });
            }

            fakeData = fakeHeaderStart + JSON.stringify(fakeContext1) + emptyLine + fakeHeaderStart + JSON.stringify(fakeContext2) + emptyLine + fakeHeaderStart + JSON.stringify(fakeContext3) + emptyLine + fakeHeaderStart + JSON.stringify(fakeContext4) + emptyLine + fakeHeaderEnd;
        }
    }
    return fakeData;
}
// #endregion  
 
﻿// #region DOSM.Models
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
 
// #region DOSM.UI

// #region jQuery Helpers
/**
 * Append an element to a parent
 * @param {string} parentId Parent Id
 * @param {any} element Element
 */
DOSM.UI.Append = function (parentId, element) {
    $("#" + parentId).append(element);
}

/**
 * Set an element empty
 * @param {string} id Id
 */
DOSM.UI.SetEmpty = function (id) {
    $("#" + id).empty();
}
// #endregion

// #region #bootstrap-select Functions
/**
 * Refresh a dropdown
 * @param {string} id Id
 */
DOSM.UI.RefreshDropdown = function (id) {
    $("#" + id).selectpicker("refresh");
}

/**
 * Lock a dropdown
 * @param {string} id Id
 */
DOSM.UI.LockDropdown = function (id) {
    $("#" + id).prop("disabled", "true");
    DOSM.UI.RefreshDropdown(id);
}

/**
 * Unlock a dropdown
 * @param {string} id Id
 */
DOSM.UI.UnlockDropdown = function (id) {
    $("#" + id).prop("disabled", "");
    DOSM.UI.RefreshDropdown(id);
}

/**
 * Render a dropdown as disabled
 * @param {string} id Id
 * @param {string} title Title
 */
DOSM.UI.ResetDropdown = function (id, title) {
    // empty() required for a strange bug on the update of title when no entries are selected in a multiselect optionset
    DOSM.UI.SetEmpty(id);
    $("#" + id).selectpicker("destroy").prop("title", title);
    DOSM.UI.LockDropdown(id);
}

/**
 * Fill a dropdown as enabled
 * @param {string} id Id
 * @param {string} title Title
 * @param {any} options Options
 * @param {boolean} disabledOptions If options are disabled
 * @param {boolean} showGroups If groups are shown
 * @param {boolean} hideSubText if Sub Text is hidden
 */
DOSM.UI.FillDropdown = function (id, title, options, disabledOptions, showGroups, hideSubText) {
    var htmlOptions = "";
    var subTextProperty = "SubText";

    var groups = [];
    if (showGroups == true) {
        subTextProperty = "SubText2";
        options.forEach(function (dropOption) { if (groups.indexOf(dropOption.SubText) == -1) { groups.push(dropOption.SubText); } });
        groups.sort();
    } else { groups.push("No Groups"); } // we need at least an element for the next forEach

    groups.forEach(function (group) {
        if (showGroups == true) { htmlOptions += '<optgroup label="' + group + '">'; }
        options.forEach(function (dropOption) {
            if (dropOption.SubText == group || showGroups != true) {
                htmlOptions += '<option value="' + dropOption.Value + '"';
                if (DOSM.Utilities.HasValue(dropOption[subTextProperty]) && hideSubText != true) { htmlOptions += ' data-subtext="' + dropOption[subTextProperty] + '"'; }
                if (disabledOptions == true) { htmlOptions += ' disabled'; }
                htmlOptions += '>' + dropOption.Label + '</option>';
            }
        });
        if (showGroups == true) { htmlOptions += "</optgroup>"; }
    });

    DOSM.UI.SetEmpty(id);
    if (htmlOptions != "") { $("#" + id).html(htmlOptions); }
    $("#" + id).selectpicker({ title: title });
    DOSM.UI.UnlockDropdown(id);
}

/**
 * Fill a Dropdown with Groups defined by the SubText Property
 * @param {string} id Id
 * @param {string} title Title
 * @param {any} options Options
 * @param {boolean} disabled If options are disabled
 */
DOSM.UI.FillDropdownWithGroups = function (id, title, options, disabled) {
    DOSM.UI.FillDropdown(id, title, options, disabled, true);
}
// #endregion

// #region bootbox.js Functions
/**
 * Display Dialog (internal function)
 * @param {string} title Title
 * @param {string} message Message
 * @param {string} className Class Name
 * @param {string} size Size
 * @param {Function} okCallBack Function to call when OK is pressed
 * @param {boolean} askQuestion If show the dialog as a question
 */
DOSM.UI.DisplayDialog = function (title, message, className, size, okCallBack, askQuestion) {
    bootbox.hideAll();
    var properties = { message: message, centerVertical: true, buttons: { ok: { label: "OK", className: className } } };
    if (DOSM.Utilities.HasValue(title)) { properties.title = title; }
    if (DOSM.Utilities.HasValue(size)) { properties.size = size; }

    if (!DOSM.Utilities.HasValue(className)) { properties.closeButton = false; properties.buttons = {}; }

    if (DOSM.Utilities.HasValue(okCallBack) && askQuestion != true) {
        properties.closeButton = false;
        properties.buttons = { ok: { label: "OK", className: className, callback: okCallBack } }
    }

    if (DOSM.Utilities.HasValue(okCallBack) && askQuestion == true) {
        properties.closeButton = true;
        properties.buttons = { cancel: { label: "No" }, confirm: { label: "Yes", className: className } };
        properties.callback = function (result) { if (result == true) { okCallBack(); } };
        bootbox.confirm(properties);
    } else {
        bootbox.dialog(properties);
    }
}

/**
 * Show a message
 * @param {string} title Title
 * @param {string} message Message
 * @param {string} size Size
 * @param {Function} okCallBack Function to call when OK is pressed
 */
DOSM.UI.Show = function (title, message, size, okCallBack) {
    DOSM.UI.DisplayDialog("<span class='text-primary'>" + title + "</span>", message, "btn-primary", size, okCallBack);
}

/**
 * Show an error message
 * @param {string} title Title
 * @param {string} message Message
 * @param {string} size Size
 * @param {Function} okCallBack Function to call when OK is pressed
 */
DOSM.UI.ShowError = function (title, message, size, okCallBack) {
    DOSM.UI.DisplayDialog("<span class='text-danger'>" + title + "</span>", message, "btn-danger", size, okCallBack);
}

/**
 * Show a loading message
 * @param {string} message Message
 * @param {string} size Size
 */
DOSM.UI.ShowLoading = function (message, size) {
    var loadingMessage = '<p class="text-center mb-0">' + message + '</p><br /><div class="d-flex justify-content-center"><div class="spinner-border spinner-border-sm" role="status"><span class="sr-only"></span></div></div>';
    DOSM.UI.DisplayDialog(null, loadingMessage, null, size);
}

/**
 * Show a question
 * @param {string} title Title
 * @param {string} message Message
 * @param {string} size Size
 * @param {Function} comfirmCallBack Function to call when Yes is pressed
 */
DOSM.UI.ShowQuestion = function (title, message, size, comfirmCallBack) {
    DOSM.UI.DisplayDialog("<span class='text-danger'>" + title + "</span>", message, "btn-danger", size, comfirmCallBack, true);
}

/**
 * Hide Loading
 */
DOSM.UI.HideLoading = function () {
    bootbox.hideAll();
}
// #endregion

// #region HTML Helpers

/**
 * Create a div 
 * @param {string} className Class Name
 */
DOSM.UI.CreateDiv = function (className) {
    return $("<div>", { class: className });
}

/**
 * Create a spacer 
 */
DOSM.UI.CreateSpacer = function () {
    return $("<div>", { class: "spacer" });
}

/**
 * Create a Checkbox
 * @param {string} id Id
 * @param {string} text Text
 * @param {boolean} checked Checkbox status
 */
DOSM.UI.CreateCheckbox = function (id, text, checked) {
    return $("<label>", { text: text + " " }).append($("<input>", { id: id, type: "checkbox", checked: checked }));
}
/**
 * Create a Button
 * @param {string} id Id
 * @param {string} text Text
 * @param {Function} event Function to call when the button is clicked
 * @param {string} className Class Name
 */
DOSM.UI.CreateButton = function (id, text, event, className) {
    if (!DOSM.Utilities.HasValue(className)) { className = "btn-primary"; }
    return $("<button>", { id: id, text: text, class: "btn " + className }).click(function () { event(); });
}

/**
 * Create a Close Button
 * @param {Function} event Function to call when the button is clicked
 * @param {any} parameter Parameter of the event
 */
DOSM.UI.CreateCloseButton = function (event, parameter) {
    return $("<button>", { class: "close", "aria-label": "Close" }).click(function () { event(parameter); }).append($("<span>", { "aria-hidden": true, html: "&times;" }));
}

/**
 * Create an empty container
 * @param {string} id Id
 */
DOSM.UI.CreateEmptyContainer = function (id, className) {
    var divProperties = {};
    if (DOSM.Utilities.HasValue(id)) { divProperties.id = id; }
    if (DOSM.Utilities.HasValue(className)) { divProperties.class = className; }
    return $("<div>", divProperties);
}

/**
 * Create a container (half screen)
 * @param {string} title Title
 */
DOSM.UI.CreateHalfContainer = function (title) {
    return DOSM.UI.CreateEmptyContainer(null, "col-lg-6").append($("<h4>", { text: title }));
}

/**
 * Create a container (full screen)
 * @param {string} title Title
 */
DOSM.UI.CreateWideContainer = function (title) {
    return DOSM.UI.CreateEmptyContainer(null, "col-lg-12").append($("<h4>", { text: title }));
}

/**
 * Create a sub container
 * @param {string} title Title
 */
DOSM.UI.CreateSubContainer = function (title) {
    return DOSM.UI.CreateEmptyContainer().append($("<h5>", { text: title }));
}

/**
 * Create a paragraph
 * @param {string} text
 */
DOSM.UI.CreateParagraph = function (text) {
    return $("<p>", { html: text });
}

/**
 * Create a hr
 */
DOSM.UI.CreateHr = function () {
    return $("<hr>");
}

/**
 * Create a br
 */
DOSM.UI.CreateBr = function () {
    return $("<br />");
}

/**
 * Create a span
 * @param {string} id Id
 * @param {string} text Text
 * @param {string} smallText Small Text
 * @param {string} className Class Name
 */
DOSM.UI.CreateSpan = function (id, text, smallText, className) {
    if (DOSM.Utilities.HasValue(smallText)) { text = text + " <small>(" + smallText + ")</small>"; }
    if (!DOSM.Utilities.HasValue(className)) { className = ""; }
    return $("<span>", { id: id, html: text, class: className });
}

/**
 * Create an input
 * @param {string} id Id
 * @param {number} maxLength Max Length
 */
DOSM.UI.CreateInput = function (id, maxLength) {
    if (!DOSM.Utilities.HasValue(maxLength)) { maxLength = 100; };
    return $("<input>", { id: id, class: "form-control", type: "text", autocomplete: "off", maxlength: maxLength });
}

/**
 * Create an input with a prefix
 * @param {string} id Id
 * @param {string} prefixId Prefix Id
 * @param {string} prefix Prefix
 * @param {number} maxLength Max Length
 */
DOSM.UI.CreateInputWithPrefix = function (id, prefixId, prefix, maxLength) {
    var div = $("<div>", { class: "input-group" });
    var divPrefix = $("<div>", { class: "input-group-prepend" });
    var span = DOSM.UI.CreateSpan(prefixId, prefix, null, "input-group-text");
    var input = DOSM.UI.CreateInput(id, maxLength);

    divPrefix.append(span);
    div.append(divPrefix);
    div.append(input);
    return div;
}

/**
 * Create a dropdown (without search and without sub text)
 * @param {string} id Id
 */
DOSM.UI.CreateSimpleDropdown = function (id) {
    return $("<select>", { id: id, class: "selectpicker", "data-width": "fit", "data-dropup-auto": "false" });
}

/**
 * Create a dropdown
 * @param {string} id Id
 * @param {boolean} multiSelect If the dropdown allows multi selection
 * @param {boolean} actionBox if action buttons (Select All, Deselect All) should be visible
 */
DOSM.UI.CreateDropdown = function (id, multiSelect, actionBox) {
    var selectProperties = { id: id, class: "selectpicker", "data-live-search": "true", "data-width": "fit", "data-show-subtext": "true", "data-dropup-auto": "false" };
    if (multiSelect == true) {
        selectProperties["multiple"] = "multiple";
        selectProperties["data-selected-text-format"] = "count > 0";
        if (actionBox == true) { selectProperties["data-actions-box"] = "true"; }
    }
    return $("<select>", selectProperties);
}
// #endregion
// #endregion  
 
﻿// #region DOSM.Xrm
// #region Main Methods
/**
 * Get Main Xrm Object
 */
DOSM.Xrm.GetXrmObject = function () {
    return parent.Xrm;
}

/**
 * If Main Xrm Object is found returns true, otherwise returns false
 */
DOSM.Xrm.IsDemoMode = function () {
    return typeof DOSM.Xrm.GetXrmObject() === "undefined";
}

/**
 * Get Client Url from Xrm Object
 */
DOSM.Xrm.GetClientUrl = function () {
    return DOSM.Xrm.GetXrmObject().Utility.getGlobalContext().getClientUrl();
}
// #endregion

// #region Create Methods
/**
 * Create a Record
 * @param {string} entitySetName Entity Set Name
 * @param {any} data Data to process
 */
DOSM.Xrm.CreateRecord = function (entitySetName, data) {
    if (DOSM.Xrm.IsDemoMode()) {
        var fakeXHR = {};
        fakeXHR.getResponseHeader = function (_fakeString) { return "https://democall/api/data/v9.0/" + entitySetName + "(" + DOSM.Utilities.GenerateGuid() + ")"; }
        return $.when("", "", fakeXHR);
    } else {
        return $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            async: true,
            data: JSON.stringify(data),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("OData-MaxVersion", "4.0");
                xhr.setRequestHeader("OData-Version", "4.0");
                xhr.setRequestHeader("Accept", "application/json");
            },
            url: DOSM.Xrm.GetClientUrl() + "/api/data/v9.0/" + entitySetName
        });
    }
}
// #endregion

// #region Retrieve Methods
/**
 * Retrieve a Record
 * @param {string} entitySetName Entity Set Name
 * @param {string} entityId Entity Id
 * @param {string} filters Filters
 */
DOSM.Xrm.RetrieveRecord = function (entitySetName, entityId, filters) {
    if (DOSM.Xrm.IsDemoMode()) {
        return $.when(DOSM.Xrm.GetDemoData(entitySetName, entityId, true));
    } else {
        return $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            async: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("OData-MaxVersion", "4.0");
                xhr.setRequestHeader("OData-Version", "4.0");
                xhr.setRequestHeader("Accept", "application/json");
            },
            url: encodeURI(DOSM.Xrm.GetClientUrl() + "/api/data/v9.0/" + entitySetName + "(" + entityId + ")?" + filters)
        });
    }
}

/**
 * Retrieve Multiple Records
 * @param {string} entitySetName Entity Set Name
 * @param {string} filters Filters
 * @param {boolean} isFetchXml If filters contains a FetchXml query
 */
DOSM.Xrm.Retrieve = function (entitySetName, filters, isFetchXml) {
    if (DOSM.Xrm.IsDemoMode()) {
        return $.when(DOSM.Xrm.GetDemoData(entitySetName, filters));
    } else {
        var retrieveUrl = "";
        if (isFetchXml == true) {
            retrieveUrl = DOSM.Xrm.GetClientUrl() + "/api/data/v9.0/" + entitySetName + "?" + "fetchXml=" + encodeURIComponent(filters).replace(/'/g, "%27");
        } else {
            retrieveUrl = encodeURI(DOSM.Xrm.GetClientUrl() + "/api/data/v9.0/" + entitySetName + "?" + filters);
        }
        return $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            async: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("OData-MaxVersion", "4.0");
                xhr.setRequestHeader("OData-Version", "4.0");
                xhr.setRequestHeader("Accept", "application/json");
                xhr.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            },
            url: retrieveUrl
        });
    }
}

/**
 * Retrieve Multiple Records with FetchXml
 * @param {string} entitySetName Entity Set Name
 * @param {string} fetchXml FetchXml Query
 */
DOSM.Xrm.RetrieveFetchXml = function (entitySetName, fetchXml) {
    return DOSM.Xrm.Retrieve(entitySetName, fetchXml, true);
}

/**
 * Retrieve Multiple Records with FetchXml using Batch operation
 * @param {string} entitySetName Entity Set Name
 * @param {string} fetchXml FetchXml Query
 */
DOSM.Xrm.RetrieveFetchXmlBatch = function (entitySetName, fetchXml) {
    var fetchXmlQuery = {};
    fetchXmlQuery.EntitySetName = entitySetName;
    fetchXmlQuery.Filters = "fetchXml=" + encodeURIComponent(fetchXml).replace(/'/g, "%27");
    return DOSM.Xrm.RetrieveBatch([fetchXmlQuery]);
}

/**
 * Retrieve Multiple Records with multiple Queries using Batch operation
 * @param {any[]} queries Queries
 */
DOSM.Xrm.RetrieveBatch = function (queries) {
    if (DOSM.Xrm.IsDemoMode()) {
        return $.when(DOSM.Xrm.GetDemoData(queries[0].EntitySetName, queries[0].Filters));
    } else {
        var batchDescription = "batch_" + DOSM.Utilities.GenerateGuid();
        var data = [];
        queries.forEach(function (query) {
            var retrieveUrl = DOSM.Xrm.GetClientUrl() + "/api/data/v9.0/" + query.EntitySetName + "?" + query.Filters;
            data.push("--" + batchDescription);
            data.push("Content-Type: application/http");
            data.push("Content-Transfer-Encoding: binary");
            data.push("");
            data.push("GET " + retrieveUrl + " HTTP/1.1");
            data.push("Content-Type: application/json");
            data.push("OData-Version: 4.0");
            data.push("OData-MaxVersion: 4.0");
            data.push("Prefer: odata.include-annotations=\"*\"");
            data.push("");
        });
        data.push("--" + batchDescription + "--");
        var payload = data.join("\r\n");

        return $.ajax({
            method: "POST",
            data: payload,
            async: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Content-Type", "multipart/mixed;boundary=" + batchDescription);
                xhr.setRequestHeader("OData-MaxVersion", "4.0");
                xhr.setRequestHeader("OData-Version", "4.0");
                xhr.setRequestHeader("Accept", "application/json");
            },
            url: DOSM.Xrm.GetClientUrl() + "/api/data/v9.0/$batch"
        });
    }
}

/**
 * Retrieve Dependent Components
 * @param {string} objectId Main Object Id
 * @param {number} componentType Component Type
 */
DOSM.Xrm.RetrieveDependentComponents = function (objectId, componentType) {
    if (DOSM.Xrm.IsDemoMode()) {
        return $.when(DOSM.Xrm.GetDemoData("RetrieveDependentComponents", ""));
    } else {
        return $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            async: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("OData-MaxVersion", "4.0");
                xhr.setRequestHeader("OData-Version", "4.0");
                xhr.setRequestHeader("Accept", "application/json");
            },
            url: DOSM.Xrm.GetClientUrl() + "/api/data/v9.0/RetrieveDependentComponents(ObjectId=@ObjectId,ComponentType=@ComponentType)?@ObjectId=" + objectId + "&@ComponentType=" + componentType
        });
    }
}
// #endregion

// #region Update Methods
/**
 * Update a single Record
 * @param {string} entitySetName Entity Set Name
 * @param {string} entityId Entity Id
 * @param {any} data Data to process
 */
DOSM.Xrm.UpdateRecord = function (entitySetName, entityId, data) {
    if (DOSM.Xrm.IsDemoMode()) {
        return $.when();
    } else {
        return $.ajax({
            type: "PATCH",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            async: true,
            data: JSON.stringify(data),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("OData-MaxVersion", "4.0");
                xhr.setRequestHeader("OData-Version", "4.0");
                xhr.setRequestHeader("Accept", "application/json");
            },
            url: DOSM.Xrm.GetClientUrl() + "/api/data/v9.0/" + entitySetName + "(" + entityId + ")"
        });
    }
}

/**
 * Update Multiple Records using Batch operation
 * @param {any[]} records Records to process
 */
DOSM.Xrm.UpdateBatch = function (records) {
    if (DOSM.Xrm.IsDemoMode()) {
        return $.when();
    } else {
        if (records.length == 0) { return $.when(); } // no records to update, we don't execute and return as done
        var batchDescription = "batch_" + DOSM.Utilities.GenerateGuid();
        var changesetDescription = "changeset_" + DOSM.Utilities.GenerateGuid();

        var data = [];
        data.push("--" + batchDescription);
        data.push("Content-Type: multipart/mixed;boundary=" + changesetDescription);
        data.push("");
        records.forEach(function (record, index) {
            data.push("--" + changesetDescription);
            data.push("Content-Type: application/http");
            data.push("Content-Transfer-Encoding: binary");
            data.push("Content-ID: " + (index + 1));
            data.push("");
            data.push("PATCH " + DOSM.Xrm.GetClientUrl() + "/api/data/v9.0/" + record.EntitySetName + "(" + record.Id + ") HTTP/1.1");
            data.push("Content-Type: application/json;type=entry");
            data.push("");
            data.push(JSON.stringify(record.Data));
        });
        data.push("--" + changesetDescription + "--");
        data.push("--" + batchDescription + "--");
        var payload = data.join("\r\n");

        return $.ajax({
            method: "POST",
            data: payload,
            async: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Content-Type", "multipart/mixed;boundary=" + batchDescription);
                xhr.setRequestHeader("OData-MaxVersion", "4.0");
                xhr.setRequestHeader("OData-Version", "4.0");
                xhr.setRequestHeader("Accept", "application/json");
            },
            url: DOSM.Xrm.GetClientUrl() + "/api/data/v9.0/$batch"
        });
    }
}
// #endregion

// #region Delete Methods
/**
 * Delete a single Record
 * @param {string} entitySetName Entity Set Name
 * @param {string} entityId Entity Id
 */
DOSM.Xrm.DeleteRecord = function (entitySetName, entityId) {
    if (DOSM.Xrm.IsDemoMode()) {
        return $.when();
    } else {
        return $.ajax({
            type: "DELETE",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            async: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("OData-MaxVersion", "4.0");
                xhr.setRequestHeader("OData-Version", "4.0");
                xhr.setRequestHeader("Accept", "application/json");
            },
            url: DOSM.Xrm.GetClientUrl() + "/api/data/v9.0/" + entitySetName + "(" + entityId + ")"
        });
    }
}
// #endregion

// #region Execute Methods
/**
 * Add a Component to a Solution
 * @param {any} solutionComponent Solution Component to process
 */
DOSM.Xrm.AddSolutionComponent = function (solutionComponent) {
    if (DOSM.Xrm.IsDemoMode()) {
        return $.when();
    } else {
        return $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            async: true,
            data: JSON.stringify(solutionComponent),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("OData-MaxVersion", "4.0");
                xhr.setRequestHeader("OData-Version", "4.0");
                xhr.setRequestHeader("Accept", "application/json");
            },
            url: DOSM.Xrm.GetClientUrl() + "/api/data/v9.0/AddSolutionComponent"
        });
    }
}

/**
 *  Publish Xml
 * @param {string} parameterXml Xml to process
 */
DOSM.Xrm.PublishXml = function (parameterXml) {
    if (DOSM.Xrm.IsDemoMode()) {
        return $.when();
    } else {
        var publishXml = {};
        publishXml.ParameterXml = parameterXml;

        return $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            async: true,
            data: JSON.stringify(publishXml),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("OData-MaxVersion", "4.0");
                xhr.setRequestHeader("OData-Version", "4.0");
                xhr.setRequestHeader("Accept", "application/json");
            },
            url: DOSM.Xrm.GetClientUrl() + "/api/data/v9.0/PublishXml"
        });
    }
}
// #endregion
// #endregion  
 
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
        if (record["DisplayName"] != null && record["DisplayName"]["UserLocalizedLabel"] != null) { name = record["DisplayName"]["UserLocalizedLabel"]["Label"]; }
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
 
// #region DOSM.Common.Xml
/**
 * Add a configuration inside Form Xml
 * @param {string} configurationPath Configuration Path
 * @param {any[]} parsedContent Parsed JSON Content
 * @param {string} formXml Form Xml
 */
DOSM.Common.AddConfigurationToXml = function (configurationPath, parsedContent, formXml) {
    // generate required Guids
    var maxGuids = parsedContent.length * 10;
    var randomGuids = [];
    do {
        var currentGuid = DOSM.Utilities.GenerateGuid(true);
        if (randomGuids.indexOf(currentGuid) == -1 && formXml.toLowerCase().indexOf(currentGuid) == -1) { randomGuids.push(currentGuid); }
    }
    while (randomGuids.length < maxGuids);

    // parse formxml
    var parsedXml = $($.parseXML(formXml));

    // add missing pieces
    if (parsedXml.find("form > formLibraries").length == 0) { parsedXml.find("form").append("<formLibraries></formLibraries>"); }
    if (parsedXml.find("form > events").length == 0) { parsedXml.find("form").append("<events></events>"); }

    // add uniqueid to controls involved if they are missing it
    parsedContent.forEach(function (dependency) {
        parsedXml.find("control").each(function () {
            if (this.hasAttribute("datafieldname") && this.attributes["datafieldname"].value == dependency.parent) {
                if (this.hasAttribute("uniqueid") == false) { $(this).attr("uniqueid", randomGuids.pop()); }
            }
        });
    });

    var foundOnLoadEvent = false;
    parsedXml.find("form > events").find("event").each(function () {
        if (this.hasAttribute("name") && this.attributes["name"].value == "onload") {
            foundOnLoadEvent = true;
            if ($(this).find("Handlers").length == 0) {
                $(this).append("<Handlers></Handlers>");
            }
            return false;
        }
    });
    // add onload event if not found inside xml
    if (foundOnLoadEvent == false) { parsedXml.find("form > events").append('<event name="onload" application="false" active="false"><Handlers></Handlers></event>'); }

    parsedContent.forEach(function (dependency) {
        foundOnChangeEvent = false;
        parsedXml.find("form > events").find("event").each(function () {
            if (this.hasAttribute("name") && this.attributes["name"].value == "onchange" &&
                this.hasAttribute("attribute") && this.attributes["attribute"].value == dependency.parent) {
                foundOnChangeEvent = true;
                if ($(this).find("Handlers").length == 0) {
                    $(this).append("<Handlers></Handlers>");
                }
            }
        });
        if (foundOnChangeEvent == false) { parsedXml.find("form > events").append('<event name="onchange" application="false" active="false" attribute="' + dependency.parent + '"><Handlers></Handlers></event>'); }
    });

    // add library
    parsedXml.find("form > formLibraries").append('<Library name="' + DOSM.Settings.NewLibraryName + '" libraryUniqueId="' + randomGuids.pop() + '"/>');

    // add onload event
    parsedXml.find("form > events").find("event").each(function () {
        if (this.hasAttribute("name") && this.attributes["name"].value == "onload") {
            var handlers = $(this).find("Handlers");

            $(handlers[0]).append('<Handler functionName="' + DOSM.Settings.NewInitFunctionName +
                '" libraryName="' + DOSM.Settings.NewLibraryName +
                '" handlerUniqueId="' + randomGuids.pop() +
                '" enabled="true" parameters="&quot;' + configurationPath + '&quot;" passExecutionContext="' +
                DOSM.Settings.NewPassExecutionContext + '" />');
        }
    });

    // add onchange events
    parsedContent.forEach(function (dependency) {
        parsedXml.find("form > events").find("event").each(function () {
            if (this.hasAttribute("name") && this.attributes["name"].value == "onchange" &&
                this.hasAttribute("attribute") && this.attributes["attribute"].value == dependency.parent) {

                var handlers = $(this).find("Handlers");
                $(handlers[0]).append('<Handler functionName="' + DOSM.Settings.NewFilterFunctionName +
                    '" libraryName="' + DOSM.Settings.NewLibraryName +
                    '" handlerUniqueId="' + randomGuids.pop() +
                    '" enabled="true" parameters="&quot;' + dependency.parent + '&quot;, &quot;' + dependency.child + '&quot;" passExecutionContext="' +
                    DOSM.Settings.NewPassExecutionContext + '" />');
            }
        });
    });

    var addedFormXml = (new XMLSerializer()).serializeToString(parsedXml.get(0));
    return addedFormXml;
}

/**
 * Remove a configuration inside Form Xml
 * @param {string} formXml
 */
DOSM.Common.RemoveConfigurationFromXml = function (formXml) {
    var parsedXml = $($.parseXML(formXml));

    // remove the functions
    parsedXml.find("form > events").find("Handler").each(function () {
        if (this.hasAttribute("functionName") && this.hasAttribute("libraryName") && this.attributes["libraryName"].value == DOSM.Settings.NewLibraryName) {
            if (this.attributes["functionName"].value == DOSM.Settings.NewInitFunctionName ||
                this.attributes["functionName"].value == DOSM.Settings.NewFilterFunctionName) {
                $(this).remove();
            }
        }
    });

    // remove the library
    parsedXml.find("form > formLibraries").find("Library").each(function () {
        if (this.hasAttribute("name") && this.attributes["name"].value == DOSM.Settings.NewLibraryName) {
            $(this).remove();
        }
    });

    // remove formLibraries if there aren't Library entries
    if (parsedXml.find("form > formLibraries").find("Library").length == 0) { parsedXml.find("form > formLibraries").remove(); }

    // remove Handlers if there aren't Handler entries
    parsedXml.find("form > events").find("event").each(function () {
        if ($(this).find("Handlers").children().length == 0) { $(this).find("Handlers").remove(); }
    });

    // remove event if there aren't children
    parsedXml.find("form > events").find("event").each(function () { if ($(this).children().length == 0) { $(this).remove(); } });
    // remove events if there aren't event entries
    if (parsedXml.find("form > events").find("event").length == 0) { parsedXml.find("form > events").remove(); }

    var removedFormXml = (new XMLSerializer()).serializeToString(parsedXml.get(0));
    return removedFormXml;
}

/**
 * Upgrade a configuration inside Form Xml
 * @param {string} formXml
 */
DOSM.Common.UpgradeConfigurationXml = function (formXml) {
    var parsedXml = $($.parseXML(formXml));
    // find the previous library and change it with the new one
    parsedXml.find("form > formLibraries").find("Library").each(function () {
        if (this.hasAttribute("name") && this.attributes["name"].value == DOSM.Settings.PreviousLibraryName) {
            this.attributes["name"].value = DOSM.Settings.NewLibraryName;
        }
    });

    // find previous events and update function name, library and execution context
    parsedXml.find("form > events").find("Handler").each(function () {
        var updateLibraryAndExecutionContext = false;

        if (this.hasAttribute("functionName") && this.attributes["functionName"].value == DOSM.Settings.PreviousInitFunctionName) {
            this.attributes["functionName"].value = DOSM.Settings.NewInitFunctionName;
            updateLibraryAndExecutionContext = true;
        }

        if (this.hasAttribute("functionName") && this.attributes["functionName"].value == DOSM.Settings.PreviousFilterFunctionName) {
            this.attributes["functionName"].value = DOSM.Settings.NewFilterFunctionName;
            updateLibraryAndExecutionContext = true;
        }

        if (updateLibraryAndExecutionContext == true) {
            if (this.hasAttribute("libraryName")) { this.attributes["libraryName"].value = DOSM.Settings.NewLibraryName; }
            if (this.hasAttribute("passExecutionContext")) { this.attributes["passExecutionContext"].value = DOSM.Settings.NewPassExecutionContext; }
        }
    });
    var upgradedFormXml = (new XMLSerializer()).serializeToString(parsedXml.get(0));
    return upgradedFormXml;
}

/**
 * Get Fields inside Form Xml
 * @param {string} formXml
 */
DOSM.Common.GetFieldsFromXml = function (formXml) {
    // parse formxml
    var fields = [];
    var parsedXml = $($.parseXML(formXml));
    parsedXml.find("control").each(function () {
        if (this.hasAttribute("datafieldname") && DOSM.Utilities.HasValue(this.attributes["datafieldname"].value) && fields.indexOf(this.attributes["datafieldname"].value) == -1) {
            fields.push(this.attributes["datafieldname"].value);
        }
    });
    return fields;
}
// #endregion  
 
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
            if (record["DisplayName"] != null && record["DisplayName"]["UserLocalizedLabel"] != null) { fieldDisplayName = record["DisplayName"]["UserLocalizedLabel"]["Label"]; }

            var field = new DOSM.Models.OptionSet(fieldLogicalName, fieldDisplayName, multiSelect);
            record.OptionSet.Options.forEach(function (option) {
                var optionValue = option.Value.toString();
                var optionName = option.Label.UserLocalizedLabel.Label;
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
                            DOSM.UI.Show("Show Configuration", "Web Resource <b>" + DOSM.Settings.NewLibraryName + "</b> not used, no Configurations to show.");
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
 
// #region DOSM.Logic.CopyConfiguration
/**
 * Add configuration defined inside the Web Resource to the passed Forms
 * @param {DOSM.Models.WebResource} webResource Web Resource
 * @param {DOSM.Models.Forms[]} forms Forms
 */
DOSM.Logic.CopyConfiguration.AddConfigurationToForms = function (webResource, forms) {
    if (forms.length == 0) {
        DOSM.UI.ShowError("Copy Configuration Error", "No selected Forms", "large");
    } else {
        var foundEntities = DOSM.Utilities.GetArrayFromProperty(forms, "EntityLogicalName");
        if (foundEntities.length == 0) { DOSM.UI.ShowError("Copy Configuration Error", "No Entities found for selected Forms", "large"); }
        if (foundEntities.length > 1) { DOSM.UI.ShowError("Copy Configuration Error", "Multiple Entities found for selected Forms", "large"); }
        if (foundEntities.length == 1) {
            var targetEntities = [];
            targetEntities.push(new DOSM.Models.Entity(forms[0].EntityLogicalName, forms[0].EntityName));
            DOSM.Common.RetrieveEntityFields(foundEntities)
                .done(function (data) {
                    targetEntities = DOSM.Common.SetOptionSetsInsideEntities(data, targetEntities);
                    var errorMessagesCheck = DOSM.Common.CheckWebResourceErrors(webResource.Content, targetEntities, forms);
                    // no errors on dependency
                    if (errorMessagesCheck.length == 0) {
                        var parsedContent = JSON.parse(webResource.Content);
                        var formsToUpdate = [];
                        forms.forEach(function (form) {
                            var removedFormXml = DOSM.Common.RemoveConfigurationFromXml(form.FormXml);
                            var addedFormXml = DOSM.Common.AddConfigurationToXml(webResource.Path, parsedContent, removedFormXml);
                            formsToUpdate.push({ id: form.Id, formxml: addedFormXml });
                        });
                        DOSM.Common.UpdateForms(formsToUpdate)
                            .done(function () {
                                DOSM.Common.PublishEntities(foundEntities)
                                    .done(function () {
                                        DOSM.UI.SetEmpty("div_content");
                                        DOSM.UI.Show("Copy Configuration To Forms", "Configuration has been copied to the selected Forms");
                                    })
                                    .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.PublishEntities Error", DOSM.Common.GetErrorMessage(xhr)); });
                            })
                            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.UpdateForms Error", DOSM.Common.GetErrorMessage(xhr)); });
                    } else {
                        var errorsList = "<ul>";
                        errorMessagesCheck.forEach(function (errorMessage) { errorsList += "<li>" + errorMessage + "</li>"; });
                        errorsList += "</ul>";
                        DOSM.UI.ShowError("Copy Configuration Error", "Errors: <br />" + errorsList, "large");
                    }
                })
                .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveEntityFields Error", DOSM.Common.GetErrorMessage(xhr)); });
        }
    }
}

/*
 * Copy Configuration Process
 */
DOSM.Logic.CopyConfiguration.Process = function () {
    var selectedFormIds = $("#cbx_targetform").val();
    if (selectedFormIds.length == 0) { DOSM.UI.ShowError("Copy Configuration Error", "No Forms selected."); return; }

    var failedData = false;
    var selectedForms = [];
    for (var count = 0; count < selectedFormIds.length; count++) {
        var currentForm = DOSM.Utilities.GetRecordById(DOSM.Metadata.FilteredTargetForms.Records, selectedFormIds[count]);
        if (!DOSM.Utilities.HasValue(currentForm)) { failedData = true; break; }
        selectedForms.push(currentForm);
    }
    if (failedData == true || !DOSM.Utilities.HasValue(DOSM.Metadata.CurrentWebResource)) { DOSM.UI.ShowError("Copy Configuration Error", "Error retrieving required data."); return; }

    DOSM.UI.ShowLoading("Copying Configuration to selected Forms...<br /><b>This is a long-running operation, please wait for the confirmation message</b>", "large");
    setTimeout(function () {
        DOSM.Logic.CopyConfiguration.AddConfigurationToForms(DOSM.Metadata.CurrentWebResource, selectedForms);
    }, DOSM.Settings.TimeoutDelay);
}

/*
 * Copy Configuration Confirm
 */
DOSM.Logic.CopyConfiguration.Confirm = function () {
    var selectedFormIds = $("#cbx_targetform").val();
    if (selectedFormIds.length == 0) { DOSM.UI.ShowError("Copy Configuration Error", "No Forms selected."); return; }

    var failedData = false;
    var detailForms = "<br />";
    var detailGroup = "";
    for (var count = 0; count < selectedFormIds.length; count++) {
        var currentForm = DOSM.Utilities.GetRecordById(DOSM.Metadata.FilteredTargetForms.Records, selectedFormIds[count]);
        if (!DOSM.Utilities.HasValue(currentForm)) { failedData = true; break; }
        var currentGroup = "Entity: " + currentForm.EntityName + " (" + currentForm.EntityLogicalName + ")";
        if (currentGroup != detailGroup) {
            detailForms += currentGroup + "<ul>";
            detailGroup = currentGroup;
        }
        var formName = "<b>" + currentForm.Name + " (" + currentForm.FormType + ")</b>";
        detailForms += "<li>" + formName + "</li>";
    }
    detailForms += "</ul>";
    if (failedData == true || !DOSM.Utilities.HasValue(DOSM.Metadata.CurrentWebResource)) { DOSM.UI.ShowError("Copy Configuration Error", "Error retrieving required data."); return; }

    var webResourceTitle = DOSM.Metadata.CurrentWebResource.Name + " (" + DOSM.Metadata.CurrentWebResource.Path + ")";

    DOSM.UI.ShowQuestion("Copy Configuration to Forms",
        "The Configuration <b>" + webResourceTitle + "</b><br />will be copied to the following Forms:" + detailForms +
        "A check to verify if the required Fields are present inside the selected Forms will be performed.<br /><br />" +
        "<b>Continue?</b>", "large",
        function () { DOSM.Logic.CopyConfiguration.Process(); });
}

/**
 * Bind Entity
 * @param {string} entityElementId Entity Element Id
 * @param {string} formElementId Form Element Id
 * @param {string[]} formIdsToExclude Form Ids to exclude
 */
DOSM.Logic.CopyConfiguration.BindEntity = function (entityElementId, formElementId, formIdsToExclude) {
    $("#" + entityElementId).on("change", function (e) {
        var entityLogicalName = $(this).val();
        $("#" + formElementId).val(null).change();
        DOSM.UI.ShowLoading("Retrieving Forms...");
        setTimeout(function () {
            DOSM.Common.RetrieveFormsByEntityLogicalName(entityLogicalName)
                .done(function (data) {
                    var forms = DOSM.Common.MapForms(data, "Name", null, null, formIdsToExclude);
                    DOSM.Metadata.FilteredTargetForms = new DOSM.Models.Records(forms);
                    DOSM.UI.FillDropdown(formElementId, "Select Forms", DOSM.Metadata.FilteredTargetForms.ToDropdown(), false, false, true);
                    DOSM.UI.HideLoading();
                })
                .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveFormsByEntityLogicalName Error", DOSM.Common.GetErrorMessage(xhr)); });
        }, DOSM.Settings.TimeoutDelay);

    });
}

/**
 * Bind Form
 * @param {string} formElementId Form Element Id
 */
DOSM.Logic.CopyConfiguration.BindForm = function (formElementId) {
    $("#" + formElementId).on("change", function (e) {
        // empty the other area for selection
        DOSM.UI.SetEmpty("div_space");
        var selectedForm = DOSM.Utilities.GetRecordById(DOSM.Metadata.SourceForms.Records, $("#" + formElementId).val());
        if (!DOSM.Utilities.HasValue(selectedForm)) { return; }

        var selectedWebResource = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.ConfiguredWebResources.Records, "Path", selectedForm.ConfigurationPath);
        var selectedEntity = DOSM.Utilities.GetRecordById(DOSM.Metadata.ConfiguredEntities.Records, selectedForm.EntityLogicalName);

        if (!DOSM.Utilities.HasValue(selectedWebResource) || !DOSM.Utilities.HasValue(selectedEntity)) { DOSM.UI.ShowError("Copy Configuration Error", "Error retrieving required data."); return; }

        DOSM.Metadata.CurrentEntity = selectedEntity; // for the Show Instructions button
        DOSM.Metadata.CurrentWebResource = selectedWebResource; // for the Confirm and Show Instructions buttons

        var entityTitle = selectedEntity.Name + " (" + selectedEntity.LogicalName + ")";
        var webResourceTitle = selectedWebResource.Name + " (" + selectedWebResource.Path + ")";

        var container = DOSM.UI.CreateSubContainer(webResourceTitle);
        DOSM.UI.Append("div_space", container);

        var errorMessages = DOSM.Common.CheckConfiguredWebResourceErrors(selectedWebResource.Path, selectedWebResource.Content, [selectedEntity], [selectedForm])

        if (errorMessages.length == 0) {
            // create Target Entity dropdown
            container.append(DOSM.UI.CreateSpan("span_targetentity", "Target Entity"));
            container.append(DOSM.UI.CreateDropdown("cbx_targetentity"));

            // create Target Form dropdown
            container.append(DOSM.UI.CreateSpan("span_targetform", "Target Forms"));
            container.append(DOSM.UI.CreateDropdown("cbx_targetform", true, true));
            container.append(DOSM.UI.CreateSpacer());

            // fill and reset dropdowns
            DOSM.UI.FillDropdown("cbx_targetentity", "Select Entity", DOSM.Metadata.Entities.ToDropdown());
            DOSM.UI.ResetDropdown("cbx_targetform", "Select an Entity first");

            // add buttons
            container.append(DOSM.UI.CreateButton("btn_copyconfiguration_confirm", "Copy", DOSM.Logic.CopyConfiguration.Confirm, "btn-danger"));
            container.append(DOSM.UI.CreateButton("btn_copyconfiguration_showjson", "Show JSON", DOSM.Logic.CopyConfiguration.ShowJson));
            container.append(DOSM.UI.CreateButton("btn_copyconfiguration_showinstructions", "Manual Instructions", DOSM.Logic.CopyConfiguration.ShowInstructions));

            // set defaults
            $("#btn_copyconfiguration_confirm").prop("disabled", true);

            // set bindings
            DOSM.Common.BindButtonWithInputs("btn_copyconfiguration_confirm", ["cbx_targetform"]);
            var formIdsToExclude = DOSM.Utilities.GetArrayFromProperty(DOSM.Metadata.SourceForms.Records, "Id");
            DOSM.Logic.CopyConfiguration.BindEntity("cbx_targetentity", "cbx_targetform", formIdsToExclude);

            // select the entity that was selected in the upper one
            $("#cbx_targetentity").val(selectedEntity.LogicalName).change();

        } else {
            var errorList = "<ul>";
            errorMessages.forEach(function (errorMessage) { errorList += "<li>" + errorMessage + "</li>"; });
            errorList += "</ul>";

            DOSM.UI.ShowError("Copy Configuration Error", "The selected Configuration<br /><b>" +
                webResourceTitle + "</b><br />is not valid for the selected Form<br /><b>" +
                selectedForm.Name + " (" + selectedForm.FormType + ") - Entity: " + entityTitle + "</b><br /><br />" +
                "Errors: <br />" + errorList +
                "Please update or remove it from this Form", "large");
        }
    });
}

/*
 * Copy Configuration Show JSON
 */
DOSM.Logic.CopyConfiguration.ShowJson = function () {
    if (DOSM.Utilities.HasValue(DOSM.Metadata.CurrentWebResource)) { DOSM.Common.ShowJson(DOSM.Metadata.CurrentWebResource.Content, DOSM.Metadata.CurrentWebResource.Path); }
    else { DOSM.UI.ShowError("JSON Web Resource Error", "JSON Web Resource not found."); }
}

/**
 * Copy Configuration Show Instructions
 */
DOSM.Logic.CopyConfiguration.ShowInstructions = function () {
    if (!DOSM.Utilities.HasValue(DOSM.Metadata.CurrentWebResource)) { DOSM.UI.ShowError("JSON Web Resource Error", "JSON Web Resource not found."); return; }
    if (!DOSM.Utilities.HasValue(DOSM.Metadata.CurrentEntity)) { DOSM.UI.ShowError("Copy Configuration to Forms - Manual Instructions Error", "Error retrieving required data."); return; }
    try {
        var parsedContent = JSON.parse(DOSM.Metadata.CurrentWebResource.Content);
    }
    catch (e) { DOSM.UI.ShowError("JSON Web Resource Error", "Failed to parse JSON Web Resource"); return; }

    var instructionsMessage = "<u>For each Form</u> where you want to copy the configuration <b>" + DOSM.Metadata.CurrentWebResource.Path + "</b>:<br /><br />" +
        "<ol>" +
        "<li><u>If the Form has already a Configuration, remove it before proceeding</u></li><br />" +
        "<li>Add the library <b>" + DOSM.Settings.NewLibraryName + "</b></li><br />" +
        "<li>Under the Form OnLoad events list add a new event:<br /><br /><ul>" +
        "<li>set the library to <b>" + DOSM.Settings.NewLibraryName + "</b></li>" +
        "<li>set the function to <b>" + DOSM.Settings.NewInitFunctionName + "</b></li>" +
        "<li>check <i>Pass execution context</b> as first parameter</i></li>" +
        "<li>enter <b>&quot;" + DOSM.Metadata.CurrentWebResource.Path + "&quot;</b> (including quotation marks)<br />into the field <i>Comma separated list of parameters that will be passed to the function</i></li>" +
        "</ul><br />";

    var parseFailed = false;
    parsedContent.forEach(function (dependency) {
        var parentOption = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.CurrentEntity.OptionSets, "LogicalName", dependency.parent);
        if (!DOSM.Utilities.HasValue(parentOption)) { parseFailed = true; }
        var parentName = parentOption.DisplayName;

        instructionsMessage += "<li>Under the OnChange events list for the field <b>" + parentName + " (" + dependency.parent + ")</b> add a new event:<br /><br /><ul>" +
            "<li>set the library to <b>" + DOSM.Settings.NewLibraryName + "</b></li>" +
            "<li>set the function to <b>" + DOSM.Settings.NewFilterFunctionName + "</b></li>" +
            "<li>check <i>Pass execution context</b> as first parameter</i></li>" +
            "<li>enter <b>&quot;" + dependency.parent + "&quot;, &quot;" + dependency.child + "&quot;</b> (including quotation marks)<br />into the field <i>Comma separated list of parameters that will be passed to the function</i></li>" +
            "</ul><br />";
    });
    if (parseFailed == true) { DOSM.UI.ShowError("JSON Web Resource Error", "Failed to parse JSON Web Resource"); return; }
    instructionsMessage += "<li>Save and publish the Form</li></ol>";
    DOSM.UI.Show("Copy Configuration to Forms - Manual Instructions", instructionsMessage, "xl");
}

/**
 * Copy Configuration Start Function
 */
DOSM.Logic.CopyConfiguration.Start = function () {
    // Metadata used inside RemoveConfiguration
    // DOSM.Metadata.ConfiguredEntities
    // DOSM.Metadata.ConfiguredWebResources
    // DOSM.Metadata.CurrentEntity
    // DOSM.Metadata.CurrentWebResource
    // DOSM.Metadata.Entities
    // DOSM.Metadata.FilteredTargetForms
    // DOSM.Metadata.SourceForms

    // clear the DOSM.Metadata namespace
    DOSM.Metadata = {};

    // create container with title
    DOSM.UI.SetEmpty("div_content");
    var container = DOSM.UI.CreateWideContainer("Copy Configuration to Forms");
    DOSM.UI.Append("div_content", container);

    // create Form dropdown
    container.append(DOSM.UI.CreateSpan("span_sourceform", "Configured Forms"));
    container.append(DOSM.UI.CreateDropdown("cbx_sourceform"));
    container.append(DOSM.UI.CreateSpacer());

    // create additional container for the new selection
    container.append(DOSM.UI.CreateEmptyContainer("div_space"));

    // reset dropdown
    DOSM.UI.ResetDropdown("cbx_sourceform", "Forms");

    // check current solution
    DOSM.UI.ShowLoading("Checking Dependent Option Set Configurations...");
    setTimeout(function () {
        DOSM.Common.RetrieveEntities()
            .done(function (data) {
                var entities = DOSM.Common.MapEntities(data, "Name");
                DOSM.Metadata.Entities = new DOSM.Models.Records(entities);
                DOSM.Common.RetrieveWebResource(DOSM.Settings.NewLibraryId, "$select=name")
                    .done(function () {
                        DOSM.Common.RetrieveWebResourceDependentComponents(DOSM.Settings.NewLibraryId)
                            .done(function (data) {
                                var dependentFormIds = DOSM.Common.MapFormDependentComponents(data);
                                if (dependentFormIds.length == 0) {
                                    DOSM.UI.Show("Copy Configuration", "Web Resource <b>" + DOSM.Settings.NewLibraryName + "</b> not used, no configurations to copy.");
                                } else {
                                    DOSM.Common.RetrieveForms(dependentFormIds)
                                        .done(function (data) {
                                            var contextRegion = data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1);
                                            var context = JSON.parse(contextRegion);

                                            var forms = DOSM.Common.MapForms(context, "Name", DOSM.Settings.NewInitFunctionName, DOSM.Settings.NewLibraryName);
                                            var configurations = DOSM.Utilities.GetArrayFromProperty(forms, "ConfigurationPath");
                                            var foundEntities = DOSM.Utilities.GetArrayFromProperty(forms, "EntityLogicalName");
                                            DOSM.Metadata.SourceForms = new DOSM.Models.Records(forms);

                                            var configuredEntities = [];
                                            foundEntities.forEach(function (entity) {
                                                var foundEntity = DOSM.Utilities.GetRecordById(DOSM.Metadata.Entities.Records, entity);
                                                if (DOSM.Utilities.HasValue(foundEntity)) { configuredEntities.push(foundEntity); }
                                            });
                                            DOSM.Metadata.ConfiguredEntities = new DOSM.Models.Records(configuredEntities);

                                            DOSM.UI.FillDropdownWithGroups("cbx_sourceform", "Forms", DOSM.Metadata.SourceForms.ToDropdown());
                                            DOSM.Common.RetrieveWebResources(configurations)
                                                .done(function (data) {
                                                    var contextRegion = data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1);
                                                    var context = JSON.parse(contextRegion);

                                                    var configuredWebResources = DOSM.Common.MapWebResources(context);
                                                    DOSM.Metadata.ConfiguredWebResources = new DOSM.Models.Records(configuredWebResources);
                                                    // RetrieveEntityFields necessary to confirm that the form is configured correctly when selected
                                                    DOSM.Common.RetrieveEntityFields(foundEntities)
                                                        .done(function (data) {
                                                            DOSM.Metadata.ConfiguredEntities = new DOSM.Models.Records(DOSM.Common.SetOptionSetsInsideEntities(data, DOSM.Metadata.ConfiguredEntities.Records));

                                                            // set bindings
                                                            DOSM.Logic.CopyConfiguration.BindForm("cbx_sourceform");
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
            })
            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveEntities Error", DOSM.Common.GetErrorMessage(xhr)); });
    }, DOSM.Settings.TimeoutDelay);
}
// #endregion  
 
// #region DOSM.Logic.RemoveConfiguration
/*
 * Remove Configuration Show Process
 */
DOSM.Logic.RemoveConfiguration.Process = function () {
    var selectedFormIds = $("#cbx_form").val();
    if (selectedFormIds.length == 0) { DOSM.UI.ShowError("Remove Configuration Error", "No Forms selected."); return; }

    var failedData = false;
    var formsToUpdate = [];
    var entitiesToPublish = [];

    for (var count = 0; count < selectedFormIds.length; count++) {
        var currentForm = DOSM.Utilities.GetRecordById(DOSM.Metadata.Forms.Records, selectedFormIds[count]);
        if (!DOSM.Utilities.HasValue(currentForm)) { failedData = true; break; }
        var removedXml = DOSM.Common.RemoveConfigurationFromXml(currentForm.FormXml);
        formsToUpdate.push({ id: currentForm.Id, formxml: removedXml });
        if (entitiesToPublish.indexOf(currentForm.EntityLogicalName) == -1) { entitiesToPublish.push(currentForm.EntityLogicalName); };
    }
    if (failedData == true) { DOSM.UI.ShowError("Remove Configuration Error", "Error retrieving required data."); return; }

    DOSM.UI.ShowLoading("Removing Configuration from selected Forms...<br /><b>This is a long-running operation, please wait for the confirmation message</b>", "large");
    setTimeout(function () {
        DOSM.Common.UpdateForms(formsToUpdate)
            .done(function () {
                DOSM.Common.PublishEntities(entitiesToPublish)
                    .done(function () {
                        DOSM.UI.SetEmpty("div_content");
                        DOSM.UI.Show("Remove Configuration from Forms", "Configuration has been removed from the selected Forms.");
                    })
                    .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.PublishEntities Error", DOSM.Common.GetErrorMessage(xhr)); });
            })
            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.UpdateForms Error", DOSM.Common.GetErrorMessage(xhr)); });
    }, DOSM.Settings.TimeoutDelay);
}

/*
 * Remove Configuration Show Confirm
 */
DOSM.Logic.RemoveConfiguration.Confirm = function () {
    var selectedFormIds = $("#cbx_form").val();
    if (selectedFormIds.length == 0) { DOSM.UI.ShowError("Remove Configuration Error", "No Forms selected."); return; }

    var failedData = false;
    var detailForms = "<ul>";
    var detailGroup = "";
    for (var count = 0; count < selectedFormIds.length; count++) {
        var currentForm = DOSM.Utilities.GetRecordById(DOSM.Metadata.Forms.Records, selectedFormIds[count]);
        if (!DOSM.Utilities.HasValue(currentForm)) { failedData = true; break; }
        var currentGroup = "Entity: " + currentForm.EntityName + " (" + currentForm.EntityLogicalName + ")";
        if (currentGroup != detailGroup) {
            if (detailGroup != "") { detailForms += "</ul></li>"; }

            detailForms += "<li>" + currentGroup + "<ul>";
            detailGroup = currentGroup;

        }
        var formName = "<b>" + currentForm.Name + " (" + currentForm.FormType + ")</b>";
        if (DOSM.Utilities.HasValue(currentForm.ConfigurationPath)) { formName += " - Configuration: <b>" + currentForm.ConfigurationPath + "</b>"; }
        detailForms += "<li>" + formName + "</li>";
    }
    detailForms += "</ul></li></ul>";

    if (failedData == true) { DOSM.UI.ShowError("Remove Configuration Error", "Error retrieving required data."); return; }

    DOSM.UI.ShowQuestion("Remove Configuration from Forms",
        "The Dependent Option Set Configuration will be removed from the following Forms:" + detailForms + "<b>Continue?</b>", "large",
        function () { DOSM.Logic.RemoveConfiguration.Process(); });

}

/*
 * Remove Configuration Show Instructions
 */
DOSM.Logic.RemoveConfiguration.ShowInstructions = function () {
    var instructionsMessage = "<u>For each Form</u> that is using the library <b>" + DOSM.Settings.NewLibraryName + "</b>:<br /><br />" +
        "<ol>" +
        "<li><u>For each Parent Field</u> that is part of a Dependent Option Set Configuration find the OnChange event using <b>" + DOSM.Settings.NewFilterFunctionName + "</b> and remove it</li><br />" +
        "<li>Under the Form OnLoad events list find the event using <b>" + DOSM.Settings.NewInitFunctionName + "</b> and remove it</li><br />" +
        "<li>Remove the library <b>" + DOSM.Settings.NewLibraryName + "</b> (at this point it should not be used), save and publish the Form</li>" +
        "</ol>";

    DOSM.UI.Show("Remove Configuration from Forms - Manual Instructions", instructionsMessage, "xl");
}

/*
 * Remove Configuration Start Function
 */
DOSM.Logic.RemoveConfiguration.Start = function () {
    // Metadata used inside RemoveConfiguration
    // DOSM.Metadata.Forms

    // clear the DOSM.Metadata namespace
    DOSM.Metadata = {};

    // create container with title
    DOSM.UI.SetEmpty("div_content");
    var container = DOSM.UI.CreateWideContainer("Remove Configuration from Forms");
    DOSM.UI.Append("div_content", container);

    // create Form dropdown
    container.append(DOSM.UI.CreateSpan("span_form", "Configured Forms"));
    container.append(DOSM.UI.CreateDropdown("cbx_form", true, true));
    container.append(DOSM.UI.CreateSpacer());

    // reset dropdown
    DOSM.UI.ResetDropdown("cbx_form", "Forms");

    // create buttons
    container.append(DOSM.UI.CreateButton("btn_removeconfiguration_confirm", "Remove", DOSM.Logic.RemoveConfiguration.Confirm, "btn-danger"));
    container.append(DOSM.UI.CreateButton("btn_removeconfiguration_showinstructions", "Manual Instructions", DOSM.Logic.RemoveConfiguration.ShowInstructions));

    // set the button to default state
    $("#btn_removeconfiguration_confirm").prop("disabled", true);

    // check DOSM solution
    DOSM.UI.ShowLoading("Checking Dependent Option Set Configurations...");
    setTimeout(function () {
        DOSM.Common.RetrieveWebResource(DOSM.Settings.NewLibraryId, "$select=name")
            .done(function () {
                DOSM.Common.RetrieveWebResourceDependentComponents(DOSM.Settings.NewLibraryId)
                    .done(function (data) {
                        var dependentFormIds = DOSM.Common.MapFormDependentComponents(data);
                        if (dependentFormIds.length == 0) {
                            DOSM.UI.Show("Remove Configuration not necessary", "Dependent Option Set Manager Solution not used, Remove process is not necessary");
                        } else {
                            DOSM.Common.RetrieveForms(dependentFormIds)
                                .done(function (data) {
                                    var contextRegion = data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1);
                                    var context = JSON.parse(contextRegion);

                                    var forms = DOSM.Common.MapForms(context, "Name", DOSM.Settings.NewInitFunctionName, DOSM.Settings.NewLibraryName);
                                    DOSM.Metadata.Forms = new DOSM.Models.Records(forms);
                                    DOSM.UI.FillDropdownWithGroups("cbx_form", "Forms", DOSM.Metadata.Forms.ToDropdown());

                                    // define bindings
                                    DOSM.Common.BindButtonWithInputs("btn_removeconfiguration_confirm", ["cbx_form"]);

                                    // hide show loading
                                    DOSM.UI.HideLoading();
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
 
// #region DOSM.Logic.DeleteJSON
/**
 * Delete JSON Process
 */
DOSM.Logic.DeleteJSON.Process = function () {
    var webResourceId = $("#cbx_webresource").val();
    var selectedWebResource = DOSM.Utilities.GetRecordById(DOSM.Metadata.WebResources.Records, webResourceId);
    if (!DOSM.Utilities.HasValue(selectedWebResource)) { DOSM.UI.ShowError("JSON Web Resource Error", "JSON Web Resource not found."); return; }

    var webResourcePath = selectedWebResource.Path;
    var webResourceName = selectedWebResource.Name;

    DOSM.UI.ShowLoading("Deleting JSON Web Resource...");
    setTimeout(function () {
        DOSM.Common.RetrieveWebResource(DOSM.Settings.NewLibraryId, "$select=name")
            .done(function () {
                DOSM.Common.RetrieveWebResourceDependentComponents(DOSM.Settings.NewLibraryId)
                    .done(function (data) {
                        var dependentFormIds = DOSM.Common.MapFormDependentComponents(data);
                        DOSM.Common.RetrieveForms(dependentFormIds)
                            .done(function (data) {
                                var webResourceUsed = false;
                                if (dependentFormIds.length > 0) {
                                    var contextRegion = data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1);
                                    var context = JSON.parse(contextRegion);

                                    var libraryForms = DOSM.Common.MapForms(context, null, DOSM.Settings.NewInitFunctionName, DOSM.Settings.NewLibraryName);
                                    var configurations = DOSM.Utilities.GetArrayFromProperty(libraryForms, "ConfigurationPath");
                                    if (configurations.indexOf(webResourcePath) > -1) { webResourceUsed = true; }
                                }
                                if (webResourceUsed == true) {
                                    DOSM.UI.ShowError("Delete JSON Web Resource Error", "JSON Web Resource <b>" + webResourcePath + " (" + webResourceName + ")</b> is used inside a Configuration, it cannot be deleted.", "large");
                                }
                                else {
                                    DOSM.Common.DeleteWebResource(webResourceId)
                                        .done(function () {
                                            DOSM.UI.SetEmpty("div_content");
                                            DOSM.UI.Show("JSON Web Resource Deleted", "JSON Web Resource <b>" + webResourcePath + " (" + webResourceName + ")</b> has been deleted.", "large");
                                        })
                                        .fail(function (xhr) { DOSM.UI.ShowError("Delete JSON Web Resource Error", DOSM.Common.GetErrorMessage(xhr)); });
                                }
                            })
                            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveForms Error", DOSM.Common.GetErrorMessage(xhr)); });
                    })
                    .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveWebResourceDependentComponents Error", DOSM.Common.GetErrorMessage(xhr)); });
            })
            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveWebResource Error", DOSM.Common.GetErrorMessage(xhr)); });
    }, DOSM.Settings.TimeoutDelay);
}

/**
 *  Delete JSON Confirm
 */
DOSM.Logic.DeleteJSON.Confirm = function () {
    var selectedWebResource = DOSM.Utilities.GetRecordById(DOSM.Metadata.WebResources.Records, $("#cbx_webresource").val());
    if (!DOSM.Utilities.HasValue(selectedWebResource)) { DOSM.UI.ShowError("JSON Web Resource Error", "JSON Web Resource not found."); return; }

    DOSM.UI.ShowQuestion("Delete JSON Web Resource",
        "JSON Web Resource <b>" + selectedWebResource.Path + " (" + selectedWebResource.Name + ")</b> will be deleted.<br />" +
        "A check to verify that is not used in a Configuration will be performed.<br />" +
        "<b>Make sure the Web Resource is not used in other contexts before deleting it.</b>" +
        "<br /><br /><b>Continue?</b>", "large",
        function () { DOSM.Logic.DeleteJSON.Process(); });
}

/**
 * Bind Solution dropdown to Web Resource dropdown
 * @param {string} solutionElementId Solution Element Id
 * @param {string} webResourceElementId Web Resource Element Id
 */
DOSM.Logic.DeleteJSON.BindSolution = function (solutionElementId, webResourceElementId) {
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

/*
 * Delete JSON Show JSON
 */
DOSM.Logic.DeleteJSON.ShowJson = function () {
    var selectedWebResource = DOSM.Utilities.GetRecordById(DOSM.Metadata.WebResources.Records, $("#cbx_webresource").val());
    if (DOSM.Utilities.HasValue(selectedWebResource)) { DOSM.Common.ShowJson(selectedWebResource.Content, selectedWebResource.Path); }
    else { DOSM.UI.ShowError("JSON Web Resource Error", "JSON Web Resource not found."); }
}

/*
 * Delete Web Resource Show Instructions
 */
DOSM.Logic.DeleteJSON.ShowInstructions = function () {
    var instructionsMessage = "<ol>" +
        "<li>Make sure the Web Resource is not used inside a Dependent Option Set Configuration or other contexts</li><br />" +
        "<li>Select an Unmanaged Solution containing the Web Resource you want to delete</li><br />" +
        "<li>Select the Web Resource and delete it</li>" +
        "</ol>";
    DOSM.UI.Show("Delete JSON Web Resource - Manual Instructions", instructionsMessage, "large");
}

/*
 * Delete JSON Start Function
 */
DOSM.Logic.DeleteJSON.Start = function () {
    // Metadata used inside DeleteJSON
    // DOSM.Metadata.WebResources

    // clear the DOSM.Metadata namespace
    DOSM.Metadata = {};

    // create container with title
    DOSM.UI.SetEmpty("div_content");
    var container = DOSM.UI.CreateWideContainer("Delete JSON Web Resource");
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

    // create buttons
    container.append(DOSM.UI.CreateButton("btn_deletejson_confirm", "Delete", DOSM.Logic.DeleteJSON.Confirm, "btn-danger"));
    container.append(DOSM.UI.CreateButton("btn_deletejson_showjson", "Show JSON", DOSM.Logic.DeleteJSON.ShowJson));
    container.append(DOSM.UI.CreateButton("btn_deletejson_showinstructions", "Manual Instructions", DOSM.Logic.DeleteJSON.ShowInstructions));

    // set buttons to default state
    $("#btn_deletejson_confirm").prop("disabled", true);
    $("#btn_deletejson_showjson").prop("disabled", true);

    // retrieve solutions
    DOSM.UI.ShowLoading("Retrieving Solutions...");
    setTimeout(function () {
        DOSM.Common.RetrieveSolutions()
            .done(function (data) {
                var solutions = DOSM.Common.MapSolutions(data, "DisplayName");
                DOSM.UI.FillDropdown("cbx_solution", "Select a Solution", new DOSM.Models.Records(solutions).ToDropdown());

                // set bindings
                DOSM.Common.BindButtonWithInputs("btn_deletejson_confirm", ["cbx_webresource"]);
                DOSM.Common.BindButtonWithInputs("btn_deletejson_showjson", ["cbx_webresource"]);
                DOSM.Logic.DeleteJSON.BindSolution("cbx_solution", "cbx_webresource");

                // hide show loading
                DOSM.UI.HideLoading();
            })
            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveSolutions Error", DOSM.Common.GetErrorMessage(xhr)); });
    }, DOSM.Settings.TimeoutDelay);
}
// #endregion  
 
// #region DOSM.Logic.ShowFields
/**
 * Bind Entity dropdown to Entity Field, Entity Field Value, Form and Form Field dropdowns
 * Retrieve Fields and Forms of the selected Entity
 * @param {string} entityElementId  Entity Element Id (OnChange event)
 * @param {string} entityFieldElementId Entity Field Element Id
 * @param {string} entityFieldValueElementId Entity Field Value Element Id
 * @param {string} formElementId Form Element Id
 * @param {string} formFieldElementId Form Field Element Id
 */
DOSM.Logic.ShowFields.BindEntity = function (entityElementId, entityFieldElementId, entityFieldValueElementId, formElementId, formFieldElementId) {
    $("#" + entityElementId).on("change", function (e) {
        // reset the dropdowns
        DOSM.UI.ResetDropdown(entityFieldElementId, "Select an Entity first");
        DOSM.UI.ResetDropdown(entityFieldValueElementId, "Select an Entity Field first");
        DOSM.UI.ResetDropdown(formElementId, "Select an Entity first");
        DOSM.UI.ResetDropdown(formFieldElementId, "Select a Form first");

        var entityLogicalName = $(this).val();
        var entity = DOSM.Utilities.GetRecordById(DOSM.Metadata.Entities.Records, entityLogicalName);
        if (DOSM.Utilities.HasValue(entity)) {
            DOSM.UI.ShowLoading("Retrieving Entity Fields and Forms...");
            setTimeout(function () {
                // retrieve the Entity Fields
                DOSM.Common.RetrieveEntityFields([entityLogicalName])
                    .done(function (data) {
                        // set the Entity Field dropdown                      
                        var updatedEntities = DOSM.Common.SetOptionSetsInsideEntities(data, [entity]);
                        DOSM.Metadata.CurrentEntityFields = new DOSM.Models.Records(updatedEntities[0].OptionSets);
                        DOSM.UI.FillDropdown(entityFieldElementId, "Select an Entity Field", DOSM.Metadata.CurrentEntityFields.ToDropdown());
                        // retrieve the Entity Forms
                        DOSM.Common.RetrieveFormsByEntityLogicalName(entityLogicalName)
                            .done(function (data) {
                                // set the Forms dropdown
                                var forms = DOSM.Common.MapForms(data, "Name");
                                DOSM.Metadata.CurrentForms = new DOSM.Models.Records(forms);
                                DOSM.UI.FillDropdown(formElementId, "Select a Form", DOSM.Metadata.CurrentForms.ToDropdown(), false, false, true);
                                DOSM.UI.HideLoading();
                            })
                            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveFormsByEntityLogicalName Error", DOSM.Common.GetErrorMessage(xhr)); });
                    })
                    .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveEntityFields Error", DOSM.Common.GetErrorMessage(xhr)); });
            }, DOSM.Settings.TimeoutDelay);
        }
    });
}

/**
 * Bind Entity Field dropdown to Entity Field Value dropdown
 * @param {string} entityFieldElementId Entity Field Element Id (OnChange event)
 * @param {string} entityFieldValueElementId Entity Field Value Element Id
 */
DOSM.Logic.ShowFields.BindEntityField = function (entityFieldElementId, entityFieldValueElementId) {
    $("#" + entityFieldElementId).on("change", function (e) {
        var entityField = DOSM.Utilities.GetRecordByProperty(DOSM.Metadata.CurrentEntityFields.Records, "LogicalName", $(this).val());
        if (DOSM.Utilities.HasValue(entityField)) {
            DOSM.UI.FillDropdown(entityFieldValueElementId, "Show Entity Field Values", new DOSM.Models.Records(entityField.Values).ToDropdown(), true);
        }
    });
}

/**
 * Bind Form dropdown to Form Field dropdown
 * @param {string} formElementId Form Element Id (OnChange event)
 * @param {string} formFieldElementId Form Field Element Id
 */
DOSM.Logic.ShowFields.BindForm = function (formElementId, formFieldElementId) {
    $("#" + formElementId).on("change", function (e) {
        var form = DOSM.Utilities.GetRecordById(DOSM.Metadata.CurrentForms.Records, $(this).val());
        if (DOSM.Utilities.HasValue(form)) {
            var formFields = DOSM.Common.GetFieldsFromXml(form.FormXml);
            var optionSetValues = [];
            formFields.forEach(function (formField) {
                DOSM.Metadata.CurrentEntityFields.Records.forEach(function (entityField) {
                    if (formField == entityField.LogicalName) { optionSetValues.push(entityField); }
                });
            });
            optionSetValues.sort(DOSM.Utilities.CustomSort("DisplayName"));
            DOSM.UI.FillDropdown(formFieldElementId, "Show Form Fields", new DOSM.Models.Records(optionSetValues).ToDropdown(), true);
        }
    });
}

/**
 * Show Fields Start Function
 */
DOSM.Logic.ShowFields.Start = function () {
    // Metadata used inside ShowFields
    // DOSM.Metadata.CurrentEntityFields
    // DOSM.Metadata.CurrentForms
    // DOSM.Metadata.Entities

    // clear the DOSM.Metadata namespace
    DOSM.Metadata = {};

    // create container with title
    DOSM.UI.SetEmpty("div_content");
    var container = DOSM.UI.CreateWideContainer("Show Entities and Forms Fields");
    DOSM.UI.Append("div_content", container);

    //create Entity dropdown
    container.append(DOSM.UI.CreateSpan("span_entity", "Entity"));
    container.append(DOSM.UI.CreateDropdown("cbx_entity"));
    container.append(DOSM.UI.CreateSpacer());

    // create Entity Fields and Entity Field Values dropdowns
    container.append(DOSM.UI.CreateSpan("span_entityfield", "Entity Field"));
    container.append(DOSM.UI.CreateDropdown("cbx_entityfield"));
    container.append(DOSM.UI.CreateSpan("span_entityfieldvalue", "Entity Field Values"));
    container.append(DOSM.UI.CreateDropdown("cbx_entityfieldvalue"));
    container.append(DOSM.UI.CreateSpacer());

    // create Forms and Form Fields dropdowns
    container.append(DOSM.UI.CreateSpan("span_form", "Form"));
    container.append(DOSM.UI.CreateDropdown("cbx_form"));
    container.append(DOSM.UI.CreateSpan("span_formfield", "Form Fields"));
    container.append(DOSM.UI.CreateDropdown("cbx_formfield"));

    // reset dropdowns
    DOSM.UI.ResetDropdown("cbx_entity", "Select an Entity");
    DOSM.UI.ResetDropdown("cbx_entityfield", "Select an Entity first");
    DOSM.UI.ResetDropdown("cbx_entityfieldvalue", "Select an Entity Field first");
    DOSM.UI.ResetDropdown("cbx_form", "Select an Entity first");
    DOSM.UI.ResetDropdown("cbx_formfield", "Select a Form first");

    // retrieve entities
    DOSM.UI.ShowLoading("Retrieving Entities...");
    setTimeout(function () {
        DOSM.Common.RetrieveEntities()
            .done(function (data) {
                var entities = DOSM.Common.MapEntities(data, "Name");
                DOSM.Metadata.Entities = new DOSM.Models.Records(entities);
                DOSM.UI.FillDropdown("cbx_entity", "Select an Entity", DOSM.Metadata.Entities.ToDropdown());

                // define bindings
                DOSM.Logic.ShowFields.BindEntity("cbx_entity", "cbx_entityfield", "cbx_entityfieldvalue", "cbx_form", "cbx_formfield");
                DOSM.Logic.ShowFields.BindEntityField("cbx_entityfield", "cbx_entityfieldvalue");
                DOSM.Logic.ShowFields.BindForm("cbx_form", "cbx_formfield");

                // hide show loading
                DOSM.UI.HideLoading();
            })
            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveEntities Error", DOSM.Common.GetErrorMessage(xhr)); });
    }, DOSM.Settings.TimeoutDelay);
}
// #endregion  
 
// #region DOSM.Logic.UpgradeConfiguration

/**
 * Upgrade Configuration Process
 */
DOSM.Logic.UpgradeConfiguration.Process = function () {
    // proceed only if threre is at least one form inside DOSM.Metadata.UpgradeForms
    if (DOSM.Metadata.UpgradeForms.Records.length == 0) { DOSM.UI.ShowError("Upgrade Forms Error", "No Forms to upgrade."); return; }

    // store the forms to update and the entities to publish
    var formsToUpdate = [];
    var entitiesToPublish = [];
    DOSM.Metadata.UpgradeForms.Records.forEach(function (upgradeForm) {
        var upgradedXml = DOSM.Common.UpgradeConfigurationXml(upgradeForm.FormXml); // upgrade FormXml
        formsToUpdate.push({ id: upgradeForm.Id, formxml: upgradedXml });
        if (entitiesToPublish.indexOf(upgradeForm.EntityLogicalName) == -1) { entitiesToPublish.push(upgradeForm.EntityLogicalName); };
    });

    // show loading message
    DOSM.UI.ShowLoading("Upgrading Forms...<br /><b>This is a long-running operation, please wait for the confirmation message</b>", "large");
    setTimeout(function () {
        DOSM.Common.UpdateForms(formsToUpdate)
            .done(function () {
                DOSM.Common.PublishEntities(entitiesToPublish)
                    .done(function () {
                        DOSM.UI.SetEmpty("div_content");
                        DOSM.UI.Show("Upgrade Forms Completed", "All Forms have been upgraded to the new Dependent Option Set Manager.", "large");
                    })
                    .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.PublishEntities Error", DOSM.Common.GetErrorMessage(xhr)); });
            })
            .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.UpdateForms Error", DOSM.Common.GetErrorMessage(xhr)); });
    }, DOSM.Settings.TimeoutDelay);
}

/**
 * Upgrade Configuration Confirm
 */
DOSM.Logic.UpgradeConfiguration.Confirm = function () {
    DOSM.UI.ShowQuestion("Upgrade Forms",
        "All Forms listed inside the dropdown will be updated to use the new Dependent Option Set Manager." +
        "<br /><br /><b>Continue?</b>", "large",
        function () { DOSM.Logic.UpgradeConfiguration.Process(); });
}

/**
 * Upgrade Configuration Show Instructions
 */
DOSM.Logic.UpgradeConfiguration.ShowInstructions = function () {
    var checkStatus = "check";
    if (DOSM.Settings.NewPassExecutionContext == "false") { checkStatus = "uncheck"; }

    var instructionsMessage = "<u>For each Form</u> that is using the previous library <i>" + DOSM.Settings.PreviousLibraryName + "</i>:<br /><br />" +
        "<ol>" +
        "<li>Add the library <b>" + DOSM.Settings.NewLibraryName + "</b></li><br />" +
        "<li>Under the Form OnLoad events list find the event using <i>" + DOSM.Settings.PreviousInitFunctionName + "</i> and open it</li><br />" +
        "<li>change the library to <b>" + DOSM.Settings.NewLibraryName + "</b>, change the function to <b>" + DOSM.Settings.NewInitFunctionName + "</b> and <b>" + checkStatus + " </b><i>Pass execution context as first parameter</i></li><br />" +
        "<li><u>For each Parent Field</u> that is part of a Dependent Option Set Configuration find the OnChange event using <i>" + DOSM.Settings.PreviousFilterFunctionName + "</i> and open it</li><br />" +
        "<ul><li>change the library to <b>" + DOSM.Settings.NewLibraryName + "</b>, change the function to <b>" + DOSM.Settings.NewFilterFunctionName + "</b> and <b>" + checkStatus + " </b><i>Pass execution context as first parameter</i></li></ul><br />" +
        "<li>Remove the previous library <i>" + DOSM.Settings.PreviousLibraryName + "</i> (at this point it should not be used), save and publish the Form</li>" +
        "</ol>";

    DOSM.UI.Show("Upgrade Forms - Manual Instructions", instructionsMessage, "xl");
}

/**
 * Ugrapde Configuration Start Function
 */
DOSM.Logic.UpgradeConfiguration.Start = function () {
    // Metadata used inside UpgradeConfiguration
    // DOSM.Metadata.UpgradeForms

    // clear the DOSM.Metadata namespace
    DOSM.Metadata = {};

    // create container with title
    DOSM.UI.SetEmpty("div_content");
    var container = DOSM.UI.CreateWideContainer("Upgrade from Dependent OptionSet Generator");
    DOSM.UI.Append("div_content", container);

    // create Form dropdown
    container.append(DOSM.UI.CreateSpan("span_form", "Forms using the previous Generator"));
    container.append(DOSM.UI.CreateDropdown("cbx_form"));
    container.append(DOSM.UI.CreateSpacer());

    // reset Form dropdown
    DOSM.UI.ResetDropdown("cbx_form", "Forms");

    // create buttons
    container.append(DOSM.UI.CreateButton("btn_upgradeconfiguration_confirm", "Upgrade", DOSM.Logic.UpgradeConfiguration.Confirm, "btn-danger"));
    container.append(DOSM.UI.CreateButton("btn_upgradeconfiguration_showinstructions", "Manual Instructions", DOSM.Logic.UpgradeConfiguration.ShowInstructions));

    // set button to default state
    $("#btn_upgradeconfiguration_confirm").prop("disabled", true);

    // check previous solution
    DOSM.UI.ShowLoading("Checking Previous Dependent Option Set Configurations...");
    setTimeout(function () {
        DOSM.Common.RetrieveWebResource(DOSM.Settings.PreviousLibraryId, "$select=name")
            .done(function () {
                DOSM.Common.RetrieveWebResourceDependentComponents(DOSM.Settings.PreviousLibraryId)
                    .done(function (data) {
                        var dependentFormIds = DOSM.Common.MapFormDependentComponents(data);
                        if (dependentFormIds.length == 0) {
                            DOSM.UI.Show("Upgrade not necessary", "Dependent OptionSet Generator Solution not used, Upgrade process is not necessary.", "large");
                        } else {
                            DOSM.Common.RetrieveForms(dependentFormIds)
                                .done(function (data) {
                                    var contextRegion = data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1);
                                    var context = JSON.parse(contextRegion);

                                    // map forms, fill dropdown and enable upgrade button
                                    var forms = DOSM.Common.MapForms(context, "Name", DOSM.Settings.PreviousInitFunctionName);
                                    DOSM.Metadata.UpgradeForms = new DOSM.Models.Records(forms);
                                    DOSM.UI.FillDropdownWithGroups("cbx_form", "Forms", DOSM.Metadata.UpgradeForms.ToDropdown(), true);
                                    $("#btn_upgradeconfiguration_confirm").prop("disabled", false);
                                    // hide loading
                                    DOSM.UI.HideLoading();
                                })
                                .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveForms Error", DOSM.Common.GetErrorMessage(xhr)); });
                        }
                    })
                    .fail(function (xhr) { DOSM.UI.ShowError("DOSM.Common.RetrieveWebResourceDependentComponents Error", DOSM.Common.GetErrorMessage(xhr)); });
            })
            .fail(function () { DOSM.UI.Show("Upgrade not necessary", "Dependent OptionSet Generator Solution not found, Upgrade process is not necessary.", "large"); });
    }, DOSM.Settings.TimeoutDelay);
}
// #endregion  
 
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
 
