//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , sys = require('util')
    , io = require('socket.io').listen(8081)
    , port = (process.env.PORT || 80)
    , twitter = require('ntwitter');

//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.use(connect.bodyParser());
    server.use(connect.static(__dirname + '/static'));
    server.use(server.router);
});

//setup twitternode
var twit = new twitter({
 consumer_key: '#',
 consumer_secret: '#',
 access_token_key: '#',
 access_token_secret: '#'
});


//setup the errors
server.error(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.ejs', { locals: { 
                  header: '#Header#'
                 ,footer: '#Footer#'
                 ,title : '404 - Not Found'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX' 
                },status: 404 });
    } else {
        res.render('500.ejs', { locals: { 
                  header: '#Header#'
                 ,footer: '#Footer#'
                 ,title : 'The Server Encountered an Error'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX'
                 ,error: err 
                },status: 500 });
    }
});
server.listen(port);



//Uncomment for Socket.IO debugging mode

io.set("log level", 1);

//Setup Socket.IO


io.sockets.on('connection', function(socket){
	console.log('Client Connected');
	socket.on('disconnect', function(){
		console.log('Client Disconnected.');
	});
});

//Start twitter stream with bounding box
twit.stream('statuses/filter', {'locations':'-74.224,40,-73,41'}, function(stream){
	stream.on('data', function(tweet){
		if(tweet.geo){
			io.sockets.emit('tweet', tweet);
   	 	}
	});
});


///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  //////

//map with tweets
server.get('/', function(req,res){
  res.render('gmap.ejs', { layout:'layout_map.ejs' });
});

//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}


console.log('Listening on http://0.0.0.0:' + port );
