#!/usr/bin/env node
"use strict";

var server = require("../build/server");
var debug = require("debug")("express:server");
var http = require("http");


var portArg = process.argv.find(function(arg) {
  return arg.match(/(--port|-p)(=)\d+/g);
})||'';
var port=portArg.match(/\d+/g)||[8080];
var httpPort = normalizePort(port[0]);

var app = server.Server.bootstrap().app;
app.set("port", httpPort);
var httpServer = http.createServer(app);

httpServer.listen(httpPort);

httpServer.on("error", onError);

httpServer.on("listening", onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string"
    ? "Pipe " + port
    : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}
function onListening() {
  var addr = httpServer.address();
  var bind = typeof addr === "string"
    ? "pipe " + addr
    : "port " + addr.port;
  debug("Listening on " + bind);
}