Handlebars.registerHelper("isActive", function(object) {
    var state = window.location.hash;

    if(!a.isString(state) || a.isNull(object)){
        a.console.error("Invalid parameters");
        return;
    }

    state = state.substring(1);

    if(state == object.hash) {
        return new Handlebars.SafeString("active");
    }
});


Handlebars.registerHelper("debug", function(object) {
    console.log(object);
});


Handlebars.registerHelper("getIcon", function(id) {
    var host = $ws.use("getHost", [""]);
    return new Handlebars.SafeString(host+"uploads/markers/"+id+".png");
});

// Form

Handlebars.registerHelper("generateOption", function(object, key, value) {
    var options = "";
    for(var o in object) {
        o = object[o];
        options += '<option value="' + o[key] + '">' + o[value] + '</option>';
    }
    return new Handlebars.SafeString(options);
});

Handlebars.registerHelper("generateDDSlikOption", function(object, key, value) {
    var options = "";
    for(var o in object) {
        o = object[o];
        options += '<option value="' + o[key] + '" data-description="' + o.description + '">' + o[value] + '</option>';
    }
    return new Handlebars.SafeString(options);
});

Handlebars.registerHelper("generateDDSlikOptionWithImage", function(object, key, value) {
    var options = "",
        host = $ws.use("getHost", [""]);
    for(var o in object) {
        o = object[o];
        options += '<option value="' + o[key] + '" data-imagesrc="' + host + 'uploads/markers/' + o.id + ".png" + '" data-description="test">' + o[value] + '</option>';
    }
    return new Handlebars.SafeString(options);
});