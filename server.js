var http = require('http'),
    url  = require('url'),
    qstr = require('querystring'),
    path = require('path'),
    fs   = require('fs'),
    md   = require('markdown').markdown,
    mysql= require('mysql');

var PORT = 8080;

var hits = 0;
var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'bulletin'
});


function initialize () {
  db.connect();
}

function respond (request, response) {
  path = url.parse(request.url, true).pathname;
  query = url.parse(request.url, true).query;
  console.log({path: path, query: query})

  /* Serve readme.html */
  if (path == '/') {
    var readme = fs.readFileSync('index.html', 'utf8');

    response.writeHead(200, {'Content-Type': 'text/html'});
    if(query.message)
      response.write(
        '<p style="color:red; font-size:30px">'
        + query.message
        + '</p>');

    response.write(readme);
    response.end();

    hits++;
    console.log('Responded. Hits=' + hits);
  }

  /* Store incoming message in database */
  else if (path == '/form') {
    var body = '';

    request.on('data', function(chunk) {
      body += chunk;
    });
    request.on('end', function() {
      data = qstr.parse(body);
      console.log(data);

      db.query(
        'INSERT INTO message VALUES(?, ?, NOW())',
        [data.name, data.message],
        function(err) {if (err) throw err;} );

      response.writeHead(
        302, 
        { Location: '/?' + qstr.encode({message: 'Message sent!'}) }
      );
      response.end();
    });
  }

  /* Serve scripts and stylesheets */
  else if (path.match(/.*\.(js|css)/)) {
    var file = fs.readFileSync(path.substring(1));
    var ext = path.match(/.*\.(js|css)/)[1];

    response.writeHead(200, {
      'Content-Type': ext == 'js' ? 'text/javascript' : 'text/css'
    });
    response.write(file);
    response.end();
  }

  /* Serve messages from database */
  else if (path == '/messages') {
    db.query('SELECT * FROM message', function(err, rows) {
      if (err) throw err;

      response.writeHead(200, {'Content-Type': 'application/json'});
      response.write(JSON.stringify(rows));
      response.end();
    });
  }

  /* Serve favicon */
  else if (path == '/favicon.ico') {
    var img = fs.readFileSync('favicon.ico');

    response.writeHead(200, {'Content-Type': 'image/x-icon'});
    response.write(img);
    response.end();
  }

  else console.log('Path ' + path + ' not recognized.');
}

initialize();
http.createServer(respond).listen(PORT);
console.log('Server runnning on port ' + PORT + '.');
