(function(){
    a.environment.set("debug", true);

    var currentHash = a.page.event.hash.getHash(),
        elapse      = null,
        max         = 1000;

    // Initialise page event hash system
    a.page.event.hash.setPreviousHash("");
    window.location.href = "#loading_application";

    /**
     * handle "state change" for every browser
     */
    function firstHandle() {
        if(a.page.event.hash.getHash() !== currentHash) {
            window.location.href = "#" + currentHash;
            max = 0;
        }
        if(max-- <= 0) {
            clearInterval(elapse);
        }
    };

    // The main starter is here, we will customize it soon
    if(currentHash === null || currentHash === "" || !a.state.hashExists(currentHash)) {
        currentHash = "/home";
    }

    elapse = setInterval(firstHandle, 50);
})();

/*
 -------------------------------
 JQUERY
 -------------------------------
 */
jQuery.support.cors = true;


/**
 * Default base ajax request
 *
 * @param options {Object} The base options to apply
 * @return {jQuery} The ajax object
 */
function ajax(options) {
    var settings = {
        beforeSend  : function(xhr){
            xhr.setRequestHeader("Authorization", null);
        },
        fields      : {
            withCredentials : true
        },
        crossDomain : true,
        contentType : "application/json; charset=UTF-8",
        dataType    : "json"
    };

    // Getting uri if there is
    if(options.uri && options.uri.indexOf("http") !== 0) {
        if(options.uri.charAt(0) === "/") {
            options.uri = options.uri.substr(1);
        }
        options.url = kbugs.getBaseUrl() + "/" + options.uri;
    }

    // Extending object before request
    var composed = jQuery.extend(settings, options);
    return jQuery.ajax(composed)
};