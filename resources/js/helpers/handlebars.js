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