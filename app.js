const express = require("express");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;

let connectedPeers = [];

app.use(express.static("public"));

io.on("connect", (socket) => {
  connectedPeers.push(socket.id);
  console.log("Peers connected: ", connectedPeers);
  
  socket.on("disconnect", () => {
    console.log("Peers disconnected: ", connectedPeers);
    const newConnectedPeers= connectedPeers.filter(peerId => peerId !== socket.id);
    connectedPeers = newConnectedPeers;
  });

});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

server.listen(port, () => console.log(`Server is listening at port: ${port}`));
