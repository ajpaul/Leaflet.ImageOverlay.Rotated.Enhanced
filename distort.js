var _lastScale = 100;
var map = new L.Map('map');

var position = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    maxNativeZoom: 18,
    maxZoom:24
}).addTo(map);

var point1 = L.latLng(40.52256691873593, -3.7743186950683594),
    point2 = L.latLng(40.5210255066156, -3.7734764814376835),
    point3 = L.latLng(40.52180437272552, -3.7768453359603886);

var marker1 = L.marker(point1, {draggable: true} ).addTo(map),
    marker2 = L.marker(point2, {draggable: true} ).addTo(map),
    marker3 = L.marker(point3, {draggable: true} ).addTo(map);
    

var	bounds = new L.LatLngBounds(point1, point2).extend(point3);

map.fitBounds(bounds);

var overlay = L.imageOverlay.rotated("chloe.jpg", point1, point2, point3, {
    opacity: $("#opacitySlider").val(),
    interactive: true,
    draggable: true,
    attribution: 'Enhanced by <a href="http://github.com/ajpaul">Adam Paul</a>'
});

function repositionImage() {
    let m1 = marker1.getLatLng();
    let m2 = marker2.getLatLng();
    let m3 = marker3.getLatLng();

    overlay.reposition(m1, m2, m3);

    updateCoordinateLabels(m1, m2, m3);
};

marker1.on('drag dragend', repositionImage);
marker2.on('drag dragend', repositionImage);
marker3.on('drag dragend', repositionImage);


map.addLayer(overlay);

repositionImage();

overlay.on({
    mousedown: function (e) {

        map.dragging.disable();

        var latLng1 = marker1.getLatLng();
        var latLng2 = marker2.getLatLng();
        var latLng3 = marker3.getLatLng();
        var cursorLatLng = e.latlng;

        map.on('mousemove', function (e) {
        
            let difLat = cursorLatLng.lat - e.latlng.lat;
            let difLng = cursorLatLng.lng - e.latlng.lng;

            marker1.setLatLng([latLng1.lat - difLat, latLng1.lng - difLng]);
            marker2.setLatLng([latLng2.lat - difLat, latLng2.lng - difLng]);
            marker3.setLatLng([latLng3.lat - difLat, latLng3.lng - difLng]);

            repositionImage();
        });
    }
}); 

map.on('mouseup',function(e){
    map.removeEventListener('mousemove');
    map.dragging.enable();
})




function setOverlayOpacity(opacity) {
    overlay.setOpacity(opacity);
}

function updateCoordinateLabels(m1, m2, m3) {
    
    $("#marker1Lat").text(m1.lat);
    $("#marker1Long").text(m1.lng);

    $("#marker2Lat").text(m2.lat);
    $("#marker2Long").text(m2.lng);

    $("#marker3Lat").text(m3.lat);
    $("#marker3Long").text(m3.lng);
}

$("#export").click(function(){

    var json = {
        image: './chloe.jpg',
        marker1: marker1.getLatLng(),
        marker2: marker2.getLatLng(),
        marker3: marker3.getLatLng(),
        opacity:  $("#opacitySlider").val()
    }

    //in case you were doing an api post or something...I'll just put it on the screen though
    alert(JSON.stringify(json, null, 2)); 


})

$("#opacitySlider").on("input change", function() { 
    
    let o = $("#opacitySlider").val();
    setOverlayOpacity(o); 
    $("#opacity").text(o);
});

