
/*
------------------------------------------------------------------------------------------------------------------------
Vendor Configuration
------------------------------------------------------------------------------------------------------------------------
 */

var appriseOptions = {
    alert : {
        "confirm" : false,
        "verify" : false,
        "input" : false,
        "animate" : true,
        "textOk" : 'Continuer',
        "textCancel" : 'Cancel',
        "textYes" : 'Continuer',
        "textNo" : 'No'
    },
    delete : {
        "confirm" : false,
        "verify" : true,
        "input" : false,
        "animate" : true,
        "textOk" : 'Ok',
        "textCancel" : 'Cancel',
        "textYes" : 'Yes',
        "textNo" : 'No'
    }
};
/*
------------------------------------------------------------------------------------------------------------------------
StateConfiguration
------------------------------------------------------------------------------------------------------------------------
*/

var $l = new StateHelper({
    state: {
        prefix: "logged"
    },
    save: true
});
var $u = new StateHelper({
    state: {
        prefix: "unlogged"
    },
    save: true
});
var $m = new StateHelper({
    state: {
        prefix: "menu"
    },
    save: true
})
var $e = new StateHelper({
    state: {
        prefix: "error"
    },
    save: true
});

/*
------------------------------------------------------------------------------------------------------------------------
RouteConfiguration
------------------------------------------------------------------------------------------------------------------------
*/

$kbugsROUTER = new RouteHelper();
$kbugsROUTER.set("login", function(data){ return data; }, {
    ADMIN: "#/admin/app/dashboard",
    USER : "#/user/app/dashboard"
});

/*
------------------------------------------------------------------------------------------------------------------------
DataModel
------------------------------------------------------------------------------------------------------------------------
*/

var $ws = new DataHelper({
    name          : "ws",
    // Basics Parameters
    // Production
    secureUrl  : ["http://foodmaps.florian-geoffroy.fr", "80", null],
    unsecureUrl: ["http://foodmaps.florian-geoffroy.fr", "80", null],
    // Local
//    secureUrl  : ["http://localhost", "80", 'foodMaps/api/public'],
//    unsecureUrl: ["http://localhost", "80", 'foodMaps/api/public'],
    error : function(error) {
        var message = "erreur lors de l'accès au serveur.";
        apprise(message, appriseOptions.alert, function(r) {

        });
    },
    receive: function(data) {
        if(data.type === "error") {
            var msg = "Une erreur c'est produite lors de : ";
            apprise(msg + data.on, appriseOptions.alert, function(r) {

            });
        }

        return data;
    }
});

/*
------------------------------------------------------------------------------------------------------------------------
UseFull function
------------------------------------------------------------------------------------------------------------------------
*/

/**
 * Xhr Override
 * --
 * Display the state of file upload
 *
 * @returns {xhr|*|xhr}
 */
var xhr = function() {
    function progressHandlingFunction(e){
        if(e.lengthComputable){
            $('progress:visible')
                .attr({"aria-valuenow":e.loaded, "aria-valuemin":0, "aria-valuemax":e.total})
                .css({width: (e.loaded / e.total)*100 + '%'});
        }
    };
    var myXhr = $.ajaxSettings.xhr();
    if(myXhr.upload) {
        myXhr.upload.addEventListener('progress',progressHandlingFunction, false);
    }
    return myXhr;
};

/*
------------------------------------------------------------------------------------------------------------------------
Paths
------------------------------------------------------------------------------------------------------------------------
*/

var uTplPath = "templates/unlogged/",
    lTplPath = "templates/logged";