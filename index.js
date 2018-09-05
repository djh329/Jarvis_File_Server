import http from 'http';
import app from './server';

var port = 3000;

const server = http.createServer(app)
let currentApp = app
server.listen(port)
console.log('todo list RESTful API server started on: ' + port);


if (module.hot) {
 module.hot.accept('./server', () => {
  server.removeListener('request', currentApp)
  server.on('request', app)
  currentApp = app
 })
}

// Run with `npm run start:server`
