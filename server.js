'use strict';

/*
|--------------------------------------------------------------------------
| Http server
|--------------------------------------------------------------------------
|
| This file bootstrap Adonisjs to start the HTTP server. You are free to
| customize the process of booting the http server.
|
| """ Loading ace commands """
|     At times you may want to load ace commands when starting the HTTP server.
|     Same can be done by chaining `loadCommands()` method after
|
| """ Preloading files """
|     Also you can preload files by calling `preLoad('path/to/file')` method.
|     Make sure to pass relative path from the project root.
*/

const { Ignitor } = require('@adonisjs/ignitor');
console.log('Here');
console.log(rocess.env.DB_DATABASE);
console.log(rocess.env.DB_PORT);
console.log(rocess.env.DB_USER);
console.log(rocess.env.DB_PORT);
console.log(rocess.env.DB_CONNECTION);

console.log(rocess.env.DB_PASSWORD);

new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .wsServer() // boot the WebSocket server
  .fireHttpServer()
  .catch(console.error);
