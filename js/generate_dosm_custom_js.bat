REM set the file to empty
type NUL > dosm_custom.js
REM define the files to combine
set list= dosm.namespaces.js dosm.utilities.js dosm.xrm.getdemodata.js dosm.models.js dosm.ui.js dosm.xrm.js dosm.common.xrm.js dosm.common.map.js dosm.common.xml.js dosm.common.js dosm.logic.showconfiguration.js dosm.logic.editconfiguration.js dosm.logic.copyconfiguration.js dosm.logic.removeconfiguration.js dosm.logic.createjson.js dosm.logic.clonejson.js dosm.logic.deletejson.js dosm.logic.showfields.js dosm.logic.upgradeconfiguration.js dosm.initialize.js
REM merge the files
for %%a in (%list%) do type %%a >> dosm_custom.js & echo. >> dosm_custom.js & echo. >> dosm_custom.js