const http = require('http');
const app = require('./app');

// create server
const port = process.env.PORT || 3000;
app.set('port', port);
const server = http.createServer(app);

// listening
server.listen(port);