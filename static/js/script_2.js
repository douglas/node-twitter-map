/* Author: 

*/

$(document).ready(function() {   
   function attachInfowindow(marker, content_string) {
     var infowindow = new google.maps.InfoWindow(
        { content:content_string,
		maxWidth:650
        });
     google.maps.event.addListener(marker, 'click', function() {
		google.maps.event.addListener(infowindow, 'domready', function(){ 
			$('#embed').embedly({maxWidth: 580 ,maxHeight:200, wrapElement: 'div' }, function(oembed, dict){
			if (oembed == null)
				$("#embed").html('<p class="text"> Not A Valid URL </p>');
			else 
				$("#embed").html(oembed.code);
				$("#nonembed").remove();
			});
     });
	 infowindow.open(window.myMap, marker);
       }); 
    }
	function clearOverlays() {
	  if (markersArray) {
	    for (i in markersArray) {
	      markersArray[i].setMap(null);
	    }
	  }
	}
	$("#btnReset").click(clearOverlays);

   io.setPath('/client/');
   socket = new io.Socket(null, { 
     port: 80
     ,transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']
   });
   var markersArray = []
   socket.connect();
   var count = 0;   
   socket.on('message', function(data){
    var Location = new google.maps.LatLng(data.geo.coordinates[0],data.geo.coordinates[1]);
    var Marker = new google.maps.Marker({
    position:Location,
    map:window.myMap,
    title: data.user.screen_name
    });
	var temp = '<p><a class="twitter-share-button" href="http://twitter.com/intent/tweet?in_reply_to='+data.id_str+'">Reply</a>'
		temp = temp +'<a href="http://twitter.com/intent/retweet?tweet_id='+data.id_str+'">Retweet</a>'
		temp = temp +'<a href="http://twitter.com/intent/favorite?tweet_id='+data.id_str+'">Favorite</a></p>'
	var content_string ='<div id="tweet_box" style="width:650px; height:250px"><div id="nonembed"><p><h1>@'+data.user.screen_name+'</h1></p><p>'+data.text+'</p></div><div id="embed"><a href="http://www.twitter.com/'+data.user.screen_name+'/status/'+data.id_str+'"></a></div>'+temp+'</div>'
    //var content_string = '<div id="content"><p><h1>@'+data.user.screen_name+'</h1></p><p>'+data.text+'</p></div>';
    markersArray.push(Marker);
	attachInfowindow(Marker, content_string);
    });
   });
      
