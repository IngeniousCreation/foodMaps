var $sh = new StateHelper({
	options: {
		state:{
			prefix: "unlogged"
		},
		data: {
			user : {
				name : "Florian Geoffroy"
			}
		}
	},
	save: true
});

$("div#layout")
	.use($sh)
	.addState("root", null, "templates/layout/default.html", null)
	.replace();

	$("ul#header-menu")
		.use($sh)
		.parent("root")
		.addState("header-menu", null, "templates/layout/menu/header.html", null)
		.converter(function(data){
			data.menuElements = [{
				title : "Home",
				hash  : "/home"
			}, {
				title : "About",
				hash  : "/about"
			}, {
				title : "Sign In",
				hash  : "/sign-in"
			}];
		})
		.replace();

	$("div#content")
		.use($sh)
		.parent("root")
		.addState("home", "/home", "templates/home/index.html", null)
		.loadBefore(["unlogged-header-menu"])
		.replace();

	$("div#content")
		.use($sh)
		.parent("root")
		.addState("about", "/about", "templates/test/index.html", null)
		.loadBefore(["unlogged-header-menu"])
		.replace();

	$("div#content")
		.use($sh)
		.parent("root")
		.addState("signIn", "/sign-in", "templates/user/signin.html", null)
		.loadBefore(["unlogged-header-menu"])
		.postLoad(function(){

			$("form#userPost").submit(function(e){
				e.preventDefault();
				var formData = a.form.get($(this).get(0));

				$.post("/foodMaps/api/public/users/signin",{
					data: formData
				}, function(data){
					console.log(data);
				});
			});

			return true;
		})
		.replace();

	$("div#content")
		.use($sh)
		.parent("root")
		.addState("signUp", "/sign-up", "templates/user/signup.html", null)
		.loadBefore(["unlogged-header-menu"])
		.postLoad(function(){

			$("form#userPost").submit(function(e){
				e.preventDefault();
				var formData = a.form.get($(this).get(0));

				$.post("/foodMaps/api/public/users/signup",{
					data: formData
				}, function(data){
					if(data.type === "success") {
						StateHelper.redirect("lo");
					}
				});
			});

			return true;
		})
		.replace();