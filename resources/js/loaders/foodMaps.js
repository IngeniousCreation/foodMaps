/*
 -----------------------------
 Unlogged
 -----------------------------
 */

$("div#layout")
	.use($u)
	.addState("root", null, uTplPath + "/layout/default.html", null)
	.replace();

	$("ul#header-menu")
		.use($u)
		.parent("root")
		.addState("header-menu", null, "layout/menu/header", null)
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
		.addState("home", "/home", "home/index", null)
		.loadBefore(["unlogged-header-menu"])
		.replace();

	$("div#content")
		.use($u)
		.parent("root")
		.addState("about", "/about", "test/index", null)
		.loadBefore(["unlogged-header-menu"])
		.replace();

	$("div#content")
		.use($u)
		.parent("root")
		.addState("signIn", "/sign-in", "user/signin", null)
		.loadBefore(["unlogged-header-menu"])
        .addListener("jquery", ["form#userPost", "submit"], function(e){
            e.preventDefault();
            var formData = a.form.get($(this).get(0));
            $ws.post("users/signin", {data : formData}, function(data){
                if(data.type=="success") {
                    a.storage.setItem("auth", data.data);
                    window.location.hash="#/app/dashboard"
                }
            });
        })
		.replace();

$("div#content")
    .use($u)
    .parent("root")
    .addState("signUp", "/sign-up", "user/signup", null)
    .loadBefore(["unlogged-header-menu"])
    .addListener("jquery", ["form#userPost", "submit"], function(e){
        e.preventDefault();
        var formData = a.form.get($(this).get(0));
        $ws.post("users/signup", {data : formData}, function(data){
            if(data.type=="success") {
                window.location.hash = "#/sign-in";
            }
        });
    })
    .replace();

/*
-----------------------------
Errors
-----------------------------
*/
$("div#layout")
    .use($e)
    .addState("root", null, uTplPath + "/layout/default.html", null)
    .replace();

$("div#content")
    .use($e)
    .parent("root")
    .addState("404", "/error/404", "404", null)
    .replace();

/*
-----------------------------
Logged
-----------------------------
 */
$("div#layout")
    .use($l)
    .addState("root", null, lTplPath + "/layout/default.html", null)
    .postLoad(function() {

        a.timer.add(function(){
            var u = a.storage.getItem("auth");
            $ws.post("users/signin", {data : u}, function(data){
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