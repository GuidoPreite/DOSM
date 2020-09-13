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