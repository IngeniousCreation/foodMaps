var MapHelper = function(settings, dom, data, callback) {

    /**
     * Default Settings
     */
    var defaultSettings = {
        zoom: 0,
        center: new google.maps.LatLng(0, 0),
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.BIG
        },
        scaleControl: true,
        scaleControlOptions: {
            style: google.maps.ScaleControlStyle.DEFAULT,
        },
        streetViewControl: false
    };

    /**
     * Create Map
     * ---
     * Merge configuration
     */
    settings = $.extend(defaultSettings, settings);
    var map = new google.maps.Map(dom, settings);

    var markers = data;
    $(markers).each(function(i, m){

        if(!a.isNull(m.ico_url)) {
            var icon = {
                url: m.ico_url,
                size: new google.maps.Size(16, 16),
                scaledSize: new google.maps.Size(16, 16)
            };
        } else {
            var icon = null;
        }

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(parseFloat(m.lat), parseFloat(m.lgt)),
            map: map,
            title: m.title,
            draggable : settings.draggable,
            animation : google.maps.Animation.DROP,
            icon: icon
        });

        if(a.isFunction(callback)) {
            callback(map, marker, m);
        }
    });

};