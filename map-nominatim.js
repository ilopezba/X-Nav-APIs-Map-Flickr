// JavaScript for map-nominatim.html (Leaflet)

function addrSearch() {
    var inp = document.getElementById("addr");

        
    $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + inp.value, function(data) {
	var items = [];

	$.each(data, function(key, val) {
	    items.push(
		"<li><a href='#' onclick='chooseAddr(" +
		    val.lat + ", " + val.lon + ", \"" + val.type + "\");return false;'>" + val.display_name +
		    '</a></li>'
	    );
	});
	$('#results').empty();
	if (items.length != 0) {
	    $('<p>', { html: "Search results:" }).appendTo('#results');
	    $('<ul/>', {
		'class': 'my-new-list',
		html: items.join('')
	    }).appendTo('#results');
	} else {
	    $('<p>', { html: "No results found" }).appendTo('#results');
	}
	$('<p>', { html: "<button id='close' type='button'>Close</button>" }).appendTo('#results');
	$("#close").click(removeResults);
    });
var count = 0;
var max = 4;
    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
        {
          tags: $("#addr").val(),
          tagmode: "any",
          format: "json"
        },

        function(data) {
          $.each(data.items, function(i,item){
	    if(count <max){
                $("<img/>").attr("src", item.media.m).prependTo("#results");
                if ( i == 10 ) return false;
		count++;
	    }
          });
        });
}

function removeResults() {
    $("#results").empty();
}

function chooseAddr(lat, lng, type) {
    var location = new L.LatLng(lat, lng);
    map.panTo(location);

    if (type == 'city' || type == 'administrative') {
	map.setZoom(10);
    } else {
	map.setZoom(13);
    }
}


$(document).ready(function() {

    $("div#search button").click(addrSearch);
    map = L.map('map');
    L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
	attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">'
    }).addTo(map);

    // Show lat and long at cliked (event) point, with a popup
    var popup = L.popup();
    function showPopUp(e) {
	popup
            .setLatLng(e.latlng)
            .setContent("Coordinates: " + e.latlng.toString())
            .openOn(map);
    }
    // Subscribe to the "click" event
    map.on('click', showPopUp);

    // Show a circle around current location
    function onLocationFound(e) {
	var radius = e.accuracy / 2;
	L.marker(e.latlng).addTo(map)
            .bindPopup("Estas a " + radius +
		       " metros de aqui<br/>" +
		       "Coord: " + e.latlng.toString())
	    .openPopup();
	L.circle(e.latlng, radius).addTo(map);
    }
    // Subscribe to the "location found" event
    map.on('locationfound', onLocationFound);

    // Show alert if geolocation failed
    function onLocationError(e) {
	alert(e.message);
    }
    // Subscribe to the "location error" event
    map.on('locationerror', onLocationError);

    // Set the view to current location
    map.locate({setView: true, maxZoom: 16});
});
