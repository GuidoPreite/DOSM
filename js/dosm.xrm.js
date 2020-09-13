// #region DOSM.Xrm
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