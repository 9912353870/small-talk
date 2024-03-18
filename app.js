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
let connectedStarngerPeers = [];

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

  socket.on("webRTC-signalling", (data) => {
    const { peerSocketId } = data;

    const peerIdFromConnectedPeers = connectedPeers.find(
      (peer) => peer === peerSocketId
    );

    if (peerIdFromConnectedPeers) {
      io.to(peerIdFromConnectedPeers).emit("webRTC-signalling", data);
    }
  });

  socket.on("hang-up-the-call", (data) => {
    const { peerId } = data;
    const peerIdFromConnectedPeers = connectedPeers.find(
      (peer) => peer === peerId
    );

    if (peerIdFromConnectedPeers) {
      io.to(peerIdFromConnectedPeers).emit("hang-up-the-call");
    }
  });

  socket.on("sudden-disconnect", (data) =>
    console.log("sudden-disconnect", data)
  );

  socket.on("stranger-connection-accept", (data) => {
    const { peerId, status } = data;
    if (status) {
      connectedStarngerPeers.push(peerId);
    } else {
      const allConnectedStarngerPeers = connectedStarngerPeers.filter(
        (peer) => peer !== peerId
      );
      connectedStarngerPeers = allConnectedStarngerPeers;
    }

    console.log("Stranger Peers: ", connectedStarngerPeers);
  });

  socket.on("get-stranger-id", (data) => {
    const { peerId, typeOfCall } = data;
    const existedPeer = connectedStarngerPeers.find((peer) => peer === peerId);
    const expectItsOwn = connectedStarngerPeers.filter(
      (peer) => peer !== peerId
    );

    if (existedPeer) {
      let randomPeer;
      if (expectItsOwn.length > 0) {
        randomPeer =
          expectItsOwn[Math.floor(Math.random() * expectItsOwn.length)];
      } else {
        randomPeer = null;
      }
      console.log("Stranger ID: ", { strangerId: randomPeer });
      io.to(socket.id).emit("get-stranger-id", { strangerId: randomPeer, typeOfCall });
    }
  });

  socket.on("disconnect", () => {
    const newConnectedPeers = connectedPeers.filter(
      (peerId) => peerId !== socket.id
    );
    connectedPeers = newConnectedPeers;

    const newConnectedStrangerPeers = connectedStarngerPeers.filter(
      (peer) => peer !== socket.id
    );
    connectedStarngerPeers = newConnectedStrangerPeers;

    console.log(
      "Peers disconnected: ",
      connectedPeers,
      "Stranger Peers disconnected: ",
      connectedStarngerPeers
    );
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

server.listen(port, () => console.log(`Server is listening at port: ${port}`));
