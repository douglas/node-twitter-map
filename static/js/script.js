/* Author: 

*/

$(document).ready(function() {   
   
   io.setPath('/client/');
   socket = new io.Socket(null, { 
     port: 80
     ,transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']
   });
   socket.connect();
    
   $('#sender').bind('click', function() {
     socket.send("Message Sent on " + new Date());     
   });   
   socket.on('message', function(data){
     $('#reciever').append('<li><p><b>@' + data.user.screen_name + ':</b>  ' + data.text + '</p><p>' + data.geo.coordinates + '</p></li>');  
   });
      
 });






















