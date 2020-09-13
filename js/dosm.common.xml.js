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