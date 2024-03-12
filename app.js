const express = require("express");

const app = express();
const cors = require("cors");
const e = require("express");
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

  socket.on("pre-offer", (data) => {
    const { calleId, typeOfCall } = data;

    const calleIdFromConnectedPeers = connectedPeers.find(
      (peer) => peer === calleId
    );

    if (calleIdFromConnectedPeers) {
      io.to(calleIdFromConnectedPeers).emit("pre-offer", {
        callerId: socket.id,
        typeOfCall,
      });
    } else {
      io.to(socket.id).emit("pre-offer-answer", {
        calleId,
        status: "not found",
      });
    }
  });

  socket.on("pre-offer-answer", (data) => {
    console.log("pre-offer-answer", data);
    let returnStatus = "";
    const { callerId, status } = data;
    const callerIdFromConnectedPeers = connectedPeers.find(
      (peer) => peer === callerId
    );
    if (callerIdFromConnectedPeers) {
      returnStatus = status;
      io.to(callerId).emit("pre-offer-answer", {
        calleId: socket.id,
        status: returnStatus,
      });
    }
  });

  socket.on("disconnect", () => {
    const newConnectedPeers = connectedPeers.filter(
      (peerId) => peerId !== socket.id
    );
    connectedPeers = newConnectedPeers;
    console.log("Peers disconnected: ", connectedPeers);
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

server.listen(port, () => console.log(`Server is listening at port: ${port}`));
