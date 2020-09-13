// #region DOSM.Utilities
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