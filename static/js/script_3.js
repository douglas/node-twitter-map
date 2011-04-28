/* Author: 

*/

$(document).ready(function() {   
   function attachInfowindow(marker, content_string) {
     var infowindow = new google.maps.InfoWindow(
        { content:content_string
        });
     google.maps.event.addListener(marker, 'click', function() {
       infowindow.open(window.myMap, marker);
       });
    }
   io.setPath('/client/');
   socket = new io.Socket(null, { 
     port: 80
     ,transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']
   });
   socket.connect();
   var count = 0;   
   socket.on('message', function(data){
    var Location = new google.maps.LatLng(data.geo.coordinates[0],data.geo.coordinates[1]);
    var Marker = new google.maps.Marker({
    position:Location,
    map:window.myMap,
    title: data.user.screen_name
    });
    var content_string = '<div id="content"><p><h1>@'+data.user.screen_name+'</h1></p><p>'+data.text+'</p>';
    attachInfowindow(Marker, content_string);
    });
   });
      
