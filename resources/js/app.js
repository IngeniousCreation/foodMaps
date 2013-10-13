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