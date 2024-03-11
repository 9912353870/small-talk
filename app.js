const express = require("express");

const app = express();
const cors = require("cors");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const port = process.env.PORT || 3000;

let connectedPeers = [];

app.use(cors());
app.use(express.static("public"));

io.on("connect", (socket) => {
  connectedPeers.push(socket.id);
  console.log("Peers connected: ", connectedPeers);

  socket.on("pre-offer", (data) => console.log("Pre-offer:", data));

  socket.on("disconnect", () => {
    console.log("Peers disconnected: ", connectedPeers);
    const newConnectedPeers = connectedPeers.filter(
      (peerId) => peerId !== socket.id
    );
    connectedPeers = newConnectedPeers;
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

server.listen(port, () => console.log(`Server is listening at port: ${port}`));
