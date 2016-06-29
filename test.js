function initMap(){
    var curlat=null; //these variables will be used in order to store my current location
    var curlng=null;
    var temp2=null;
    var infowindow = new google.maps.InfoWindow({
        content:'Error'
    });
    var destination_place_id = null;
    var travel_mode = google.maps.TravelMode.DRIVING;
    var map = new google.maps.Map(document.getElementById('map'), {
        mapTypeControl: false,
        center: {lat: 37.511655, lng: 22.377917},
        zoom: 13
    });

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay=  new google.maps.DirectionsRenderer({map:map});
    var directionsDisplay2=  new google.maps.DirectionsRenderer({map:map});
    var destination_input = document.getElementById('destination-input');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);
    var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
    destination_autocomplete.bindTo('bounds', map);
    function expandViewportToFitPlace(map, place) {
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
    }
    destination_autocomplete.addListener('place_changed', function() {
        var place = destination_autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }
        directionsDisplay.setPanel(null);
        directionsDisplay.setMap(null);
        directionsDisplay2.setPanel(null);
        directionsDisplay2.setMap(null);
        expandViewportToFitPlace(map, place);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                curlat=position.coords.latitude;//store my current loc to lat/lng for later usage
                curlng=position.coords.longitude;
                var posArr=[];
                var Mypos = new google.maps.LatLng (curlat,curlng);
                posArr[0] = new google.maps.LatLng (37.51211, 22.36897);
                posArr[1] = new google.maps.LatLng (37.51137, 22.37858);
                posArr[2] = new google.maps.LatLng (37.5088, 22.37303);
                posArr[3] = new google.maps.LatLng (37.51444, 22.37235);
                posArr[4] = new google.maps.LatLng (37.51451, 22.37206);
                posArr[5] = new google.maps.LatLng (37.50877, 22.37036);
                posArr[6] = new google.maps.LatLng (37.51407, 22.37663);
                posArr[7] = new google.maps.LatLng (37.51273, 22.37778);
                posArr[8] = new google.maps.LatLng (37.50997, 22.37082);
                posArr[9] = new google.maps.LatLng (37.50878, 22.37603);
                posArr[10] = new google.maps.LatLng (37.51476, 22.3754);
                posArr[11] = new google.maps.LatLng (37.50965, 22.37632);
                posArr[12] = new google.maps.LatLng (37.51123, 22.37054);
                posArr[13] = new google.maps.LatLng (37.51374, 22.37233);
                posArr[14] = new google.maps.LatLng (37.51443, 22.37131);
                posArr[15] = new google.maps.LatLng (37.51352, 22.37109);
                posArr[16] = new google.maps.LatLng (37.51105, 22.37973);
                destination_place_id = place.place_id;
                //creating a marker for the map, for my current location
                //setting the center
                var templace = place.geometry.location;
                var minDis=google.maps.geometry.spherical.computeDistanceBetween (posArr[0], templace);
                var calc= 0,pos_i=0;
                for(var i=0;i<posArr.length;i++){
                    calc=google.maps.geometry.spherical.computeDistanceBetween (posArr[i], templace);
                    if(minDis>calc){
                        pos_i=i;
                        minDis=calc;
                    }
                }
                temp2=posArr[pos_i];//minimum distance  slot from poi
                if( google.maps.geometry.spherical.computeDistanceBetween (posArr[pos_i], templace)>700){
                    var routes = [{origin: Mypos, destination: {'placeId': destination_place_id}, travel_mode: google.maps.TravelMode.DRIVING}];
                }else {
                    var routes = [{origin: Mypos, destination: temp2, travel_mode: google.maps.TravelMode.DRIVING},
                        {origin: temp2,destination: {'placeId': destination_place_id},travel_mode: google.maps.TravelMode.WALKING}];
                }
                map.setCenter(Mypos);
                directionsDisplay.setMap(map);
                document.getElementById("right-panel").innerHTML = "";
                var div = document.getElementById( 'right-panel' );
                div.style.backgroundColor='white';
                directionsDisplay.setPanel(div);
                for (var i = 0; i < routes.length; i++) {
                    if(i==1) {
                        routing(routes[i],directionsService, directionsDisplay2);
                        directionsDisplay2.setMap(map);
                        directionsDisplay2.setPanel(div);
                        break;
                    }else{
                        routing(routes[i],directionsService, directionsDisplay);
                    }
                }
                routes=null;
            }, function() {
                handleLocationError(true, infoWindow, map.getCenter());
            },{enableHighAccuracy: true,timeout: 3000} );
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    });
    function routing(route, directionsService, directionsDisplay) {
        directionsService.route({
            origin: route.origin,
            destination: route.destination,
            travelMode: route.travel_mode
        }, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
}
//this function checks if the browser has/was granted geolocation support
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesnt support geolocation.');
}
