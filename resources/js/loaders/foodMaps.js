// Configuration
var $u =
        new StateHelper({
            state:{
                prefix: "unlogged"
            },
            save: true
        }),
    $l =
        new StateHelper({
            state:{
                prefix: "logged"
            },
            functions : {
                preLoad : function(result) {
                    var u = a.storage.getItem("auth");
                    if(a.isNull(u) || a.isNull(u.username) || a.isNull(u.password)) {
                        window.location.hash = "#/home";
                        result.fail();
                    }
                    result.done();
                }
            },
            save: true
        }),
    uTplPath = "templates/unlogged",
    lTplPath = "templates/logged";

// Unlogged
$("div#layout")
	.use($u)
	.addState("root", null, uTplPath + "/layout/default.html", null)
	.replace();

	$("ul#header-menu")
		.use($u)
		.parent("root")
		.addState("header-menu", null, uTplPath + "/layout/menu/header.html", null)
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
		.use($u)
		.parent("root")
		.addState("home", "/home", uTplPath + "/home/index.html", null)
		.loadBefore(["unlogged-header-menu"])
		.replace();

	$("div#content")
		.use($u)
		.parent("root")
		.addState("about", "/about", uTplPath + "/test/index.html", null)
		.loadBefore(["unlogged-header-menu"])
		.replace();

	$("div#content")
		.use($u)
		.parent("root")
		.addState("signIn", "/sign-in", uTplPath + "/user/signin.html", null)
		.loadBefore(["unlogged-header-menu"])
		.postLoad(function(){

			$("form#userPost").submit(function(e){
				e.preventDefault();
				var formData = a.form.get($(this).get(0));

				$.post("/foodMaps/api/public/users/signin",{
					data: formData
				}, function(data){
                    a.storage.setItem("auth", data.data);
                    window.location.hash="#/app/dashboard"
				});
			});

			return true;
		})
		.replace();

$("div#content")
    .use($u)
    .parent("root")
    .addState("signUp", "/sign-up", uTplPath + "/user/signup.html", null)
    .loadBefore(["unlogged-header-menu"])
    .postLoad(function(){

        $("form#userPost").submit(function(e){
            e.preventDefault();
            var formData = a.form.get($(this).get(0));

            $.post("/foodMaps/api/public/users/signup",{
                data: formData
            }, function(data){
                if(data.type === "success") {
                }
            });
        });

        return true;
    })
    .replace();

    /*
    -----------------------------
    Errors
    -----------------------------
    */
    $("div#content")
        .use($u)
        .parent("root")
        .addState("signUp", "/error/404", uTplPath + "/errors/404.html", null)
        .loadBefore(["unlogged-header-menu"])
        .replace();

// Logged
$("div#layout")
    .use($l)
    .addState("root", null, lTplPath + "/layout/default.html", null)
    .postLoad(function() {

        a.timer.add(function(){
            var u = a.storage.getItem("auth");
            $.post("/foodMaps/api/public/users/signin", {
                data : u
            }, function(data) {
                if(data.type=="error") {
                    a.storage.removeItem("auth");
                    window.location.hash = "#/home";
                }
            });
        }, this, 4*60*1000);

        return true;
    })
    .replace();

    $("ul#header-menu")
        .use($l)
        .parent("root")
        .addState("header-menu", null, lTplPath + "/layout/menu/header.html", null)
        .converter(function(data){
            data.menuElements = [{
                title : "Dashboard",
                hash  : "/app/dashboard"
            }, {
                title : "Mon profil",
                hash  : "/app/profile"
            }];
        })
        .replace();

    $("div#content")
        .use($l)
        .parent("root")
        .addState("dashboard", "/app/dashboard", lTplPath + "/dashboard/index.html", null)
        .loadBefore(["logged-header-menu"])
        .replace();

    $("div#content")
        .use($l)
        .parent("root")
        .addState("dashboard", "/app/profile", lTplPath + "/profile/index.html", null)
        .loadBefore(["logged-header-menu"])
        .replace();

// Check other
a.message.addListener("a.state.begin", function(hash) {
    var hashExists = a.state.hashExists(hash.value);
    if(!hashExists) {
        window.location.hash = "#/error/404";
    }
});