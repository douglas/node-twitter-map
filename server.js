//setup Dependencies
require(__dirname + "/lib/setup").ext( __dirname + "/lib").ext( __dirname + "/lib/express/support");
var connect = require('connect')
    , express = require('express')
    , sys = require('sys')
    , io = require('Socket.IO-node')
    , port = (process.env.PORT || 80)
    , TwitterNode = require('twitter-node').TwitterNode;

//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.use(connect.bodyParser());
    server.use(connect.static(__dirname + '/static'));
    server.use(server.router);
});

//setup twitternode
var twit = new TwitterNode({
 user:'ajshulman',
 password:'michaela',
 locations:[-125.1395,21.8912,-65.8,50.1411]
});
//catch twitter errors
twit.addListener('error', function(error) {
  console.log(error.message);
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



//Setup Socket.IO
var socket = io.listen(server);
socket.on('connection', function(client){
	console.log('Client Connected');
	client.on('disconnect', function(){
		console.log('Client Disconnected.');
	});
});

//add tweet listener and send to client
twit.addListener('tweet', function(tweet) {
     if(tweet.geo){
	//console.log('geo')
	//console.log(tweet.geo.coordinates);
 	//console.log("***********************");
	socket.broadcast(tweet);
     }
 }).stream();


///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

server.get('/', function(req,res){
  res.render('index.ejs', {
    locals : { 
              header: 'Hacking a node homepage together....its a work in progress'
             ,footer: ''
             ,title : 'Alex Shulman'
             ,description: 'Hacking around with cool stuff'
             ,author: 'Alex Shulman'
             ,analyticssiteid: '22716008' 
            }
  });
});
//twitter stream 
server.get('/nyc', function(req,res){
 res.render('nycstream.ejs', {
   locals : {
              header: 'got sum tweets in nyc yo'
             ,footer: 'alex you should really finish the footer'
             ,title : 'Alex Shulman'
             ,description: 'Streaming Tweets'
             ,author: 'Alex Shulman'
             ,analyticssiteid: '22716008-1'
            }
  });
});
//map with tweets
server.get('/map', function(req,res){
  res.render('gmap2.ejs', { layout:'layout_map.ejs' });
});
server.get('/map2', function(req,res){
  res.render('gmap2.ejs', { layout:'layout_map.ejs' });
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
