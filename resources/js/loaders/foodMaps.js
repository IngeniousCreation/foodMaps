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
		.setParent("root")
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
		.setParent("root")
		.addState("home", "/home", "home/index", null)
		.loadBefore(["unlogged-header-menu"])
		.replace();

	$("div#content")
		.use($u)
		.setParent("root")
		.addState("about", "/about", "test/index", null)
		.loadBefore(["unlogged-header-menu"])
		.replace();

	$("div#content")
		.use($u)
		.setParent("root")
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
    .setParent("root")
    .addState("signUp", "/sign-up", "user/signup", null)
    .loadBefore(["unlogged-header-menu"])
    .addListener("jquery", ["form#userPost", "submit"], function(e){
        e.preventDefault();
        var formData = a.form.get(e.target);
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
    .setParent("root")
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
    })
    .replace();

    $("ul#header-menu")
        .use($l)
        .setParent("root")
        .addState("header-menu", null, "layout/menu/header", null)
        .converter(function(data){
            data.menuElements = [{
                title : "Dashboard",
                hash  : "/app/dashboard"
            }, {
                title : "Mes Markers",
                hash  : "/app/markers"
            }, {
                title : "Mon profil",
                hash  : "/app/profile"
            }];
        })
        .replace();

    $("div#content")
        .use($l)
        .setParent("root")
        .addState("dashboard", "/app/dashboard", "/dashboard/index", {
            products : $ws.use("getHost", ["products/list"])
        })
        .converter(function(data){

            var host = $ws.use("getHost", [""]);

            data.markers = [];
            i = data.products.length;
            while(i--) {
                var tmp = {
                    id          : data.products[i].id,
                    title       : data.products[i].title,
                    description : data.products[i].description,
                    lat         : data.products[i].lat,
                    lgt         : data.products[i].lgt,
                    ico_url     : host + "uploads/markers/" + data.products[i].products_meta_id + ".png"
                };
                data.markers.push(tmp);
            }

        })
        .postLoad(function(r) {
            var data = r.getFullData(),
                map  = new MapHelper({zoom: 4}, document.getElementById("map_canvas"), data.markers, function(map, marker, m) {
                    var contentString = '<div id="content">'+
                        '<div id="siteNotice">'+
                        '</div>'+
                        '<h1 id="firstHeading" class="firstHeading">' + m.title + '</h1>'+
                        '<div id="bodyContent">'+
                        '<p>' + m.description + '</p>'+
                        '</div>'+
                        '</div>';

                    var infowindow = new google.maps.InfoWindow({
                        content : contentString,
                        maxWidth: 400
                    });
                    google.maps.event.addListener(marker, 'click', function() {
                        infowindow.open(map,marker);
                    });
                });
        })
        .addFile("js", [
            "resources/js/helpers/MapHelper.js"
        ])
        .loadBefore(["logged-header-menu"])
        .replace();

    $("div#content")
        .use($l)
        .setParent("root")
        .addState("markers-root", "/app/markers", "products/index")
        .postLoad(function() {
            $('#myTab a').click(function (e) {
                e.preventDefault()
                $(this).tab('show')
            });
            $('#myTab a:first').tab('show');
        })
        .loadBefore(["logged-header-menu"])
        .loadAfter(["logged-markers-list", "logged-categories-list", "logged-metas-list"])
        .replace();

        /**
         * Childrens of markers
         */
        $("div#markers")
            .use($l)
            .setParent("markers-root")
            .addState("markers-list", "/app/markers/{{s : /?}}{{id : [0-9]*}}", "products/list", {
                id           : "{{id}}",
                markerList   : $ws.use("getHost", ["products/list"]),
                categoryList : $ws.use("getHost", ["products/categories/list"]),
                metaList     : $ws.use("getHost", ["products/metas/list"]),
                product      : $ws.use("getHost", ["products/{{id}}"])
            })
            .converter(function(d) {
                console.log(d.product);

                var __truncate = function(string, length) {
                    if(a.isNull(string)) return;
                    if(string.length < length) return string;
                    return string.substring(0, length) + "...";
                };

                var __getEl = function(data, id) {
                    for(var i in data) {
                        var tmp = data[i];
                        if(tmp.id == id) return tmp;
                    }
                    return null;
                };

                d.list = [];
                for(var i in d.markerList) {
                    var tmp = d.markerList[i];

                    d.list.push({
                        id          : tmp.id,
                        title       : tmp.title,
                        description : tmp.description,
                        categoryName: __getEl(d.categoryList, tmp.products_category_id).name,
                        metaName    : __getEl(d.metaList, tmp.products_meta_id).icon
                    });
                }
                for(var i in d.metaList) {
                    d.metaList[i]["icon"] = __truncate(d.metaList[i]["icon"], 20);
                }
                for(var i in d.categoryList) {
                    d.metaList[i]["name"] = __truncate(d.metaList[i]["name"], 20);
                }
            })
            .postLoad(function(r) {
                $("#category").ddslick({
                    selectText: "Get a category",
                    truncate: true,
                    width: '100%',
                    onSelected: function(selectedData){
                        var id = selectedData.selectedData.value;
                        $('input[name="products_category_id"]').val(id);
                    }
                });
                $("#meta").ddslick({
                    selectText: "Get a meta",
                    truncate: true,
                    width: '100%',
                    onSelected: function(selectedData){
                        var id = selectedData.selectedData.value;
                        $('input[name="products_meta_id"]').val(id);
                    }
                });
            })
            .addListener("jquery", ["a#map", "click"], function(e) {
                e.preventDefault();
                $(this).popover();
                $(this).on('shown.bs.popover', function() {
                    $(this).next('.popover').find('.popover-content').html('<div id="map_canvas"></div>');

                    var map = new MapHelper({
                        draggable: true,
                        zoomControl: true,
                        zoomControlOptions: {
                            style: google.maps.ZoomControlStyle.BIG
                        },
                        scaleControl: true,
                        scaleControlOptions: {
                            style: google.maps.ScaleControlStyle.DEFAULT,
                        }
                    }, document.getElementById("map_canvas"), {
                        title: 'La position de mon produit',
                        lgt: $("form#productPost input#lgt").val(),
                        lat: $("form#productPost input#lat").val()
                    }, function(map, marker) {
                        google.maps.event.addListener(marker, 'click', function() {
                            infowindow.open(map,marker);
                        });

                        google.maps.event.addListener(marker, 'drag', function() {
                            $('#lat').val(marker.position.lat());
                            $('#lgt').val(marker.position.lng());
                        });
                    });

                    $("#map_canvas").css({
                        width: '100%',
                        height: '400px'
                    })
                });
            })
            .addListener("jquery", ["form#productPost", "submit"], function(e) {
                e.preventDefault();

                var d = a.form.get(e.target);
                $ws.post("products", {data : d}, function(e) {
                    a.state.forceReloadById("logged-markers-list")
                });
            })
            .addListener("jquery", ["a#productDelete", "click"], function(e) {
                e.preventDefault();

                var id = $(this).attr('data-id');
                $ws.delete("products/"+id, null, function(e) {
                    a.state.forceReloadById("logged-markers-list")
                });
            })
            .addFile("js", [
                "resources/js/helpers/MapHelper.js",
                "vendors/jquery.ddslick.min.js"
            ])
            .replace();

            $("div#categories")
                .use($l)
                .setParent("markers-root")
                .addState("categories-list", null, "products/categories/list", {
                    categoryList : $ws.use("getHost", ["products/categories/list"])
                })
                .addListener("jquery", ["form#categoryPost", "submit"], function(e) {
                    e.preventDefault();

                    var d = a.form.get(e.target);
                    $ws.post("products/categories", {data : d}, function(e) {
                        a.state.forceReloadById("logged-categories-list")
                    });
                })
                .addListener("jquery", ["a#categoryDelete", "click"], function(e) {
                    e.preventDefault();
                    var id = $(this).attr('data-id');
                    $ws.delete("products/category/"+id, null, function(e) {
                        a.state.forceReloadById("logged-categories-list")
                    });
                })
                .replace();

            $("div#metas")
                .use($l)
                .setParent("markers-root")
                .addState("metas-list", null, "products/metas/list", {
                    metaList : $ws.use("getHost", ["products/metas/list"])
                })
                .addListener("jquery", ["form#metaPost", "submit"], function(e) {
                    e.preventDefault();

                    var formData = new FormData(e.target);
                    $ws.file("post", "products/metas", formData, function(e) {
                        a.state.forceReloadById("logged-metas-list");
                    }, null, xhr);
                })
                .replace();


    $("div#content")
        .use($l)
        .setParent("root")
        .addState("dashboard", "/app/profile", "/profile/index", null)
        .loadBefore(["logged-header-menu"])
        .replace();