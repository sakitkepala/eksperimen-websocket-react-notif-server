const express = require("express");
const WebSocket = require("ws");

const app = express();
const port = 3030;

const server = app.listen(port, function () {
  console.log(`Server jalan di port ${port}`);
});

const socketServer = new WebSocket.Server({ noServer: true });

server.on("upgrade", function (request, socket, head) {
  try {
    socketServer.handleUpgrade(request, socket, head, function (websocket) {
      socketServer.emit("connection", websocket, request);
    });
  } catch (error) {
    console.log("upgrade exception", err);
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
  }
});

socketServer.on("connection", function (context) {
  console.log("connected");

  context.on("message", (message) => {
    console.log(`Received message => ${message}`);
    context.send(`you said ${message}`);
  });
});
