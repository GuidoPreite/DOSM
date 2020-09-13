// #region DOSM.Xrm.GetDemoData
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