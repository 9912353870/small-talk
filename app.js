const express = require("express");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;

app.use(express.static("public"));

io.on("connect", (socket) => {
  console.log("Socket server is running..!", { id: socket.id });
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

server.listen(port, () => console.log(`Server is listening at port: ${port}`));
